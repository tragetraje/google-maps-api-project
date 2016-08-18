//  To add the google map on my page:
//  1. Add the script tag to asinchronously load the API (end of index.html body)
//  2. Create a div-element with id='map' in the body of my html
//  3. JS script which initializes and loads the map

var map;

// create a new blank array for all the listing markers
var markers = [];

function initMap() {
    // create a styles array to use with the map
    var styles = [
      {
        "featureType": "water",
        "stylers": [
            {
                "color": "#19a0d8"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "weight": 6
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#e85113"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efe9e4"
            },
            {
                "lightness": -40
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efe9e4"
            },
            {
                "lightness": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "lightness": 100
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": -100
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon"
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "color": "#efe9e4"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "lightness": 100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": -100
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "hue": "#11ff00"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "lightness": 100
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#4cff00"
            },
            {
                "saturation": 58
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#f0e4d3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#efe9e4"
            },
            {
                "lightness": -25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#efe9e4"
            },
            {
                "lightness": -10
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    }
    ];

    // constructor adds a new map, center and zoom are required parameters
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -32.929927, lng: 151.773169 },
        zoom: 16,
        styles: styles,
        mapTypeControl: false
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

    // style the markers, this is a listing marker icon
    var defaultIconColor = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    // "highlighted location" marker color for when the user mouses over the
    // marker
    var highlightedIconColor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';


    // create an array of markers for the locations
    for (var i = 0; i < locations.length; i++) {
        // get the position from the location array
        var position = locations[i].location;
        var title = locations[i].title;
        // create a marker per location and put into markers array
        var marker = new google.maps.Marker({
            //map: map,
            position: position,
            title: title,
            icon: defaultIconColor,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // push the marker to our array of markers
        markers.push(marker);

        // create an onclick event to open an infowindow at each marker
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
        // two event listeners to change the color of the marker - one for
        // mouseover and for mouseout
        marker.addListener('mouseover', function() {
          this.setIcon(highlightedIconColor);
        });
        marker.addListener('mouseout', function() {
          this.setIcon(defaultIconColor);
        });
    }
    // create the event listeners to show and hide the listings when the button
    // is clicked
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
  }

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

    // this function will loop through the markers array and display them allow
    function showListings() {
      // for the listings which are outside of initial zoom area, adjust // the boundaries of the map
      var bounds = new google.maps.LatLngBounds();
      // extend the boundaries of the map for each marker
      for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
      }
      // tell the map to fit the bounds
      map.fitBounds(bounds);
    }

    // this function will loop through the markers array and hide them allow
    function hideListings() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    }
