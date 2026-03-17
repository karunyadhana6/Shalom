/**
 * EventBus - Global event communication system for components
 * 
 * Usage:
 *   // Emit event
 *   EventBus.emit('feedback:submitted', { id: 1, rating: 5 });
 *   
 *   // Listen to event
 *   EventBus.on('feedback:submitted', (data) => {
 *       console.log('Feedback submitted:', data);
 *   });
 *   
 *   // Remove listener
 *   EventBus.off('feedback:submitted', handler);
 *   
 *   // One-time listener
 *   EventBus.once('feedback:submitted', (data) => {
 *       console.log('This runs only once');
 *   });
 */

class EventBusClass {
    constructor() {
        this.events = {};
        this.maxListeners = 10;
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} listener - Callback function
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        if (this.events[eventName].length >= this.maxListeners) {
            console.warn(`EventBus: Max listeners (${this.maxListeners}) reached for event "${eventName}"`);
        }

        this.events[eventName].push({ listener, once: false });
    }

    /**
     * Subscribe to an event once
     * @param {string} eventName - Name of the event
     * @param {Function} listener - Callback function
     */
    once(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push({ listener, once: true });
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {...*} args - Arguments to pass to listeners
     */
    emit(eventName, ...args) {
        if (!this.events[eventName]) {
            return;
        }

        // Process listeners and remove 'once' listeners
        this.events[eventName] = this.events[eventName].filter(({ listener, once }) => {
            listener(...args);
            return !once;
        });

        // Clean up empty event arrays
        if (this.events[eventName].length === 0) {
            delete this.events[eventName];
        }
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function} listener - Callback function to remove
     */
    off(eventName, listener) {
        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName] = this.events[eventName].filter(
            item => item.listener !== listener
        );

        if (this.events[eventName].length === 0) {
            delete this.events[eventName];
        }
    }

    /**
     * Remove all listeners for an event
     * @param {string} eventName - Name of the event (optional)
     */
    removeAllListeners(eventName) {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }

    /**
     * Get listener count for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of listeners
     */
    listenerCount(eventName) {
        return this.events[eventName] ? this.events[eventName].length : 0;
    }

    /**
     * Set max listeners warning threshold
     * @param {number} n - Maximum listeners
     */
    setMaxListeners(n) {
        this.maxListeners = n;
    }
}

// Create singleton instance
const EventBus = new EventBusClass();

// Export for both ES6 modules and global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
}
