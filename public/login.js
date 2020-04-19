/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 04/19/2020
********************************************/

async function auth(){
        let inputEmail= document.getElementById("usernameInput").value;
        let inputPass = document.getElementById("passwordInput").value;
        let newPage = document.getElementById("submit");
        
        let record = await getRecord(inputEmail);
        
        // Determines if the record with the input email exists or not
        if(record === false){
            loginFailed();
            return;
        }
        
        // It is probably terrible style to store this here
        let userPass = record.password;  // Used for authentication
        let userStatus = record.status;  // Used for authentication

        let userID = record.user_id;     // Used for cookie
        let userLat = record.user_lon;   // Used for cookie 
        let userLon = record.user_lat;   // Used for cookie
        let userType = record.user_type; // Used for cookie

        // Check if password matches email
        if(userPass !== inputPass){
            console.log("password failed");
            loginFailed();
            return;
        }
        // Check if user is blocked
        else if(userStatus !== "active"){
            console.log("active failed");
            loginFailed();
            return;
        }
        
        // **** BAD CONVENTION ****
        // on my local system, I renamed login.html to index.html
        // and then I changed index.html to landing.html
        // ************************
        else {
            alert("Login was successful!\nPlease click the \"Sign In\" button again to complete sign in");
            await buildCookies(userID, userLat, userLon, userType);
            newPage.setAttribute("href", "landing.html");
        }
}

async function loginFailed(){
    alert("INCORRECT LOGIN INFORMATION\nPlease try again");
    let newPage = document.getElementById("submit");
    newPage.setAttribute("href", "index.html");
}

async function getRecord(inputEmail) {
    let get_user_record = {tablename: 'user_table', 
                           column_name: 'email',
                           value: inputEmail};

    let result = await apiGetRecord(get_user_record);
    //console.log(result[0]);
    if(result.length === 0){
        return false;
    }
    return result[0];
}

async function buildCookies(userID, userLat, userLon, userType){
    document.cookie = "user_id=" + userID + ";";
    document.cookie = "user_lat=" + userLat + ";";
    document.cookie = "user_lon=" + userLon + ";";
    document.cookie = "user_type=" + userType + ";";
}
