console.log("terminal logic script loaded!");

// --- Get Element ID's --- //
const input = document.getElementById('command-input');
const terminalText = document.getElementById('terminal-text'); // Commands list box
const userInput = document.getElementById('user-commands');
const content = document.getElementById('content-display');

const popupContainer = document.getElementById("popup-container")
let popupIdCounter = 0;

let isMoving = false;
let isMaximized = false;
let isMinimized = false;
let offset = {x: 0, y: 0};

const openSFX = document.getElementById('popup-open-sfx');
const closeSFX = document.getElementById('popup-close-sfx');
const ambience = document.getElementById('ambient');

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

// --- Sound Player --- //
function playSound(element) {
  element.volume = 1;
  element.play().catch((e) => console.warn("Blocked by browser:", e));
  console.log("Sound playing...");
}

// --- Function Show User Command History --- //
function handleCommand(text) {
  let title = '';
  let output = '';
  let unknown = false;

  switch (text.toLowerCase()) {
    case '1':
    case '1.':
    case 'developer':
    case 'developer project':
    case 'd':
      title = 'Developer Projects';
      output = `
        <center><h2 style="margin-top: 0;">Sandbox Simulation</h2></center>
        <center><p style="color:#f93e3e; font-weight:bold;">An interactive learning experience to practice phyisics behaviours, UI development, and grid based interactivity.</p>
        <p style="color:#f93e3e; font-weight:bold;">Development Time 3.5 weeks</p></center>
        <p style="color:#FFFFFF; font-weight:normal;">I developed a 2D pixel based interactive layer with semi-realistic behaviours for selected elements using GdScript.</p>
        
        <p style="color:#FFFFFF; font-weight:normal;">This project simulates real-time semi-realistic physics and chemical interactions within a pixel-based, gridded environment, driven by user input. 
        Designed for an educative experience, each pixel manages its own unique physical and chemical properties and has uniquely designed animations and reactions
        based upon respective chemical combinations.</p>
        
        <p style="color:#FFFFFF; font-weight:normal;">The simulation utilizes a custom constructor for parameter initialization, boundary definition, and managing interaction timers as well as
        utilizing Godot's inbuilt _process() function that updates the code based on processed frames allowing the project to deliver responsive and
        dynamic animations."</p>

        <div class="image-sandbox-simulation-behaviours">
          <center>
          <img src="assets/images/sandbox-simulation-image-1.png" alt="Sandbox Simulation Project Gas Preview 1" style="max-width: 300px; height: auto; border-radius: 4px; margin-top: 1rem;">
          <img src="assets/images/sandbox-simulation-image-2.png" alt="Sandbox Simulation Project Gas Preview 2" style="max-width: 300px; height: auto; border-radius: 4px; margin-top: 1rem;">
          </center>
        </div>

        <div class="image-sandbox-simuation-elements">
          <img src="assets/images/sandbox-simulation-image-3.png" alt="Sandbox Simulation Project Elements Preview" style="max-width: 300px; height: auto; border-radius: 4px; margin-top: 1rem;">
          <p> test </p>
        </div>

        <ul>
          <li>Bulletpoint</li>
          <li>Bulletpoint</li>
        </ul>
        
        <button style="
        background-color: #ff3b3b;
        color: white;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 1rem;
        " onclick="window.open('assets/downloadable-content', '_blank')">
        ⬇ Download Sandbox Project
        </button>
        
        `;
      break;

    case '2':
    case '2,':
    case 'game':
    case 'game project':
    case 'g':
      title = '???';
      output = `<h2>Game Design Projects</h2>
                <ul>
                  <li>...</li>
                </ul>`;
      break;
    default:
      unknown = true;
      break;
  }

  if (!unknown) {
  playSound(openSFX);
  userInput.innerHTML += `> ${text}\n`;

  createPopup(title, output);
}
  else {
    console.log("Unknown command entered by user..")
    userInput.innerHTML += `<span style="color:red;"\n\n>Unknown command: <strong>${text}</strong></span>\n\n`;
  }

  if (userInput.parentElement) {
  userInput.parentElement.scrollTop = userInput.parentElement.scrollHeight;
  }
}


