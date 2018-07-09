
//Round class, you guessed it, represents a tic-tac-toe match
class Round
{
    /*paramaters: - playerX - (Player) a "Player" object representing the x's
                  - playerO - (Player) a "Player" object representing the o's
                  - boxes   - (Element) the html elements representing all the
                              plays on the board
    */ constructor (playerX, playerO, boxes)
    {
        this.playerX = playerX;
        this.playerO = playerO;
        this.boxes = boxes;
        this.turn = 'x';
        //the plays on the board 'x', 'o', and '_' for blank
        this.plays = ['_','_','_','_','_','_','_','_','_'];
        this.preventPlay = false;
    }

    //refreshes the board to display any changes to user
    refreshBoard()
    {
        this.boxes.forEach(box =>
        {

            let index = box.value;
            let play = this.plays[index];

            //if there is no play the box is cleared
            if(play === '_')
            {
                box.className = 'box';
            }
            //if there is a play the box is filled
            else
            {
                box.className = `box box-filled-${play}`;
                box.style.backgroundImage = '';
            }
        });
    }

    /*description - changes turn
    paramaters: - turn - (string) the turn to change to
    */ changeTurn(turn)
    {
        this.turn = turn;
        //activates the banner of whoevers turn it is
        this.playerX.activate(turn === 'x');
        this.playerO.activate(turn === 'o');
        this.refreshBoard();
    }

    //returns the current player
    getCurrentPlayer()
    {
        return (this.turn === 'x') ? (playerX) : (playerO);
    }

    /*description - makes a play
    paramaters: - index - (integer) the index for the play
    */ makePlay(index)
    {
        //changes the play to whoevers turn it is
        this.plays[index] = this.turn;
        //alternates turn
        this.changeTurn((this.turn === 'x') ? (this.turn = 'o') : (this.turn = 'x'));
        this.preventPlay = false;
    }

    /*description - calls 'makePlay' after a delay
    paramaters: - index - (integer) the index for the play
                - delay - (integer) the delay in miliseconds
    */ makePlayWithDelay(index, delay)
    {
        this.preventPlay = true;
        setTimeout(() => this.makePlay(index), delay);
    }

    /*description - process click from user
    paramaters: - index - (integer) the index for the box that was clicked
    */processClick(index)
    {
        const player = this.getCurrentPlayer();

        //checks that the click is not made during a computers turn, that
        //the box is blank, and that "preventPlay" is not true and then makes a
        //play
        if(!player.computer && this.plays[index] === '_' && !this.preventPlay)
        {
            this.makePlay(index);
        }
    }

    /*description - processes a selection by computer
    paramaters: - index - (integer) the index for the box that was selected
    */ processComputerSelection(index)
    {
        const player = this.getCurrentPlayer();

        //checks that the click is made during a computers turn, that
        //the box is blank, and that "preventPlay" is not true and then makes a
        //play
        if(player.computer && this.plays[index] === '_' && !this.preventPlay)
        {
            this.makePlayWithDelay(index, 1000);
        }
    }

    //I don't think I need to explain this
    clearBoard()
    {
        //sets all boxes to blank
        this.plays = this.plays.map(play => '_');
        this.changeTurn('x');
    }
}
