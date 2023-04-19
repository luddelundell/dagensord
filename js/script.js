let allTheWords, theWord, theWordString, elements, wordBodies, keyboard;
const messageDiv = document.getElementById('message');
const startView = document.getElementById('startView');
const endView = document.getElementById("endView");
const noOfAttempts = document.getElementById("noOfAttempts");
const scoredPoints = document.getElementById("scoredPoints");
const alphabet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "å", "ä", "ö",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "Å", "Ä", "Ö"
];
let guesses = [];
let rowState = 1;
let game = true;
fetch('../data/svenska-ord.json')
  .then(response => response.json())
  .then(data => {
    const words = data;
    const fiveLetterWords = words.filter(word => word.length === 5);
    const nohypen = fiveLetterWords.filter(word => !word.includes('-'));
    allTheWords = nohypen;    
    wordOfTheDay(nohypen);
  })
  .catch(error => {
    console.error(error);
  });

  function wordOfTheDay(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    // theWordString = arr[randomIndex];
    theWordString='krama'
    theWord = theWordString.split('');
    console.log(theWordString);
  }
  function updateKeyboard(userWord){
    for (let i=0; i< userWord.length; i++) {
        let key = userWord[i];
      let myButton = document.querySelector('[data-key='+key+']')
        if (userWord[i] == theWord[i]) myButton.classList.add('correct');
        else if (theWord.includes(userWord[i])) myButton.classList.add('close');
        else myButton.classList.add('false');
    }
  }
  function setElements(){
    if (game){
      elements = document.getElementById('row'+rowState);
      wordBodies = elements.getElementsByClassName('word__body');
    }
  }
  function message(t){
    // console.log('t:'+t);
    if (game) {
      let messageTxt = `<p>Unknown error message</p>`;
      if (t==1) {
        messageTxt = `<p>Nu är det slut på gissningar! Ordet vi sökte är ${theWordString}</p>`;
        game=false;
      }
      if (t==2) messageTxt = '<p>Ordet finns inte i listan</p>';
      if (t==3) messageTxt = `<p>Du har redan gissat på det här ordet</p>`;
      if (t==4) messageTxt = `<p>För få bokstäver</p>`;
      if (t==5) {
        messageTxt = `<p class="success"><span>🎉</span>Rätt svar, grattis!</p>`;
        game=false;

        // toggleEndView();
      }
      messageDiv.innerHTML=messageTxt;
      messageDiv.classList.add('visible');
      setTimeout(() => {
        messageDiv.classList.remove('visible')
      }, 4000);
    }
  }
  setElements();
  function doCheck(){
    if (game) {
      messageDiv.innerHTML = '';
      let userWord = [];
      // let succesChars = [];
      // for (let t=0; t < wordBodies.length; t++) {
      //   if (theWord.includes(userWord[t])) succesChars.push(userWord[t]);
      // }
      // console.log(succesChars);
      for (let i=0; i < wordBodies.length; i++) {
          userWord.push(wordBodies[i].getElementsByClassName('word__body__front')[0].textContent);
      };
      let userWordString = userWord.join('');
      if (guesses.includes(userWordString)) message(3);
      else {
          if (allTheWords.includes(userWordString)) {
          for (let i=0; i < wordBodies.length; i++) {
              let div = document.createElement("div");
              let cssClass = () => {
                // let successList=[];
                if (userWord[i] == theWord[i]) {
                  // successList.push(userWord[i]);
                  return 'correct';            
                }                  
                if (theWord.includes(userWord[i])) return 'close'; // skriv om och gör så att samma bokstav inte kan markeras fler gånger (m)a(m)(m)a - > krama
                  return 'false'
                }
              div.classList.add('word__body__back', cssClass());
              div.textContent=userWord[i];            
              wordBodies[i].appendChild(div);
              wordBodies[i].classList.add('flip');
              
          }
          updateKeyboard(userWord);
          rowState++; 
          console.log(rowState);
          guesses.push(userWordString);
          pressedKeysArr = [];
          if (userWordString == theWordString) {
            setTimeout(() => {
              elements.classList.add('win');
              // for (p=0; p<wordBodies.length; p++) {
              //   wordBodies[p].classList.add('win');
              // }              
            }, 500);
          //  message(5);   
          game=false;
          setTimeout(() => {
            toggleEndView(rowState-1);
          }, 1500);
         
          }
          if (rowState==7) message(1);
          }
          else {
              message(2);
          }
          setElements();
      }
    }
  }
  let pressedKeysArr = [];
  document.body.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    keyPress(event.key)
  });

  function startGame(){
    keyboard = document.getElementById("keyboard");
    startView.classList.toggle('visible');
    document.getElementById("btnComeBackTomorow").style.display="block";
    document.getElementById("btnPlayGame").style.display="none";
      keyboard.addEventListener('click', (e)=> {
    let key = e.target.getAttribute("data-key")
    keyPress(key);
  });
  }

  function keyPress(k){
    if (k == 'Backspace' && pressedKeysArr.length > 0) {
      pressedKeysArr.pop();
      wordBodies[pressedKeysArr.length].getElementsByClassName('word__body__front')[0].innerHTML='';
    }
    if (pressedKeysArr.length<5 && alphabet.includes(k) && game) { 
        pressedKeysArr.push(k);
        wordBodies[pressedKeysArr.length-1].getElementsByClassName('word__body__front')[0].innerHTML=k;
    }
    if (k == 'Enter') {
        if (pressedKeysArr.length == 5) doCheck();
        else message(4);
    }
  }
  function toggleEndView(rs){
    noOfAttempts.innerHTML=rs;
    let points = Math.round(100/rs);
    scoredPoints.innerHTML = points;
    endView.classList.toggle("hidden");
  }
  function returnToStart(){
    endView.classList.toggle("hidden");
    startView.classList.toggle('visible');
  }
  function shareResult(){
    let content = `  <p>Dagens ord 3/6 - Xp</p>
    <p>⬜⬜🟩⬜🟨</p>
    <p>🟩🟩🟩🟩⬜</p>
    <p>🟩🟩🟩🟩🟩</p>`;
    const fejkPostBody=document.getElementById('fejkPostBody');
    document.getElementById('fejkPost').style.display="block";
    fejkPostBody.innerHTML=content;
  }
  function toggleModal(){
    document.getElementById("modal").classList.toggle('toggle');
  }
  const abortGame = () => {
    const response = confirm('Avsluta spelet? Du kommer att få 0 poäng för detta spel.');
    if (response) {
      // alert('Game ended. You got zero points')
      // endView.classList.toggle("hidden");
      startView.classList.toggle('visible');
    }else {
      return;
    }
  }
//   if (event.key == 'Backspace' && pressedKeys.length > 0) {
//     pressedKeys.pop();
//     wordBodies[pressedKeysArr.length].getElementsByClassName('word__body__front')[0].innerHTML='';
// }
// if (pressedKeys.length<5 && alphabet.includes(event.key) && game) { 
//     pressedKeys.push(event.key);
//     wordBodies[pressedKeysArr.length-1].getElementsByClassName('word__body__front')[0].innerHTML=event.key;
// }
// if (event.key == 'Enter') {
//     if (pressedKeysArr.length == 5) doCheck();
//     else message(4);
// }