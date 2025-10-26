// Lógica para el panel de administrador (admin.html)

let isProportionalView = false;

document.addEventListener('DOMContentLoaded', async () => {
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboard = document.getElementById('adminDashboard');
    
    const loginBtn = document.getElementById('adminLoginBtn');
    const accessCodeInput = document.getElementById('adminAccessCode');
    const errorMessage = document.getElementById('adminErrorMessage');
    
    // Login
    loginBtn.addEventListener('click', handleLogin);
    accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    async function handleLogin() {
        const code = accessCodeInput.value.trim().toUpperCase();
        
        const isValid = await JohariData.isAdminCode(code);
        if (!isValid) {
            errorMessage.classList.remove('hidden');
            return;
        }
        
        errorMessage.classList.add('hidden');
        await showDashboard();
    }
    
    // DASHBOARD
    async function showDashboard() {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        await renderProgressSummary();
        await renderWindows();
        setupActions();
    }
    
    // Resumen de progreso
    async function renderProgressSummary() {
        const session = await JohariData.getSession();
        if (!session) return;
        
        const container = document.getElementById('progressSummary');
        container.innerHTML = '';
        
        session.participants.forEach(participant => {
            const item = document.createElement('div');
            item.className = 'progress-item';
            
            if (participant.completed) {
                item.classList.add('completed');
            }
            
            let status = i18n.t('admin.dashboard.pending');
            if (participant.completed) {
                status = i18n.t('admin.dashboard.completed');
            } else if (participant.selfAssessment.length > 0) {
                const peerCount = Object.keys(participant.peerAssessments).length;
                const totalPeers = session.participants.length - 1;
                status = `${peerCount}/${totalPeers} ${i18n.t('participant.peer.title') || 'evaluations'}`;
            }
            
            item.innerHTML = `
                <div class="progress-item-name">${participant.name}</div>
                <div class="progress-item-status">${status}</div>
            `;
            
            container.appendChild(item);
        });
    }
    
    // Renderizar ventanas
    async function renderWindows() {
        const container = document.getElementById('windowsGrid');
        container.innerHTML = '';
        
        const session = await JohariData.getSession();
        if (!session) return;
        
        const proportionalCheckbox = document.getElementById('proportionalView');
        if (proportionalCheckbox) {
            // Remove old listeners to avoid duplicates
            proportionalCheckbox.replaceWith(proportionalCheckbox.cloneNode(true));
            const newCheckbox = document.getElementById('proportionalView');
            
            newCheckbox.addEventListener('change', async (e) => {
                isProportionalView = e.target.checked;
                await renderWindows();
            });
        }
        
        const completedParticipants = session.participants.filter(p => p.completed);
        
        for (const participant of completedParticipants) {
            const windowData = await JohariWindow.calculate(participant.code);
            if (!windowData) continue;
            
            const item = document.createElement('div');
            item.className = 'window-item';
            
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 600;
            
            if (isProportionalView) {
                JohariCanvas.drawProportional(canvas, windowData);
            } else {
                JohariCanvas.drawClassic(canvas, windowData);
            }
            
            const title = document.createElement('h3');
            title.textContent = participant.name;
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn-secondary';
            downloadBtn.textContent = i18n.t('participant.complete.download') || 'Download';
            downloadBtn.addEventListener('click', async () => {
                await JohariCanvas.downloadWindow(participant.code, isProportionalView);
            });
            
            item.appendChild(title);
            item.appendChild(canvas);
            item.appendChild(downloadBtn);
            container.appendChild(item);
        }
        
        if (container.children.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #64748b;">No windows completed yet</p>';
        }
    }
    
    // Configurar acciones
    function setupActions() {
        const exportBtn = document.getElementById('exportData');
        const downloadAllBtn = document.getElementById('downloadAllWindows');
        const resetBtn = document.getElementById('resetExercise');
        
        exportBtn.addEventListener('click', async () => {
            await JohariData.exportSession();
        });
        
        downloadAllBtn.addEventListener('click', async () => {
            await JohariCanvas.downloadAllWindows(isProportionalView);
        });
        
        resetBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to reset the exercise? All data will be lost.')) {
                await JohariData.resetSession();
            }
        });
    }
    
    // Auto-refresh cada 10 segundos
    setInterval(async () => {
        if (!loginScreen.classList.contains('hidden')) return;
        await renderProgressSummary();
        await renderWindows();
    }, 10000);
    
    // Listener para cambio de idioma
    window.addEventListener('languageChanged', async () => {
        if (!loginScreen.classList.contains('hidden')) return;
        await renderProgressSummary();
        await renderWindows();
    });
});
