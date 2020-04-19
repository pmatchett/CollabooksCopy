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

async function apiUpdateRecord(record) {
    params = record;
    let res = await axios.put( 'http://localhost:3000/tables/uprecord/', params);
    console.log('update record api called with parameter: ' + params);
//    console.log(res.data);
}

/**
 * End User API call to look up a user on the user_table providjng only a userid
 * @param userid
 * @returns {Promise<T>}
 */
async function apiGetUserLookUp(userid){
    let paramarg = userid;
    const request_promise = await axios.get('http://localhost:3000/tables/useridlookup/', {
        params: paramarg
    });
    return request_promise.data;
}

async function apiAddRecordChatTable(record) {
    params = record;
    let res = await axios.post('http://localhost:3000/tables/addrecord/chat', params);
}

// only for testing
async function testBarrage(){
    //     apiUpdateRecord(
    //
    //     { "tablename" : "book_table",
    //         "cell_d" : "title",
    //         "cell_v" : 'dank memes',
    //         "where_d" : "book_id",
    //         "where_v" : "1000",
    //     }
    // );
    //
    // let test = await apiGetChatTable();
    // console.log(test);

    // recordtest = {"user_id_value" : 54};
    // result = await apiGetUserLookUp(recordtest);
    // console.log(result)

    // [rec.chatid, rec.firstpname, rec.secondpname, rec.hist],
    // testrecord = {
    //     "chatid":"1300",
    //     "firstpname": "user_50",
    //     "secondpname" : "user_90",
    //     "hist":"testing"
    // }
    // apiAddRecordChatTable(testrecord)


}

// export functions
module.exports = {
    apiGetChatTable,
    apiUpdateRecord,
    apiGetUserLookUp,
    apiAddRecordChatTable
};