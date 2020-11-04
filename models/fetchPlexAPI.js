const fetch = require('node-fetch');
const { addPart, findPart, updatePartDescription } = require('./partsDBInterface');

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

// example return object
/*
{
    "id": "3a5dc9e2-555c-4c73-a80d-fdf8a753e603",
    "number": "30001018",
    "name": "CLVR FLOAT VALVE SWITCH ASSY",
    "revision": "",
    "description": "CLVR FLOAT VALVE SWITCH ASSY",
    "type": "Make",
    "group": "Mechanical",
    "source": null,
    "productType": null,
    "status": "Production",
    "note": "",
    "leadTimeDays": 0.0000,
    "buildingCode": null,
    "createdById": "6b493a16-05be-44f0-85ed-bdc7ded2a104",
    "createdDate": "2020-07-06T19:08:00Z",
    "modifiedById": "6b493a16-05be-44f0-85ed-bdc7ded2a104",
    "modifiedDate": "2020-07-06T19:08:00Z"
  },
*/


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
                if (res != null && part.id === res.partID && part.name != res.description) {
                    console.log('original part number:', res)
                    updatePartDescription(partObj.partNumber, partObj.description)
                    .then(res => console.log('part updated: ', res))
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