// --- Default Portfolio Data (Devanand's Profile) --
const defaultPortfolioData = {
  owner: {
    name: "Devanand",
    role: "ECE Student | PCB Design | Embedded Systems Enthusiast",
    roleHeading: "Electronics and Communication Engineering student",
    heroIntro: "Hi, I'm an",
    subtext: "Electronics and Communication Engineering student with practical knowledge of embedded systems, PCB design, microcontrollers, and VLSI. Passionate about embedded technology, IoT, and hardware-software integration.",
    photo: "./hero-photo.jpg",
    avatar: "./hero-photo.jpg"
  },
  about: {
    title: "Hello!",
    introduction: "I am DEVANAND, an Electronics and Communication Engineering student at GEC Wayanad with a strong passion for embedded systems, microcontroller programming, PCB design, and hardware-software integration.",
    skills: ["C / C++", "ATMEGA328P", "PCB DESIGN", "EASYEDA", "ARDUINO", "EMBEDDED SYSTEMS", "HARDWARE ROUTING", "GIT"]
  },
  projects: [
    {
      id: "proj-1",
      title: "Bluetooth Home Automation",
      image: "./assets/projects/project1.jpg",
      description: "A compact home automation system built using microcontrollers and a Bluetooth module to control household appliances wirelessly. Solves the need for convenient, low-cost remote device switching and monitoring.",
      tags: ["ATmega328P", "HC-05 Bluetooth", "C", "Relay Module", "PCB Design"],
      github: "#",
      demo: "#"
    },
    {
      id: "proj-2",
      title: "ATmega328P Sensor Interfacing Board",
      image: "./assets/projects/project2.jpg",
      description: "Complete schematic and custom PCB design for interfacing multiple analog and digital sensors with ATmega328P. Solves noisy sensor reading issues through optimized signal routing and power decoupling.",
      tags: ["ATmega328P", "EasyEDA", "C", "Schematic Design", "PCB Layout"],
      github: "#",
      demo: "#"
    },
    {
      id: "proj-3",
      title: "CPS Internship PCB Design",
      image: "./assets/projects/project3.jpg",
      description: "Developed custom hardware featuring a buzzer alert circuit, AREF decoupling networks, and optimized copper pour ground planes. Designed during internship at Cyber Physical Systems, GEC Thrissur to enhance circuit stability.",
      tags: ["EasyEDA", "Circuit Design", "AREF Decoupling", "Copper Pour", "Hardware Testing"],
      github: "#",
      demo: "#"
    },
    {
      id: "proj-4",
      title: "Custom Drone Flight Controller Board",
      image: "./assets/projects/project4.jpg",
      description: "A custom PCB flight controller board for quadcopters featuring IMU sensor integration and ESC telemetry routing. Designed to provide lightweight and reliable flight control for drone club activities.",
      tags: ["Embedded C", "EasyEDA", "IMU Integration", "PCB Design", "Drone Electronics"],
      github: "#",
      demo: "#"
    }
  ],
  journey: {
    subtitle: "JOURNEY & EXPERIENCE",
    title: "Here is a breakdown of my education and technical journey",
    items: [
      {
        id: "1",
        year: "2024",
        number: "2024",
        title: "Started B-Tech ECE at GEC Wayanad",
        description: "Admitted to the B.Tech Electronics and Communication Engineering program at Government Engineering College, Wayanad.",
        theme: "red"
      },
      {
        id: "2",
        year: "2024–2025",
        number: "2024-25",
        title: "Joined G-bot Robotics Club",
        description: "Became an active member working on robotics projects, microcontrollers, hardware integration, and technical workshops.",
        theme: "red"
      },
      {
        id: "3",
        year: "2025",
        number: "2025",
        title: "Joined ORION (Volunteering)",
        description: "Engaged in social volunteering and event organizing initiatives as part of the ORION student team.",
        theme: "white"
      },
      {
        id: "4",
        year: "2026",
        number: "2026",
        title: "Bluetooth Home Automation Mini Project",
        description: "Designed and developed a wireless home automation circuit featuring Bluetooth control and relay switching.",
        theme: "red"
      },
      {
        id: "5",
        year: "2026",
        number: "2026",
        title: "Summer Internship — Cyber Physical Systems, GEC Thrissur ECE",
        description: "Worked on advanced PCB design, buzzer alert circuits, AREF decoupling networks, and copper pour ground plane routing.",
        theme: "white"
      },
      {
        id: "6",
        year: "2026",
        number: "2026",
        title: "CTO, Drone Club GECW",
        description: "Appointed Chief Technology Officer, leading technical projects, drone hardware assembly, and flight electronics development.",
        theme: "red"
      },
      {
        id: "7",
        year: "2026",
        number: "2026",
        title: "Internship at SHOBINZ LAB (Remote)",
        description: "Gaining hands-on experience in remote embedded engineering, circuit troubleshooting, and electronic system design.",
        theme: "white"
      }
    ]
  },
  footer: {
    location: "Bokaro, Jharkhand, India",
    email: "devanand.ece@gmail.com",
    github: { name: "Devanand", url: "https://github.com/Devanand" },
    linkedin: { name: "Devanand", url: "https://linkedin.com/in/devanand" },
    status: "Available Worldwide",
    brandName: "devanand"
  }
};

