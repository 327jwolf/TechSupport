var Datastore = require('nedb');
const { Result } = require('express-validator');

db = {}

db.autoIncrement = new Datastore({ filename: './models/autoIncrement.db', autoload: true });
db.techInfo = new Datastore({ filename: './models/techInfoInterface.db', autoload: true });
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
    'ticketNum': '', // auto increment
    'createdAt': '', // date
    'createdBy': '', // created by user user   
    'jobNumber': '', // job number assigned to machine
    'contact': '', // person who called in tie to techContacts.db
    'contactPhoneNumber': '', // tie to techContacts.db
    'machineType': '', // tie to machineTypes.db
    'numberOfWashes': '', // total from machine counts
    'problemCatagory': '', // tie to problemCatagory.db
    'resolution': '', // 
    'partsNeeded': '', //
    'partsMissing': '', //
    'notes': '', //
}





module.exports = {
    db,
    getAutoIncrementValue,
  };
