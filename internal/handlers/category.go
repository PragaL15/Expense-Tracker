package handlers

import (
    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"

    "github.com/PragaL15/Expense-Tracker/internal/database"
    "github.com/PragaL15/Expense-Tracker/internal/models"
)

type categoryReq struct {
    Name string  `json:"name" validate:"required"`
    Type string  `json:"type" validate:"required,oneof=Income Expense"`
    Icon *string `json:"icon,omitempty"`
}

// CreateCategory creates a new global category
func CreateCategory(c *fiber.Ctx) error {
    var body categoryReq
    if err := c.BodyParser(&body); err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "invalid JSON body")
    }

    if err := validate.Struct(body); err != nil {
        return fiber.NewError(fiber.StatusBadRequest, err.Error())
    }

    cat := models.Category{
        Name: body.Name,
        Type: body.Type,
        Icon: body.Icon,
    }

    if err := database.DB.Create(&cat).Error; err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "duplicate category name")
    }

    return c.Status(fiber.StatusCreated).JSON(cat)
}

// ListCategories returns all categories (global)
func ListCategories(c *fiber.Ctx) error {
    categoryType := c.Query("type")

    var cats []models.Category
    query := database.DB
    if categoryType != "" {
        query = query.Where("type = ?", categoryType)
    }

    if err := query.Order("name ASC").Find(&cats).Error; err != nil {
        return fiber.NewError(fiber.StatusInternalServerError, err.Error())
    }

    return c.JSON(cats)
}

// UpdateCategory updates a global category
func UpdateCategory(c *fiber.Ctx) error {
    id := c.Params("id")
    var body categoryReq
    if err := c.BodyParser(&body); err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "invalid JSON body")
    }

    if err := validate.Struct(body); err != nil {
        return fiber.NewError(fiber.StatusBadRequest, err.Error())
    }

    var cat models.Category
    if err := database.DB.First(&cat, "category_id = ?", id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            return fiber.ErrNotFound
        }
        return fiber.NewError(fiber.StatusInternalServerError, err.Error())
    }

    cat.Name = body.Name
    cat.Type = body.Type
    cat.Icon = body.Icon

    if err := database.DB.Save(&cat).Error; err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "duplicate category name")
    }

    return c.JSON(cat)
}

// DeleteCategory deletes a global category
func DeleteCategory(c *fiber.Ctx) error {
    id := c.Params("id")
    if err := database.DB.Delete(&models.Category{}, "category_id = ?", id).Error; err != nil {
        return fiber.NewError(fiber.StatusInternalServerError, err.Error())
    }

    return c.SendStatus(fiber.StatusNoContent)
}
