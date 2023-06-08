// this script listens for change on #mode-selection and changes the html of #form to the selected mode, but only if the mode is different from the current mode

// define constants
const COPY = 'copy';
const PASTE = 'paste';

// get the mode selection element
const modeSelection = document.getElementById('mode-selection');
// get the form element
const form = document.getElementById('form');
// get the current mode
var currentMode = modeSelection.value;

// listen for change on mode selection
modeSelection.addEventListener('change', (e) => {
  // get the new mode
  let newMode = e.target.value;

  // if the new mode is different from the current mode
  if (newMode !== currentMode) {
    // update the current mode
    currentMode = newMode;
    // change the form html to the new mode
    form.innerHTML = getFormHtml(newMode);
  }
});

// get the html for the form based on the mode
function getFormHtml(mode) {
  switch (mode) {
    case 'encode':
      return `
        <hr />
        <div class="wrapper">
          <h3>Input</h3>
          <div class="iwl-wrapper">
            ` + get_iwl("Visible Message", "visible-message", "", "crypt()") + `
            ` + get_iwl("Hidden Message", "hidden-message", "", "crypt()") + `
          </div>
        </div>
        <hr />
        <div class="wrapper">
          <h3>Output</h3>
          <div class="iwl-wrapper">
            ` + get_iwl("Encoded Message", "encoded-message", COPY) + `
          </div>
        </div>
      `;
    case 'decode':
      return `
        <hr />
        <div class="wrapper">
          <h3>Input</h3>
          <div class="iwl-wrapper">
            ` + get_iwl("Encoded Message", "encoded-message", "", "crypt()") + `
          </div>
        </div>
        <hr />
        <div class="wrapper">
          <h3>Output</h3>
          <div class="iwl-wrapper">
            ` + get_iwl("Hidden Message", "hidden-message", COPY) + `
          </div>
        </div>
      `;
    default:
      return 'An error occured. This should not happen by the way.';
  }
};
form.innerHTML = getFormHtml(currentMode);

function copyFunction(e) {
  // create a temporary input element
  var $temp = $("<input>");
  // append the temporary input element to the body
  $("body").append($temp);
  // set the value of the temporary input element to the value of the input element in the same div as the button
  $temp.val(e.parentElement.querySelector('input').value).select();
  // execute the copy command
  document.execCommand("copy");
  // remove the temporary input element
  $temp.remove();
}

function pasteFunction(e) {
  // paste with clipboard api
  navigator.clipboard.readText().then(text => {
    // set the value of the input element in the same div as the button to the clipboard text
    e.parentElement.querySelector('input').value = text;
  });
}

// type can be copy or paste
function get_iwl(label, name, type = "", functionName = "") {
  let disabled = type === COPY && false ? " disabled" : "";
  let onChange = functionName !== "" ? ` onchange="${functionName}"` : "";
  let typeButton = type !== "" ? `<button type="button" onclick="${type.toLowerCase()}Function(this)">${type}</button>` : "";
  return `
    <div class="iwl">
      <div>
        <label for="${name}">${label}</label>
        <input id="${name}" type="text"` + onChange + disabled + `>
      </div>
      ` + typeButton + `
    </div>
  `;
}

// encoding and decoding code

const invisibleCharacters = [
  '\u2060', // Word Joiner
  '\u2064', // Invisible Plus
  '\u2062', // Invisible Times
  '\u2063', // Invisible Separator
  '\u200B', // Zero Width Space (ZWSP)
  '\u200C', // Zero Width Non-Joiner (ZWNJ)
  '\u200D', // Zero Width Joiner (ZWJ)
  '\uFEFF', // Zero Width No-Break Space (ZWNBnSP)
];

const invisibleDelimiter = '\u2061'; // Function Application | Start/End Character

function crypt() {
  switch (currentMode) {
    case 'encode':
      let input_vis = document.getElementById("visible-message").value;
      let inputSecret = document.getElementById("hidden-message").value;
      let encoded = insertMessage(input_vis, encodeMessage(inputSecret));
      // set output to the value of the element with the id of "encoded-message"
      document.getElementById("encoded-message").value = encoded;
      break;
    case 'decode':
      let input_enc = document.getElementById("encoded-message").value;
      let decoded = decodeMessage(input_enc);
      // set output to the value of the element with the id of "hidden-message"
      document.getElementById("hidden-message").value = decoded;
      break;
    default:
      console.log("Invalid mode");
      process.exit(0);
  }
}

function insertMessage(visibleMessage, secretMessage) {
  // Split visibleMessage randomly into 2 parts
  const splitIndex = Math.floor(Math.random() * (visibleMessage.length - 2) + 1);
  const firstPart = visibleMessage.substring(0, splitIndex);
  const secondPart = visibleMessage.substring(splitIndex);
  return firstPart + secretMessage + secondPart;
}

function encodeMessage(message) {
  // Convert input string to octal string
  let octal = "";
  for (let i = 0; i < message.length; i++) {
    const c = message.charAt(i);
    octal += invisibleDelimiter + (c.charCodeAt(0)).toString(8);
  }

  // Replace every number from 0 to 7 with the corresponding invisible character
  for (let i = 0; i < 8; i++) {
    octal = octal.replace(new RegExp(String(i), "g"), invisibleCharacters[i]);
  }
  return octal;
}

function decodeMessage(encodedMessage) {
  let output = "";

  const patternInvisibleCharacters = invisibleCharacters.join('');
  const regex = "(?<=" + invisibleDelimiter + ")[" + patternInvisibleCharacters + "]+";

  const matches = encodedMessage.matchAll(regex);
  for (const match of matches) {
    let segment = match[0];
    for (let i = 0; i < 8; i++) {
      segment = segment.replaceAll(invisibleCharacters[i], String(i));
    }
    output += String.fromCharCode(parseInt(segment, 8));
  }
  return output;
}