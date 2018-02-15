var Letter = require('./letter.js');

function Word(wrd) {
    var that = this;
    
    this.word = wrd;
    
    this.letters = [];
    this.wordFound = false;

    this.placeDash = function () {
        for (var i = 0; i < that.word.length; i++) {
            var newLetter = new Letter(that.word[i]);
            this.letters.push(newLetter);
        }
    };

    
    this.findWord = function () {
        if (this.letters.every(function (lttr) {
            return lttr.appear === true;
        })) {
            this.wordFound = true;
            return true;
        }

    };

    this.checkLetter = function (guessedLetter) {
        var whatToReturn = 0;
        
        this.letters.forEach(function (lttr) {
            if (lttr.letter === guessedLetter) {
                lttr.appear = true;
                whatToReturn++;
            }
        })
       
        return whatToReturn;
    };

    this.displayWord = function () {
        var display = '';
        
        that.letters.forEach(function (lttr) {
            var currentLetter = lttr.letterRender();
            display += currentLetter;
        });

        return display;
    };
}

module.exports = Word;