// --- App State ---
let portfolioData = {};
let currentRole = 'none'; // 'none', 'admin', 'guest'
let activeImageTarget = ''; // 'hero' or 'badge'

// Credentials configuration
const CREDENTIALS = {
  admin: { username: "admin", password: "admin123" },
  guest: { username: "guest", password: "guest123" }
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  renderPortfolio();
  setupEventListeners();
  checkScroll();
  initLampMode();   // 🔦 lamp cursor system

  // Initialize lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// --- Data Persistence ---
async function loadData() {
  let baseData = defaultPortfolioData;
  try {
    const response = await fetch('./portfolio-data.json');
    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData && jsonData.owner) {
        baseData = jsonData;
      }
    }
  } catch (e) {
    console.log("No portfolio-data.json found, falling back to default hardcoded data.");
  }

  const savedData = localStorage.getItem("portfolioData");
  if (savedData) {
    try {
      portfolioData = JSON.parse(savedData);
    } catch (e) {
      portfolioData = {};
    }
  } else {
    portfolioData = {};
  }

  // Always enforce baseData for projects, journey, about, owner, and footer if outdated or missing
  if (!portfolioData.projects || !Array.isArray(portfolioData.projects) || portfolioData.projects.length < 4) {
    portfolioData.projects = baseData.projects;
  }
  if (!portfolioData.journey || !portfolioData.journey.items || portfolioData.journey.items.length < 7 || !portfolioData.journey.items[0].year) {
    portfolioData.journey = baseData.journey;
  }
  if (!portfolioData.owner || portfolioData.owner.role !== baseData.owner.role || portfolioData.owner.subtext !== baseData.owner.subtext || portfolioData.owner.roleHeading !== baseData.owner.roleHeading) {
    portfolioData.owner = baseData.owner;
  }
  if (!portfolioData.about || !portfolioData.about.skills || portfolioData.about.skills.includes('JAVA')) {
    portfolioData.about = baseData.about;
  }
  if (!portfolioData.footer || portfolioData.footer.brandName !== 'devanand') {
    portfolioData.footer = baseData.footer;
  }

  saveData();
}

function saveData() {
  localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
  const saveMsg = document.getElementById("save-status-msg");
  if (saveMsg) {
    saveMsg.textContent = "Saving changes...";
    setTimeout(() => {
      saveMsg.textContent = "All changes saved locally";
    }, 800);
  }
}

