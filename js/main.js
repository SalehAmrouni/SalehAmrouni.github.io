// Demo/info banners use same stacking logic as notifications (see showNotification function)
// ============================================
// MAIN.JS - SHARED FUNCTIONS FOR ALL PAGES
// ============================================

// Global State
const appState = {
    currentPage: 'landing',
    studentProfile: null,
    bookmarks: [],
    theme: 'dark',
    loggedIn: false,
    accessibility: {
        fontSize: 'normal',
        highContrast: false,
        colorBlindMode: 'normal',
        screenReader: false,
        dyslexiaFriendly: false,
        reducedMotion: false
    }
};

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    // Load saved state
    loadSavedState();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Apply saved theme
    applyTheme(appState.theme);
    
    // Apply accessibility settings
    applyAccessibilitySettings();
    
    // Load student profile
    loadStudentProfile();
    
    // Load bookmarks
    loadBookmarks();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update navigation visibility
    updateNavigation();
    
    console.log('Student Atlas initialized');
}

// ============================================
// STUDENT PROFILE MANAGEMENT
// ============================================

function loadStudentProfile() {
    // Try to get from sessionStorage (Zeus's interview)
    const savedProfile = sessionStorage.getItem('studentProfile');
    
    if (savedProfile) {
        appState.studentProfile = JSON.parse(savedProfile);
    } else {
        // Default demo profile for judges
        appState.studentProfile = {
            id: 'TSA Student 2026',
            username: 'tsa_student_2026',
            email: 'student@tsaatlas.org',
            // Profile name for Add an Ally page
            grade: 'TSA Student 2026', // Display name
            gradeLevel: 11, // Numeric grade for logic
            gpa: 3.8,
            serviceHours: 120,
            skills: ['STEM', 'Research', 'Leadership', 'Programming'],
            careerGoals: ['Engineering', 'Medicine'],
            leadershipRoles: ['Club President', 'Team Captain'],
            financialNeed: false,
            clusterMatch: 'STEM',
            matchScores: {}
        };
        
        // Save default profile
        sessionStorage.setItem('studentProfile', JSON.stringify(appState.studentProfile));
    }
}

function updateStudentProfile(updates) {
    appState.studentProfile = { ...appState.studentProfile, ...updates };
    sessionStorage.setItem('studentProfile', JSON.stringify(appState.studentProfile));
    
    // Recalculate match scores if opportunities data exists
    if (window.opportunitiesData) {
        calculateAllMatchScores();
    }
    
    return appState.studentProfile;
}

function getStudentProfile() {
    return appState.studentProfile;
}

// ============================================
// MATCH SCORING SYSTEM
// ============================================

function calculateMatchScore(opportunity) {
    if (!opportunity || !appState.studentProfile) return 0;
    
    const profile = appState.studentProfile;
    let score = 0;
    
    // GPA Match (25 points)
    if (opportunity.eligibility?.minGPA) {
        const gpaRatio = Math.min(profile.gpa / opportunity.eligibility.minGPA, 1);
        score += gpaRatio * 25;
    } else {
        score += 25;
    }
    
    // Grade Match (15 points)
    if (opportunity.eligibility?.grades && opportunity.eligibility.grades.length > 0) {
        const gradeNum = profile.gradeLevel;
        if (opportunity.eligibility.grades.includes(gradeNum)) {
            score += 15;
        } else {
            score += 5;
        }
    } else {
        score += 15;
    }
    
    // Service Hours Match (15 points)
    if (opportunity.eligibility?.hoursRequired) {
        if (profile.serviceHours >= opportunity.eligibility.hoursRequired) {
            score += 15;
        } else {
            const hoursRatio = Math.min(profile.serviceHours / opportunity.eligibility.hoursRequired, 1);
            score += hoursRatio * 15;
        }
    } else {
        score += 15;
    }
    
    // Skills Match (30 points)
    if (opportunity.eligibility?.skills && opportunity.eligibility.skills.length > 0) {
        const matchingSkills = opportunity.eligibility.skills.filter(skill => 
            profile.skills?.some(ps => ps.toLowerCase() === skill.toLowerCase()) ||
            profile.clusterMatch?.toLowerCase() === skill.toLowerCase()
        );
        const skillsRatio = matchingSkills.length / opportunity.eligibility.skills.length;
        score += skillsRatio * 30;
    } else {
        score += 30;
    }
    
    // Career Goals Match (10 points)
    if (opportunity.cluster) {
        if (profile.careerGoals?.some(goal => 
            goal.toLowerCase().includes(opportunity.cluster.toLowerCase()) ||
            goal.toLowerCase().includes('stem') && opportunity.cluster === 'STEM'
        )) {
            score += 10;
        }
    }
    
    // Cluster Match (5 points bonus)
    if (profile.clusterMatch && profile.clusterMatch === opportunity.cluster) {
        score += 5;
    }
    
    // Cap at 100
    return Math.min(Math.round(score), 100);
}

