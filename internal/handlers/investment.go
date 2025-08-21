package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/go-playground/validator/v10"

	"github.com/PragaL15/Expense-Tracker/internal/models"
	"github.com/PragaL15/Expense-Tracker/internal/database"
)

type invReq struct {
	Type           string   `json:"type" validate:"required"`
	AmountInvested float64  `json:"amount_invested" validate:"required,gte=0"`
	CurrentValue   *float64 `json:"current_value"`
	DateInvested   string   `json:"date_invested" validate:"required"` // YYYY-MM-DD
	ReminderDate   *string  `json:"reminder_date"`
	Notes          *string  `json:"notes"`
}

func CreateInvestment(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	var body invReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := validator.New().Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	di, err := time.Parse("2006-01-02", body.DateInvested)
	if err != nil { return fiber.NewError(fiber.StatusBadRequest, "invalid date_invested") }
	var rd *time.Time
	if body.ReminderDate != nil && *body.ReminderDate != "" {
		t, err := time.Parse("2006-01-02", *body.ReminderDate)
		if err != nil { return fiber.NewError(fiber.StatusBadRequest, "invalid reminder_date") }
		rd = &t
	}
	inv := models.Investment{
		UserID: uid, Type: body.Type, AmountInvested: body.AmountInvested,
		CurrentValue: body.CurrentValue, DateInvested: di, ReminderDate: rd, Notes: body.Notes,
	}
	if err := database.DB.Create(&inv).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.Status(fiber.StatusCreated).JSON(inv)
}

func ListInvestments(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	var list []models.Investment
	if err := database.DB.Where("user_id = ?", uid).Order("date_invested DESC").Find(&list).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(list)
}
