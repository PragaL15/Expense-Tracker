package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/go-playground/validator/v10"

	"github.com/PragaL15/Expense-Tracker/internal/models"
	"github.com/PragaL15/Expense-Tracker/internal/database"
)

type categoryReq struct {
	Name string  `json:"name" validate:"required"`
	Type string  `json:"type" validate:"required,oneof=Income Expense"`
	Icon *string `json:"icon"`
}

func CreateCategory(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	var body categoryReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := validator.New().Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	cat := models.Category{
		UserID: uid, Name: body.Name, Type: body.Type, Icon: body.Icon,
	}
	if err := database.DB.Create(&cat).Error; err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "duplicate category name for this user")
	}
	return c.Status(fiber.StatusCreated).JSON(cat)
}

func ListCategories(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	var cats []models.Category
	if err := database.DB.Where("user_id = ?", uid).Order("name ASC").Find(&cats).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(cats)
}

func UpdateCategory(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	id := c.Params("id")
	var body categoryReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	var cat models.Category
	if err := database.DB.Where("category_id = ? AND user_id = ?", id, uid).First(&cat).Error; err != nil {
		return fiber.ErrNotFound
	}
	cat.Name, cat.Type, cat.Icon = body.Name, body.Type, body.Icon
	if err := database.DB.Save(&cat).Error; err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "duplicate category name for this user")
	}
	return c.JSON(cat)
}

func DeleteCategory(c *fiber.Ctx) error {
	uid := c.Locals("user_id").(string)
	id := c.Params("id")
	if err := database.DB.Where("category_id = ? AND user_id = ?", id, uid).Delete(&models.Category{}).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.SendStatus(fiber.StatusNoContent)
}
