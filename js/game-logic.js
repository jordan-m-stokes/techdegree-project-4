const startButton = document.querySelector('#button-start');
const restartButton = document.querySelector('#button-restart');
const switchButton = document.querySelector('#button-switch');

const screenStart = document.querySelector('.screen-start');
const screenBoard = document.querySelector('.screen-board');
const screenWin = document.querySelector('.screen-win');

const playerEntry = screenStart.querySelector('input');
const playerBannerX = document.querySelector('#playerX');
const playerBannerO = document.querySelector('#playerO');

let playerX;
let playerO;
let round;
const boxes = document.querySelectorAll(".box");

/* description - changes the current screen to display on webpage
paramaters: - screen - (element) the screen to switch to
*/ function switchScreen(screen)
{
    const currentScreen = document.querySelector('.current-screen');

    //switches class name of "current-screen" from old to new screen
    currentScreen.classList.remove('current-screen');
    screen.classList.add('current-screen');
}

/*description - gets info for all possible win outcomes
paramaters: - plays - (array) a collection of 9 character values that are all
                      'x', 'o', or '_' for blank
returns: - matches - (object) an object containing all possible horizontal vertical
                     and diagonal matches
*/ function getPossibleMatches(plays)
{
    //an object that represents all the possible win outcomes by box index
    let matches =
    {
        horizontal: '012/345/678/', vertical: '036/147/258/', diagonal: '048/246/'
    };

    //replaces 'matches' indexes with the respective value from 'plays'
    matches = plays.reduce((matches, play, index) =>
    {
        matches.horizontal = matches.horizontal.replace(`${index}`, play);
        matches.vertical = matches.vertical.replace(`${index}`, play);
        matches.diagonal = matches.diagonal.replace(`${index}`, play);
        matches.diagonal = matches.diagonal.replace(`${index}`, play);

        return matches;

    }, matches);

    return matches;
}

/*description - takes matches and condenses it into a simpler structure of
                number x's in a line, number of o's in a line, and then a slash
                example is "x_o/" would be "11/" and "oo_" would be "02/"
paramaters: - matches - (object) an object containing all possible horizontal,
                        vertical, and diagonal matches
returns: - simplifiedMatches - (object) a simplified object containing all
                               possible horizontal, vertical, and diagonal
                               matches
*/ function simplifyMatches(matches)
{
    let simplifiedMatches =
    {
        horizontal: '', vertical: '', diagonal: ''
    };

    //turns strings into arrays
    let horizontalArray = matches.horizontal.split('');
    let verticalArray = matches.vertical.split('');
    let diagonalArray = matches.diagonal.split('');

    //used in conjuction with the function 'simplify' bellow
    let xBuffer = 0;
    let oBuffer = 0;

    /* description - turns match into simplified match
    paramaters: result    - (string) the value to add onto
                character - (character) the current character to evaluate
    returns: result;
    */ function simplify(result, character)
    {
        // a '/' indicates a new possible match needs to be evaluated, and the
        //previous match data is stored into the result variable and clears
        //the buffers
        if(character === '/')
        {
            result += `${xBuffer}${oBuffer}/`;
            xBuffer = 0;
            oBuffer = 0;
        }
        //checks if tile contains an x or an o and then increases the respective
        //buffer
        else if(character === 'x')
        {
            xBuffer++;
        }
        else if(character === 'o')
        {
            oBuffer++;
        }
        return result;
    }

    //simplifies horizontal, vertical, and diagonal matches by iterating
    //over the character arrays and storing the result in the
    //'simplifiedMatches' properties
    simplifiedMatches.horizontal = horizontalArray.reduce(simplify, '');
    simplifiedMatches.vertical = verticalArray.reduce(simplify, '');
    simplifiedMatches.diagonal = diagonalArray.reduce(simplify, '');

    return simplifiedMatches;
}

/*description - figures out the the exact move for the computer to make, having
                already figured out the type of play the computer will make
paramaters: - simplifiedMatches - (object) an object created from the
                                  "simplifyMatches" method
            - typeOfPlay - (string) the type of play the computer is looking to
                           make (see method searchForPlay's constant
                           "logicalPlays" for reference)
*/ function determineExactPlay(simplifiedMatches, typeOfPlay)
{
    //combines horizontal, vertical, and diagonal matches, and splits the
    //resulting string into an array
    simplifiedMatches = simplifiedMatches.horizontal + simplifiedMatches.vertical + simplifiedMatches.diagonal;
    simplifiedMatches = simplifiedMatches.split('/');

    //iterates through matches and finds all instances of given "typeOfPlay"
    indexesAvailable = simplifiedMatches.reduce((indexesAvailable, match, index) =>
    {
        if(match + '/' === typeOfPlay)
        {
            indexesAvailable.push(index);
        }
        return indexesAvailable;
    }, []);

    //takes the result of "indexesAvailable" and returns something at random
    return indexesAvailable[Math.floor( Math.random() * (indexesAvailable.length - 1))];
}

