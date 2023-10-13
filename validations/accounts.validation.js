const joi = require('joi');

const createAccountSchema = joi.object({
  user_id: joi.number().required(),
  bank_name: joi.string().required(),
  bank_account_number: joi.string().required(),
  balance: joi.number().required(),
});

module.exports = {
  createAccountSchema,
};
