package models

import "time"

type Category struct {
	CategoryID string     `json:"category_id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID     string     `json:"user_id"`
	Name       string     `json:"name"`
	Type       string     `json:"type"` // "Income" or "Expense"
	Icon       *string    `json:"icon,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}
