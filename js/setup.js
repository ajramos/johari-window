// Lógica para la página de configuración inicial (index.html)

document.addEventListener('DOMContentLoaded', () => {
    const setupScreen = document.getElementById('setupScreen');
    const codesScreen = document.getElementById('codesScreen');
    const generateBtn = document.getElementById('generateCodes');
    const copyAllBtn = document.getElementById('copyAllCodes');
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const participantsForm = document.getElementById('participantsForm');
    
    let participantCounter = 0;
    
    // Verificar si ya existe una sesión
    const existingSession = JohariData.getSession();
    if (existingSession) {
        displayCodes(existingSession);
        return;
    }
    
    // Inicializar con 2 participantes por defecto
    addParticipant();
    addParticipant();
    
    // Añadir participante
    addParticipantBtn.addEventListener('click', addParticipant);
    
    function addParticipant() {
        participantCounter++;
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'participant-input-wrapper';
        inputWrapper.innerHTML = `
            <input type="text" class="participant-input" 
                   placeholder="${i18n.t('setup.placeholder') || 'Nombre participante'}" 
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
    generateBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.participant-input');
        const names = Array.from(inputs)
            .map(input => input.value.trim())
            .filter(name => name !== '');
        
        if (names.length < 2) {
            alert(i18n.t('setup.errorMinParticipants') || 'Debe haber al menos 2 participantes');
            return;
        }
        
        // Verificar nombres únicos
        const uniqueNames = new Set(names);
        if (uniqueNames.size !== names.length) {
            alert(i18n.t('setup.errorDuplicate') || 'Los nombres deben ser únicos');
            return;
        }
        
        // Crear sesión
        const session = JohariData.createSession(names);
        displayCodes(session);
    });
    
    // Mostrar códigos generados
    function displayCodes(session) {
        setupScreen.classList.add('hidden');
        codesScreen.classList.remove('hidden');
        
        const codesList = document.getElementById('codesList');
        const adminCode = document.getElementById('adminCode');
        
        // Mostrar código de admin
        adminCode.textContent = session.adminCode;
        
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
    }
    
    // Copiar todos los códigos
    copyAllBtn.addEventListener('click', () => {
        const session = JohariData.getSession();
        if (!session) return;
        
        let text = 'VENTANA DE JOHARI - CÓDIGOS DE ACCESO\n\n';
        text += 'PARTICIPANTES:\n';
        session.participants.forEach(p => {
            text += `${p.name}: ${p.code}\n`;
        });
        text += `\nADMINISTRADOR: ${session.adminCode}\n`;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyAllBtn.textContent;
            copyAllBtn.textContent = '✓ ' + (i18n.t('codes.copied') || 'Copiado');
            setTimeout(() => {
                copyAllBtn.textContent = originalText;
            }, 2000);
        });
    });
});
