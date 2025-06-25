import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});

// Middlewares de sécurité
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Express Authentication',
      version: '1.0.0',
      description: 'API d\'authentification avec Express, SQLite et Prisma',
      contact: {
        name: 'Support API',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de l\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur'
            },
            name: {
              type: 'string',
              description: 'Nom de l\'utilisateur'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Mot de passe (minimum 6 caractères)'
            },
            name: {
              type: 'string',
              description: 'Nom de l\'utilisateur'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email'
            },
            password: {
              type: 'string',
              description: 'Mot de passe'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            token: {
              type: 'string',
              description: 'Token JWT d\'authentification'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Détails des erreurs de validation'
            }
          }
        },
        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique du compte'
            },
            accountNumber: {
              type: 'string',
              description: 'Numéro de compte unique'
            },
            accountType: {
              type: 'string',
              enum: ['CHECKING', 'SAVINGS', 'BUSINESS'],
              description: 'Type de compte'
            },
            balance: {
              type: 'number',
              description: 'Solde du compte'
            },
            isActive: {
              type: 'boolean',
              description: 'Statut actif du compte'
            },
            userId: {
              type: 'integer',
              description: 'ID du propriétaire du compte'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID unique de la transaction'
            },
            amount: {
              type: 'number',
              description: 'Montant de la transaction'
            },
            type: {
              type: 'string',
              enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT'],
              description: 'Type de transaction'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
              description: 'Statut de la transaction'
            },
            description: {
              type: 'string',
              description: 'Description de la transaction'
            },
            reference: {
              type: 'string',
              description: 'Référence unique de la transaction'
            },
            fromAccountId: {
              type: 'integer',
              description: 'ID du compte source (optionnel)'
            },
            toAccountId: {
              type: 'integer',
              description: 'ID du compte destination (optionnel)'
            },
            userId: {
              type: 'integer',
              description: 'ID de l\'utilisateur qui a initié la transaction'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de la transaction'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // chemin vers les fichiers contenant les annotations Swagger
};

const specs = swaggerJsdoc(swaggerOptions);

// Route pour la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Express Authentication',
    documentation: `http://localhost:${PORT}/api-docs`,
    version: '1.0.0'
  });
});

// Endpoint de santé pour Docker healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion des erreurs globales
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
});

export default app;
