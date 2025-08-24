package handlers

import (
	"github.com/PragaL15/Expense-Tracker/internal/database"
	"github.com/PragaL15/Expense-Tracker/internal/models"
	"github.com/gofiber/fiber/v2"
)

type CategoryBreakdown struct {
	CategoryID string  `json:"category_id"`
	Category   string  `json:"category"`
	Total      float64 `json:"total"`
}

type SummaryResponse struct {
	Income       float64            `json:"income"`
	Expenses     float64            `json:"expenses"`
	Balance      float64            `json:"balance"`
	IncomeByCat  []CategoryBreakdown `json:"income_by_category"`
	ExpenseByCat []CategoryBreakdown `json:"expense_by_category"`
}

func GetSummary(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)

	var income, expenses float64

	// Sum of Income
	if err := database.DB.
		Model(&models.Transaction{}).
		Where("user_id = ? AND transaction_type = ?", uid, "Income").
		Select("COALESCE(SUM(amount),0)").Scan(&income).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Sum of Expense
	if err := database.DB.
		Model(&models.Transaction{}).
		Where("user_id = ? AND transaction_type = ?", uid, "Expense").
		Select("COALESCE(SUM(amount),0)").Scan(&expenses).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Income breakdown by category
	var incomeByCategory []CategoryBreakdown
	if err := database.DB.
		Table("transactions t").
		Select("t.category_id, c.name as category, COALESCE(SUM(t.amount),0) as total").
		Joins("JOIN categories c ON t.category_id = c.category_id").
		Where("t.user_id = ? AND t.transaction_type = ?", uid, "Income").
		Group("t.category_id, c.name").
		Scan(&incomeByCategory).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Expense breakdown by category
	var expenseByCategory []CategoryBreakdown
	if err := database.DB.
		Table("transactions t").
		Select("t.category_id, c.name as category, COALESCE(SUM(t.amount),0) as total").
		Joins("JOIN categories c ON t.category_id = c.category_id").
		Where("t.user_id = ? AND t.transaction_type = ?", uid, "Expense").
		Group("t.category_id, c.name").
		Scan(&expenseByCategory).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	balance := income - expenses

	return c.JSON(SummaryResponse{
		Income:       income,
		Expenses:     expenses,
		Balance:      balance,
		IncomeByCat:  incomeByCategory,
		ExpenseByCat: expenseByCategory,
	})
}
