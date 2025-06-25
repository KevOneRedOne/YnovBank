package routes

import (
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

// Initialise toutes les routes de l’application
func SetupRoutes(r *gin.Engine, db *gorm.DB) {
    api := r.Group("/api")
    SetupAuthRoutes(api, db)
    // Tu pourras mettre RegisterBankRoutes(api, db) après pour les virements
}