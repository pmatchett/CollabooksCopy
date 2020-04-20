/* Queries corresponding to REST API

How to test?
Debug server.js and let it run until it waits
Run the api.js with some test call func, it will trigger.

note: postgresql does not accept dynamic SQL queries, they must be dynamically pre-made using pg-format

* */
require('dotenv').config();
const Pool = require('pg').Pool;
var format = require('pg-format');
// https://www.npmjs.com/package/pg-format

// should put these into an env
// make sure to squash/commit to remove this credential history
const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST_ADD,
    database: process.env.DATABASE_NAME,
    password: process.env.SECRET_PASS,
    port: process.env.PORT_NUM,
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
        // console.log(results);
        response.status(200).json(results.rows)
    })
};


// currently works
function getBookTable(request,response) {
    pool.query('SELECT * FROM book_table ORDER BY book_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        // console.log(results);
        response.status(200).json(results.rows)
    })
}

// currently works
function getChatTable(request,response) {
    pool.query('SELECT * FROM chat_table ORDER BY chat_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        // console.log(results);
        response.status(200).json(results.rows)
    })
}

// currently works
function getUserTable(request,response) {
    pool.query('SELECT * FROM user_table ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        // console.log(results);
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
        // console.log(results);
        response.status(201).send('Row added')
    })
}

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
        // console.log(results);
        response.status(201).send('Row added')
    })
}

function addRecordChat(request, response) {
    //console.log(request);
    const rec = request.body;
    //console.log(rec);

    pool.query('INSERT INTO chat_table VALUES ($1, $2, $3, $4)',
        [rec.chatid, rec.firstpname, rec.secondpname, rec.hist],
        (error, results) => {
            if (error) {
                throw error
            }
            // console.log(results);
            response.status(201).send('Row added')
        })
}

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
            // console.log(results);
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
        // console.log(results);
        response.status(200).json(results.rows)
    })
}


// currently works
// SELECT <columns> FROM <table> WHERE <condition>
/**
 *
 *
 A 202 (Accepted) status code if the action will likely succeed but has not yet been enacted.
 A 204 (No Content) status code if the action has been enacted and no further information is to be supplied.
 A 200 (OK) status code if the action has been enacted and the response message includes a representation describing the status.

 *
 *
 * @param request
 * @param response
 */
function delARecord(request,response) {

    console.log(request);
    const rec = request.query;
    console.log(rec);

    let this_sql = format('DELETE FROM %I WHERE %I = %L', rec.tablename, rec.columnname, rec.value );
    console.log(this_sql);
    pool.query(this_sql, (error, results) => {
        if (error) {
            response.status(404);
            throw error
        }
        // console.log(results);
        response.status(200).json(results.rows)
    })
}

/**
 * look up a user on the user_table providing the user_id
 * @param request
 * @param response
 */
function getUserLookUp(request, response) {
    const rec = request.query;
    // console.log(rec);
    let this_sql = format('SELECT first_name, last_name FROM user_table WHERE user_id = %L',  rec.user_id_value );

    pool.query(this_sql, (error, results) => {
        if (error) {
            throw error
        }
        // console.log(results);
        response.status(200).json(results.rows)
    })
}

// export all the queries to be usable
module.exports = {
    getBookTable,
    getChatTable,
    getUserTable,
    addRecordBook,
    addRecordUser,
    updateRecord,
    getARecord,
    delARecord,
    getUserLookUp,
    addRecordChat
};