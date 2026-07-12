// --- Default Portfolio Data (Devanand's Profile) ---
const defaultPortfolioData = {
  owner: {
    name: "Devanand",
    role: "ece engineer",
    roleHeading: "embedded system engineer",
    heroIntro: "Hi, I'm a",
    subtext: "Embedded system engineer with practical knowledge of c,asm ets. Passionate about pcb design and modern technologies.",
    photo: "./hero-photo.jpg",
    avatar: "./hero-photo.jpg"
  },
  about: {
    title: "Hello!",
    introduction: "I am DEVANAND, a Embedded system engineer ",
    skills: ["JAVA", "FLUTTER", "HTML/JS", "CSS/VANILLA", "NODE.JS", "SQL", "GIT"]
  },
  journey: {
    subtitle: "JOURNEY & EXPERIENCE",
    title: "Here is a breakdown of my education and technical journey",
    items: [
      {
        id: "1",
        number: "01",
        title: "Education",
        description: "......................",
        theme: "red"
      },
      {
        id: "2",
        number: "02",
        title: "Skills",
        description: "....................",
        theme: "red"
      },
      {
        id: "3",
        number: "03",
        title: "Projects",
        description: "................",
        theme: "white"
      },
      {
        id: "4",
        number: "04",
        title: "Awards",
        description: "....................",
        theme: "red"
      }
    ]
  },
  footer: {
    location: "..........",
    dob: ".........",
    phone: ".........",
    email: ".............",
    github: { name: "Devanand", url: "https://github.com/Devanand" },
    linkedin: { name: "Devanand", url: "https://linkedin.com/in/devanand" },
    status: "Available Worldwide",
    brandName: "devanand"
  },
  videoUrl: "",
  videoIsLocal: false
};

// --- App State ---
let portfolioData = {};
let currentRole = 'none'; // 'none', 'admin', 'guest'
let activeImageTarget = ''; // 'hero' or 'badge'

// Credentials configuration
const CREDENTIALS = {
  admin: { username: "admin", password: "" },
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
  // Try to load custom data from portfolio-data.json if it exists in the workspace
  let baseData = defaultPortfolioData;
  try {
    const response = await fetch('./portfolio-data.json');
    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData && jsonData.owner) {
        baseData = jsonData;
        console.log("Loaded configuration from portfolio-data.json");
      }
    }
  } catch (e) {
    console.log("No portfolio-data.json found, falling back to default hardcoded data.");
  }

  const savedData = localStorage.getItem("portfolioData");
  if (savedData) {
    try {
      portfolioData = JSON.parse(savedData);
      // Fallback check for structure updates
      if (!portfolioData.owner) throw new Error();

      // Auto-migrate heroIntro field if missing
      if (portfolioData.owner && !portfolioData.owner.heroIntro) {
        portfolioData.owner.heroIntro = "Hi, I'm a";
      }

      // Auto-migrate old Unsplash placeholder photos to the real hero photo
      const OLD_PHOTOS = [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      ];
      if (portfolioData.owner.photo && OLD_PHOTOS.some(p => portfolioData.owner.photo.startsWith(p))) {
        portfolioData.owner.photo = "./hero-photo.jpg";
        saveData();
      }
      if (portfolioData.owner.avatar && OLD_PHOTOS.some(p => portfolioData.owner.avatar.startsWith(p))) {
        portfolioData.owner.avatar = "./hero-photo.jpg";
        saveData();
      }
      
      // Auto-migrate old name if brandName was still the default "sachin"
      if (portfolioData.footer && portfolioData.footer.brandName === "sachin") {
        portfolioData.footer.brandName = "devanand";
        portfolioData.owner.name = "Devanand";
        if (portfolioData.about && portfolioData.about.introduction) {
          portfolioData.about.introduction = portfolioData.about.introduction
            .replace(/SACHIN KUMAR/gi, "DEVANAND")
            .replace(/Sachin/gi, "Devanand");
        }
        if (portfolioData.footer.github && portfolioData.footer.github.name === "Sachin7280") {
          portfolioData.footer.github.name = "Devanand";
          portfolioData.footer.github.url = "https://github.com/Devanand";
        }
        if (portfolioData.footer.linkedin && portfolioData.footer.linkedin.name === "Sachin") {
          portfolioData.footer.linkedin.name = "Devanand";
          portfolioData.footer.linkedin.url = "https://linkedin.com/in/devanand";
        }
        saveData();
      }
    } catch (e) {
      portfolioData = JSON.parse(JSON.stringify(baseData));
    }
  } else {
    portfolioData = JSON.parse(JSON.stringify(baseData));
  }
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

  // 6. Journey / Timeline Card Layout
  renderTimeline();

  // 7. Footer Contacts
  document.getElementById("footer-loc").innerText = portfolioData.footer.location;
  document.getElementById("footer-dob").innerText = portfolioData.footer.dob;
  document.getElementById("footer-phone").innerText = portfolioData.footer.phone;
  document.getElementById("footer-email").innerText = portfolioData.footer.email;
  
  // Links
  const githubLink = document.getElementById("footer-github");
  githubLink.innerText = portfolioData.footer.github.name;
  githubLink.href = portfolioData.footer.github.url;
  
  const linkedinLink = document.getElementById("footer-linkedin");
  linkedinLink.innerText = portfolioData.footer.linkedin.name;
  linkedinLink.href = portfolioData.footer.linkedin.url;

  document.getElementById("footer-status-text").innerText = portfolioData.footer.status;
  document.getElementById("footer-giant-name").innerText = portfolioData.footer.brandName;
  document.getElementById("current-year").innerText = new Date().getFullYear();

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

