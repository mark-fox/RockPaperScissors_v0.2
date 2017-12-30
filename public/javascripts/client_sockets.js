var socket = io();

console.log("client sockets reached");

// Hides weapon buttons and clears message log div.
$('.weapons').hide();
$('#messageLog').empty();
// Counter for number of games played.
var gameNumber = 0;

var gameReady;




/****************
 * DRAW BUTTON
 *****************/

// Click event listener for Draw button.
$('#drawbtn').click(function () {


    socket.emit('canIplay');
// if(gameReady === null) {
    console.log('gameReady is: ' + gameReady);
// }
    changeLoop();


    if (gameReady === undefined) { changeLoop(); }


    if (gameReady) {
        // Hides Draw button, increases game counter, adds line to message log,
        // and shows the weapon buttons.
        $('#drawbtn').fadeOut();
        gameNumber++;
        $('#messageLog').append("<br><div class='msg'>--- Game #" + gameNumber + " ---</div>");
        $('.weapons').fadeIn();
    }
    else {
        $('#messageLog').append("<br><div class='msg'>Game in progress. Please wait...</div>");
    }
});

function changeLoop() {
console.log('before: ' + gameReady);
    if (gameReady === undefined) {
        setTimeout(changeLoop, 50);
        return;
    }
    console.log('gameReady is: ' + gameReady);
}
// https://stackoverflow.com/questions/3635924/how-can-i-make-a-program-wait-for-a-variable-change-in-javascript


/****************
 * WEAPONS BUTTONS
 *****************/

// Click event listener for weapons buttons.
$('.weapons').click(function () {
    // Emits weapon choice to server.
    weaponClick($(this));
    // Hides the weapon buttons.
    $('.weapons').fadeOut();
});





// Prompts user for a username until they submit one.
var username = prompt("Enter your username:");
/////////// while (username == "" || username == null) {
///////////     username = prompt("PLEASE enter your username:");
/////////// }

// Emits username to server.
socket.emit('setUsername', username);


socket.on('playDecision', function(canPlay) {
console.log('canPlay is: ' + canPlay);
    gameReady = canPlay;
});


// Adds message to message log.
socket.on('message', function(msgstr) {
    $('#messageLog').append("<div class='msg'>" + msgstr + "</div>");
});

// Adds outcome message to message log and shows Draw button.
socket.on('outcome', function(datastr) {
    $('#messageLog').append("<div class='msg'>" + datastr + "</div>");
    $('#drawbtn').fadeIn();
});

// Updates count of players message.
socket.on('showPlayers', function(countstr) {
    $('#waiting').text(countstr);
    console.log('num players is: ' + countstr);
});

// Updates count of pending player choices.
socket.on('wait', function(waitstr) {
    $('#waiting').text(waitstr);
});

// Emits weapon choice to server.
function weaponClick(weapon) {
    socket.emit('selectedWeapon', weapon.attr('value'));
}

function gameStarter() {

}