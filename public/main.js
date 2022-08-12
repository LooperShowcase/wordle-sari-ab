let chars = 5;
let words = 6;
let gameDiv = document.getElementById("game");

for (let i = 0; i < words; i++) {
  let wordDiv = document.createElement("div");
  wordDiv.className = "word";

  for (let j = 0; j < chars; j++) {
    let charDiv = document.createElement("div");
    charDiv.className = "char";
    wordDiv.appendChild(charDiv);
  }
  gameDiv.appendChild(wordDiv);
}

let curWord = 0;
let curChar = 0;
document.addEventListener("keydown", async function (event) {
  let wordDiv = gameDiv.children[curWord];

  if (event.code == "Backspace") {
    let charToDel = wordDiv.children[curChar - 1];
    charToDel.innerHTML = "";
    curChar--;
  } else if (event.code == "Enter" && curChar == chars) {
    const word = getCurrentWord();
    animateCSS(wordDiv, "fadeIn");
    const result = await (await fetch("/wordle/" + word)).json();
    for (let i = 0; i < result.length; i++) {
      wordDiv.children[i].style.background = result[i];
    }
    curWord++;
    curChar = 0;
  } else if (isLetter(event.key) && curChar < chars) {
    let charArr = wordDiv.children[curChar];
    charArr.innerHTML = event.key.toUpperCase();
    curChar++;
  }
});

function getCurrentWord() {
  let word = "";
  let wordDiv = gameDiv.children[curWord];
  for (let i = 0; i < chars; i++) {
    let charDiv = wordDiv.children[i];
    word += charDiv.innerHTML;
  }
  return word;
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    element.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      element.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });
