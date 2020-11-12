var { db } = require('./techInfoInterface');

const contactsDoc = {
    'name': '',
    'phone': '',
    'email': '',
    'address': '',
    'city': '',
    'State': '',
    'Country': '',
    'zip': '',
    'createdAt': '',
}

/**
 * Function insertContact
 * @typedef {Function} insertContact 
 * @@param {object} contactObj object containing contact data.
 *  * @typedef {Object<string, any>} contactObj
    * @property {string} name The contact's name.
    * @property {string} phone The contact's phone
    * @property {string} [email] 
    *  @property {string} [address] 
    *  @property {string} [city] 
    *  @property {string} [state] 
    *  @property {string} [country] 
    *  @property {string} [zip] 
    *  @property {string} createAt automatically created
 * @return {Promise} db doc/s - db json like array
 * should be same signature as contactObj
 */

function insertContact(contactObj){
    console.log(`Contact Name is ${contactObj.contactname} the phone number is ${contactObj.contactphone}`)
    const date = new Date();
    let contactsObjP = {
        'name': contactObj.contactname ? contactObj.contactname : '',
        'phone': contactObj.contactphone ? contactObj.contactphone : '',
        'email': contactObj.email ? contactObj.email : '',
        'address': contactObj.address ? contactObj.address : '',
        'city': contactObj.city ? contactObj.city : '',
        'state': contactObj.State ? contactObj.state : '',
        'country': contactObj.country ? contactObj.country : '',
        'zip': contactObj.zip ? contactObj.zip : '',
        'createdAt': date,
    };

    return new Promise((resolve, reject) => {
        db.techContacts.insert(contactsObjP, (err, doc) => {
            try {
                resolve(doc)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findContactByName(name){
    
    return new Promise((resolve, reject) => {
        db.techContacts.find({name: name}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findContactById(id){
    
    return new Promise((resolve, reject) => {
        db.techContacts.find({_id: id}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findContactByPhone(phone){
    
    return new Promise((resolve, reject) => {
        db.techContacts.find({phone: phone}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function updateContact(id, keyValueObj){
    return new Promise((resolve, reject) => {
        db.techContacts.update({_id: id}, { $set: keyValueObj }, {returnUpdatedDocs: true, multi: false},(err, numaffected, doc) => {
            try {
                resolve({numaffected ,doc})
            } catch (err) {
                reject(err)
            }
            // if (err) {
            //     reject(err)
            // } else {
            //     resolve({numaffected ,doc})
            // }
        })
    })
}



module.exports = {
    insertContact,
    findContactByName,
    findContactById,
    findContactByPhone,

  };