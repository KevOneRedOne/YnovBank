import Joi from 'joi';

// Test registrationSchema
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

// Test transactionSchema
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

console.log('=== Test registration vide ===');
const regResult = registrationSchema.validate({});
console.log('Erreurs:', regResult.error?.details.map(d => d.message));

console.log('\n=== Test withdrawal sans fromAccountId ===');
const withdrawalResult = transactionSchema.validate({
  type: 'WITHDRAWAL',
  amount: 100
});
console.log('Erreurs:', withdrawalResult.error?.details.map(d => d.message));

console.log('\n=== Test deposit sans toAccountId ===');
const depositResult = transactionSchema.validate({
  type: 'DEPOSIT',
  amount: 100
});
console.log('Erreurs:', depositResult.error?.details.map(d => d.message));

console.log('\n=== Test transfer incomplet ===');
const transferResult = transactionSchema.validate({
  type: 'TRANSFER',
  fromAccountId: 1,
  amount: 100
});
console.log('Erreurs:', transferResult.error?.details.map(d => d.message));
