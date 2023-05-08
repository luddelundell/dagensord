let allTheWords, theWord, theWordString, elements, wordBodies, keyboard, points;
let darkMode=false;
const messageDiv = document.getElementById("message");
const startView = document.getElementById("startView");
const endView = document.getElementById("endView");
const noOfAttempts = document.getElementById("noOfAttempts");
const scoredPoints = document.getElementById("scoredPoints");
// const output = document.getElementById("output");
const modalGame = document.getElementById("modalGame");
const modalLb = document.getElementById("modalLb");
const modalMs = document.getElementById("modalMs");
const foo = document.getElementById("foo");
let lostGame = false;
const startDate = new Date("2023-04-19");
const thisDate = new Date();
let gameNo = Math.floor((thisDate - startDate) / 86400000);
const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "å",
  "ä",
  "ö",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Å",
  "Ä",
  "Ö",
];
let guesses = [];
let rowState = 1;
let game = true;
let shareArr = [];

allTheWords = data;
wordOfTheDay(data);
function wordOfTheDay(arr) {
  theWordString = arr[gameNo];
  // console.log(theWordString);
  theWord = theWordString.split("");
}
function updateKeyboard(userWord) {
  let temp = "";
  for (let i = 0; i < userWord.length; i++) {
    let key = userWord[i];

    let myButton = document.querySelector("[data-key=" + key + "]");
    if (userWord[i] == theWord[i]) {
      myButton.classList.add("correct");
      // temp += "🟩";
    } else if (theWord.includes(userWord[i])) {
      myButton.classList.add("close");
      // temp += "🟨";
    } else {
      myButton.classList.add("false");
      // temp += "⬜";
    }
  }
  // shareArr.push(temp);
}
function setElements() {
  if (game) {
    elements = document.getElementById("row" + rowState);
    wordBodies = elements.getElementsByClassName("word__body");
  }
}
function message(t, time) {
  if (game) {
    let messageTxt = `<p>Unknown error message</p>`;
    if (t == 1) {
      messageTxt = `<p>Nu är det slut på gissningar! Ordet vi sökte är ${theWordString}</p>`;
      game = false;
    }
    if (t == 2) messageTxt = "<p><span>🤔</span>Ordet finns inte i listan</p>";
    if (t == 3) messageTxt = `<p><span>🤯</span>Du har redan gissat på det här ordet</p>`;
    if (t == 4) messageTxt = `<p><span>🫣</span>Ordet har för få bokstäver</p>`;
    if (t == 5) {
      messageTxt = `<p class="success"><span>🎉</span>Rätt svar, grattis!</p>`;
      game = false;
    }
    messageDiv.innerHTML = messageTxt;
    messageDiv.classList.add("visible");
    setTimeout(() => {
      messageDiv.classList.remove("visible");
    }, time);
  }
}
setElements();
function doCheck() {
  if (game) {
    let correctPositions = [];
    messageDiv.innerHTML = "";
    let userWord = [];
    let usedChares = [];
    let pluppar ="";
    for (let i = 0; i < wordBodies.length; i++) {
      userWord.push(
        wordBodies[i].getElementsByClassName("word__body__front")[0].textContent
      );
    }
    let userWordString = userWord.join("");
    if (guesses.includes(userWordString)) message(3, 4000);
    else {
      if (allTheWords.includes(userWordString)) {
        for (let i = 0; i < wordBodies.length; i++) {
          if (userWord[i] == theWord[i]) {
            correctPositions.push(userWord[i]); // array med alla bokstäver som sitter rätt
          }
        }
        for (let i = 0; i < wordBodies.length; i++) {
          let div = document.createElement("div");
          let cssClass = () => {
            
            if (userWord[i] == theWord[i]) {
              pluppar += "🟩";
              return "correct";
            } else if (theWord.includes(userWord[i])) {
              if (
                countOccurrences(theWord, userWord[i]) ==
                countOccurrences(userWord, userWord[i])
              ) {
                pluppar+= "🟨";
                return "close";
              } else if (
                countOccurrences(theWord, userWord[i]) >
                countOccurrences(userWord, userWord[i])
              ) {
                pluppar += "🟨";
                return "close";
              } else if (
                countOccurrences(theWord, userWord[i]) <
                countOccurrences(userWord, userWord[i])
              ){
                if (usedChares.includes(userWord[i])){
                  if (!darkMode) pluppar+= "⬜"; else pluppar+="⬛️";
                  return 'false'
                } else if (!correctPositions.includes(userWord[i])) {
                  usedChares.push(userWord[i]);
                  pluppar+= "🟨";
                  return 'close';
                }
                else {
                  if (!darkMode) pluppar+= "⬜"; else pluppar+="⬛️";
                  return 'false';
                }
              }              
              else {
                if (!darkMode) pluppar+= "⬜"; else pluppar+="⬛️";
                return "false";
              }
            } else {
              if (!darkMode) pluppar+= "⬜"; else pluppar+="⬛️";
              return "false";
            }
          };
          
       
          div.classList.add("word__body__back", cssClass());
          div.textContent = userWord[i];
          wordBodies[i].appendChild(div);
          wordBodies[i].classList.add("flip");
        }   
        shareArr.push(pluppar);
        // console.log(shareArr);
        updateKeyboard(userWord);
        rowState++;
        guesses.push(userWordString);
        pressedKeysArr = [];

        if (userWordString == theWordString) {
          setTimeout(() => {
            elements.classList.add("win");
            // for (p=0; p<wordBodies.length; p++) {
            //   wordBodies[p].classList.add('win');
            // }
          }, 500);
          //  message(5);
          game = false;
          setTimeout(() => {
            toggleEndView(rowState - 1);
            modalGame.classList.toggle("toggle");
          }, 1500);
          return;
        }
        if (rowState == 7) {
          message(1, 4000);
          lostGame = true;
          toggleEndView(rowState);
          setTimeout(() => {
            // toggleEndView(rowState-1);
            modalGame.classList.toggle("toggle");
          }, 1500);
        }
      } else {
        message(2, 4000);
        document.getElementById("row" + rowState).classList.add("shake");
        setTimeout(() => {
          document.getElementById("row" + rowState).classList.remove("shake");
        }, 2000);
      }
      setElements();
    }
  }
}
let pressedKeysArr = [];

