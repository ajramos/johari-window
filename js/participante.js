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
    
    function handleLogin() {
        const code = accessCodeInput.value.trim().toUpperCase();
        const participant = JohariData.getParticipantByCode(code);
        
        if (!participant) {
            errorMessage.classList.remove('hidden');
            return;
        }
        
        currentParticipant = participant;
        errorMessage.classList.add('hidden');
        
        // Verificar si ya completó todo
        if (participant.completed) {
            showCompletionScreen();
            return;
        }
        
        // Verificar si completó autoevaluación
        if (participant.selfAssessment.length === 0) {
            showSelfAssessment();
        } else {
            showPeerAssessment();
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
        
        saveBtn.addEventListener('click', () => {
            JohariData.saveSelfAssessment(currentParticipant.code, selectedAdjectives);
            showPeerAssessment();
        });
    }
    
    // EVALUACIÓN DE COMPAÑEROS
    function showPeerAssessment() {
        selfAssessmentScreen.classList.add('hidden');
        peerAssessmentScreen.classList.remove('hidden');
        
        const session = JohariData.getSession();
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
        prevBtn.onclick = () => {
            JohariData.savePeerAssessment(
                currentParticipant.code, 
                currentPeer.code, 
                selectedAdjectives
            );
            currentPeerIndex--;
            showCurrentPeer();
        };
        
        nextBtn.onclick = () => {
            JohariData.savePeerAssessment(
                currentParticipant.code, 
                currentPeer.code, 
                selectedAdjectives
            );
            
            if (currentPeerIndex < otherParticipants.length - 1) {
                currentPeerIndex++;
                showCurrentPeer();
            } else {
                // Actualizar participante como completado
                const session = JohariData.getSession();
                const participant = session.participants.find(
                    p => p.code === currentParticipant.code
                );
                participant.completed = true;
                JohariData.saveSession(session);
                
                showCompletionScreen();
            }
        };
    }
    
    // PANTALLA DE COMPLETADO
    function showCompletionScreen() {
        loginScreen.classList.add('hidden');
        selfAssessmentScreen.classList.add('hidden');
        peerAssessmentScreen.classList.add('hidden');
        completionScreen.classList.remove('hidden');
        
        renderPreviewWindow();
        
        const downloadBtn = document.getElementById('downloadPreview');
        downloadBtn.addEventListener('click', () => {
            JohariCanvas.downloadWindow(currentParticipant.code, false);
        });
    }
    
    // Renderizar preview de la ventana
    function renderPreviewWindow() {
        const canvas = document.getElementById('previewCanvas');
        const windowData = JohariWindow.calculate(currentParticipant.code);
        
        if (windowData && canvas) {
            JohariCanvas.drawClassic(canvas, windowData);
        }
    }
    
    // Listener para cambio de idioma
    window.addEventListener('languageChanged', () => {
        if (!completionScreen.classList.contains('hidden')) {
            renderPreviewWindow();
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