function renderTimeline() {
  const listContainer = document.getElementById("timeline-list");
  listContainer.innerHTML = "";

  if (portfolioData.journey.items.length === 0) {
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
        <div class="card-num">${item.number || `0${index + 1}`}</div>
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

  // Show "Login" nav status
  const loginBtn = document.getElementById("login-nav-btn");
  if (loginBtn) {
    loginBtn.innerText = "Log out";
    loginBtn.classList.remove("btn-secondary");
    loginBtn.classList.add("btn-primary");
  }
}

function disableEditMode() {
  document.body.classList.remove("edit-mode");
  
  const editableTexts = document.querySelectorAll(".editable-text");
  editableTexts.forEach(el => {
    el.removeAttribute("contenteditable");
  });

  const bar = document.getElementById("admin-toolbar");
  if (bar) bar.classList.remove("active");

  const loginBtn = document.getElementById("login-nav-btn");
  if (loginBtn) {
    loginBtn.innerText = "Login";
    loginBtn.classList.add("btn-secondary");
    loginBtn.classList.remove("btn-primary");
  }
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

  // Modal open/close actions
  const loginBtn = document.getElementById("login-nav-btn");
  const authModal = document.getElementById("auth-modal");
  const closeAuthBtn = document.getElementById("close-auth-modal-btn");

  loginBtn.addEventListener("click", () => {
    if (currentRole !== 'none') {
      // Logout
      currentRole = 'none';
      disableEditMode();
      renderPortfolio();
      showToast("Logged out successfully", "success");
    } else {
      authModal.classList.add("active");
    }
  });

  closeAuthBtn.addEventListener("click", () => {
    authModal.classList.remove("active");
  });

  // Auth Form Submit
  const authForm = document.getElementById("auth-form");
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userVal = document.getElementById("auth-username").value.trim().toLowerCase();
    const passVal = document.getElementById("auth-password").value;

    if (userVal === CREDENTIALS.admin.username && passVal === CREDENTIALS.admin.password) {
      currentRole = 'admin';
      authModal.classList.remove("active");
      enableEditMode();
      renderPortfolio();
      showToast("Logged in as Admin. Edit Mode enabled!", "success");
      authForm.reset();
    } else if (userVal === CREDENTIALS.guest.username && passVal === CREDENTIALS.guest.password) {
      currentRole = 'guest';
      authModal.classList.remove("active");
      disableEditMode();
      renderPortfolio();
      showToast("Logged in as Guest. Welcome!", "success");
      authForm.reset();
    } else {
      showToast("Invalid credentials. Try again.", "error");
    }
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
  document.getElementById("add-tag-btn").addEventListener("click", addSkill);
  document.getElementById("add-timeline-card-btn").addEventListener("click", addTimelineItem);

  // Edit Image Triggers
  document.getElementById("hero-img-edit-overlay").addEventListener("click", () => triggerImageEdit('hero'));
  document.getElementById("badge-img-edit-overlay").addEventListener("click", () => triggerImageEdit('badge'));

  // Image Upload File Listeners
  const fileInput = document.getElementById("img-file-input");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    handleLocalImageFile(file);
  });

  const closeImageModalBtn = document.getElementById("close-image-modal-btn");
  closeImageModalBtn.addEventListener("click", () => {
    document.getElementById("image-upload-modal").classList.remove("active");
  });

  const applyImageUrlBtn = document.getElementById("apply-image-url-btn");
  applyImageUrlBtn.addEventListener("click", () => {
    const url = document.getElementById("img-url-input").value.trim();
    if (url !== "") {
      if (activeImageTarget === 'hero') {
        portfolioData.owner.photo = url;
      } else if (activeImageTarget === 'badge') {
        portfolioData.owner.avatar = url;
      }
      
      saveData();
      renderPortfolio();
      
      document.getElementById("image-upload-modal").classList.remove("active");
      document.getElementById("img-url-input").value = "";
      showToast("Image link applied successfully", "success");
    }
  });

  // Admin Logout Button Toolbar
  document.getElementById("admin-logout-btn").addEventListener("click", () => {
    currentRole = 'none';
    disableEditMode();
    renderPortfolio();
    showToast("Logged out from Admin", "success");
  });

  // Download Config Button
  document.getElementById("admin-download-btn").addEventListener("click", downloadConfig);

  // Video Reel Play & configuration Dialogs
  const playBtn = document.getElementById("play-intro-btn");
  const videoModal = document.getElementById("video-modal");
  const closeVideoBtn = document.getElementById("close-video-modal-btn");
  const saveVideoBtn = document.getElementById("save-video-url-btn");

  playBtn.addEventListener("click", () => {
    videoModal.classList.add("active");
    loadVideoReel();
  });

  closeVideoBtn.addEventListener("click", () => {
    videoModal.classList.remove("active");
    // Stop video frame playing
    document.getElementById("video-iframe").src = "";
  });

  saveVideoBtn.addEventListener("click", () => {
    const videoUrlInput = document.getElementById("intro-video-url-input").value.trim();
    if (videoUrlInput !== "") {
      // Simple YouTube embed path transformer if raw watch URL provided
      let embedUrl = videoUrlInput;
      if (videoUrlInput.includes("youtube.com/watch?v=")) {
        const videoId = videoUrlInput.split("v=")[1].split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrlInput.includes("youtu.be/")) {
        const videoId = videoUrlInput.split("youtu.be/")[1].split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      portfolioData.videoUrl = embedUrl;
      saveData();
      loadVideoReel();
      showToast("Video reel URL updated!", "success");
    }
  });

  // ── Admin Video Management Modal ──────────────────────────────────────────
  let pendingVideoFile = null; // holds a selected File object before user confirms

  // Open from the admin toolbar button
  document.getElementById("admin-video-btn").addEventListener("click", () => {
    openVideoManageModal();
  });

  // Close button
  document.getElementById("close-video-manage-btn").addEventListener("click", () => {
    closeVideoManageModal();
  });

  // File picker — when admin selects a local video file
  const vmFileInput = document.getElementById("vm-file-input");
  vmFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    pendingVideoFile = file;
    // Show filename in label
    document.getElementById("vm-file-label-text").textContent = file.name;
    // Enable the "Use This Video File" button
    document.getElementById("vm-upload-btn").disabled = false;
  });

  // "Use This Video File" — convert to object URL and save
  document.getElementById("vm-upload-btn").addEventListener("click", () => {
    if (!pendingVideoFile) return;

    // For local files use an object URL (works while the server is running locally)
    const objectUrl = URL.createObjectURL(pendingVideoFile);
    portfolioData.videoUrl = objectUrl;
    portfolioData.videoIsLocal = true; // flag so we render a <video> tag, not iframe
    saveData();
    loadVideoReel();
    refreshVideoManageModal();
    showToast("Local video applied successfully!", "success");
  });

  // URL input live validation feedback
  const vmUrlInput = document.getElementById("vm-url-input");
  // Insert feedback element just after the input
  const vmFeedback = document.createElement("div");
  vmFeedback.className = "vm-url-feedback";
  vmUrlInput.parentNode.insertBefore(vmFeedback, vmUrlInput.nextSibling);

  vmUrlInput.addEventListener("input", () => {
    const val = vmUrlInput.value.trim();
    if (!val) { vmFeedback.className = "vm-url-feedback"; return; }

    const isYT = val.includes("youtube.com") || val.includes("youtu.be");
    const isVimeo = val.includes("vimeo.com");
    const isDirect = /\.(mp4|webm|ogg)(\?.*)?$/i.test(val);

    if (isYT || isVimeo || isDirect) {
      vmFeedback.className = "vm-url-feedback valid";
      vmFeedback.textContent = isYT ? "✓ YouTube link detected — will auto-convert to embed"
        : isVimeo ? "✓ Vimeo link detected — will auto-convert to embed"
        : "✓ Direct video file link";
    } else {
      vmFeedback.className = "vm-url-feedback invalid";
      vmFeedback.textContent = "⚠ Not a recognised video URL. Try a YouTube, Vimeo or direct .mp4 link.";
    }
  });

  // "Save Video URL" button
  document.getElementById("vm-url-save-btn").addEventListener("click", () => {
    const raw = vmUrlInput.value.trim();
    if (!raw) { showToast("Please paste a video URL first.", "error"); return; }

    let embedUrl = raw;
    portfolioData.videoIsLocal = false;

    // Auto-transform common watch-page URLs to embed URLs
    if (raw.includes("youtube.com/watch?v=")) {
      const videoId = raw.split("v=")[1].split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    } else if (raw.includes("youtu.be/")) {
      const videoId = raw.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
    } else if (raw.includes("vimeo.com/") && !raw.includes("player.vimeo.com")) {
      const videoId = raw.split("vimeo.com/")[1].split("?")[0].split("/")[0];
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    portfolioData.videoUrl = embedUrl;
    saveData();
    loadVideoReel();
    refreshVideoManageModal();
    vmUrlInput.value = "";
    vmFeedback.className = "vm-url-feedback";
    showToast("Intro video saved!", "success");
  });

  // "Remove Video" button
  document.getElementById("vm-remove-btn").addEventListener("click", () => {
    portfolioData.videoUrl = "";
    portfolioData.videoIsLocal = false;
    saveData();
    loadVideoReel();
    refreshVideoManageModal();
    // Stop the main viewer iframe too
    const iframe = document.getElementById("video-iframe");
    if (iframe) iframe.src = "";
    showToast("Intro video removed.", "success");
  });

  // Dismiss modals by clicking on background backdrop
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });
}

