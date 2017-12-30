// Array to hold all socket objects.
var players = [];
// Counter for number of players that have
// selected a weapon. This is used to determine
// when all players have played.
var submits = 0;

// Empty arrays to hold sockets based on their choice.
var rocks = [];
var papers = [];
var scissors = [];
var lizards = [];
var spocks = [];

// Array of static strings used to display method each weapon uses to defeat its
// weaker weapons.
var fillers = [ " cuts ", " covers ", " crushes ", " poisons ", " smashes ", " decapitates ",
                " eats ", " disproves ", " vaporizes ", " crushes " ];

// Global variable to hold server in order to use in functions.
var my_io;


// Declares initial game states.
var game_initialized = false;
var game_in_progress = false;



function gameStart(io) {
    my_io = io;
    // Connects websockets.
    my_io.sockets.on('connection', function (socket) {
        console.log("New connection made.");


/****************
 * Sets up new Player
*****************/

        // Sets the socket's username attribute and informs the
        // current players that someone has joined.
        socket.on('setUsername', function (username) {
            socket.username = username;
            if (socket.username != "" && socket.username != null) {
                players.push(socket);
                socket.broadcast.emit('message', socket.username + ' has joined the game.');
            }
            // Updates player counter on client.
            showPlayers();
        });





        socket.on('canIplay', function() {
            var returner;
console.log('init: ' + game_initialized);
console.log('prog: ' + game_in_progress);
            if (!game_initialized) {
                game_initialized = true;
                returner = true;
            }
            else if (game_in_progress) {
                returner = false;
            }
            else {
                returner = true;
            }
console.log('returner: ' + returner);
            socket.emit('playDecision', returner);
        });





//*********
// Main comparison method.
// ***********//
        socket.on('selectedWeapon', function (choice) {
            // Sets the socket's weapon attribute.
            socket.weapon = choice;
console.log('Server: socket weap: ' + socket.weapon);
            // Increases the submits counter.
            submits++;
console.log('Server submits: ' + submits);
console.log('Server players: ' + players.length);
            // Determines what choice is present and adds that
            // socket to its respective array.
            switch (choice) {
                case "ROCK":
                    rocks.push(socket);
                    break;
                case "PAPER":
                    papers.push(socket);
                    break;
                case "SCISSORS":
                    scissors.push(socket);
                    break;
                case "LIZARD":
                    lizards.push(socket);
                    break;
                case "SPOCK":
                    spocks.push(socket);
                    break;
            }
            // Checks if all players have sent in their weapon choice.
            if (submits === players.length) {
                // Checks if certain arrays contain items and emits messages
                // based on the results.
                if (rocks.length > 0 && (scissors.length > 0 || lizards.length > 0)) { emitWins(rocks, scissors, lizards, fillers[9], fillers[2]); }
                if (papers.length > 0 && (rocks.length > 0 || spocks.length > 0)) { emitWins(papers, rocks, spocks, fillers[1], fillers[7]); }
                if (scissors.length > 0 && (papers.length > 0 || lizards.length > 0)) { emitWins( scissors, papers, lizards, fillers[0], fillers[5]); }
                if (lizards.length > 0 && (papers.length > 0 || spocks.length > 0)) { emitWins(lizards, papers, spocks, fillers[6], fillers[3]); }
                if (spocks.length > 0 && (rocks.length > 0 || scissors.length > 0)) { emitWins(spocks, rocks, scissors, fillers[8], fillers[4]); }

                // Checks which arrays have 2+ items meaning those sockets
                // tied with each other.
                if (rocks.length > 1) { emitTies(rocks); }
                if (papers.length > 1) { emitTies(papers); }
                if (scissors.length > 1) { emitTies(scissors); }
                if (lizards.length > 1) { emitTies(lizards); }
                if (spocks.length > 1) { emitTies(spocks); }

                // Clears objects.
                submits = 0;
                rocks.length = 0;
                papers.length = 0;
                scissors.length = 0;
                lizards.length = 0;
                spocks.length = 0;

                game_initialized = false;
                game_in_progress = false;

                showPlayers();
            }
            else {
                // Updates player counter message on client.
                waiting();
            }
        });



/****************
 * Sets up new Player
 *****************/
        // Removes socket from array.
        socket.on('disconnect', function(){
            var spot = players.indexOf(socket);
console.log(socket.username + ' has disconnected');
console.log('player count before slice: ' + players.length);
            players.splice(spot, 1);
console.log('player count after slice: ' + players.length);

            showPlayers();
        })
    });
}





/****************
 * FUNCTIONS!!!!
 *****************/

function emitWins(winners, losers, losers2, fillerStr1, fillerStr2) {
    // Loops through the provided arrays and emits messages of who won.
    // Since each weapon can beat 2 other weapon types, both are looped through
    // if there are items in their arrays.

    var winStr = makeNameString(winners);
    // All strings start with the winning weapon and its users.
    var outcomeStr = winners[0].weapon + " " + winStr;
    var losStr = "";
    var los2Str = "";
    // Generates a combined string if winner beat both weaker weapons.
    if (losers.length > 0 && losers2.length > 0) {
        losStr = makeNameString(losers);
        los2Str = makeNameString(losers2);
        outcomeStr += fillerStr1 + losers[0].weapon + " " + losStr + " and" + fillerStr2 +
            losers2[0].weapon + " " + los2Str;
    }
    // Generates a single string if only one of the two arrays has items.
    else if (losers.length > 0) {
        losStr = makeNameString(losers);
        outcomeStr += fillerStr1 + losers[0].weapon + " " + losStr;
    }
    else if (losers2.length > 0) {
        los2Str = makeNameString(losers2);
        outcomeStr += fillerStr2 + losers2[0].weapon + " " + los2Str;
    }
    // Transmits message string.
    my_io.sockets.emit('outcome', outcomeStr);
}




function makeNameString(array) {
    // Start of username string.
    var nameString = "(";
    // Loops through all but last item in array and
    // adds username to combined string.
    for (var x = 0; x < array.length - 1; x++) {
        nameString += array[x].username + ", ";
    }
    // Adds last array item (without separator and closes it.
    nameString += array[array.length - 1].username + ")";

    return nameString;
}




function emitTies(tiers) {
    // Loops through array and emits message of who tied.
    var tiersStr = tiers[0].username;
    for (var x = 1; x < (tiers.length - 1); x++) {
        tiersStr += ", " + tiers[x].username;
    }
    tiersStr += " and " + tiers[(tiers.length - 1)].username;
    my_io.sockets.emit('outcome', tiersStr + " tied with " + tiers[0].weapon);
}




function showPlayers() {
    // Emits message of number of active players.
    my_io.sockets.emit('showPlayers', players.length + ' Active Players')
}




function waiting() {
    // Emits message of number of players still to submit their choice.
    var remaining = players.length - submits;
    my_io.sockets.emit('wait', 'Players waiting on: ' + remaining)
}

module.exports = gameStart;
