import { parse } from "date-fns";
import he from "he";
import moment from "react-moment";

//This function will only allow alphanumeric characters along with space.
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function IsAlphanumericWithSpace(element) {
  let value = element.value + "";
  let finalResult = "";
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (
      (eachCharacterCode >= 48 && eachCharacterCode <= 57) ||
      (eachCharacterCode >= 65 && eachCharacterCode <= 90) ||
      (eachCharacterCode >= 97 && eachCharacterCode <= 122) ||
      eachCharacterCode === 32
    ) {
      finalResult += eachCharacter;
    } else {
      finalResult += "";
    }
  }
}

//This function will only allow alphanumeric characters. No spaces allowed
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function IsAlphanumericWithoutSpace(element) {
  let value = element.value + "";
  let finalResult = "";
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (
      (eachCharacterCode >= 48 && eachCharacterCode <= 57) ||
      (eachCharacterCode >= 65 && eachCharacterCode <= 90) ||
      (eachCharacterCode >= 97 && eachCharacterCode <= 122)
    ) {
      finalResult += eachCharacter;
    } else {
      finalResult += "";
    }
  }
}

//This function will only allow alphabets and space.
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function isAlphabetWihSpace(element) {
  let value = element.value + "";
  let finalResult = "";
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (
      (eachCharacterCode >= 65 && eachCharacterCode <= 90) ||
      (eachCharacterCode >= 97 && eachCharacterCode <= 122) ||
      eachCharacterCode === 32
    ) {
      finalResult += eachCharacter;
    } else {
      finalResult += "";
    }
  }
}

//This function will only allow numbers. No spaces allowed
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function isNumber(element) {
  let value = element.value + "";
  let finalResult = "";
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (eachCharacterCode >= 48 && eachCharacterCode <= 57) {
      finalResult += eachCharacter;
    } else {
      finalResult += "";
    }
  }
}

//This function will only allow numbers with decimals. No spaces allowed
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function isValidDecimalNumber(element) {
  let value = element.value + "";
  let finalResult = "";
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (
      (eachCharacterCode >= 48 && eachCharacterCode <= 57) ||
      eachCharacterCode === 46
    ) {
      if (eachCharacterCode === 46 && count === 0) {
        count++;
        finalResult += eachCharacter;
      } else if (eachCharacterCode === 46 && count !== 0) {
        finalResult += "";
      } else if (eachCharacterCode !== 46) {
        finalResult += eachCharacter;
      }
    } else {
      finalResult += "";
    }
  }
}

//This function will only allow numbers with decimals and percentage sign. No spaces allowed
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function isValidDecimalNumberWithPercentage(element) {
  let value = element.value + "";
  let finalResult = "";
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (
      (eachCharacterCode >= 48 && eachCharacterCode <= 57) ||
      eachCharacterCode === 46
    ) {
      if (eachCharacterCode === 46 && count === 0) {
        count++;
        finalResult += eachCharacter;
      } else if (eachCharacterCode === 46 && count !== 0) {
        finalResult += "";
      } else if (eachCharacterCode !== 46) {
        finalResult += eachCharacter;
      }
    } else {
      finalResult += "";
    }
  }
}

//This function will only allow numbers, '+' and '-' . No spaces allowed
//To invoke this function "this" keyword has to be passed to this function as an argument.
export function isContactNumber(element) {
  let value = element.value + "";
  let finalResult = "";
  for (let i = 0; i < value.length; i++) {
    let eachCharacter = value.charAt(i);
    let eachCharacterCode = value.charCodeAt(i);
    if (
      (eachCharacterCode >= 48 && eachCharacterCode <= 57) ||
      eachCharacterCode === 45 ||
      eachCharacterCode === 43
    ) {
      finalResult += eachCharacter;
    } else {
      finalResult += "";
    }
  }
}

