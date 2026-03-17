# Shalom Dental Care - Component Library

This directory contains reusable Vue-like components built with vanilla JavaScript for the Shalom Dental Care admin portal.

## 🏗️ Architecture

```
components/
├── shared/
│   ├── EventBus.js       # Global event communication
│   ├── DataStore.js      # Centralized state management
│   └── Utils.js          # Common utility functions
├── FeedbackForm.js       # Reusable feedback form component
├── AppointmentCard.js    # Appointment display component
├── BillModal.js          # Billing form component
├── DashboardWidget.js    # Stats/analytics widget
└── README.md             # This file
```

## 📚 Components

### 1. FeedbackForm

A reusable feedback collection form with star ratings, categories, and optional homepage display.

**Features:**
- Star rating selector (1-5)
- Category selection (Cleanliness, Staff, Treatment, etc.)
- Comments section
- Homepage display toggle
- Source tracking (In-person, Phone, WhatsApp, Email, Google, Social)
- Internal notes for staff

**Usage:**
```javascript
const feedbackForm = new FeedbackForm({
    container: '#feedback-form-container',
    onSubmit: (data) => {
        console.log('Feedback submitted:', data);
        // Save to database
    },
    onUpdate: (data) => {
        console.log('Form updated:', data);
    }
});

// Get current form state
const state = feedbackForm.getState();

// Update form programmatically
feedbackForm.setState({ patientName: 'John Doe', rating: 5 });

// Submit form
feedbackForm.submit();

// Clear form
feedbackForm.clear();
```

**State:**
```javascript
{
    id: 'unique-id',
    patientName: string,
    appointmentId: string,
    phone: string,
    service: string,
    appointmentDate: date string,
    rating: number (1-5),
    categories: string[],
    comments: string,
    recommend: 'yes' | 'maybe' | 'no',
    source: 'in-person' | 'phone' | 'whatsapp' | 'email' | 'google' | 'social' | 'other',
    internalNotes: string,
    showOnHomepage: boolean,
    createdAt: ISO string,
    createdBy: string
}
```

### 2. AppointmentCard (Planned)

Displays a single appointment with status, actions, and related information.

**Planned Features:**
- Appointment details display
- Status badge (Pending, Confirmed, Completed, Cancelled)
- Action buttons (Confirm, Complete, Reschedule, Cancel)
- Quick feedback modal
- SMS notification button

**Planned Usage:**
```javascript
const appointmentCard = new AppointmentCard({
    container: '#appointment-${id}',
    data: appointmentObject,
    onStatusChange: (newStatus) => { ... },
    onFeedback: () => { ... },
    onSMS: () => { ... }
});
```

### 3. BillModal (Planned)

Modal form for creating and editing bills with automatic calculations.

**Planned Features:**
- Patient information
- Line item management
- Automatic calculations (subtotal, tax, discount)
- Payment method and status tracking
- Bill date and notes
- PDF export

**Planned Usage:**
```javascript
const billModal = new BillModal({
    appointmentId: 123,
    onSave: (billData) => { ... },
    onClose: () => { ... }
});

billModal.open();
billModal.close();
```

### 4. DashboardWidget (Planned)

Reusable dashboard widget for displaying statistics.

**Planned Features:**
- Stat cards (total appointments, revenue, etc.)
- Progress indicators
- Trend charts
- Custom theming

**Planned Usage:**
```javascript
const widget = new DashboardWidget({
    type: 'stat-card',
    title: 'Total Appointments',
    value: 150,
    icon: 'fas fa-calendar',
    trend: '+12%'
});
```

## 🔧 Shared Utilities

### EventBus

Global event communication system for decoupled components.

**Usage:**
```javascript
// Emit event
EventBus.emit('feedback:submitted', feedbackData);

// Listen to event
EventBus.on('feedback:submitted', (data) => {
    console.log('Feedback received:', data);
});

// One-time listener
EventBus.once('user:logged-in', (user) => {
    console.log('Welcome!', user.name);
});

// Remove listener
EventBus.off('feedback:submitted', handler);

// Remove all listeners
EventBus.removeAllListeners('feedback:submitted');
```

**Event Names Convention:**
- `{entity}:{action}` (e.g., `feedback:submitted`, `appointment:updated`)
- `app:{action}` (e.g., `app:error`, `app:loading`)
- `modal:{action}` (e.g., `modal:opened`, `modal:closed`)

### DataStore

Centralized state management with subscription support.

**Usage:**
```javascript
// Get state
const state = DataStore.getState();
const appointments = DataStore.getProperty('appointments');

// Update state
DataStore.setState({
    appointments: [...appointments, newAppointment]
}, 'appointment:added');

// Subscribe to changes
const unsubscribe = DataStore.subscribe((newState) => {
    console.log('State updated:', newState);
    updateUI();
});

// Merge nested objects
DataStore.mergeProperty('stats', { totalAppointments: 100 });

// Undo last change
DataStore.undo();

// Get history
const history = DataStore.getHistory();

// Check if dirty (unsaved changes)
if (DataStore.isDirtyState()) {
    console.log('Unsaved changes exist');
}

// Clean up on save
DataStore.markClean();

// Reset to initial state
DataStore.reset();
```

