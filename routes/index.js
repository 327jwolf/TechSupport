var express = require('express');
var router = express.Router();
const { getAutoIncrementValue, insertTechInfo, insertTechInfoSub, findAllTechInfo, findAllTechInfoSubbyTickerNumber, findAllTechInfoSub } = require('../models/techInfoInterface.js');
const { findOneUser } = require('../models/usersDBInterface.js');
const { insertContact } = require('../models/techContactsInterface.js');
// const { countryCodes } = require('../middleware/countryCodes.js');
const { codeArray: countryCodes2 } = require('../middleware/countryCodes2.js');
const { redirectLogin } = require('../middleware/auth');

const mainTitle = 'Technical Service Support';
let countryCodes = {}

countryCodes2.sort((a, b) => {
  var nameA = a.Name.toUpperCase(); 
  var nameB = b.Name.toUpperCase(); 
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
})
.forEach((el) =>{
  let b = el.Name
  delete el.Name
  let a = {... el}
  if(!a.Dial.startsWith('+')){
    a.Dial = `+ ${a.Dial}`
  }
  countryCodes[b] = a
})

// console.log(countryCodes)

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
    const techInfo = await findAllTechInfo()
    techInfo.sort((a,b) => {
      var ticketnumberA = parseInt(a.ticketnumber); 
      var ticketnumberB = parseInt(b.ticketnumber); 
      if (ticketnumberA < ticketnumberB) {
        return 1;
      }
      if (ticketnumberA > ticketnumberB) {
        return -1;
      }
      return 0;
    })
    const techInfoSubs = await findAllTechInfoSub()
    //   techInfo.map(async (doc) => {
    //     let tInfoSub = await findAllTechInfoSubbyTickerNumber(doc.ticketnumber).catch(e => console.error('Error finding by ticket number', e))
    //     return tInfoSub
    //   }
    // ))
    // let obj = []

    // techInfoSubs.forEach(x => {
    //   let y = x[0].ticketnumber
    //   let z = {...x}
    //   delete z.ticketnumber
    //   obj.push({y, ...z})
    // })

    // console.log(techInfoSubs)

    res.render('dashboard', { 
      title: mainTitle,
      user: user,
      csrfToken: req.csrfToken(),
      countryCodes: countryCodes,
      techInfo: techInfo,
      techInfoSub: techInfoSubs,
      });
  } catch (error) {
    console.error('/dashboard', error)
    throw 'user not found'
  }
  
})

router.post('/dashboard', async function(req, res, next){
  let date = new Date(req.body['createdAt'])
  try {
    const contact = await insertContact({
      'contactname': req.body.contactname,
      'contactcc': req.body.cc,
      'contactphone': req.body.contactphone,
      'email': req.body.email,
      'address': req.body.address,
      'city': req.body.city,
      'state': req.body.state,
      'country': req.body.country,
      'zip': req.body.zip,
      })
     console.log(contact) 
  } catch (error) {
    console.error('insertContact Error: ', error)
  }
  
  let techInfoHeadObj = {
    'ticketnumber': req.body.ticketnumber,
    'createdAt': req.body.createdAt,// date.getTime(),
    'createdBy': req.body.createdBy,
    'jobnumber': req.body.jobnumber,
    'machinetype': req.body.machinetype,
    'totalwashes': req.body.totalwashes
  }

  let techInfoSubObj = {
    'ticketnumber': req.body.ticketnumber,
    'contactname': req.body.contactname,
    'contactcc': req.body.cc,
    'contactphone': req.body.contactphone,
    'email': req.body.email,
    'address': req.body.address,
    'city': req.body.city,
    'state': req.body.state,
    'country': req.body.country,
    'zip': req.body.zip,
    'problemcatagory': req.body.problemcatagory,
    'ticketstatus': req.body.ticketstatus,
    'parts': req.body.parts,
    'resolution': req.body.resolution,
    'notes': req.body.notes,
  }

  try {
    try {
      insertTechInfo(techInfoHeadObj)
    } catch (error) {
      console.error('Error inserting into techInf db: ', error)
    }

    try {
      insertTechInfoSub(techInfoSubObj)
    } catch (error) {
      console.error('Error inserting into techInfSub db: ', error)
    }

    res.redirect('/dashboard');
  } catch (error) {
    throw 'error occurred'
  }
  
})



module.exports = router;