// ── Video Manage Modal helpers ─────────────────────────────────────────────
function openVideoManageModal() {
  refreshVideoManageModal();
  document.getElementById("video-manage-modal").classList.add("active");
  // Reset file picker state
  document.getElementById("vm-file-input").value = "";
  document.getElementById("vm-file-label-text").textContent = "Click to choose a video file";
  document.getElementById("vm-upload-btn").disabled = true;
  document.getElementById("vm-url-input").value = "";
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function closeVideoManageModal() {
  document.getElementById("video-manage-modal").classList.remove("active");
}

function refreshVideoManageModal() {
  const hasVideo = portfolioData.videoUrl && portfolioData.videoUrl !== "";
  const currentSection = document.getElementById("vm-current-section");
  const emptySection   = document.getElementById("vm-empty-section");
  const preview        = document.getElementById("vm-preview");

  if (hasVideo) {
    currentSection.style.display = "block";
    emptySection.style.display   = "none";

    // Render a <video> for local blob URLs, <iframe> for embed links
    if (portfolioData.videoIsLocal || portfolioData.videoUrl.startsWith("blob:")) {
      preview.innerHTML = `
        <video src="${portfolioData.videoUrl}" controls muted style="width:100%;height:100%;object-fit:cover;"></video>`;
    } else {
      preview.innerHTML = `
        <iframe src="${portfolioData.videoUrl}" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
    }
  } else {
    currentSection.style.display = "none";
    emptySection.style.display   = "block";
    preview.innerHTML = "";
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(b => {
    b.classList.remove("active");
  });
  // Stop video iframes when any modal closes
  const iframe = document.getElementById("video-iframe");
  if (iframe) iframe.src = "";
}

// Check navigation shrink background on scroll
function checkScroll() {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

// Load Video iframe logic — supports both embed URLs and local blob video files
function loadVideoReel() {
  const container   = document.getElementById("video-iframe-container");
  const placeholder = document.querySelector(".video-player-placeholder");
  const adminInput  = document.getElementById("intro-video-url-input");

  if (portfolioData.videoUrl && portfolioData.videoUrl !== "") {
    container.style.display = "block";
    placeholder.style.display = "none";

    const isBlob = portfolioData.videoUrl.startsWith("blob:");
    const isLocal = portfolioData.videoIsLocal || isBlob;

    if (isLocal) {
      // Replace iframe with a native <video> player for local files
      container.innerHTML = `
        <video src="${portfolioData.videoUrl}" controls style="width:100%;height:100%;object-fit:cover;">
          Your browser does not support HTML video.
        </video>`;
    } else {
      // Restore iframe if previously replaced
      if (!document.getElementById("video-iframe")) {
        container.innerHTML = `<iframe id="video-iframe" src="" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
      }
      document.getElementById("video-iframe").src = portfolioData.videoUrl;
    }
  } else {
    container.style.display = "none";
    placeholder.style.display = "flex";
    // Reset container back to iframe template
    container.innerHTML = `<iframe id="video-iframe" src="" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
    if (adminInput) adminInput.value = "";
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
