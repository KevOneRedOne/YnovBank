import { IUser, IRegisterRequest, ILoginRequest } from '../types';
declare class AuthService {
    /**
     * Créer un nouvel utilisateur
     */
    static createUser(userData: IRegisterRequest): Promise<Omit<IUser, 'password'>>;
    /**
     * Authentifier un utilisateur
     */
    static authenticateUser(credentials: ILoginRequest): Promise<{
        user: Omit<IUser, 'password'>;
        token: string;
    }>;
    /**
     * Obtenir un utilisateur par ID
     */
    static getUserById(userId: number): Promise<Omit<IUser, 'password'>>;
    /**
     * Générer un token JWT
     */
    private static generateToken;
    /**
     * Vérifier un token JWT
     */
    static verifyToken(token: string): {
        id: number;
        email: string;
        role: string;
    };
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map