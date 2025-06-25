"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = exports.validateAccount = exports.validateLogin = exports.validateRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const registrationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Format d\'email invalide',
        'any.required': 'L\'email est requis'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
        'any.required': 'Le mot de passe est requis'
    }),
    name: joi_1.default.string().optional()
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Format d\'email invalide',
        'any.required': 'L\'email est requis'
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Le mot de passe est requis'
    })
});
const accountSchema = joi_1.default.object({
    accountType: joi_1.default.string().valid('CHECKING', 'SAVINGS', 'BUSINESS').default('CHECKING'),
    initialBalance: joi_1.default.number().min(0).default(0)
});
const transactionSchema = joi_1.default.object({
    fromAccountId: joi_1.default.number().integer().positive().optional(),
    toAccountId: joi_1.default.number().integer().positive().optional(),
    amount: joi_1.default.number().positive().required().messages({
        'number.positive': 'Le montant doit être positif',
        'any.required': 'Le montant est requis'
    }),
    type: joi_1.default.string().valid('DEPOSIT', 'WITHDRAWAL', 'TRANSFER').required().messages({
        'any.only': 'Le type de transaction doit être DEPOSIT, WITHDRAWAL ou TRANSFER',
        'any.required': 'Le type de transaction est requis'
    }),
    description: joi_1.default.string().optional()
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
const validateRegistration = (req, res, next) => {
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
exports.validateRegistration = validateRegistration;
const validateLogin = (req, res, next) => {
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
exports.validateLogin = validateLogin;
const validateAccount = (req, res, next) => {
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
exports.validateAccount = validateAccount;
const validateTransaction = (req, res, next) => {
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
exports.validateTransaction = validateTransaction;
//# sourceMappingURL=validation.js.map