const countOccurrences = (arr, val) => {
  return arr.reduce((acc, elem) => {
    if (elem === val) {
      acc++;
    }
    return acc;
  }, 0);
};

function startGame() {
  keyboard = document.getElementById("keyboard");
  startView.classList.toggle("visible");
  document.getElementById("btnComeBackTomorow").style.display = "block";
  document.getElementById("btnPlayGame").style.display = "none";
  keyboard.addEventListener("click", (e) => {
    let key = e.target.getAttribute("data-key");
    handleKeyPress(key);
  });
  document.addEventListener("keydown", handleKeyPress);
  modalGame.classList.toggle("toggle");

}

function handleKeyPress(event) {
  let k;
  event.key ? (k = event.key) : (k = event);
  if (k == "Backspace" && pressedKeysArr.length > 0) {
    pressedKeysArr.pop();
    wordBodies[pressedKeysArr.length].getElementsByClassName(
      "word__body__front"
    )[0].innerHTML = "";
  }
  if (pressedKeysArr.length < 5 && alphabet.includes(k) && game) {
    pressedKeysArr.push(k);
    wordBodies[pressedKeysArr.length - 1].getElementsByClassName(
      "word__body__front"
    )[0].innerHTML = k;
  }
  if (k == "Enter") {
    if (pressedKeysArr.length == 5) doCheck();
    else message(4, 4000);
  }
}

function toggleEndView(rs) {
  if (rs < 7) {
    noOfAttempts.innerHTML = rs;
    points=Math.pow(2, 6-rs)*10;
  } else {
    noOfAttempts.innerHTML = "X";
    points = 0;
  }
  scoredPoints.innerHTML = points;
  endView.classList.toggle("hidden");
  document.getElementById("resBodyColor").innerHTML = `${printColorBoxes()}`;
  document.removeEventListener("keydown", handleKeyPress);
}

function returnToStart() {
  endView.classList.toggle("hidden");
  startView.classList.toggle("visible");
}

function printColorBoxes(arrq) {
  let wrappedItems = shareArr.map((item) => `</br>${item} `);
  return wrappedItems.join("").trim();
}

