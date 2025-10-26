// Algoritmo para calcular la Ventana de Johari

const JohariWindow = {
    // Calcular la ventana de Johari para un participante
    calculate(participantCode) {
        const session = JohariData.getSession();
        if (!session) return null;
        
        const participant = session.participants.find(p => p.code === participantCode);
        if (!participant) return null;
        
        const currentLang = i18n.currentLang;
        const allAdjectives = JohariData.adjectives[currentLang];
        
        // Convertir adjetivos almacenados (en cualquier idioma) a índices
        const selfIndices = participant.selfAssessment.map(adj => {
            // Buscar en todos los idiomas
            for (let lang of ['es', 'fr', 'en']) {
                const index = JohariData.adjectives[lang].indexOf(adj);
                if (index !== -1) return index;
            }
            return -1;
        }).filter(idx => idx !== -1);
        
        // Obtener evaluaciones de compañeros y convertir a índices
        const rawPeerAdjectives = JohariData.getPeerAssessmentsFor(participantCode);
        const peerIndices = rawPeerAdjectives.map(adj => {
            for (let lang of ['es', 'fr', 'en']) {
                const index = JohariData.adjectives[lang].indexOf(adj);
                if (index !== -1) return index;
            }
            return -1;
        }).filter(idx => idx !== -1);
        
        // Crear sets de índices
        const selfSet = new Set(selfIndices);
        const peerSet = new Set(peerIndices);
        
        // Calcular las 4 áreas usando índices
        const openArea = [...selfSet].filter(idx => peerSet.has(idx));
        const blindArea = [...peerSet].filter(idx => !selfSet.has(idx));
        const hiddenArea = [...selfSet].filter(idx => !peerSet.has(idx));
        const unknownIndices = allAdjectives.map((_, idx) => idx);
        const unknownArea = unknownIndices.filter(idx => !selfSet.has(idx) && !peerSet.has(idx));
        
        // Convertir índices a texto en el idioma actual
        return {
            participant: participant.name,
            openArea: openArea.map(idx => allAdjectives[idx]),
            blindArea: blindArea.map(idx => allAdjectives[idx]),
            hiddenArea: hiddenArea.map(idx => allAdjectives[idx]),
            unknownArea: unknownArea.map(idx => allAdjectives[idx]),
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
