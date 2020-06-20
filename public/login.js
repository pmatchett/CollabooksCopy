/************************** SENG513 Final Project ***************************
       _____ ____  _      _               ____   ____   ____  _  __ _____
     / ____/ __ \| |    | |        /\   |  _ \ / __ \ / __ \| |/ // ____|
    | |   | |  | | |    | |       /  \  | |_) | |  | | |  | | ' /| (___
    | |   | |  | | |    | |      / /\ \ |  _ <| |  | | |  | |  <  \___ \
    | |___| |__| | |____| |____ / ____ \| |_) | |__| | |__| | . \ ____) |
    \_____\____/|______|______/_/    \_|____/ \____/ \____/|_|\_|_____/

            ______......-----~~~~~~~--..__   __..--~~~~~~~-----......______
          //   Members:                   `V'                            \\
        //        Jasmine Cronin          |           Ashley Millette    \\
      //       Brandt Davis              |         Siobhan O’Dell        \\
    //     Patrick Matchett             |        Kent Wong               \\
  //_______......------~~~~~~~~--..__  | __..--~~~~~~~~-----......_______\\
//_______..........------~~~~~~...__\ | /__...~~~~~~------........_______\\
===================================\\|//===================================
                                  `----`
                          Created On: 11/03/2020
                        Last revision: 19/04/2020
****************************************************************************/
$(document).ready(function(){
  $("#loginButton").click(async function auth(){


          let inputEmail= document.getElementById("usernameInput").value;
          let inputPass = document.getElementById("passwordInput").value;
          let newPage = document.getElementById("submit");

          const response = await sendLoginRequest(inputEmail,inputPass);

          let result = response.result;

          if(result === "login failed"){
            loginFailed();
            console.log("failed to login");
          }
          else if(result === "banned"){
            loginBanned();
            console.log("user is banned");
          }
          else if(result === "success"){
            console.log("user loged in");
            let destination = response.location;
            console.log(destination);
            window.location.replace(destination);
          }



          /*let record = await getRecord(inputEmail);

          // Determines if the record with the input email exists or not
          if(record === false){
              loginFailed();
              return;
          }

          // It is probably terrible style to store this here
          let userPass = record.password;  // Used for authentication
          let userStatus = record.user_status;  // Used for authentication

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
          else if(userStatus !== 'a'){
              console.log("active failed");
              loginFailed();
              return;
          }

          // **** BAD CONVENTION ****
          // on my local system, I renamed login.html to index.html
          // and then I changed index.html to index1.html
          // ************************
          else {
              $('#loginAlertMessage').text("Login was successful!\nPlease click the \"Sign In\" button again to complete sign in");
              $('#loginAlertDialog').modal('show');
              await buildCookies(userID, userLat, userLon, userType);
              newPage.setAttribute("href", "landing.html");
          }*/
  });

  async function sendLoginRequest(email, pass){
    let data = {"email":email, "password":pass};
    let response = $.ajax({
        url: 'http://localhost:3000/login',
        type: "POST",
        dataType: "json",
        data: data,
    });
    response.done(function(msg){
      console.log("received response"+msg);
    });
    response.fail(function(jqXHR, textStatus){
      console.log("request failed: "+textStatus);
    });

    return response;

  }



  async function loginFailed(){
      $('#loginAlertMessage').text("Incorrect Login Information...\nPlease try again");
      $('#loginAlertDialog').modal('show');
      $("#usernameInput").val("");
      $("#passwordInput").val("");
  }

  async function loginBanned(){
    $('#loginAlertMessage').text("This user is currently banned, contact moderators for more details");
    $('#loginAlertDialog').modal('show');
    $("#usernameInput").val("");
    $("#passwordInput").val("");
  }

  /*async function getRecord(inputEmail) {
      let get_user_record = {
        tablename: 'user_table',
        column_name: 'email',
        value: inputEmail
      };

      let result = await apiGetRecord(get_user_record);
      console.log("got data from DB");

      if(result.length === 0){
          return false;
      }
      return result[0];
  }*/

  /*async function buildCookies(userID, userLat, userLon, userType){
      document.cookie = "user_id=" + userID + ";";
      document.cookie = "user_lat=" + userLat + ";";
      document.cookie = "user_lon=" + userLon + ";";
      document.cookie = "user_type=" + userType + ";";
  }*/
});
