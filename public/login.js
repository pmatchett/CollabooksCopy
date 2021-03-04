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

});
