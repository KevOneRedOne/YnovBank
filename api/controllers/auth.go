package controllers

import (
    "api/models"
    "gorm.io/gorm"
    "net/http"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
)

// Gère l’inscription utilisateur
// Register godoc
// @Summary      S'inscrire
// @Description  Crée un nouvel utilisateur avec email, nom, mot de passe et solde par défaut
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        user  body  object{email=string,name=string,password=string}  true  "Utilisateur à enregistrer"
// @Success      200   {object}  map[string]string  "Utilisateur créé"
// @Failure      400   {object}  map[string]string  "Entrée invalide"
// @Failure      500   {object}  map[string]string  "Email déjà utilisé"
// @Router       /register [post]
func Register(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var input struct {
            Name, Email, Password string
        }
        if c.BindJSON(&input) != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }
        hashedPass, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 14)
        user := models.User{Name: input.Name, Email: input.Email, Password: string(hashedPass), Balance: 1000}
        if err := db.Create(&user).Error; err != nil {
            c.JSON(500, gin.H{"error": "Email already in use"})
            return
        }
        c.JSON(200, gin.H{"message": "User created!"})
    }
}

// Gère la connexion utilisateur
// Login godoc
// @Summary      Se connecter
// @Description  Authentifie un utilisateur avec email et mot de passe
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        credentials  body  object{email=string,password=string}  true  "Identifiants de connexion"
// @Success      200   {object}  map[string]string  "Connexion OK ou JWT"
// @Failure      401   {object}  map[string]string  "Identifiants incorrects"
// @Router       /login [post]
func Login(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var input struct {
            Email, Password string
        }
        if c.BindJSON(&input) != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }
        var user models.User
        if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong credentials"})
            return
        }
        if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)) != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong credentials"})
            return
        }
        // Ici tu peux générer un JWT (on le rajoutera)
        c.JSON(200, gin.H{"message": "Login OK!"})
    }
}
