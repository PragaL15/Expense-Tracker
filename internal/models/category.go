package models

import "time"

type Category struct {
	CategoryID string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"category_id"`
	UserID     string    `gorm:"type:uuid;not null;index:uid_name,unique" json:"user_id"`
	Name       string    `gorm:"not null;index:uid_name,unique" json:"name"`
	Type       string    `gorm:"not null" json:"type"` // Income / Expense
	Icon       *string   `json:"icon,omitempty"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Category) TableName() string { return "categories" }
