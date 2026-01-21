// ============================================
// form-handler.js
// Form submission and validation
// ============================================

class FormHandler {
    constructor() {
        this.forms = {};
        this.submissions = [];
    }
    
    // ============================================
    // FORM REGISTRATION
    // ============================================
    
    registerForm(formId, config) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Form ${formId} not found`);
            return false;
        }
        
        this.forms[formId] = {
            element: form,
            config: config,
            fields: this.extractFormFields(form),
            isValid: false
        };
        
        this.setupFormListeners(formId);
        return true;
    }
    
    extractFormFields(form) {
        const fields = {};
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const name = input.name || input.id;
            if (name) {
                fields[name] = {
                    element: input,
                    type: input.type,
                    required: input.required,
                    pattern: input.pattern,
                    minLength: input.minLength,
                    maxLength: input.maxLength,
                    min: input.min,
                    max: input.max,
                    value: input.value,
                    isValid: true,
                    errors: []
                };
            }
        });
        
        return fields;
    }
    
    // ============================================
    // FORM VALIDATION
    // ============================================
    
    validateForm(formId) {
        const form = this.forms[formId];
        if (!form) return false;
        
        let isValid = true;
        
        Object.entries(form.fields).forEach(([fieldName, field]) => {
            field.errors = [];
            field.isValid = true;
            
            // Required field validation
            if (field.required && !field.element.value.trim()) {
                field.errors.push('This field is required');
                field.isValid = false;
                isValid = false;
            }
            
            // Pattern validation
            if (field.pattern && field.element.value.trim()) {
                const regex = new RegExp(field.pattern);
                if (!regex.test(field.element.value)) {
                    field.errors.push('Invalid format');
                    field.isValid = false;
                    isValid = false;
                }
            }
            
            // Length validation
            if (field.minLength && field.element.value.length < field.minLength) {
                field.errors.push(`Minimum ${field.minLength} characters required`);
                field.isValid = false;
                isValid = false;
            }
            
            if (field.maxLength && field.element.value.length > field.maxLength) {
                field.errors.push(`Maximum ${field.maxLength} characters allowed`);
                field.isValid = false;
                isValid = false;
            }
            
            // Range validation
            if (field.min !== undefined && field.element.value < field.min) {
                field.errors.push(`Minimum value is ${field.min}`);
                field.isValid = false;
                isValid = false;
            }
            
            if (field.max !== undefined && field.element.value > field.max) {
                field.errors.push(`Maximum value is ${field.max}`);
                field.isValid = false;
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && field.element.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.element.value)) {
                    field.errors.push('Invalid email address');
                    field.isValid = false;
                    isValid = false;
                }
            }
            
            // URL validation
            if (field.type === 'url' && field.element.value.trim()) {
                try {
                    new URL(field.element.value);
                } catch {
                    field.errors.push('Invalid URL');
                    field.isValid = false;
                    isValid = false;
                }
            }
            
            // Update UI based on validation
            this.updateFieldUI(field);
        });
        
        form.isValid = isValid;
        return isValid;
    }
    
    updateFieldUI(field) {
        const element = field.element;
        const errorContainer = element.parentNode.querySelector('.error-message');
        
        // Remove existing error messages
        if (errorContainer) {
            errorContainer.remove();
        }
        
        // Update styles
        if (field.isValid) {
            element.classList.remove('error');
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
            element.classList.add('error');
            
            // Add error message
            if (field.errors.length > 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = 'var(--error)';
                errorDiv.style.fontSize = '0.8rem';
                errorDiv.style.marginTop = '0.25rem';
                errorDiv.innerHTML = field.errors.join('<br>');
                element.parentNode.appendChild(errorDiv);
            }
        }
    }
    
    // ============================================
    // FORM SUBMISSION
    // ============================================
    
    async submitForm(formId) {
        const form = this.forms[formId];
        if (!form) return false;
        
        // Validate form
        if (!this.validateForm(formId)) {
            StudentAtlas.showNotification('Please fix the errors in the form', 'error');
            return false;
        }
        
        // Get form data
        const formData = this.getFormData(formId);
        
        // Show loading state
        this.setFormLoading(formId, true);
        
        try {
            // Process based on form type
            let result;
            
            switch(formId) {
                case 'zeusForm':
                    result = await this.processZeusForm(formData);
                    break;
                case 'submissionForm':
                    result = await this.processOpportunitySubmission(formData);
                    break;
                case 'editProfileForm':
                    result = await this.processProfileUpdate(formData);
                    break;
                default:
                    result = await this.processGenericForm(formId, formData);
            }
            
            // Handle result
            if (result.success) {
                this.onFormSuccess(formId, result);
            } else {
                this.onFormError(formId, result.error);
            }
            
            return result.success;
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.onFormError(formId, 'An unexpected error occurred. Please try again.');
            return false;
        } finally {
            this.setFormLoading(formId, false);
        }
    }
    
    getFormData(formId) {
        const form = this.forms[formId];
        if (!form) return {};
        
        const data = {};
        
        Object.entries(form.fields).forEach(([fieldName, field]) => {
            const element = field.element;
            
            switch(element.type) {
                case 'checkbox':
                    data[fieldName] = element.checked;
                    break;
                case 'radio':
                    if (element.checked) {
                        data[fieldName] = element.value;
                    }
                    break;
                case 'select-multiple':
                    data[fieldName] = Array.from(element.selectedOptions).map(opt => opt.value);
                    break;
                default:
                    data[fieldName] = element.value.trim();
            }
        });
        
        return data;
    }
    
    // ============================================
    // FORM TYPE HANDLERS
    // ============================================
    
    async processZeusForm(formData) {
        // Process Zeus's diagnostic form
        const cluster = this.determineCluster(formData);
        
        const studentProfile = {
            grade: `${formData.zeusGrade}th Grade`,
            gpa: parseFloat(formData.zeusGPA),
            serviceHours: parseInt(formData.zeusHours) || 0,
            skills: formData.skills || [],
            careerGoals: formData.career || [],
            leadershipRoles: formData.leadership || [],
            financialNeed: formData.financial === 'yes',
            clusterMatch: cluster
        };
        
        // Update student profile
        StudentAtlas.updateStudentProfile(studentProfile);
        
        // Calculate match scores
        StudentAtlas.calculateAllMatchScores();
        
        return {
            success: true,
            cluster: cluster,
            message: `Your National Blueprint is ready! Primary cluster: ${cluster}`
        };
    }
    
    determineCluster(formData) {
        const careers = formData.career || [];
        const financialNeed = formData.financial === 'yes';
        
        // Prioritize scholarships if financial need
        if (financialNeed) return 'Scholarships';
        
        // Check for specific career interests
        if (careers.includes('Arts')) return 'Arts';
        if (careers.includes('Government')) return 'Civics';
        if (careers.includes('Medicine') || careers.includes('Engineering')) return 'STEM';
        
        // Default based on skills
        const skills = formData.skills || [];
        if (skills.includes('Community')) return 'Humanitarian';
        if (skills.includes('STEM')) return 'STEM';
        
        // Default fallback
        return 'STEM';
    }
    
    async processOpportunitySubmission(formData) {
        // Process "Add an Ally" form submission
        
        // Create submission object
        const submission = {
            id: Date.now(), // Temporary ID
            timestamp: new Date().toISOString(),
            title: formData.opportunityTitle,
            organization: formData.organization,
            cluster: formData.cluster,
            location: formData.location,
            cost: formData.cost,
            duration: formData.duration,
            description: formData.description,
            link: formData.website || '',
            eligibility: {
                minGPA: parseFloat(formData.minGPA) || 0,
                grades: formData.grades ? formData.grades.split(',').map(g => parseInt(g.trim())) : [9, 10, 11, 12],
                hoursRequired: parseInt(formData.serviceHours) || 0,
                skills: formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()) : []
            },
            submittedBy: formData.yourName || 'Anonymous',
            email: formData.yourEmail || '',
            status: 'pending', // pending, approved, rejected
            notes: formData.additionalInfo || ''
        };
        
        // Save to local storage (simulating backend)
        this.saveSubmission(submission);
        
        // Send notification (simulated)
        this.sendAdminNotification(submission);
        
        return {
            success: true,
            submissionId: submission.id,
            message: 'Thank you for your submission! Our team will review it within 3-5 business days.'
        };
    }
    
    async processProfileUpdate(formData) {
        // Process profile update form
        const updates = {};
        
        if (formData.grade) updates.grade = formData.grade;
        if (formData.gpa) updates.gpa = parseFloat(formData.gpa);
        if (formData.serviceHours) updates.serviceHours = parseInt(formData.serviceHours);
        if (formData.careerGoals) updates.careerGoals = formData.careerGoals;
        if (formData.financialNeed !== undefined) {
            updates.financialNeed = formData.financialNeed === 'true';
        }
        
        // Update profile
        StudentAtlas.updateStudentProfile(updates);
        
        return {
            success: true,
            message: 'Profile updated successfully!'
        };
    }
    
    async processGenericForm(formId, formData) {
        // Generic form handler for other forms
        console.log(`Processing ${formId}:`, formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            message: 'Form submitted successfully!',
            data: formData
        };
    }
    
    // ============================================
    // SUBMISSION MANAGEMENT
    // ============================================
    
    saveSubmission(submission) {
        // Load existing submissions
        const submissions = JSON.parse(localStorage.getItem('opportunitySubmissions') || '[]');
        
        // Add new submission
        submissions.push(submission);
        
        // Save back to localStorage
        localStorage.setItem('opportunitySubmissions', JSON.stringify(submissions));
        
        // Update in-memory cache
        this.submissions = submissions;
        
        return submission.id;
    }
    
    getSubmissions(status = null) {
        if (!this.submissions.length) {
            this.submissions = JSON.parse(localStorage.getItem('opportunitySubmissions') || '[]');
        }
        
        if (status) {
            return this.submissions.filter(sub => sub.status === status);
        }
        
        return this.submissions;
    }
    
    sendAdminNotification(submission) {
        // In a real app, this would send an email or API notification
        console.log('Admin notification:', {
            type: 'new_submission',
            submissionId: submission.id,
            title: submission.title,
            cluster: submission.cluster
        });
        
        // Store notification in localStorage for demo
        const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        notifications.push({
            id: Date.now(),
            type: 'new_submission',
            submissionId: submission.id,
            title: submission.title,
            timestamp: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }
    
    // ============================================
    // FORM UI CONTROLS
    // ============================================
    
    setFormLoading(formId, isLoading) {
        const form = this.forms[formId];
        if (!form) return;
        
        const submitButton = form.element.querySelector('[type="submit"]');
        const loadingIndicator = form.element.querySelector('.loading-indicator');
        
        if (isLoading) {
            // Disable form
            form.element.classList.add('loading');
            
            // Disable submit button
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <i data-lucide="loader" style="width: 1rem; height: 1rem; animation: spin 1s linear infinite;"></i>
                    Processing...
                `;
            }
            
            // Show loading indicator if exists
            if (loadingIndicator) {
                loadingIndicator.classList.remove('hidden');
            }
        } else {
            // Enable form
            form.element.classList.remove('loading');
            
            // Enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'Submit';
            }
            
            // Hide loading indicator if exists
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
        }
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    resetForm(formId) {
        const form = this.forms[formId];
        if (!form) return;
        
        form.element.reset();
        
        // Clear validation states
        Object.values(form.fields).forEach(field => {
            field.element.classList.remove('error', 'valid');
            
            const errorContainer = field.element.parentNode.querySelector('.error-message');
            if (errorContainer) {
                errorContainer.remove();
            }
        });
        
        form.isValid = false;
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    onFormSuccess(formId, result) {
        const form = this.forms[formId];
        if (!form) return;
        
        // Show success message
        StudentAtlas.showNotification(result.message || 'Success!', 'success');
        
        // Reset form if configured
        if (form.config?.resetOnSuccess) {
            setTimeout(() => {
                this.resetForm(formId);
            }, 1000);
        }
        
        // Redirect if specified
        if (form.config?.redirectOnSuccess) {
            setTimeout(() => {
                window.location.href = form.config.redirectUrl;
            }, 1500);
        }
        
        // Trigger success callback
        if (typeof form.config?.onSuccess === 'function') {
            form.config.onSuccess(result);
        }
        
        console.log(`Form ${formId} submitted successfully:`, result);
    }
    
    onFormError(formId, error) {
        const form = this.forms[formId];
        if (!form) return;
        
        // Show error message
        StudentAtlas.showNotification(error || 'Please check the form for errors.', 'error');
        
        // Trigger error callback
        if (typeof form.config?.onError === 'function') {
            form.config.onError(error);
        }
        
        console.error(`Form ${formId} submission error:`, error);
    }
    
    // ============================================
    // EVENT LISTENER SETUP
    // ============================================
    
    setupFormListeners(formId) {
        const form = this.forms[formId];
        if (!form) return;
        
        const formElement = form.element;
        
        // Real-time validation on input
        Object.values(form.fields).forEach(field => {
            field.element.addEventListener('input', () => {
                this.validateField(formId, field.element.name || field.element.id);
            });
            
            field.element.addEventListener('blur', () => {
                this.validateField(formId, field.element.name || field.element.id);
            });
        });
        
        // Form submission
        formElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitForm(formId);
        });
        
        // Store original button text
        const submitButton = formElement.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.setAttribute('data-original-text', submitButton.innerHTML);
        }
        
        console.log(`Form ${formId} listeners setup complete`);
    }
    
    validateField(formId, fieldName) {
        const form = this.forms[formId];
        if (!form || !form.fields[fieldName]) return;
        
        const field = form.fields[fieldName];
        
        // Run validation for this field
        this.validateFieldInstance(field);
        this.updateFieldUI(field);
        
        // Update form validity
        form.isValid = Object.values(form.fields).every(f => f.isValid);
        
        return field.isValid;
    }
    
    validateFieldInstance(field) {
        field.errors = [];
        field.isValid = true;
        
        // Required field validation
        if (field.required && !field.element.value.trim()) {
            field.errors.push('This field is required');
            field.isValid = false;
        }
        
        // Pattern validation
        if (field.pattern && field.element.value.trim()) {
            const regex = new RegExp(field.pattern);
            if (!regex.test(field.element.value)) {
                field.errors.push('Invalid format');
                field.isValid = false;
            }
        }
        
        // Email validation
        if (field.type === 'email' && field.element.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.element.value)) {
                field.errors.push('Invalid email address');
                field.isValid = false;
            }
        }
        
        return field.isValid;
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    initialize() {
        // Load existing submissions
        this.getSubmissions();
        
        console.log('FormHandler initialized');
    }
}

// Create global instance
window.formHandler = new FormHandler();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.formHandler) {
            window.formHandler.initialize();
        }
    });
} else {
    if (window.formHandler) {
        window.formHandler.initialize();
    }
}