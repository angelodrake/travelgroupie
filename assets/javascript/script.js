var userAuthenticated = false;
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCi5XqbAdfXV9xrLdO_vyb5cu1WbzD7ezE",
  authDomain: "travelgroupie-74ca0.firebaseapp.com",
  databaseURL: "https://travelgroupie-74ca0.firebaseio.com",
  projectId: "travelgroupie-74ca0",
  storageBucket: "travelgroupie-74ca0.appspot.com",
  messagingSenderId: "233607634113"
};
firebase.initializeApp(config);

// authorization layout
// firebase.auth().onAuthStateChanged(function (user) {

//     if (user) {
//         // User is signed in.
//         $('#login-btn').css("display", "none")
//         $('#register-btn').css("display", "none") //buttons gone

//         $('.user_div').css("display", "block"); //only welcome
//         $('.login_div').css("display", "none")
//         $('.register_div').css("display", "none")

//         var userId = firebase.auth().currentUser.uid;

//         if (user != null) {

//         //     /////////////////////////////////////
//         //     var userEmail = $('usr').val()
//         //   //////////////////////////////////////////
//             $('#welcome-message').text('welcome back user :' + user.email);

//         }

//     } else {
//         // No user is signed in.
//         $('#login-btn').css("display", "block")
//         $('#register-btn').css("display", "block") // only 2 buttons

//         $('.user_div').css("display", "none");
//         $('.login_div').css("display", "none")
//         $('.register_div').css("display", "none")
//     }
// });

//log-in button
$(".signin-btn").on("click", function login() {
  var userEmail = $(".usr").val();
  var userPw = $(".pwd").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPw)

    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      $(".firebase-message1").text(errorMessage);
    });
  $(".logout-btn").toggleClass("hide");
  $(".signin-btn").toggleClass("hide");
  $(".createId-btn").toggleClass("hide");
});

//log out button
$(".logout-btn").on("click", function loginout() {
  firebase.auth().signOut();
  $(".logout-btn").toggleClass("hide");
  $(".signin-btn").toggleClass("hide");
  $(".createId-btn").toggleClass("hide");
});

var database = firebase.database();

//create account button
$("#createId-btn").on("click", function createAcc() {
  var userEmail = $("#usr").val();
  var userPw = $("#pwd").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPw)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(userEmail);
      console.log(userPw);
      console.log(error.code);
      console.log(error.message);
      $(".firebase-message1").text(error.message);
    });
  $(".logout-btn").toggleClass("hide");
  $(".signin-btn").toggleClass("hide");
  $(".createId-btn").toggleClass("hide");
  writeUserData();
});

// pushing some user info to firebase
function writeUserData(userEmail, uid) {
  var uid = firebase
    .database()
    .ref()
    .child("users")
    .push().key;
  var userEmail = $(".usr").val();

  var data = {
    user_id: uid,
    userEmail: userEmail
  };

  var updates = {};
  updates["/users/" + uid] = data;
  firebase
    .database()
    .ref()
    .update(updates);
}

// // push search history
// $("#search-btn").on("click", function() {
//   pushArtist();
// });

// function pushArtist(artist) {
//   var artist = $("#searchInput")
//     .val()
//     .trim();

//   // var uid = firebase.database().ref().child('users').push().key;
//   // var userEmail = $('#email-field2').val();

//   var data = {
//     //  user_id: uid,
//     //  userEmail: userEmail
//     artist: artist
//   };

//   var updates = {};
//   updates["/users/" + uid] = data;
//   firebase
//     .database()
//     .ref()
//     .update(updates);
// }

//show and hide user menu
$("#login-btn").on("click", function() {
  $("#mainMenu").toggleClass("hide");
  $("#login-btn").toggleClass("hide");
});
$("#close").on("click", function() {
  $("#mainMenu").toggleClass("hide");
  $("#login-btn").toggleClass("hide");
});

function displayShows() {
  var urlParams = new URLSearchParams(window.location.search);
  var q = urlParams.get("q");
  console.log(q);
  //change var artist = to: $("searchbar").val()
  var showAPI_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=" +
    q +
    "&apikey=noHazJHm5x0GrV21AbEv7JKS4WVzGswJ";
  $.ajax({
    url: showAPI_URL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    var events = response._embedded.events;

    for (var s = 0; s < events.length; s++) {
      var show = events[s].name;
      var location = events[s]._embedded.venues[0].city.name;
      var date = events[s].dates.start.localDate;
      var convertedDate = moment(date, "YYYY/MM/DD").format("MM/DD/YYYY");

      var newDiv = $("<tr class='mb-3'>");
      var showCol = $("<td>");
      var showURL = showCol.append(
        "<a href='" + response._embedded.events[s].url + "'>" + show + "</a>"
      );
      var locCol = $("<td>").text(location);
      var dateCol = $("<td>").text(convertedDate);

      newDiv.append(showURL, locCol, dateCol);
      $("#showsTable").append(newDiv);
    }
  });
}
function displayFood() {
  //delete var on location (global)
  var location = "charlotte";
  var foodAPI_URL =
    "https://developers.zomato.com/api/v2.1/search?q=" +
    location +
    "&count=4&sort=rating";

  $.ajax({
    headers: { "user-key": "8ceaf126b0d71b209d1b93d94063371d" },
    url: foodAPI_URL,
    method: "GET"
  }).then(function(input) {
    console.log(input);

    food = input.restaurants;

    for (var f = 0; f < food.length; f++) {
      console.log(food[f]);
      var name = food[f].restaurant.name;
      console.log(name);
      var type = food[f].restaurant.cuisines;
      console.log(type);
      var image = food[f].restaurant.featured_image;
      console.log(image);
      var restURL = food[f].restaurant.url;
      console.log(restURL);

      var newDiv = $("<div>");
      var newImg = $(
        "<a href='" +
          restURL +
          "'><img class='zomatoImg' src='" +
          image +
          "'></a>"
      );
      newDiv.append(name, type, newImg);
      $("#zomato").append(newDiv);
    }
  });
}

$("#search-button").on("click", function(event) {
  event.preventDefault();
  displayShows();
});
displayShows();
displayFood();
