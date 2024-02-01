const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[]}|:;"<,>.?/';

// Initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider(); // Ui ko update krna using passwardlength value
// Set Strength color to Grey
setIndicator("#ccc");

// Set Passward Length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) { 
  indicator.style.backgroundColor = color;
  // Shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
    // max = 123 , min = 97
    // Math.random() => ye 0 se 1 ke bich me random value generate karega
    // max-min => isme max or min me ka difference check karega
    // Suppose (max-min) = 123 - 97 = 26
    // Math.random() * (max - min)  => ye 0 se 26 ke bich me value (ye floating values generate hogi)
    // Math.floor() => ye function se floating value ko round figure kr skte hai
    // But I want values between 97 to 123
    // + min  ==> iske karan min se max ke bich me value gererate karega
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // Green
  } else if ( 
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");  // Yellow
  } else {
    setIndicator("#f00");  // Red
  }
}

async function copyContent() {  // async function  Promise return krta hai
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // to make copy wala span Visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // suffle krne ke liye ek method hai => Suffle Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    // Math.random() => o se 1 ke bich me value data hai
    // Math.random() * (i+1) => *(i + 1) krne se function 0 se i+1 ke bich me value generate karega

    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp; 
  }
  // Swap ke bad ek ek value str me store karega
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // Special Condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

//  kisi bhi checkbox ko tik karu ya untick kro dono ki cases me dubara se counting start karega
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  // none of the checkbox are selected
  if (checkCount == 0)
    // koi bhi checkbox tik nhi hai to passward generate nhi hoga
    return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's start the journey to find new passward
  // rmeove old passward
  password = "";

  // let's put the stuff  mentioned by checkboxs

  // if(uppercaseCheck.checked){
  //     passward += generateUpperCase();
  // }

  // if(lowercaseCheck.checked){
  //     passward += generateLowerCase();
  // }

  // if(numbersCheck.checked){
  //     passward += generateRandomNumber();
  // }

  // if(symbolsCheck.checked){
  //     passward += generateSymbol();
  // }

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // Compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);  // if funcArr = 4 then it generates 0,1,2,3 value
    console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }

  // Sufffle the passward
  password = shufflePassword(Array.from(password));

  // Show in UI
  passwordDisplay.value = password;

  // Calculate Strength
  calcStrength();
});
