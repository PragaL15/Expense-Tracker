package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/go-playground/validator/v10"

	"github.com/PragaL15/Expense-Tracker/internal/models"
	"github.com/PragaL15/Expense-Tracker/internal/database"
)

type catBudgetReq struct {
	CategoryID  string  `json:"category_id" validate:"required,uuid4"`
	Period      string  `json:"period" validate:"required"`
	BudgetLimit float64 `json:"budget_limit" validate:"required,gte=0"`
}

func UpsertCategoryBudget(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	var body catBudgetReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := validator.New().Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	var cb models.CategoryBudget
	tx := database.DB.Where("user_id = ? AND category_id = ? AND period = ?", uid, body.CategoryID, body.Period).First(&cb)
	if tx.Error != nil || cb.CatBudgetID == "" {
		cb = models.CategoryBudget{UserID: uid, CategoryID: body.CategoryID, Period: body.Period, BudgetLimit: body.BudgetLimit}
		if err := database.DB.Create(&cb).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	} else {
		cb.BudgetLimit = body.BudgetLimit
		if err := database.DB.Save(&cb).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
	}
	return c.JSON(cb)
}

func GetCategoryBudget(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	cid := c.Query("category_id")
	period := c.Query("period")
	if cid == "" || period == "" {
		return fiber.NewError(fiber.StatusBadRequest, "category_id and period required")
	}
	var cb models.CategoryBudget
	if err := database.DB.Where("user_id = ? AND category_id = ? AND period = ?", uid, cid, period).First(&cb).Error; err != nil {
		return fiber.ErrNotFound
	}
	return c.JSON(cb)
}
