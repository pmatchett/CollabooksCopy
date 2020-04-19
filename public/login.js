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

async function auth(){
        let inputEmail= document.getElementById("usernameInput").value;
        let inputPass = document.getElementById("passwordInput").value;
        

        // let userID = 
        // let userEmail = 
        // let userPass = 
        // let userStatus = 
     
        let newPage = document.getElementById("submit");
        emailStatus = await checkEmail(inputEmail)
        passwordStatus = await passwordMatches(inputEmail, inputPass)
        activeStatus = await isActiveUser(inputEmail)

        // Check if email exists
        if(emailStatus === false){
            console.log("Email failed")
            loginFailed();
            return;
        }
        // Check if password matches email
        else if(passwordStatus === false){
            console.log("password failed")
            loginFailed();
            return;
        }
        // Check if user is blocked
        else if(activeStatus === false){
            console.log("active failed")
            loginFailed();
            return;
        }
        
        // **** BAD CONVENTION ****
        // on my local system, I renamed login.html to index.html
        // and then I changed index.html to index1.html
        // ************************
        else {
            //alert("SUCCESS")
            newPage.setAttribute("href", "index1.html");
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