### Utils

Common utility functions.

**Available Methods:**
```javascript
// Date formatting
Utils.formatDate('2024-01-15')              // "15/01/2024"
Utils.formatDateTime('2024-01-15T14:30')    // "15/01/2024, 2:30 PM"

// Currency & phone
Utils.formatCurrency(1000)                  // "₹1,000.00"
Utils.formatPhone('9876543210')             // "98765 43210"

// Validation
Utils.isValidEmail('test@example.com')      // true
Utils.isValidPhone('9876543210')            // true

// DOM manipulation
Utils.createElement('div', { class: 'my-div' }, 'Content')
Utils.addClass(element, 'active')
Utils.removeClass(element, 'active')
Utils.toggleClass(element, 'active')
Utils.show(element)
Utils.hide(element)

// Utilities
Utils.generateId()                          // "1234567890_abc123xyz"
Utils.deepClone(obj)                        // Deep copy of object
Utils.debounce(fn, 300)                     // Debounced function
Utils.throttle(fn, 300)                     // Throttled function
Utils.parseQueryString()                    // Get URL params
Utils.copyToClipboard(text)                 // Copy to clipboard
```

## 🔌 Integration with Existing App

### Option 1: Progressive Enhancement (Recommended)
Keep the existing `dental_admin_enhanced3.html` and gradually replace sections:

```html
<!-- Old way -->
<div id="feedbackForm"><!-- Inline form --></div>

<!-- New way -->
<script src="components/shared/Utils.js"></script>
<script src="components/shared/EventBus.js"></script>
<script src="components/shared/DataStore.js"></script>
<script src="components/FeedbackForm.js"></script>

<script>
    const feedbackForm = new FeedbackForm({
        container: '#feedbackForm',
        onSubmit: (data) => {
            // Use existing AdminPortal methods
            adminPortal.saveFeedback(data);
        }
    });
</script>
```

### Option 2: New App File
Create a new `index-components.html` that uses the new architecture:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="components/shared/Utils.js"></script>
    <script src="components/shared/EventBus.js"></script>
    <script src="components/shared/DataStore.js"></script>
    <script src="components/FeedbackForm.js"></script>
</head>
<body>
    <div id="app">
        <div id="feedback-form"></div>
    </div>

    <script>
        // Initialize components
        const feedbackForm = new FeedbackForm({
            container: '#feedback-form',
            onSubmit: (data) => {
                EventBus.emit('feedback:submitted', data);
            }
        });

        // Subscribe to events
        EventBus.on('feedback:submitted', async (data) => {
            DataStore.setState({ isLoading: true });
            const result = await saveFeedback(data);
            DataStore.setState({ isLoading: false });
        });
    });
</script>
</body>
</html>
```

## 📋 Best Practices

### 1. Component Naming
- Use PascalCase for component classes: `FeedbackForm`, `AppointmentCard`
- Use kebab-case for event names: `feedback:submitted`, `appointment:updated`
- Use camelCase for methods: `setState()`, `getState()`, `onSubmit()`

### 2. State Management
- Keep component state minimal and local
- Use DataStore for global state
- Use EventBus for cross-component communication

### 3. Event Names
```javascript
// Good
EventBus.emit('feedback:submitted', data);
EventBus.on('feedback:updated', handler);

// Bad
EventBus.emit('feedbackSubmitted', data);
EventBus.on('onFeedbackUpdate', handler);
```

### 4. Error Handling
```javascript
try {
    const result = await submitFeedback(data);
    EventBus.emit('feedback:submitted', result);
} catch (error) {
    DataStore.setError(error);
    EventBus.emit('error:feedback', error);
}
```

### 5. Performance
- Use `Utils.debounce()` for input validation
- Use `Utils.throttle()` for window resize events
- Unsubscribe from DataStore when component unmounts

## 🧪 Testing Components

### Unit Test Example
```javascript
describe('FeedbackForm', () => {
    it('should create feedback object', () => {
        const feedback = new FeedbackForm({
            container: '#test-container'
        });
        
        feedback.setState({
            patientName: 'John',
            rating: 5
        });
        
        const state = feedback.getState();
        expect(state.patientName).toBe('John');
        expect(state.rating).toBe(5);
    });
});
```

## 📦 Dependencies

- **Supabase**: Database & authentication
- **Font Awesome 6.4.0**: Icons
- **Chart.js**: Charts & graphs
- **jsPDF**: PDF export

All other utilities are vanilla JavaScript with no external dependencies.

## 🚀 Future Improvements

- [ ] TypeScript definitions
- [ ] React/Vue wrapper components
- [ ] Unit tests for all components
- [ ] Storybook for component showcase
- [ ] Accessibility improvements (ARIA labels)
- [ ] Dark mode support
- [ ] Animations & transitions
- [ ] Form validation schemas
- [ ] Multi-language support

## 📞 Support

For issues or questions about components, create an issue in the project repository.
