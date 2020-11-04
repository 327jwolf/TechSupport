var { db } = require('./techInfoInterface');

function addProblemCatagory(problemCatagoryObj) {
    return new Promise((resolve, reject) => {
        problemCatagoryObj.createdAt = new Date()
        db.problemCatagory.insert(problemCatagoryObj, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function getAllProblemCatagories() {
    return new Promise((resolve, reject) => {
        db.problemCatagory.find({}).sort({ catagoryname: 1})
        .exec((err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function getOneProblemCatagory(problemCatagoryId) {
    return new Promise((resolve, reject) => {
        db.ProblemCatagory.find({_id: problemCatagoryId}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

function deleteProblemCatagory(machineTypeId) {
    return new Promise((resolve, reject) => {
        db.ProblemCatagory.remove({_id: machineTypeId}, (err, docs) => {
            try {
                resolve(docs)
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    addProblemCatagory,
    getAllProblemCatagories,
    getOneProblemCatagory,
    deleteProblemCatagory,
};