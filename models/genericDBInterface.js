var { db } = require('./techInfo');


function get_all(dbase) {
    return new Promise((resolve, reject) => {
        dbase.find({}, (err, docs) => {
            try {
                resolve(docs);
            } catch (err) {
                console.log(err)
                reject(err)
            }
      });
    })
}
function getDBRecordCount(dbase) {
    return new Promise ((resolve, reject) => {
        dbase.count({}, (err, count) => {
            try {
                resolve(count)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function updatePromise(dbase, updateObj, filterObj){
    return new Promise((resolve, reject) => {
        dbase.findOne(updateObj, {$set: filterObj }, (err, numReplaced) => {
            try {
                resolve(numReplaced)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findOnePromise(dbase, findOneObj){
    return new Promise((resolve, reject) => {
        dbase.findOne(findOneObj, (err, doc) => {
            try {
                resolve(doc)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function find(dbase, findObj ){
    return new Promise((resolve, reject) => {
        dbase.find(findObj, (err, doc) => {
            try {
                resolve(doc)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function insert(dbase, insertObj){
    return new Promise((resolve, reject) => {
        dbase.insert(insertObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    get_all,
    getDBRecordCount
  };