//This function will allow only numbers upto 2 digit places after decimal !
export function validateUpto2DecimalPlaces(element) {
  let finalResult = element.value;
  element.value =
    finalResult.indexOf(".") >= 0
      ? finalResult.substr(0, finalResult.indexOf(".")) +
        finalResult.substr(finalResult.indexOf("."), 3)
      : finalResult;
}

export function setCsrfTokenInRequestHeader(xhr) {
  const csrfToken = window.localStorage.getItem("csrf");
  xhr.setRequestHeader("csrf", csrfToken);
}

export function setAndReturnNewCsrfToken(xhr, contextPath) {
  const newCsrfToken = xhr.getResponseHeader("csrf");
  if (newCsrfToken != null && newCsrfToken !== "") {
    window.localStorage.setItem("csrf", newCsrfToken);
  }
  return newCsrfToken;
}

export function setAuthTokenInReqHeader(xhr) {
  const authorizationToken = window.localStorage.getItem("authorization");
  xhr.setRequestHeader("Authorization", authorizationToken);
}

export function setAndReturnNewAuthToken(xhr, contextPath) {
  const newAuthorizationToken = xhr.getResponseHeader("Authorization");
  if (newAuthorizationToken != null && newAuthorizationToken !== "") {
    window.localStorage.setItem("authorization", newAuthorizationToken);
  }
  return newAuthorizationToken;
}

export function getAuthToken() {
  return window.localStorage.getItem("authorization");
}

export function isValidNonEmptyJsArray(input) {
  if (isEmptyInput(input)) {
    return false;
  }
  if (Array.isArray(input) && input.length > 0) {
    return true;
  }
  return false;
}

export function isValidNonEmptyJsObject(input) {
  if (isEmptyInput(input)) {
    return false;
  }
  if (Array.isArray(input)) {
    return false;
  }
  if ((typeof input).toLowerCase() === "object") {
    const keysArray = Object.keys(input);
    if (keysArray.length > 0) {
      return true;
    }
  }
  return false;
}

export function isBlankInput(input) {
  return input === undefined || input === null || String(input).trim() === "";
}

export function isEmptyInput(input) {
  return input === undefined || input === null || input === "";
}

// For this f(n). to work correctly, the input must be either String or a valid javascript object or an array.
export function sanitize(unsanitizedInput) {
  if (isEmptyInput(unsanitizedInput)) {
    return "";
  }

  if ((typeof unsanitizedInput).toLowerCase() === "string") {
    return sanitizeStringInput(unsanitizedInput);
  }

  if (Array.isArray(unsanitizedInput)) {
    return sanitizeArrayInput(unsanitizedInput);
  }

  if (
    (typeof unsanitizedInput).toLowerCase() === "object" &&
    Array.isArray(unsanitizedInput) === false
  ) {
    return sanitizeObjectInput(unsanitizedInput);
  }

  return unsanitizedInput;
}

export function sanitizeStringInput(inputStr) {
  return escapeContent(inputStr);
}

export function sanitizeArrayInput(inputArr) {
  if (inputArr.length <= 0) {
    return [];
  }

  for (let i = 0; i < inputArr.length; i++) {
    let eachArrElement = inputArr[i];

    if (isEmptyInput(eachArrElement)) {
      inputArr[i] = "";
      continue;
    }

    if ((typeof eachArrElement).toLowerCase() === "string") {
      inputArr[i] = sanitizeStringInput(eachArrElement);
      continue;
    }

    if (Array.isArray(eachArrElement)) {
      inputArr[i] = sanitizeArrayInput(eachArrElement);
      continue;
    }

    if (
      (typeof eachArrElement).toLowerCase() === "object" &&
      Array.isArray(eachArrElement) === false
    ) {
      inputArr[i] = sanitizeObjectInput(eachArrElement);
    }
  }
  return inputArr;
}

