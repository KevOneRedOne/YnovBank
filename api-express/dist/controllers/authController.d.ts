import { Request, Response } from 'express';
import { IAuthenticatedRequest } from '../types';
declare class AuthController {
    /**
     * Inscription d'un nouvel utilisateur
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * Connexion d'un utilisateur
     */
    static login(req: Request, res: Response): Promise<void>;
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    static getProfile(req: IAuthenticatedRequest, res: Response): Promise<void>;
}
export default AuthController;
//# sourceMappingURL=authController.d.ts.map