// ============================================
// ZEUS AI FUNCTIONS
// ============================================

function getZeusResponse(userMessage) {
    // Use the enhanced Zeus AI if available
    if (window.zeusAI) {
        return window.zeusAI.getResponse(userMessage);
    }
    // Fallback: generic message
    return "Hi! I'm Zeus, your AI counselor. How can I help you today?";
}

function calculateAllMatchScores() {
    if (!window.opportunitiesData || !appState.studentProfile) return;
    
    const scores = {};
    
    window.opportunitiesData.forEach(opportunity => {
        scores[opportunity.id] = calculateMatchScore(opportunity);
    });
    
    appState.studentProfile.matchScores = scores;
    sessionStorage.setItem('studentProfile', JSON.stringify(appState.studentProfile));
    
    return scores;
}

function getOpportunityMatchScore(opportunityId) {
    if (appState.studentProfile?.matchScores?.[opportunityId]) {
        return appState.studentProfile.matchScores[opportunityId];
    }
    
    const opportunity = window.opportunitiesData?.find(opp => opp.id === opportunityId);
    return calculateMatchScore(opportunity);
}

// ============================================
// BOOKMARKS MANAGEMENT
// ============================================

function loadBookmarks() {
    const saved = localStorage.getItem('studentAtlasBookmarks');
    appState.bookmarks = saved ? JSON.parse(saved) : [];
    return appState.bookmarks;
}

function saveBookmarks() {
    localStorage.setItem('studentAtlasBookmarks', JSON.stringify(appState.bookmarks));
}

function toggleBookmark(opportunityId) {
    const index = appState.bookmarks.indexOf(opportunityId);
    
    if (index === -1) {
        // Add to bookmarks
        appState.bookmarks.push(opportunityId);
        showNotification('Opportunity bookmarked!', 'success');
    } else {
        // Remove from bookmarks
        appState.bookmarks.splice(index, 1);
        showNotification('Bookmark removed', 'info');
    }
    
    saveBookmarks();
    
    // Update UI if on dashboard or profile page
    if (typeof updateBookmarkUI === 'function') {
        updateBookmarkUI(opportunityId);
    }
    
    return appState.bookmarks.includes(opportunityId);
}

function isBookmarked(opportunityId) {
    return appState.bookmarks.includes(opportunityId);
}

function getBookmarkedOpportunities() {
    if (!window.opportunitiesData) return [];
    return window.opportunitiesData.filter(opp => appState.bookmarks.includes(opp.id));
}

function clearBookmarks() {
    appState.bookmarks = [];
    localStorage.setItem('studentAtlasBookmarks', JSON.stringify([]));
    // Update UI immediately
    if (typeof loadBookmarks === 'function') loadBookmarks();
    // If on profile page, update count and empty state
    var bookmarkTotal = document.getElementById('bookmarkTotal');
    if (bookmarkTotal) bookmarkTotal.textContent = '0 bookmarks';
    var bookmarksList = document.getElementById('bookmarksList');
    if (bookmarksList) bookmarksList.innerHTML = '';
    var emptyBookmarks = document.getElementById('emptyBookmarks');
    if (emptyBookmarks) emptyBookmarks.style.display = 'block';
    showNotification('All bookmarks cleared', 'info');
}

