// ============================================
// filters.js
// Filtering and search functionality for dashboard
// ============================================

class OpportunityFilters {
    constructor() {
        this.currentFilters = {
            search: '',
            cluster: 'all',
            cost: 'all',
            location: 'all',
            duration: 'all',
            match: 'all',
            sortBy: 'match' // match, deadline, name
        };
        
        this.filteredOpportunities = [];
        this.opportunities = window.opportunitiesData || [];
    }
    
    // ============================================
    // MAIN FILTERING FUNCTION
    // ============================================
    
    applyAllFilters() {
        if (!this.opportunities.length) {
            this.filteredOpportunities = [];
            return [];
        }
        
        // Start with all opportunities
        let results = [...this.opportunities];
        
        // Apply each filter in sequence
        results = this.applySearchFilter(results);
        results = this.applyClusterFilter(results);
        results = this.applyCostFilter(results);
        results = this.applyLocationFilter(results);
        results = this.applyDurationFilter(results);
        results = this.applyMatchFilter(results);
        results = this.sortResults(results);
        
        this.filteredOpportunities = results;
        return results;
    }
    
    // ============================================
    // INDIVIDUAL FILTER FUNCTIONS
    // ============================================
    
    applySearchFilter(opportunities) {
        if (!this.currentFilters.search) return opportunities;
        
        const searchTerm = this.currentFilters.search.toLowerCase();
        
        return opportunities.filter(opp => {
            return opp.title.toLowerCase().includes(searchTerm) ||
                   opp.organization.toLowerCase().includes(searchTerm) ||
                   opp.description.toLowerCase().includes(searchTerm) ||
                   opp.cluster.toLowerCase().includes(searchTerm) ||
                   (opp.eligibility?.skills?.some(skill => 
                       skill.toLowerCase().includes(searchTerm)
                   ));
        });
    }
    
    applyClusterFilter(opportunities) {
        if (this.currentFilters.cluster === 'all') return opportunities;
        
        return opportunities.filter(opp => 
            opp.cluster === this.currentFilters.cluster
        );
    }
    
    applyCostFilter(opportunities) {
        if (this.currentFilters.cost === 'all') return opportunities;
        
        return opportunities.filter(opp => {
            const oppCost = opp.cost.toLowerCase();
            
            switch(this.currentFilters.cost) {
                case 'Free':
                    return oppCost === 'free' || oppCost.includes('free');
                case 'Paid':
                    return oppCost === 'paid' || oppCost.includes('paid');
                case 'Scholarship':
                    return oppCost.includes('scholarship');
                case 'Stipend':
                    return oppCost.includes('stipend');
                default:
                    return true;
            }
        });
    }
    
    applyLocationFilter(opportunities) {
        if (this.currentFilters.location === 'all') return opportunities;
        
        return opportunities.filter(opp => {
            const oppLocation = opp.location.toLowerCase();
            
            switch(this.currentFilters.location) {
                case 'Virtual':
                    return oppLocation.includes('virtual') || 
                           oppLocation.includes('online');
                case 'National':
                    return oppLocation === 'national' || 
                           oppLocation.includes('nationwide');
                case 'Local':
                    return oppLocation.includes('local') || 
                           oppLocation.includes('regional');
                case 'International':
                    return oppLocation.includes('international') || 
                           oppLocation.includes('global');
                default:
                    return true;
            }
        });
    }
    
    applyDurationFilter(opportunities) {
        if (this.currentFilters.duration === 'all') return opportunities;
        
        return opportunities.filter(opp => {
            const oppDuration = opp.duration.toLowerCase();
            
            switch(this.currentFilters.duration) {
                case 'Summer':
                    return oppDuration.includes('summer');
                case 'Academic Year':
                    return oppDuration.includes('academic') || 
                           oppDuration.includes('year');
                case 'Short Term':
                    return oppDuration.includes('short') || 
                           oppDuration.includes('week') ||
                           oppDuration.includes('month');
                case 'Long Term':
                    return oppDuration.includes('long') || 
                           oppDuration.includes('year') ||
                           oppDuration.includes('months');
                default:
                    return true;
            }
        });
    }
    
    applyMatchFilter(opportunities) {
        if (this.currentFilters.match === 'all') return opportunities;
        
        return opportunities.filter(opp => {
            const matchScore = StudentAtlas.getOpportunityMatchScore(opp.id);
            
            switch(this.currentFilters.match) {
                case 'eligible':
                    return matchScore >= 70;
                case '90':
                    return matchScore >= 90;
                case '80':
                    return matchScore >= 80;
                case '70':
                    return matchScore >= 70;
                default:
                    return true;
            }
        });
    }
    
