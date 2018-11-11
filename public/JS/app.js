$.getJSON('http://localhost:8080/products', function (data) {

    console.log(data);

    $("#apiContainer").append(`<img id="onepic" src="${data[0].picture.url}" style="width:100%;">`);


});