const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const router = express.Router();

const { addUser, findUserbyEmail } = require('../../models/usersDBInterface.js');

const { schema: registrationSchema } = require('../../middleware/registerValidator.js');
const { schema: loginSchema } = require('../../middleware/loginValidator.js');
const { redirectLogin } = require('../../middleware/auth');

const mainTitle = 'Technical Service Support';

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', async function(req, res, next){
  if(req.session.user) {
    return res.redirect('/dashboard')
  }
  res.render('login',{ 
    title: mainTitle,
    // csrfToken: req.csrfToken()
  })
})

function isObject(params) {
  return new Promise((resolve, reject) => {
      Object.keys(params).forEach((v, i) => {
          if (typeof params[v] === 'object') return reject(false)
      })
      resolve(true)
  })
}

router.post('/login', loginSchema, async function(req, res, next){
   let { email } = req.body
//   isObject({email, password})
//  .then(x => console.log(x)).catch(e => console.log(e))
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.render('login', {
          title: mainTitle,
          // csrfToken: req.csrfToken(),
          'error': errors.array().map(x => x.msg).join(',\n')//.toString()
        })
         
    }
  } catch (error) {
    console.log('POST /login',error)
  }

  try {
    const user = await findUserbyEmail(email)

    if (user === null || !bcrypt.compareSync(req.body.password, user.password)) {
      let error = 'Oops, There is something wrong with your email or password. Please, try again'
      return res.render('login', {
        title: mainTitle,
        // csrfToken: req.csrfToken(),
        'error': error
      })
    } else {
      const sessionUser = {
        'id': user._id,
        'role': user.role,
        'active':user.active
      }
      req.session.user = sessionUser
      res.redirect(301, '/dashboard')
      return
    }
  } catch (error) {
    console.log('Post /login finduser', error)
  }
})

router.get('/register', async function(req, res, next){
  if(req.session.user) {
    res.redirect('/dashboard')
    return
  }
  res.render('register',{ 
    title: mainTitle,
    csrfToken: req.csrfToken(),
    error: ""
  })
})


router.post('/register', registrationSchema, async function(req, res, next){
  let hash;
  let result;
  let errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
        res.render('register', {
          title: mainTitle,
          // csrfToken: req.csrfToken(),
          'error': errors.array().map(x => x.msg).join(',\n')//.toString()
        })
        return 
    }
  } catch (error) {
    console.log(error)
  }

  // TODO Maybe send email to verify user .... look this up
  try {
    const useremail = await findUserbyEmail(req.body.email)
    if (useremail != null) {
      let error = 'User already exists. Please try again'
      res.render('register', {
        title: mainTitle,
        // csrfToken: req.csrfToken(),
        'error': error
      })
      return
    }
  } catch (error) {
    console.log(error)
  }
 
  try {
    hash = await bcrypt.hash(req.body.password, 10)
  } catch (error) {
    console.log(error);
  }
  
  const registerUser ={
    'firstname': req.body.firstname,
    'lastname': req.body.lastname,
    'email': req.body.email,
    'password': hash,
    'active': true,
    'role': 'user',
  }

  try {
    
    result = await addUser(registerUser)
  } catch (error) {
    console.log(error)
  }

  delete result.password
  const user = {
    'id': result._id,
    'role': result.role,
    'active':result.active
  }
  req.session.user = user
  res.redirect(`/dashboard`)
  
})

router.post('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.redirect('/dashboard')
    }
    res.clearCookie('sid')
    res.redirect('login')
  })
})

module.exports = router;
