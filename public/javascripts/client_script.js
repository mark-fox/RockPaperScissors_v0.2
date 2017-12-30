console.log("start of client script");
$(function() {
    console.log("beginning of client script");
    $('.weapons').hide();
    $('#messageLog').empty();
    var gameNumber = 0;
    $('#drawbtn').click(function () {
        $('#drawbtn').fadeOut();
        gameNumber++;
        $('#messageLog').append("<br><div class='msg'>--- Game #" + gameNumber + " ---</div>");
        var flashers = ["ROCK", "PAPER", "SCISSORS", "LIZARD", "SPOCK"];
        for (var x = 0; x < flashers.length; x++) {
            setTimeout(function () {
                $('#countdown').text = flashers[x];
            }, 750);
        }
        $('.weapons').fadeIn();
    });
    $('.weapons').click(function () {
        weaponClick($(this));		// function in other js
        $('.weapons').fadeOut();
    });
    var username = prompt("Enter your username:");
    while (username == "" || username == null) {
        username = prompt("PLEASE enter your username:");
    }

    function outcomeEvent(datastr) {
        $('#messageLog').append("<div class='msg'>" + datastr + "</div>");
        $('#drawbtn').fadeIn();
    }

    function messageEvent(msgstr) {
        $('#messageLog').append("<div class='msg'>" + msgstr + "</div>");
    }


    // This function may make more work if you decide to color-code users
    function addToLog(aString) {
        $('#messageLog').append("<div class='msg'>" + aString + "</div>");
    }
    console.log('end of client script');
});
