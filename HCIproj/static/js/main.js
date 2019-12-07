var body;
body = {
    $content: $('#content'),
    $form: $("#input"),
    $pos: $("#pos"),
    userInputIsValid: true,
    map: '',
    marker: '',
    home: '',
    xpos: '',
    ypos: '',

    ThrowError: function (header, text) {
        this.$content
            .html('<p><strong>' + header + '</strong> ' + text + '</p>');
    },

    Validate: function () {
        if (this.home == '') {
            body.userInputIsValid = false;
        }
    },

    GetInputs: function () {
        this.home = $("#home").val();
    },

    Display: function (response) {
        this.xpos = response.xpos;
        this.ypos = response.ypos;
        this.$pos.html("<div id=\"pos\"><p>lon: ' + this.xpos + '</p><p>lat: ' + this.ypos + '</p><p>alt: ' + response.alt + '</p><p>hdg: ' + response.hdg + '</p><p>spped(kias): ' + response.kias + '</p><p>time: ' + response.time + '</p></div>");
        document.getElementById("content").reset();
    }  
};

$(document).ready(function(){
    $('#btn').on('click', function (e) {
        e.preventDefault();
        body.GetInputs();
        body.Validate();
        var isGood = true;
        if( body.userInputIsValid ) {
            $.ajax({
                url: '/serverpages/pos/' + body.home + '/',
                dataType: 'JSON',
                method: 'PUT'
            })
            .done(function(responseIn) {
                var response = responseIn;
                body.Display(response);
            })
            .fail(function (data) {
                isGood = false;
                body.ThrowError(
                    'API Error',
                    'There was an error retrieving the info. Check the Address or try again later.'
                );
            });

            if(isGood){
                const interval = setInterval(function() {
                    $.ajax({
                        url: '/serverpages/pos/',
                        dataType: 'JSON',
                    })
                    .done(function(responseIn) {
                        var response = responseIn;
                        body.Display(response);
                    })
                    .fail(function (data) {
                        body.ThrowError(
                            'API Error',
                            'There was an error retrieving the info. Check the Address or try again later.'
                        );
                    });
                }, 5000);
            };
        } else {
            body.ThrowError('Invalid Address','Please have home, city, state, and zip')
        }
    })
});

function initMap() {
    // The location of the beginning
    var position = {lat: 34.6498217, lng: -112.4294277};
    // The map, centered at the beginning
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: position});
        // The marker, positioned at the beginning
        var marker = new google.maps.Marker({position: position, map: map});
        map.setZoom(13);
}

