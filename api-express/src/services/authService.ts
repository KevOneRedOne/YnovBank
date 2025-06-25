import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { IUser, IRegisterRequest, ILoginRequest } from '../types';

class AuthService {
  
  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(userData: IRegisterRequest): Promise<Omit<IUser, 'password'>> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Un utilisateur avec cette adresse email existe déjà');
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Créer l'utilisateur
    const user = await prisma.user.create({
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
  static async authenticateUser(credentials: ILoginRequest): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
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
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
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
  static async getUserById(userId: number): Promise<Omit<IUser, 'password'>> {
    const user = await prisma.user.findUnique({
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
  private static generateToken(user: IUser): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET n\'est pas défini');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Assertion de type pour contourner le problème de typage
    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
    } as any);
  }

  /**
   * Vérifier un token JWT
   */
  static verifyToken(token: string): { id: number; email: string; role: string } {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET n\'est pas défini');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number; email: string; role: string };
      return decoded;
    } catch (error) {
      throw new Error('Token invalide');
    }
  }
}

export default AuthService;
