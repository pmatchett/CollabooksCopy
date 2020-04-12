/* Queries corresponding to REST API

How to test?
Debug server.js and let it run until it waits
Run the api.js with some test call func, it will trigger.

note: postgresql does not accept dynamic SQL queries, they must be dynamically pre-made using pg-format

* */

const Pool = require('pg').Pool;
var format = require('pg-format');
// https://www.npmjs.com/package/pg-format

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

// working
function addRecordBook(request,response) {
    console.log('into final add record book method');
    //console.log(request);
    const rec = request.body;
    pool.query('INSERT INTO book_table VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [rec.bookid,rec.title,rec.author, rec.isbn, rec.genre, rec.owner_id, rec.borrowed_by, rec.due_date],
        (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(201).send('Row added')
    })
}

// working
function addRecordUser(request, response) {
    console.log('into final add record user method');
    //console.log(request);
    const rec = request.body;
    //console.log(rec);

    pool.query('INSERT INTO user_table VALUES ($1, $2, $3)',
        [rec.user_id, rec.user_lon, rec.user_lat],
        (error, results) => {
                    if (error) {
                        throw error
                    }
        console.log(results);
        response.status(201).send('Row added')
    })
}

// working
function updateRecord(request, response) {
    console.log('into final update record method');
    //console.log(request);
    const rec = request.body;
    //console.log(rec);
    let this_sql = format('UPDATE %I SET %I = %L WHERE %I = %L', rec.tablename, rec.cell_d, rec.cell_v, rec.where_d, rec.where_v );

    pool.query(
        this_sql,
        (error, results) => {
            if (error) {
                throw error
            }
            console.log(results);
            response.status(200).send('Record updated')
        })
}

// currently works
// SELECT <columns> FROM <table> WHERE <condition>
function getARecord(request,response) {

    const rec = request.query;
    console.log(rec);
    let this_sql = format('SELECT * FROM %I WHERE %I = %L', rec.tablename, rec.column_name, rec.value );

    pool.query(this_sql, (error, results) => {
        if (error) {
            throw error
        }
        console.log(results);
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getBookTable,
    getChatTable,
    getUserTable,
    addRecordBook,
    addRecordUser,
    updateRecord,
    getARecord
};