// --- Barcode Generator ---
function generateBarcodeSVG(name) {
  const container = document.getElementById("badge-barcode");
  if (!container) return;

  // Simple hashing algorithm to create unique lines
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let svgContent = `<svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">`;
  let x = 5;
  while (x < 115) {
    // Determine bar thickness and gaps based on pseudo-random sequence
    const rand = Math.abs(Math.sin(hash + x));
    const width = rand > 0.7 ? 3 : rand > 0.4 ? 2 : 1;
    svgContent += `<rect x="${x}" y="0" width="${width}" height="30" fill="white" />`;
    x += width + (rand > 0.6 ? 2 : 1);
  }
  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

// --- Render Functions ---
function renderPortfolio() {
  // 1. Logo and Branding
  document.getElementById("logo-text").innerText = portfolioData.footer.brandName;
  const logoBrandRefs = document.querySelectorAll("[data-field='footer.brandName']");
  logoBrandRefs.forEach(el => el.innerText = portfolioData.footer.brandName);
  
  // 2. Hero Section
  document.getElementById("hero-status-tag").innerText = portfolioData.owner.role;
  const heroIntroEl = document.getElementById("hero-intro");
  if (heroIntroEl) {
    heroIntroEl.innerText = portfolioData.owner.heroIntro || "Hi, I'm a";
  }
  document.getElementById("hero-title").innerText = portfolioData.owner.roleHeading || portfolioData.owner.role;
  document.getElementById("hero-subtext").innerText = portfolioData.owner.subtext;
  
  const heroImg = document.getElementById("hero-img");
  heroImg.src = portfolioData.owner.photo;
  
  // 3. About Section
  document.getElementById("about-title").innerText = portfolioData.about.title;
  document.getElementById("about-description").innerText = portfolioData.about.introduction;
  
  // 4. Skills Tags
  const skillsContainer = document.getElementById("skills-tags-list");
  skillsContainer.innerHTML = "";
  portfolioData.about.skills.forEach((skill, index) => {
    const tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.innerHTML = `
      <span class="skill-name">${skill}</span>
      <button class="tag-delete-btn admin-only" onclick="deleteSkill(${index})" title="Delete Skill">
        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
      </button>
    `;
    skillsContainer.appendChild(tag);
  });

  // Add dynamic "+ Add Skill" button for Edit Mode
  const addTag = document.createElement("div");
  addTag.className = "skill-tag add-skill-btn admin-only";
  addTag.style.cursor = "pointer";
  addTag.style.border = "1px dashed var(--primary-red)";
  addTag.style.color = "var(--primary-red)";
  addTag.innerHTML = `
    <i data-lucide="plus" style="width: 14px; height: 14px; margin-right: 4px;"></i>
    <span>Add Skill</span>
  `;
  addTag.addEventListener("click", addSkill);
  skillsContainer.appendChild(addTag);

  // 5. ID Badge
  document.getElementById("badge-img").src = portfolioData.owner.avatar || portfolioData.owner.photo;
  document.getElementById("badge-name").innerText = portfolioData.owner.name;
  document.getElementById("badge-role").innerText = (portfolioData.owner.role || "").toUpperCase();
  generateBarcodeSVG(portfolioData.owner.name);

  // 6. Projects Section
  renderProjects();

  // 7. Journey / Timeline Card Layout
  renderTimeline();

  // 8. Footer Contacts
  const locEl = document.getElementById("footer-loc");
  if (locEl) locEl.innerText = portfolioData.footer.location;
  
  const emailEl = document.getElementById("footer-email");
  if (emailEl) emailEl.innerText = portfolioData.footer.email;
  
  // Links
  const githubLink = document.getElementById("footer-github");
  if (githubLink) {
    githubLink.innerText = portfolioData.footer.github.name;
    githubLink.href = portfolioData.footer.github.url;
  }
  
  const linkedinLink = document.getElementById("footer-linkedin");
  if (linkedinLink) {
    linkedinLink.innerText = portfolioData.footer.linkedin.name;
    linkedinLink.href = portfolioData.footer.linkedin.url;
  }

  const statusEl = document.getElementById("footer-status-text");
  if (statusEl) statusEl.innerText = portfolioData.footer.status;
  
  const brandEl = document.getElementById("footer-giant-name");
  if (brandEl) brandEl.innerText = portfolioData.footer.brandName;
  
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.innerText = new Date().getFullYear();

  // Re-enable Edit Mode states if admin
  if (currentRole === 'admin') {
    enableEditMode();
  } else {
    disableEditMode();
  }

  // Update icons after re-rendering dynamic lists
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialise cursor-glow effect on brand name (viewer mode only)
  setTimeout(initBrandGlowEffect, 50);
}


// ── Brand Name Cursor Glow Effect ────────────────────────────────────────────
function initBrandGlowEffect() {
  const el = document.getElementById('footer-giant-name');
  if (!el) return;

  // Skip when admin is in edit mode — keep plain text so it's editable
  if (currentRole === 'admin') return;

  const raw = el.textContent.trim();
  if (!raw) return;

  // Wrap each character in a .glow-char span
  el.innerHTML = raw.split('').map(ch =>
    `<span class="glow-char">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');

  const chars = Array.from(el.querySelectorAll('.glow-char'));

  function handleMove(e) {
    const mx = e.clientX, my = e.clientY;
    chars.forEach(span => {
      const r   = span.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);
      const t   = Math.max(0, 1 - dist / 220); // 220px max influence radius
      const ease = t * t;                        // quadratic for sharper falloff

      if (ease > 0.004) {
        // Minimalist: letter brightens from near-invisible → pure white
        const alpha = Math.min(1, ease * 1.4);
        span.style.webkitTextFillColor = `rgba(255, 255, 255, ${alpha})`;

        // Single soft white haze — no colour, just light
        const haze = ease * 60;
        span.style.textShadow = `0 0 ${haze}px rgba(255, 255, 255, 0.35)`;
      } else {
        // Far away — restore transparent (lets parent gradient show through)
        span.style.webkitTextFillColor = 'transparent';
        span.style.textShadow          = 'none';
      }
    });
  }

  function handleLeave() {
    chars.forEach(span => {
      span.style.webkitTextFillColor = 'transparent';
      span.style.textShadow          = 'none';
    });
  }

  // Remove any previous listeners to avoid stacking on re-renders
  const parent = el.parentElement;
  if (parent._brandGlowMove) {
    parent.removeEventListener('mousemove',  parent._brandGlowMove);
    parent.removeEventListener('mouseleave', parent._brandGlowLeave);
  }
  parent._brandGlowMove  = handleMove;
  parent._brandGlowLeave = handleLeave;
  parent.addEventListener('mousemove',  handleMove);
  parent.addEventListener('mouseleave', handleLeave);
}

function stripBrandGlowSpans() {
  // Restores the brand name element to plain text for admin editing
  const el = document.getElementById('footer-giant-name');
  if (!el) return;
  const text = el.textContent.trim();
  el.innerHTML = '';
  el.textContent = text;

  // Remove listeners
  const parent = el.parentElement;
  if (parent._brandGlowMove) {
    parent.removeEventListener('mousemove',  parent._brandGlowMove);
    parent.removeEventListener('mouseleave', parent._brandGlowLeave);
    parent._brandGlowMove  = null;
    parent._brandGlowLeave = null;
  }
}

// --- Projects Rendering ---
function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) return;
  container.innerHTML = "";

  if (!portfolioData.projects || portfolioData.projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        No projects configured yet.
      </div>
    `;
    return;
  }

  portfolioData.projects.forEach((project, index) => {
    const card = document.createElement("div");
    card.className = "project-card";

    const tagsHtml = (project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join("");
    const githubBtn = project.github ? `<a href="${project.github}" target="_blank" class="btn-project-link"><i data-lucide="github" style="width:16px;height:16px;"></i> View on GitHub</a>` : '';
    const demoBtn = project.demo ? `<a href="${project.demo}" target="_blank" class="btn-project-link"><i data-lucide="external-link" style="width:16px;height:16px;"></i> Live Demo</a>` : '';

    card.innerHTML = `
      <div class="project-thumb-wrapper">
        <img src="${project.image || './assets/projects/project1.jpg'}" alt="${project.title}" class="project-thumb">
      </div>
      <div class="project-content">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-desc">${project.description}</p>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-links">
          ${githubBtn}
          ${demoBtn}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderTimeline() {
  const listContainer = document.getElementById("timeline-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  if (!portfolioData.journey.items || portfolioData.journey.items.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        No milestones configured yet. Click the button below to add one.
      </div>
    `;
    return;
  }

  portfolioData.journey.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "timeline-item";
    card.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card ${item.theme || 'red'}">
        <!-- Edit controls -->
        <div class="timeline-item-controls admin-only">
          <button class="btn-icon-sm" onclick="editTimelineTheme(${index})" title="Toggle theme (Red/White)"><i data-lucide="palette" style="width: 14px; height: 14px;"></i></button>
          <button class="btn-icon-sm" onclick="deleteTimelineItem(${index})" title="Delete Milestone"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i></button>
        </div>
        <span class="timeline-year">${item.year || item.number || ''}</span>
        <h3 class="card-title editable-text" contenteditable="${currentRole === 'admin'}" data-index="${index}" data-prop="title">${item.title}</h3>
        <p class="card-desc editable-text" contenteditable="${currentRole === 'admin'}" data-index="${index}" data-prop="description">${item.description}</p>
      </div>
    `;
    listContainer.appendChild(card);
  });

  // Attach dynamic input handlers to timeline cards
  listContainer.querySelectorAll('.editable-text').forEach(element => {
    element.addEventListener('blur', (e) => {
      const idx = e.target.getAttribute('data-index');
      const prop = e.target.getAttribute('data-prop');
      const text = e.target.innerText.trim();
      portfolioData.journey.items[idx][prop] = text;
      saveData();
    });
  });

  // Recalculate timeline paths
  updateTimelinePaths();
}

// --- Timeline Paths Auto-Drawing on scroll ---
function updateTimelinePaths() {
  const path = document.getElementById("timeline-path");
  const pathActive = document.getElementById("timeline-path-active");
  const timeline = document.querySelector(".timeline-wrapper");
  if (!path || !timeline) return;

  const totalHeight = timeline.clientHeight - 60;
  
  // Re-generate SVG path depending on height
  const dString = `M50,0 Q30,${totalHeight * 0.125} 50,${totalHeight * 0.25} T50,${totalHeight * 0.5} T50,${totalHeight * 0.75} T50,${totalHeight}`;
  path.setAttribute("d", dString);
  pathActive.setAttribute("d", dString);

  // Set initial stroke-dash for active scroll indicator
  const pathLength = pathActive.getTotalLength();
  pathActive.style.strokeDasharray = pathLength;
  pathActive.style.strokeDashoffset = pathLength;
}

// Scroll animation for active path drawing
function animateTimelineOnScroll() {
  const pathActive = document.getElementById("timeline-path-active");
  const timeline = document.querySelector(".timeline-wrapper");
  if (!pathActive || !timeline) return;

  const rect = timeline.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Percentage of timeline scrolled
  const scrollStart = viewportHeight * 0.7; // Start drawing when timeline enters bottom 70% of screen
  const scrollEnd = viewportHeight * 0.2;   // Finish drawing when top reaches top 20%
  
  let pct = (scrollStart - rect.top) / (rect.height + scrollStart - scrollEnd);
  pct = Math.max(0, Math.min(1, pct));

  const pathLength = pathActive.getTotalLength();
  pathActive.style.strokeDashoffset = pathLength - (pathLength * pct);
}

// --- CMS & Edit Mode Logic ---
function enableEditMode() {
  document.body.classList.add("edit-mode");

  // Remove glow spans so the brand name is plain text and editable
  stripBrandGlowSpans();


  // Make all labeled text blocks editable
  const editableTexts = document.querySelectorAll(".editable-text");
  editableTexts.forEach(el => {
    // Only elements not already handled (like timeline fields)
    if (!el.hasAttribute('data-index')) {
      el.setAttribute("contenteditable", "true");
    }
  });

  // Show Admin Action Bar
  const bar = document.getElementById("admin-toolbar");
  if (bar) bar.classList.add("active");
}

function disableEditMode() {
  document.body.classList.remove("edit-mode");
  
  const editableTexts = document.querySelectorAll(".editable-text");
  editableTexts.forEach(el => {
    el.removeAttribute("contenteditable");
  });

  const bar = document.getElementById("admin-toolbar");
  if (bar) bar.classList.remove("active");
}

// --- Skill Tag Management ---
function deleteSkill(index) {
  portfolioData.about.skills.splice(index, 1);
  saveData();
  renderPortfolio();
  showToast("Skill removed successfully", "success");
}

function addSkill() {
  const skillName = prompt("Enter new core skill name:");
  if (skillName && skillName.trim() !== "") {
    portfolioData.about.skills.push(skillName.trim().toUpperCase());
    saveData();
    renderPortfolio();
    showToast("Skill added successfully", "success");
  }
}

// --- Timeline Item Management ---
function deleteTimelineItem(index) {
  if (confirm("Are you sure you want to delete this milestone?")) {
    portfolioData.journey.items.splice(index, 1);
    
    // Normalize step numbering
    portfolioData.journey.items.forEach((item, idx) => {
      item.number = `0${idx + 1}`;
    });
    
    saveData();
    renderPortfolio();
    showToast("Milestone deleted", "success");
  }
}

function editTimelineTheme(index) {
  const currentTheme = portfolioData.journey.items[index].theme;
  portfolioData.journey.items[index].theme = currentTheme === 'red' ? 'white' : 'red';
  saveData();
  renderPortfolio();
}

function addTimelineItem() {
  const numItems = portfolioData.journey.items.length;
  const newNum = numItems + 1 < 10 ? `0${numItems + 1}` : `${numItems + 1}`;
  
  const newItem = {
    id: Date.now().toString(),
    number: newNum,
    title: "New Milestone",
    description: "Double click/edit to write your milestone details.",
    theme: numItems % 2 === 0 ? "red" : "white"
  };

  portfolioData.journey.items.push(newItem);
  saveData();
  renderPortfolio();
  showToast("New milestone added", "success");
  
  // Smooth scroll to the newly created element
  setTimeout(() => {
    const items = document.querySelectorAll(".timeline-item");
    if (items.length > 0) {
      items[items.length - 1].scrollIntoView({ behavior: "smooth" });
    }
  }, 200);
}

// --- Image Handling & Base64 Converter ---
function triggerImageEdit(target) {
  activeImageTarget = target;
  
  // Show image modal choice
  const modal = document.getElementById("image-upload-modal");
  modal.classList.add("active");
}

function handleLocalImageFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target.result;
    
    if (activeImageTarget === 'hero') {
      portfolioData.owner.photo = base64Data;
    } else if (activeImageTarget === 'badge') {
      portfolioData.owner.avatar = base64Data;
    }
    
    saveData();
    renderPortfolio();
    
    // Close modal
    document.getElementById("image-upload-modal").classList.remove("active");
    showToast("Image uploaded and updated successfully", "success");
  };
  reader.readAsDataURL(file);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Scroll Actions
  window.addEventListener("scroll", () => {
    checkScroll();
    animateTimelineOnScroll();
  });

  // Inline-editing saving on element focus losses
  document.querySelectorAll(".editable-text").forEach(el => {
    el.addEventListener("blur", (e) => {
      const fieldPath = e.target.getAttribute("data-field");
      if (!fieldPath) return;

      const keys = fieldPath.split(".");
      let target = portfolioData;
      
      // Navigate nested paths (e.g. owner.role)
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      
      target[keys[keys.length - 1]] = e.target.innerText.trim();
      saveData();
      
      // If we edited the brandName or name, regenerate logo text and barcode
      if (fieldPath === 'footer.brandName' || fieldPath === 'owner.name') {
        renderPortfolio();
      }
    });
  });

  // Link modification prompts
  document.querySelectorAll(".editable-link").forEach(linkEl => {
    linkEl.addEventListener("click", (e) => {
      if (currentRole !== 'admin') return; // Allow regular anchor jump for visitors
      
      e.preventDefault();
      const linkKey = e.target.getAttribute("data-link"); // 'github' or 'linkedin'
      const prevName = portfolioData.footer[linkKey].name;
      const prevUrl = portfolioData.footer[linkKey].url;

      const newName = prompt(`Enter ${linkKey} Username:`, prevName);
      const newUrl = prompt(`Enter ${linkKey} Profile URL:`, prevUrl);

      if (newName !== null && newUrl !== null) {
        portfolioData.footer[linkKey].name = newName.trim();
        portfolioData.footer[linkKey].url = newUrl.trim();
        saveData();
        renderPortfolio();
        showToast("Profile links updated", "success");
      }
    });
  });

  // Skills and timeline cards adding listeners
  const addTagBtn = document.getElementById("add-tag-btn");
  if (addTagBtn) addTagBtn.addEventListener("click", addSkill);

  const addTimelineBtn = document.getElementById("add-timeline-card-btn");
  if (addTimelineBtn) addTimelineBtn.addEventListener("click", addTimelineItem);

  // Edit Image Triggers
  const heroImgOverlay = document.getElementById("hero-img-edit-overlay");
  if (heroImgOverlay) heroImgOverlay.addEventListener("click", () => triggerImageEdit('hero'));

  const badgeImgOverlay = document.getElementById("badge-img-edit-overlay");
  if (badgeImgOverlay) badgeImgOverlay.addEventListener("click", () => triggerImageEdit('badge'));

  // Image Upload File Listeners
  const fileInput = document.getElementById("img-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      handleLocalImageFile(file);
    });
  }

  const closeImageModalBtn = document.getElementById("close-image-modal-btn");
  if (closeImageModalBtn) {
    closeImageModalBtn.addEventListener("click", () => {
      const modal = document.getElementById("image-upload-modal");
      if (modal) modal.classList.remove("active");
    });
  }

  const applyImageUrlBtn = document.getElementById("apply-image-url-btn");
  if (applyImageUrlBtn) {
    applyImageUrlBtn.addEventListener("click", () => {
      const urlInput = document.getElementById("img-url-input");
      if (!urlInput) return;
      const url = urlInput.value.trim();
      if (url !== "") {
        if (activeImageTarget === 'hero') {
          portfolioData.owner.photo = url;
        } else if (activeImageTarget === 'badge') {
          portfolioData.owner.avatar = url;
        }
        
        saveData();
        renderPortfolio();
        
        const modal = document.getElementById("image-upload-modal");
        if (modal) modal.classList.remove("active");
        urlInput.value = "";
        showToast("Image link applied successfully", "success");
      }
    });
  }

  // Admin Logout Button Toolbar
  const adminLogoutBtn = document.getElementById("admin-logout-btn");
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      currentRole = 'none';
      disableEditMode();
      renderPortfolio();
      showToast("Logged out from Admin", "success");
    });
  }

  // Download Config Button
  const adminDlBtn = document.getElementById("admin-download-btn");
  if (adminDlBtn) {
    adminDlBtn.addEventListener("click", downloadConfig);
  }

  // Dismiss modals by clicking on background backdrop
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(b => {
    b.classList.remove("active");
  });
}

// Check navigation shrink background on scroll
function checkScroll() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

// Download local JSON data
function downloadConfig() {
  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", jsonString);
  dlAnchor.setAttribute("download", "portfolio-data.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  
  showToast("portfolio-data.json downloaded. Copy this to your codebase to persist permanently!", "success");
}

// --- Toast Alerts system ---
function showToast(message, type = 'success') {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);

  // Update icons inside toast
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Animate in
  setTimeout(() => {
    toast.classList.add("active");
  }, 10);

  // Auto clean up
  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

// ═══════════════════════════════════════════════════════════
//  LAMP MODE — cursor-as-flashlight dark mode
// ═══════════════════════════════════════════════════════════
function initLampMode() {
  const overlay    = document.getElementById('lamp-overlay');
  const lampDot    = document.getElementById('lamp-cursor');
  const toggleBtn  = document.getElementById('lamp-toggle-btn');
  const lampIcon   = document.getElementById('lamp-icon');
  if (!overlay || !lampDot || !toggleBtn) return;

  let lampOn = localStorage.getItem('lampMode') === 'true';

  // ── Apply / remove lamp-mode class ───────────────────────
  function applyLampState() {
    if (lampOn) {
      document.body.classList.add('lamp-mode');
      // Swap icon: moon → sun
      if (lampIcon) {
        lampIcon.setAttribute('data-lucide', 'sun');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    } else {
      document.body.classList.remove('lamp-mode');
      if (lampIcon) {
        lampIcon.setAttribute('data-lucide', 'moon');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }
    localStorage.setItem('lampMode', lampOn);
  }

  // Apply saved preference on load
  applyLampState();

  // ── Toggle button ─────────────────────────────────────────
  toggleBtn.addEventListener('click', () => {
    lampOn = !lampOn;
    applyLampState();
    showToast(
      lampOn ? '🔦 Lamp mode ON — move your cursor to illuminate' : '💡 Lamp mode OFF',
      'success'
    );
  });

  // ── Mouse tracking — update gradient hole + cursor dot ───
  document.addEventListener('mousemove', (e) => {
    // Move the glowing dot (uses clientX/Y — fixed positioned)
    lampDot.style.left = e.clientX + 'px';
    lampDot.style.top  = e.clientY + 'px';

    // Only update the overlay gradient when lamp is active (perf)
    if (!lampOn) return;
    // Express cursor position as % of viewport for the fixed overlay
    const px = (e.clientX / window.innerWidth  * 100).toFixed(2) + '%';
    const py = (e.clientY / window.innerHeight * 100).toFixed(2) + '%';
    document.body.style.setProperty('--lx', px);
    document.body.style.setProperty('--ly', py);
    overlay.style.setProperty('--lx', px);
    overlay.style.setProperty('--ly', py);
  });

  // ── Press feedback — cursor dot shrinks on click ─────────
  document.addEventListener('mousedown', () => {
    if (lampOn) document.body.classList.add('lamp-pressing');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('lamp-pressing');
  });
}
