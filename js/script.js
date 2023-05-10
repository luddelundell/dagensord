const devMode = false;
let allTheWords, theWord, theWordString, elements, wordBodies, keyboard, points;
let darkMode=false;
const messageDiv = document.getElementById("message");
const startView = document.getElementById("startView");
const endView = document.getElementById("endView");
const noOfAttempts = document.getElementById("noOfAttempts");
const scoredPoints = document.getElementById("scoredPoints");
const modalGame = document.getElementById("modalGame");
const modalHelp = document.getElementById("modalHelp");
const modalMs = document.getElementById("modalMs");
const foo = document.getElementById("foo");
let lostGame = false;
const startDate = new Date("2023-04-19");
const thisDate = new Date();
let gameNo = Math.floor((thisDate - startDate) / 86400000);
const nowDate = new Date();
let gameDate = nowDate.getFullYear()+''+nowDate.getMonth()+''+nowDate.getDay();
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
  theWord = theWordString.split("");
}
if (localStorage.getItem("gd")==gameDate && !devMode ){  
  document.getElementById("btnComeBackTomorow").style.display = "block";
} else {
  const startButton=`<button class="btn btn-primary w100" onclick="startGame()" id="btnPlayGame">Spela dagens ord</button>`;
  document.getElementById("startButton").innerHTML=startButton;
};
function updateKeyboard(userWord) {
  let temp = "";
  for (let i = 0; i < userWord.length; i++) {
    let key = userWord[i];
    let myButton = document.querySelector("[data-key=" + key + "]");
    if (userWord[i] == theWord[i]) {
      myButton.classList.add("correct");
    } else if (theWord.includes(userWord[i])) {
      myButton.classList.add("close");
    } else {
      myButton.classList.add("false");
    }
  }
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
      messageTxt = `<p class="no-flex">Nu är det slut på gissningar! Ordet vi sökte är <span class="letter">${theWord[0]}</span><span class="letter">${theWord[1]}</span><span class="letter">${theWord[2]}</span><span class="letter">${theWord[3]}</span><span class="letter">${theWord[4]}</span></p>`;
      game = false;
    }
    if (t == 2) messageTxt = `<p><span class="emoji">🤔</span>Ordet finns inte i listan</p>`;
    if (t == 3) messageTxt = `<p><span class="emoji">🤯</span>Du har redan gissat på det här ordet</p>`;
    if (t == 4) messageTxt = `<p><span class="emoji">🫣</span>Ordet har för få bokstäver</p>`;
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
        updateKeyboard(userWord);
        rowState++;
        guesses.push(userWordString);
        pressedKeysArr = [];
        if (userWordString == theWordString) {
          setTimeout(() => {
            elements.classList.add("win");
          }, 500);
          game = false;
          document.getElementById("lottieSuccess").style.display="block";
          setTimeout(() => {
            document.getElementById("lottieSuccess").style.display="none";
          }, 4000);
          setTimeout(() => {
            toggleEndView(rowState - 1);
            document.getElementById("modalGameInner").innerHTML=document.getElementById("endView").innerHTML;
          }, 2500);
          return;
        }
        if (rowState == 7) {
          message(1, 6000);
          lostGame = true;
          toggleEndView(rowState);
          setTimeout(() => {          
            document.getElementById("modalGameInner").innerHTML=document.getElementById("endView").innerHTML;
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
  localStorage.setItem("gd", gameDate);
  // message(1, 4000); // TA BORT MIG!
}

function handleKeyPress(event) {
  let k;
  event.key ? (k = event.key) : (k = event);
  if (k== "Escape") abortGame();
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
  modalGame.classList.toggle("toggle");
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
    if (lostGame) return `Jag klarade inte Dagens ord och fick `;
    else
      return `Jag klarade <a href="https://joyful-blini-97982a.netlify.app/">Dagens ord</a> på ${
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
function toggleModalHelp() {
  modalHelp.classList.toggle("toggle");
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
<svg id="Lager_4" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <path class="cls-1" d="m11.52,23c0-2.91-2.35-5.26-5.26-5.26-2.91,0-5.26,2.35-5.26,5.26,0,0,0,0,0,0"/>
  <ellipse class="cls-1" cx="6.26" cy="12.44" rx="3.68" ry="3.7"/>
  <path class="cls-1" d="m12.69,14.12h9.38c.52,0,.94-.42.94-.94V1.94c0-.52-.42-.94-.94-.94h-13.13c-.52,0-.94.42-.94.94h0v4.69"/>
  <path class="cls-1" d="m19.92,3.45c-2.56,1.85-5.57,2.99-8.72,3.29"/>
  <line class="cls-1" x1="19.5" y1="7.06" x2="19.5" y2="10.97"/>
  <line class="cls-1" x1="13" y1="10.31" x2="13" y2="10.97"/>
  <line class="cls-1" x1="16" y1="8.91" x2="16" y2="10.97"/>
</svg>`;
const rankingWinner = `
<svg id="Lager_5" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <path class="cls-1" d="m10.5,5.25h.75c.41,0,.75.34.75.75v4.5"/>
  <path class="cls-1" d="m10.5,10.5h3"/>
  <path class="cls-1" d="m16.5,23.25H7.5V2.25c0-.83.67-1.5,1.5-1.5h6c.83,0,1.5.67,1.5,1.5v21Z"/>
  <path class="cls-1" d="m23.25,21.75c0,.83-.67,1.5-1.5,1.5h-5.25v-9.75h5.25c.83,0,1.5.67,1.5,1.5v6.75Z"/>
  <path class="cls-1" d="m7.5,23.25H2.25c-.83,0-1.5-.67-1.5-1.5v-11.25c0-.83.67-1.5,1.5-1.5h5.25v14.25Z"/>
</svg>
`;
const questionCircle = `
<svg id="Lager_6" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <path class="cls-3" d="m9,9c0-.55.15-1.09.44-1.56.29-.47.7-.85,1.18-1.1.49-.25,1.04-.37,1.59-.33.55.04,1.08.23,1.53.54.45.32.8.75,1.02,1.26.22.5.29,1.06.22,1.6-.08.54-.3,1.06-.65,1.48s-.81.75-1.32.93c-.29.1-.55.3-.73.55-.18.25-.28.56-.27.87v1.01"/>
  <path class="cls-2" d="m12.19,18c-.21,0-.38-.17-.38-.38s.17-.38.38-.38"/>
  <path class="cls-2" d="m11.81,18c.21,0,.38-.17.38-.38s-.17-.38-.38-.38"/>
  <path class="cls-1" d="m12,23.25c6.21,0,11.25-5.04,11.25-11.25S18.21.75,12,.75.75,5.79.75,12s5.04,11.25,11.25,11.25Z"/>
</svg>
`;
const analyticsGraphBar = `
<svg id="Lager_7" data-name="Lager 1" xmlns="http://www.w3.org/2000/svg" class="myIcon" viewBox="0 0 24 24">
  <g>
    <line class="cls-1" x1="6.88" y1="5.12" x2="2.87" y2="9.13"/>
    <line class="cls-1" x1="14.31" y1="6.32" x2="9.64" y2="5.08"/>
    <line class="cls-1" x1="20.39" y1="2.89" x2="16.81" y2="5.69"/>
  </g>
  <circle class="cls-1" cx="8.25" cy="4.5" r="1.5"/>
  <circle class="cls-1" cx="21.75" cy="2.25" r="1.5"/>
  <circle class="cls-1" cx="15.75" cy="6.75" r="1.5"/>
  <circle class="cls-1" cx="2.25" cy="10.5" r="1.5"/>
  <line class="cls-1" x1=".75" y1="23.25" x2="23.25" y2="23.25"/>
  <path class="cls-1" d="m6,17.75h-3c-.41,0-.74.34-.75.75v4.75h4.5v-4.75c0-.41-.34-.75-.75-.75Z"/>
  <path class="cls-1" d="m13.5,10.75h-3c-.41,0-.74.34-.75.75v11.75h4.5v-11.75c0-.41-.34-.75-.75-.75Z"/>
  <path class="cls-1" d="m21,14.75h-3c-.41,0-.74.34-.75.75v7.75h4.5v-7.75c0-.41-.34-.75-.75-.75Z"/>
</svg>
`;
ies.forEach(ie => {
  let iconAttribute = ie.getAttribute("data-icon");
  switch (iconAttribute) {
    case "comment":ie.innerHTML=comment; break;
    case "share":ie.innerHTML=share; break;
    case "like":ie.innerHTML=like; break;
    case "personal-stats":ie.innerHTML=personalStats; break;
    case "ranking-winner":ie.innerHTML=rankingWinner; break;
    case "question-circle":ie.innerHTML=questionCircle; break;
    case "analytics-graph-bar":ie.innerHTML=analyticsGraphBar; break;
  }
})
}
doIcons();
const tabs = document.getElementById("tabs");
const tabButton = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.onclick = e => {
  const id = e.target.dataset.id;
  if (id) {
    tabButton.forEach(btn => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    contents.forEach(content => {
      content.classList.remove("active");
    });
    const element = document.getElementById(id);
    element.classList.add("active");
  }
}
// const player = document.querySelector("lottie-player");