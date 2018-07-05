
let turn = 'x';

//the plays on the board 'x', 'o', and '_' for blank
let plays = ['_','_','_','_','_','_','_','_','_'];

const startButton = document.querySelector('#button-start');
const playerX = document.querySelector('#playerX');
const playerO = document.querySelector('#playerO');
const boxes = document.querySelectorAll(".box");

/* description - changes the current screen to display on webpage
paramaters: - className - the class name to retrive the screen to switch to
*/ function selectScreen(className)
{
    const currentScreen = document.querySelector('.current-screen');
    const newScreen = document.querySelector(`.${className}`);

    //switches class name of "current-screen" from old to new screen
    currentScreen.classList.remove('current-screen');
    newScreen.classList.add('current-screen');
}

/*description - checks if someone has won the game
paramaters: plays - an array of 9 character values that are all 'x', 'o', or '_'
                    for blank
returns: 'x' or 'o' if the respective player won or '_' if no one won
*/ function checkForWin(plays)
{
    //an object that represents all the possible win outcomes by box index
    let check =
    {
        horizontal: '012/345/678/', vertical: '036/147/258/', diagonal: '048/246/'
    };

    //replaces 'check' indexes with the respective value from 'plays'
    check = plays.reduce((check, play, index) =>
    {
        check.horizontal = check.horizontal.replace(`${index}`, play);
        check.vertical = check.vertical.replace(`${index}`, play);
        check.diagonal = check.diagonal.replace(`${index}`, play);
        check.diagonal = check.diagonal.replace(`${index}`, play);
        return check;
    }, check);

    //scans the object for any instances of 'xxx/' or 'ooo/' which indicates a
    //win
    const winner = Object.values(check).reduce((result, direction) =>
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

/* description - alternates the 'currentTurn' from 'x' to 'o' or vise-versa
paramaters: - currentTurn - the turn to alterante ('x' or 'y')
            - playerO     - the element representing player X's turn
            - playerO     - the element representing player O's turn
returns: - turn - the alternated turn
*/ function alternateTurn(currentTurn, playerX, playerO)
{
    //the new turn
    let turn = (currentTurn === 'x') ? 'o' : 'x';

    if(turn === 'x')
    {
        playerX.classList.add('active');
        playerO.classList.remove('active');
    }
    else
    {
        playerX.classList.remove('active');
        playerO.classList.add('active');
    }
    return turn;
}

//a handler for the start button to start the game
startButton.addEventListener('click', event =>
{
    selectScreen('screen-board');
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
            console.log(`Player of the ${winner}'s won the game!`);
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

/**/
