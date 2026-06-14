var html = document.querySelector("html");
var darkAndLightMode = document.querySelector("#theme-toggle-button");
var sections = document.querySelectorAll("section");
var navLinks = document.querySelectorAll("nav a");
var buttons = document.querySelectorAll("#portfolio-filters button");
var items = document.querySelectorAll(".portfolioItem");
var scrollToTopButton = document.querySelector("#scroll-to-top");
var settingsToggle = document.querySelector("#settings-toggle");
var settingsSidebar = document.querySelector("#settings-sidebar");
var closeSettings = document.querySelector("#close-settings");
var body = document.querySelector("body");
var fontButtons = document.querySelectorAll(".font-option");
var carousel = document.querySelector("#testimonials-carousel");
var cards = document.querySelectorAll(".testimonial-card");
var prevBtn = document.querySelector("#prev-testimonial");
var nextBtn = document.querySelector("#next-testimonial");
var indicators = document.querySelectorAll(".carousel-indicator");
var currentIndex = 0;
var totalCards = cards.length;
var allSelects = document.querySelectorAll('.custom-select');

// ==========================================
// 1.(Theme)
// ==========================================
if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
} else {
  html.classList.remove("dark");
}

darkAndLightMode.addEventListener("click", function () {
  html.classList.toggle("dark");
  
  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// ==========================================
// 2.(Fonts)
// ==========================================
var savedFont = localStorage.getItem("font");

if (savedFont !== null) {
  body.classList.remove("font-tajawal", "font-alexandria", "font-cairo");
  
  body.classList.add(savedFont);
  
  fontButtons.forEach((button) => {
    button.classList.remove("active")
    if (`font-${button.dataset.font}` === savedFont) {
      button.classList.add("active");
    }
  });
}
fontButtons.forEach((button) => {
  button.addEventListener("click", () => {
    fontButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    body.classList.remove("font-tajawal", "font-alexandria", "font-cairo");
    
    var font = button.dataset.font;
    localStorage.setItem("font", `font-${font}`);
    body.classList.add(`font-${font}`);
    button.classList.add("active");
  });
});

// ==========================================
// 3.(Scroll & Nav)
// ==========================================
window.addEventListener("scroll", function (e) {
  var currentSection = "";

  sections.forEach((section) => {
    var sectionTop = section.offsetTop - 100;

    if (window.scrollY >= sectionTop) {
      currentSection = section.id;
    }
    if (currentSection !== "hero-section" && scrollToTopButton) {
      scrollToTopButton.classList.remove("opacity-0", "invisible");
      scrollToTopButton.classList.add("opacity-1", "visible");
    } else if (scrollToTopButton) {
      scrollToTopButton.classList.add("opacity-0", "invisible");
      scrollToTopButton.classList.remove("opacity-1", "visible");
    }
  });
  
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// ==========================================
// 4.(Portfolio Filter)
// ==========================================
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    var filter = button.dataset.filter;

    items.forEach((portfolioItem) => {
      if (filter === "all" || portfolioItem.dataset.category === filter) {
        portfolioItem.style.display = "block";
      } else {
        portfolioItem.style.display = "none";
      }
    });
  });
});

// ==========================================
// 5.(Scroll Top & Sidebar)
// ==========================================
if (scrollToTopButton) {
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (settingsToggle && settingsSidebar) {
  settingsToggle.addEventListener("click", () => {
    settingsToggle.classList.toggle("sidebar-open");
    settingsSidebar.classList.toggle("translate-x-full");
  });
}

if (closeSettings && settingsToggle && settingsSidebar) {
  closeSettings.addEventListener("click", () => {
    settingsToggle.classList.toggle("sidebar-open");
    settingsSidebar.classList.toggle("translate-x-full");
  });
}

document.addEventListener("DOMContentLoaded", () => {

  function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3; 
    if (window.innerWidth >= 640) return 2;  
    return 1;                               
  }

  function updateCarousel() {
    var cardsPerView = getCardsPerView();
    var maxIndex = totalCards - cardsPerView;

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    if (currentIndex < 0) currentIndex = 0;

    var step = 100 / cardsPerView;
    var translateX = currentIndex * step;
    carousel.style.transform = `translateX(${translateX}%)`;

    indicators.forEach((indicator, index) => {
      if (index === Math.min(currentIndex, indicators.length - 1)) {
        indicator.classList.add("bg-accent");
        indicator.classList.remove("bg-slate-400", "dark:bg-slate-600");
        indicator.setAttribute("aria-selected", "true");
      } else {
        indicator.classList.remove("bg-accent");
        indicator.classList.add("bg-slate-400");
        indicator.setAttribute("aria-selected", "false");
      }
    });
  }

  nextBtn.addEventListener("click", () => {
    var cardsPerView = getCardsPerView();
    if (currentIndex < totalCards - cardsPerView) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    var cardsPerView = getCardsPerView();
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalCards - cardsPerView;
    }
    updateCarousel();
  });

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", (e) => {
      var targetIndex = parseInt(e.target.getAttribute("data-index"));
      var cardsPerView = getCardsPerView();
      var maxIndex = totalCards - cardsPerView;

      currentIndex = Math.min(targetIndex, maxIndex);
      updateCarousel();
    });
  });

  var resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 100);
  });

  updateCarousel();
});


