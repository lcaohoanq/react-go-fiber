package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/lcaohoanq/react-go-fiber/internal/database"
	"github.com/lcaohoanq/react-go-fiber/internal/models"
)

func GetTodos(c *fiber.Ctx) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Locals("user_id").(float64)

	var todos []models.Todo
	result := database.DB.Where("user_id = ?", uint(userID)).Find(&todos)
	if result.Error != nil {
		log.Printf("Error fetching todos: %v", result.Error)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch todos",
		})
	}

	return c.JSON(todos)
}

func CreateTodo(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(float64)

	// Parse request body
	var input struct {
		Body string `json:"body"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid input",
		})
	}

	if input.Body == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Todo body cannot be empty",
		})
	}

	// Create new todo
	todo := models.Todo{
		Body:   input.Body,
		UserID: uint(userID),
	}

	result := database.DB.Create(&todo)
	if result.Error != nil {
		log.Printf("Error creating todo: %v", result.Error)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create todo",
		})
	}

	return c.Status(201).JSON(todo)
}

func UpdateTodo(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(float64)
	id := c.Params("id")

	var todo models.Todo
	// Find todo and check ownership
	if err := database.DB.Where("id = ? AND user_id = ?", id, uint(userID)).First(&todo).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found or unauthorized",
		})
	}

	todo.Completed = true
	if err := database.DB.Save(&todo).Error; err != nil {
		log.Printf("Error updating todo: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to update todo",
		})
	}

	return c.JSON(todo)
}

func DeleteTodo(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(float64)
	id := c.Params("id")

	var todo models.Todo
	// Find todo and check ownership
	if err := database.DB.Where("id = ? AND user_id = ?", id, uint(userID)).First(&todo).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found or unauthorized",
		})
	}

	if err := database.DB.Delete(&todo).Error; err != nil {
		log.Printf("Error deleting todo: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to delete todo",
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
