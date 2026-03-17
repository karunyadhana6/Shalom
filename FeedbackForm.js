/**
 * FeedbackForm Component
 * 
 * Reusable feedback form for collecting patient ratings and feedback.
 * 
 * Usage:
 *   const feedback = new FeedbackForm({
 *       container: '#feedback-form-container',
 *       onSubmit: (data) => { ... },
 *       onUpdate: (data) => { ... }
 *   });
 *   
 *   feedback.setState({ patientName: 'John' });
 *   feedback.submit();
 */

class FeedbackForm {
    constructor(options = {}) {
        this.container = typeof options.container === 'string' 
            ? document.querySelector(options.container) 
            : options.container;

        this.onSubmit = options.onSubmit || (() => {});
        this.onUpdate = options.onUpdate || (() => {});
        this.onCancel = options.onCancel || (() => {});

        this.state = {
            id: Utils.generateId(),
            patientName: '',
            appointmentId: '',
            phone: '',
            service: '',
            appointmentDate: new Date().toISOString().split('T')[0],
            rating: 0,
            categories: [],
            comments: '',
            recommend: 'yes',
            source: 'in-person',
            internalNotes: '',
            showOnHomepage: false,
            createdAt: new Date().toISOString(),
            createdBy: 'Admin'
        };

        this.categories = [
            { value: 'cleanliness', label: '🧹 Cleanliness' },
            { value: 'staff', label: '👨‍⚕️ Staff' },
            { value: 'treatment', label: '🦷 Treatment' },
            { value: 'wait-time', label: '⏱️ Wait Time' },
            { value: 'pricing', label: '💰 Pricing' },
            { value: 'facilities', label: '🏥 Facilities' },
            { value: 'communication', label: '💬 Communication' },
            { value: 'followup', label: '📞 Follow-up' }
        ];

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('FeedbackForm: No container provided');
            return;
        }
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="feedback-form-wrapper">
                <form id="${this.getFormId()}" class="feedback-form">
                    <!-- Patient Info Section -->
                    <div class="feedback-form-section">
                        <h4 class="feedback-section-title">
                            <i class="fas fa-user"></i> Patient Information
                        </h4>
                        
                        <div class="feedback-form-row">
                            <div class="feedback-form-group">
                                <label><i class="fas fa-user"></i> Patient Name</label>
                                <input type="text" id="${this.getFieldId('patientName')}" 
                                    class="feedback-input" placeholder="Enter patient name"
                                    value="${this.state.patientName}">
                            </div>
                            <div class="feedback-form-group">
                                <label><i class="fas fa-phone"></i> Phone</label>
                                <input type="tel" id="${this.getFieldId('phone')}" 
                                    class="feedback-input" placeholder="Enter phone number"
                                    value="${this.state.phone}">
                            </div>
                        </div>

                        <div class="feedback-form-row">
                            <div class="feedback-form-group">
                                <label><i class="fas fa-tooth"></i> Service</label>
                                <input type="text" id="${this.getFieldId('service')}" 
                                    class="feedback-input" placeholder="e.g., Root Canal, Cleaning"
                                    value="${this.state.service}">
                            </div>
                            <div class="feedback-form-group">
                                <label><i class="fas fa-calendar"></i> Appointment Date</label>
                                <input type="date" id="${this.getFieldId('appointmentDate')}" 
                                    class="feedback-input"
                                    value="${this.state.appointmentDate}">
                            </div>
                        </div>
                    </div>

                    <!-- Rating Section -->
                    <div class="feedback-form-section">
                        <h4 class="feedback-section-title">
                            <i class="fas fa-star"></i> Rating
                        </h4>
                        
