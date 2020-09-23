var express = require('express');
var router = express.Router();
const { genericDBFunctions, getAutoIncrementValue} = require('../models/techInfo.js');
const { findOneUser } = require('../models/usersDBInterface.js');

const { redirectLogin } = require('../middleware/auth');

const mainTitle = 'Technical Service Support';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { 
    title: mainTitle,
    csrfToken: req.csrfToken()
    });
});

router.get('/autoinc', async function(req, res, next){
  await getAutoIncrementValue(db.autoIncrement, 'techInfo')
  .then(x => res.json(x))
  .catch(err => console.error(err))
})

router.get('/dashboard', redirectLogin,  async function(req, res, next){
  try {
    const user = await findOneUser({'_id': req.session.user.id})
    delete user.password
    res.render('dashboard', { 
      title: mainTitle,
      user: user,
      csrfToken: req.csrfToken()
      });
  } catch (error) {
    throw 'user not found'
  }
  
})



module.exports = router;