// ============================================
// THEME & ACCESSIBILITY
// ============================================

function applyTheme(theme) {
    appState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studentAtlasTheme', theme);
}

function toggleTheme() {
    const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showNotification(`Switched to ${newTheme} theme`, 'info');
}

function applyAccessibilitySettings() {
    const { accessibility } = appState;
    
    // Font size
    document.body.classList.remove('large-text', 'extra-large-text');
    if (accessibility.fontSize === 'large') {
        document.body.classList.add('large-text');
    } else if (accessibility.fontSize === 'extra-large') {
        document.body.classList.add('extra-large-text');
    }
    
    // High contrast
    document.body.classList.toggle('high-contrast', accessibility.highContrast);
    
    // Color blind modes
    document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'grayscale', 'invert-colors');
    if (accessibility.colorBlindMode !== 'normal') {
        document.body.classList.add(accessibility.colorBlindMode);
    }
    
    // Dyslexia friendly
    document.body.classList.toggle('dyslexia-friendly', accessibility.dyslexiaFriendly);
    
    // Reduced motion
    document.body.classList.toggle('reduced-motion', accessibility.reducedMotion);
    
    // Screen reader (simulated)
    if (accessibility.screenReader) {
        document.body.setAttribute('aria-live', 'polite');
        document.body.setAttribute('role', 'document');
    } else {
        document.body.removeAttribute('aria-live');
        document.body.removeAttribute('role');
    }
    
    localStorage.setItem('studentAtlasAccessibility', JSON.stringify(accessibility));
}

function updateAccessibilitySetting(setting, value) {
    appState.accessibility[setting] = value;
    applyAccessibilitySettings();
    
    const settingNames = {
        fontSize: 'Font size',
        highContrast: 'High contrast',
        colorBlindMode: 'Color mode',
        screenReader: 'Screen reader',
        dyslexiaFriendly: 'Dyslexia font',
        reducedMotion: 'Reduced motion'
    };
    
    showNotification(`${settingNames[setting]} updated`, 'info');
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    // Special handling for demo/profile loaded/info banner notifications
    const isBanner = /demo profile loaded|ready to analyze your pathway|profile loaded|demo loaded|analyze your pathway/i.test(message);

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}` + (isBanner ? ' demo-banner' : '');
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');

    // Icon types
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    // Set styles based on banner or notification
    if (isBanner) {
        // Banners use normal document flow
        Object.assign(notification.style, {
            padding: '1rem 1.5rem',
            margin: '0.5rem 0',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `rgba(${type === 'success' ? '16, 185, 129' : 
                                   type === 'error' ? '239, 68, 68' : 
                                   type === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.98)`,
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: `2px solid rgba(${type === 'success' ? '16, 185, 129' : 
                                   type === 'error' ? '239, 68, 68' : 
                                   type === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 1)`
        });
    } else {
        // Notifications stay fixed in corner
        const existingNotifications = document.querySelectorAll('.notification:not(.demo-banner)');
        const notificationHeight = 100;
        const top = 100 + (existingNotifications.length * notificationHeight);
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: `${top}px`,
            right: '20px',
            zIndex: '9999',
            maxWidth: '350px',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `rgba(${type === 'success' ? '16, 185, 129' : 
                                   type === 'error' ? '239, 68, 68' : 
                                   type === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 0.98)`,
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: `2px solid rgba(${type === 'success' ? '16, 185, 129' : 
                                   type === 'error' ? '239, 68, 68' : 
                                   type === 'warning' ? '245, 158, 11' : '59, 130, 246'}, 1)`
        });
    }
    
    notification.innerHTML = `
        <i data-lucide="${icons[type]}" style="width: 1.25rem; height: 1.25rem;"></i>
        <span>${message}</span>
    `;
    
    // Add to appropriate container
    if (isBanner) {
        // Create banner container if it doesn't exist
        let bannerContainer = document.getElementById('banner-container');
        if (!bannerContainer) {
            bannerContainer = document.createElement('div');
            bannerContainer.id = 'banner-container';
            bannerContainer.style.cssText = 'width: 100%; display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 2rem; background: transparent; box-sizing: border-box;';
            document.body.insertBefore(bannerContainer, document.body.firstChild);
        }
        
        // Ensure banner has full width
        notification.style.width = '100%';
        notification.style.boxSizing = 'border-box';
        notification.style.maxWidth = 'none';
        
        bannerContainer.appendChild(notification);
    } else {
        document.body.appendChild(notification);
    }
    
    // Initialize icon
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                // Reposition remaining notifications
                repositionNotifications();
            }
        }, 300);
    }, 4000);
    
    // Add CSS animations if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function repositionNotifications() {
    // Only reposition regular notifications (not banners)
    const others = document.querySelectorAll('.notification:not(.demo-banner)');
    const baseTop = 100;
    let notifTop = baseTop;
    const notificationHeight = 100;
    others.forEach((notif, index) => {
        notif.style.top = `${notifTop}px`;
        notifTop += notificationHeight;
    });
}

// ============================================
// PAGE NAVIGATION
// ============================================

function navigateTo(page, params = {}) {
    // Store current page
    appState.currentPage = page;
    
    // Handle different page types
    switch(page) {
        case 'landing':
            window.location.href = 'index.html';
            break;
        case 'dashboard':
            appState.loggedIn = true;
            window.location.href = 'dashboard.html';
            break;
        case 'profile':
            appState.loggedIn = true;
            const tab = params.tab || 'profile';
            window.location.href = `profile.html#${tab}`;
            break;
        case 'submission':
            window.location.href = 'submission.html';
            break;
        default:
            console.warn(`Unknown page: ${page}`);
    }
}

function updateNavigation() {
    // Update active navigation based on current page
    const navElements = document.querySelectorAll('[data-nav-item]');
    navElements.forEach(el => {
        const targetPage = el.getAttribute('data-nav-item');
        el.classList.toggle('active', targetPage === appState.currentPage);
    });
    
    // Hide restricted navigation if not logged in
    const restrictedElements = document.querySelectorAll('.nav-restricted');
    restrictedElements.forEach(el => {
        el.style.display = appState.loggedIn ? 'block' : 'none';
    });
}

// ============================================
// FORM HANDLING
// ============================================

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            highlightInvalid(input);
        } else {
            removeHighlight(input);
        }
    });
    
    return isValid;
}

