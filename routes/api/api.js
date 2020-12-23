var express = require('express');
var router = express.Router();

const { deleteUser } = require('../../models/usersDBInterface.js');
const { get_all, getDBRecordCount } = require('../../models/genericDBInterface.js');
const { getPartbyDescription, findByPartNumber } = require('../../models/partsDBInterface.js');
const { getAllMachineTypes, getOneMachineType, deleteMachineType, addMachineType } = require('../../models/machineTypesDBInterface.js');
const { getAllProblemCatagories, getOneProblemCatagory, deleteProblemCatagory, addProblemCatagory } = require('../../models/problemCatagoryDBInterface.js');



const checkRoute = (req, res, next)=>{
  console.log('Made it here')
  next()
}
  


function checkParamsDesc(req, res, next){
  if (req.params.description === undefined) {
    return res.json([{"error": "Invalid Search Parameters"}])
  }
  next()
}

function checkParamsPN(req, res, next){
  if (req.params.partNumber === undefined) {
    return res.json([{"error": "Invalid Search Parameters"}])
  }
  next()
}

router.get('/parts/desc/:description?', checkParamsDesc, async function(req, res, next){
  // console.time('Api-Call-Desc')

  await getPartbyDescription(req.params.description.trim())
  .then(x => res.json(x))
  // .then(x => {
  //   let html = '';
  //   x.forEach((element, i) => {
  //     html += `<div>${i} ${element.partNumber} - ${element.description}</div>`;
  //   });
  //   console.timeEnd('Api-Call-Desc')
  //   res.send(html)
  // })
  .catch(err => console.error(err))
})

router.get('/parts/pn/:partNumber?', checkParamsPN, async function(req, res, next){
  // console.time('Api-Call-Pn')
  await findByPartNumber(req.params.partNumber.trim())
  .then(x => res.json(x))
  // .then(x => {
  //   let html = '';
  //   x.forEach((element, i) => {
  //     html += `<div>${i} ${element.partNumber} - ${element.description}</div>`;
  //   });
  //   console.timeEnd('Api-Call-Pn')
  //   res.send(html)
  // })
  .catch(err => console.error(err))
})

router.delete('/deleteuser/:_id', async function(req, res, next){
  await deleteUser(req.params._id)
  .then(x => res.json(x))
  .catch(err => console.error(err))
})

router.get('/allusers', async function(req, res, next){
  await get_all(db.users)
  // .then(x => res.json(x))
  .then(x => {
    let html = '';
    x.forEach((element, i) => {
      html += `<div>${i} ${element.firstname} - ${element.lastname} - ${element.email} - ${element._id}</div>`;
    });
    res.send(html)
  })
  .catch(err => console.error(err))
})

router.get('/count/:db', async function(req, res, next){
  const dbName = req.params.db;
  await getDBRecordCount(db[dbName])
  .then(x => res.json(x))
  .catch(err => console.error(err))
})

router.get('/machinetypes/one/:_id', async function(req, res, next) {
  await getOneMachineType(req.params._id.trim())
  .then(x => res.json(x))
  // .then(x => {
  //   let html = '';
  //   x.forEach((element, i) => {
  //     html += `<div>${i} ${element._id} - ${element.machineType}</div>`;
  //   });
  //   res.send(html)
  // })
  .catch(err => console.error(err))
})

router.get('/machinetypes/all/', async function(req, res, next) {
  await getAllMachineTypes()
  .then(x => res.json(x))
  // .then(x => {
  //   let html = '';
  //   x.forEach((element, i) => {
  //     html += `<div>${i} ${element.machinename} - ${element.machineType} - ${element._id}}</div>`;
  //   });
  //   res.send(html)
  // })
  .catch(err => console.error(err))
})

router.get('/machinetypes/add/:name/:machinetype', async function(req, res, next) {
  const mtobj = {
    'machinename': req.params.name.trim(),
    'machineType': req.params.machinetype.trim()
  }
  await addMachineType(mtobj)
  .then(x => res.json(x))
  .catch(err => console.error(err))
})

router.delete('/machinetypes/delete/:_id', async function(req, res, next) {
  await deleteMachineType(req.params._id)
  .then(x => res.json(x))
  .catch(err => console.error(err))
})

router.get('/problemcatagory/one/:_id', async function(req, res, next) {
  await getOneProblemCatagory(req.params._id.trim())
  .then(x => res.json(x))
  // .then(x => {
  //   let html = '';
  //   x.forEach((element, i) => {
  //     html += `<div>${i} ${element.catagoryname} - ${element._id}</div>`;
  //   });
  //   res.send(html)
  // })
  .catch(err => console.error(err))
})

router.get('/problemcatagory/all/', async function(req, res, next) {
  await getAllProblemCatagories()
  .then(x => res.json(x))
  // .then(x => {
  //   let html = '';
  //   x.forEach((element, i) => {
  //     html += `<div>${i} ${element.catagoryname} - ${element._id}}</div>`;
  //   });
  //   res.send(html)
  // })
  .catch(err => console.error(err))
})

router.get('/problemcatagory/add/:name', async function(req, res, next) {
  const mtobj = {
    'catagoryname': req.params.name.trim(),
  }
  await addProblemCatagory(mtobj)
  .then(x => console.log(res.json(x)))
  .catch(err => console.error(err))
})

router.delete('/problemcatagory/delete/:_id', async function(req, res, next) {
  await deleteProblemCatagory(req.params._id)
  .then(x => res.json(x))
  .catch(err => console.error(err))
})



module.exports = router;