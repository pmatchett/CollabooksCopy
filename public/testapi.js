/* TO TEST - WILL MAKE LIVE CALLS TO DB!!!!!! */

// you can try putting these into an async function to test
// all functions have been tested previously
// the following have been tested when inserted in index.js on the front end
// warning: will make live calls to the DB

async function exampleFunctionName(){

    const users = await apiGetUserTable();
    console.log(typeof users);
    console.log(users);
    console.log(users[0].user_lon);


    /* Testing - Get Book Table and get the first record and only the title, should be Harry Potter */
    const booktest = await apiGetBookTable();
    console.log(typeof booktest);
    console.log(booktest);
    console.log(booktest[0].title);

    /* Testing - Get Book Table and get the first record and only the title, should be Harry Potter */
    const chattest = await apiGetChatTable();
    console.log(typeof chattest);
    console.log(chattest);
    console.log(chattest.userid); // this should be undefined if the chat table is empty because chattest is an empty array

    /* Testing - Add a record to the book table. You'll have to check via the SQL tables or pull the table to check */

    let newuserrecord = {
        "user_id": "222",
        "user_lon":64,
        "user_lat":-111
    };
    await apiAddRecordToTable(newuserrecord,'user');

    /* Testing - Update a record to the book table. You'll have to check via the SQL tables or pull the table to check */

    let updateuserrecord = { "tablename" : "book_table",
        "cell_d" : "title",
        "cell_v" : 'dank memes',
        "where_d" : "book_id",
        "where_v" : "1000",
    };

    await apiUpdateRecord(updateuserrecord);

    let get_specific_book_record = {tablename: 'book_table', column_name: 'book_id', value: '1000'};
    let specific_result = await apiGetRecord(get_specific_book_record);
    console.log(specific_result[0]); // should return the entire record of row 1000 in book_table

    let record_to_delete ={
        "tablename" : "book_table",
        "column_name" : "book_id",
        "value" : 1000,
    };
    await apiDeleteRecord(record_to_delete);
}
























// deprecated tests - do not use
// remove this test function later
// all of these calls have been tested to work
// Just for testing, don't use this in production
// async function testBarrage() {
//
//     let test = await apiGetRecord({tablename: 'book_table', column_name: 'book_id', value: '1000'});
//     console.log(test);
//
//     apiDeleteRecord(
//         {
//             "tablename": "book_table",
//             "column_name": "book_id",
//             "value": "1000",
//         }
//     );
//

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