function highlightInvalid(element) {
    element.style.borderColor = 'var(--error)';
    element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Add error message if not present
    const errorId = `${element.id}-error`;
    if (!document.getElementById(errorId)) {
        const errorMsg = document.createElement('div');
        errorMsg.id = errorId;
        errorMsg.className = 'error-message';
        errorMsg.style.color = 'var(--error)';
        errorMsg.style.fontSize = '0.8rem';
        errorMsg.style.marginTop = '0.25rem';
        errorMsg.textContent = 'This field is required';
        element.parentNode.appendChild(errorMsg);
    }
}

function removeHighlight(element) {
    element.style.borderColor = '';
    element.style.boxShadow = '';
    
    // Remove error message
    const errorId = `${element.id}-error`;
    const errorMsg = document.getElementById(errorId);
    if (errorMsg) {
        errorMsg.remove();
    }
}

// ============================================
// DATA UTILITIES
// ============================================

function getClusterColor(cluster) {
    const clusterColors = {
        STEM: '#3b82f6',
        Arts: '#8b5cf6',
        Humanitarian: '#10b981',
        Civics: '#ef4444',
        Scholarships: '#f59e0b'
    };
    return clusterColors[cluster] || '#94a3b8';
}

function getClusterIcon(cluster) {
    const clusterIcons = {
        STEM: '🧪',
        Arts: '🎨',
        Humanitarian: '🤝',
        Civics: '🏛️',
        Scholarships: '💰'
    };
    return clusterIcons[cluster] || '📋';
}

