// Dark/Light Mode Theme Toggle
(function() {
  'use strict';

  const ThemeManager = {
    THEME_KEY: 'yhap-theme',
    LIGHT: 'light',
    DARK: 'dark',

    init() {
      this.loadTheme();
      this.createToggleButton();
      this.attachEventListeners();
    },

    loadTheme() {
      const savedTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT;
      this.setTheme(savedTheme, false);
    },

    setTheme(theme, save = true) {
      if (theme === this.DARK) {
        document.documentElement.classList.add('dark-mode');
        this.updateToggleButton(true);
      } else {
        document.documentElement.classList.remove('dark-mode');
        this.updateToggleButton(false);
      }

      if (save) {
        localStorage.setItem(this.THEME_KEY, theme);
      }
    },

    toggleTheme() {
      const currentTheme = document.documentElement.classList.contains('dark-mode') 
        ? this.DARK 
        : this.LIGHT;
      const newTheme = currentTheme === this.LIGHT ? this.DARK : this.LIGHT;
      this.setTheme(newTheme);
    },

    createToggleButton() {
      // Check if button already exists
      if (document.getElementById('themeToggle')) return;

      const button = document.createElement('button');
      button.id = 'themeToggle';
      button.className = 'theme-toggle-btn';
      button.setAttribute('aria-label', 'Toggle dark mode');
      button.innerHTML = `
        <i class="fas fa-moon theme-icon theme-icon-moon"></i>
        <i class="fas fa-sun theme-icon theme-icon-sun"></i>
      `;

      document.body.appendChild(button);
    },

    updateToggleButton(isDark) {
      const button = document.getElementById('themeToggle');
      if (!button) return;

      if (isDark) {
        button.classList.add('dark');
        button.setAttribute('aria-label', 'Switch to light mode');
      } else {
        button.classList.remove('dark');
        button.setAttribute('aria-label', 'Switch to dark mode');
      }
    },

    attachEventListeners() {
      const button = document.getElementById('themeToggle');
      if (button) {
        button.addEventListener('click', () => this.toggleTheme());
      }
    }
  };

  // Initialize theme manager when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
  } else {
    ThemeManager.init();
  }

  // Expose to window for external access if needed
  window.ThemeManager = ThemeManager;
})();
