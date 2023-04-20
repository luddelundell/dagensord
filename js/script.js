let allTheWords, theWord, theWordString, elements, wordBodies, keyboard;
const messageDiv = document.getElementById('message');
const startView = document.getElementById('startView');
const endView = document.getElementById("endView");
const noOfAttempts = document.getElementById("noOfAttempts");
const scoredPoints = document.getElementById("scoredPoints");
const output = document.getElementById("output");
let lostGame=false;
const startDate = new Date('2023-04-19, 00:00:00');
const thisDate = new Date();
let gameNo = Math.floor((thisDate - startDate)/86400000);
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
let shareArr=[];
fetch('../data/swe-five-letter-words.json')
  .then(response => response.json())
  .then(data => {
    allTheWords = data;    
    wordOfTheDay(data);
  })
  .catch(error => {
    console.error(error);
  });
 
  // function shuffle(array) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }



  function wordOfTheDay(arr) {
    // const randomIndex = Math.floor(Math.random() * arr.length);
    // theWordString = arr[randomIndex];
    // theWordString='frysa';
    theWordString = arr[gameNo];
    theWord = theWordString.split('');
    // console.log(theWordString);

    // let randomArr = shuffle(arr);
    // let text ="["
    // for (i=0; i<randomArr.length; i++){
    //   text+=`"${randomArr[i]}", `
    // }
    // text+="]";
    // output.innerHTML=text;
  }
  function updateKeyboard(userWord){
    let temp ='';
    for (let i=0; i< userWord.length; i++) {
        let key = userWord[i];
        
        let myButton = document.querySelector('[data-key='+key+']')
        if (userWord[i] == theWord[i]) {
           myButton.classList.add('correct');
           temp+='🟩';
           //🟩⬜🟨
        }
        else if (theWord.includes(userWord[i])) {
          myButton.classList.add('close');
          temp+='🟨';
        }
        else {
          myButton.classList.add('false');
          temp+='⬜';
      }
    }
    shareArr.push(temp);
    // console.log(shareArr);
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
            // console.log(rowState);
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
          return;
            }
            if (rowState==7) {
              // message(1);
              lostGame=true;
              toggleEndView(rowState);
            }

            }
            else {
                message(2);
            }
            setElements();
        }
    }
  }
  let pressedKeysArr = [];


  function startGame(){
    // console.log('startGame');
    keyboard = document.getElementById("keyboard");
    startView.classList.toggle('visible');
    document.getElementById("btnComeBackTomorow").style.display="block";
    document.getElementById("btnPlayGame").style.display="none";
    keyboard.addEventListener('click', (e)=> {
      let key = e.target.getAttribute("data-key")
      keyPress(key);
    });
    document.addEventListener('keydown', handleKeyPress);
  }
  function handleKeyPress(event) {
    // console.log('Key pressed:', event.key);
    if (event.key == 'Backspace' && pressedKeysArr.length > 0) {
      pressedKeysArr.pop();
      wordBodies[pressedKeysArr.length].getElementsByClassName('word__body__front')[0].innerHTML='';
    }
    if (pressedKeysArr.length<5 && alphabet.includes(event.key) && game) { 
        pressedKeysArr.push(event.key);
        wordBodies[pressedKeysArr.length-1].getElementsByClassName('word__body__front')[0].innerHTML=event.key;
    }
    if (event.key == 'Enter') {
        if (pressedKeysArr.length == 5) doCheck();
        else message(4);
    }
  }

  let points;
  function toggleEndView(rs){
    if (rs < 7) {
      noOfAttempts.innerHTML=rs;
      points = Math.round(100/rs);
    } else {
      noOfAttempts.innerHTML='X';
      points=0;
    }
    scoredPoints.innerHTML = points;
    endView.classList.toggle("hidden");
    document.getElementById("resBodyColor").innerHTML=`${printColorBoxes()}`;
    document.removeEventListener('keydown', handleKeyPress);  
  }

  function returnToStart(){
    endView.classList.toggle("hidden");
    startView.classList.toggle('visible');
  }
  
  function printColorBoxes(arr){
    let wrappedItems = shareArr.map(item => `<p>${item}</p>`);
    return wrappedItems.join("");
  }
  
  function shareResult(){
    let att = () => {
      let nr = () => { 
        if (rowState-1 < 3) return ':a';
        else return ':e';
      }
      if (lostGame) return 'Jag klarade inte Dagens ord och fick ';
      else return `Jag klarade Dagens ord på ${rowState-1}${nr()} försöket och fick `;
    }
    let emoji = () => {
      if (rowState-1 < 3) return '😁';
      if (rowState-1 > 2 && rowState-1 < 6) return '🙂';
      if (rowState-1 > 5 && rowState-1 < 7 && !lostGame) return '😐'
      else return '😡';
    }
    let content = `  <p>${att()} ${points} poäng ${emoji()}</p>
    ${printColorBoxes()}
    `;
    const fejkPostBody=document.getElementById('fejkPostBody');
    document.getElementById('fejkPost').style.display="block";
    fejkPostBody.innerHTML=content;
  }
  function toggleModal(){
    document.getElementById("modal").classList.toggle('toggle');
  }
  const abortGame = () => {
    if (game) {
      const response = confirm('Avsluta spelet? Du kommer att få 0 poäng för detta spel.');
      if (response) {
        startView.classList.toggle('visible');
        document.removeEventListener('keydown', handleKeyPress);     
      }else {
        return;
      }
    }
    game = false;
  }
