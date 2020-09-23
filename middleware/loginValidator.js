const { body, check} = require('express-validator')


const schema = [
    body('email').notEmpty()
    .trim()
    .isEmail()
    .withMessage('must be a valid email address'),
    check('email', 'must be a valid email address in the oasiscws.com domain').custom((val, {req}) => { 
        return val.includes('oasiscws.com')
    }),
    body('password').notEmpty()
    .trim()
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 charactors'),
    // check('confirmpassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password))
  ]

module.exports = {
    schema
    }