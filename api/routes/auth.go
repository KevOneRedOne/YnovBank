package routes

import (
    "github.com/gin-gonic/gin"
    "api/controllers"
    "gorm.io/gorm"
)

func SetupAuthRoutes(r *gin.RouterGroup, db *gorm.DB) {
    r.POST("/register", controllers.Register(db))
    r.POST("/login", controllers.Login(db))
}