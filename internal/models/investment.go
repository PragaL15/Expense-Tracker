package models

import "time"

type Investment struct {
	InvestmentID   string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"investment_id"`
	UserID         string    `gorm:"type:uuid;not null;index" json:"user_id"`
	Type           string    `gorm:"not null" json:"type"`
	AmountInvested float64   `gorm:"not null" json:"amount_invested"`
	CurrentValue   *float64  `json:"current_value,omitempty"`
	DateInvested   time.Time `gorm:"type:date;not null" json:"date_invested"`
	ReminderDate   *time.Time `json:"reminder_date,omitempty"`
	Notes          *string   `json:"notes,omitempty"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Investment) TableName() string { return "investments" }
