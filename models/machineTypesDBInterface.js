var { db } = require('./techInfoInterface');

function addMachineType(machineTypeObj) {
    return new Promise((resolve, reject) => {
        machineTypeObj.createdAt = new Date()
        db.machineTypes.insert(machineTypeObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function getAllMachineTypes() {
    return new Promise((resolve, reject) => {
        db.machineTypes.find({}).sort({ machinename: 1, machineType: 1})
        .exec((err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function getOneMachineType(machineTypeId) {
    return new Promise((resolve, reject) => {
        db.machineTypes.find({_id: machineTypeId}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function deleteMachineType(machineTypeId) {
    return new Promise((resolve, reject) => {
        db.machineTypes.remove({_id: machineTypeId}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    addMachineType,
    getAllMachineTypes,
    getOneMachineType,
    deleteMachineType,
};