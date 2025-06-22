console.log("terminal logic script loaded!");

// --- Get Element ID's --- //
const input = document.getElementById('command-input');
const terminalText = document.getElementById('terminal-text'); // Commands list box
const userInput = document.getElementById('user-commands');
const content = document.getElementById('content-display');

// --- Commands List --- ///
const intro = "Type a command below to navigate\n\n";
const commands = [
  "1. Developer Projects",
  "2. Game Projects"
];

// --- Ready --- ///
input.disabled = true;
let history = [];

// --- Function TypeWriter_Letters --- //
let delay = 40;
function typeWriter_Letters(text, callback) {
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      const char = text.charAt(i);
      const span = document.createElement('span');

      if (/[0-9.]/.test(char)) {
        span.classList.add('orange');
      }
      span.textContent = char;
      terminalText.appendChild(span);
      i++;
      setTimeout(typeChar, delay)
    } else if (callback) {
      setTimeout(callback, 500)
    }
  }
  typeChar()
}


// --- Function TypeWriter_Words --- //
function typeWriter_Words(lines, index = 0, callback) {
  if (index < lines.length) {
    typeWriter_Letters(lines[index] + '\n', () => typeWriter_Words(lines, index + 1, callback));
  } else if (callback) {
    callback();
  }
}


// --- Function Show User Command History --- //
function appendUserCommand(text) {
  userInput.textContent += `> ${text}\n`;
  userInput.parentElement.scrollTop = userInput.parentElement.scrollHeight;

}


// --- Function Show User Command History --- //
function handleCommand(text) {
  let output = '';
  content.style.display = 'block';

  switch (text.toLowerCase()) {
    case '1':
    case '1.':
    case 'developer':
    case 'developer project':
    case 'd':
      output = `<h2>Developer Projects</h2>
                <ul>
                  <li>...</li>
                </ul>`;
      break;

    case '2':
    case '2,':
    case 'game':
    case 'game project':
    case 'g':
      output = `<h2>Game Design Projects</h2>
                <ul>
                  <li>...</li>
                </ul>`;
      break;
    default:
      output = `<p style="color:red;">Unknown command: <strong>${text}</strong></p>`;
      break;
  }

  content.innerHTML = output;
}


// --- Event Listener (Handle Inputs) --- //
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const command = input.value.trim();
    history.push(command);
    appendUserCommand(command);
    handleCommand(command);
    input.value = '';
  }
});


// --- Start --- //
document.addEventListener('DOMContentLoaded', () => {
  typeWriter_Letters(intro, () => {
    typeWriter_Words(commands, 0, () => {
      input.disabled = false;
      input.focus();
    });
  });
});
