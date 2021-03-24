var express = require('express');
var router = express.Router();
const { getAutoIncrementValue, insertTechInfo, updateTechInfo, insertTechInfoSub, updateTechInfoSub, findAllTechInfo, findAllTechInfoSub } = require('../models/techInfoInterface.js');
const { findOneUser } = require('../models/usersDBInterface.js');
const { insertContact, updateContact } = require('../models/techContactsInterface.js');
// const { countryCodes } = require('../middleware/countryCodes.js');
const { codeArray: countryCodes2 } = require('../middleware/countryCodes2.js');
const { redirectLogin } = require('../middleware/auth');

const mainTitle = 'Technical Service Support 00.00.01';
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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { 
    title: mainTitle,
    // csrfToken: req.csrfToken()
    });
});

router.get('/autoinc', async function(req, res, next){
  await getAutoIncrementValue(db.autoIncrement, 'techInfo')
  .then(x => res.json(x))
  .catch(err => console.error(err))
})

async function getUserName(obj) {
    try {
      let user = await findOneUser({'_id': obj.createdBy});
      obj.username = `${user.firstname} ${user.lastname}` || "";
      return obj
    } catch (error) {
      console.log('Error finding user', error);
    }
}

router.get('/dashboard', redirectLogin,  async function(req, res, next){
  try {
    const user = await findOneUser({'_id': req.session.user.id});
    delete user.password;
    let techInfo = await findAllTechInfo();
    
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
    await Promise.all(await techInfo.map(async el => await getUserName(el))) 

    const techInfoSubs = await findAllTechInfoSub()
    techInfoSubs.sort((a,b) => {
      var createdAtA = new Date(a.createdAt).valueOf(); 
      var createdAtB = new Date(b.createdAt).valueOf(); 
      // console.log(createdAtA, createdAtB)

      if (createdAtA > createdAtB) {
        return 1;
      }
      if (createdAtA < createdAtB) {
        return -1;
      }
      return 0;
    })
    await Promise.all(await techInfoSubs.map(async el => await getUserName(el))) 

    res.render('dashboard', { 
      title: mainTitle,
      user: user,
      // csrfToken: req.csrfToken(),
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
  const contact = await createContact(req)
  const techInfoHead = await createTectInfoHead(req)
  const techInfoSub = await createTechInfoSub(req)
  // console.log(contact, techInfoHead, techInfoSub)
  res.redirect('/dashboard');
})

router.post('/techInfoSubform', async function(req, res, next){
  let date = new Date(req.body['createdAt'])
  // console.log(req.body)
  if(req.body.contactname){
    const contact = await createContact(req)
  }
  const techInfoSub = await createTechInfoSub(req)
  // console.log(contact, techInfoHead, techInfoSub)
  res.redirect('/dashboard');
})

router.post('/editHeader', async function(req, res, next){
  let date = new Date(req.body['createdAt']);
  await createUpdateTectInfoHead(req);
  res.redirect('/dashboard');
})

router.post('/editDetails', async function(req, res, next){
  let date = new Date(req.body['createdAt']);
  await createUpdateTechInfoSub(req);
  res.redirect('/dashboard');
})

async function createContact(req) {
  let contact = {
    'contactname': req.body.contactname,
    'contactcc': req.body.contactcc,
    'contactphone': req.body.contactphone,
    'email': req.body.email,
    'address': req.body.address,
    'city': req.body.city,
    'state': req.body.state,
    'country': req.body.country,
    'zip': req.body.zip,
  };
  try {
    const result = await insertContact(contact);
    return result;
  } catch (error) {
    console.error('insertContact Error: ', error);
  }
}

async function createUpdateContact(req) {
  let id = req.body._id;
  let contact = {
    '_id': req.body._id,
    'contactname': req.body.contactname,
    'contactcc': req.body.contactcc,
    'contactphone': req.body.contactphone,
    'email': req.body.email,
    'address': req.body.address,
    'city': req.body.city,
    'state': req.body.state,
    'country': req.body.country,
    'zip': req.body.zip,
  };
  try {
    const result = await updateContact(id, contact);
    return result;
  } catch (error) {
    console.error('insertContact Error: ', error);
  }
}

async function createTectInfoHead(req) {
  let techInfoHeadObj = {
    'ticketnumber': req.body.ticketnumber,
    'createdAt': req.body.createdAt,// date.getTime(),
    'createdBy': req.body.createdBy,
    'jobnumber': req.body.jobnumber,
    'machinetype': req.body.machinetype,
    'totalwashes': req.body.totalwashes
  };
  try {
    const result = await insertTechInfo(techInfoHeadObj);
    return result;
  } catch (error) {
    console.error('Error inserting into techInf db: ', error);
  }
}

async function createUpdateTectInfoHead(req) {
  let techInfoHeadObj = {
    '_id': req.body._id,
    'ticketnumber': req.body.ticketnumber,
    'createdAt': req.body.createdAt,// date.getTime(),
    'createdBy': req.body.createdBy,
    'jobnumber': req.body.jobnumber,
    'machinetype': req.body.machinetype,
    'totalwashes': req.body.totalwashes
  };
  try {
    const result = await updateTechInfo(techInfoHeadObj);
    return result;
  } catch (error) {
    console.error('Error inserting into techInf db: ', error);
  }
}

async function createTechInfoSub(req) {
  let techInfoSubObj = {
    'ticketnumber': req.body.ticketnumber,
    'contactname': req.body.contactname,
    'contactcc': req.body.contactcc,
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
    'createdBy': req.body.createdBy,
    'createdAt': req.body.createdAt,
  };
  try {
    const result = await insertTechInfoSub(techInfoSubObj);
    return result;
  } catch (error) {
    console.error('Error inserting into techInfSub db: ', error);
  }
}

async function createUpdateTechInfoSub(req) {
  let techInfoSubObj = {
    '_id': req.body._id,
    'ticketnumber': req.body.ticketnumber,
    'contactname': req.body.contactname,
    'contactcc': req.body.contactcc,
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
    'createdBy': req.body.createdBy,
    'createdAt': req.body.createdAt,
  };
  try {
    const result = await updateTechInfoSub(techInfoSubObj);
    return result;
  } catch (error) {
    console.error('Error inserting into techInfSub db: ', error);
  }
}

module.exports = router;
