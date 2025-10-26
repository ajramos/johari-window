// Datos de la Ventana de Johari y funciones de almacenamiento

const JohariData = {
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
    
    // Generar código único de 6 caracteres
    generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin caracteres confusos
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },
    
    // Verificar si un código ya existe
    codeExists(code) {
        const session = this.getSession();
        if (!session) return false;
        
        return session.participants.some(p => p.code === code) || 
               session.adminCode === code;
    },
    
    // Generar código único
    generateUniqueCode() {
        let code;
        do {
            code = this.generateCode();
        } while (this.codeExists(code));
        return code;
    },
    
    // Crear nueva sesión
    createSession(participantNames) {
        const participants = participantNames.map(name => ({
            name: name,
            code: this.generateUniqueCode(),
            selfAssessment: [],
            peerAssessments: {},
            completed: false
        }));
        
        const session = {
            adminCode: this.generateUniqueCode(),
            participants: participants,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('johari_session', JSON.stringify(session));
        return session;
    },
    
    // Obtener sesión actual
    getSession() {
        const data = localStorage.getItem('johari_session');
        return data ? JSON.parse(data) : null;
    },
    
    // Guardar sesión
    saveSession(session) {
        localStorage.setItem('johari_session', JSON.stringify(session));
    },
    
    // Obtener participante por código
    getParticipantByCode(code) {
        const session = this.getSession();
        if (!session) return null;
        
        return session.participants.find(p => p.code === code);
    },
    
    // Verificar código de admin
    isAdminCode(code) {
        const session = this.getSession();
        return session && session.adminCode === code;
    },
    
    // Guardar autoevaluación
    saveSelfAssessment(code, adjectives) {
        const session = this.getSession();
        if (!session) return false;
        
        const participant = session.participants.find(p => p.code === code);
        if (!participant) return false;
        
        participant.selfAssessment = adjectives;
        this.saveSession(session);
        return true;
    },
    
    // Guardar evaluación de compañero
    savePeerAssessment(evaluatorCode, evaluatedCode, adjectives) {
        const session = this.getSession();
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
        
        this.saveSession(session);
        return true;
    },
    
    // Obtener evaluaciones de compañeros para un participante
    getPeerAssessmentsFor(participantCode) {
        const session = this.getSession();
        if (!session) return [];
        
        const assessments = [];
        session.participants.forEach(p => {
            if (p.code !== participantCode && p.peerAssessments[participantCode]) {
                assessments.push(...p.peerAssessments[participantCode]);
            }
        });
        
        return assessments;
    },
    
    // Exportar datos de la sesión
    exportSession() {
        const session = this.getSession();
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
    
    // Reiniciar sesión
    resetSession() {
        if (confirm('¿Estás seguro de que quieres reiniciar el ejercicio? Se perderán todos los datos.')) {
            localStorage.removeItem('johari_session');
            window.location.href = 'index.html';
        }
    }
};
