"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
class AuthService {
    /**
     * Créer un nouvel utilisateur
     */
    static async createUser(userData) {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await database_1.default.user.findUnique({
            where: { email: userData.email }
        });
        if (existingUser) {
            throw new Error('Un utilisateur avec cette adresse email existe déjà');
        }
        // Hasher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, saltRounds);
        // Créer l'utilisateur
        const user = await database_1.default.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                name: userData.name || null
            }
        });
        // Retourner l'utilisateur sans le mot de passe
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    /**
     * Authentifier un utilisateur
     */
    static async authenticateUser(credentials) {
        // Trouver l'utilisateur
        const user = await database_1.default.user.findUnique({
            where: { email: credentials.email }
        });
        if (!user) {
            throw new Error('Email ou mot de passe incorrect');
        }
        // Vérifier si l'utilisateur est actif
        if (!user.isActive) {
            throw new Error('Compte désactivé');
        }
        // Vérifier le mot de passe
        const isValidPassword = await bcryptjs_1.default.compare(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Email ou mot de passe incorrect');
        }
        // Générer le token JWT
        const token = this.generateToken(user);
        // Retourner l'utilisateur sans le mot de passe et le token
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    /**
     * Obtenir un utilisateur par ID
     */
    static async getUserById(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        if (!user.isActive) {
            throw new Error('Compte désactivé');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    /**
     * Générer un token JWT
     */
    static generateToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET n\'est pas défini');
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        // Assertion de type pour contourner le problème de typage
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });
    }
    /**
     * Vérifier un token JWT
     */
    static verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET n\'est pas défini');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new Error('Token invalide');
        }
    }
}
exports.default = AuthService;
//# sourceMappingURL=authService.js.map