// --- Event Listener (Handle Inputs) --- //
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const command = input.value.trim();
    history.push(command);
    handleCommand(command);
    input.value = '';
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isMoving || !currentPopup) return;
  currentPopup.style.left = `${e.clientX - offset.x}px`;
  currentPopup.style.top = `${e.clientY - offset.y}px`;
});

function createPopup(title = "New Window", content = "Empty content") {
  const id = `popup-${popupIdCounter++}`;
  const popup = document.createElement("div");
  popup.className = "popup-terminal visible";
  popup.id = id;

  popup.innerHTML = `
    <div class="popup-header">
      <div class="window-buttons">
        <span class="btn minimize">-</span>
        <span class="btn maximize">❐</span>
        <span class="btn close">X</span>
      </div>
      <span class="popup-title">${title}</span>
    </div>
    <div class="popup-content">${content}</div>
  `;

  popupContainer.appendChild(popup);
  popupBehaviors(popup); 

  requestAnimationFrame(() => {
    popup.classList.add('visible'); 
  });

  return popup;
}

function popupBehaviors(popup) {
  const header = popup.querySelector(".popup-header");
  const minimizeBtn = popup.querySelector(".minimize");
  const maximizeBtn = popup.querySelector(".maximize");
  const closeBtn = popup.querySelector(".close");
  currentPopup = popup;

  // --- DRAG ---
  header.addEventListener("mousedown", (e) => {
    document.body.style.userSelect = "none";
    isMoving = true;
    
    const rect = popup.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;

    popup.style.transform = "none";
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.top}px`;
    popup.style.right = "auto";
    popup.style.bottom = "auto";
    popup.style.position = "fixed";
  });

  document.addEventListener("mouseup", () => {
    isMoving = false;
    document.body.style.userSelect = "";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isMoving) return;

    let x = e.clientX - offset.x;
    let y = e.clientY - offset.y;

    x = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, y));

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  });

  // --- CLOSE ---
  closeBtn.addEventListener("click", () => {
    playSound(closeSFX);
    setTimeout(() => popup.classList.add('hidden'), 300);
  });

  // --- MINIMIZE ---
  minimizeBtn.addEventListener("click", () => {
    isMinimized = true;

    popup.style.width = "300px";
    popup.style.height = "40px";
    popup.style.left = "10px";
    popup.style.bottom = "10px";
    popup.style.top = "auto";
    popup.style.transform = "none";

    const content = popup.querySelector(".popup-content");
    const title = popup.querySelector(".popup-title");

    if (content) content.style.display = "none";
    
  });

  // --- MAXIMIZE ---
  maximizeBtn.addEventListener("click", () => {
    const content = popup.querySelector(".popup-content");
    const title = popup.querySelector(".popup-title");

    const maximized = popup.classList.contains("maximized");

    if (!maximized) {
      popup.classList.add("maximized");

      popup.style.top = "5vh";
      popup.style.left = "5vw";
      popup.style.width = "90vw";
      popup.style.height = "90vh";
      popup.style.transform = "none";
    } else {
      popup.classList.remove("maximized");

      popup.style.width = "";
      popup.style.height = "";
      popup.style.top = "10%";
      popup.style.left = "calc(50vw - 200px)";
      popup.style.transform = "none"; 
    }

    if (content) content.style.display = "block";
    if (title) title.style.display = "inline-block";
  });

  // --- Initial Position ---
  popup.style.position = "fixed";
  popup.style.left = "50%";
  popup.style.top = "10%";
  popup.style.transform = "translateX(-50%)";
}

// --- Start --- //
document.addEventListener('DOMContentLoaded', () => {
  typeWriter_Letters(intro, () => {
    typeWriter_Words(commands, 0, () => {
      input.disabled = false;
      input.focus();
    });
  });
});
