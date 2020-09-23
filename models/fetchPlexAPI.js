const fetch = require('node-fetch');
const { addPart, findPart } = require('./partsDBInterface');

const URL = 'https://connect.plex.com/mdm/v1/parts?';
const HEADER = {
    method: 'GET',
    // mode: 'cors',
    cache: 'no-cache',
    // credentials: 'same-origin',
    headers: {
        'X-Plex-Connect-Api-Key': process.env.PLEX_API_KEY,
        // 'Content-Type': 'application/json'
    },
};


async function getPartNumbers() {
    let startTime = new Date().getTime();
    console.time('getPartNumbers');
    try {
	    console.log('running fetch for parts: ', startTime)

        const response = await fetch(URL, HEADER);
        const jsonRes = await response.json();
        await jsonRes.forEach(part => {
            let partObj = {
                'partID': part.id, 
                'partNumber':part.number, 
                'description':part.name,
                'type': part.type,
            }
            findPart(part.number)
            .then(res => {
                if(res == null){
                    addPart(partObj)
                    .then(res => console.log('part added: ', res))
                    // .catch(e => console.log(e))
                }

            })
        })
        let endTime = new Date().getTime();
        console.log('Done running fetch for parts', endTime)
        console.log('Running Time: ', endTime - startTime)
        console.timeEnd('getPartNumbers');
      } catch (error) {
        console.log(error);
      }
}


module.exports = { getPartNumbers }