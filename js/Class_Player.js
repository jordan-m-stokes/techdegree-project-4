
//Player class, you guessed it, represents a tic-tac-toe player
class Player
{
    /*paramaters: - name     - (string) the players name
                  - element  - (element) the element representing the player on
                              on the board
                  - computer - (boolean) whether the player is a computer or
                               computer controlled
    */ constructor(name, element, computer)
    {
        this.name = name;
        this.element = element;
        this.span = element.querySelector('.player-name');
        this.span.textContent = name;
        this.computer = computer;

        //if player is a computer, the player's name is set to 'computer'
        if(computer)
        {
            this.name = 'Computer';
            this.span.textContent = 'Computer';
        }
    }

    /*description - called to switch the player to their turn
    paramaters: - active - (boolean) whether the player is on his turn
    */ activate(active)
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
