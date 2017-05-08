function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 11
    };
    var html_element = document.getElementById("googleMap");
    var map = new google.maps.Map(html_element, mapProp);

    var point = new google.maps.LatLng(50.464379, 30.519131);
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });

    var home_marker = new google.maps.Marker({
        map: map,
        icon: "assets/images/home-icon.png"
    });

    var directionDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionDisplay.setMap(map);

    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, address) {
            if (!err) {
                $('#address-info').text(address);
                $('#address').val(address);
                home_marker.setPosition(coordinates);
            }
            else {
                $('#address-info').text("Немає адреси");
                $('#address').val("Немає адреси");
            }
        })
        calculateRoute(point, coordinates, directionDisplay,  function (err, duration) {
            if (err) {
                $('#time-info').text("Немає адреси");
            }
        })

    });

    $('#address').bind('input', function () {
        var address = $(this).val();
        if (address.length > 2) {
            geocodeAddress(address, function (err, coordinates) {
                if (!err) {
                    $('#address-info').text(address);
                    map.setCenter(coordinates);
                    home_marker.setPosition(coordinates);
                }
                else console.log("Немає адреси");
            })
        }


    });

}

function geocodeLatLng(latlng, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        var address = $('#address-form');
        var e = $('#ad-error');
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var adress = results[1].formatted_address;
            address.addClass('has-success');
            address.removeClass('has-error');
            e.hide();
            callback(null, adress);
        } else {
            address.removeClass('has-success');
            address.addClass('has-error');
            e.show();
            callback(new Error("Can't find adress"));
        }
    });
}

function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        var address = $('#address-form');
        var e = $('#ad-error');
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            address.addClass('has-success');
            address.removeClass('has-error');
            e.hide();
            callback(null, coordinates);
        } else {
            address.removeClass('has-success');
            address.addClass('has-error');
            e.show();
            callback(new Error("Can't find the adress"));
        }
    });
}
function calculateRoute(A_latlng, B_latlng, directionDisplay, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionDisplay.setDirections(response);
            var leg = response.routes[0].legs[0];
            $("#time-info").text(leg.duration.text);
            callback(null);
        } else {
            callback(new Error("Can'not	find direction"));
        }
    });
}

// google.maps.event.addDomListener(window, 'load', initialize);
exports.initialize = initialize;

