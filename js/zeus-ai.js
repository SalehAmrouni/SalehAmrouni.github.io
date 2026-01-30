// ============================================
// ai.js
// AI Counselor functionality
// ============================================

class ZeusAI {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
        this.responses = this.initializeResponses();
        this.context = {};
        this.lastOffer = null; // Track last offered topic or suggestion
        this.hasGreeted = false; // Track if greeting has been sent
        this.greetings = [
            "Hey there!",
            "Hi, friend!",
            "Welcome back!",
            "Hello!",
            "Nice to see you!",
            "How can I help today?",
            "Glad you're here!",
            "Ready to explore?",
            "Let's get started!",
            "What can I do for you?"
        ];
        this.closings = [
            "Let me know if you have more questions!",
            "Anything else I can help with?",
            "I'm here if you need more info.",
            "Feel free to ask anything else!",
            "Let’s keep the conversation going!"
        ];
        this.followUps = [
            "Does that program fit your schedule, or should we look for something shorter?",
            "Would you like more details on that?",
            "Should I suggest similar opportunities?",
            "Is there a specific deadline you’re aiming for?",
            "Want to see more options like this?"
        ];
    }
    
    // ============================================
    // RESPONSE DATABASE
    // ============================================
    
    initializeResponses() {
        return {
            // Greetings
            greetings: [
                "Hi! I'm Zeus, your AI counselor. I can help you find opportunities, answer application questions, or provide advice. What are you looking for today?",
                "Hello! I'm Zeus. I'm here to help you navigate the 80+ opportunities in Student Atlas. Ready to explore some matches?",
                "Hey there! Zeus here. I can help you discover opportunities that match your interests and skills. What type of experience interests you?",
                "Greetings! I'm Zeus, your friendly AI guide to amazing opportunities. I can help you find the perfect match for your goals and schedule.",
                "Hi there! Zeus at your service. Let's find some awesome opportunities together! Tell me about your interests or what you're looking for."
            ],
            
            // Common questions
            opportunities: [
                "We have opportunities across 5 clusters: STEM (24), Arts (20), Humanitarian (15), Civics (20), and Scholarships (21).",
                "You can filter opportunities by cluster, cost, location, duration, and match score in the dashboard.",
                "Each opportunity card shows match score based on your profile. Green = good match, Yellow = moderate, Red = review eligibility.",
                "Browse by cluster to see opportunities that match your interests and skills.",
                "Use the filters to narrow down opportunities that fit your schedule and budget."
            ],
            
            // STEM specific
            stem: [
                "For STEM, we have NASA internships, MIT research programs, Google CS Institute, and 21 more opportunities.",
                "STEM opportunities require strong math/science skills. Minimum GPA ranges from 3.0-3.8 for competitive programs.",
                "Many STEM programs offer paid positions or stipends. Look for 'Paid' or 'Stipend Available' in the cost filter."
            ],
            
            // Arts specific
            arts: [
                "Arts cluster includes Interlochen Summer Program, NYU Tisch, RISD Pre-College, and 17 more creative opportunities.",
                "Some arts programs require portfolio submissions. Start preparing early!",
                "Look for 'Free' or 'Scholarship' in the cost filter for arts programs with financial aid."
            ],
            
            // Scholarships
            scholarships: [
                "We track 21 major scholarships including Gates Scholarship, Coca-Cola Scholars, and QuestBridge.",
                "Many scholarships have early deadlines (Sept-Nov for following year). Start preparing now!",
                "Scholarships consider GPA, leadership, service hours, and financial need. Make sure your profile is complete."
            ],
            
            // Application help
            applications: [
                "Start applications 6-9 months before deadlines. Competitive programs fill up fast!",
                "Customize your essays for each application. Show specific interest in that program.",
                "Ask for recommendation letters 1 month before deadlines. Provide teachers with your resume and specific examples.",
                "Proofread everything! Typos and errors create a negative impression."
            ],
            
            // Profile questions
            profile: [
                "Your match scores update automatically when you edit your profile in the Profile tab.",
                "Bookmark opportunities you're interested in to save them for later review.",
                "Export your National Blueprint as a PDF to share with counselors or parents."
            ],
            
            // Match score questions
            matches: [
                "Match scores are calculated based on your GPA, grade level, skills, and career interests.",
                "90%+ match means you meet all requirements and align well with the program goals.",
                "Below 70% means you should review eligibility requirements or consider similar opportunities."
            ],
            
            // General advice
            advice: [
                "Apply to 3-5 safety programs, 3-5 target programs, and 2-3 reach programs.",
                "Keep a spreadsheet to track application deadlines, requirements, and submission status.",
                "Follow up on applications with a polite email if you haven't heard back in 4-6 weeks.",
                "Practice interview questions with a friend or family member for competitive programs."
            ],
            
            // Inappropriate content
            inappropriate: [
                "Hey, we can't talk about that here. Let's keep the conversation focused on opportunities and career development.",
                "I'm sorry, but I can't discuss inappropriate topics. I'm here to help with educational opportunities and advice.",
                "That's not appropriate for this conversation. Let's talk about STEM opportunities, scholarships, or application tips instead.",
                "I need to keep things professional. What questions do you have about opportunities or your profile?",
                "Let's stay on topic with career development and opportunities. What can I help you with regarding that?"
            ],
            
            // Feedback and suggestions
            feedback: [
                "Thanks for the feedback! I'm always learning how to better help students find their perfect opportunities.",
                "I appreciate you letting me know. Your suggestions help me improve my recommendations.",
                "That's helpful to know! I'll use this to provide even better guidance in the future.",
                "Thanks for sharing your thoughts. I'm designed to help with career opportunities - what specific improvements would you suggest?"
            ],
            
            // Error/default responses
            unknown: [
                "I'm not entirely sure what you mean, but I'd love to help! Could you tell me more about what you're looking for?",
                "That's an interesting question! Are you asking about opportunities, applications, scholarships, or something else?",
                "I want to make sure I give you the best advice possible. Could you rephrase that or give me more context?",
                "I'm here to help with career opportunities and applications. What specific aspect can I assist you with?",
                "Let me know more details and I'll provide targeted guidance for your situation."
            ]
        };
    }
    
    // ============================================
    // ADVANCED CONVERSATION MANAGEMENT
    // ============================================
    
    analyzeConversationContext() {
        if (this.conversationHistory.length < 2) return {};
        
        const recentMessages = this.conversationHistory.slice(-6); // Last 3 exchanges
        const context = {
            topics: new Set(),
            userInterests: [],
            askedQuestions: [],
            providedInfo: [],
            sentiment: 'neutral'
        };
        
        recentMessages.forEach(msg => {
            const text = msg.message.toLowerCase();
            
            // Track topics discussed
            if (text.includes('stem') || text.includes('science') || text.includes('tech')) context.topics.add('STEM');
            if (text.includes('art') || text.includes('music') || text.includes('creative')) context.topics.add('Arts');
            if (text.includes('scholarship') || text.includes('money') || text.includes('financial')) context.topics.add('Scholarships');
            if (text.includes('application') || text.includes('apply') || text.includes('deadline')) context.topics.add('Applications');
            
            // Track user interests
            if (msg.role === 'user') {
                if (text.includes('interested in') || text.includes('like') || text.includes('want')) {
                    context.userInterests.push(text);
                }
                if (text.includes('?')) context.askedQuestions.push(text);
            } else {
                context.providedInfo.push(text);
            }
        });
        
        return context;
    }
    
    generateContextualResponse(userMessage, category, baseResponse) {
        const context = this.analyzeConversationContext();
        let enhancedResponse = baseResponse;
        
        // Add continuity based on previous topics
        if (context.topics.has('STEM') && category === 'applications') {
            enhancedResponse += "\n\nSince you're interested in STEM, remember that many programs require strong math/science recommendations.";
        }
        
        if (context.topics.has('Scholarships') && category === 'profile') {
            enhancedResponse += "\n\nFor scholarships, having detailed service hours and leadership roles in your profile really helps.";
        }
        
        // Add follow-up suggestions
        if (Math.random() < 0.4) { // 40% chance
            const followUps = {
                greeting: ["What type of opportunities are you most interested in?", "Have you checked your match scores yet?"],
                opportunities: ["Would you like me to suggest specific programs in a cluster?", "Have you updated your profile for better matches?"],
                applications: ["Do you need help with recommendation letters?", "Have you started preparing your essays?"],
                scholarships: ["Are you eligible for need-based aid?", "Have you considered local scholarships too?"],
                profile: ["Want me to explain how match scores work?", "Have you added your service hours?"]
            };
            
            const suggestions = followUps[category] || ["Is there anything specific you'd like to know more about?"];
            enhancedResponse += "\n\n" + suggestions[Math.floor(Math.random() * suggestions.length)];
        }
        
        // Add personalized touches based on profile
        const profile = StudentAtlas.getStudentProfile();
        if (profile) {
            if (profile.gpa && category === 'opportunities') {
                if (profile.gpa >= 3.8) {
                    enhancedResponse += "\n\nWith your excellent GPA, you're eligible for the most competitive programs!";
                } else if (profile.gpa >= 3.5) {
                    enhancedResponse += "\n\nYour GPA opens doors to many great opportunities!";
                }
            }
            
            if (profile.clusterMatch && !enhancedResponse.includes(profile.clusterMatch)) {
                enhancedResponse += `\n\nBased on your interests, you might particularly enjoy ${profile.clusterMatch} opportunities.`;
            }
        }
        
        return enhancedResponse;
    }
    
    analyzeMessage(message) {
        const msg = message.toLowerCase().trim();
        
        // Check for inappropriate content first
        const inappropriateKeywords = ['sex', 'porn', 'nude', 'naked', 'fuck', 'shit', 'damn', 'ass', 'bitch', 'drug', 'weed', 'alcohol', 'beer', 'violence', 'kill', 'hate', 'racist', 'sexist', 'offensive', 'inappropriate', 'nsfw', 'adult'];
        if (inappropriateKeywords.some(keyword => msg.includes(keyword))) {
            return 'inappropriate';
        }
        
        // Define categories and their keywords
        const categories = {
            greeting: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'what\'s up', 'howdy', 'hiya'],
            stem: ['stem', 'science', 'tech', 'engineering', 'math', 'programming', 'computer', 'robotics', 'physics', 'chemistry', 'biology', 'coding', 'software', 'ai', 'machine learning', 'data', 'research', 'nasa', 'google', 'microsoft'],
            arts: ['art', 'music', 'dance', 'theater', 'film', 'writing', 'creative', 'design', 'photography', 'painting', 'sculpture', 'acting', 'performance', 'media', 'graphic design', 'animation'],
            humanitarian: ['service', 'volunteer', 'humanitarian', 'community', 'non-profit', 'help', 'charity', 'social work', 'activism', 'environment', 'sustainability', 'peace corps', 'red cross'],
            civics: ['government', 'politics', 'law', 'debate', 'leadership', 'model un', 'civics', 'policy', 'democracy', 'voting', 'campaign', 'public service', 'international relations'],
            scholarships: ['scholarship', 'financial aid', 'money', 'pay', 'tuition', 'cost', 'expensive', 'funding', 'grants', 'fellowships', 'bursaries', 'awards'],
            applications: ['apply', 'application', 'deadline', 'essay', 'recommendation', 'letter', 'submit', 'interview', 'portfolio', 'resume', 'cv', 'transcript'],
            profile: ['profile', 'match', 'score', 'bookmark', 'gpa', 'grade', 'hours', 'skills', 'interests', 'career', 'goals', 'blueprint'],
            help: ['help', 'what can you do', 'how to', 'tips', 'advice', 'suggest', 'guide', 'tutorial', 'explain', 'assist'],
            thanks: ['thank', 'thanks', 'appreciate', 'helpful', 'grateful', 'awesome'],
            feedback: ['feedback', 'suggestion', 'improve', 'better', 'like', 'dislike', 'works', 'doesn\'t work']
        };
        
        // Find matching category
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => msg.includes(keyword))) {
                return category;
            }
        }
        
        return 'unknown';
    }
    
    // ============================================
    // ADVANCED NLP FEATURES
    // ============================================
    
    detectIntent(message) {
        const msg = message.toLowerCase().trim();
        const intents = {
            clarification: ['what do you mean', 'explain', 'clarify', 'not sure', 'confused', 'don\'t understand'],
            comparison: ['vs', 'versus', 'compare', 'better', 'which is', 'difference between'],
            specific_help: ['how do i', 'what should i', 'can you help me', 'i need help with'],
            opinion: ['what do you think', 'recommend', 'suggest', 'best'],
            urgency: ['urgent', 'asap', 'deadline', 'soon', 'quickly', 'rush']
        };
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => msg.includes(keyword))) {
                return intent;
            }
        }
        
        return null;
    }
    
    generateClarificationRequest(userMessage) {
        const msg = userMessage.toLowerCase();
        
        if (msg.includes('stem') && !msg.includes('specific')) {
            return "I'd be happy to help with STEM opportunities! Are you interested in a specific field like engineering, computer science, or research? Or would you like an overview of all STEM programs?";
        }
        
        if (msg.includes('scholarship') && !msg.includes('type')) {
            return "There are many types of scholarships! Are you looking for merit-based, need-based, or subject-specific scholarships? Do you have any particular criteria?";
        }
        
        if (msg.includes('apply') && msg.length < 20) {
            return "I'd love to help with your application! Are you asking about deadlines, essays, recommendations, or the application process in general?";
        }
        
        return "I'd love to help, but could you give me a bit more detail about what you're looking for? For example, are you interested in STEM, Arts, scholarships, or something else?";
    }
    
    handleIntent(intent, userMessage, baseResponse) {
        switch (intent) {
            case 'clarification':
                return "Let me clarify that for you. " + baseResponse;
                
            case 'comparison':
                return baseResponse + "\n\nWhen comparing options, consider factors like your interests, skills, timeline, and eligibility requirements.";
                
            case 'specific_help':
                return "I can definitely help with that! " + baseResponse + "\n\nWould you like me to walk you through the specific steps?";
                
            case 'opinion':
                return "Based on what I know about opportunities, " + baseResponse.toLowerCase();
                
            case 'urgency':
                return "I understand this is time-sensitive! " + baseResponse + "\n\nLet's prioritize getting you the information you need quickly.";
                
            default:
                return baseResponse;
        }
    }
    
    // ============================================
    // RESPONSE GENERATION
    // ============================================
    
    generateResponse(userMessage, userProfile = null) {
        // Check for affirmative responses to previous offers
        if (this.detectAffirmativeResponse(userMessage)) {
            const lastOffer = this.getLastOffer();
            if (lastOffer) {
                const followUpResponse = this.generateFollowUpResponse(lastOffer);
                
                // Add to conversation history
                this.conversationHistory.push({
                    role: 'user',
                    message: userMessage,
                    timestamp: new Date().toISOString()
                });
                
                this.conversationHistory.push({
                    role: 'zeus',
                    message: followUpResponse,
                    timestamp: new Date().toISOString()
                });
                
                this.saveConversation();
                return followUpResponse;
            }
        }
        
        const category = this.analyzeMessage(userMessage);
        const intent = this.detectIntent(userMessage);
        
        // Handle inappropriate content first
        if (category === 'inappropriate') {
            const responses = this.responses.inappropriate;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Check if message needs clarification
        if (category === 'unknown' && userMessage.length < 10) {
            return this.generateClarificationRequest(userMessage);
        }
        
        const responses = this.responses[category] || this.responses.unknown;
        
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        });
        
        // Select random response from category
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        // Handle detected intent
        if (intent) {
            response = this.handleIntent(intent, userMessage, response);
        }
        
        // Add random personality elements
        const emojis = ['🚀', '💡', '🎯', '⭐', '🔥', '💪', '🎉', '📚', '🎨', '🌟'];
        const personalityPhrases = [
            'Awesome question!',
            'Great choice!',
            'I love helping with that!',
            'Let me break this down for you.',
            'Here\'s what you need to know:',
            'You\'re on the right track!',
            'That\'s a smart question.',
            'I\'m excited to help!'
        ];
        
        // Randomly add personality (30% chance)
        if (Math.random() < 0.3) {
            response = personalityPhrases[Math.floor(Math.random() * personalityPhrases.length)] + ' ' + response;
        }
        
        // Randomly add emoji (20% chance)
        if (Math.random() < 0.2) {
            response += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
        }
        
        // Personalize response if profile available
        if (userProfile) {
            response = this.personalizeResponse(response, userProfile);
        }
        
        // Add contextual enhancements
        response = this.generateContextualResponse(userMessage, category, response);
        
        // Add context from current message
        response = this.addContext(response, userMessage);
        
        // Add proactive suggestions occasionally
        if (Math.random() < 0.25) { // 25% chance
            const suggestion = this.generateProactiveSuggestion();
            if (suggestion) {
                response += "\n\n💡 " + suggestion;
            }
        }
        
        // Add conversation to history
        this.conversationHistory.push({
            role: 'zeus',
            message: response,
            timestamp: new Date().toISOString()
        });
        
        // Save limited history
        this.saveConversation();
        
        return response;
    }
    
    personalizeResponse(response, profile) {
        let personalized = response;
        
        // Add name if available
        if (profile.username) {
            personalized = personalized.replace(/your/g, `${profile.username}'s`);
        }
        
        // Add cluster match
        if (profile.clusterMatch) {
            personalized = personalized.replace(/opportunities/g, 
                `opportunities (especially in ${profile.clusterMatch})`);
        }
        
        // Add GPA context
        if (profile.gpa >= 3.5) {
            if (personalized.includes('GPA requirements')) {
                personalized = personalized.replace('GPA requirements', 
                    `GPA requirements (your ${profile.gpa} GPA exceeds most requirements!)`);
            }
        }
        
        return personalized;
    }
    
    addContext(response, userMessage) {
        // Extract specific opportunity mentions
        const opportunityMentions = this.extractOpportunityMentions(userMessage);
        
        if (opportunityMentions.length > 0) {
            response += `\n\nFor ${opportunityMentions.join(' and ')}, check the specific opportunity card for detailed requirements and application links.`;
        }
        
        return response;
    }
    
    extractOpportunityMentions(message) {
        const mentions = [];
        const msg = message.toLowerCase();
        
        // Check for specific opportunity mentions
        const opportunities = window.opportunitiesData || [];
        opportunities.forEach(opp => {
            const titleWords = opp.title.toLowerCase().split(' ');
            // Check if any significant word from title appears in message
            titleWords.forEach(word => {
                if (word.length > 4 && msg.includes(word)) {
                    mentions.push(opp.title);
                }
            });
        });
        
        return [...new Set(mentions)]; // Remove duplicates
    }
    
    // ============================================
    // UI INTERACTION
    // ============================================
    
    renderMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <strong>${isUser ? 'You' : 'Zeus'}</strong>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">${message}</div>
        `;
        
        return messageDiv;
    }
    
    simulateTyping(container, callback) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai typing';
        typingIndicator.innerHTML = `
            <div class="message-header">
                <strong>Zeus</strong>
            </div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        container.appendChild(typingIndicator);
        container.scrollTop = container.scrollHeight;
        
        // Simulate typing delay (0.5-1.5 seconds)
        const delay = 500 + Math.random() * 1000;
        
        setTimeout(() => {
            typingIndicator.remove();
            this.isTyping = false;
            callback();
        }, delay);
    }
    
    // ============================================
    // CONVERSATION MANAGEMENT
    // ============================================
    
    loadConversation() {
        const saved = localStorage.getItem('zeusConversation');
        if (saved) {
            try {
                this.conversationHistory = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading conversation:', e);
                this.conversationHistory = [];
            }
        }
        
        return this.conversationHistory;
    }
    
    saveConversation() {
        // Keep only last 50 messages
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        
        localStorage.setItem('zeusConversation', JSON.stringify(this.conversationHistory));
    }
    
    clearConversation() {
        this.conversationHistory = [];
        localStorage.removeItem('zeusConversation');
        
        // Add welcome message
        const randomGreeting = this.responses.greetings[Math.floor(Math.random() * this.responses.greetings.length)];
        this.conversationHistory.push({
            role: 'zeus',
            message: randomGreeting,
            timestamp: new Date().toISOString()
        });
        
        return this.conversationHistory;
    }
    
    // ============================================
    // SPECIFIC QUERY HANDLERS
    // ============================================
    
    handleSpecificQuery(query) {
        const q = query.toLowerCase();
        
        // GPA questions
        if (q.includes('gpa') || q.includes('grade point')) {
            const profile = StudentAtlas.getStudentProfile();
            if (profile?.gpa) {
                return `Your GPA is ${profile.gpa}. Most competitive programs require 3.5+, but we have opportunities for all GPAs.`;
            }
            return "GPA requirements vary by program. Competitive STEM programs often require 3.5+, while others accept 3.0+. Check individual opportunity cards for specific requirements.";
        }
        
        // Service hours questions
        if (q.includes('service') || q.includes('volunteer') || q.includes('hours')) {
            const profile = StudentAtlas.getStudentProfile();
            if (profile?.serviceHours) {
                return `You have ${profile.serviceHours} service hours. Many community service programs look for 50+ hours, while some scholarships require 100+.`;
            }
            return "Service hour requirements vary. Community service programs often want 50+ hours, while some scholarships require 100+. You can filter opportunities by type to find ones matching your experience.";
        }
        
        // Deadline questions
        if (q.includes('deadline') || q.includes('when to apply') || q.includes('due')) {
            return "Deadlines vary: Summer programs (Jan-Mar), Scholarships (Sept-Nov for following year), Year-round programs (rolling). Check individual opportunity cards for exact dates.";
        }
        
        // Cost questions
        if (q.includes('cost') || q.includes('free') || q.includes('paid') || q.includes('money')) {
            return "Costs vary: Free programs (often virtual), Paid programs ($500-$5000), Scholarships (cover costs), Stipend programs (pay you!). Use the cost filter to find options matching your budget.";
        }
        
        // Location questions
        if (q.includes('where') || q.includes('location') || q.includes('virtual') || q.includes('travel')) {
            return "We have: Virtual/Online (no travel), National (multiple locations), Local/Regional (your area), International (abroad). Use the location filter to find options matching your preferences.";
        }
        
        return null; // No specific handler matched
    }
    
    // ============================================
    // ENHANCED RESPONSE GENERATION
    // ============================================
    
    getEnhancedResponse(userMessage) {
        // First, check for specific queries
        const specificResponse = this.handleSpecificQuery(userMessage);
        if (specificResponse) {
            return specificResponse;
        }
        
        // Get user profile for personalization
        const profile = StudentAtlas.getStudentProfile();
        
        // Generate base response
        let response = this.generateResponse(userMessage, profile);
        
        // Add opportunity suggestions if relevant
        if (this.shouldAddOpportunitySuggestions(userMessage)) {
            response += this.addOpportunitySuggestions(userMessage, profile);
        }
        
        // Add action items if relevant
        if (this.shouldAddActionItems(userMessage)) {
            response += this.addActionItems(userMessage);
        }
        
        return response;
    }
    
    shouldAddOpportunitySuggestions(message) {
        const msg = message.toLowerCase();
        const suggestionTriggers = [
            'find', 'look for', 'suggest', 'recommend', 'opportunity',
            'program', 'internship', 'scholarship'
        ];
        
        return suggestionTriggers.some(trigger => msg.includes(trigger));
    }
    
    addOpportunitySuggestions(message, profile) {
        const suggestions = [];
        const msg = message.toLowerCase();
        
        // Get user's cluster match
        const userCluster = profile?.clusterMatch || 'STEM';
        
        // Find relevant opportunities
        const opportunities = window.opportunitiesData || [];
        const relevantOpps = opportunities
            .filter(opp => {
                // Check if opportunity matches user's cluster
                if (opp.cluster === userCluster) return true;
                
                // Check if message mentions this cluster
                if (msg.includes(opp.cluster.toLowerCase())) return true;
                
                // Check if message mentions keywords from opportunity
                const titleWords = opp.title.toLowerCase().split(' ');
                return titleWords.some(word => 
                    word.length > 4 && msg.includes(word)
                );
            })
            .slice(0, 3); // Limit to 3 suggestions
        
        if (relevantOpps.length > 0) {
            suggestions.push("\n\n**I suggest checking out:**");
            relevantOpps.forEach(opp => {
                const matchScore = StudentAtlas.getOpportunityMatchScore(opp.id);
                suggestions.push(`• ${opp.title} (${matchScore}% match)`);
            });
            suggestions.push("\nCheck the dashboard for more details!");
        }
        
        return suggestions.join('\n');
    }
    
    shouldAddActionItems(message) {
        const msg = message.toLowerCase();
        const actionTriggers = [
            'do', 'next', 'action', 'step', 'prepare', 'get ready',
            'how to', 'what should'
        ];
        
        return actionTriggers.some(trigger => msg.includes(trigger));
    }
    
    addActionItems(message) {
        const actions = [];
        const msg = message.toLowerCase();
        
        if (msg.includes('apply') || msg.includes('application')) {
            actions.push("\n\n**Action items for applications:**");
            actions.push("1. Update your profile with latest achievements");
            actions.push("2. Request recommendation letters this week");
            actions.push("3. Start drafting your essays");
            actions.push("4. Create a deadlines calendar");
        }
        
        if (msg.includes('scholarship') || msg.includes('money')) {
            actions.push("\n\n**Action items for scholarships:**");
            actions.push("1. Complete FAFSA/Dream Act if applicable");
            actions.push("2. Gather financial documentation");
            actions.push("3. Write your personal statement");
            actions.push("4. Apply for local scholarships first");
        }
        
        if (actions.length > 0) {
            return actions.join('\n');
        }
        
        return '';
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    initialize() {
        // Load conversation history
        this.loadConversation();
        
        // Set up event listeners if UI elements exist
        this.setupUIListeners();
        
        console.log('Zeus AI initialized');
    }
    
    setupUIListeners() {
        // AI chat toggle
        const aiToggle = document.getElementById('toggleAIChat');
        if (aiToggle) {
            aiToggle.addEventListener('click', () => this.toggleChat());
        }
        
        // AI input send button
        const sendButton = document.getElementById('sendAIMessage');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.handleUserInput());
        }
        
        // AI input enter key
        const aiInput = document.getElementById('aiInput');
        if (aiInput) {
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserInput();
                }
            });
        }
        
        // Clear conversation button
        const clearButton = document.getElementById('clearConversation');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearChat());
        }
    }
    
    // ============================================
    // UI CONTROLS
    // ============================================
    
    toggleChat() {
        const panel = document.getElementById('aiPanel');
        if (panel) {
            panel.classList.toggle('open');
            
            if (panel.classList.contains('open')) {
                const input = document.getElementById('aiInput');
                if (input) input.focus();
                
                // Scroll to bottom
                const messages = document.getElementById('aiMessages');
                if (messages) {
                    messages.scrollTop = messages.scrollHeight;
                }
            }
        }
    }
    
    handleUserInput() {
        const input = document.getElementById('aiInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Clear input
        input.value = '';
        
        // Add user message to UI
        this.addMessageToUI(message, true);
        
        // Simulate typing, then add response
        const messagesContainer = document.getElementById('aiMessages');
        if (messagesContainer) {
            this.simulateTyping(messagesContainer, () => {
                const response = this.getEnhancedResponse(message);
                this.addMessageToUI(response, false);
            });
        }
    }
    
    addMessageToUI(message, isUser) {
        const messagesContainer = document.getElementById('aiMessages');
        if (!messagesContainer) return;
        
        const messageElement = this.renderMessage(message, isUser);
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Re-initialize icons if needed
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    clearChat() {
        const messagesContainer = document.getElementById('aiMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            // Add welcome message
            const welcome = this.responses.greetings[0];
            this.addMessageToUI(welcome, false);
            
            // Clear history
            this.clearConversation();
            
            StudentAtlas.showNotification('Conversation cleared', 'info');
        }
    }
    
    // ============================================
    // CONVERSATION FLOW MANAGEMENT
    // ============================================
    
    detectAffirmativeResponse(message) {
        const affirmatives = ['yes', 'yeah', 'sure', 'okay', 'ok', 'yep', 'absolutely', 'definitely', 'please', 'go ahead', 'tell me', 'explain'];
        const msg = message.toLowerCase().trim();
        
        return affirmatives.some(word => msg.includes(word)) && msg.length < 20;
    }
    
    getLastOffer() {
        // Find the last message where Zeus made an offer
        for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
            const msg = this.conversationHistory[i];
            if (msg.role === 'zeus') {
                const text = msg.message.toLowerCase();
                if (text.includes('would you like') || text.includes('want me to') || text.includes('need help') || text.includes('walk you through')) {
                    return this.extractOffer(text);
                }
            }
        }
        return null;
    }
    
    extractOffer(message) {
        const offers = {
            'walk you through': 'stem_steps',
            'suggest specific programs': 'program_suggestions', 
            'help with recommendation': 'recommendation_help',
            'explain how match scores work': 'match_explanation',
            'application tips': 'application_tips',
            'essay help': 'essay_help'
        };
        
        for (const [phrase, action] of Object.entries(offers)) {
            if (message.includes(phrase)) {
                return action;
            }
        }
        return null;
    }
    
    generateFollowUpResponse(offerType) {
        const responses = {
            stem_steps: "Perfect! Here's a step-by-step guide for entering STEM fields:\n\n1. **Build Strong Foundations**: Focus on math and science courses. Aim for 3.5+ GPA in these subjects.\n\n2. **Gain Experience**: Join science clubs, participate in science fairs, or do independent research projects.\n\n3. **Explore Specializations**: Try different STEM areas through electives or summer programs to find your passion.\n\n4. **Network**: Attend STEM events, join organizations like Science Olympiad or Math League.\n\n5. **Prepare for Applications**: Start building your portfolio with projects, awards, and recommendations.\n\n6. **Research Programs**: Look at NASA OSTEM, Google CS Institute, and MIT research opportunities.\n\nWhat aspect would you like me to elaborate on?",
            
            program_suggestions: "Great! Based on your interests, here are some top recommendations:\n\n**High Match Opportunities:**\n• NASA OSTEM Internship (95% match)\n• Google Computer Science Summer Institute (92% match)\n• MIT Beaver Works (89% match)\n\n**Next Steps:** Click on any opportunity to view details, deadlines, and application links. Would you like me to explain the application process for any of these?",
            
            recommendation_help: "Excellent! Here's how to get strong recommendation letters:\n\n1. **Choose Wisely**: Pick teachers who know you well and taught relevant subjects.\n\n2. **Provide Context**: Give them your resume, essay topics, and specific examples of your work.\n\n3. **Ask Early**: Request letters 4-6 weeks before deadlines.\n\n4. **Follow Up**: Send polite reminders and thank-you notes.\n\n5. **Waiver Forms**: Sign waiver forms if required by programs.\n\nWould you like tips on what to include in your recommendation request email?",
            
            match_explanation: "Happy to explain! Match scores are calculated from:\n\n• **GPA** (25%): Your academic performance\n• **Skills Match** (30%): How well your skills align with requirements\n• **Interest Alignment** (20%): Based on your profile interests\n• **Eligibility** (15%): Meeting basic requirements\n• **Competition Level** (10%): Program selectivity\n\nGreen = 80%+ (Strong match)\nYellow = 60-79% (Good potential)\nRed = Below 60% (May need more preparation)\n\nWould you like me to help improve your match scores?",
            
            application_tips: "Perfect! Here are key application strategies:\n\n1. **Start Early**: Begin 6-9 months before deadlines\n2. **Customize Essays**: Tailor each application to the specific program\n3. **Strong Recommendations**: Get letters from teachers who know your work well\n4. **Proofread Everything**: Have multiple people review your materials\n5. **Follow Instructions**: Pay attention to all requirements and deadlines\n\nWhat specific part of the application process are you working on?",
            
            essay_help: "Great! Here's how to write compelling application essays:\n\n1. **Brainstorm**: List your experiences, achievements, and growth moments\n2. **Choose Topic**: Pick stories that show your character and passion\n3. **Structure**: Introduction, body with specific examples, conclusion\n4. **Be Specific**: Use concrete details, not general statements\n5. **Show Growth**: Demonstrate how experiences changed you\n6. **Edit Ruthlessly**: Get feedback and revise multiple times\n\nWould you like examples of strong essay topics or help brainstorming your story?"
        };
        
        return responses[offerType] || "I'd be happy to help with that! Could you be more specific about what you'd like to know?";
    }
    
    generateConversationSummary() {
        if (this.conversationHistory.length < 4) return null;
        
        const recent = this.conversationHistory.slice(-10);
        const summary = {
            mainTopics: [],
            userGoals: [],
            actionItems: [],
            sentiment: 'neutral'
        };
        
        // Analyze conversation for patterns
        const topics = new Set();
        recent.forEach(msg => {
            const text = msg.message.toLowerCase();
            if (text.includes('stem')) topics.add('STEM');
            if (text.includes('art') || text.includes('music')) topics.add('Arts');
            if (text.includes('scholarship')) topics.add('Scholarships');
            if (text.includes('application') || text.includes('apply')) topics.add('Applications');
        });
        
        summary.mainTopics = Array.from(topics);
        
        // Detect user goals
        const lastUserMsg = recent.filter(m => m.role === 'user').pop();
        if (lastUserMsg) {
            const text = lastUserMsg.message.toLowerCase();
            if (text.includes('find') || text.includes('looking for')) summary.userGoals.push('Finding opportunities');
            if (text.includes('apply') || text.includes('submit')) summary.userGoals.push('Application help');
            if (text.includes('deadline')) summary.userGoals.push('Timeline planning');
        }
        
        return summary;
    }
    
    generateProactiveSuggestion() {
        const summary = this.generateConversationSummary();
        if (!summary) return null;
        
        const suggestions = [];
        
        if (summary.mainTopics.includes('STEM') && !summary.mainTopics.includes('Applications')) {
            suggestions.push("Since we're talking about STEM, would you like application tips for competitive programs?");
        }
        
        if (summary.userGoals.includes('Finding opportunities')) {
            suggestions.push("Have you checked your match scores? They can help identify the best opportunities for you.");
        }
        
        if (summary.mainTopics.includes('Scholarships')) {
            suggestions.push("Don't forget about local scholarships! Many schools offer them in addition to national programs.");
        }
        
        return suggestions.length > 0 ? suggestions[Math.floor(Math.random() * suggestions.length)] : null;
    }
    
    getResponse(userMessage) {
        const msg = userMessage.trim().toLowerCase();
        // Greeting only once at the start
        let greeting = '';
        if (!this.hasGreeted && this.conversationHistory.length <= 1) {
            greeting = this.greetings[Math.floor(Math.random() * this.greetings.length)] + ' ';
            this.hasGreeted = true;
        }

        // Recognize greetings
        const isGreeting = /^(hello|hi|hey|greetings|good morning|good afternoon|good evening|sup|yo|what's up|howdy|hiya)[.!?\s]*$/i.test(msg);
        const isQuestion = /[?]|(what|how|when|where|why|which|who|can|could|should|would|is|are|do|does|did|will|may|shall|might|must)\b/i.test(msg);

        if (isGreeting) {
            // Only respond with a greeting and a short prompt
            return `${greeting || this.greetings[Math.floor(Math.random() * this.greetings.length)]}How can I help you today?`;
        }

        // For questions or requests, proceed as normal
        const ack = this.generateAcknowledgement(userMessage);
        const answer = this.generateAnswer(userMessage);
        const closing = this.closings[Math.floor(Math.random() * this.closings.length)];
        const followUp = this.generateFollowUp(userMessage);
        return `${greeting}${ack}\n\n${answer}\n\n${followUp}\n${closing}`;
    }

    generateAcknowledgement(userMessage) {
        // Simple keyword-based validation
        if (/stem|science|engineering|math/i.test(userMessage)) return "That’s a great question about STEM programs!";
        if (/summer|camp|intern/i.test(userMessage)) return "I understand you're looking for summer opportunities.";
        if (/scholarship|financial/i.test(userMessage)) return "Scholarships can be stressful, but I’m here to help you every step of the way!";
        if (/club|extracurricular|activity/i.test(userMessage)) return "Clubs are a fun way to get involved!";
        if (/leadership|president|captain/i.test(userMessage)) return "Leadership experience is impressive!";
        if (/arts|music|creative/i.test(userMessage)) return "Arts programs are a wonderful way to express yourself!";
        if (/civic|volunteer|community/i.test(userMessage)) return "Community service is so valuable!";
        return "Great question!";
    }

    generateAnswer(userMessage) {
        const msg = userMessage.toLowerCase();
        // STEM
        if (/\bstem\b|science|engineering|math|robotics|programming|coding|computer|ai|machine learning|data|research|nasa|google|microsoft/.test(msg)) {
            const responses = this.responses.stem;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Opportunities
        if (/opportunit|find|program|directory|list|explore|match|cluster/.test(msg)) {
            const responses = this.responses.opportunities;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Arts
        if (/art|music|dance|theater|film|writing|creative|design|photography|painting|sculpture|acting|performance|media|graphic design|animation/.test(msg)) {
            const responses = this.responses.arts;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Scholarships
        if (/scholarship|financial aid|money|pay|tuition|cost|expensive|funding|grants|fellowships|bursaries|awards/.test(msg)) {
            const responses = this.responses.scholarships;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Applications
        if (/apply|application|deadline|essay|recommendation|letter|submit|interview|portfolio|resume|cv|transcript/.test(msg)) {
            const responses = this.responses.applications;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Profile
        if (/profile|match|score|bookmark|gpa|grade|hours|skills|interests|career|goals|blueprint/.test(msg)) {
            const responses = this.responses.profile;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Advice
        if (/help|what can you do|how to|tips|advice|suggest|guide|tutorial|explain|assist/.test(msg)) {
            const responses = this.responses.advice;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Feedback
        if (/feedback|suggestion|improve|better|like|dislike|works|doesn’t work/.test(msg)) {
            const responses = this.responses.feedback;
            return responses[Math.floor(Math.random() * responses.length)];
        }
        // Greetings
        if (/hello|hi|hey|greetings|good morning|good afternoon|good evening|sup|yo|what's up|howdy|hiya/.test(msg)) {
            return "Hi! How can I help you explore opportunities or answer questions today?";
        }
        // Use compromise for extra topic extraction
        if (window.extractTopics && window.compromiseLoaded) {
            const topics = extractTopics(userMessage);
            if (topics.length > 0) {
                return `I noticed you mentioned: ${topics.join(', ')}. Want to know more about any of these topics?`;
            }
        }
        // Unknown
        const responses = this.responses.unknown;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateFollowUp(userMessage) {
        // Tone matching
        if (/scholarship|financial/i.test(userMessage)) {
            this.lastOffer = 'scholarship_tips';
            return "Would you like tips for making your application stand out, or help finding more scholarships?";
        }
        if (/club|extracurricular|activity/i.test(userMessage)) {
            this.lastOffer = 'club_info';
            return "Want to hear about the most popular clubs, or how to start your own?";
        }
        // Otherwise random
        this.lastOffer = null;
        return this.followUps[Math.floor(Math.random() * this.followUps.length)];
    }
}

// Create global instance
window.zeusAI = new ZeusAI();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.zeusAI) {
            window.zeusAI.initialize();
        }
    });
} else {
    if (window.zeusAI) {
        window.zeusAI.initialize();
    }
}