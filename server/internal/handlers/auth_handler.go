package handlers

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/lcaohoanq/react-go-fiber/internal/models"
	"github.com/lcaohoanq/react-go-fiber/pkg/database"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	input := new(RegisterInput)

	if err := c.BodyParser(input); err != nil {
		log.Printf("Error parsing input: %v", err)
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid input format",
		})
	}

	// Validate input
	if input.Name == "" || input.Email == "" || input.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	// Check if email already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Email already exists",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	// Create user
	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
		Role:     models.MEMBER,
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		log.Printf("Error creating user: %v", result.Error)
		return c.Status(500).JSON(fiber.Map{
			"error": "Could not create user",
		})
	}

	// Check if JWT_SECRET is set
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Printf("JWT_SECRET not set")
		return c.Status(500).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	// Generate JWT token
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	// Return user data (excluding password) and token
	return c.Status(201).JSON(fiber.Map{
		"token": t,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	input := new(LoginInput)

	if err := c.BodyParser(input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid input",
		})
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid password",
		})
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"token": t,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
