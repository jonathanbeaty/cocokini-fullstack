$.getJSON('http://localhost:8080/products', function (data) {

    $("#apiContainer").append(`<img id="onepic" src="${data[0].picture.url}" style="width:100%;">`);

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