export function sanitizeObjectInput(inputObj) {
  let keysArray = Object.keys(inputObj);

  if (keysArray.length <= 0) {
    return {};
  }

  for (let i = 0; i < keysArray.length; i++) {
    let eachKey = keysArray[i];
    let eachValue = inputObj[eachKey];

    if (isEmptyInput(eachValue)) {
      inputObj[eachKey] = "";
      continue;
    }

    if ((typeof eachValue).toLowerCase() === "string") {
      inputObj[eachKey] = sanitizeStringInput(eachValue);
      continue;
    }

    if (Array.isArray(eachValue)) {
      inputObj[eachKey] = sanitizeArrayInput(eachValue);
      continue;
    }

    if (
      (typeof eachValue).toLowerCase() === "object" &&
      Array.isArray(eachValue) === false
    ) {
      inputObj[eachKey] = sanitizeObjectInput(eachValue);
    }
  }
  return inputObj;
}

//For this f(n). to work correctly, the input must be either String or a valid javascript object or an array.
export function unSanitize(sanitizedInput) {
  if (isEmptyInput(sanitizedInput)) {
    return null;
  }

  if ((typeof sanitizedInput).toLowerCase() === "string") {
    return unsanitizeStringInput(sanitizedInput);
  }

  if (Array.isArray(sanitizedInput)) {
    return unsanitizeArrayInput(sanitizedInput);
  }

  if (
    (typeof sanitizedInput).toLowerCase() === "object" &&
    Array.isArray(sanitizedInput) === false
  ) {
    return unsanitizeObjectInput(sanitizedInput);
  }
  return sanitizedInput;
}

export function unsanitizeStringInput(inputStr) {
  if (isEmptyInput(inputStr)) {
    return null;
  }
  return unescapeContent(inputStr);
}

export function unsanitizeArrayInput(inputArr) {
  if (inputArr.length <= 0) {
    return [];
  }

  for (let i = 0; i < inputArr.length; i++) {
    let eachArrElement = inputArr[i];

    if (isEmptyInput(eachArrElement)) {
      inputArr[i] = null;
      continue;
    }

    if ((typeof eachArrElement).toLowerCase() === "string") {
      inputArr[i] = unsanitizeStringInput(eachArrElement);
      continue;
    }

    if (Array.isArray(eachArrElement)) {
      inputArr[i] = unsanitizeArrayInput(eachArrElement);
      continue;
    }

    if (
      (typeof eachArrElement).toLowerCase() === "object" &&
      Array.isArray(eachArrElement) === false
    ) {
      inputArr[i] = unsanitizeObjectInput(eachArrElement);
    }
  }
  return inputArr;
}

export function unsanitizeObjectInput(inputObj) {
  let keysArray = Object.keys(inputObj);

  if (keysArray.length <= 0) {
    return {};
  }
  for (let i = 0; i < keysArray.length; i++) {
    let eachKey = keysArray[i];
    let eachValue = inputObj[eachKey];

    if (isEmptyInput(eachValue)) {
      inputObj[eachKey] = null;
      continue;
    }
    if ((typeof eachValue).toLowerCase() === "string") {
      inputObj[eachKey] = unsanitizeStringInput(eachValue);
      continue;
    }
    if (Array.isArray(eachValue)) {
      inputObj[eachKey] = unsanitizeArrayInput(eachValue);
      continue;
    }
    if (
      (typeof eachValue).toLowerCase() === "object" &&
      Array.isArray(eachValue) === false
    ) {
      inputObj[eachKey] = unsanitizeObjectInput(eachValue);
    }
  }
  return inputObj;
}

//sanitizes the input to prevent XSS attack. Here the encoding is done using he.js(html encoder)file.
export function escapeContent(unsafeInput) {
  if (isEmptyInput(unsafeInput)) {
    return "";
  }
  return he.encode(String(unsafeInput));
}

//Here the decoding is done using he.js(html encoder)file.
export function unescapeContent(escapedInput) {
  if (isEmptyInput(escapedInput)) {
    return "";
  }
  return he.decode(String(escapedInput));
}

