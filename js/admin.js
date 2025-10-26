// Lógica para el panel de administrador (admin.html)

let isProportionalView = false;

document.addEventListener('DOMContentLoaded', () => {
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
    
    function handleLogin() {
        const code = accessCodeInput.value.trim().toUpperCase();
        
        if (!JohariData.isAdminCode(code)) {
            errorMessage.classList.remove('hidden');
            return;
        }
        
        errorMessage.classList.add('hidden');
        showDashboard();
    }
    
    // DASHBOARD
    function showDashboard() {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        renderProgressSummary();
        renderWindows();
        setupActions();
    }
    
    // Resumen de progreso
    function renderProgressSummary() {
        const session = JohariData.getSession();
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
                status = `${peerCount}/8 ${i18n.t('participant.peer.title') || 'evaluaciones'}`;
            }
            
            item.innerHTML = `
                <div class="progress-item-name">${participant.name}</div>
                <div class="progress-item-status">${status}</div>
            `;
            
            container.appendChild(item);
        });
    }
    
    // Renderizar ventanas
    function renderWindows() {
        const container = document.getElementById('windowsGrid');
        container.innerHTML = '';
        
        const session = JohariData.getSession();
        if (!session) return;
        
        const proportionalCheckbox = document.getElementById('proportionalView');
        proportionalCheckbox.addEventListener('change', (e) => {
            isProportionalView = e.target.checked;
            renderWindows();
        });
        
        session.participants
            .filter(p => p.completed)
            .forEach(participant => {
                const windowData = JohariWindow.calculate(participant.code);
                if (!windowData) return;
                
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
                downloadBtn.textContent = i18n.t('participant.complete.download') || 'Descargar';
                downloadBtn.addEventListener('click', () => {
                    JohariCanvas.downloadWindow(participant.code, isProportionalView);
                });
                
                item.appendChild(title);
                item.appendChild(canvas);
                item.appendChild(downloadBtn);
                container.appendChild(item);
            });
        
        if (container.children.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #64748b;">Aún no hay ventanas completadas</p>';
        }
    }
    
    // Configurar acciones
    function setupActions() {
        const exportBtn = document.getElementById('exportData');
        const downloadAllBtn = document.getElementById('downloadAllWindows');
        const resetBtn = document.getElementById('resetExercise');
        
        exportBtn.addEventListener('click', () => {
            JohariData.exportSession();
        });
        
        downloadAllBtn.addEventListener('click', () => {
            JohariCanvas.downloadAllWindows(isProportionalView);
        });
        
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres reiniciar el ejercicio? Se perderán todos los datos.')) {
                JohariData.resetSession();
            }
        });
    }
    
    // Auto-refresh cada 10 segundos
    setInterval(() => {
        if (!loginScreen.classList.contains('hidden')) return;
        renderProgressSummary();
        renderWindows();
    }, 10000);
    
    // Listener para cambio de idioma
    window.addEventListener('languageChanged', () => {
        if (!loginScreen.classList.contains('hidden')) return;
        renderProgressSummary();
        renderWindows();
    });
});