    // ============================================
    // SORTING FUNCTIONS
    // ============================================
    
    sortResults(opportunities) {
        switch(this.currentFilters.sortBy) {
            case 'match':
                return this.sortByMatchScore(opportunities);
            case 'deadline':
                return this.sortByDeadline(opportunities);
            case 'name':
                return this.sortByName(opportunities);
            default:
                return opportunities;
        }
    }
    
    sortByMatchScore(opportunities) {
        return [...opportunities].sort((a, b) => {
            const scoreA = StudentAtlas.getOpportunityMatchScore(a.id);
            const scoreB = StudentAtlas.getOpportunityMatchScore(b.id);
            return scoreB - scoreA; // Descending
        });
    }
    
    sortByName(opportunities) {
        return [...opportunities].sort((a, b) => 
            a.title.localeCompare(b.title)
        );
    }
    
    sortByDeadline(opportunities) {
        // For demo, we'll sort by duration length
        return [...opportunities].sort((a, b) => {
            const durationA = this.getDurationPriority(a.duration);
            const durationB = this.getDurationPriority(b.duration);
            return durationA - durationB;
        });
    }
    
    getDurationPriority(duration) {
        const dur = duration.toLowerCase();
        if (dur.includes('week')) return 1;
        if (dur.includes('month')) return 2;
        if (dur.includes('summer')) return 3;
        if (dur.includes('academic') || dur.includes('year')) return 4;
        return 5; // longest/default
    }
    
    // ============================================
    // FILTER MANAGEMENT
    // ============================================
    
    updateFilter(filterName, value) {
        this.currentFilters[filterName] = value;
        this.saveFilters();
        return this.applyAllFilters();
    }
    
    clearAllFilters() {
        this.currentFilters = {
            search: '',
            cluster: 'all',
            cost: 'all',
            location: 'all',
            duration: 'all',
            match: 'all',
            sortBy: 'match'
        };
        
        this.saveFilters();
        return this.applyAllFilters();
    }
    
    saveFilters() {
        localStorage.setItem('dashboardFilters', JSON.stringify(this.currentFilters));
    }
    
    loadFilters() {
        const saved = localStorage.getItem('dashboardFilters');
        if (saved) {
            try {
                this.currentFilters = { ...this.currentFilters, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading saved filters:', e);
            }
        }
        
        // Update UI elements if they exist
        this.updateFilterUI();
        
        return this.currentFilters;
    }
    
    updateFilterUI() {
        // Update search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = this.currentFilters.search;
        }
        
        // Update select elements
        const filterElements = {
            'filterCluster': 'cluster',
            'filterCost': 'cost',
            'filterLocation': 'location',
            'filterDuration': 'duration',
            'filterMatch': 'match'
        };
        
        Object.entries(filterElements).forEach(([elementId, filterName]) => {
            const element = document.getElementById(elementId);
            if (element && this.currentFilters[filterName]) {
                element.value = this.currentFilters[filterName];
            }
        });
    }
    
    // ============================================
    // STATISTICS
    // ============================================
    
    getFilterStats(opportunities = this.filteredOpportunities) {
        const stats = {
            total: opportunities.length,
            eligible: 0,
            averageMatch: 0,
            clusterBreakdown: {},
            costBreakdown: {}
        };
        
        let totalMatch = 0;
        
        opportunities.forEach(opp => {
            const matchScore = StudentAtlas.getOpportunityMatchScore(opp.id);
            
            // Count eligible
            if (matchScore >= 70) stats.eligible++;
            
            // Sum for average
            totalMatch += matchScore;
            
            // Cluster breakdown
            stats.clusterBreakdown[opp.cluster] = 
                (stats.clusterBreakdown[opp.cluster] || 0) + 1;
            
            // Cost breakdown
            const costKey = opp.cost.split(' ')[0]; // Get first word
            stats.costBreakdown[costKey] = 
                (stats.costBreakdown[costKey] || 0) + 1;
        });
        
        // Calculate average
        stats.averageMatch = opportunities.length > 0 ? 
            Math.round(totalMatch / opportunities.length) : 0;
        
        return stats;
    }
    
    // ============================================
    // RENDER FUNCTIONS
    // ============================================
    
