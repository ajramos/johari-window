// Generación de visualizaciones de la Ventana de Johari usando Canvas

const JohariCanvas = {
    // Dibujar ventana de Johari clásica (4 cuadrantes iguales)
    drawClassic(canvas, windowData) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Colores
        const colors = {
            open: '#10b981',
            blind: '#f59e0b',
            hidden: '#3b82f6',
            unknown: '#94a3b8'
        };
        
        // Dibujar cuadrantes
        this.drawQuadrant(ctx, 0, 0, halfWidth, halfHeight, 
            colors.open, windowData.openArea, 'open');
        this.drawQuadrant(ctx, halfWidth, 0, halfWidth, halfHeight, 
            colors.blind, windowData.blindArea, 'blind');
        this.drawQuadrant(ctx, 0, halfHeight, halfWidth, halfHeight, 
            colors.hidden, windowData.hiddenArea, 'hidden');
        this.drawQuadrant(ctx, halfWidth, halfHeight, halfWidth, halfHeight, 
            colors.unknown, windowData.unknownArea, 'unknown');
        
        // Dibujar líneas divisorias
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(halfWidth, 0);
        ctx.lineTo(halfWidth, height);
        ctx.moveTo(0, halfHeight);
        ctx.lineTo(width, halfHeight);
        ctx.stroke();
    },
    
    // Dibujar ventana proporcional (tamaño según cantidad de adjetivos)
    drawProportional(canvas, windowData) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        const stats = windowData.stats;
        const total = stats.total;
        
        // Calcular proporciones (con mínimo del 10% para visibilidad)
        const minProportion = 0.1;
        const proportions = {
            open: Math.max((stats.open / total), minProportion),
            blind: Math.max((stats.blind / total), minProportion),
            hidden: Math.max((stats.hidden / total), minProportion),
            unknown: Math.max((stats.unknown / total), minProportion)
        };
        
        // Normalizar proporciones
        const sumProportions = proportions.open + proportions.blind + 
                               proportions.hidden + proportions.unknown;
        Object.keys(proportions).forEach(key => {
            proportions[key] /= sumProportions;
        });
        
        // Calcular dimensiones
        const widthOpen = width * Math.sqrt(proportions.open);
        const widthBlind = width - widthOpen;
        const heightOpen = height * (proportions.open / (proportions.open + proportions.hidden));
        const heightBlind = height * (proportions.blind / (proportions.blind + proportions.unknown));
        const heightHidden = height - heightOpen;
        const heightUnknown = height - heightBlind;
        
        // Colores
        const colors = {
            open: '#10b981',
            blind: '#f59e0b',
            hidden: '#3b82f6',
            unknown: '#94a3b8'
        };
        
        // Dibujar cuadrantes con dimensiones proporcionales
        this.drawQuadrant(ctx, 0, 0, widthOpen, heightOpen, 
            colors.open, windowData.openArea, 'open');
        this.drawQuadrant(ctx, widthOpen, 0, widthBlind, heightBlind, 
            colors.blind, windowData.blindArea, 'blind');
        this.drawQuadrant(ctx, 0, heightOpen, widthOpen, heightHidden, 
            colors.hidden, windowData.hiddenArea, 'hidden');
        this.drawQuadrant(ctx, widthOpen, heightBlind, widthBlind, heightUnknown, 
            colors.unknown, windowData.unknownArea, 'unknown');
        
        // Dibujar líneas divisorias
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(widthOpen, 0);
        ctx.lineTo(widthOpen, height);
        ctx.moveTo(0, heightOpen);
        ctx.lineTo(width, heightOpen);
        ctx.stroke();
    },
    
    // Dibujar un cuadrante individual
    drawQuadrant(ctx, x, y, width, height, color, adjectives, areaType) {
        // Fondo
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1.0;
        
        // Título
        const areaInfo = JohariWindow.getAreaInfo(areaType);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(areaInfo.title, x + width / 2, y + 25);
        
        // Descripción
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.wrapText(ctx, areaInfo.description, x + width / 2, y + 45, width - 20, 15);
        
        // Contador
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${adjectives.length}`, x + width / 2, y + height - 20);
        
        // Lista de adjetivos (si hay espacio)
        if (height > 150 && adjectives.length > 0) {
            ctx.font = '11px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            const maxAdjectives = Math.floor((height - 120) / 16);
            const displayAdjectives = adjectives.slice(0, maxAdjectives);
            
            displayAdjectives.forEach((adj, i) => {
                const adjText = adj.length > 15 ? adj.substring(0, 13) + '...' : adj;
                ctx.fillText(adjText, x + width / 2, y + 85 + (i * 16));
            });
            
            if (adjectives.length > maxAdjectives) {
                ctx.fillText(`+${adjectives.length - maxAdjectives} más`, 
                    x + width / 2, y + 85 + (maxAdjectives * 16));
            }
        }
    },
    
    // Función auxiliar para ajustar texto
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    },
    
    // Descargar canvas como imagen
    downloadCanvas(canvas, filename) {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        });
    },
    
    // Crear canvas para un participante
    createWindowCanvas(participantCode, proportional = false) {
        const windowData = JohariWindow.calculate(participantCode);
        if (!windowData) return null;
        
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        
        if (proportional) {
            this.drawProportional(canvas, windowData);
        } else {
            this.drawClassic(canvas, windowData);
        }
        
        return canvas;
    },
    
    // Descargar ventana de un participante
    downloadWindow(participantCode, proportional = false) {
        const session = JohariData.getSession();
        const participant = session.participants.find(p => p.code === participantCode);
        if (!participant) return;
        
        const canvas = this.createWindowCanvas(participantCode, proportional);
        if (!canvas) return;
        
        const filename = `johari-${participant.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        this.downloadCanvas(canvas, filename);
    },
    
    // Descargar todas las ventanas
    downloadAllWindows(proportional = false) {
        const session = JohariData.getSession();
        if (!session) return;
        
        session.participants
            .filter(p => p.completed)
            .forEach((p, index) => {
                setTimeout(() => {
                    this.downloadWindow(p.code, proportional);
                }, index * 500); // Delay para evitar problemas con descargas múltiples
            });
    }
};
