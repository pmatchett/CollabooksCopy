const axios = require('axios');

async function apiGetBookTable() {

    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/booktable'
    };

    let res = await axios(config);
    console.log('book table api called');
    console.log(res.status);
    res;
    res.data;
    console.log('lol')
}

async function apiGetUserTable() {

    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/usertable'
    };

    let res = await axios(config);
    console.log('user table api called');
    console.log(res.status);
    res;
    res.data;
    console.log('lol')
}

async function apiGetChatTable() {

    const config = {
        method: 'get',
        url: 'http://localhost:3000/tables/chattable'
    };

    let res = await axios(config);
    console.log('chat table api called');
    console.log(res.status);
    res;
    res.data;
    console.log('lol')
}


async function apiAddRecordToTable(record, table_name) {

    params = record;
    let res = await axios.post('http://localhost:3000/tables/addrecord/'+table_name, params);
    console.log('add record api called with selected tablename: ' + table_name);
    console.log(res.data);
}

// test data
//TODO
// remove test data

// apiGetBookTable();
//
// console.log('next');
//
// apiGetUserTable();
//
// console.log('next');
//
// apiGetChatTable();

// apiAddRecordToTable(
//     {
//         'bookid': '501',
//         'title': 'The Witcher: The Last Wish',
//         'author': 'Andrzej Sapkowski',
//         'isbn': '0316497541',
//         'genre': 'fiction',
//         'owner_id': '501',
//         'borrowed_by': 'null',
//         'due_date': 'null'
//     }, 'book'
// );

apiAddRecordToTable(
    {
        "user_id": "110",
        "user_lon":64,
        "user_lat":-111
    }, 'user'
);