    renderFilteredOpportunities(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const opportunities = this.filteredOpportunities;
        
        if (opportunities.length === 0) {
            container.innerHTML = this.renderNoResults();
            return;
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Add each opportunity card
        opportunities.forEach(opp => {
            const card = this.createOpportunityCard(opp);
            container.appendChild(card);
        });
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    createOpportunityCard(opportunity) {
        const matchScore = StudentAtlas.getOpportunityMatchScore(opportunity.id);
        const isBookmarked = StudentAtlas.isBookmarked(opportunity.id);
        const matchColor = this.getMatchColor(matchScore);
        
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.setAttribute('data-id', opportunity.id);
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="match-badge" style="background: ${matchColor}">
                        ${matchScore}% Match
                    </span>
                    <h4 class="card-title">${opportunity.title}</h4>
                    <p class="card-org">${opportunity.organization}</p>
                </div>
                <button class="save-btn ${isBookmarked ? 'saved' : ''}" 
                        onclick="StudentAtlas.toggleBookmark(${opportunity.id})"
                        aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark this opportunity'}">
                    <i data-lucide="${isBookmarked ? 'bookmark' : 'bookmark-plus'}"></i>
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
                    <span style="color: ${StudentAtlas.getClusterColor(opportunity.cluster)}">
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
        `;
        
        return card;
    }
    
    renderNoResults() {
        return `
            <div class="no-results text-center p-8">
                <i data-lucide="search-x" style="width: 4rem; height: 4rem; color: var(--text-dim); margin-bottom: 1rem;"></i>
                <h3>No Opportunities Found</h3>
                <p class="text-dim mb-4">Try adjusting your filters or search terms.</p>
                <button class="btn btn-primary" onclick="window.filterManager.clearAllFilters()">
                    <i data-lucide="refresh-ccw"></i> Clear All Filters
                </button>
            </div>
        `;
    }
    
    renderFilterStats(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = this.getFilterStats();
        const totalCount = document.getElementById('totalCount');
        const eligibleCount = document.getElementById('eligibleCount');
        const avgMatch = document.getElementById('avgMatch');
        const resultCount = document.getElementById('resultCount');
        
        if (totalCount) totalCount.textContent = window.opportunitiesData?.length || 0;
        if (eligibleCount) eligibleCount.textContent = stats.eligible;
        if (avgMatch) avgMatch.textContent = `${stats.averageMatch}%`;
        if (resultCount) {
            resultCount.textContent = `Showing ${stats.total} of ${window.opportunitiesData?.length || 0} opportunities`;
        }
        
        // Update bookmark count
        const bookmarkCount = document.getElementById('bookmarkCount');
        if (bookmarkCount) {
            bookmarkCount.textContent = StudentAtlas.state.bookmarks.length;
        }
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    getMatchColor(score) {
        if (score >= 90) return 'var(--success)';
        if (score >= 70) return 'var(--warning)';
        return 'var(--error)';
    }
    
    // ============================================
    // EVENT HANDLER SETUP
    // ============================================
    
    setupFilterListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.updateFilter('search', e.target.value);
                    this.renderFilteredOpportunities('directoryGrid');
                    this.renderFilterStats('statsContainer');
                }, 300);
            });
        }
        
        // Filter selects
        const filterSelects = {
            'filterCluster': 'cluster',
            'filterCost': 'cost',
            'filterLocation': 'location',
            'filterDuration': 'duration',
            'filterMatch': 'match'
        };
        
        Object.entries(filterSelects).forEach(([elementId, filterName]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.updateFilter(filterName, e.target.value);
                    this.renderFilteredOpportunities('directoryGrid');
                    this.renderFilterStats('statsContainer');
                });
            }
        });
        
        // Sort by buttons
        const sortButtons = {
            'sortMatch': 'match',
            'sortName': 'name',
            'sortDeadline': 'deadline'
        };
        
        Object.entries(sortButtons).forEach(([buttonId, sortType]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    this.updateFilter('sortBy', sortType);
                    this.renderFilteredOpportunities('directoryGrid');
                });
            }
        });
        
        // Clear filters button
        const clearButton = document.getElementById('clearFilters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
                this.renderFilteredOpportunities('directoryGrid');
                this.renderFilterStats('statsContainer');
                StudentAtlas.showNotification('All filters cleared', 'info');
            });
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    initialize() {
        // Wait for opportunities data to load
        if (!window.opportunitiesData) {
            console.warn('Opportunities data not loaded yet. Retrying...');
            setTimeout(() => this.initialize(), 500);
            return;
        }
        
        // Load saved filters
        this.loadFilters();
        
        // Apply filters and render initial view
        this.applyAllFilters();
        
        // Set up event listeners
        this.setupFilterListeners();
        
        // Render initial results
        this.renderFilteredOpportunities('directoryGrid');
        this.renderFilterStats('statsContainer');
        
        console.log('OpportunityFilters initialized');
    }
}

// Create global instance
window.filterManager = new OpportunityFilters();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.filterManager) {
            window.filterManager.initialize();
        }
    });
} else {
    if (window.filterManager) {
        window.filterManager.initialize();
    }
}