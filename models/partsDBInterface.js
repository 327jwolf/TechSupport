var { db } = require('./techInfo');



function addPart(addPartObj) {
    return new Promise((resolve, reject) => {
        db.parts.insert(addPartObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findPart(partNumber) {
    return new Promise((resolve, reject) => {
        db.parts.findOne({partNumber: partNumber}, (err, doc) => {
            try {
                resolve(doc)
            } catch (err) {
                reject(err)
            }
        })
    })
}

let parseInputStr = (str) => {
    return str.split(' ').join('.*');
} 

function findByPartNumber(partNumber){
    let result = {};
    let re = '';
    if(partNumber === "*"){
        result = {};//"[a-zA-Z0-9\-\?\.]*";
    } else if (partNumber[0] === '!') {
        let [first, ...rest] = partNumber.split(" ")
        let firstword = `^(${first.slice(1,first.length)})`
        let strChange = [firstword, ...rest].join('.*')
        re = new RegExp(strChange, 'gi')
        result = {'partNumber': re}
    } else{
        re = new RegExp(parseInputStr(partNumber), 'gi')
        result = {'partNumber': re}
    }
    return new Promise((resolve, reject) => {
        db.parts.find(result).sort({ partNumber: 1})
        .exec((err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function getPartbyDescription(partSearchStr){
    let result = {};
    let re = '';
    if(partSearchStr === "*"){
        result = {};//"[a-zA-Z0-9\-\?\.]*";
    }else if(partSearchStr[0] === '!') {
        let [first, ...rest] = partSearchStr.split(" ")
        let firstword = `^(${first.slice(1,first.length)})`
        let strChange = [firstword, ...rest].join('.*')
        re = new RegExp(strChange, 'gi')
        result = {'description': re}
    }else{
        re = new RegExp(parseInputStr(partSearchStr), 'gi')
        result = {'description': re}
    }
    return new Promise((resolve, reject) => {
        db.parts.find(result).sort({ partNumber: 1})
        .exec((err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}


module.exports = {
    findPart,
    findByPartNumber,
    addPart,
    getPartbyDescription,
  };