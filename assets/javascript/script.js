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
    $("#userLogin").addClass("hide");
    $("#userFav").removeClass("hide");
    $(".firebase-message1").text("");
    userAuthenticated = true;
    console.log("User logged in");
    pullUserData();
    // ...
  } else {
    // No user is signed in.
    console.log("User logged out");
    $(".logout-btn").addClass("hide");
    $("#userLogin").removeClass("hide");
    $("#userFav").addClass("hide");
    $(".firebase-message1").text("");
    userAuthenticated = false;
  }
});

var database = firebase.database();
//push user data on registration to database
function writeUserData() {
  var userEmail = $(".usr").val();
  var userData = [0];
  var userID = firebase.auth().currentUser.uid;
  firebase
    .database()
    .ref("users/" + userID)
    .set({
      username: userEmail,
      favorites: userData
    });
}

function pullUserData() {
  var userId = firebase.auth().currentUser.uid;

  firebase
    .database()
    .ref("/users/" + userId)
    .once("value")
    .then(function(snapshot) {
      var fav = snapshot.val().favorites;
      console.log(fav);
      $(".user-list").empty();
      for (i = 1; i < fav.length; i++) {
        console.log("hey");
        var favLink = $("<a>");
        var link = fav[i].url;
        favLink.text(fav[i][0]);
        favLink.addClass("fav-links");
        favLink.attr("href", link);

        $(".user-list").append(favLink);
        $(".user-list").append("<br> <br>");
      }
    });
}

function displayShows() {
  var urlParams = new URLSearchParams(window.location.search);
  var q = urlParams.get("q");

  //change var artist to user input
  var showAPI_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" +
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
      var photo = events[s].images[2].url;
      var showInfo = events[s].ticketLimit.info;
      var ticketMaster = events[s].url;
      var convertedDate = moment(date, "YYYY/MM/DD").format("MM/DD/YYYY");

      var newDiv = $("<tr class='mb-3'>");
      var showCol = $("<td>");
      var showURL = showCol.append(
        "<a href='#' data-location='" +
          location +
          "'data-url='" +
          ticketMaster +
          "' data-date='" +
          convertedDate +
          "' data-info='" +
          showInfo +
          "' data-photo='" +
          photo +
          "' class='show-link'>" +
          show +
          " </a>"
      );
      var locCol = $("<td>").text(location);
      var dateCol = $("<td>").text(convertedDate);

      newDiv.append(showURL, locCol, dateCol);
      $("#showsTable").append(newDiv);
    }
  });
}

function displayFood(city) {
  //delete var on location (global)
  var location = "charlotte";
  var foodAPI_URL =
    "https://developers.zomato.com/api/v2.1/search?q=" +
    location +
    "&count=4&sort=rating";

  $.ajax({
    headers: { "user-key": "25393e0be571d9d77efecdb57524950b" },
    url: foodAPI_URL,
    method: "GET"
  }).then(function(input) {
    food = input.restaurants;
    $("#zomato").empty();
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

function pushFavorite() {
  //get user fav array
  var userId = firebase.auth().currentUser.uid;

  firebase
    .database()
    .ref("/users/" + userId)
    .once("value")
    .then(function(snapshot) {
      //read fav array
      var favorites = snapshot.val().favorites;
      var newFav = $("#detailsTitle").text();
      var url = window.location.href;
      // favorites.push(newFav);

      var userID = firebase.auth().currentUser.uid;
      // firebase
      //   .database()
      //   .ref("users/" + userID)
      //   .child("favorites")
      //   .set(favorites);
      firebase
        .database()
        .ref("users/" + userID + "/favorites/" + newFav)
        .child("url")
        .set(url);
    });
  database
    .ref("users/" + userId + "/favorites")
    .on("child_added", function(snap) {
      pullUserData();
    });
}

//on click handler for menu slide out
$("#login-btn").on("click", function() {
  $("#mainMenu").animate({
    width: "300px"
  });
  $("#login-btn").toggleClass("hide");
});
//on click handler for closing menu
$("#close").on("click", function() {
  $("#mainMenu").animate({
    width: "0px"
  });
  $("#login-btn").toggleClass("hide");
});
//on click handler for search bar on navigation page
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
//on click handler for user registration
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
// on click handler for log out button
$(".logout-btn").on("click", function loginout() {
  firebase.auth().signOut();
});
//on click handler for showing large show info
$(document).on("click", ".show-link", function() {
  var eventImage = $(this).attr("data-photo");
  var eventInfo = $(this).attr("data-info");
  var eventTitle = $(this).text();
  var eventTickets = $(this).attr("data-url");
  var foodLocation = $(this).attr("data-location");

  displayFood(foodLocation);

  $("#detailsImg").attr("src", eventImage);
  $("#detailsText").text(eventInfo);
  $("#detailsTitle").text(eventTitle);
  $("#buyTickets").attr("href", eventTickets);
  $("#infoDiv").removeClass("hide");
});
//on click handler for adding user favorite
$(document).on("click", ".fa-star", function(event) {
  event.preventDefault;
  pushFavorite();
});
//on click handler for searching with user favorite
// $(document).on("click", ".fav-links", displayFavShows);

displayShows();
