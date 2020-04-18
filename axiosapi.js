/* API Calls to access and manipulate the Database.
All calls from the client should end up here which are re-routed to the node server and to the DB.

Any call to an async function must be async itself. i.e.


     //to use else where

                async function whatever() {
                const values = await functionYouWrote()
                console.log(values) // everything is there

                // whatever they wanna do with the values
            }

     // or event listeners

        button.addEventListener("click", async () => {
        const values = await functionYouWrote()
        })


 */

const axios = require('axios');


async function apiGetChatTable() {
    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/chattable'
    };

    let res = await axios(config);
    // console.log('chat table api called');
    console.log(res.status);
    return res.data
}

// only for testing
async function testBarrage(){

    let test = await apiGetChatTable();
    console.log(test);
}

// export functions
module.exports = {
    apiGetChatTable
};