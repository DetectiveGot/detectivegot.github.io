const api = "./data/data.json";
let wordList = [];

//fetch data
async function loadWordList(){
    try {
        const response = await fetch(api);
        if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        wordList = await response.json();
        // console.log(wordList);
    } catch(error){
        console.error(`Failed to load wordList: ${error}`);
        return wordList = [];
    }
}

document.addEventListener("DOMContentLoaded", async function(){
    const charBtn = document.querySelectorAll(".character-button");
    const roundId = document.querySelector("#round-id");
    const tryId = document.querySelector("#try-left-id");
    const ScoreId = document.querySelector("#user-score");
    const wordContainer = document.querySelector(".word-container");
    const startBtn = document.querySelector("#start-btn");
    const startPage = document.querySelector("#start-page");
    const gamePage = document.querySelector("#game-page");
    const instructionPage = document.querySelector("#instruction-page");
    const instructionBtn = document.querySelector("#instruction-btn");
    const continueBtn = document.querySelector("#game-continue-btn");
    const scoreBoard = document.querySelector("#scoreboard");
    // const scoreContainer = document.querySelector("#score-container");
    const scoreMessage = document.querySelector("#score-message")
    const wordType = document.querySelector("#word-type");
    const wordDef = document.querySelector("#word-def");
    const wordDesc = document.querySelector("#word-desc");
    //fetch data
    await loadWordList();

    // starting game
    // gamePage.style.display = "none";
    gamePage.style.visibility = "hidden";
    continueBtn.style.visibility = "hidden";
    instructionPage.style.visibility = "hidden";
    scoreBoard.style.visibility = "hidden";

    let answer = "a".toLowerCase();
    let tryLeft = 5;
    let letterLeft = 0;
    let wordAr = answer.split(' ');
    wordContainer.innerHTML = "";
    let usedCharacter = new Array(26).fill(false);
    let gameStarted = false;
    let letters = null;
    let roundCount = 1;
    let maxRound = 10;
    let curScore = 0;

    // Scoreboard
    scoreBoard.addEventListener("click", function(){
        scoreBoard.style.visibility = "hidden";
    });

    function showScoreBoard(){
        scoreBoard.style.visibility = "visible";
        scoreMessage.textContent = `You got ${curScore} out of ${maxRound}!`;
    }

    function toMenu() {
        // Reset game state
        curScore = 0;
        roundCount = 1;
        gameStarted = false;
        tryLeft = 5;
        letterLeft = 0;
        usedCharacter.fill(false);
    
        // Reset UI
        ScoreId.textContent = curScore;
        roundId.textContent = roundCount;
        tryId.textContent = tryLeft;
        wordContainer.innerHTML = "";
        // continueBtn.style.display = "none";
        continueBtn.style.visibility = "hidden";
    
        // Reset buttons
        charBtn.forEach(button => {
            button.disabled = false;
        });
    
        // Hide game and show start page
        // gamePage.style.display = "none";
        // startPage.style.display = "block";
        gamePage.style.visibility = "hidden";
        startPage.style.visibility = "visible";
    
        // Make sure instruction is hidden if still open
        // instructionPage.style.display = "none";
        instructionPage.style.visibility = "hidden";
        window.scrollTo(0, 0);
    }

    //continue event
    continueBtn.addEventListener("click", function(){
        ++roundCount;
        if(roundCount > maxRound){
            //to menu
            showScoreBoard();
            toMenu();
        } else {
            gameRestart();
            roundId.textContent = roundCount;
        }
        // continueBtn.style.display = "none";
        continueBtn.style.visibility = "hidden";
    });

    // continueBtn.style.display = "none";

    //when the game is Over
    function loseGame(){
        gameStarted = false;
        letters.forEach(ch => {
            const group = parseInt(ch.getAttribute("group"));
            const index = parseInt(ch.getAttribute("index"));
            ch.style.color = "red";
            ch.textContent = wordAr[group][index];
        });
        // continueBtn.style.display = "block";
        continueBtn.style.visibility = "visible";
    }

    //when play input wrong character
    function wrong_character(){
        --tryLeft;        
        if(tryLeft<=0){
            loseGame();
        }
        tryId.textContent = tryLeft;
    }
    
    //when you win
    function winFucntion(){
        gameStarted = false;
        letters.forEach(letter => {
            letter.style.color = "green";
        });
        // continueBtn.style.display = "block";
        continueBtn.style.visibility = "visible";
        ++curScore;
        ScoreId.textContent = curScore;
    }

    //instructions
    const instCloseBtn = document.querySelector("#instruction-close-btn");
    instCloseBtn.addEventListener("click", function(){
        // instructionPage.style.display = "none";
        instructionPage.style.visibility = "hidden";
    });

    instructionBtn.addEventListener("click", function(){
        // instructionPage.style.display = "block";
        instructionPage.style.visibility = "visible";
    });
    // instructionPage.style.display = "none";
    

    startBtn.addEventListener("click", function(){
        // startPage.style.display = "none";
        // gamePage.style.display = "block";
        startPage.style.visibility = "hidden";
        gamePage.style.visibility = "visible";
        gameStarted = true;
        gameRestart();
    });

    //function restart the game (init values)
    function gameRestart(){
        //choose random word
        const { word, type, definition, description } = wordList[Math.floor(Math.random() * wordList.length)];
        answer = word.toLowerCase().trim();
        
        wordType.textContent = type;
        wordDef.textContent = definition;
        wordDesc.textContent = description;

        //
        gameStarted = true;
        letterLeft = 0;
        tryLeft = 5;
        wordAr = answer.split(' ');
        wordContainer.innerHTML = "";
        usedCharacter = new Array(26).fill(false);
        wordAr.forEach((wd, group) => {
            const wordSpan = document.createElement("span");
            wordSpan.classList.add("word");
            const len = wd.length;
            for(let i=0;i<len;i++){
                const lettP = document.createElement("p");
                lettP.textContent = "_";
                lettP.setAttribute("group", group);
                lettP.setAttribute("index", i);
                lettP.classList.add("letter");
                wordSpan.appendChild(lettP);
            }
            letterLeft+=len;
            wordContainer.appendChild(wordSpan);
        });

        //add letters
        letters = document.querySelectorAll(".letter");
        
        charBtn.forEach(button => {
            button.disabled = false;
        })
        roundId.textContent = roundCount;
        // continueBtn.style.display = "none";
        continueBtn.style.visibility = "hidden";
    }

    charBtn.forEach(button => {
        button.addEventListener("click", function(){
            this.disabled = true;
            const letter = this.textContent.toLowerCase();
            usedCharacter[letter.charCodeAt(0)-97] = true;
            let found = false;
            letters.forEach(ch => {
                const group = parseInt(ch.getAttribute("group"));
                const index = parseInt(ch.getAttribute("index"));
                // console.log(group, index, wordAr[group][index]);
                if(wordAr[group][index] === letter){
                    ch.textContent = letter;
                    found = true;
                    letterLeft--;
                }
            });
            if(!found){
                wrong_character();
            }
            if(letterLeft==0){
                winFucntion();
            }
        });
    });

    document.addEventListener("keydown", function(event){
        if(!gameStarted) return;
        const letter = event.key.toLowerCase();
        if(!/^[a-z]$/.test(letter)) return;
        if(usedCharacter[letter.charCodeAt(0)-97]) return;
        usedCharacter[letter.charCodeAt(0)-97] = true;
        let found = false;
        letters.forEach(ch => {
            const group = parseInt(ch.getAttribute("group"));
            const index = parseInt(ch.getAttribute("index"));
            // console.log(group, index, wordAr[group][index]);
            if(wordAr[group][index] === letter){
                ch.textContent = letter;
                found = true;
                letterLeft--;
            }
        });
        for (const btn of charBtn) {
            if(btn.textContent.toLowerCase() === letter){
                btn.disabled = true;
                break;
            }
        }

        if(!found){
            wrong_character();
        }
        if(letterLeft==0){
            winFucntion();
        }
    });
});