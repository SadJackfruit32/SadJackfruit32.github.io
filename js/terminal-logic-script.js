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

const loadedHomePage = sessionStorage.getItem('homepageVisited') === 'true';

const openSFX = document.getElementById('popup-open-sfx');
const closeSFX = document.getElementById('popup-close-sfx');
const ambience = document.getElementById('ambient');



const projectTerminalesAmbiance = document.getElementById('project-terminales-ambient-sfx');

// --- Commands List --- ///
const intro = "Type a command below to navigate\n\n";
const commands = [
  "1. Developer Projects",
  "2. Game Projects",
  "3. Contact Me",
  "",
  "4. Blog Activity"
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
  if (element === projectTerminalesAmbiance) {
    element.volume = 1;
    element.loop = true;
    element.play().catch((e) => console.warn("Blocked by browser:", e));
  } else {
    element.volume = 1;
    element.play().catch((e) => console.warn("Blocked by browser:", e));
    console.log("Sound playing...");
  }
}

// --- Function Show User Command History --- //
function handleCommand(text) {
  let title = '';
  let output = '';
  let unknown = false;
  let redirected = false;

  switch (text.toLowerCase()) {
    case '1':
    case '1.':
    case 'developer':
    case 'developer project':
    case 'developer projects':
    case 'd':
      playSound(openSFX);
      title = 'Developer Projects';
      output = Sandbox_Simulation_Content;
      break;

    case '2':
    case '2,':
    case 'game':
    case 'game project':
    case 'game projects':
    case 'g':
      playSound(openSFX);
      playSound(projectTerminalesAmbiance);
      title = 'Game Projects';
      output = gameProjectPages;
      break;

    case '3':
    case '3.':
    case 'contact me':
    case 'contact':
    case 'c':
      playSound(openSFX);
      title = 'Contact Me';
      output = Contact_Me_Content;
      break;

    case '4':
    case '4.':
    case 'blog activity':
    case 'blog':
    case 'activity':
    playSound(openSFX);
    redirected = true; 
    setTimeout(() => {
      sessionStorage.setItem('homepageVisited', 'true');
      window.location.href = 'blog-activity.html';
    }, 1300); 
    break;

    default:
      unknown = true;
      break;
  }

  if (!unknown && !redirected) {
    userInput.innerHTML += `> ${text}\n`;
    createPopup(title, output);
  } else if (unknown) {
    console.log("Unknown command entered by user...");
    userInput.innerHTML += `<span style="color:red;">>Unknown command: <strong>${text}</strong></span>\n`;
  }

  // Scroll to bottom of input container if available
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
  let isMoving = false;
  let offset = { x: 0, y: 0 };

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
    const ambiance = document.getElementById('project-terminales-ambient-sfx');
    ambiance.loop = false;
    ambiance.pause();

    setTimeout(() => popup.classList.add('hidden'), 300);
    currentPage = 0;
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


// LETS DO THE PAGES LIKE THIS AND CYCLE THROUGH THEM INSTEAD OF HAVING
// MULTIPLE FUNCTIONS
// WE ARE MISSING THE THIRD PAGE CONTAINING OUR PROJECT ON NETWORK AND WEBSITE SECURITY
function showNextPage(element) {
  const popup = element.closest('.popup-terminal');
  const contentNextPage = popup.querySelector('.popup-content');
  contentNextPage.scrollTop = 0;

  if (currentPage < devProjectPages.length - 1) {
    currentPage += 1;
    contentNextPage.innerHTML = devProjectPages[currentPage];
  }
}

function showPreviousPage(element) {
  const popup = element.closest('.popup-terminal');
  const contentPreviousPage = popup.querySelector('.popup-content');
  contentPreviousPage.scrollTop = 0;

  if (currentPage > 0) {
    currentPage -= 1;
    contentPreviousPage.innerHTML = devProjectPages[currentPage];
  }
}

function toggleMute(button) {
  const video = button.previousElementSibling;

  if (video.muted) {
    video.muted = false;
    button.textContent = "Mute";
  } else {
    video.muted = true;
    button.textContent = "Unmute";
  }
}

let pageMutedProjectTerminales = false;

function muteThisPage() {
  const ambiance = document.getElementById('project-terminales-ambient-sfx');
  const muteButton = document.getElementById('mute-ambiance-btn');

  if (!ambiance) return;

  if (!pageMutedProjectTerminales) {
    ambiance.volume = 0;
    muteButton.innerText = '🔊 Unmute Ambience';
    pageMutedProjectTerminales = true;
  } else {
    ambiance.volume = 1;
    muteButton.innerText = '🔇 Mute Ambience';
    pageMutedProjectTerminales = false;
  }
}

// --- Start --- //
document.addEventListener('DOMContentLoaded', () => {
  console.log("Is home page loaded true/false: ", loadedHomePage);

  if (loadedHomePage === false) {
      typeWriter_Letters(intro, () => {
        typeWriter_Words(commands, 0, () => {
          input.disabled = false;
          input.focus();
      });
    });
  }

  else {
    for (let char of intro) {
      const text = document.createElement('text');
      if (/[0-9.]/.test(char)) {
        text.classList.add('orange');
      }
      text.textContent = char;
      terminalText.appendChild(text);
    }

    commands.forEach(line => {
      for (let char of line + '\n') {
        const text = document.createElement('text');
        if (/[0-9.]/.test(char)) {
          text.classList.add('orange');
        }
        text.textContent = char;
        terminalText.appendChild(text);
      }
    });

    input.disabled = false;
    input.focus();
  }
});

// 1. DEVELOPER PROJECTS //
// Page 1
let Sandbox_Simulation_Content = `
        <center><h2 style="margin-top: 0;">Project 1: Sandbox Simulation</h2></center>
        <center><p style="color:#f93e3e; font-weight:bold;">An interactive learning experience to practice phyisics behaviours, UI development, and user interactivity. Written in GdScript with Godot Engine.</p>
        <p style="color:#f93e3e; font-weight:bold;">Development Time 3.5 weeks</p></center>
        <center><p style="color:#FFFFFF; font-weight:normal;">I developed a 2D pixel based interactive layer with semi-realistic behaviours for selected elements using GdScript in Godot Engine.</p>
        
        <p style="color:#FFFFFF; font-weight:normal;">
        This project simulates real-time physics and chemical interactions within a pixel-based, gridded environment. 
        It was designed as an educative tool to help learn about the development in a 2D enviroment as well as to deepen my logistical understanding in programming. This project resembles
        a well known browser game "Powder Toy", and inspired me to develop my own, basic variation.</p>
        
        <p style="color:#FFFFFF; font-weight:normal;">
        The project actively updates each pixel in a given space and manages its own unique physical and chemical properties with uniquely designed animations and interactive features. 
        The simulation utilizes a custom constructor for parameter initialization, boundary definition, and managing interaction timers to ensure timed mechanics are accounted for. </p>
        
        <p style="color:#FFFFFF; font-weight:normal;">
        Aditionally, through the utilization of Godot's inbuilt _process() function, allowing for frame based updates ensures the project is able to deliver responsive and dynamic animations upon user inputs.</p></center>

        <div class="image-sandbox-simulation-behaviours">
          <center>
            <img src="assets/images/sandbox-simulation-image-1.png" alt="Sandbox Simulation Project Gas Preview 1" style="max-width: 300px; height: auto; border-radius: 4px; margin-top: 1rem;">
            <img src="assets/images/sandbox-simulation-image-2.png" alt="Sandbox Simulation Project Gas Preview 2" style="max-width: 300px; height: auto; border-radius: 4px; margin-top: 1rem;">
            
            <p> </p>

            <p>Key features : </p>
            <p>SHORT LEARNING EXPERIENCE (About 4 to 8 minutes)
            Pixel based visuals
            Achievemnts system
            Keystroke tools and eraser + 5 elements with unique animations and behaviors
            Physics based real-time chemical reactions and behavior</p>
            
            <img src="assets/images/sandbox-simulation-image-4.png" alt="Sandbox Simulation Project Achivement Preview" style="max-width: 300px; height: auto; border-radius: 4px;">
            <img src="assets/images/sandbox-simulation-image-5.png" alt="Sandbox Simulation Project Achivement2 Preview" style="max-width: 300px; height: auto; border-radius: 4px;">
          </center>
        </div>

        <div class="video-container">
          <center>
            <p> A downloadable project. Click below to get access to the following files: </p>
            <video
              src="assets/videos/sandbox-simulation-preview.mp4"
              autoplay
              loop
              muted
              playsinline
              style="max-width: 530px; border-radius: 2px; margin-top: 0.2rem;">
            </video>
            <p></p>
          </center>
        </div>

        <button style="
          background-color: #ff3b3b;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 0.7rem;
          " onclick="window.open('assets/downloadable-content-projects/sandbox-simulation-container.zip', '_blank')">
          ⬇ Download Sandbox Project
        </button>
        
        <br>
        <button style="
          background-color: #007bff;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
          " onclick="showNextPage(this)">
          ➡ Next Page
        </button>

        <br>

  <footer style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 25px;">
    © 2025 Alex Perello Baque (SadJackfruit32). All rights reserved.<br>
    Project Sandbox Simulation is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a>.
  </footer>
  `;

// Page 2
let UDP_Transfer_Protocol = `
  <center><h2 style="margin-top: 0;">Project 2: UDP Encryption Protocol Simulation</h2></center>

  <center><p style="color:#f93e3e; font-weight:bold;">A trivial messaging program that simulates 
  server to client communications with UDP encryption and packet loss. Feautres a basic user
  interface to manipulate configurable data. Written in Java with Intellij IDe.</p>
  <p style="color:#f93e3e; font-weight:bold;">Development Time 8 weeks</p></center>

  <center><p style="color:#FFFFFF; font-weight:normal;">
  The TFTP protocol enables the implementation of file transfers through UDP over a network 
  given a specified server and client, source and destination. Specifically, the server sided 
  project program is used to communicate and initiate the initial connection with the client, 
  enabling the primary function of TFTP (transferring files).
  </p>

  <p>
  The program will take a given message and construct it into a simulated packet composing of
  a destination port, source port, sequence number, acknowledgement number, checksums, and the
  datas contents. The data is given a maxPacketSize, a variable enabling the function to set byte
  sized for each packet (default set to 512 bytes according to the RF130 manual for TFTP protocol).
  </p>

  <p>
  Once the packet is ready, the program will communicate via IP adress ports with its reciever
  counterpart. (InetAdress libraries and Datagrams were used to facilitate the access of addresses
  and sending of packets over specified ports).
  </p>

  <br>

  <div class="video-container">
    <center>
      <p> User Interface Preview </p>
      <video
        src="assets/videos/UDP-transfer-protocol-preview.mp4"
        autoplay
        loop
        muted
        playsinline
        style="max-width: 530px; border-radius: 2px; margin-top: 0.2rem;">
      </video>
      <p></p>
    </center>
  </div>

  <p>
  The user can specify a specific simulated packet loss for the programs packets, lost packets are
  handled via four protocols including;</center>
    <ol>
      <li>No packet recieved (resolved via timeout, signalling a retransmission of the packet)/li>
      
      <li>Variation in packet bytes + No acknowledgement byte (The acknowledgment byte 
      contains a value which signals a program that all bytes have been recieved and the communication
      between server and client can be terminated. Without an valid acknowledgement value, a timeout is
      issued, signalling the retransmission of the packets bytes.</li>

      <li>Variation in packet bytes (Missing bytes are retransmitted utilising their issued identification 
      values)</li>

      <li>All bytes recieved (No retransmission is required, a handshake closure for the TFTP
      communications. The program will terminate.) </li>
    </ol>
  </p>
  <br>

  <div class="video-container">
    <center>
      <p> Real Time Server to Client Communications </p>
      <video
        src="assets/videos/UDP-transfer-protocol-preview-2.mp4"
        autoplay
        loop
        muted
        playsinline
        style="max-width: 530px; border-radius: 2px; margin-top: 0.2rem;">
      </video>
      <p></p>
    </center>
  </div>

  <button style="
    background-color: #ff3b3b;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 0.7rem;
    " onclick="window.open('assets/downloadable-content-projects/UDP Encryption Protocol Simulation.zip', '_blank')">
    ⬇ Download UDP Project
  </button>

  <br>

  <button style="
    background-color: #6c757d;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
    " onclick="showPreviousPage(this)">
    ⬅ Back
  </button>

  <button style="
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 0.5rem;
    " onclick="showNextPage(this)">
    ➡ Next Page
  </button>

  <footer style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 25px;">
    © 2025 Alex Perello Baque (SadJackfruit32). All rights reserved.<br>
    The project UDP Encryption Protocol Simulation is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a>.
  </footer>
  `;

// Page 3
let Wesbite_Security = `
  <center><h2 style="margin-top: 0;">Project 3: Website Cybersecurity</h2></center>

  <center><p style="color:#f93e3e; font-weight:bold;"></p>
  <p style="color:#f93e3e; font-weight:bold;">A simple website demo exploring frontend and backend techniques, secure authentication, password policies, and defenses against SQL injection, brute force, and bot attacks. Features include database design, credential encryption, and email-based password recovery. Written in Javascript, HTML, and css.</p>
  <p style="color:#f93e3e; font-weight:bold;">Development Time 6 weeks</p></center></center>

  <center>
  <p>The website is designed to simulate an antique marketplace, where users can create accounts to submit and sell vintage items. This marketplace functionality allows for a practical context for the site's security features, ensuring that user data, listings, and accounts are protected.</p>
  <p>As a result, the project aims to represent a full-stack web application designed to practice modern web development techniques with focus on cybersecurity, user authentication, and data protection through the incorporation of a custom user management system, defensive approaches to programming against common attacks, and password handling techniques.</p>
  </center>

  <div class="page-views">
    <center>
      <p>The home page and upload pages are fully interactable, users are able to upload their marketplace images to the database directly and can be found under .../static/uploads file path</p>
      <img src="assets/images/website-example-home-page.png" style="max-width: 250px; height: auto; border-radius: 4px; margin-top: 0.5rem;">
      <img src="assets/images/uploading-to-marketplace-example.png" style="max-width: 250px; height: auto; border-radius: 4px; margin-top: 0.5rem;">

      <p>The databse structure designed for the website</p>
      <img src="assets/images/database-structure-preview.png" style="max-width: 300px; height: auto; border-radius: 4px; margin-top: 0.5rem;">
    
      <p>Security features including password hashing (PBKDF2 and salting), security questions, brute force protection, SQL injection mitigation, flash feedback system, and session handling via Flask-Login</p>
      <p>Password Hashing and Salting (PBKDF2)</p>
      <img src="assets/images/password-hashing-preview.png" style="max-width: 550px; height: auto; border-radius: 4px; margin-top: 0.5rem;">

      <p>SQL mitigation</p>
      <img src="assets/images/sql-mitigation.png" style="max-width: 550px; height: auto; border-radius: 4px; margin-top: 0.5rem;">

      </center>
  </div>

  <br>

  <center><p style="color:#f93e3e; font-weight:bold;">The website is no longer running, however I have attached a bat program that will automatically set it up on your local host if you're interested in taking a peek!</p></center>

  <button style="
    background-color: #ff3b3b;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 0.7rem;
    " onclick="window.open('assets/downloadable-content-projects/website-cyber-security.zip', '_blank')">
    ⬇ Download UDP Project
  </button>

  <br>
  <button style="
    background-color: #6c757d;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
    " onclick="showPreviousPage(this)">
    ⬅ Back
  </button>


  <footer style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 40px;">
    © 2025 Alex Perello Baque (SadJackfruit32). All rights reserved.<br>
    The project Website Cybersecurity is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a>.
  </footer>
  
`;

// 2. GAME PROJECTS ..
// Page 1
let Terminal_Game = ` 
<center><h2 style="margin-top: 0;">Game 1: Project Terminales <br>A Psychological Horror CYOA Data Profiling Game</h2></center>
<center><p style="color:#f93e3e; font-weight:bold;">Development Time 6 Months. Written in Godot Engine with GDScript.</p></center>

<div id="ambiance-controls">
  <button id="mute-ambiance-btn" onclick="muteThisPage()">🔇 Mute Ambience</button>
</div>

<br>

<body class="project-terminales">
  <section class="section fade-in" style="animation-delay: 0s;">
    <p class="project-terminales-intro">What psychological horrors hide within the facility's depths?</p>
    <h2 class="project-terminales-h2">An Overview:</h2>
    <p class="project-terminales-content">Amalgam Sciences is a narrative-driven psychological horror game set in an isolated, 
    decaying research facility well below the ground. The game combines deep environmental storytelling alongside suspenseful 
    gameplay and psychological horror elements to deliver an experience that will leave players questioning what’s real and 
    what’s not.</p>

    <p class="project-terminales-content">The player is unknowingly awoken in the shoes of an unnamed individual who finds themselves in a pitch black facility with 
    no memory of who they are or how they arrived there. Equipped with only a basic flashlight, a sidearm, and an unreliable 
    terminal, the player must navigate the dark and decaying halls of the facility to uncover the mysteries and dangers that 
    are lurking within.
    </p>
  </section>

  <section class="section fade-in" style="animation-delay: 1s;">
    <p class="project-terminales-intro">A shadowy corporation, engaged in unethical experiments...</p>
    <h2 class="project-terminales-h2">The Setting:</h2>
    <p class="project-terminales-content">A corporation engaged in unethical experimentations including bioengineering and 
    neural research. The building itself is a sprawling labyrinth of dark corridors, rusted machinery, and long forgotten 
    experiments. While parts of the facility seem to still be operational, much of it has collapsed and has deteriorated with 
    time. The air within the facility is thick with a smell of mildew, walls are cracked and peeling, and dust has settled in 
    most places. There is a constant, oppressive sense that something within the facility is unimaginably wrong, with secrets 
    and dangers yet to be uncovered.</p>

    <p class="project-terminales-content">As the player progresses through different zones within the facility, they’ll be able to explore rooms filled with 
    discarded equipment, abandoned personnel, and remnants of horrifying experiments gone wrong. The player will have to 
    interact with various terminals and systems to unlock access to new areas, solve puzzles, and survive the terrifying 
    creatures that stalk the corridors.
    </p>
  </section>

  <section class="section fade-in" style="animation-delay: 2s;">
    <p class="project-terminales-intro">An unnamed individual threatened by the deterioration...</p>
    <h2 class="project-terminales-h2">The Narrative:</h2>
    <p class="project-terminales-content">The central narrative storyline revolves around uncovering the truth about Amalgam 
    Sciences, and the role the player has within its twisted history. The story begins with a mysterious awakening in an 
    unfamiliar environment, with no indication of where they are, only coming across fragmented memories to rely on. As the
    player explores the facility, they’ll come across cryptic notes, unsettling audio logs, and broken equipment and terminals 
    that hint at the nature of the experiments being conducted.</p>

    <p class="project-terminales-content">The game's narrative is driven by player exploration and their choices made 
    throughout the game will determine how the story unfolds. There are no hand holding mechanics and players must piece 
    together the story themselves through environmental storytelling, item interactions, and subtle clues found within the game 
    world. As the player progresses, the narrative will deepen, revealing that they’re not just trapped in a physical location, 
    but in a mind bending experimentation of human survival.
    </p>
  </section>

  <section class="section fade-in" style="animation-delay: 3s;">
    <p class="project-terminales-intro">An ever shifting environment that warps around the players mind...</p>
    <h2 class="project-terminales-h2">The Theme:</h2>
    <p class="project-terminales-content">The game explores themes of isolation, horror of human experimentations, and memory. 
    The player is trapped in an environment that will be constantly shifting and mirroring the psychological effects of their 
    own deteriorating mental state. Every corner holds a new danger, every locked door could be a revelation, and every 
    interaction with the environment offers the potential to uncover a deeper layer of the facility's grim history.</p>

    <p class="project-terminales-content">Ultimately, the facility is about discovering the truth while struggling to hold onto 
    one's own sanity. The game blurs the lines between reality and illusion represented by the characters' mental state, 
    leaving players to question their own perceptions as they uncover secrets that lay other secrets to rest. Will the players 
    escape, or will they succumb to the horrors that await.
    </p>
  </section>


  <section class="section fade-in" style="animation-delay:4s;">
    <h2 class="trailer-title">GAME PROJECT TRAILER</h2>
    <div class="terminales-showcase">
      <div class="showcase-left">
        <video
          src="assets/videos//PROJECT TRAILER - Terminales.mp4"
          controls
          playsinline
          style="width: 100%; border-radius: 6px;">
        </video>
      </div>
      <div class="showcase-right">
        <p class="branching-intro">Abstract Overview</p>

        <p><strong>Project Terminales</strong> began as a side project during my university studies and was my first 
        exploration into programming and 2D game development using Godot Engine and GDScript. While unfinished, it was a 
        pivotal learning milestone that introduced me to the full development pipeline: from asset creation and level design 
        to sound design, voice acting, and backend logic.</p>

        <p>One of the project’s key innovations was the integration of <strong>data profiling</strong>. This allowed the game 
        to adapt to the player's decision making by tracking engagement metrics, timing, and narrative choices. As opposed to 
        designing rigid branching paths, the game dynamically tailors its story and environment to the player's 
        behaviour, creating a more personalized and immersive experience.</p>

        <p>While the project is currently on pause due to academic and work related priorities, I fully intend to return to 
        it as I continue growing as a developer.</p>
      </div>
    </div>
  </section>


    <section class="section fade-in" style="animation-delay:5s;">
    <div class="additional-content-container">
      <p class="project-terminales-intro">A deeper dive into the psychological unraveling...</p>
      <h2 class="project-terminales-h2">Supplementary Content:</h2>

      <div class="additional-content-flex">
        <!-- Video 1 -->
        <div class="video-wrapper">
          <video 
            src="assets/videos/analgam-sciences-eval-report.mp4" 
            autoplay 
            loop 
            muted 
            playsinline 
            class="supplementary-video">
          </video>
          <button class="mute-toggle" onclick="toggleMute(this)">Unmute</button>
        </div>

        <!-- Video 2 -->
        <div class="video-wrapper">
          <video 
            src="assets/videos/inventory-system.mp4" 
            autoplay 
            loop 
            muted 
            playsinline 
            class="supplementary-video">
          </video>
          <button class="mute-toggle" onclick="toggleMute(this)">Unmute</button>
        </div>
      </div>

      <div class="project-terminales-content">
        <p><strong>Snippet of narrative branching:</strong> <i>"The door groans open 
        with the grinding of ancient gears, revealing only darkness as a faint shuffle drifts out, 
        your stomach tightening just before a shadow moves. 
        
        <br></br>
        
        Your trembling flashlight catches glimpses of something angular 
        and unnatural, its inhumanly tilted head gleaming with reflective eyes that vanish again 
        into the darkness."</i>
        </p>
      </div>
    </div>
  </section>

</body>

<footer style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 25px;">
  © 2025 Alex Perello Baque (SadJackfruit32). All rights reserved.<br>
  Project Terminales is licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a>.
</footer>
        
`;

// 3. BLOG ACTIVITY //
// Content


// 4. CONTACT ME //
let Contact_Me_Content = `
  <section class="contact-me-section">
    <h2>Contact Me</h2>
    <p>Email: <a href="mailto:alexperellobaque2020@gmail.com">alexperellobaque2020@gmail.com</a></p>
    <p>Phone: <a href="tel:+1234567890">+34 641-65-12-95</a></p>

    <div class="social-links">
      <a href="https://www.linkedin.com/in/alex-perello-baque/" target="_blank" class="social-button">
        <img src="assets/images/linkedin.png" alt="LinkedIn" />
        LinkedIn
      </a>

      <a href="https://www.instagram.com/donthaveaninstagramprofileyeterror404" target="_blank" class="social-button">
        <img src="assets/images/instagram.png" alt="Instagram" />
        Instagram
      </a>

      <a href="https://github.com/SadJackfruit32" target="_blank" class="social-button">
        <img src="assets/images/github.png" alt="github" />
        GitHub
      </a>
    </div>
  </section>
`;


let devProjectPages = [Sandbox_Simulation_Content, UDP_Transfer_Protocol, Wesbite_Security];
let gameProjectPages = [Terminal_Game]
let currentPage = 0;




























// notused
let About_Me = `
<!-- ABOUT ME SPACE SECTION -->
<section class="about-me-section">
  <div class="left-column">
    <img src="assets/images/profile-picture.jpg" alt="Alex Perello Baque" class="profile-pic">
    <div class="about-me-content">
      <h2>Alex Perello Baque</h2>
      <p>University of Sussex Graduate</p>

      <div class="social-icons">
        <a href="#"><img src="github-icon.svg" alt="GitHub" /></a>
        <a href="#"><img src="linkedin-icon.svg" alt="LinkedIn" /></a>
      </div>

      <h3>Skills</h3>
      <div class="skills">
        <span class="skill">GdScript</span>
        <span class="skill">Java</span>
        <span class="skill">JavaScript</span>
        <span class="skill">HTML</span>
        <span class="skill">Python</span>
      </div>
    </div>
  </div>

  <div class="right-column">
    <section class="about-me-simple">
      <h2>About Me</h2>
      <p>Hi, I’m Alex, im passionate about my creative approaches with the development of software and have a background in software engineering and business technology.</p>
    </section>

    <section class="latest-blog-activity">
      <h2>Latest Blog Post</h2>
      <div class="latest-post">
        <h3>Example Blog Title</h3>
        <div class="post-date">June 30, 2025</div>
        <div class="post-excerpt">
          This is a short excerpt from the latest blog post...
        </div>
        <a href="blog-activity.html">Read More</a>
      </div>
    </section>
  </div>
</section>
`;
