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

    var userId = firebase.auth().currentUser.uid;

    firebase
      .database()
      .ref("/users/" + userId)
      .once("value")
      .then(function(snapshot) {
        var fav = snapshot.val().favorites;

        $(".user-list").empty();
        for (i = 1; i < fav.length; i++) {
          var favLink = $("<a>");
          var link = "shows.html";
          favLink.text(fav[i]);
          favLink.addClass("fav-links");
          favLink.attr("href", link);

          $(".user-list").append(favLink);
          $(".user-list").append("<br> <br>");
        }
      });
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

function displayShows() {
  var urlParams = new URLSearchParams(window.location.search);
  var q = urlParams.get("q");

  //change var artist = to: $("searchbar").val()
  var showAPI_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" +
    q +
    "&apikey=noHazJHm5x0GrV21AbEv7JKS4WVzGswJ";
  $.ajax({
    url: showAPI_URL,
    method: "GET"
  }).then(function(response) {
    var events = response._embedded.events;
    console.log(events);
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
  console.log(foodAPI_URL);

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
      favorites.push(newFav);

      var userID = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref("users/" + userID)
        .child("favorites")
        .set(favorites);
    });
}

//show and hide user menu
$("#login-btn").on("click", function() {
  $("#mainMenu").animate({
    width: '300px'
  })
  $("#login-btn").toggleClass("hide");
});
$("#close").on("click", function() {
  $("#mainMenu").animate({
    width: '0px'
  })
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
  // $(".logout-btn").toggleClass("hide");
  // $(".signin-btn").toggleClass("hide");
  // $(".createId-btn").toggleClass("hide");
  // $(".firebase-message1").text("");
});
$(document).on("click", ".show-link", function() {
  var eventImage = $(this).attr("data-photo");
  var eventInfo = $(this).attr("data-info");
  var eventTitle = $(this).text();
  var eventTickets = $(this).attr("data-url");
  var foodLocation = $(this).attr("data-location");
  console.log(foodLocation);

  displayFood(foodLocation);

  $("#detailsImg").attr("src", eventImage);
  $("#detailsText").text(eventInfo);
  $("#detailsTitle").text(eventTitle);
  $("#buyTickets").attr("href", eventTickets);
  $("#infoDiv").removeClass("hide");
});
$(document).on("click", ".fa-star", function(event) {
  event.preventDefault;
  pushFavorite();
});
$(document).on("click", ".fav-links", function(event) {
  favSearch = $(this).text();
  $("#searchInput").val(favSearch);
  $("#search-button").trigger("click");
});

displayShows();

