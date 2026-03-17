/**
 * Utils - Common utility functions for components
 */

const Utils = {
    /**
     * Format date to human-readable format
     * @param {string|Date} date - Date to format
     * @param {string} locale - Locale (default: 'en-IN')
     * @returns {string} Formatted date
     */
    formatDate(date, locale = 'en-IN') {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString(locale);
    },

    /**
     * Format date and time
     * @param {string|Date} date - Date to format
     * @param {string} locale - Locale (default: 'en-IN')
     * @returns {string} Formatted date and time
     */
    formatDateTime(date, locale = 'en-IN') {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString(locale);
    },

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (default: 'INR')
     * @returns {string} Formatted currency
     */
    formatCurrency(amount, currency = 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    },

    /**
     * Format phone number
     * @param {string} phone - Phone number to format
     * @returns {string} Formatted phone
     */
    formatPhone(phone) {
        if (!phone) return 'N/A';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
        }
        return phone;
    },

    /**
     * Validate email
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number
     * @param {string} phone - Phone to validate
     * @returns {boolean} Is valid phone
     */
    isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Deep clone object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    /**
     * Wait for condition to be true
     * @param {Function} condition - Condition function
     * @param {number} timeout - Timeout in ms (default: 5000)
     * @returns {Promise} Promise that resolves when condition is true
     */
    async waitFor(condition, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (condition()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('Timeout waiting for condition');
    },

    /**
     * Get element by ID
     * @param {string} id - Element ID
     * @returns {Element} DOM element
     */
    getElementById(id) {
        return document.getElementById(id);
    },

    /**
     * Get elements by class
     * @param {string} className - Class name
     * @param {Element} parent - Parent element (default: document)
     * @returns {NodeList} DOM elements
     */
    getElementByClass(className, parent = document) {
        return parent.querySelectorAll(`.${className}`);
    },

    /**
     * Create element
     * @param {string} tag - HTML tag
     * @param {Object} attributes - Attributes object
     * @param {string} content - Inner content
     * @returns {Element} Created element
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style') {
                Object.assign(element.style, value);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        if (content) {
            element.innerHTML = content;
        }
        return element;
    },

    /**
     * Add class to element
     * @param {Element} element - DOM element
     * @param {string} className - Class name
     */
    addClass(element, className) {
        element.classList.add(className);
    },

    /**
     * Remove class from element
     * @param {Element} element - DOM element
     * @param {string} className - Class name
     */
    removeClass(element, className) {
        element.classList.remove(className);
    },

    /**
     * Toggle class on element
     * @param {Element} element - DOM element
     * @param {string} className - Class name
     */
    toggleClass(element, className) {
        element.classList.toggle(className);
    },

    /**
     * Show element
     * @param {Element} element - DOM element
     */
    show(element) {
        element.style.display = '';
    },

    /**
     * Hide element
     * @param {Element} element - DOM element
     */
    hide(element) {
        element.style.display = 'none';
    },

    /**
     * Load script dynamically
     * @param {string} src - Script source
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    /**
     * Parse query string to object
     * @param {string} queryString - Query string (default: window.location.search)
     * @returns {Object} Query parameters
     */
    parseQueryString(queryString = window.location.search) {
        const params = new URLSearchParams(queryString);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    /**
     * Convert object to query string
     * @param {Object} obj - Object to convert
     * @returns {string} Query string
     */
    objectToQueryString(obj) {
        const params = new URLSearchParams(obj);
        return params.toString();
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise} Promise that resolves when text is copied
     */
    async copyToClipboard(text) {
        return navigator.clipboard.writeText(text);
    },

    /**
     * Fetch from Supabase (helper)
     * @param {string} table - Table name
     * @param {string} method - HTTP method
     * @param {Object} data - Data to send
     * @returns {Promise} API response
     */
    async supabaseCall(table, method = 'GET', data = null) {
        // This is a placeholder - implement with actual Supabase client
        console.warn('supabaseCall not implemented');
    }
};

// Export for both ES6 modules and global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
