var map;

function Display(response) {
    document.getElementById('pos').innerHTML = '<div><p>lon: ' + response.xpos + '</p><p>lat: ' + response.ypos + '</p><p>alt: ' + response.alt + '</p><p>hdg: ' + response.hdg + '</p><p>spped(kias): ' + response.kias + '</p><p>time: ' + response.time + '</p></div>';
    var position = {lat: response.ypos, lng: response.xpos};
    var marker = new google.maps.Marker({position: position, map: map});
}

function getData() {
    var home = document.getElementById('home').value;
    var isValid = true;
    var isGood = true;
    if( isValid ) {
        $.ajax({
            url: '/serverpages/pos/' + home + '/',
            dataType: 'JSON',
            method: 'PUT'
        })
        .done(function(responseIn) {
            var response = responseIn;
            Display(response);
            var element = document.getElementById('indiv');
            element.classList.add("hide");
        })
        .fail(function (data) {
            isGood = false;
            console.log('There was an error retrieving the info. Check the Address or try again later.');
        });

        if(isGood){
            const interval = setInterval(function() {
                $.ajax({
                    url: '/serverpages/pos/',
                    dataType: 'JSON',
                })
                .done(function(responseIn) {
                    var response = responseIn;
                    Display(response);
                })
                .fail(function (data) {
                    console.log('There was an error retrieving the info. Check the Address or try again later.');
                });
            }, 5000);
        };
    } else {
        body.ThrowError('Invalid Address','Please have home, city, state, and zip')
    }
}

function initMap() {
    // The location of the beginning
    var position = {lat: 34.6498217, lng: -112.4294277};
    // The map, centered at the beginning
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: position});
        // The marker, positioned at the beginning
        var marker = new google.maps.Marker({position: position, map: map});
        map.setZoom(12);
  }
