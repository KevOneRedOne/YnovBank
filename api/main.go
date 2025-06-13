package main

import (
	_ "api/docs" // important pour l'initialisation du package docs
	"api/models"
	"api/routes"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Initialisation de la base de données
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&models.User{})

	r := gin.Default()

	// Middleware pour ajouter la version dans les headers
	r.Use(func(c *gin.Context) {
		c.Header("X-API-Version", Version)
		c.Next()
	})

	// Routes pour vérifier la version et le health check
	r.GET("/version", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"version": Version,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"version": Version,
		})
	})

	// Route Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Configuration des routes métier
	routes.SetupRoutes(r, db)

	r.Run(":8080")
}