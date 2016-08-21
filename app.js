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
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff4400"
            },
            {
                "saturation": -68
            },
            {
                "lightness": -4
            },
            {
                "gamma": 0.72
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon"
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#0077ff"
            },
            {
                "gamma": 3.1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#00ccff"
            },
            {
                "gamma": 0.44
            },
            {
                "saturation": -33
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "hue": "#44ff00"
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "hue": "#007fff"
            },
            {
                "gamma": 0.77
            },
            {
                "saturation": 65
            },
            {
                "lightness": 99
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "gamma": 0.11
            },
            {
                "weight": 5.6
            },
            {
                "saturation": 99
            },
            {
                "hue": "#0091ff"
            },
            {
                "lightness": -86
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": -48
            },
            {
                "hue": "#ff5e00"
            },
            {
                "gamma": 1.2
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -64
            },
            {
                "hue": "#ff9100"
            },
            {
                "lightness": 16
            },
            {
                "gamma": 0.47
            },
            {
                "weight": 2.7
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

    // event listener to zoom the area from user input
    document.getElementById('zoom-to-area').addEventListener('click', function() {
      zoomToArea();
    });
  }

    // this function populates the infowindow when the marker is clicked. We'll
    // only allow one infowindow which will open at the marker that is clicked,
    // and populate based on that marker's position
    function populateInfoWindow(marker, infowindow) {
      // check to make sure the infowindow is not akready opened on this marker
      if (infowindow.marker != marker) {
        // clear the infowindow content to give the streetview time to load
        infowindow.setContent('');
        infowindow.marker = marker;
        // make sure the marker property is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function() {
          infowindow.marker =null;
        });
        // create new street view service object, it gets the panorama image
        // based on tht closest location to the marker
        var streetViewService = new google.maps.StreetViewService();
        // define the radius to look for the image within
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
              infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
              var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                  heading: heading,
                  pitch: 30
                }
              };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div>');
          }
        }

        // use street view service to get the closest streetview
        // image within 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // open the infowindow on the correct marker
        infowindow.open(map, marker);
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

    // this function takes the input value in the find nearby area text input
    // locates it, and then zooms into that area. This is so that the user can
    // show all listings, then decide to focus on one area of the map.
    function zoomToArea() {
      // Initialize the geocoder.
      var geocoder = new google.maps.Geocoder();
      // Get the address or place that the user entered.
      var address = document.getElementById('zoom-to-area-text').value;
      // Make sure the address isn't blank.
      if (address == '') {
        window.alert('You must enter an area, or address.');
      } else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode(
          { address: address,
            componentRestrictions: {locality: 'Newcastle, NSW, AU'}
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(15);
            } else {
              window.alert('We could not find that location - try entering a more' +
                  ' specific place.');
            }
          });
      }
    }
