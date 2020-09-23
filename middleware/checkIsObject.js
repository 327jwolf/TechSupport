async function isObject(params) {
    return new Promise((resolve, reject) => {
        Object.keys(params).forEach((v, i) => {
            if (typeof params[v] === 'object') return reject(false)
        })
        resolve(true)
    })
  }
  
// exports.loginProtected = async (req, reply) => {
//     try {
//         let { user, pass } = req.body
//         await isObject({ user, pass })

//         let result = await findOne({user, pass})

//         return reply.code(200).send(result)
//     } catch (e) {
//         return reply.code(500).send({ success: false, result: 'user/pass not found' })
//     }
// }