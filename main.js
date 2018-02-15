var inquirer = require('inquirer');
var isLetter = require('is-letter');
var Word = require('./word.js');
var Game = require('./game.js');



require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
    wordBank: Game.newWord.wordList,
    guessesRemaining: 10,
    
    guessedLetters: [],
   
    display: 0,
    currentWord: null,
    
    startGame: function () {
        var that = this;
        
        if (this.guessedLetters.length > 0) {
            this.guessedLetters = [];
        }

        inquirer.prompt([{
            name: "play",
            type: "confirm",
            message: "Ready to play?"
        }]).then(function (answer) {
            if (answer.play) {
                that.newGame();
            } else {
                console.log("Alright, we can always play some other time.");
            }
        })
    },
   
    newGame: function () {
        if (this.guessesRemaining === 10) {
            console.log("LETS PLAY!");
            
            
            var randNum = Math.floor(Math.random() * this.wordBank.length);
            this.currentWord = new Word(this.wordBank[randNum]);
            this.currentWord.placeDash();
           
            console.log(this.currentWord.displayWord());
            this.keepPromptingUser();
        } else {
            this.resetGuessesRemaining();
            this.newGame();
        }
    },
    resetGuessesRemaining: function () {
        this.guessesRemaining = 10;
    },
    keepPromptingUser: function () {
        var that = this;
        
        inquirer.prompt([{
            name: "chosenLtr",
            type: "input",
            message: "Choose a letter:",
            validate: function (value) {
                if (isLetter(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (ltrs) {
            
            var letterReturned = (ltrs.chosenLtr).toUpperCase();
            
            var guessedAlready = false;
            for (var i = 0; i < that.guessedLetters.length; i++) {
                if (letterReturned === that.guessedLetters[i]) {
                    guessedAlready = true;
                }
            }
            
            if (guessedAlready === false) {
                that.guessedLetters.push(letterReturned);

                var found = that.currentWord.checkLetter(letterReturned);
                
                if (found === 0) {
                    console.log('Sorry that was incorrect');
                    that.guessesRemaining--;
                   
                    console.log('Guesses remaining: ' + that.guessesRemaining);
                    

                   
                    console.log(that.currentWord.displayWord());
                    

                    console.log("Letters guessed: " + that.guessedLetters);
                } else {
                    console.log('Correct!');
                    //checks to see if user won
                    if (that.currentWord.findWord() === true) {
                        console.log(that.currentWord.displayWord());
                        console.log('Congratulations! You won!!!');
                        // that.startGame();
                    } else {
                        // display the user how many guesses remaining
                        console.log('Guesses remaining: ' + that.guessesRemaining);
                        console.log(that.currentWord.displayWord());
                        
                        console.log("Letters guessed: " + that.guessedLetters);
                    }
                }
                if (that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
                    that.keepPromptingUser();
                } else if (that.guessesRemaining === 0) {
                    console.log('Game over!');
                    console.log('cant believe you couldnt guess ' + that.currentWord.word + " correctly, shame");
                }
            } else {
                console.log("you have already tried that letter, please make a different selection")
                that.keepPromptingUser();
            }
        });
    }
}

hangman.startGame();