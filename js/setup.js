// Lógica para la página de configuración inicial (index.html)

document.addEventListener('DOMContentLoaded', async () => {
    const setupScreen = document.getElementById('setupScreen');
    const codesScreen = document.getElementById('codesScreen');
    const adminLoginScreen = document.getElementById('adminLoginScreen');
    const generateBtn = document.getElementById('generateCodes');
    const copyAllBtn = document.getElementById('copyAllCodes');
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const participantsForm = document.getElementById('participantsForm');
    const resetBtn = document.getElementById('resetBtn');
    const verifyAdminBtn = document.getElementById('verifyAdminBtn');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    
    let participantCounter = 0;
    
    // Registrar todos los event listeners PRIMERO
    if (addParticipantBtn) {
        addParticipantBtn.addEventListener('click', addParticipant);
    }
    
    // Verificar contraseña de admin
    if (verifyAdminBtn && adminPasswordInput) {
        verifyAdminBtn.addEventListener('click', async () => {
            const password = adminPasswordInput.value.trim();
            
            // Get password from session
            const session = await JohariData.getSession();
            
            if (!session) {
                console.error('No session found');
                if (loginErrorMessage) loginErrorMessage.classList.remove('hidden');
                return;
            }
            
            if (password === session.adminPassword) {
                sessionStorage.setItem('adminAuthenticated', 'true');
                if (adminLoginScreen) adminLoginScreen.classList.add('hidden');
                displayCodes(session);
            } else {
                if (loginErrorMessage) loginErrorMessage.classList.remove('hidden');
                if (adminPasswordInput) adminPasswordInput.value = '';
            }
        });
        
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyAdminBtn.click();
            }
        });
    }
    
    // Verificar si ya existe una sesión
    const existingSession = await JohariData.getSession();
    if (existingSession) {
        // Check if already authenticated
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        if (isAuthenticated) {
            displayCodes(existingSession);
        } else {
            // Show login screen
            setupScreen.classList.add('hidden');
            codesScreen.classList.add('hidden');
            if (adminLoginScreen) adminLoginScreen.classList.remove('hidden');
        }
        return;
    }
    
    // Inicializar con 2 participantes por defecto
    addParticipant();
    addParticipant();
    
    function addParticipant() {
        participantCounter++;
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'participant-input-wrapper';
        inputWrapper.innerHTML = `
            <input type="text" class="participant-input" 
                   placeholder="${i18n.t('setup.placeholder') || 'Participant name'}" 
                   data-participant-id="${participantCounter}">
            <button type="button" class="btn-remove-participant" data-participant-id="${participantCounter}">✕</button>
        `;
        participantsForm.appendChild(inputWrapper);
        
        // Añadir event listener al botón de eliminar
        const removeBtn = inputWrapper.querySelector('.btn-remove-participant');
        removeBtn.addEventListener('click', () => removeParticipant(participantCounter));
    }
    
    function removeParticipant(id) {
        const wrapper = participantsForm.querySelector(`.participant-input-wrapper input[data-participant-id="${id}"]`)?.closest('.participant-input-wrapper');
        if (wrapper && participantsForm.children.length > 1) {
            wrapper.remove();
        }
    }
    
    // Generar códigos
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const inputs = document.querySelectorAll('.participant-input');
            const names = Array.from(inputs)
                .map(input => input.value.trim())
                .filter(name => name !== '');
            
            if (names.length < 2) {
                alert(i18n.t('setup.errorMinParticipants') || 'There must be at least 2 participants');
                return;
            }
            
            // Verificar nombres únicos
            const uniqueNames = new Set(names);
            if (uniqueNames.size !== names.length) {
                alert(i18n.t('setup.errorDuplicate') || 'Names must be unique');
                return;
            }
            
            // Crear sesión
            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';
            const session = await JohariData.createSession(names);
            displayCodes(session);
            generateBtn.disabled = false;
            generateBtn.textContent = i18n.t('setup.generate') || 'Generate access codes';
        });
    }
    
    // Mostrar códigos generados
    function displayCodes(session) {
        if (!session || !session.participants || !Array.isArray(session.participants)) {
            console.error('Invalid session in displayCodes:', session);
            return;
        }
        
        setupScreen.classList.add('hidden');
        codesScreen.classList.remove('hidden');
        
        const codesList = document.getElementById('codesList');
        const adminCode = document.getElementById('adminCode');
        const adminPassword = document.getElementById('adminPasswordDisplay');
        
        // Mostrar código de admin
        adminCode.textContent = session.adminCode || '';
        
        // Mostrar contraseña si existe
        if (adminPassword) {
            if (session.adminPassword) {
                adminPassword.textContent = session.adminPassword;
            } else {
                // Generate a default password for old sessions
                const defaultPassword = 'NO-PASSWORD';
                adminPassword.textContent = defaultPassword;
                adminPassword.style.color = '#dc2626';
                adminPassword.style.fontSize = '14px';
            }
        }
        
        // Mostrar códigos de participantes
        codesList.innerHTML = '';
        session.participants.forEach(participant => {
            const codeItem = document.createElement('div');
            codeItem.className = 'code-item';
            codeItem.innerHTML = `
                <div class="code-item-name">${participant.name}</div>
                <div class="code-item-code">${participant.code}</div>
            `;
            codesList.appendChild(codeItem);
        });
        
        // Configurar botón de reset si existe y no está configurado
        if (resetBtn && !resetBtn.dataset.configured) {
            resetBtn.style.display = 'inline-block';
            resetBtn.dataset.configured = 'true';
            resetBtn.addEventListener('click', async () => {
                if (confirm(i18n.t('setup.confirmNew') || 'Start a new session? This will clear the current session.')) {
                    sessionStorage.removeItem('adminAuthenticated');
                    await JohariData.resetSession();
                    window.location.reload();
                }
            });
        }
    }
    
    // Copiar todos los códigos
    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', async () => {
            const session = await JohariData.getSession();
            if (!session) return;
            
            let text = 'JOHARI WINDOW - ACCESS CODES\n\n';
            text += 'PARTICIPANTS:\n';
            session.participants.forEach(p => {
                text += `${p.name}: ${p.code}\n`;
            });
            text += `\nADMINISTRATOR CODE: ${session.adminCode}\n`;
            if (session.adminPassword) {
                text += `ADMIN PASSWORD: ${session.adminPassword}\n`;
            }
            text += '\nSave this password to access the codes screen later!\n';
            
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyAllBtn.textContent;
                copyAllBtn.textContent = '✓ ' + (i18n.t('codes.copied') || 'Copied');
                setTimeout(() => {
                    copyAllBtn.textContent = originalText;
                }, 2000);
            });
        });
    }
});
