//  To add the google map on my page:
//  1. Add the script tag to asinchronously load the API (end of index.html body)
//  2. Create a div-element with id='map' in the body of my html
//  3. JS script which initializes and loads the map

var map;

// create a new blank array for all the listing markers
var markers = [];

function initMap() {
    // constructor adds a new map, center and zoom are required parameters
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -32.929927, lng: 151.773169 },
        zoom: 16
    });

    // these are the coffee shops which are going to be shown to the user
    // normally they'd be in a database instead
    var locations = [
      {title: 'Good Brother', location: {lat: -32.928679, lng: 151.783334}},
      {title: 'Estabar', location: {lat: -32.929146, lng: 151.786079}},
      {title: 'Welsh Blacks', location: {lat: -32.930378, lng: 151.767951}},
      {title: 'One Penny Black', location: {lat: -32.926505, lng: 151.779786}},
      {title: 'Goldberg\'s Coffee House', location: {lat: -32.931763, lng: 151.771757}},
      {title: 'Saluna', location: {lat: -32.927402, lng: 151.778234}}
    ];

    // create infowindow object for a marker to display information, pics etc.
    var largeInfowindow = new google.maps.InfoWindow();
    // for the listings which are outside of initial zoom area, adjust the
    // boundaries of the map
    var bounds = new google.maps.LatLngBounds();
    // create an array of markers for the locations
    for (var i = 0; i < locations.length; i++) {
        // get the position from the location array
        var position = locations[i].location;
        var title = locations[i].title;
        // create a marker per location and put into markers array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: 1
        });
        // push the marker to our array of markers
        markers.push(marker);
        // extend the boundaries of the map for each marker
        bounds.extend(marker.position);
        // create and onclick event to open an infowindow at each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }
    // tell the map to fit the bounds
    map.fitBounds(bounds);

    // this function populates the infowindow when the marker is clicked. We'll
    // only allow one infowindow which will open at the marker that is clicked,
    // and populate based on that marker's position
    function populateInfoWindow(marker, infowindow) {
      // check to make sure the infowindow is not akready opened on this marker
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // make sure the marker property is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function() {
          infowindow.setMarker(null);
        });
      }
    }


}
