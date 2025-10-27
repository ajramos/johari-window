// Datos de la Ventana de Johari y funciones de almacenamiento con API Backend

const JohariData = {
    // Base URL for API (will be set via environment or default to Cloud Run URL)
    apiBaseUrl: window.API_BASE_URL || '',
    
    // Los 56 adjetivos clásicos de la Ventana de Johari
    adjectives: {
        es: [
            'Abierto', 'Adaptable', 'Agresivo', 'Alegre', 'Ambicioso', 'Amigable', 
            'Amistoso', 'Analítico', 'Animado', 'Atento', 'Auténtico', 'Aventurero',
            'Cálido', 'Cauteloso', 'Competente', 'Confiado', 'Considerado', 'Cooperador',
            'Creativo', 'Decidido', 'Digno de confianza', 'Directo', 'Discreto', 'Dominante',
            'Educado', 'Eficiente', 'Empático', 'Enérgico', 'Entusiasta', 'Extrovertido',
            'Flexible', 'Fuerte', 'Generoso', 'Gregario', 'Honesto', 'Imaginativo',
            'Independiente', 'Ingenioso', 'Inteligente', 'Introvertido', 'Líder', 'Maduro',
            'Minucioso', 'Modesto', 'Observador', 'Organizado', 'Paciente', 'Perseverante',
            'Persuasivo', 'Razonable', 'Responsable', 'Seguro de sí mismo', 'Sensato', 'Sensible',
            'Servicial', 'Sociable', 'Tolerante'
        ],
        fr: [
            'Ouvert', 'Adaptable', 'Agressif', 'Joyeux', 'Ambitieux', 'Aimable',
            'Amical', 'Analytique', 'Animé', 'Attentif', 'Authentique', 'Aventureux',
            'Chaleureux', 'Prudent', 'Compétent', 'Confiant', 'Attentionné', 'Coopératif',
            'Créatif', 'Déterminé', 'Digne de confiance', 'Direct', 'Discret', 'Dominant',
            'Poli', 'Efficace', 'Empathique', 'Énergique', 'Enthousiaste', 'Extraverti',
            'Flexible', 'Fort', 'Généreux', 'Grégaire', 'Honnête', 'Imaginatif',
            'Indépendant', 'Ingénieux', 'Intelligent', 'Introverti', 'Leader', 'Mature',
            'Minutieux', 'Modeste', 'Observateur', 'Organisé', 'Patient', 'Persévérant',
            'Persuasif', 'Raisonnable', 'Responsable', 'Sûr de soi', 'Sensé', 'Sensible',
            'Serviable', 'Sociable', 'Tolérant'
        ],
        en: [
            'Open', 'Adaptable', 'Aggressive', 'Cheerful', 'Ambitious', 'Friendly',
            'Amiable', 'Analytical', 'Lively', 'Attentive', 'Authentic', 'Adventurous',
            'Warm', 'Cautious', 'Competent', 'Confident', 'Considerate', 'Cooperative',
            'Creative', 'Determined', 'Trustworthy', 'Direct', 'Discreet', 'Dominant',
            'Polite', 'Efficient', 'Empathetic', 'Energetic', 'Enthusiastic', 'Extroverted',
            'Flexible', 'Strong', 'Generous', 'Gregarious', 'Honest', 'Imaginative',
            'Independent', 'Ingenious', 'Intelligent', 'Introverted', 'Leader', 'Mature',
            'Thorough', 'Modest', 'Observant', 'Organized', 'Patient', 'Persevering',
            'Persuasive', 'Reasonable', 'Responsible', 'Self-confident', 'Sensible', 'Sensitive',
            'Helpful', 'Sociable', 'Tolerant'
        ]
    },
    
    // Get adjective text by index in current language
    getAdjectiveByIndex(index, lang = 'es') {
        return this.adjectives[lang] ? this.adjectives[lang][index] : this.adjectives.es[index];
    },
    
    // Convert text to index in any language
    adjectiveTextToIndex(text, lang = 'es') {
        return this.adjectives[lang] ? this.adjectives[lang].indexOf(text) : this.adjectives.es.indexOf(text);
    },
    
    // API helper
    async apiCall(endpoint, options = {}) {
        if (this.apiBaseUrl === undefined || this.apiBaseUrl === null) {
            // Fallback to LocalStorage if no API configured
            return null;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },
    
    // Generar código único de 6 caracteres
    generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },
    
    // Verificar si un código ya existe (async)
    async codeExists(code) {
        const session = await this.getSession();
        if (!session) return false;
        
        return session.participants.some(p => p.code === code) || 
               session.adminCode === code;
    },
    
    // Generar código único (async)
    async generateUniqueCode() {
        let code;
        let attempts = 0;
        do {
            code = this.generateCode();
            attempts++;
        } while (await this.codeExists(code) && attempts < 1000);
        return code;
    },
    
    // Crear nueva sesión (async)
    async createSession(participantNames) {
        const participants = participantNames.map(async name => ({
            name: name,
            code: await this.generateUniqueCode(),
            selfAssessment: [],
            peerAssessments: {},
            completed: false
        }));
        
        const participantsArray = await Promise.all(participants);
        
        // Generate admin password (6 characters)
        const password = await this.generateUniqueCode();
        
        const session = {
            adminCode: await this.generateUniqueCode(),
            adminPassword: password,
            participants: participantsArray,
            createdAt: new Date().toISOString()
        };
        
        await this.saveSession(session);
        return session;
    },
    
    // Obtener sesión actual (async)
    async getSession() {
        // Always try API first (apiBaseUrl empty string means use relative URLs)
        if (this.apiBaseUrl !== undefined && this.apiBaseUrl !== null) {
            try {
                const session = await this.apiCall('/api/session');
                // Validate session structure
                if (session && session.participants && Array.isArray(session.participants)) {
                    return session;
                } else if (session) {
                    console.warn('Invalid session structure:', session);
                    return null;
                }
                return null;
            } catch (error) {
                console.warn('API failed, using LocalStorage:', error);
                const data = localStorage.getItem('johari_session');
                return data ? JSON.parse(data) : null;
            }
        }
        
        // Fallback to LocalStorage
        const data = localStorage.getItem('johari_session');
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar sesión (async)
    async saveSession(session) {
        if (this.apiBaseUrl !== undefined && this.apiBaseUrl !== null) {
            try {
                await this.apiCall('/api/session', {
                    method: 'POST',
                    body: JSON.stringify(session)
                });
                return;
            } catch (error) {
                console.warn('API failed, using LocalStorage:', error);
                localStorage.setItem('johari_session', JSON.stringify(session));
                return;
            }
        }
        
        // Fallback to LocalStorage
        localStorage.setItem('johari_session', JSON.stringify(session));
    },
    
    // Obtener participante por código (async)
    async getParticipantByCode(code) {
        const session = await this.getSession();
        if (!session || !session.participants || !Array.isArray(session.participants)) {
            console.error('Invalid session or participants not found:', session);
            return null;
        }
        
        return session.participants.find(p => p.code === code);
    },
    
    // Verificar código de admin (async)
    async isAdminCode(code) {
        const session = await this.getSession();
        return session && session.adminCode === code;
    },
    
    // Guardar autoevaluación (async)
    async saveSelfAssessment(code, adjectives) {
        const session = await this.getSession();
        if (!session) return false;
        
        const participant = session.participants.find(p => p.code === code);
        if (!participant) return false;
        
        participant.selfAssessment = adjectives;
        await this.saveSession(session);
        return true;
    },
    
    // Guardar evaluación de compañero (async)
    async savePeerAssessment(evaluatorCode, evaluatedCode, adjectives) {
        const session = await this.getSession();
        if (!session) return false;
        
        const evaluator = session.participants.find(p => p.code === evaluatorCode);
        if (!evaluator) return false;
        
        evaluator.peerAssessments[evaluatedCode] = adjectives;
        
        // Verificar si completó todas las evaluaciones
        const otherParticipants = session.participants.filter(p => p.code !== evaluatorCode);
        evaluator.completed = otherParticipants.every(p => 
            evaluator.peerAssessments[p.code] && 
            evaluator.peerAssessments[p.code].length > 0
        ) && evaluator.selfAssessment.length > 0;
        
        await this.saveSession(session);
        return true;
    },
    
    // Obtener evaluaciones de compañeros para un participante (async)
    async getPeerAssessmentsFor(participantCode) {
        const session = await this.getSession();
        if (!session) return [];
        
        const assessments = [];
        session.participants.forEach(p => {
            if (p.code !== participantCode && p.peerAssessments[participantCode]) {
                assessments.push(...p.peerAssessments[participantCode]);
            }
        });
        
        return assessments;
    },
    
    // Exportar datos de la sesión (async)
    async exportSession() {
        const session = await this.getSession();
        if (!session) return null;
        
        const blob = new Blob([JSON.stringify(session, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `johari-session-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Reiniciar sesión (async)
    async resetSession() {
        if (confirm('Are you sure you want to reset the exercise? All data will be lost.')) {
            if (this.apiBaseUrl !== undefined && this.apiBaseUrl !== null) {
                try {
                    await this.apiCall('/api/session', { method: 'DELETE' });
                } catch (error) {
                    console.warn('API failed:', error);
                }
            }
            localStorage.removeItem('johari_session');
            window.location.href = 'index.html';
        }
    }
};
