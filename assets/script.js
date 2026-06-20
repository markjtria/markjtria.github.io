// System Views Elements Cache
    const screenLobby  = document.getElementById('hero-lobby');
    const screenHub    = document.getElementById('about-me-hub');
    const screenMarket = document.getElementById('night-market');
    const globalHeader = document.getElementById('globalHeader');

    const enterBtn      = document.getElementById('enterBtn');
    const backToLobbyBtn = document.getElementById('backToLobbyBtn');

    // Closes every open info-panel so the previous "page" can never
    // stay stacked on top of whatever is being navigated to next.
    function closeAllPanels() {
      document.querySelectorAll('.info-panel.active').forEach(panel => {
        panel.classList.remove('active');
      });
    }

    // Root Screen Routing Engine
    enterBtn.addEventListener('click', () => {
      closeAllPanels();
      screenLobby.classList.remove('active');
      screenHub.classList.add('active');
      globalHeader.classList.add('visible');
    });

    backToLobbyBtn.addEventListener('click', () => {
      closeAllPanels();
      screenHub.classList.remove('active');
      screenMarket.classList.remove('active');
      screenLobby.classList.add('active');
      globalHeader.classList.remove('visible');
    });

    // Related panels jumps routing
    function navigateToSection(targetId) {
      closeAllPanels();
      screenLobby.classList.remove('active');
      screenHub.classList.remove('active');
      screenMarket.classList.remove('active');
      document.getElementById(targetId).classList.add('active');
      if (targetId === 'about-me-hub') resetLobbyTab();
    }

    // Modal Display Trigger Overrides
    function openPanel(panelId) {
      closeAllPanels();
      document.getElementById(panelId).classList.add('active');
    }

    // Related panels jumps routing
    function closePanel(panelId) {
      document.getElementById(panelId).classList.remove('active');
      resetLobbyTab();
    }

    function closePanelAndGoHome(panelId) {
      closePanel(panelId);
      navigateToSection('about-me-hub');
    }

    // Valorant-lobby-style tab state (persistent global header)
    function setLobbyTab(tabEl) {
      document.querySelectorAll('.lobby-tab').forEach(t => t.classList.remove('active'));
      tabEl.classList.add('active');
    }

    function resetLobbyTab() {
      document.querySelectorAll('.lobby-tab').forEach(t => t.classList.remove('active'));
      const homeTab = document.querySelector('.lobby-tab[data-tab="home"]');
      if (homeTab) homeTab.classList.add('active');
    }

    // Related panels jumps routing
    function switchPanel(currentPanelId, nextPanelId) {
      closePanel(currentPanelId);
      openPanel(nextPanelId);
    }

    // CONTINUOUS LIGHTWEIGHT TYPEWRITER ENGINE
    const typewriterWords = ["IT Student", "Future Frontend Developer", "Future Pro Player"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeletingChar = false;
    const targetElement = document.getElementById("typewriter-text");

    function runTypewriter() {
      const currentWord = typewriterWords[wordIdx];
      
      if (!isDeletingChar) {
        charIdx++;
        targetElement.textContent = currentWord.slice(0, charIdx);
        
        if (charIdx === currentWord.length) {
          isDeletingChar = true;
          setTimeout(runTypewriter, 1800);
          return;
        }
        setTimeout(runTypewriter, 90);
      } else {
        charIdx--;
        targetElement.textContent = currentWord.slice(0, charIdx);
        
        if (charIdx === 0) {
          isDeletingChar = false;
          wordIdx = (wordIdx + 1) % typewriterWords.length;
          setTimeout(runTypewriter, 400);
          return;
        }
        setTimeout(runTypewriter, 50);
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      if (targetElement) runTypewriter();
    });

    // EmailJS Delivery Execution Handler
    function sendMessage() {
      const nameVal = document.getElementById("contact-name").value.trim();
      const emailVal = document.getElementById("contact-email").value.trim();
      const messageVal = document.getElementById("contact-message").value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        alert("Please fill out all fields before sending.");
        return;
      }

      const templateParams = {
        from_name: nameVal,
        from_email: emailVal,
        message: messageVal
      };

      emailjs.send("service_portfolio", "template_contact", templateParams)
        .then(function(response) {
          alert("Message sent successfully!");
          document.getElementById("contact-name").value = "";
          document.getElementById("contact-email").value = "";
          document.getElementById("contact-message").value = "";
        }, function(error) {
          alert("Failed to send. Please try again.");
          console.error("EmailJS Execution Error Parameters:", error);
        });
    }