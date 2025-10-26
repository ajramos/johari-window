// Sistema de internacionalización con cambio dinámico de idioma

const i18n = {
    currentLang: 'es',
    
    translations: {
        es: {
            setup: {
                title: 'Configuración - Ventana de Johari',
                participants: 'Participantes del equipo',
                instruction: 'Ingresa los nombres de los miembros del equipo:',
                placeholder: 'Nombre participante',
                generate: 'Generar códigos de acceso',
                addParticipant: '+ Añadir participante',
                errorMinParticipants: 'Debe haber al menos 2 participantes',
                errorDuplicate: 'Los nombres deben ser únicos'
            },
            codes: {
                title: 'Códigos generados',
                instruction: 'Comparte estos códigos con cada participante:',
                admin: 'Acceso Administrador',
                adminCode: 'Tu código de administrador:',
                copy: 'Copiar todos los códigos',
                next: 'Próximos pasos',
                step1: 'Cada participante accede con su código en la página de participante',
                step2: 'Completan su autoevaluación y evaluaciones de compañeros',
                step3: 'El administrador puede ver todas las ventanas generadas',
                participant: 'Ir a página de participante',
                adminPanel: 'Ir a panel administrador'
            },
            participant: {
                login: {
                    title: 'Acceso Participante',
                    instruction: 'Ingresa tu código de acceso:',
                    placeholder: 'Código',
                    button: 'Entrar',
                    error: 'Código inválido'
                },
                self: {
                    title: 'Autoevaluación',
                    welcome: 'Bienvenido/a',
                    instruction: 'Selecciona 5-6 adjetivos que mejor te describan:',
                    selected: 'Seleccionados',
                    save: 'Guardar autoevaluación'
                },
                peer: {
                    title: 'Evaluación de Compañeros',
                    progress: 'Evaluando',
                    instruction: 'Selecciona 5-6 adjetivos que describan a esta persona:',
                    previous: 'Anterior',
                    next: 'Siguiente'
                },
                complete: {
                    title: '¡Evaluación Completada!',
                    message: 'Has completado todas las evaluaciones. Tu Ventana de Johari se generará cuando todos los participantes terminen.',
                    preview: 'Vista previa de tu ventana:',
                    download: 'Descargar mi ventana'
                }
            },
            admin: {
                login: {
                    title: 'Panel Administrador',
                    instruction: 'Ingresa tu código de administrador:',
                    placeholder: 'Código Admin',
                    button: 'Acceder',
                    error: 'Código inválido'
                },
                dashboard: {
                    title: 'Dashboard - Ventana de Johari',
                    progress: 'Progreso del ejercicio',
                    windows: 'Ventanas de Johari',
                    proportional: 'Vista proporcional',
                    actions: 'Acciones',
                    export: 'Exportar datos (JSON)',
                    downloadAll: 'Descargar todas las ventanas',
                    reset: 'Reiniciar ejercicio',
                    completed: 'Completado',
                    pending: 'Pendiente'
                }
            },
            johari: {
                open: 'Área Abierta',
                blind: 'Área Ciega',
                hidden: 'Área Oculta',
                unknown: 'Área Desconocida',
                openDesc: 'Lo que YO sé y OTROS saben',
                blindDesc: 'Lo que YO NO sé pero OTROS sí',
                hiddenDesc: 'Lo que YO sé pero OTROS no',
                unknownDesc: 'Lo que NI YO NI OTROS sabemos'
            }
        },
        
        fr: {
            setup: {
                title: 'Configuration - Fenêtre de Johari',
                participants: 'Participants de l\'équipe',
                instruction: 'Entrez les noms des membres de l\'équipe:',
                placeholder: 'Nom du participant',
                generate: 'Générer les codes d\'accès',
                addParticipant: '+ Ajouter un participant',
                errorMinParticipants: 'Il doit y avoir au moins 2 participants',
                errorDuplicate: 'Les noms doivent être uniques'
            },
            codes: {
                title: 'Codes générés',
                instruction: 'Partagez ces codes avec chaque participant:',
                admin: 'Accès Administrateur',
                adminCode: 'Votre code administrateur:',
                copy: 'Copier tous les codes',
                next: 'Prochaines étapes',
                step1: 'Chaque participant accède avec son code sur la page participant',
                step2: 'Ils complètent leur auto-évaluation et les évaluations des collègues',
                step3: 'L\'administrateur peut voir toutes les fenêtres générées',
                participant: 'Aller à la page participant',
                adminPanel: 'Aller au panneau administrateur'
            },
            participant: {
                login: {
                    title: 'Accès Participant',
                    instruction: 'Entrez votre code d\'accès:',
                    placeholder: 'Code',
                    button: 'Entrer',
                    error: 'Code invalide'
                },
                self: {
                    title: 'Auto-évaluation',
                    welcome: 'Bienvenue',
                    instruction: 'Sélectionnez 5-6 adjectifs qui vous décrivent le mieux:',
                    selected: 'Sélectionnés',
                    save: 'Sauvegarder l\'auto-évaluation'
                },
                peer: {
                    title: 'Évaluation des Collègues',
                    progress: 'Évaluation de',
                    instruction: 'Sélectionnez 5-6 adjectifs qui décrivent cette personne:',
                    previous: 'Précédent',
                    next: 'Suivant'
                },
                complete: {
                    title: 'Évaluation Terminée!',
                    message: 'Vous avez terminé toutes les évaluations. Votre Fenêtre de Johari sera générée lorsque tous les participants auront terminé.',
                    preview: 'Aperçu de votre fenêtre:',
                    download: 'Télécharger ma fenêtre'
                }
            },
            admin: {
                login: {
                    title: 'Panneau Administrateur',
                    instruction: 'Entrez votre code administrateur:',
                    placeholder: 'Code Admin',
                    button: 'Accéder',
                    error: 'Code invalide'
                },
                dashboard: {
                    title: 'Tableau de bord - Fenêtre de Johari',
                    progress: 'Progression de l\'exercice',
                    windows: 'Fenêtres de Johari',
                    proportional: 'Vue proportionnelle',
                    actions: 'Actions',
                    export: 'Exporter les données (JSON)',
                    downloadAll: 'Télécharger toutes les fenêtres',
                    reset: 'Réinitialiser l\'exercice',
                    completed: 'Terminé',
                    pending: 'En attente'
                }
            },
            johari: {
                open: 'Zone Ouverte',
                blind: 'Zone Aveugle',
                hidden: 'Zone Cachée',
                unknown: 'Zone Inconnue',
                openDesc: 'Ce que JE sais et les AUTRES savent',
                blindDesc: 'Ce que JE NE sais pas mais les AUTRES oui',
                hiddenDesc: 'Ce que JE sais mais les AUTRES non',
                unknownDesc: 'Ce que NI MOI NI les AUTRES savons'
            }
        },
        
        en: {
            setup: {
                title: 'Setup - Johari Window',
                participants: 'Team Participants',
                instruction: 'Enter the names of the team members:',
                placeholder: 'Participant name',
                generate: 'Generate access codes',
                addParticipant: '+ Add participant',
                errorMinParticipants: 'There must be at least 2 participants',
                errorDuplicate: 'Names must be unique'
            },
            codes: {
                title: 'Generated Codes',
                instruction: 'Share these codes with each participant:',
                admin: 'Administrator Access',
                adminCode: 'Your administrator code:',
                copy: 'Copy all codes',
                next: 'Next Steps',
                step1: 'Each participant accesses with their code on the participant page',
                step2: 'They complete their self-assessment and peer evaluations',
                step3: 'The administrator can view all generated windows',
                participant: 'Go to participant page',
                adminPanel: 'Go to admin panel'
            },
            participant: {
                login: {
                    title: 'Participant Access',
                    instruction: 'Enter your access code:',
                    placeholder: 'Code',
                    button: 'Enter',
                    error: 'Invalid code'
                },
                self: {
                    title: 'Self-Assessment',
                    welcome: 'Welcome',
                    instruction: 'Select 5-6 adjectives that best describe you:',
                    selected: 'Selected',
                    save: 'Save self-assessment'
                },
                peer: {
                    title: 'Peer Assessment',
                    progress: 'Evaluating',
                    instruction: 'Select 5-6 adjectives that describe this person:',
                    previous: 'Previous',
                    next: 'Next'
                },
                complete: {
                    title: 'Assessment Completed!',
                    message: 'You have completed all assessments. Your Johari Window will be generated when all participants finish.',
                    preview: 'Preview of your window:',
                    download: 'Download my window'
                }
            },
            admin: {
                login: {
                    title: 'Administrator Panel',
                    instruction: 'Enter your administrator code:',
                    placeholder: 'Admin Code',
                    button: 'Access',
                    error: 'Invalid code'
                },
                dashboard: {
                    title: 'Dashboard - Johari Window',
                    progress: 'Exercise Progress',
                    windows: 'Johari Windows',
                    proportional: 'Proportional View',
                    actions: 'Actions',
                    export: 'Export data (JSON)',
                    downloadAll: 'Download all windows',
                    reset: 'Reset exercise',
                    completed: 'Completed',
                    pending: 'Pending'
                }
            },
            johari: {
                open: 'Open Area',
                blind: 'Blind Area',
                hidden: 'Hidden Area',
                unknown: 'Unknown Area',
                openDesc: 'What I know and OTHERS know',
                blindDesc: 'What I DON\'T know but OTHERS do',
                hiddenDesc: 'What I know but OTHERS don\'t',
                unknownDesc: 'What NEITHER I NOR OTHERS know'
            }
        }
    },
    
    // Obtener traducción por clave
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            value = value[k];
            if (!value) return key;
        }
        
        return value;
    },
    
    // Cambiar idioma y actualizar DOM
    setLanguage(lang) {
        if (!this.translations[lang]) return;
        
        this.currentLang = lang;
        localStorage.setItem('johari_language', lang);
        this.updateDOM();
        this.updateLanguageButtons();
    },
    
    // Actualizar todo el DOM con las traducciones
    updateDOM() {
        // Actualizar elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // Actualizar placeholders con data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const index = Array.from(element.parentElement.children).indexOf(element) + 1;
            element.placeholder = this.t(key) + ' ' + index;
        });
    },
    
    // Actualizar botones de idioma
    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    },
    
    // Inicializar i18n
    init() {
        // Cargar idioma guardado o usar el del navegador
        const savedLang = localStorage.getItem('johari_language');
        const browserLang = navigator.language.split('-')[0];
        
        this.currentLang = savedLang || 
                          (this.translations[browserLang] ? browserLang : 'es');
        
        // Configurar event listeners para botones de idioma
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setLanguage(btn.dataset.lang);
                });
            });
            
            this.updateDOM();
            this.updateLanguageButtons();
        });
    }
};

// Inicializar automáticamente
i18n.init();
