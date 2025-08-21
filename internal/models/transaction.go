package models

import "time"

type Transaction struct {
	TransactionID   string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"transaction_id"`
	UserID          string    `gorm:"type:uuid;not null;index" json:"user_id"`
	CategoryID      string    `gorm:"type:uuid;not null;index" json:"category_id"`
	Amount          float64   `gorm:"not null" json:"amount"`
	TransactionType string    `gorm:"not null" json:"transaction_type"` // Income / Expense
	Date            time.Time `gorm:"type:date;not null;index" json:"date"`
	Notes           *string   `json:"notes,omitempty"`
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Transaction) TableName() string { return "transactions" }
