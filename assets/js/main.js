
var url = "http://100.25.58.204:5000/";
var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyYW5qYW5hc2hpc2gyNTRAZ21haWwuY29tIiwiZXhwIjoxNjc1NDI3Nzk4LCJpYXQiOjE2NzU0MTg3OTh9.yoB_5oIVPcSKGEDqGyn0JTawVYbpL3dr5b_PAbi6hZlaP3dY-aPLOCKeiMVcETc1xe5IiY4JN0oFbNrbIcg-1Q";
$(".hide").hide();
var tempEmail = "";
getEmail();
var isReadingEmail = false;
var i = 0;
function getEmail() {
    var settings = {
        "url": url + "api/v1/email/generate",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        var data = JSON.parse(JSON.stringify(response));
        tempEmail = data.tempEmail;
        if (i >= 1) {
            getTempEmail(data.tempEmail, false);
        }
        token = data.token;
        $(".myEmail").html(data.tempEmail);
        i++;
    });
}
$("#create-new-email").click(function () {
    getEmail();

})
// getTempEmail("jdashish1996+5FvqD@gmail.com",false);

setInterval(function () {
    if (i >= 1 && isReadingEmail==false) {
        getTempEmail(tempEmail, true);
    }
}, 10000)

function getTempEmail(email, isSync) {
    if (isSync == false) {
        $(".pre-loader").show();
    }

    var settings = {
        "url": url + "api/v1/email/receive/search/" + email,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {

        if (response.length > 0) {
            $(".messages").show();
            $(".data-not-found").hide();
        } else {
            $(".messages").hide();
            $(".data-not-found").show();
        }

        var message = '';
        for (var i = 0; i < response.length; i++) {
            var data = JSON.parse(JSON.stringify(response[i]));
            var ciphertext = CryptoJS.AES.encrypt(data.message, 'mail-message');
            message += '<li class="message unread read-mail" desc="' + ciphertext + '"> ';
            message += '<a href="#">';
            message += '<div class="actions"> <span class="action"><i class="fa fa-square-o"></i></span> <span';
            message += 'class="action"><i class="fa fa-star-o"></i></span></div>';
            message += '<div class="header"> <span class="from">' + data.from + '</span> <span class="date"> <span';
            message += 'class="fa fa-paper-clip"></span> ' + data.sentDate + '</span></div>';
            message += '<div class="title"> ' + data.subject + '</div>';
            message += '<div class="description" >' + data.message + '</div>';
            message += ' </a>';
            message += '</li>';
        }

        $(".messages").html(message);
        $(".pre-loader").hide();
    });
}

$(document).on('click', ".read-mail", function () {
    isReadingEmail = true;
    var desc = $(this).attr("desc");
    console.log(desc);

    var bytes = CryptoJS.AES.decrypt(desc.toString(), 'mail-message');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    $(".messages").hide();
    $(".message-print").show();
    $(".message-print").html(plaintext);
})

$(".back").click(function () {
    $(".messages").show();
    isReadingEmail = false;
    $(".message-print").hide();
})

$(".reload-email").click(function () {
    getTempEmail(tempEmail, false);
})



//copyEmail
$(".copyEmail").click(function () {

    navigator.clipboard.writeText(tempEmail);

    // Alert the copied text
    alert("Copied the temp email: " + tempEmail);
})