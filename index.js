
// To load multiple dependent JS files.
$.when(
    $.getScript( "utility.js" )
).done(startGame);

// State variables
let gameStarted = false;
let flipCount = 0;
let timerId = undefined;

// Entry level function
function startGame() {  
    // Randomly shuffle the cards
    shuffleCards();

    // Welcome overlay listener
    $(".game-start").click( function() {
        $(this).removeClass("visible");
    });

    $(".game-over").click(gameRestart);
    $(".victory").click(gameRestart);

    // Listen for click events on the cards
    $(".card").click(handleCardClick);

    time = $(".time-keeper").text();

    // Check and Reduce time every second
    timerId = setInterval(() => handleTimer(), 1000);
}

// Card shuffler
function shuffleCards() {
    let shuffledIndexes = getShuffledIndexes();
    let cardNumber = 0;
    shuffledIndexes.forEach( (cardIndex) => {
        $(".card").eq(cardNumber).css("order", `${cardIndex}`);    
        cardNumber++;
    });
};

function getShuffledIndexes() {
    let cardIndex = [];
    for (let i = 1; i < 17; i++) {
        cardIndex.push(i);   
    }

    cardIndex = shuffle(cardIndex);
    return cardIndex;
} 

// Card click logic
function handleCardClick() {

    // If card is matched, do nothong on click.
    if ($(this).hasClass("matched")) return;   

    gameStarted = true;

    // Open the clicked card
    $(this).toggleClass("visible");

    checkCardStatus();

    updateFlips();
}

// Core game logic
function checkCardStatus() {

    // If the card toggled is a even opened card, only then we'll have to check something.
    if ($(".card.visible").length % 2 === 0) {

        // Get only unmatched cards
        let unmatchedVisibleCards = $(".card.visible:not(.matched)");
        if (unmatchedVisibleCards.length === 2) {

            // Compare their html
            if (unmatchedVisibleCards.eq(0).html() 
                === unmatchedVisibleCards.eq(1).html()) 
                {
                    // If same, add matched class on both of them.
                    unmatchedVisibleCards.addClass("matched");
                }
            else {
                // If unmatched, close both cards after a delay of a second.
                setTimeout( () => unmatchedVisibleCards.removeClass("visible"), 700);
            }
        }
        else {
            // We're not expecting more than 2 unmatched cards.
            console.error("More than two unmatched cards are visible.");
        }
    }
}

// handle flips
function updateFlips() {
    flipCount += 1;
    $(".flip-keeper").text(flipCount);
}

// handle Timer
function handleTimer() {

    // Reduce time only when the game starts.
    if (!gameStarted)  return;

    if ($(".card.visible").length === 16) {
        clearInterval(timerId);
        setTimeout( () => $(".victory").addClass("visible"), 2000);
    }

    let time = parseInt($(".time-keeper").text());
    if (time === 0) {
        clearInterval(timerId);
        $(".game-over").addClass("visible");
    }
    else {
        time--;
        $(".time-keeper").text(time);
    }
}

function gameRestart() {
    location.reload();
}