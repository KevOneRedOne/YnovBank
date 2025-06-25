import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est requis'
  }),
  name: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis'
  })
});

const accountSchema = Joi.object({
  accountType: Joi.string().valid('CHECKING', 'SAVINGS', 'BUSINESS').default('CHECKING'),
  initialBalance: Joi.number().min(0).default(0)
});

const transactionSchema = Joi.object({
  fromAccountId: Joi.number().integer().positive().optional(),
  toAccountId: Joi.number().integer().positive().optional(),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Le montant doit être positif',
    'any.required': 'Le montant est requis'
  }),
  type: Joi.string().valid('DEPOSIT', 'WITHDRAWAL', 'TRANSFER').required().messages({
    'any.only': 'Le type de transaction doit être DEPOSIT, WITHDRAWAL ou TRANSFER',
    'any.required': 'Le type de transaction est requis'
  }),
  description: Joi.string().optional()
}).custom((value, helpers) => {
  if (value.type === 'TRANSFER' && (!value.fromAccountId || !value.toAccountId)) {
    return helpers.error('any.custom', { message: 'fromAccountId et toAccountId sont requis pour un transfer' });
  }
  if (value.type === 'WITHDRAWAL' && !value.fromAccountId) {
    return helpers.error('any.custom', { message: 'fromAccountId est requis pour un retrait' });
  }
  if (value.type === 'DEPOSIT' && !value.toAccountId) {
    return helpers.error('any.custom', { message: 'toAccountId est requis pour un dépôt' });
  }
  return value;
});

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = registrationSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: error.details.map(detail => detail.message)
    });
    return;
  }
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: error.details.map(detail => detail.message)
    });
    return;
  }
  
  next();
};

export const validateAccount = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = accountSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: error.details.map(detail => detail.message)
    });
    return;
  }
  
  next();
};

export const validateTransaction = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = transactionSchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: error.details.map(detail => detail.message)
    });
    return;
  }
  
  next();
};
