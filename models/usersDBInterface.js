var { db } = require('./techInfoInterface');

function addUser (addUserObj) {
    return new Promise((resolve, reject) => {
        addUserObj.createdAt = new Date()
        db.users.insert(addUserObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function findOneUser (findUserObj) {
    return new Promise((resolve, reject) => {
        db.users.findOne(findUserObj, (err, docs) => {
            try {
                if (err) {
                    reject(err)
                } else {
                    resolve(docs)
                }
            } catch (err) {
                console.error('findOneUser Interface error', err)
                reject(err)
            }
        })
    })
}

function findUserbyEmail(useremail) {
    return new Promise((resolve, reject) => {
        db.users.findOne({email: useremail}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        db.users.remove({ _id: userId }, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    findUserbyEmail, 
    addUser,
    findOneUser,
    deleteUser,
  };