/*description - checks if someone has won the game
paramaters: - plays - (array) collection of 9 character values that are all 'x',
                      'o', or '_' for blank
returns: (string) 'x' or 'o' if the respective player won, 't' for tie, or '_'
         if game isn't over
*/ function checkForWin(plays)
{
    let matches = getPossibleMatches(plays);

    //scans the object for any instances of 'xxx/' or 'ooo/' which indicates a
    //win
    const winner = Object.values(matches).reduce((result, direction) =>
    {
        if(result !== '_')
        {
            return result;
        }
        if(direction.includes('xxx/'))
        {
            return 'x';
        }
        if(direction.includes('ooo/'))
        {
            return 'o';
        }
        return '_';
    }, '_');

    //checks for a tie
    if(plays.indexOf('_') === -1 && winner === '_')
    {
        return 't';
    }

    return winner;
}

/* description - finds a play for the computer
paramaters: - plays - (array) a collection of 9 character values that are all
                      'x', 'o', or '_' for blank
returns: (integer) the index for the computer to play
*/  function searchForPlay(plays)
{
    //all possible win combinations
    let matches = getPossibleMatches(plays);
    //a dumbed down version of possible win combinations (Basically, a count
    //of numbers of x's, o's, and blanks of each win combination on the board)
    let simplifiedMatches = simplifyMatches(matches);
    //the indexes for win combinations, based on a board like this:  0 1 2
    //                                                               3 4 5
    //                                                               6 7 8
    const matchIndexes = '012/345/678/036/147/258/048/246/';
    // the number of x's and o's respectively in a match possibility
    const typeOfPlays = [
        '02/',  //checks if there is a play for a win
        '20/',  //checks if the opponent needs to be blocked from a win
        '01/',  //checks for possibility of two o tiles and a blank spot
        '00/'   //checks for possibility of one o tile in a line of blank spots
    ];
    //the index for the variable 'matchIndexes' to chose
    let matchIndex = -1;

    //iterates through 'typeOfPlays' in respective order, and determines an
    //exact 'typeOfPlay' once the best option is found
    typeOfPlays.forEach(typeOfPlay =>
    {
        //checks the possiblility of given 'typeOfPlay'
        let isPlay = ((simplifiedMatches.horizontal.includes(typeOfPlay)) || (simplifiedMatches.vertical.includes(typeOfPlay)) || (simplifiedMatches.diagonal.includes(typeOfPlay)));

        //if a typeOfPlay has not yet been determined and a typeOfPlay has now
        //been determined than an exact 'matchIndex' is determined
        if(isPlay && matchIndex === -1)
        {
            matchIndex = determineExactPlay(simplifiedMatches, typeOfPlay);
        }
    });

    //checks if a play was found
    if(matchIndex > -1)
    {
        //finds match
        let indexesForMatch = matchIndexes.split('/')[matchIndex].split('');

        //iterates through the three spots of the match to find the blank spot
        //to play an 'o'
        for(let i = 0; i < indexesForMatch.length; i++)
        {
            if(plays[indexesForMatch[i]] === '_')
            {
                return indexesForMatch[i];
            }
        }
    }

    //if a logical play is not found an 'o' is placed anywhere that is blank
    return plays.indexOf('_');
}

/*description - toggles win screen for given winner
paramaters: - winner - (string) the winner 'x' 'o' or 't' for tie
            - name - (string)  the name of the winner
            - screen - (element) the win screen to switch to
*/ function toggleWin(winner, name, screen)
{
    const message = screen.querySelector('.message');
    const winnerName = screen.querySelector('.winner');
    //color of the winner's name depends on who won
    const color = (winner === 'x') ? 205 : 0;

    //changes to win screen
    switchScreen(screen);

    //activates the win screen of the given winner
    screen.classList.add(`screen-win-${winner}`);
    //changes win message accordingly
    message.textContent = (winner === 't') ? ('It\'s a Cat!') : ('Winner');
    //sets winner name's text and color for display
    winnerName.textContent = name.toUpperCase();
    winnerName.style.color = `rgba(${color}, ${color}, ${color}, 0.3)`
}

//used in conjuction with 'startRound' below
//purpose is to store the interval id for the computers plays so it can be
//cleared when a match is over
let roundIntervalID;

