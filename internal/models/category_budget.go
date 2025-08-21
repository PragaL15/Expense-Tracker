package models

import "time"

type CategoryBudget struct {
	CatBudgetID string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"cat_budget_id"`
	UserID      string    `gorm:"type:uuid;not null;index:uid_cid_period,unique" json:"user_id"`
	CategoryID  string    `gorm:"type:uuid;not null;index:uid_cid_period,unique" json:"category_id"`
	Period      string    `gorm:"type:varchar(7);not null;index:uid_cid_period,unique" json:"period"`
	BudgetLimit float64   `gorm:"not null" json:"budget_limit"`
	SpentAmount float64   `gorm:"not null;default:0" json:"spent_amount"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (CategoryBudget) TableName() string { return "category_budgets" }
