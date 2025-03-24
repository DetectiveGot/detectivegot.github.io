import { vocabTem } from './vocabTem.js';

const animateBaseClass = "animate__animated";
const animateBounceDownClass = "animate__bounceInDown";
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
    const lifeId = document.querySelector("#try-left-id");
    const ScoreId = document.querySelector("#user-score");
    const wordContainer = document.querySelector(".word-container");
    const startBtn = document.querySelector("#start-btn");
    const startPage = document.querySelector("#start-page");
    const gamePage = document.querySelector("#game-page");
    const instructionPage = document.querySelector("#instruction-page");
    const instructionBtn = document.querySelector("#instruction-btn");
    const continueBtn = document.querySelector("#game-continue-btn");
    const scoreBoard = document.querySelector("#scoreboard");
    const scoreContainer = document.querySelector("#score-container");
    const scoreMessage = document.querySelector("#score-message")
    const wordType = document.querySelector("#word-type");
    const wordDef = document.querySelector("#word-def");
    const wordDesc = document.querySelector("#word-desc");
    const vocabBtn = document.querySelector("#vocab-list-btn");
    const vocabPage = document.querySelector("#vocab-list-page");
    const vocabCon = document.querySelector("#vocab-list-container");
    const vocabOl = document.querySelector("#vocab-ol");
    const navtitleBox = document.querySelector("#nav-title-box");
    //fetch data
    await loadWordList();

    // starting game
    // gamePage.style.display = "none";
    gamePage.style.visibility = "hidden";
    continueBtn.style.visibility = "hidden";
    instructionPage.style.visibility = "hidden";
    scoreBoard.style.visibility = "hidden";
    vocabPage.style.visibility = "hidden";

    let answer = "";
    let lifeLeft = 5;
    let maxLife = 5;
    let letterLeft = 0;
    let wordAr = answer.split(' ');
    wordContainer.innerHTML = "";
    let usedCharacter = new Array(26).fill(false);
    let gameStarted = false;
    let letters = null;
    let roundCount = 1;
    let maxRound = 10;
    let curScore = 0;

    //function to add class animation to element
    function addElementClass(ele, _main){
        ele.classList.add(_main);
    }
    //function to remove class animation to element
    function removeElementClass(ele, _main){
        ele.classList.remove(_main);
    }
    // Scoreboard
    scoreContainer.addEventListener("click", function(){
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
        lifeLeft = 5;
        letterLeft = 0;
        usedCharacter.fill(false);
    
        // Reset UI
        ScoreId.textContent = curScore;
        roundId.textContent = roundCount;
        lifeId.textContent = lifeLeft;
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
            removeElementClass(ch, animateBounceDownClass);
            addElementClass(ch, animateBounceDownClass);
            
        });
        // continueBtn.style.display = "block";
        continueBtn.style.visibility = "visible";
    }

    //when play input wrong character
    function wrong_character(){
        --lifeLeft;        
        if(lifeLeft<=0){
            loseGame();
        }
        lifeId.textContent = lifeLeft;
    }
    
    //when you win
    function winFucntion(){
        gameStarted = false;
        letters.forEach(ch => {
            ch.style.color = "green";
            removeElementClass(ch, animateBounceDownClass);
            addElementClass(ch, animateBounceDownClass);
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
        const { word, type, definition: { EN, }, description } = wordList[Math.floor(Math.random() * wordList.length)];
        answer = word.toLowerCase().trim();
        
        wordType.textContent = type;
        wordDef.textContent = EN;
        wordDesc.textContent = description;

        //
        gameStarted = true;
        letterLeft = 0;
        lifeLeft = maxLife;
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
                addElementClass(lettP, animateBaseClass);
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
        lifeId.textContent = maxLife;
        // continueBtn.style.display = "none";
        continueBtn.style.visibility = "hidden";
    }

    charBtn.forEach(button => {
        button.addEventListener("click", function(){
            if(!gameStarted) return;
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
                    addElementClass(ch, animateBounceDownClass);
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
                addElementClass(ch, animateBounceDownClass);
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
    
    wordList.forEach(({word, type, definition: { EN, TH }, description}) => {
        const wordEle = vocabTem(word, type, EN, TH);
        vocabOl.appendChild(wordEle);
        
    });

    vocabBtn.addEventListener("click", function(){
        vocabPage.style.visibility = "visible";
    });

    vocabCon.addEventListener("click", function(event){
        vocabPage.style.visibility = "hidden";
    });

    navtitleBox.addEventListener("click", function(){
        toMenu();
    });

});