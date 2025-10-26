// Algoritmo para calcular la Ventana de Johari

const JohariWindow = {
    // Calcular la ventana de Johari para un participante (async)
    async calculate(participantCode) {
        const session = await JohariData.getSession();
        if (!session) return null;
        
        const participant = session.participants.find(p => p.code === participantCode);
        if (!participant) return null;
        
        const currentLang = i18n.currentLang;
        const allAdjectives = JohariData.adjectives[currentLang];
        
        // Usar solo los primeros 56 adjetivos (estándar Johari Window)
        const validAdjectives = allAdjectives.slice(0, 56);
        
        // Convertir adjetivos almacenados (en cualquier idioma) a índices
        const selfIndices = participant.selfAssessment.map(adj => {
            // Buscar en todos los idiomas
            for (let lang of ['es', 'fr', 'en']) {
                const index = JohariData.adjectives[lang].indexOf(adj);
                if (index !== -1) return index;
            }
            return -1;
        }).filter(idx => idx !== -1);
        
        // Obtener evaluaciones de compañeros y convertir a índices (async)
        const rawPeerAdjectives = await JohariData.getPeerAssessmentsFor(participantCode);
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
        // Generar índices solo para los adjetivos válidos (56)
        const unknownArea = validAdjectives
            .map((_, idx) => idx)
            .filter(idx => !selfSet.has(idx) && !peerSet.has(idx));
        
        // Convertir índices a texto en el idioma actual
        return {
            participant: participant.name,
            openArea: openArea.map(idx => validAdjectives[idx]),
            blindArea: blindArea.map(idx => validAdjectives[idx]),
            hiddenArea: hiddenArea.map(idx => validAdjectives[idx]),
            unknownArea: unknownArea.map(idx => validAdjectives[idx]),
            stats: {
                open: openArea.length,
                blind: blindArea.length,
                hidden: hiddenArea.length,
                unknown: unknownArea.length,
                total: validAdjectives.length
            }
        };
    },
    
    // Calcular ventanas para todos los participantes (async)
    async calculateAll() {
        const session = await JohariData.getSession();
        if (!session) return [];
        
        const windows = await Promise.all(
            session.participants
                .filter(p => p.completed)
                .map(async p => ({
                    code: p.code,
                    window: await this.calculate(p.code)
                }))
        );
        
        return windows.filter(w => w.window !== null);
    },
    
    // Verificar si todos los participantes han completado (async)
    async allCompleted() {
        const session = await JohariData.getSession();
        if (!session) return false;
        
        return session.participants.every(p => p.completed);
    },
    
    // Obtener estadísticas de progreso (async)
    async getProgress() {
        const session = await JohariData.getSession();
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
            return i18n.t('johari.none') || 'None';
        }
        
        if (adjectives.length <= maxDisplay) {
            return adjectives.join(', ');
        }
        
        const displayed = adjectives.slice(0, maxDisplay);
        const remaining = adjectives.length - maxDisplay;
        return `${displayed.join(', ')} (+${remaining} more)`;
    },
    
    // Obtener color para cada área
    getAreaColor(area) {
        const colors = {
            open: '#059669',      // Verde
            blind: '#d97706',     // Naranja
            hidden: '#2563eb',    // Azul
            unknown: '#64748b'    // Gris
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
