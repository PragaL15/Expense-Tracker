package models

import "time"

type Budget struct {
	BudgetID    string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"budget_id"`
	UserID      string    `gorm:"type:uuid;not null;index:uid_period,unique" json:"user_id"`
	Period      string    `gorm:"type:varchar(7);not null;index:uid_period,unique" json:"period"` // YYYY-MM
	TotalBudget float64   `gorm:"not null" json:"total_budget"`
	TotalSpent  float64   `gorm:"not null;default:0" json:"total_spent"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Budget) TableName() string { return "budgets" }
