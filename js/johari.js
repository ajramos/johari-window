// Algoritmo para calcular la Ventana de Johari

const JohariWindow = {
    // Calcular la ventana de Johari para un participante
    calculate(participantCode) {
        const session = JohariData.getSession();
        if (!session) return null;
        
        const participant = session.participants.find(p => p.code === participantCode);
        if (!participant) return null;
        
        const selfAdjectives = participant.selfAssessment;
        const peerAdjectives = JohariData.getPeerAssessmentsFor(participantCode);
        
        // Obtener todos los adjetivos únicos mencionados por los compañeros
        const uniquePeerAdjectives = [...new Set(peerAdjectives)];
        
        // Obtener idioma actual para los adjetivos
        const currentLang = i18n.currentLang;
        const allAdjectives = JohariData.adjectives[currentLang];
        
        // Calcular las 4 áreas
        const openArea = selfAdjectives.filter(adj => uniquePeerAdjectives.includes(adj));
        const blindArea = uniquePeerAdjectives.filter(adj => !selfAdjectives.includes(adj));
        const hiddenArea = selfAdjectives.filter(adj => !uniquePeerAdjectives.includes(adj));
        const unknownArea = allAdjectives.filter(adj => 
            !selfAdjectives.includes(adj) && !uniquePeerAdjectives.includes(adj)
        );
        
        return {
            participant: participant.name,
            openArea,
            blindArea,
            hiddenArea,
            unknownArea,
            stats: {
                open: openArea.length,
                blind: blindArea.length,
                hidden: hiddenArea.length,
                unknown: unknownArea.length,
                total: allAdjectives.length
            }
        };
    },
    
    // Calcular ventanas para todos los participantes
    calculateAll() {
        const session = JohariData.getSession();
        if (!session) return [];
        
        return session.participants
            .filter(p => p.completed)
            .map(p => ({
                code: p.code,
                window: this.calculate(p.code)
            }));
    },
    
    // Verificar si todos los participantes han completado
    allCompleted() {
        const session = JohariData.getSession();
        if (!session) return false;
        
        return session.participants.every(p => p.completed);
    },
    
    // Obtener estadísticas de progreso
    getProgress() {
        const session = JohariData.getSession();
        if (!session) return null;
        
        const total = session.participants.length;
        const completed = session.participants.filter(p => p.completed).length;
        const withSelfAssessment = session.participants.filter(p => 
            p.selfAssessment.length > 0
        ).length;
        
        return {
            total,
            completed,
            withSelfAssessment,
            pending: total - completed,
            percentageComplete: Math.round((completed / total) * 100)
        };
    },
    
    // Formatear adjetivos para mostrar en lista
    formatAdjectivesList(adjectives, maxDisplay = 10) {
        if (adjectives.length === 0) {
            return i18n.t('johari.none') || 'Ninguno';
        }
        
        if (adjectives.length <= maxDisplay) {
            return adjectives.join(', ');
        }
        
        const displayed = adjectives.slice(0, maxDisplay);
        const remaining = adjectives.length - maxDisplay;
        return `${displayed.join(', ')} (+${remaining} más)`;
    },
    
    // Obtener color para cada área
    getAreaColor(area) {
        const colors = {
            open: '#10b981',      // Verde
            blind: '#f59e0b',     // Naranja
            hidden: '#3b82f6',    // Azul
            unknown: '#94a3b8'    // Gris
        };
        return colors[area] || '#000000';
    },
    
    // Obtener título y descripción de cada área
    getAreaInfo(area) {
        return {
            title: i18n.t(`johari.${area}`),
            description: i18n.t(`johari.${area}Desc`)
        };
    }
};
