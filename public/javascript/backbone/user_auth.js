console.log('test loaded')

$(function() {
  	getSession();

  	//delegate buttons for logout, append to the bottom of 
})

var getSession = function(){
	$.ajax("/session", {
       type: "GET",
       dataType: "json",
       success: function(result) {
         console.log(result)

         if(result.name == null || result.name == undefined){
            $('#input_ui').empty();
            //show the user input template
          	App.loginView = new App.Views.LoginView();
            
            return false;
         }else {
            console.log('we have a user')
            $('#input_ui').empty();
            App.currentUserView = new App.Views.CurrentUserView();
            //show the user info template
            //add a button to the button of the sidebar for logout, kills the session
            //no user
            return true;
         }
       },
       error: function() {
        console.log(result)
       }
     });
}