export function setRegionInHeader(xhr, country) {
  let region = "";
  if (country === "United Arab Emirates") region = "UAE";
  else if (country === "Egypt") region = "Egypt";
  else if (country === "Saudi Arabia") region = "KSA";
  else if (country === "India") region = "IN";
  xhr.setRequestHeader("region", region);
}

export function getFormattedDate(timeStampString) {
  if (
    timeStampString === "" ||
    timeStampString === undefined ||
    timeStampString === null
  ) {
    return;
  }
  let parsedTimeStamp = new Date(parseInt(timeStampString));

  const yyyy = parsedTimeStamp.getFullYear();
  let mm = parsedTimeStamp.getMonth() + 1; // Months start at 0!
  let dd = parsedTimeStamp.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedDate = dd + "/" + mm + "/" + yyyy;
  return formattedDate;
}

// Get programHashId from country drop down, use programHashId to get region , use region to decide the timezone to convert timestamp to date
//TODO : Need to add country dropdown in the pages

export function getCurrentFormattedDate() {
  let currentDateTimeStamp = new Date();
  const yyyy = currentDateTimeStamp.getFullYear();
  let mm = currentDateTimeStamp.getMonth() + 1; // Months start at 0!
  let dd = currentDateTimeStamp.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedDate = dd + "/" + mm + "/" + yyyy;
  return formattedDate;
}

export function parseRoleName(roleName) {
  if (roleName === "Super Distributor Admin User") {
    return "Head of Finance";
  } else if (roleName === "Distributor Admin User") {
    return "Head Cashier";
  } else if (roleName === "Agent User") {
    return "Cashier";
  } else if (roleName === "Client Admin") {
    return "Transporter";
  } else if (roleName === "Broker User") {
    return "Broker";
  } else if (roleName === "Customer User") {
    return "Driver";
  }
  let role = roleName;
  return role;
}

export function getDateTime(timeStamp) {
  return moment(timeStamp).format("DD-MM-YYYY HH:mm:ss");
}

export function getFormattedDateTime(timeStampString) {
  if (
    timeStampString === "" ||
    timeStampString === undefined ||
    timeStampString === null
  ) {
    return;
  }
  let parsedTimeStamp = new Date(parseInt(timeStampString));

  const yyyy = parsedTimeStamp.getFullYear();
  let mm = parsedTimeStamp.getMonth() + 1; // Months start at 0!
  let dd = parsedTimeStamp.getDate();
  let hh = parsedTimeStamp.getHours();
  let min = parsedTimeStamp.getMinutes();
  let sec = parsedTimeStamp.getSeconds();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  if (hh < 10) hh = "0" + hh;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;

  const formattedDate =
    dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min + ":" + sec;
  return formattedDate;
}

export function getFormattedDateTimeByRegion(timeStampString) {
  if (
    timeStampString === "" ||
    timeStampString === undefined ||
    timeStampString === null
  ) {
    return;
  }
  let parsedTimeStamp = new Date(parseInt(timeStampString));
  let currentRegionDateTime = parsedTimeStamp.toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
  });

  let currentRegionDate = currentRegionDateTime.split(",")[0].split("/");
  let month = parseInt(currentRegionDate[0]);
  let day = parseInt(currentRegionDate[1]);
  let year = parseInt(currentRegionDate[2]);

  let currentRegionTime = currentRegionDateTime.split(",")[1];

  let formattedDate = day + "/" + month + "/" + year + " " + currentRegionTime;
  return formattedDate;
}

export function getFormattedDateByRegion(timeStampString) {
  if (
    timeStampString === "" ||
    timeStampString === undefined ||
    timeStampString === null
  ) {
    return;
  }
  let parsedTimeStamp = new Date(parseInt(timeStampString));
  let currentRegionDateTime = parsedTimeStamp.toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
  });

  let currentRegionDate = currentRegionDateTime.split(",")[0].split("/");
  let month = parseInt(currentRegionDate[0]);
  let day = parseInt(currentRegionDate[1]);
  let year = parseInt(currentRegionDate[2]);

  let formattedDate = day + "/" + month + "/" + year;
  return formattedDate;
}

