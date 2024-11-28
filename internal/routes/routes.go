package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lcaohoanq/react-go-fiber/server/internal/handlers"
	"github.com/lcaohoanq/react-go-fiber/server/internal/middleware"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Public routes
	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)

	// Protected routes
	todos := api.Group("/todos")
	todos.Use(middleware.Protected())
	todos.Get("/", handlers.GetTodos)
	todos.Post("/", handlers.CreateTodo)
	todos.Patch("/:id", handlers.UpdateTodo)
	todos.Delete("/:id", handlers.DeleteTodo)

	api.Get("/profile", middleware.Protected(), handlers.GetUserProfile)
}
