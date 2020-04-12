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

async function apiGetBookTable() {
    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/booktable'
    };

    let res = await axios(config);
    console.log('book table api called');
    console.log(res.status);
}

async function apiGetUserTable() {
    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/usertable'
    };

    let res = await axios(config);
    console.log('user table api called');
    console.log(res.status);
}

async function apiGetChatTable() {
    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/chattable'
    };

    let res = await axios(config);
    console.log('chat table api called');
    console.log(res.status);
}

async function apiAddRecordToTable(record, table_name) {
    params = record;
    let res = await axios.post('http://localhost:3000/tables/addrecord/'+table_name, params);
    console.log('add record api called with selected tablename: ' + table_name);
    console.log(res.data);
}

/**
 *  Used to update a record
 *
 *  Example record would be the following
 *
     { "tablename" : "book_table",
                "cell_d" : "title",
                "cell_v" : 'dank memes',
                "where_d" : "book_id",
                "where_v" : "1000", }

 *  so if I wanted to perform the following
 *  "In the friend_table, I want to set the name to Penny Wise where the town is equal to derry.
 *  SQL: UPDATE friend_table SET name = 'Pennywise' WHERE town = 'derry'
 *  The record should be
 *
 *  { "tablename" : "friend_table",
 *    "cell_d" : "name",
 *    "cell_V" : "pennywise",
 *    "where_d" : "town",
 *    "where_v" : "derry",
 *    }
 *
 *  Then pass the table_name parameter as a string
 * @param record - type json
 * @returns {Promise<void>}
 */
function apiUpdateRecord(record) {
    params = record;
    let res = axios.put( 'http://localhost:3000/tables/uprecord/', params);
    console.log('update record api called with parameter: ' + params);
    console.log(res.data);
}

async function apiGetRecord(record) {
    let paramarg = record;
    const request_promise = await axios.get('http://localhost:3000/tables/getrecord', {
        params: paramarg
    });
    return request_promise.data
}

// function apiGetRecord(record) {
//
//     /**
//      * to use else where
//      *
//              * async function whatever() {
//                 const values = await functionYouWrote()
//                 console.log(values) // everything is there
//
//                 // whatever they wanna do with the values
//             }
//
//      or event liseners
//
//         button.addEventListener("click", async () => {
//         const values = await functionYouWrote()
//         })
//
//      */
//
//
//     let paramarg = record;
//
//     axios
//         .get('http://localhost:3000/tables/getrecord', {
//             params: paramarg,
//         })
//         .then(function(response) {
//             console.log('get-a-record get request sent');
//             return response.data;
//         });
// }


// remove this test function later
// all of these calls have been tested to work
// Just for testing, don't use this in production
async function testBarrage(){

    let test = await apiGetRecord({ tablename: 'book_table', column_name: 'book_id', value: '1000' });
    console.log(test);

//
//     apiGetBookTable();
//
//     console.log('next');
//
//     apiGetUserTable();
//
//     console.log('next');
//
//     apiGetChatTable();
//
//
//     apiAddRecordToTable(
//         {
//             'bookid': '501',
//             'title': 'The Witcher: The Last Wish',
//             'author': 'Andrzej Sapkowski',
//             'isbn': '0316497541',
//             'genre': 'fiction',
//             'owner_id': '501',
//             'borrowed_by': 'null',
//             'due_date': 'null'
//         }, 'book'
//     );
//
//     apiAddRecordToTable(
//         {
//             "user_id": "110",
//             "user_lon":64,
//             "user_lat":-111
//         }, 'user'
//     );
//
//     apiUpdateRecord(
//
//         { "tablename" : "user_table",
//             "cell_d" : "user_lon",
//             "cell_v" : 1,
//             "where_d" : "user_id",
//             "where_v" : 100,
//         }
//     );
// // works
//     apiUpdateRecord(
//
//         { "tablename" : "book_table",
//             "cell_d" : "title",
//             "cell_v" : 'dank memes',
//             "where_d" : "book_id",
//             "where_v" : "1000",
//         }
//     );

}

// this works
// testBarrage();