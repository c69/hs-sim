/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/25/17.
 */
const VError = require('verror')
const Joi = require('joi')
const debug = require('debug')('hs:validate')
const httpStatus = require('http-status-codes')

module.exports = function validate (schema) {
  if (!schema.validate) {
    debug('Expected "joi" schema object.', schema)
    throw new VError('Expected JOI schema with validate function')
  }

  return function validator (req, res, next) {
    const result = Joi.validate(req.body, schema)
    if (result.error) {
      return res.status(httpStatus.BAD_REQUEST).send({message: 'Validation error', error: result.error})
    }
    next()
  }
}
