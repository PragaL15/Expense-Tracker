package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port            string
	AppEnv          string
	DatabaseURL     string
	JWTSecret       string
	JWTExpiresHours int
}

func Load() *Config {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ No .env file found, using system env vars")
	}

	dbURL := mustEnv("DATABASE_URL")

	port := getEnv("PORT", "8080")
	appEnv := getEnv("APP_ENV", "development")
	jwtSecret := mustEnv("JWT_SECRET")
	jwtExpStr := getEnv("JWT_EXPIRES_HOURS", "72")

	jwtExp, err := strconv.Atoi(jwtExpStr)
	if err != nil {
		log.Fatalf("❌ invalid JWT_EXPIRES_HOURS: %s", jwtExpStr)
	}

	return &Config{
		Port:            port,
		AppEnv:          appEnv,
		DatabaseURL:     dbURL,
		JWTSecret:       jwtSecret,
		JWTExpiresHours: jwtExp,
	}
}

func getEnv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func mustEnv(k string) string {
	v := os.Getenv(k)
	if v == "" {
		log.Fatalf("❌ missing required env var: %s", k)
	}
	return v
}