function formatOpportunityCard(opportunity) {
    const matchScore = getOpportunityMatchScore(opportunity.id);
    const isBookmarkedFlag = isBookmarked(opportunity.id);
    const matchColor = matchScore >= 90 ? 'var(--success)' : 
                      matchScore >= 70 ? 'var(--warning)' : 'var(--error)';
    
    return `
        <div class="opportunity-card" data-id="${opportunity.id}">
            <div class="card-header">
                <div>
                    <span class="match-badge" style="background: ${matchColor}">
                        ${matchScore}% Match
                    </span>
                    <h4 class="card-title">${opportunity.title}</h4>
                    <p class="card-org">${opportunity.organization}</p>
                </div>
                <button class="save-btn ${isBookmarkedFlag ? 'saved' : ''}" 
                        onclick="StudentAtlas.toggleBookmark(${opportunity.id}); updateBookmarkUI(${opportunity.id})"
                        aria-label="${isBookmarkedFlag ? 'Remove bookmark' : 'Bookmark this opportunity'}">
                    <i data-lucide="${isBookmarkedFlag ? 'bookmark' : 'bookmark-plus'}"></i>
                </button>
            </div>
            
            <div class="card-details">
                <div class="detail-row">
                    <i data-lucide="map-pin"></i>
                    <span>${opportunity.location}</span>
                </div>
                <div class="detail-row">
                    <i data-lucide="dollar-sign"></i>
                    <span>${opportunity.cost}</span>
                </div>
                <div class="detail-row">
                    <i data-lucide="calendar"></i>
                    <span>${opportunity.duration}</span>
                </div>
                <div class="detail-row">
                    <i data-lucide="tag"></i>
                    <span style="color: ${getClusterColor(opportunity.cluster)}">
                        ${opportunity.cluster}
                    </span>
                </div>
            </div>
            
            <p class="text-dim">${opportunity.description.substring(0, 120)}...</p>
            
            <div class="flex gap-2 mt-3">
                <button class="btn btn-primary" style="flex: 2;" 
                        onclick="viewOpportunityDetails(${opportunity.id})">
                    View Details
                </button>
                <button class="btn btn-secondary" style="flex: 1;" 
                        onclick="window.open('${opportunity.link}', '_blank')"
                        ${matchScore < 70 ? 'disabled style="opacity: 0.5;"' : ''}
                        aria-label="${matchScore < 70 ? 'Review eligibility requirements first' : 'Apply now'}">
                    ${matchScore < 70 ? 'Review Eligibility' : 'Apply'}
                </button>
            </div>
        </div>
    `;
}

// ============================================
// STEVES AI FUNCTIONS
// ============================================

function getSteveResponse(userMessage) {
    // Use the enhanced Steve AI if available
    if (window.steveAI) {
        return window.steveAI.getResponse(userMessage);
    }
    
    // Fallback to simple responses
    const responses = {
        // STEM questions
        'stem': "We have 24 STEM opportunities including NASA internships, MIT research programs, and Google CS Institute. Filter by 'STEM' cluster to see them all!",
        'engineering': "For engineering, check out NASA OSTEM, Johns Hopkins Engineering Innovation, and MIT Beaver Works. Minimum GPA requirements vary from 3.0-3.8.",
        'computer science': "Google CS Summer Institute, Girls Who Code, and Microsoft High School Internship are great for CS. Some are virtual and free!",
        
        // Arts questions
        'arts': "We have 20 Arts opportunities from Interlochen Summer Program to NYU Tisch and RISD Pre-College. Filter by 'Arts' cluster.",
        'music': "For music, check out Interlochen, All-National Honor Ensembles, and Broadway Artists Alliance for musical theatre.",
        'film': "Berkeley Summer Youth Filmmaking, NYU Tisch, and Sundance Ignite Fellowship are excellent for aspiring filmmakers.",
        
        // Scholarships
        'scholarship': "24 scholarship programs including Gates Scholarship, Coca-Cola Scholars, and QuestBridge. Indicate financial need for best matches.",
        'financial aid': "Filter by 'Scholarships' cluster and indicate financial need in your profile. Many scholarships consider financial need.",
        'pay for college': "Check Gates Scholarship (full ride), QuestBridge, and Dell Scholars. Also look for STEM-specific scholarships.",
        
        // Application help
        'apply': "Each opportunity card has an 'Apply' button. Make sure your profile is complete for eligibility matching.",
        'deadline': "Most summer programs have deadlines Jan-Mar. Scholarships vary but many are due in fall for following year.",
        'recommendation letter': "Ask teachers 1 month before deadlines. Provide them with your resume and specific examples of your work.",
        
        // General
        'hello': "Hi! I'm Zeus, your AI counselor. I can help you find opportunities, answer application questions, or provide advice.",
        'help': "I can help with: 1) Finding opportunities by cluster 2) Application tips 3) Eligibility questions 4) Scholarship search",
        'thank': "You're welcome! Let me know if you need more help finding your perfect opportunity."
    };
    
    const message = userMessage.toLowerCase();
    
    // Check for keywords
    for (const [keyword, response] of Object.entries(responses)) {
        if (message.includes(keyword)) {
            return response;
        }
    }
    
    // Default response
    return "I can help you find opportunities! Try asking about specific clusters (STEM, Arts, etc.), application tips, or scholarship information.";
}

