function displayShows() {
    var urlParams = new URLSearchParams(window.location.search);
    var q = urlParams.get('q');
    console.log(q);
    //change var artist = to: $("searchbar").val()
    var showAPI_URL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=" + q + "&apikey=noHazJHm5x0GrV21AbEv7JKS4WVzGswJ"
    $.ajax({
        url: showAPI_URL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var events = response._embedded.events;

        for (var s = 0; s < events.length; s++) {


            var show = events[s].name;
            var location = events[s]._embedded.venues[0].city.name;
            var date = events[s].dates.start.localDate;
            var convertedDate = moment(date, "YYYY/MM/DD").format("MM/DD/YYYY");

            var newDiv = $("<tr class='mb-3'>");
            var showCol = $("<td>")
            var showURL = showCol.append("<a href='" + response._embedded.events[s].url + "'>" + show + "</a>")
            var locCol = $("<td>").text(location);
            var dateCol = $("<td>").text(convertedDate)

            newDiv.append(showURL, locCol, dateCol);
            $("#showsTable").append(newDiv)

        }
    })
}
//display image
//display name
function displayFood() {

    var city = "charlotte";
    var foodAPI_URL = "https://developers.zomato.com/api/v2.1/search?q=" + city + "&count=4&sort=rating";

    $.ajax({
        headers: { "user-key": "8ceaf126b0d71b209d1b93d94063371d" },
        url: foodAPI_URL,
        method: "GET"
    }).then(function (restaurants) {


        var food = restaurants.restaurants

        for (var f = 0; f < food.length; f++); {

        }
    })
}

$("#search-button").on("click", function (event) {
    event.preventDefault();
    displayShows();
})
displayShows();
displayFood();