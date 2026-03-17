/**
 * DataStore - Centralized state management for the application
 * 
 * Usage:
 *   // Get current state
 *   const { appointments, feedback } = DataStore.getState();
 *   
 *   // Update state
 *   DataStore.setState({
 *       appointments: [...DataStore.state.appointments, newAppointment]
 *   });
 *   
 *   // Subscribe to changes
 *   const unsubscribe = DataStore.subscribe(() => {
 *       console.log('State changed:', DataStore.state);
 *   });
 *   
 *   // Unsubscribe
 *   unsubscribe();
 */

class DataStoreClass {
    constructor() {
        this.state = {
            appointments: [],
            feedback: [],
            bills: [],
            stats: {
                totalAppointments: 0,
                completedAppointments: 0,
                pendingAppointments: 0,
                averageRating: 0,
                totalBills: 0,
                totalRevenue: 0
            },
            user: null,
            isLoading: false,
            error: null
        };

        this.listeners = [];
        this.history = [];
        this.maxHistory = 50;
        this.isDirty = false;
    }

    /**
     * Get the entire state
     * @returns {Object} Current application state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get a specific property from state
     * @param {string} key - Property key
     * @returns {*} Property value
     */
    getProperty(key) {
        return this.state[key];
    }

    /**
     * Update state
     * @param {Object} updates - Properties to update
     * @param {string} action - Optional action name for history
     */
    setState(updates, action = 'update') {
        const previousState = JSON.parse(JSON.stringify(this.state));

        this.state = {
            ...this.state,
            ...updates
        };

        this.isDirty = true;

        // Add to history
        this.history.push({
            action,
            previousState,
            newState: JSON.parse(JSON.stringify(this.state)),
            timestamp: new Date().toISOString()
        });

        // Keep history size manageable
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Notify all subscribers
        this.notifyListeners();
    }

    /**
     * Merge nested object in state
     * @param {string} key - Property key
     * @param {Object} updates - Properties to merge
     */
    mergeProperty(key, updates) {
        if (typeof this.state[key] === 'object' && this.state[key] !== null) {
            this.setState({
                [key]: { ...this.state[key], ...updates }
            });
        }
    }

    /**
     * Subscribe to state changes
     * @param {Function} listener - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners of state change
     * @private
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (error) {
                console.error('Error in DataStore listener:', error);
            }
        });
    }

    /**
     * Clear all listeners
     */
    clearListeners() {
        this.listeners = [];
    }

    /**
     * Get state change history
     * @returns {Array} History of changes
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Undo last state change
     */
    undo() {
        if (this.history.length === 0) {
            console.warn('No history to undo');
            return;
        }

        const lastChange = this.history.pop();
        this.state = JSON.parse(JSON.stringify(lastChange.previousState));
        this.notifyListeners();
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Set loading state
     * @param {boolean} isLoading - Loading status
     */
    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    /**
     * Set error state
     * @param {Error|string} error - Error object or message
     */
    setError(error) {
        this.setState({
            error: error instanceof Error ? error.message : error
        });
    }

    /**
     * Clear error
     */
    clearError() {
        this.setState({ error: null });
    }

    /**
     * Check if state has unsaved changes
     * @returns {boolean} Dirty flag
     */
    isDirtyState() {
        return this.isDirty;
    }

    /**
     * Mark state as clean
     */
    markClean() {
        this.isDirty = false;
    }

    /**
     * Reset entire state to initial values
     */
    reset() {
        this.state = {
            appointments: [],
            feedback: [],
            bills: [],
            stats: {
                totalAppointments: 0,
                completedAppointments: 0,
                pendingAppointments: 0,
                averageRating: 0,
                totalBills: 0,
                totalRevenue: 0
            },
            user: null,
            isLoading: false,
            error: null
        };
        this.history = [];
        this.isDirty = false;
        this.notifyListeners();
    }

    /**
     * Export state as JSON
     * @returns {string} JSON string of state
     */
    toJSON() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Import state from JSON
     * @param {string} jsonString - JSON string of state
     */
    fromJSON(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.setState(imported, 'import');
        } catch (error) {
            console.error('Failed to import state:', error);
        }
    }
}

// Create singleton instance
const DataStore = new DataStoreClass();

// Export for both ES6 modules and global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataStore;
}