/*description - starts round, clears last round, and begins computer loop if
                necessary
paramaters: - round       - (Round) a 'Round' object for the round
            - boardScreen - (Element) a element representing the screen to play
                            on
            - winScreen   - (Element) a element representing the screen to switch
                          to when there is a winner
*/ function startRound(round, boardScreen, winScreen)
{
    //gets all boxes on board
    const boxes = boardScreen.querySelectorAll('box');

    //clears board
    round.clearBoard();
    //switches
    switchScreen(screenBoard);

    //checks if there is a computer in this round
    if(round.playerO.computer)
    {
        //a function that makes a play for computer
        function playComputer()
        {
            //if it's the computer's round and there is not yet a win then a
            //selection by computer is made
            if(round.getCurrentPlayer().computer && checkForWin(round.plays) === '_')
            {
                round.processComputerSelection(searchForPlay(round.plays));
            }
            //if the computer wins the win screen is displayed
            if(checkForWin(round.plays) === 'o')
            {
                //toggles win screen after a 1/4 second delay
                setTimeout(() => toggleWin('o', 'Computer', winScreen), 250);
                //disables loop since game is over
                clearInterval(roundIntervalID);
            }
        }
        //creates a loop that is iterated ever 1 second and calls 'playComputer'
        roundIntervalID = setInterval(playComputer, 1000);
    }
}

//a handler for the start button to start the game
startButtonHandler = event =>
{
    //checks to see if player x's name is being requested and that name isn't
    //blank
    if(playerEntry.placeholder === `Player X's Name...` && playerEntry.value !== '')
    {
        //creates player x based on entered name
        playerX = new Player(playerEntry.value, document.querySelector('#playerX'), false);
        //switch to player entry info for player o
        playerEntry.value = '';
        playerEntry.placeholder = `Player O's Name...`;
        startButton.textContent = 'Or Play With Computer'
    }
    //checks to see if player o's name is being requested
    else if(playerEntry.placeholder === `Player O's Name...`)
    {
        //create player o based on entered name or as a computer if nothing
        //was entered
        playerO = new Player(playerEntry.value, document.querySelector('#playerO'), playerEntry.value === '');
        //switches to player entry info for player x just in case
        playerEntry.value = '';
        playerEntry.placeholder = `Player X's Name...`;
        startButton.textContent = 'Next';
        //starts game
        round = new Round(playerX, playerO, boxes);
        startRound(round, screenBoard, screenWin);
    }

};

startButton.addEventListener('click', startButtonHandler);
playerEntry.addEventListener('keyup', event =>
{
    //if text hasn't for player o is blank than the option to play with computer
    //is shown
    if(playerEntry.placeholder.includes('O'))
    {
        startButton.textContent = (playerEntry.value === '') ? ('Or Play With Computer') : ('Start Game');
    }
    //if enter is hit then the users entry is submitted
    if(event.keyCode === 13)
    {
        startButtonHandler(event);
    }
});


//a partial handler for switch and restart buttons
const restartHandler = event =>
{
    //removes who won from win screen
    screenWin.classList = screenWin.className.split(' ').reduce((allClasses, className) =>
    {
        return (className.includes('screen-win-')) ? (allClasses) : (`${allClasses} ${className}`);
    }, '');

    //starts new round
    if(checkForWin(round.plays) !== '_')
    {
        startRound(round, screenBoard, screenWin);
    }
}

//a handler for the restart button to restart the game
restartButton.addEventListener('click', event =>
{
    restartHandler(event);
});

//a handler for switch button to allow user to switch players at the end of a
//game
switchButton.addEventListener('click', event =>
{
    restartHandler(event);
    //switches to board screen
    switchScreen(screenStart);
    playerEntry.focus();
});

//a handler for when the player tries to play on a box
const boxHandler_click = event =>
{
    const box = event.target;
    let index = box.value;

    //checks if computer hasn't already won then attempts to play on the box
    //clicked on by user
    if(checkForWin(round.plays) === '_')
    {
        round.processClick(index);
    }

    //gets winner if any
    let winner = checkForWin(round.plays);

    //if winner exists the win screen is shown
    if(winner !== '_')
    {
        //gets name of winner
        const winnerName = (winner === 'x') ? (playerX.name) : (winner === 'o') ? (playerO.name) : '';

        //computers win handler is seperate, so a check that the computer isn't
        //the winner is made than win screen is shown
        if(!playerO.computer || winner !== 'o')
        {
            toggleWin(winner, winnerName, screenWin);
            clearInterval(roundIntervalID);
        }
    }
};

//a handler to set mouseover image, indicating to the user which box they
//would select
const boxHandler_mouseover = event =>
{
    const box = event.target;
    const toDisplay = (round.turn === 'x') ? ('x') : (playerO.computer) ? ('x') : ('o');

    //checks to make sure box isn't already taken
    if(!box.className.includes('box-filled') && toDisplay != '_')
    {
        //sets mouseover image
        event.target.style.backgroundImage = `url(img/${toDisplay}.svg)`;
    }
};

//a handler to remove mouseover image
const boxHandler_mouseout = event =>
{
    event.target.style.backgroundImage = '';
};

//adds necessary event listeners to all the boxes
boxes.forEach(box => box.addEventListener('mouseover', boxHandler_mouseover));
boxes.forEach(box => box.addEventListener('mouseout', boxHandler_mouseout));
boxes.forEach(box => box.addEventListener('click', boxHandler_click));

//focuses on text box for user to type their name
playerEntry.focus();

/**/
