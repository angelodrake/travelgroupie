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
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

// authorization layout
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //write user data and toggle buttons if login succesful
    $(".logout-btn").removeClass("hide");
    $(".signin-btn").addClass("hide");
    $(".createId-btn").addClass("hide");
    $(".firebase-message1").text("");
    userAuthenticated = true;
    console.log("User logged in");
  } else {
    // No user is signed in.
    console.log("User logged out");
    $(".logout-btn").addClass("hide");
    $(".signin-btn").removeClass("hide");
    $(".createId-btn").removeClass("hide");
    $(".firebase-message1").text("");
    userAuthenticated = false;
  }
});

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
var database = firebase.database();

function writeUserData() {
  var userEmail = $(".usr").val();
  var userData = "placeholder";
  var userID = firebase.auth().currentUser.uid;
  firebase
    .database()
    .ref("users/" + userID)
    .set({
      username: userEmail,
      favorites: userData
    });
}

function displayShows() {
  var urlParams = new URLSearchParams(window.location.search);
  var q = urlParams.get("q");

  //change var artist = to: $("searchbar").val()
  var showAPI_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=" +
    q +
    "&apikey=noHazJHm5x0GrV21AbEv7JKS4WVzGswJ";
  $.ajax({
    url: showAPI_URL,
    method: "GET"
  }).then(function(response) {
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
    food = input.restaurants;

    for (var f = 0; f < food.length; f++) {
      var name = food[f].restaurant.name;
      var type = food[f].restaurant.cuisines;
      var image = food[f].restaurant.featured_image;
      var restURL = food[f].restaurant.url;

      var newDiv = $("<div>");
      var newImg = $(
        "<a href='" +
          restURL +
          "'><img class='zomatoImg' src='" +
          image +
          "'></a>"
      );
      newDiv.append(newImg, " | ", name, "<br>", type, "<hr>");
      $("#zomato").append(newDiv);
    }
  });
}

//show and hide user menu
$("#login-btn").on("click", function() {
  $("#mainMenu").toggleClass("hide");
  $("#login-btn").toggleClass("hide");
});
$("#close").on("click", function() {
  $("#mainMenu").toggleClass("hide");
  $("#login-btn").toggleClass("hide");
});
$("#search-button").on("click", function(event) {
  event.preventDefault();
  displayShows();
});
//log-in button
$(".signin-btn").on("click", function login() {
  var userEmail = $(".usr").val();
  var userPw = $(".pwd").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPw)
    .catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
      $(".firebase-message1").text(errorMessage);
    });
});

$(".createId-btn").on("click", function login() {
  var userEmail = $(".usr").val();
  var userPw = $(".pwd").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPw)
    .catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
      $(".firebase-message1").text(errorMessage);
    })
    .then(writeUserData);
});
//log out button
$(".logout-btn").on("click", function loginout() {
  firebase.auth().signOut();
  $(".logout-btn").toggleClass("hide");
  $(".signin-btn").toggleClass("hide");
  $(".createId-btn").toggleClass("hide");
  $(".firebase-message1").text("");
});

displayShows();
displayFood();
