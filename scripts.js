// Global variables
const numButtons = [document.querySelector('.zero')].concat(
         Array.from(document.querySelectorAll('.botRow')).concat(
         Array.from(document.querySelectorAll('.midRow')).concat(
         Array.from(document.querySelectorAll('.topRow')).concat(
                   [document.querySelector('#decimal')]))));
const operatorButtons = Array.from(document.querySelectorAll('.operator'));
const equalsButton = document.querySelector('#equals');
const clearButton = document.querySelector('#clear');
const clearAllButton = document.querySelector('#allClear');
const backspaceBtn = document.querySelector('#backspace');
const mainDiv = document.querySelector('#main');
const historyDiv = document.querySelector('#history');
const negateBtn = document.querySelector('#negate');

let currentInput = "";
let historyValue = "";
let currentOperator = "";
let result = "";
let alreadyClickedOperator = false;
let alreadyClickedEqual = false;

// Event listeners
numButtons.forEach(button => button.addEventListener('click', appendInputValue));
operatorButtons.forEach(button => button.addEventListener('click', respondToOperator));
equalsButton.addEventListener('click', function(){operate(currentOperator, historyValue, currentInput);});
clearButton.addEventListener('click', clearMain);
clearAllButton.addEventListener('click', clearAll);
backspaceBtn.addEventListener('click', backspace);
negateBtn.addEventListener('click', negate);

// Basic operations
function add(a,b){return +a + +b;}
function subtract(a,b){return a-b;}
function multiply(a,b){return a*b;}
function divide(a,b){return a/b;}

function operate(operator, a, b){
  if (alreadyClickedOperator || alreadyClickedEqual) return;
  switch(operator){
    case "+": result = add(a,b).toString();
              break;
    case "-": result = subtract(a,b).toString();
              break;
    case "×": result = multiply(a,b).toString();
              break;
    case "÷": result = divide(a,b).toString();
              break;
  }
  historyDiv.innerHTML += ` ${currentInput}`;
  clearMain();
  clearOperator();
  mainDiv.innerHTML = round(result);
  showItem(mainDiv);
  hideItem(historyDiv);
  alreadyClickedEqual = true;
  alreadyClickedOperator = false;
}

function appendInputValue(e) {
  if((e.target.innerHTML === '.' && currentInput.includes(".")) || currentInput.length > 10) return;
  currentInput += e.target.innerHTML;
  mainDiv.innerHTML = currentInput;
  showItem(mainDiv);
  alreadyClickedOperator = false;
  alreadyClickedEqual = false;
}

function respondToOperator(e){
  if (alreadyClickedOperator) {
    replaceOperator(e)
    return;
  }
  if(currentOperator !== ""){
    operate(currentOperator, historyValue, currentInput);
  }
  inputToHistory(e);
  hideItem(mainDiv);
  showItem(historyDiv);
  clearInput();
  alreadyClickedOperator = true;
  alreadyClickedEqual = false;
}

function inputToHistory(e){
  historyValue = (!alreadyClickedEqual) ? currentInput : result;
  currentOperator = e.target.innerHTML;
  historyDiv.innerHTML = historyValue + ` ${currentOperator}`;
}

function replaceOperator(e){
  currentOperator = e.target.innerHTML;
  historyDiv.innerHTML = historyValue + ` ${currentOperator}`;
}

function negate(e){
  if (result === mainDiv.innerHTML){
    if (result.charAt(0) === "-"){
      result = result.slice(1, result.length);
    }else {
      result = "-" + result;
    }
    mainDiv.innerHTML = result;
  }else if (currentInput === mainDiv.innerHTML){
    if (currentInput.charAt(0) === "-"){
      currentInput = currentInput.slice(1, currentInput.length);
    }else {
      currentInput = "-" + currentInput;
    }
    mainDiv.innerHTML = currentInput;
  }
}

function round(numStr){
  const maxLength = (numStr.includes(".") || numStr.includes('-')) ? 11 : 10;
  let solution = Number(numStr);
  if (numStr.includes('e+')){
    return "Result is too large";
  }else if (numStr.length > maxLength && numStr.includes('.')){
    let numOfDecimals = numStr.slice(numStr.indexOf('.')+1).length;
    let lengthDifference = numStr.length - maxLength;
    solution = parseFloat(solution.toFixed(numOfDecimals - lengthDifference));
  }else if (numStr.length > maxLength){
    return "Result is too large";
  }else if(numStr === "Infinity"){
    return "Please no!";
  }
  return solution.toString();
}

function clearMain() {
  currentInput = "";
  mainDiv.innerHTML = currentInput;
}

function clearOperator() {
  currentOperator = "";
}

function clearAll(){
  clearMain();
  clearOperator();
  historyValue = "";
  result = "";
  alreadyClicked = false;
  historyDiv.innerHTML = historyValue;
}

function clearInput() {
  currentInput = "";
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  mainDiv.innerHTML = currentInput;
}

function hideItem(item){
  item.classList.add('hidden');
}

function showItem(item){
  item.classList.remove('hidden');
}

// Keyboard Support

document.addEventListener('keyup', e => {
  if (isNaN(Number(e.key))){
    switch (e.key) {
      case "Backspace":
        backspace();
        break;
      case "Delete":
        clearAll();
        break;
      case ".":
          numButtons[10].click();
          break;
        case "+":
          operatorButtons[2].click();
          break;
        case "-":
          operatorButtons[3].click();
          break;
        case "*":
          operatorButtons[1].click();
          break;
        case "/":
          operatorButtons[0].click();
          break;
        case "Enter":
        case "=":
          equalsButton.click();
          break;
      }
  } else {
    numButtons[e.key].click();
  }
})