function shareResult() {
  let att = () => {
    let nr = () => {
      if (rowState - 1 < 3) return ":a";
      else return ":e";
    };
    // if (lostGame) return `Jag klarade inte <a href="https://joyful-blini-97982a.netlify.app/">Dagens ord</a> och fick `;
    if (lostGame) return `Jag klarade inte Dagens ord och fick `;
    else
      return `Jag klarade <a href="https://joyful-blini-97982a.netlify.app/">Dagens ord</a> på ${
        // return `Jag klarade Dagens ord på ${
        rowState - 1
      }${nr()} försöket och fick `;
  };
  let emoji = () => {
    if (rowState - 1 < 3) return "😁";
    if (rowState - 1 > 2 && rowState - 1 < 6) return "🙂";
    if (rowState - 1 > 5 && rowState - 1 < 7 && !lostGame) return "😐";
    else return "😡";
  };
  let content = `${att()} ${points} 
    poäng ${emoji()}
    ${printColorBoxes()}
    `;
  let copyText = `${att()} ${points} poäng ${emoji()}
     ${printColorBoxes()}`;
  const mu = document.getElementById("js-output");
  mu.innerHTML = copyText;
  document.getElementById("shareFeedback").style.opacity = "1";
  putTextInClipboard();
}
function toggleModalLb() {
  modalLb.classList.toggle("toggle");
}
function toggleModalMs() {
  modalMs.classList.toggle("toggle");
}
const abortGame = () => {
  if (game) {
    const response = confirm(
      "Avsluta spelet? Du kommer att få 0 poäng för detta spel."
    );
    if (response) {
      startView.classList.toggle("visible");
      modalGame.classList.toggle("toggle");
      document.removeEventListener("keydown", handleKeyPress);
    } else {
      return;
    }
  }
  game = false;
};

function putTextInClipboard() {
  try {
    const content = document.getElementById("js-output").innerHTML;
    const blobInput = new Blob([content], { type: "text/html" });
    const clipboardItemInput = new ClipboardItem({ "text/html": blobInput });
    navigator.clipboard.write([clipboardItemInput]);
  } catch (e) {
    console.log(e);
  }
}
function modeToggle(){
  const checkBox = document.getElementById("modeToggle");
  const body = document.body;
  if (checkBox.checked == false){
    body.classList.remove('darkMode');
    body.classList.add('lightMode');
    darkMode=false;
    localStorage.setItem("mode", "light");

  } else {
    body.classList.add('darkMode');
    body.classList.remove('lightMode');
    darkMode=true;
    localStorage.setItem("mode", "dark");
  }
}
if (!localStorage.getItem("mode")) {
  localStorage.setItem("mode", "light");
}
else {
  if (localStorage.getItem("mode")=="dark") {
    document.getElementById("modeToggle").checked = true;
    modeToggle();
  }
}

const ies = document.querySelectorAll('.icon');
function doIcons(){  
 const comment = `
<svg id="Lager_1" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <path class="cls-1" d="m21.75,18.75h-10.5l-6,4.5v-4.5h-3c-.83,0-1.5-.67-1.5-1.5V2.25c0-.83.67-1.5,1.5-1.5h19.5c.83,0,1.5.67,1.5,1.5v15c0,.83-.67,1.5-1.5,1.5Z"/>
  <path class="cls-1" d="m5.25,7.5h13.5"/>
  <path class="cls-1" d="m5.25,12h10.5"/>
</svg>`;
const share =`
<svg id="Lager_2" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
<path class="cls-1" d="m21.75,5.25h-8.25c-1.66,0-3,1.34-3,3v3.75"/>
<path class="cls-1" d="m17.25,9.75l4.5-4.5L17.25.75"/>
<path class="cls-1" d="m18.75,14.25v7.5c0,.83-.67,1.5-1.5,1.5H3.75c-.83,0-1.5-.67-1.5-1.5v-12c0-.83.67-1.5,1.5-1.5h2.25"/>
</svg>`;
const like=`
<svg id="Lager_3" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <path class="cls-1" d="m.77,8.01h1.96c.26,0,.51.1.69.29.18.18.29.43.29.69v11.74c0,.26-.1.51-.29.69-.18.18-.43.29-.69.29H.77"/>
  <path class="cls-1" d="m3.71,19.12c4.01,2.28,6.83,3.42,12.98,3.42,3.71,0,7-7.43,6.49-11.1-.17-1.26-.57-2.1-1.85-2.11h-4.8c-1.26,0-2.21-1.23-1.89-2.46l.86-3.27c.46-1.76-1.95-2.88-2.99-1.39l-4.78,6.78c-.18.26-.42.47-.7.61-.28.14-.59.22-.9.22h-2.41"/>
</svg>
`;
const personalStats = `
<svg id="Lager_1" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
<g>
  <path class="cls-1" d="m8.24,3.74v-2c0-.55.45-1,1-1h12.97c.55,0,1,.45,1,1v8.98c0,.55-.45,1-1,1h-7.4"/>
  <polyline class="cls-1" points="12.34 5.17 14.38 4.05 16.15 9 18.09 5.25 21.22 4.05"/>
</g>
<g>
  <path class="cls-1" d="m4.01,10.83c0,2.09,1.69,3.78,3.78,3.78s3.78-1.69,3.78-3.78-1.69-3.78-3.78-3.78-3.78,1.69-3.78,3.78Z"/>
  <path class="cls-1" d="m.77,23.25c0-3.88,3.14-7.02,7.02-7.02s7.02,3.14,7.02,7.02"/>
</g>
</svg>`;
const rankingWinner = `
<svg id="Lager_1" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <path class="cls-1" d="m10.5,5.25h.75c.41,0,.75.34.75.75v4.5"/>
  <path class="cls-1" d="m10.5,10.5h3"/>
  <path class="cls-1" d="m16.5,23.25H7.5V2.25c0-.83.67-1.5,1.5-1.5h6c.83,0,1.5.67,1.5,1.5v21Z"/>
  <path class="cls-1" d="m23.25,21.75c0,.83-.67,1.5-1.5,1.5h-5.25v-9.75h5.25c.83,0,1.5.67,1.5,1.5v6.75Z"/>
  <path class="cls-1" d="m7.5,23.25H2.25c-.83,0-1.5-.67-1.5-1.5v-11.25c0-.83.67-1.5,1.5-1.5h5.25v14.25Z"/>
</svg>
`;
ies.forEach(ie => {
  if (ie.textContent=='comment') ie.innerHTML=comment;
  if  (ie.textContent=='share') ie.innerHTML=share;
  if  (ie.textContent=='like') ie.innerHTML=like;
  if  (ie.textContent=='personal-stats') ie.innerHTML=personalStats;
  if  (ie.textContent=='ranking-winner') ie.innerHTML=rankingWinner;
})
}
doIcons();
