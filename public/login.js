/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 04/07/2020
********************************************/

/** Required to use passport.js:
 * NOTE: passport is currently not being utilized, for now, I will
 * consider it a "nice to have"
 * npm install passport-google-oauth
 * 
 */

// Hardcoded dict to store "existing users" 
// This is just to ensure the authentication logic is valid
// Later implentation will have DB queries and/or passport.js to communicate
// with external data, etc.
var users = {'BillyBob@hello.ca':1234, 'JaneDoe@hi.com':1234};


function auth(){
        let username = document.getElementById("usernameInput").value;
        let password = document.getElementById("passwordInput").value;
        let newPage = document.getElementById("submit");

        if(users[username] == password){
            newPage.setAttribute("href", "index.html");
        }
        // If password doesn't match, alert user of sign-in failure
        else {
            newPage.setAttribute("href", "login.html");
        }
}
