
// Define variables for operation. 
let num1 = 0;
let num2 = 0;
let operator = null;
let buttons = document.querySelectorAll("div.interface_container button");

let operatorClicked = false;
let decimalClicked = false;
let displayClearedForNextNum = false;
let equalClicked = false;
let operatorExecuted = false;
const display = document.getElementById("display");

let result = 0;

var state = "cleared";
// states:
    // cleared -- default state. Ready for new operations
    // operator -- operator clicked
    // evaluated -- equal button clicked

"use strict";

// handle keyboard input
document.addEventListener('keydown', (event) => {
    let key = event.key;
    
    // Map Enter to equals sign
    if (key === "Enter") {
        key = "=";
        event.preventDefault(); // <--- Add this to stop default behavior
    }

    // Handle backspace
    if (key === "Backspace") {
        handleBackspace();
        event.preventDefault(); // Prevent navigating back in the browser
        return;
    }

    const button = document.querySelector(`button[data-key="${key}"]`);

    if (button) {
        button.click(); // simulate the click
    }
});


buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        
        //Check if click is on the button and not on the container
	    if(!event.target.closest('button')) return;

        let key = event.target.textContent;

        switch (event.target.className) {
            case "number":
                
                if (state === "operator") {
                    if (displayClearedForNextNum === false) {
                        clearDisplayForNextNumber();
                    }                
                }
                else if (state === "evaluated") {
                    clearVars();
                    clearDisplayForNextNumber();
                }

                displayNumber(key);
                break;
               
            case "decimal":

                switch (state) {
                    case ("evaluated"):
                        clearVars();
                        clearDisplayForNextNumber();
                        displayNumber(key);
                        decimalClicked = true;
                        break;
                    case ("operator"):
                        if (displayClearedForNextNum === false) {
                            clearDisplayForNextNumber();
                        }           
                        if (display.innerText.includes('.') === false) {    
                            displayNumber(key);
                            decimalClicked = true;
                        }   
                        break;
                    case ("cleared"):
                        if (display.innerText.includes('.') === false) {    
                            displayNumber(key);
                            decimalClicked = true;
                        }     
                        break;
                }
                
                break;    
            
            case "operator":
                state = "operator";    
                operator = key;
                operatorClicked = true;
                displayClearedForNextNum = false;
                break;
            
            case "equal":
                operate(operator,num1,num2);
                setVarsForNextOperation(result);
                clearDisplayForNextNumber();
                displayNumber(result);
                equalClicked = true;
                state = "evaluated";
                break;
            
            case "sign":                
                if (state === "operator") {
                    num2 = changeSign(num2);
                    display.innerText = num2;
                }else {
                    num1 = changeSign(num1);
                    display.innerText = num1;
                }
                break;
            
            case "percent":
                if (state === "operator") {
                    num2 = divide(num2,100);
                    display.innerText = num2;
                }else {
                    num1 = divide(num1,100);
                    display.innerText = num1;
                }
                break;

            case "clear":
                state = "cleared";
                display.innerText = 0;
                clearVars();
            
            case "backspace":
                //alert("backspace");
                break;
        }
    });
});

function displayNumber(num) {
    // const display = document.getElementById("display");
    
    // clear display if zero
    if (display.innerText === "0") {
        if (num !== ".") {
            clearDisplay();
        }
    };

    // round to 10 decimals
    num = roundToTenDecimals(num);

    // remove trailing zeroes
    let numStr = num.toString();
    numStr = trimTrailingZeros(numStr);

    // display scientific if over 10 chars
    if (numStr.length > 10) {
        num = Number(num).toExponential(2);
    }
    
    if (display.innerText.length < 10) {
        let numToAppend = document.createTextNode(num);
        display.appendChild(numToAppend);
    }

    if (state === "operator" || state === "evaluated") {
       num2 = Number(display.innerText);
    }
    else {
        num1 = Number(display.innerText);
    };
};

function clearDisplay() {
    display.innerText = "";
};

function clearDisplayForNextNumber() {
    clearDisplay();
    displayClearedForNextNum = true;
};

function operate(operator,num1,num2) {
    switch (operator) {
        // case for +, -, /, %, sign 
        case "+":
            result = add(num1,num2);
            break;
        case "-":
            result = subtract(num1,num2);
            break;
        case "*":
            result = multiply(num1,num2);
            break;
        case "/":
            if (num2 === 0) {
                result = "WTF?";
            } else result = divide(num1,num2);
            break;
        case undefined:
            result = display.innerText;
            break;
    }        
};

function setVarsForNextOperation(result) {
    num1 = Number(result);
    num2 = 0;
    operatorClicked = false;
    decimalClicked = false;
    displayClearedForNextNum = false; 
    state = "evaluated";
}

function clearVars() {
    num1 = 0;
    num2 = 0;
    operatorClicked = false;
    decimalClicked = false;
    displayClearedForNextNum = false;   
    equalClicked = false;
    operatorExecuted = false;
    state = "cleared";
}

/////////////////////////////
// OPERATOR FUNCTIONS - START
/////////////////////////////
function add(a,b) {
    return Number(a) + Number(b);
  };
  
function subtract(a,b) {
      return a - b;
  };
  
function multiply(a,b) {
    return a * b;
}

function divide(a,b) {
    return a / b;
}

function changeSign(num) {
    return num * -1;
}

function percentage(num) {
    return divide(num,100);
}

/////////////////////////////
// OPERATOR FUNCTIONS - END//
/////////////////////////////

// function roundToTenDecimals(num) {
//     return Number(Math.round(num + "e+10") + "e-10");
// }

function roundToTenDecimals(num) {
    if (typeof num !== "number") return num;
    let roundedStr = num.toFixed(10).replace(/\.?0+$/, '');
    return Number(roundedStr);
}

function trimTrailingZeros(number) {
    const str = String(number);
    if (!str.includes('.')) {
      return str;
    }
    return str.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
  }

function handleBackspace() {
    let text = display.innerText;
    
    if (state !== "evaluated"){
        if (text.length > 1) {
            display.innerText = text.slice(0, -1);
        } else {
            display.innerText = "0";
        }
    }
 
    // Update num1 or num2 based on current state
    if (state === "operator") {
        num2 = Number(display.innerText);
    } else {
        num1 = Number(display.innerText);
    }
}