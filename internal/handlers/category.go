package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/PragaL15/Expense-Tracker/internal/database"
	"github.com/PragaL15/Expense-Tracker/internal/models"
)

type categoryReq struct {
	Name string  `json:"name" validate:"required"` // Mark as required
	Type string  `json:"type" validate:"required,oneof=Income Expense"`
	Icon *string `json:"icon,omitempty"`
}

// CreateCategory creates a new category for the authenticated user
func CreateCategory(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(string)
	if !ok || uid == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid user context")
	}

	var body categoryReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid JSON body")
	}

	// Validate inputs
	if err := validate.Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	cat := models.Category{
		UserID: uid,
		Name:   body.Name,
		Type:   body.Type,
		Icon:   body.Icon,
	}

	if err := database.DB.Create(&cat).Error; err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "duplicate category name for this user")
	}

	// Return full category object
	return c.Status(fiber.StatusCreated).JSON(cat)
}

// ListCategories returns all categories belonging to the authenticated user
// Accepts optional query param: ?type=Income or ?type=Expense
func ListCategories(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(string)
	if !ok || uid == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid user context")
	}

	categoryType := c.Query("type")

	var cats []models.Category
	query := database.DB.Where("user_id = ?", uid)
	if categoryType != "" {
		query = query.Where("type = ?", categoryType)
	}

	if err := query.Order("name ASC").Find(&cats).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Will return array of full category objects including `name`
	return c.JSON(cats)
}

// UpdateCategory updates a category for the authenticated user
func UpdateCategory(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(string)
	if !ok || uid == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid user context")
	}

	id := c.Params("id")
	var body categoryReq
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid JSON body")
	}

	if err := validate.Struct(body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	var cat models.Category
	if err := database.DB.Where("category_id = ? AND user_id = ?", id, uid).First(&cat).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return fiber.ErrNotFound
		}
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	cat.Name = body.Name
	cat.Type = body.Type
	cat.Icon = body.Icon

	if err := database.DB.Save(&cat).Error; err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "duplicate category name for this user")
	}

	return c.JSON(cat)
}

// DeleteCategory deletes a category for the authenticated user
func DeleteCategory(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(string)
	if !ok || uid == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid user context")
	}

	id := c.Params("id")
	if err := database.DB.Where("category_id = ? AND user_id = ?", id, uid).Delete(&models.Category{}).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}
