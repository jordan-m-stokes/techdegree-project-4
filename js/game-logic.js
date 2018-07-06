
class Player
{
    constructor(name, element, computer)
    {
        this.name = name;
        this.element = element;
        this.span = element.querySelector('.player-name');
        this.span.textContent = name;
        this.computer = computer;

        if(computer)
        {
            this.name = 'Computer';
            this.span.textContent = 'Computer';
        }
    }

    activate(active)
    {
        if(active)
        {
            this.element.classList.add('active');
        }
        else
        {
            this.element.classList.remove('active');
        }
    }
}

let turn = 'x';

//the plays on the board 'x', 'o', and '_' for blank
let plays = ['_','_','_','_','_','_','_','_','_'];

const startButton = document.querySelector('#button-start');
const restartButton = document.querySelector('#button-restart');

const screenStart = document.querySelector('.screen-start');
const screenBoard = document.querySelector('.screen-board');
const screenWin = document.querySelector('.screen-win');

const playerEntry = screenStart.querySelector('input');

let playerX;
let playerO;
const boxes = document.querySelectorAll(".box");

/* description - changes the current screen to display on webpage
paramaters: - screen - the screen to switch to
*/ function switchScreen(screen)
{
    const currentScreen = document.querySelector('.current-screen');

    //switches class name of "current-screen" from old to new screen
    currentScreen.classList.remove('current-screen');
    screen.classList.add('current-screen');
}

/*description - gets info for all possible win outcomes
paramaters: - plays - an array of 9 character values that are all 'x', 'o', or
                      '_' for blank
returns: - matches - an object containing all possible horizontal vertical
                     and diagonal matches
*/ function getPossibleMatches(plays)
{
    //an object that represents all the possible win outcomes by box index
    let matches =
    {
        horizontal: '012/345/678/', vertical: '036/147/258/', diagonal: '048/246/'
    };

    //replaces 'check' indexes with the respective value from 'plays'
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

/*description - checks if someone has won the game
paramaters: - plays - an array of 9 character values that are all 'x', 'o', or
                      '_' for blank
returns: 'x' or 'o' if the respective player won or '_' if no one won
*/ function checkForWin(plays)
{
    if(plays.indexOf('_') === -1)
    {
        return 't';
    }

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

    return winner;
}

/* description - finds a play for the computer
paramaters: - plays - an array of 9 character values that are all 'x', 'o', or
                      '_' for blank
*/  function findPlay(plays)
{

}

/* description - alternates the 'currentTurn' from 'x' to 'o' or vise-versa
paramaters: - currentTurn - the turn to alterante ('x' or 'y')
            - playerO     - the element representing player X's turn
            - playerO     - the element representing player O's turn
returns: - turn - the alternated turn
*/ function alternateTurn(currentTurn, playerX, playerO)
{
    //the new turn
    let turn = (currentTurn === 'x') ? 'o' : 'x';

    playerX.activate(turn === 'x');
    playerO.activate(turn === 'o');

    return turn;
}

/*description - toggles win screen for given winner
paramaters: - winner - the winner 'x' 'o' or 't' for tie
            - screen - the win screen to switch to
*/ function toggleWin(winner, screen)
{
    const message = screen.querySelector('.message');

    switchScreen(screen);

    screen.classList.add(`screen-win-${winner}`);
    message.textContent = (winner === 't') ? ('It\'s a Cat!') : ('Winner');
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
        //starts game
        switchScreen(screenBoard);
    }

};

//a handler for the start button to start the game
startButton.addEventListener('click', startButtonHandler);


playerEntry.addEventListener('keyup', event =>
{
    if(playerEntry.placeholder.includes('O'))
    {
        startButton.textContent = (playerEntry.value === '') ? ('Or Play With Computer') : ('Start Game');
    }
    if(event.keyCode === 13)
    {
        startButtonHandler(event);
    }
});

//a handler for the restart button to restart the game
restartButton.addEventListener('click', event =>
{
    //removes who won from win screen
    screenWin.classList = screenWin.className.split(' ').reduce((allClasses, className) =>
    {
        return (className.includes('screen-win-')) ? (allClasses) : (`${allClasses} ${className}`);
    }, '');

    //resets board
    for(let i = 0; i < boxes.length; i++)
    {
        boxes[i].className = 'box';
    }
    plays = plays.map(play => '_');
    turn = alternateTurn('o', playerX, playerO);

    //switches to board screen
    switchScreen(screenBoard);
});

//a handler for when the player tries to play on a box
const boxHandler_click = event =>
{
    const box = event.target;

    //checks to make sure box isn't already taken
    if(!box.className.includes('box-filled'))
    {
        //displays the box as taken to user
        box.classList.add(`box-filled-${turn}`);
        //stores the play this turn into memory
        plays[box.value] = turn;
        const winner = checkForWin(plays);
        //changes the turn
        turn = alternateTurn(turn, playerX, playerO);

        if(winner !== '_')
        {
            toggleWin(winner, screenWin);
        }
    }
};

//a handler to set mouseover image, indicating to the user which box they
//would select
const boxHandler_mouseover = event =>
{
    const box = event.target;

    //checks to make sure box isn't already taken
    if(!box.className.includes('box-filled'))
    {
        //sets mouseover image
        event.target.style.backgroundImage = `url(img/${turn}.svg)`;
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

playerEntry.focus();



/**/
