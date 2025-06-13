package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Middleware pour ajouter la version dans les headers
	r.Use(func(c *gin.Context) {
		c.Header("X-API-Version", Version)
		c.Next()
	})

	// Endpoint pour vérifier la version
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

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}