package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/lcaohoanq/react-go-fiber/database"
	"github.com/lcaohoanq/react-go-fiber/handlers"
	"github.com/lcaohoanq/react-go-fiber/middleware"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to database
	database.Connect()

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			log.Printf("Error: %v", err)
			return c.Status(500).JSON(fiber.Map{
				"error": "Internal server error",
			})
		},
	})

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// Routes
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

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
