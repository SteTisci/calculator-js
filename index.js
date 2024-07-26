const previousOperand = document.querySelector(".first-number");
const currentOperand = document.querySelector(".second-number");
const numberBtns = document.querySelectorAll(".number");
const operatorBtns = document.querySelectorAll(".operator");
const decimalBtn = document.querySelector(".point");
const equalBtn = document.querySelector(".equal");
const deleteBtn = document.querySelector(".delete");
const clearAllBtn = document.querySelector(".clear-all");

const MAX_LENGTH = 14;

const calculatorState = {
  firstNumber: "",
  secondNumber: "",
  operator: null,
  shouldResetScreen: false,
};

numberBtns.forEach((button) => button.addEventListener("click", () => displayNumber(button.textContent)));
operatorBtns.forEach((button) => button.addEventListener("click", () => displayOperator(button.textContent)));

decimalBtn.addEventListener("click", addDecimalPoint);
equalBtn.addEventListener("click", evaluate);
deleteBtn.addEventListener("click", removeElement);
clearAllBtn.addEventListener("click", () => clearScreen(previousOperand, currentOperand));

function operate(num1, num2, operator) {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "/":
      return divide(num1, num2);
    case "x":
      return multiply(num1, num2);
    case "%":
      return module(num1, num2);
    default:
      return "ERROR";
  }
}

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => (num2 === 0 ? "ERROR" : num1 / num2);
const module = (num1, num2) => (num2 === 0 ? "ERROR" : num1 % num2);

function displayNumber(value) {
  // limits the length of the numbers
  if (currentOperand.textContent.length >= MAX_LENGTH) return;

  if (calculatorState.shouldResetScreen) {
    currentOperand.textContent = "";
    calculatorState.shouldResetScreen = false;
  }
  currentOperand.textContent += value;
}

function displayOperator(value) {
  // add the operator only when a number is inserted
  if (!currentOperand.textContent) return;

  calculatorState.firstNumber = currentOperand.textContent;
  calculatorState.operator = value;
  calculatorState.shouldResetScreen = true;
  previousOperand.textContent = `${calculatorState.firstNumber} ${calculatorState.operator}`;
  currentOperand.textContent = "";
}

function addDecimalPoint() {
  // add a 0 before the decimal when no number has been inserted
  if (calculatorState.shouldResetScreen || !currentOperand.textContent) {
    currentOperand.textContent = "0";
    calculatorState.shouldResetScreen = false;
  }
  // check if the number alredy have a decimal point
  if (!currentOperand.textContent.includes(".")) {
    currentOperand.textContent += ".";
  }
}

function evaluate() {
  // exit the function when the second number or the operator hasn't been inserted
  if (!calculatorState.operator || calculatorState.shouldResetScreen) return;

  calculatorState.secondNumber = currentOperand.textContent;

  let result = operate(
    parseFloat(calculatorState.firstNumber),
    parseFloat(calculatorState.secondNumber),
    calculatorState.operator
  );

  if (result === "ERROR") {
    alert("ERROR!\nInvalid operation (division by zero)");
    clearScreen(currentOperand, previousOperand);
    return;
  }

  // Control to round or convert the result based on the number type
  if (result % 1 !== 0) {
    result = result.toFixed(3);
  } else if (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) {
    result = result.toExponential(3);
  } else {
    result = Math.round(result * 100) / 100;
  }

  currentOperand.textContent = result;
  previousOperand.textContent = "";
  calculatorState.firstNumber = result.toString();
  calculatorState.operator = null;
  calculatorState.shouldResetScreen = true;
}

function removeElement() {
  currentOperand.textContent = currentOperand.textContent.slice(0, -1);
}

function clearScreen(...paragraphs) {
  paragraphs.map((p) => (p.textContent = ""));

  // Reset the calculator state when the sceen is cleared
  calculatorState.firstNumber = "";
  calculatorState.secondNumber = "";
  calculatorState.operator = null;
  calculatorState.shouldResetScreen = false;
}
