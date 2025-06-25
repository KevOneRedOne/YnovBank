"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
class AuthController {
    /**
     * Inscription d'un nouvel utilisateur
     */
    static async register(req, res) {
        try {
            const userData = req.body;
            const user = await authService_1.default.createUser(userData);
            const { token } = await authService_1.default.authenticateUser({
                email: userData.email,
                password: userData.password
            });
            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                token,
                user
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
            });
        }
    }
    /**
     * Connexion d'un utilisateur
     */
    static async login(req, res) {
        try {
            const credentials = req.body;
            const { user, token } = await authService_1.default.authenticateUser(credentials);
            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                user
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur de connexion'
            });
        }
    }
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const user = await authService_1.default.getUserById(req.user.id);
            res.json({
                success: true,
                user
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Utilisateur non trouvé'
            });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map