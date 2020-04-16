/* API Calls to access and manipulate the Database.
All calls from the client should end up here which are re-routed to the node server and to the DB.

Any call to an async function must be async itself. i.e.


     //to use else where
     // for example you have a function and you want the user table
     // ensure the function is async and that the local variable is awaited

                async function whatever() {
                    const values = await apiGetUserTable()
                    console.log(values) // everything is there
                // whatever you wanna do with the values
            }

     // or event listeners

        button.addEventListener("click", async () => {
        const values = await functionYouWrote()
        })
 */


async function apiGetUserTable() {
    console.log('api GetUserTable called, performing GET request');
    return(
        $.ajax({
        url: 'http://localhost:3000/tables/usertable',
        type: "GET",
        dataType: "json",
        success: function (results) {
        },
        fail: function () {
            console.log("Encountered an error")
        }
    })
    )
}

async function apiGetBookTable() {
    console.log('api GetBookTable called, performing GET request');
    return(
        $.ajax({
            url: 'http://localhost:3000/tables/booktable',
            type: "GET",
            dataType: "json",
            success: function (results) {
            },
            fail: function () {
                console.log("Encountered an error")
            }
        })
    )
}

async function apiGetChatTable() {
    console.log('api GetChatTable called, performing GET request');
    return(
        $.ajax({
            url: 'http://localhost:3000/tables/chattable',
            type: "GET",
            dataType: "json",
            success: function (results) {
            },
            fail: function () {
                console.log("Encountered an error")
            }
        })
    )
}

/**
 * Add a record to a table. Does NOT return anything.
 * @param record
 * @param table_name
 * @returns {Promise<void>}
 */
async function apiAddRecordToTable(record,table_name) {
    console.log('api AddRecordToTable called, performing POST request');
        $.ajax({
            url: 'http://localhost:3000/tables/addrecord/'+table_name,
            type: "POST",
            dataType: "json",
            data: record,
            success: function (results) {
            },
            fail: function () {
                console.log("Encountered an error")
            }
        })

}

async function apiUpdateRecord(record){
    console.log('api UpdateRecord called, performing PUT request');
        $.ajax({
            url: 'http://localhost:3000/tables/uprecord/',
            type: "PUT",
            dataType: "json",
            data: record,
            success: function (results) {
            },
            fail: function () {
                console.log("Encountered an error")
            }
        })
}

async function apiGetRecord(record){
    console.log('api GetRecord called, performing GET request');
    return(
        $.ajax({
            url: 'http://localhost:3000/tables/getrecord',
            type: "GET",
            dataType: "json",
            data: record,
            success: function (results) {
            },
            fail: function () {
                console.log("Encountered an error")
            }
        })
    )
}

async function apiDeleteRecord(record){
    console.log('api apiDeleteRecord called, performing DELETE request');
        $.ajax({
            url: 'http://localhost:3000/tables/delrecord' + '\?' +
                'tablename=' + record.tablename +
                '&' +
                'columnname=' + record.column_name +
                '&' +
                'value=' + record.value,
            type: "DELETE",
            dataType: "json",
            success: function (results) {
                console.log('Deletion Success')
            },
            fail: function () {
                console.log("Encountered an error")
            }
        })
}