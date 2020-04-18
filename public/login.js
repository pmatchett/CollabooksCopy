/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 04/18/2020
********************************************/


// Hardcoded dict to store "existing users" 
// This is just to ensure the authentication logic is valid
// Later implentation will have DB queries and/or passport.js to communicate
// with external data, etc.
var users = {'BillyBob@hello.ca':1234, 'JaneDoe@hi.com':1234};


function auth(){
        let inputEmail= document.getElementById("usernameInput").value;
        let inputPass = document.getElementById("passwordInput").value;
        

        // let userID = 
        // let userEmail = 
        // let userPass = 
        // let userStatus = 
     
        let newPage = document.getElementById("submit");
        r = checkEmail(inputEmail)
        console.log("r = " + r)
        // Check if email exists
        if(checkEmail(inputEmail) === false){
            loginFailed();
            return;
        }/*
        // Check if password matches email
        else if(!passwordMatches(inputEmail, inputPass)){
            loginFailed();
            return;
        }
        // Check if user is blocked
        else if(!isActiveUser(inputEmail)){
            loginFailed();
            return;
        }
        */
        // **** BAD CONVENTION ****
        // on my local system, I renamed login.html to index.html
        // and then I changed index.html to index1.html
        // ************************
        else {
            //alert("SUCCESS")
            //newPage.setAttribute("href", "index1.html");
        }

}

function loginFailed(){
    alert("INCORRECT LOGIN INFORMATION\nPlease try again")
    let newPage = document.getElementById("submit");
    newPage.setAttribute("href", "index.html");
}

async function checkEmail(inputEmail) {
    let get_user_record = {tablename: 'user_table', 
                           column_name: 'email',
                           value: inputEmail};

    let result = await apiGetRecord(get_user_record);
    console.log(result)
    console.log(result.length)

    if(result.length === 0){
        return false;
    }
    else {
        return true;
    }
}

async function passwordMatches(inputEmail, inputPass) {
    let get_user_record = {tablename: 'user_table', 
                           column_name: 'email',
                           column_name: 'password',
                           value: inputEmail, 
                           value: inputPass  };

    let result = await apiGetRecord(get_user_record);
    console.log(result)

    if(result.length === 0){
        return false;
    }
    else {
        return true;
    }
}

async function isActiveUser(inputEmail) {
    let get_user_record = {tablename: 'user_table', 
                           column_name: 'email',
                           column_name: 'status',
                           value: inputEmail, 
                           value: 'active'  };

    let result = await apiGetRecord(get_user_record);
    console.log(result)

    if(result.length === 0){
        return false;
    }
    else {
        return true;
    }
}