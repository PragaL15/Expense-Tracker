package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/go-playground/validator/v10"
	"github.com/PragaL15/Expense-Tracker/internal/models"
	"github.com/PragaL15/Expense-Tracker/internal/database"
)

type txReq struct {
	CategoryID      string   `json:"category_id" validate:"required,uuid4"`
	Amount          float64  `json:"amount" validate:"required,gte=0"`
	TransactionType string   `json:"transaction_type" validate:"required,oneof=Income Expense"`
	Date            string   `json:"date" validate:"required"` // YYYY-MM-DD
	Notes           *string  `json:"notes"`
}

func MonthPeriod(t time.Time) string {
	return t.UTC().Format("2006-01")
}

func CreateTransaction(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)

	var body txReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := validator.New().Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	d, err := time.Parse("2006-01-02", body.Date)
	if err != nil { return fiber.NewError(fiber.StatusBadRequest, "invalid date") }

	tx := models.Transaction{
		UserID: uid, CategoryID: body.CategoryID, Amount: body.Amount,
		TransactionType: body.TransactionType, Date: d, Notes: body.Notes,
	}
	if err := database.DB.Create(&tx).Error; err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	// Update aggregates for budgets
	updateBudgetSpent(uid, d)
	updateCategoryBudgetSpent(uid, body.CategoryID, d)

	return c.Status(fiber.StatusCreated).JSON(tx)
}

func ListTransactions(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	var list []models.Transaction

	q := database.DB.Where("user_id = ?", uid)
	if t := c.Query("type"); t != "" {
		q = q.Where("transaction_type = ?", t)
	}
	if cid := c.Query("category_id"); cid != "" {
		q = q.Where("category_id = ?", cid)
	}
	if from := c.Query("from"); from != "" {
		if d, err := time.Parse("2006-01-02", from); err == nil {
			q = q.Where("date >= ?", d)
		}
	}
	if to := c.Query("to"); to != "" {
		if d, err := time.Parse("2006-01-02", to); err == nil {
			q = q.Where("date <= ?", d)
		}
	}

	if err := q.Order("date DESC, created_at DESC").Find(&list).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(list)
}

func UpdateTransaction(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	id := c.Params("id")

	var existing models.Transaction
	if err := database.DB.Where("transaction_id = ? AND user_id = ?", id, uid).First(&existing).Error; err != nil {
		return fiber.ErrNotFound
	}

	var body txReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := validator.New().Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	d, err := time.Parse("2006-01-02", body.Date)
	if err != nil { return fiber.NewError(fiber.StatusBadRequest, "invalid date") }

	// Old references for recompute later
	oldDate := existing.Date
	oldCat := existing.CategoryID

	existing.CategoryID = body.CategoryID
	existing.Amount = body.Amount
	existing.TransactionType = body.TransactionType
	existing.Date = d
	existing.Notes = body.Notes

	if err := database.DB.Save(&existing).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// recompute for old and new periods/categories
	updateBudgetSpent(uid, oldDate)
	updateBudgetSpent(uid, d)
	updateCategoryBudgetSpent(uid, oldCat, oldDate)
	updateCategoryBudgetSpent(uid, body.CategoryID, d)

	return c.JSON(existing)
}

func DeleteTransaction(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	id := c.Params("id")

	var existing models.Transaction
	if err := database.DB.Where("transaction_id = ? AND user_id = ?", id, uid).First(&existing).Error; err != nil {
		return fiber.ErrNotFound
	}
	if err := database.DB.Delete(&existing).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	updateBudgetSpent(uid, existing.Date)
	updateCategoryBudgetSpent(uid, existing.CategoryID, existing.Date)

	return c.SendStatus(fiber.StatusNoContent)
}

// --- aggregations ---

func updateBudgetSpent(userID string, date time.Time) {
	period := MonthPeriod(date)
	var total float64
	database.DB.
		Table("transactions").
		Where("user_id = ? AND transaction_type = 'Expense' AND to_char(date,'YYYY-MM') = ?", userID, period).
		Select("COALESCE(SUM(amount),0)").
		Scan(&total)

	// upsert into budgets (if missing, create with 0 budget)
	var b models.Budget
	if err := database.DB.Where("user_id = ? AND period = ?", userID, period).First(&b).Error; err != nil {
		b = models.Budget{
			UserID: userID, Period: period, TotalBudget: 0, TotalSpent: total,
		}
		database.DB.Create(&b)
	} else {
		b.TotalSpent = total
		database.DB.Save(&b)
	}
}

func updateCategoryBudgetSpent(userID, categoryID string, date time.Time) {
	period := MonthPeriod(date)
	var total float64
	database.DB.
		Table("transactions").
		Where("user_id = ? AND category_id = ? AND transaction_type = 'Expense' AND to_char(date,'YYYY-MM') = ?",
			userID, categoryID, period).
		Select("COALESCE(SUM(amount),0)").
		Scan(&total)

	// upsert into category_budgets (if missing, create with 0 limit)
	var cb models.CategoryBudget
	if err := database.DB.
		Where("user_id = ? AND category_id = ? AND period = ?", userID, categoryID, period).
		First(&cb).Error; err != nil {
		cb = models.CategoryBudget{
			UserID: userID, CategoryID: categoryID, Period: period, BudgetLimit: 0, SpentAmount: total,
		}
		database.DB.Create(&cb)
	} else {
		cb.SpentAmount = total
		database.DB.Save(&cb)
	}
}
