// Lógica para la página de participante (participant.html)

let currentParticipant = null;
let currentPeerIndex = 0;
let otherParticipants = [];

document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('loginScreen');
    const selfAssessmentScreen = document.getElementById('selfAssessmentScreen');
    const peerAssessmentScreen = document.getElementById('peerAssessmentScreen');
    const completionScreen = document.getElementById('completionScreen');
    
    const loginBtn = document.getElementById('loginBtn');
    const accessCodeInput = document.getElementById('accessCode');
    const errorMessage = document.getElementById('errorMessage');
    
    // Login
    loginBtn.addEventListener('click', handleLogin);
    accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    async function handleLogin() {
        const code = accessCodeInput.value.trim().toUpperCase();
        const participant = await JohariData.getParticipantByCode(code);
        
        if (!participant) {
            errorMessage.classList.remove('hidden');
            return;
        }
        
        currentParticipant = participant;
        errorMessage.classList.add('hidden');
        
        // Verificar si ya completó todo
        if (participant.completed) {
            await showCompletionScreen();
            return;
        }
        
        // Verificar si completó autoevaluación
        if (participant.selfAssessment.length === 0) {
            showSelfAssessment();
        } else {
            await showPeerAssessment();
        }
    }
    
    // AUTOEVALUACIÓN
    function showSelfAssessment() {
        loginScreen.classList.add('hidden');
        selfAssessmentScreen.classList.remove('hidden');
        
        document.getElementById('participantName').textContent = currentParticipant.name;
        
        const grid = document.getElementById('selfAdjectivesGrid');
        const countElement = document.getElementById('selfCount');
        const saveBtn = document.getElementById('saveSelfAssessment');
        
        let selectedAdjectives = [...currentParticipant.selfAssessment];
        
        renderAdjectivesGrid(grid, selectedAdjectives, (adjectives) => {
            selectedAdjectives = adjectives;
            countElement.textContent = adjectives.length;
            saveBtn.disabled = adjectives.length < 5 || adjectives.length > 6;
        });
        
        saveBtn.addEventListener('click', async () => {
            await JohariData.saveSelfAssessment(currentParticipant.code, selectedAdjectives);
            await showPeerAssessment();
        });
    }
    
    // EVALUACIÓN DE COMPAÑEROS
    async function showPeerAssessment() {
        selfAssessmentScreen.classList.add('hidden');
        peerAssessmentScreen.classList.remove('hidden');
        
        const session = await JohariData.getSession();
        otherParticipants = session.participants.filter(
            p => p.code !== currentParticipant.code
        );
        
        currentPeerIndex = 0;
        
        // Buscar última evaluación pendiente
        for (let i = 0; i < otherParticipants.length; i++) {
            if (!currentParticipant.peerAssessments[otherParticipants[i].code]) {
                currentPeerIndex = i;
                break;
            }
        }
        
        showCurrentPeer();
    }
    
    function showCurrentPeer() {
        const currentPeer = otherParticipants[currentPeerIndex];
        const grid = document.getElementById('peerAdjectivesGrid');
        const countElement = document.getElementById('peerCount');
        const nameElement = document.getElementById('currentPeerName');
        const numberElement = document.getElementById('currentPeerNumber');
        const totalCountElement = document.getElementById('totalPeersCount');
        const progressFill = document.getElementById('progressFill');
        const prevBtn = document.getElementById('previousPeer');
        const nextBtn = document.getElementById('nextPeer');
        
        nameElement.textContent = currentPeer.name;
        numberElement.textContent = currentPeerIndex + 1;
        totalCountElement.textContent = otherParticipants.length;
        
        const progress = ((currentPeerIndex + 1) / otherParticipants.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        let selectedAdjectives = currentParticipant.peerAssessments[currentPeer.code] || [];
        
        renderAdjectivesGrid(grid, selectedAdjectives, (adjectives) => {
            selectedAdjectives = adjectives;
            countElement.textContent = adjectives.length;
            nextBtn.disabled = adjectives.length < 5 || adjectives.length > 6;
        });
        
        prevBtn.disabled = currentPeerIndex === 0;
        prevBtn.onclick = async () => {
            await JohariData.savePeerAssessment(
                currentParticipant.code, 
                currentPeer.code, 
                selectedAdjectives
            );
            currentPeerIndex--;
            showCurrentPeer();
        };
        
        nextBtn.onclick = async () => {
            await JohariData.savePeerAssessment(
                currentParticipant.code, 
                currentPeer.code, 
                selectedAdjectives
            );
            
            if (currentPeerIndex < otherParticipants.length - 1) {
                currentPeerIndex++;
                showCurrentPeer();
            } else {
                // Actualizar participante como completado
                const session = await JohariData.getSession();
                const participant = session.participants.find(
                    p => p.code === currentParticipant.code
                );
                participant.completed = true;
                await JohariData.saveSession(session);
                
                await showCompletionScreen();
            }
        };
    }
    
    // PANTALLA DE COMPLETADO
    async function showCompletionScreen() {
        loginScreen.classList.add('hidden');
        selfAssessmentScreen.classList.add('hidden');
        peerAssessmentScreen.classList.add('hidden');
        completionScreen.classList.remove('hidden');
        
        await renderPreviewWindow();
        await renderProgress();
        
        // Auto-refresh cada 5 segundos
        const refreshInterval = setInterval(async () => {
            await renderProgress();
        }, 5000);
        
        // Limpiar intervalo cuando el usuario sale de la pantalla
        window.addEventListener('beforeunload', () => {
            clearInterval(refreshInterval);
        });
        
        // Register event listeners for buttons on completion screen
        setTimeout(() => {
        const downloadBtn = document.getElementById('downloadPreview');
        const viewAllBtn = document.getElementById('viewAllAdjectives');
        
        if (downloadBtn) {
                downloadBtn.addEventListener('click', async () => {
                    await JohariCanvas.downloadWindow(currentParticipant.code, false);
                });
            }
            
            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', async () => {
                    await showAllAdjectives();
                });
            }
        }, 100);
    }
    
    // Mostrar todos los adjetivos en un modal
    async function showAllAdjectives() {
        const windowData = await JohariWindow.calculate(currentParticipant.code);
        
        if (!windowData) {
            console.error('No windowData available');
            return;
        }
        
        // Ensure all arrays exist - use correct property names
        const open = windowData.openArea || [];
        const blind = windowData.blindArea || [];
        const hidden = windowData.hiddenArea || [];
        const unknown = windowData.unknownArea || [];
        
        const currentLang = i18n.currentLanguage;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';
        
        const content = document.createElement('div');
        content.style.cssText = 'background:white;padding:30px;border-radius:12px;max-width:800px;max-height:80vh;overflow-y:auto;';
        
        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h2>${i18n.t('participant.complete.viewAll')}</h2>
                <button id="closeModal" style="background:#dc2626;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;">✕ ${i18n.t('participant.complete.closeModal')}</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;">
                <div style="background:#10b981;padding:15px;border-radius:8px;">
                    <h3 style="margin:0 0 10px 0;color:white;">${i18n.t('johari.open', currentLang)} (${open.length})</h3>
                    <div style="color:white;">${open.join(', ') || 'Ninguno'}</div>
                </div>
                <div style="background:#f97316;padding:15px;border-radius:8px;">
                    <h3 style="margin:0 0 10px 0;color:white;">${i18n.t('johari.blind', currentLang)} (${blind.length})</h3>
                    <div style="color:white;">${blind.join(', ') || 'Ninguno'}</div>
                </div>
                <div style="background:#3b82f6;padding:15px;border-radius:8px;">
                    <h3 style="margin:0 0 10px 0;color:white;">${i18n.t('johari.hidden', currentLang)} (${hidden.length})</h3>
                    <div style="color:white;">${hidden.join(', ') || 'Ninguno'}</div>
                </div>
                <div style="background:#6b7280;padding:15px;border-radius:8px;">
                    <h3 style="margin:0 0 10px 0;color:white;">${i18n.t('johari.unknown', currentLang)} (${unknown.length})</h3>
                    <div style="color:white;">${unknown.join(', ') || 'Ninguno'}</div>
                </div>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        const closeBtn = document.getElementById('closeModal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Mostrar progreso de otros participantes
    async function renderProgress() {
        try {
            const session = await JohariData.getSession();
            if (!session || !session.participants) return;
            
            const progressCard = document.getElementById('progressCard');
            const progressText = document.getElementById('progressText');
            const progressList = document.getElementById('progressList');
            const progressHeader = document.querySelector('#progressCard .progress-header');
            
            if (!progressCard || !progressText || !progressList || !progressHeader) return;
            
            const totalParticipants = session.participants.length;
            const completedParticipants = session.participants.filter(p => p.completed).length;
            
            // Actualizar texto de progreso
            const progressTemplate = i18n.t('participant.complete.progress');
            progressText.innerHTML = progressTemplate
                .replace('X/Y', `<strong>${completedParticipants}/${totalParticipants}</strong>`);
            
            // Si todos han completado, ocultar el mensaje de espera y la lista
            if (completedParticipants === totalParticipants) {
                if (progressHeader) {
                    progressHeader.innerHTML = `
                        <h3 style="color: #059669;">✓ ${i18n.t('participant.complete.allCompleted') || 'Todos los participantes han completado!'}</h3>
                    `;
                }
                progressList.style.display = 'none';
            } else {
                // Resetear header si no todos han completado
                if (progressHeader) {
                    progressHeader.innerHTML = `
                        <h3 data-i18n="participant.complete.waiting">Esperando que completen otros participantes</h3>
                        <span class="refresh-indicator" data-i18n="participant.complete.autoRefresh">Actualizando automáticamente</span>
                    `;
                }
                progressList.style.display = 'grid';
                
                // Renderizar lista de participantes (OCULTA por anonimato)
                progressList.innerHTML = '';
                // No mostrar nombres para mantener anonimato
                // Solo mostrar el estado general
            }
        } catch (error) {
            console.error('Error rendering progress:', error);
        }
    }
    
    // Renderizar preview de la ventana
    async function renderPreviewWindow() {
        const canvas = document.getElementById('previewCanvas');
        const windowData = await JohariWindow.calculate(currentParticipant.code);
        
        if (windowData && canvas) {
            JohariCanvas.drawClassic(canvas, windowData);
        }
    }
    
    // Listener para cambio de idioma
    window.addEventListener('languageChanged', async () => {
        if (!completionScreen.classList.contains('hidden')) {
            await renderPreviewWindow();
        }
    });
    
    // RENDERIZAR GRID DE ADJETIVOS
    function renderAdjectivesGrid(container, selected, onChange) {
        container.innerHTML = '';
        
        const currentLang = i18n.currentLang;
        const adjectives = JohariData.adjectives[currentLang];
        
        adjectives.forEach(adjective => {
            const btn = document.createElement('button');
            btn.className = 'adjective-btn';
            btn.textContent = adjective;
            
            if (selected.includes(adjective)) {
                btn.classList.add('selected');
            }
            
            btn.addEventListener('click', () => {
                if (selected.includes(adjective)) {
                    selected = selected.filter(a => a !== adjective);
                    btn.classList.remove('selected');
                } else {
                    if (selected.length < 6) {
                        selected.push(adjective);
                        btn.classList.add('selected');
                    }
                }
                onChange(selected);
            });
            
            container.appendChild(btn);
        });
    }
});
