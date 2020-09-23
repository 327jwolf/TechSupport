const { body, check } = require('express-validator')


const schema = [
    body('firstname').notEmpty()
    .trim()
    .isString()
    .isLength({ min: 2 })
    // .custom((val, {req}) => { val.match(/[A-Za-z\.\'\-0-9]+/)})
    .withMessage('must be at least 2 characters and contain only letters, numbers and (-.\')'),
  
    body('lastname').notEmpty()
    .trim()
    .isString()
    .isLength({ min: 2 })
    // .custom((val, {req}) => { val.match(/[A-Za-z\.\'\-0-9]+/)})
    .withMessage('must be at least 2 characters and contain only letters, numbers and (-.\')'),
  
    body('email').notEmpty()
    .trim()
    .isEmail()
    // .custom((val, {req}) => { val.toString().includes('oasiscws.com')})
    .withMessage('must be a valid email address in the oasiscws.com domain'),
    body('password').notEmpty()
    .trim()
    .isLength({ min: 5 })
    .withMessage('password must be at least 5 charactors'),
  
    body('confirmpassword').notEmpty()
    .trim()
    .isLength({ min: 5 })
    .withMessage('confirm password must match password'),
  
    check('confirmpassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password))
  ]

module.exports = {
    schema,
    }