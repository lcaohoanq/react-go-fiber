package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lcaohoanq/react-go-fiber/database"
	"github.com/lcaohoanq/react-go-fiber/models"
)

type UserStats struct {
	TotalTodos     int64         `json:"totalTodos"`
	CompletedTodos int64         `json:"completedTodos"`
	PendingTodos   int64         `json:"pendingTodos"`
	CompletionRate float64       `json:"completionRate"`
	RecentTodos    []models.Todo `json:"recentTodos"`
}

func GetUserProfile(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(float64)

	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Get user statistics
	var stats UserStats

	// Total todos
	database.DB.Model(&models.Todo{}).Where("user_id = ?", userId).Count(&stats.TotalTodos)

	// Completed todos
	database.DB.Model(&models.Todo{}).Where("user_id = ? AND completed = ?", userId, true).Count(&stats.CompletedTodos)

	// Pending todos
	stats.PendingTodos = stats.TotalTodos - stats.CompletedTodos

	// Completion rate
	if stats.TotalTodos > 0 {
		stats.CompletionRate = float64(stats.CompletedTodos) / float64(stats.TotalTodos) * 100
	}

	// Recent todos (last 5)
	database.DB.Where("user_id = ?", userId).
		Order("created_at desc").
		Limit(5).
		Find(&stats.RecentTodos)

	return c.JSON(fiber.Map{
		"user":  user,
		"stats": stats,
	})
}
