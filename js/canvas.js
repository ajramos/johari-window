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
        
        // Colores más vibrantes y contrastados
        const colors = {
            open: '#059669',    // Verde más intenso
            blind: '#d97706',   // Naranja más intenso
            hidden: '#2563eb',  // Azul más intenso
            unknown: '#64748b'  // Gris más oscuro para mejor contraste
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
        
        // Dibujar líneas divisorias más gruesas
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.moveTo(halfWidth, 0);
        ctx.lineTo(halfWidth, height);
        ctx.moveTo(0, halfHeight);
        ctx.lineTo(width, halfHeight);
        ctx.stroke();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
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
        
        // Colores más vibrantes (igual que en vista clásica)
        const colors = {
            open: '#059669',
            blind: '#d97706',
            hidden: '#2563eb',
            unknown: '#64748b'
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
        
        // Dibujar líneas divisorias más gruesas
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.moveTo(widthOpen, 0);
        ctx.lineTo(widthOpen, height);
        ctx.moveTo(0, heightOpen);
        ctx.lineTo(width, heightOpen);
        ctx.stroke();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    },
    
    // Dibujar un cuadrante individual
    drawQuadrant(ctx, x, y, width, height, color, adjectives, areaType) {
        // Fondo con mayor opacidad
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1.0;
        
        // Título con tamaño balanceado y sombra sutil
        const areaInfo = JohariWindow.getAreaInfo(areaType);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(areaInfo.title, x + width / 2, y + 32);
        ctx.shadowBlur = 0;
        
        // Descripción con tamaño mejorado
        ctx.font = '14px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.wrapText(ctx, areaInfo.description, x + width / 2, y + 52, width - 30, 18);
        
        // Contador con tamaño balanceado
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 4;
        ctx.font = 'bold 32px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${adjectives.length}`, x + width / 2, y + height - 25);
        ctx.shadowBlur = 0;
        
        // Lista de adjetivos con texto visible
        if (height > 170 && adjectives.length > 0) {
            ctx.font = '13px sans-serif';
            ctx.fillStyle = '#ffffff';
            const maxAdjectives = Math.floor((height - 140) / 18);
            const displayAdjectives = adjectives.slice(0, maxAdjectives);
            
            displayAdjectives.forEach((adj, i) => {
                const adjText = adj.length > 18 ? adj.substring(0, 16) + '...' : adj;
                ctx.fillText(adjText, x + width / 2, y + 85 + (i * 18));
            });
            
            if (adjectives.length > maxAdjectives) {
                ctx.font = 'bold 13px sans-serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillText(`+${adjectives.length - maxAdjectives} más`, 
                    x + width / 2, y + 85 + (maxAdjectives * 18));
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
