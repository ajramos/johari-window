// Lógica para la página de configuración inicial (index.html)

document.addEventListener('DOMContentLoaded', () => {
    const setupScreen = document.getElementById('setupScreen');
    const codesScreen = document.getElementById('codesScreen');
    const generateBtn = document.getElementById('generateCodes');
    const copyAllBtn = document.getElementById('copyAllCodes');
    
    // Verificar si ya existe una sesión
    const existingSession = JohariData.getSession();
    if (existingSession) {
        displayCodes(existingSession);
    }
    
    // Generar códigos
    generateBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.participant-input');
        const names = Array.from(inputs)
            .map(input => input.value.trim())
            .filter(name => name !== '');
        
        if (names.length !== 9) {
            alert(i18n.t('setup.errorNames') || 'Por favor, ingresa los 9 nombres de participantes');
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