allSelects.forEach(selectElement => {
    var optionsContainer = selectElement.nextElementSibling; 
    var chevronIcon = selectElement.querySelector('.fa-chevron-down');
    var selectedText = selectElement.querySelector('.selected-text');
    var options = optionsContainer.querySelectorAll('.custom-option');

    if (chevronIcon) chevronIcon.classList.add('inline-block');

    selectElement.addEventListener('click', (e) => {
        e.stopPropagation();
        
        closeAllSelects(selectElement);

        var isExpanded = selectElement.getAttribute('aria-expanded') === 'true';
        optionsContainer.classList.toggle('hidden');
        selectElement.setAttribute('aria-expanded', !isExpanded);
        if (chevronIcon) chevronIcon.classList.toggle('rotate-180');
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); 
            
            selectedText.textContent = option.textContent.trim();
            selectedText.classList.remove('text-slate-500', 'dark:text-slate-400');
            
            optionsContainer.classList.add('hidden');
            selectElement.setAttribute('aria-expanded', 'false');
            if (chevronIcon) chevronIcon.classList.remove('rotate-180');
        });
    });
});

function closeAllSelects(exceptThisOne = null) {
    allSelects.forEach(selectElement => {
        if (selectElement === exceptThisOne) return; 
        
        var optionsContainer = selectElement.nextElementSibling;
        var chevronIcon = selectElement.querySelector('.fa-chevron-down');
        
        if (optionsContainer) optionsContainer.classList.add('hidden');
        selectElement.setAttribute('aria-expanded', 'false');
        if (chevronIcon) chevronIcon.classList.remove('rotate-180');
    });
}

document.addEventListener('click', () => closeAllSelects());

// ============================================
// THEME COLORS - Settings Sidebar
// ============================================

const themeColors = [
  { name: 'بنفسجي',     primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa' },
  { name: 'أزرق',       primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa' },
  { name: 'أخضر زمردي', primary: '#10b981', secondary: '#059669', accent: '#34d399' },
  { name: 'وردي',       primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
  { name: 'برتقالي',    primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' },
  { name: 'أحمر',       primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' },
  { name: 'سماوي',      primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' },
  { name: 'رمادي',      primary: '#64748b', secondary: '#475569', accent: '#94a3b8' },
];

const DEFAULT_COLOR_INDEX = 0;

function applyThemeColor(colorObj) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary',   colorObj.primary);
  root.style.setProperty('--color-secondary', colorObj.secondary);
  root.style.setProperty('--color-accent',    colorObj.accent);

  root.style.setProperty('--tw-color-primary',   colorObj.primary);

  updateSwatchActiveState(colorObj.primary);
  localStorage.setItem('themeColor', JSON.stringify(colorObj));
}

function updateSwatchActiveState(primaryValue) {
  document.querySelectorAll('.color-swatch-btn').forEach(btn => {
    const isActive = btn.dataset.primary === primaryValue;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    const circle = btn.querySelector('.swatch-circle');
    const check  = btn.querySelector('.swatch-check');

    if (circle) {
      circle.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';
      circle.style.boxShadow = isActive
        ? `0 0 0 3px white, 0 0 0 5px ${primaryValue}`
        : 'none';
    }
    if (check) {
      check.style.opacity = isActive ? '1' : '0';
    }
  });
}

function renderColorSwatches() {
  const grid = document.getElementById('theme-colors-grid');
  if (!grid) return;

  grid.innerHTML = '';

  themeColors.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'color-swatch-btn relative flex items-center justify-center cursor-pointer transition-all duration-300';
    btn.type = 'button';
    btn.dataset.primary   = color.primary;
    btn.dataset.secondary = color.secondary;
    btn.dataset.accent    = color.accent;
    btn.setAttribute('aria-label', color.name);
    btn.setAttribute('aria-pressed', 'false');

    btn.innerHTML = `
      <span class="swatch-tooltip absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 z-10 shadow-lg">
        ${color.name}
        <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></span>
      </span>

      <span class="swatch-circle w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style="background-color: ${color.primary};">
        <span class="swatch-check opacity-0 transition-opacity duration-200">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L6.5 11.5L13 5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </span>
    `;

    btn.addEventListener('mouseenter', () => {
      btn.querySelector('.swatch-tooltip').style.opacity = '1';
    });
    btn.addEventListener('mouseleave', () => {
      btn.querySelector('.swatch-tooltip').style.opacity = '0';
    });

    btn.addEventListener('click', () => applyThemeColor(color));
    grid.appendChild(btn);
  });
}

function loadSavedThemeColor() {
  const saved = localStorage.getItem('themeColor');
  if (saved) {
    try {
      applyThemeColor(JSON.parse(saved));
    } catch {
      applyThemeColor(themeColors[DEFAULT_COLOR_INDEX]);
    }
  } else {
    applyThemeColor(themeColors[DEFAULT_COLOR_INDEX]);
  }
}

// ============================================
// RESET SETTINGS
// ============================================
document.getElementById('reset-settings')?.addEventListener('click', () => {
  localStorage.removeItem('themeColor');
  applyThemeColor(themeColors[DEFAULT_COLOR_INDEX]);

  localStorage.removeItem('selectedFont');
  document.body.className = document.body.className
    .replace(/font-(alexandria|cairo|tajawal)/g, '')
    .trim() + ' font-tajawal';

  document.querySelectorAll('.font-option').forEach(btn => {
    const isDefault = btn.dataset.font === 'tajawal';
    btn.classList.toggle('active', isDefault);
    btn.setAttribute('aria-checked', isDefault ? 'true' : 'false');
  });
  settingsSidebar.classList.add('translate-x-full');
  settingsToggle.classList.remove('sidebar-open');
});

// ============================================
// INIT
// ============================================
renderColorSwatches();
loadSavedThemeColor();