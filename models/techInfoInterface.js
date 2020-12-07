var Datastore = require('nedb');
const { Result } = require('express-validator');

db = {}

db.autoIncrement = new Datastore({ filename: './models/autoIncrement.db', autoload: true });
db.techInfo = new Datastore({ filename: './models/techInfo.db', autoload: true });
db.techInfoSub = new Datastore({ filename: './models/techInfoSub.db', autoload: true });
db.techContacts = new Datastore({ filename: './models/techContacts.db', autoload: true });
db.machineTypes = new Datastore({ filename: './models/machineTypes.db', autoload: true });
db.users = new Datastore({ filename: './models/users.db', autoload: true });
db.problemCatagory = new Datastore({ filename: './models/problemCatagory.db', autoload: true });
db.parts = new Datastore({ filename: './models/parts.db', autoload: true });





// incCounters {catagory: techInfo, incValue: number}
function getAutoIncrementValue(dbase, catagory){
    return new Promise((resolve, reject) => {
        let incvalue;
        dbase.findOne({'catagory': catagory}, (err, doc) => {
            if (doc === null) {
                dbase.insert({'catagory': catagory, 'incValue': 0}, (err, returnDoc) => {
                    try {
                        incvalue = returnDoc.incValue;
                        incvalue++
                        dbase.update({'catagory': catagory}, {$set: {'incValue': incvalue} })
                        resolve(incvalue)
                        } catch (err) {
                            reject(err)
                        }                    
                })
            } else {
                try {
                    incvalue = doc.incValue;
                    incvalue++
                    dbase.update({'catagory': catagory}, {$set: {'incValue': incvalue} })
                    resolve(incvalue)
                } catch (err) {
                    reject(err)
                }
            }
        })
    })
}

const techInfoDoc = {
    'ticketnumber': '', // auto increment
    'createdAt': '', // date
    'createdBy': '', // created by user user   
    'jobNumber': '', // job number assigned to machine
    'machineType': '', // tie to machineTypes.db
    'totalwashes': '', // total from machine counts
    
}

const techInfoSubDoc = {
    'ticketnumber': '',
    'contactname': '', // person who called in tie to techContacts.db
    'contactphone': '', // tie to techContacts.db
    'ticketstatus': '',
    'problemcatagory': '', // tie to problemCatagory.db
    'resolution': '', // 
    'partsneeded': '', //
    'partsmissing': '', //
    'notes': '', //
}

function insertTechInfo(techInfoObj) {
    return new Promise((resolve, reject) => {
        db.techInfo.insert(techInfoObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function updateTechInfo(techInfoObj) {
    return new Promise((resolve, reject) => {
        db.techInfo.update({'_id': techInfoObj._id}, techInfoObj, {returnUpdatedDocs: true, multi: false}, (err, numaffected, doc) => {
            try {
                resolve(numaffected, doc)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findAllTechInfo() {
    return new Promise((resolve, reject) => {
        db.techInfo.find({}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                console.error('techInfo Interface error', err)
                reject(err)
            }
        })
    })
}

function insertTechInfoSub(techInfoSubObj) {
    return new Promise((resolve, reject) => {
        db.techInfoSub.insert(techInfoSubObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function updateTechInfoSub(techInfoSubObj) {
    return new Promise((resolve, reject) => {
        db.techInfoSub.update({'_id': techInfoSubObj._id}, techInfoSubObj, {returnUpdatedDocs: true, multi: false}, (err, numaffected, doc) => {
            try {
                resolve(numaffected, doc)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findAllTechInfoSubbyTickerNumber(ticketnumber) {
    return new Promise((resolve, reject) => {
        db.techInfoSub.find({ticketnumber: ticketnumber}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                console.error('techInfosub Interface error', err)
                reject(err)
            }
        })
    })
}

function findAllTechInfoSub() {
    return new Promise((resolve, reject) => {
        db.techInfoSub.find({}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                console.error('techInfosub Interface error', err)
                reject(err)
            }
        })
    })
}



module.exports = {
    db,
    getAutoIncrementValue,
    insertTechInfo,
    updateTechInfo,
    findAllTechInfo,
    insertTechInfoSub,
    updateTechInfoSub,
    findAllTechInfoSubbyTickerNumber,
    findAllTechInfoSub,
  };