// ============================================
// STORAGE MANAGEMENT
// ============================================

function loadSavedState() {
    // Load theme
    const savedTheme = localStorage.getItem('studentAtlasTheme');
    if (savedTheme) {
        appState.theme = savedTheme;
    }
    
    // Load accessibility settings
    const savedAccessibility = localStorage.getItem('studentAtlasAccessibility');
    if (savedAccessibility) {
        appState.accessibility = { ...appState.accessibility, ...JSON.parse(savedAccessibility) };
    }
    
    // Load bookmarks
    loadBookmarks();
}

function clearAllData() {
    localStorage.clear();
    sessionStorage.clear();
    appState.bookmarks = [];
    appState.studentProfile = null;
    showNotification('All data cleared', 'info');
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Accessibility controls
    const accessibilityControls = {
        'fontIncrease': () => updateAccessibilitySetting('fontSize', 
            appState.accessibility.fontSize === 'normal' ? 'large' : 'extra-large'),
        'fontDecrease': () => updateAccessibilitySetting('fontSize', 'normal'),
        'highContrast': () => updateAccessibilitySetting('highContrast', !appState.accessibility.highContrast),
        'screenReader': () => updateAccessibilitySetting('screenReader', !appState.accessibility.screenReader)
    };
    
    Object.entries(accessibilityControls).forEach(([id, handler]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', handler);
        }
    });
    
    // Color blind mode selector
    const colorBlindSelect = document.getElementById('colorBlindMode');
    if (colorBlindSelect) {
        colorBlindSelect.addEventListener('change', (e) => {
            updateAccessibilitySetting('colorBlindMode', e.target.value);
        });
    }
    
    // Global escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
            });
            
            // Close profile menu
            const profileMenu = document.getElementById('profileMenu');
            if (profileMenu) {
                profileMenu.classList.add('hidden');
            }
        }
    });
}

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

// Make functions available globally
window.StudentAtlas = {
    // State
    state: appState,
    
    // Profile functions
    loadStudentProfile,
    updateStudentProfile,
    getStudentProfile,
    
    // Match scoring
    calculateMatchScore,
    calculateAllMatchScores,
    getOpportunityMatchScore,
    
    // Bookmarks
    loadBookmarks,
    toggleBookmark,
    isBookmarked,
    getBookmarkedOpportunities,
    clearBookmarks,
    
    // Theme & Accessibility
    applyTheme,
    toggleTheme,
    applyAccessibilitySettings,
    updateAccessibilitySetting,
    
    // Navigation
    navigateTo,
    updateNavigation,
    
    // Notifications
    showNotification,
    
    // Forms
    validateForm,
    
    // Data utilities
    getClusterColor,
    getClusterIcon,
    formatOpportunityCard,
    
    // Zeus AI
    getZeusResponse,
    
    // Storage
    clearAllData,
    
    // Initialization
    initializeApp
};

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}