/*
Util method to convert date from YYYY-MM-DD HH:mm:ss to DD/MM/YYYY HH:mm:ss
Example input = 2023-02-24 19:03:13 then output will be : 24/02/2023 19:03:13
*/
export function parseDateFromYYYYMMDDtoDDMMYYYY(dateTime) {
  let dateArr = dateTime.split(" ")[0].split("-");
  let year = dateArr[0];
  let month = dateArr[1];
  let day = dateArr[2];
  let parseTime = dateTime.split(" ")[1];

  let formattedDate = day + "/" + month + "/" + year + " " + parseTime;
  return formattedDate;
}

export function formatAmount(amount) {
  return Number(parseFloat(amount).toFixed(2)).toLocaleString("en", {
    minimumFractionDigits: 2,
  });
}

export function getAmountWithCurrency(amount = 0, currency = "") {
  if (!currency) return "" + amount;
  return currency + " " + amount;
}

export function getInputDate(inputDate) {
  return `${inputDate.startDate} - ${inputDate.endDate}`;
}

export function getStatus(status) {
  const STATUS_MAP = {
    Permenent_Block: {
      text: "permanent block",
      color: "red",
    },
    Active: {
      text: "active",
      color: "red",
    },
    active: {
      text: "active",
      color: "red",
    },
  };
  return STATUS_MAP[status];
}

export const USER_TYPE = {
  customer: "driver",
  broker: "partner",
};

export const getUserType = (userType) => {
  return USER_TYPE[userType.toLowerCase()];
};

export const formatInputDate = (inputDate) => {
  return parse(inputDate, "yyyy-mm-dd", new Date());
};

export const validateAge = (value) => {
  return new Date().getFullYear() - new Date(value).getFullYear() >= 18;
};

export const formatCSVValue = (value) => {
  value = value.split(".");

  let predecimal = value[0].split(",");
  let postdecimal = value[1] || 0;

  if (predecimal.includes(",")) predecimal = predecimal.split(",");
  if (predecimal.length) predecimal = predecimal.join("");

  return parseFloat(predecimal + "." + postdecimal);
};

export const copyToClipboard = (text = "") => {
  if (!text.trim()) return;
  navigator.clipboard.writeText(text);
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formattedDateHyphen_DDMMYYYY = (inputDate) => {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatInputDateString = (inputDate) => {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const calculateSellingPrice = (price = 0, discountPercent = 0) => {
  const discounted = (discountPercent / 100) * price;
  return (price - discounted).toFixed(2);
};

export const camelToWords = (string) => {
  return string.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};

export const snakeToWords = (string) => {
  return string.toLowerCase().replace(/_/g, " ");
};

export const formatInputDateYr = (inputDate = "") => {
  let date = inputDate.split("-");
  if (date[0].length > 2) return inputDate;
  return date.reverse().join("-");
};

export const getFormValues = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formValues = {};

  // Iterate over form entries and populate formValues object
  for (let [name, value] of formData.entries()) {
    formValues[name] = value;
  }

  return formValues;
};

export const writeToTxtFile = ({ jsonData }) => {
  let data = "";
  for (const key in jsonData) {
    if (Object.hasOwnProperty.call(jsonData, key)) {
      data += `${key}\n${jsonData[key]}\n\n`;
    }
  }

  const blob = new Blob([data], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "AccountActivation.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return blob;
};

export const validateFileSize = (value) => {
  const file = value[0];
  if (!file) return;

  const fileSize = file.size / 1024; // Size in KB
  const maxSize = 2048; // Maximum size allowed in KB (2 MB)

  return fileSize <= maxSize || "File size exceeds maximum allowed size (2 MB)";
};
