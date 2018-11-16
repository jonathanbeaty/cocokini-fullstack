$.getJSON('http://localhost:8080/products', function (data) {

    $("#apiContainer").append(`<img id="onepic" src="${data[0].picture.url}" style="width:100%;">`);

});

$.getJSON('http://localhost:8080/api/user', function (data) {

    console.log(data);

});

$.getJSON('http://localhost:8080/events', function (data) {

    $("#farmers").append(`<img class="ev1" src="${data[0].picture.url}" height="225px;"> <div style="font-size: 20px;" class="centered">the island farmers and art market</br>·
    june 8th ·</br>corpus christi, tx</div>`);
    $("#swimweek").append(`<img class="ev1" src="${data[1].picture.url}" height="225px;"><div style="font-size: 20px;" class="centered">miami swim week</br>· july 16th ·</br>miami,
    fl</div>`);
    $("#localslist").append(`<img class="ev1" src="${data[2].picture.url}" height="225px;"><div style="font-size: 20px;" class="centered">the locals list party</br>· tbd ·</br>corpus
    christi, tx</div>`);

});

function handleCreateAccount() {
    $(".signup-form").submit(event => {
        event.preventDefault();

        let userData = {
            email: $("#email").val(),
            password: $("#password").val(),
            profile: {
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                location: {
                    address: $("#address").val(),
                    city: $("#city").val(),
                    state: $("#state").val(),
                    zipCode: $("#zipCode").val(),
                    country: $("#country").val()
                }
            },
            topSize: $("#topSize").val(),
            bottomSize: $("#bottomSize").val()
        }

        $.ajax({
            type: 'POST',
            url: '/users',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function () {
                alert("Very nice!")
            }
        });
    });
};

function handleAllFunctions() {
    handleCreateAccount();
}

handleAllFunctions();