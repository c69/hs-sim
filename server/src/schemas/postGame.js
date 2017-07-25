/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/25/17.
 */
const Joi = require('joi')

module.exports = Joi.object().keys({
  type: Joi.string().required()
})