                        <div class="rating-selector">
                            ${[1, 2, 3, 4, 5].map(star => `
                                <button type="button" class="rating-star ${this.state.rating >= star ? 'active' : ''}"
                                    onclick="event.preventDefault(); this.getRatingComponent('${this.state.id}').setState({rating: ${star}})"
                                    title="${star} Star${star !== 1 ? 's' : ''}">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                        <p class="rating-label">${this.state.rating || 'Select a rating'} Star${this.state.rating !== 1 ? 's' : ''}</p>
                    </div>

                    <!-- Categories Section -->
                    <div class="feedback-form-section">
                        <h4 class="feedback-section-title">
                            <i class="fas fa-tag"></i> What can we improve?
                        </h4>
                        
                        <div class="category-grid">
                            ${this.categories.map(cat => `
                                <label class="category-tag ${this.state.categories.includes(cat.value) ? 'selected' : ''}">
                                    <input type="checkbox" value="${cat.value}" 
                                        ${this.state.categories.includes(cat.value) ? 'checked' : ''}
                                        onchange="this.getRatingComponent('${this.state.id}').handleCategoryChange()">
                                    <span>${cat.label}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div class="feedback-form-section">
                        <h4 class="feedback-section-title">
                            <i class="fas fa-comment"></i> Additional Comments
                        </h4>
                        
                        <textarea id="${this.getFieldId('comments')}" 
                            class="feedback-input feedback-textarea"
                            placeholder="Share your experience with us...">
${this.state.comments}</textarea>
                    </div>

                    <!-- Additional Options -->
                    <div class="feedback-form-section">
                        <h4 class="feedback-section-title">
                            <i class="fas fa-sliders-h"></i> Additional Options
                        </h4>
                        
                        <div class="feedback-form-row">
                            <div class="feedback-form-group">
                                <label><i class="fas fa-thumbs-up"></i> Would you recommend us?</label>
                                <select id="${this.getFieldId('recommend')}" class="feedback-input">
                                    <option value="yes" ${this.state.recommend === 'yes' ? 'selected' : ''}>Yes</option>
                                    <option value="maybe" ${this.state.recommend === 'maybe' ? 'selected' : ''}>Maybe</option>
                                    <option value="no" ${this.state.recommend === 'no' ? 'selected' : ''}>No</option>
                                </select>
                            </div>
                            <div class="feedback-form-group">
                                <label><i class="fas fa-microphone"></i> Feedback Source</label>
                                <select id="${this.getFieldId('source')}" class="feedback-input">
                                    <option value="in-person" ${this.state.source === 'in-person' ? 'selected' : ''}>In-Person</option>
                                    <option value="phone" ${this.state.source === 'phone' ? 'selected' : ''}>Phone</option>
                                    <option value="whatsapp" ${this.state.source === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                                    <option value="email" ${this.state.source === 'email' ? 'selected' : ''}>Email</option>
                                    <option value="google" ${this.state.source === 'google' ? 'selected' : ''}>Google Review</option>
                                    <option value="social" ${this.state.source === 'social' ? 'selected' : ''}>Social Media</option>
                                    <option value="other" ${this.state.source === 'other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                        </div>

                        <div class="feedback-form-group">
                            <label><i class="fas fa-sticky-note"></i> Internal Notes (Staff Only)</label>
                            <textarea id="${this.getFieldId('internalNotes')}" class="feedback-input feedback-textarea"
                                placeholder="Add any internal notes or follow-up actions needed...">
${this.state.internalNotes}</textarea>
                        </div>

                        <!-- Show on Homepage Toggle -->
                        <div class="feedback-form-group">
                            <small style="color: var(--medium-gray); display: block; margin-bottom: 0.5rem;">
                                <i class="fas fa-info-circle"></i> Only ratings 4★ and above will be displayed publicly
                            </small>
                            <button type="button" class="homepage-toggle-btn" id="${this.getFieldId('homepageBtn')}"
                                onclick="event.preventDefault(); this.getRatingComponent('${this.state.id}').toggleHomepageDisplay()">
                                <i class="fas fa-circle"></i> Display on Website Homepage
                            </button>
                            <input type="hidden" id="${this.getFieldId('showOnHomepage')}" value="${this.state.showOnHomepage}">
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="feedback-form-actions">
                        <button type="button" class="btn-clear-feedback" onclick="event.preventDefault(); this.getRatingComponent('${this.state.id}').clear()">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                        <button type="submit" class="btn-submit-feedback">
                            <i class="fas fa-save"></i> Save Feedback
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners() {
        const form = document.getElementById(this.getFormId());
        if (!form) return;

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });

        // Input changes
        ['patientName', 'phone', 'service', 'appointmentDate', 'comments', 
         'recommend', 'source', 'internalNotes'].forEach(field => {
            const input = document.getElementById(this.getFieldId(field));
            if (input) {
                input.addEventListener('change', () => {
                    this.state[field] = input.value;
                    this.onUpdate(this.state);
                });
            }
        });

        // Make global reference available
        window[`getRatingComponent_${this.state.id}`] = () => this;
    }

    handleCategoryChange() {
        const form = document.getElementById(this.getFormId());
        const checkboxes = form.querySelectorAll('[type="checkbox"]');
        this.state.categories = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        this.onUpdate(this.state);
    }

    toggleHomepageDisplay() {
        const btn = document.getElementById(this.getFieldId('homepageBtn'));
        const hiddenInput = document.getElementById(this.getFieldId('showOnHomepage'));
        
        if (btn) {
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');
            
            if (hiddenInput) {
                hiddenInput.value = isActive ? 'true' : 'false';
                this.state.showOnHomepage = isActive;
            }
            
            const icon = btn.querySelector('i');
            if (icon) {
                if (isActive) {
                    icon.classList.remove('fa-circle');
                    icon.classList.add('fa-check-circle');
                } else {
                    icon.classList.remove('fa-check-circle');
                    icon.classList.add('fa-circle');
                }
            }
        }
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.render();
        this.attachEventListeners();
    }

    getState() {
        return { ...this.state };
    }

    submit() {
        // Validation
        if (!this.state.patientName) {
            alert('Please enter patient name');
            return;
        }

        if (this.state.rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (this.state.showOnHomepage && this.state.rating < 4) {
            alert('Only ratings 4★ and above can be shown on homepage');
            this.state.showOnHomepage = false;
            return;
        }

        this.onSubmit(this.state);
    }

    clear() {
        this.state = {
            id: Utils.generateId(),
            patientName: '',
            appointmentId: '',
            phone: '',
            service: '',
            appointmentDate: new Date().toISOString().split('T')[0],
            rating: 0,
            categories: [],
            comments: '',
            recommend: 'yes',
            source: 'in-person',
            internalNotes: '',
            showOnHomepage: false,
            createdAt: new Date().toISOString(),
            createdBy: 'Admin'
        };
        this.render();
        this.attachEventListeners();
    }

    getFormId() {
        return `feedback-form-${this.state.id}`;
    }

    getFieldId(field) {
        return `feedback-${field}-${this.state.id}`;
    }

    getRatingComponent(id) {
        // This will be overridden in global scope
        return this;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.FeedbackForm = FeedbackForm;
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackForm;
}
