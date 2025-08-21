package models

import "time"

type User struct {
	UserID       string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"user_id"`
	Name         string    `gorm:"not null" json:"name"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (User) TableName() string { return "users" }
