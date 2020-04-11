/* How to test?
Debug server.js and let it run until it waits
Run the api.js with some test call func, it will trigger

WIP

* */


// queries API

const Pool = require('pg').Pool;

// should put these into an env
// make sure to squash/commit to remove this credential history
const pool = new Pool({
    user: 'api_user',
    host: 'seng513db.co9s2dsktjiq.us-east-2.rds.amazonaws.com',
    database: 'mydatabase',
    password: 'api513password',
    port: 5432,
});

// GET user by ID ; This needs tweaking
/**
 *  function getUsers
 * @param request
 * @param response - object type. it will have property rows (response.rows) which is an array of the sql results
 */
const getUsers = (request, response) => {
    pool.query('SELECT * FROM user_table ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(200).json(results.rows)
    })
};


// currently works
function getBookTable(request,response) {
    pool.query('SELECT * FROM book_table ORDER BY book_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(200).json(results.rows)
    })
}

// currently works
function getChatTable(request,response) {
    pool.query('SELECT * FROM chat_table ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(200).json(results.rows)
    })
}

// currently works
function getUserTable(request,response) {
    pool.query('SELECT * FROM user_table ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(200).json(results.rows)
    })
}

// not failing but not adding; check if table is locked?
function addRecordBook(request,response) {
    console.log('into final add record book method');
    console.log(request);
    const rec = request.body;
    pool.query('INSERT INTO book_table VALUES ($1)',[rec], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(201).send('Row added')
    })
}
// TODO
// fix the parse error on the JSON
function addRecordUser(request,response) {
    console.log('into final add record user method');
    console.log(request);
    const rec = request.body;
    pool.query('INSERT INTO user_table VALUES ($1)',[rec], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(201).send('Row added')
    })
}

// update
module.exports = {
    getBookTable,
    getChatTable,
    getUserTable,
    addRecordBook,
    addRecordUser,
};