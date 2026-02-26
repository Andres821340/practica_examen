// Configuración de la API
const API_URL = window.location.origin;

// Estado de autenticación
let currentUser = null;
let authToken = null;

// Cargar librería de gráficos de Google
google.charts.load('current', {'packages':['corechart']});

// Variables globales
let questionCounter = 0;

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// ==================== AUTENTICACIÓN ====================
function initializeAuth() {
    // Verificar si hay un token almacenado
    authToken = localStorage.getItem('authToken');

    if (authToken) {
        // Verificar token y cargar información del usuario
        verifyToken();
    } else {
        // Mostrar vista de inicio de sesión
        showLoginView();
    }

    // Cambio entre pestañas de Iniciar Sesión/Registrarse
    document.getElementById('loginTab')?.addEventListener('click', () => {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('registerTab').classList.remove('active');
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('registerForm').style.display = 'none';
    });

    document.getElementById('registerTab')?.addEventListener('click', () => {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('loginTab').classList.remove('active');
        document.getElementById('registerForm').style.display = 'flex';
        document.getElementById('loginForm').style.display = 'none';
    });

    // Envío de formularios
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            currentUser = await response.json();
            showAppView();
        } else {
            // Token inválido o expirado
            localStorage.removeItem('authToken');
            authToken = null;
            showLoginView();
        }
    } catch (error) {
        console.error('Error al verificar token:', error);
        showLoginView();
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = { email: data.email, fullName: data.fullName, role: data.role };
            localStorage.setItem('authToken', authToken);

            errorDiv.classList.remove('show');
            showAppView();
        } else {
            const error = await response.json();
            errorDiv.textContent = error.message || 'Credenciales inválidas';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        errorDiv.textContent = 'Error al iniciar sesión. Intenta nuevamente.';
        errorDiv.classList.add('show');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('registerFullName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = { email: data.email, fullName: data.fullName, role: data.role };
            localStorage.setItem('authToken', authToken);

            errorDiv.classList.remove('show');
            showAppView();
        } else {
            const error = await response.json();
            errorDiv.textContent = error.message || 'Error al registrarse';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        console.error('Error al registrarse:', error);
        errorDiv.textContent = 'Error al registrarse. Intenta nuevamente.';
        errorDiv.classList.add('show');
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showLoginView();
}

function showLoginView() {
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('appSidebar').style.display = 'none';
    document.getElementById('appContent').style.display = 'none';
    document.getElementById('userWelcome').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showAppView() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('appSidebar').style.display = 'block';
    document.getElementById('appContent').style.display = 'block';
    document.getElementById('userWelcome').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('userWelcome').textContent = `Hola, ${currentUser.fullName}`;

    // Ocultar/mostrar elementos del menú según el rol
    const isAdmin = currentUser.role === 'Administrador';
    document.querySelector('[data-view="surveys"]').style.display = isAdmin ? 'flex' : 'none';
    document.querySelector('[data-view="create"]').style.display = isAdmin ? 'flex' : 'none';
    document.querySelector('[data-view="analytics"]').style.display = isAdmin ? 'flex' : 'none';

    // Mostrar menú de usuarios y respuestas solo para administradores
    const usersMenuLink = document.getElementById('usersMenuLink');
    if (usersMenuLink) {
        usersMenuLink.style.display = isAdmin ? 'flex' : 'none';
    }

    const responsesMenuLink = document.getElementById('responsesMenuLink');
    if (responsesMenuLink) {
        responsesMenuLink.style.display = isAdmin ? 'flex' : 'none';
    }

    initializeApp();
}

// Wrapper de fetch con autenticación automática
async function authenticatedFetch(url, options = {}) {
    if (!options.headers) {
        options.headers = {};
    }

    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
        // Token expirado o inválido
        handleLogout();
        throw new Error('Sesión expirada');
    }

    return response;
}

function initializeApp() {
    // Navegación entre vistas
    document.querySelectorAll('.nav-link-custom').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const view = e.target.closest('.nav-link-custom').dataset.view;

            if (!view) return;

            // Actualizar estado activo en el menú
            document.querySelectorAll('.nav-link-custom').forEach(l => l.classList.remove('active'));
            e.target.closest('.nav-link-custom').classList.add('active');

            // Mostrar la vista correspondiente con animación
            document.querySelectorAll('[id$="View"]').forEach(v => {
                v.style.display = 'none';
                v.classList.remove('fade-in');
            });

            const viewEl = document.getElementById(`${view}View`);
            viewEl.style.display = 'block';
            setTimeout(() => viewEl.classList.add('fade-in'), 10);

            // Cargar datos para vistas específicas
            if (view === 'surveys') {
                loadSurveys();
            } else if (view === 'respond') {
                loadSurveysForRespond();
            } else if (view === 'analytics') {
                loadSurveysForAnalytics();
            } else if (view === 'responses') {
                loadSurveysForResponses();
            } else if (view === 'users') {
                loadUsers();
            } else if (view === 'settings') {
                loadSettingsView();
            } else if (view === 'help') {
                loadHelpView();
            }
        });
    });

        // Botón para agregar pregunta
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', addQuestion);
        }

        // Formulario para crear encuesta
        const createForm = document.getElementById('createSurveyForm');
        if (createForm) {
            createForm.addEventListener('submit', handleCreateSurvey);
        }

        // Inicializar - Mostrar vista apropiada según el rol
        if (currentUser.role === 'Administrador') {
            loadSurveys();
        } else {
            // Los usuarios van directamente a la vista de responder
            document.querySelector('[data-view="respond"]').click();
        }
    }

// ==================== VISTA DE ENCUESTAS ====================
async function loadSurveys() {
    try {
        const isAdmin = currentUser.role === 'Administrador';

        // Ocultar botón Nueva Encuesta si no es administrador
        const newSurveyBtn = document.getElementById('newSurveyBtn');
        if (newSurveyBtn) {
            newSurveyBtn.style.display = isAdmin ? 'flex' : 'none';
        }

        const response = await authenticatedFetch(`${API_URL}/api/surveys`);
        const surveys = await response.json();

        const container = document.getElementById('surveysList');

        if (surveys.length === 0) {
            container.innerHTML = '<div class="alert-modern alert-info-modern"><i class="bi bi-info-circle"></i> No hay encuestas creadas aun. Crea tu primera encuesta!</div>';
            return;
        }

        container.innerHTML = surveys.map(survey => `
            <div class="survey-item-modern">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h5><i class="bi bi-clipboard-check"></i> ${survey.title}</h5>
                        <p>${survey.description}</p>
                        <div>
                            <span class="badge-modern badge-primary-modern me-2">
                                <i class="bi bi-question-circle"></i> ${survey.questions.length} preguntas
                            </span>
                            <span class="badge-modern badge-secondary-modern">
                                <i class="bi bi-calendar"></i> ${new Date(survey.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    ${isAdmin ? `
                    <button class="btn-modern btn-danger-modern" onclick="deleteSurvey(${survey.id}, '${survey.title.replace(/'/g, "\\'")}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading surveys:', error);
        document.getElementById('surveysList').innerHTML = '<div class="alert-modern alert-info-modern"><i class="bi bi-exclamation-triangle"></i> Error al cargar las encuestas</div>';
    }
}

async function deleteSurvey(id, title) {
    const modalHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;" id="deleteSurveyModal">
            <div class="modern-card" style="max-width: 500px; width: 90%; margin: 1rem; animation: slideUp 0.3s ease;">
                <div class="card-header-modern" style="border-bottom: 2px solid rgba(239, 68, 68, 0.3); margin-bottom: 1.5rem;">
                    <div class="card-title-modern">
                        <i class="bi bi-exclamation-triangle" style="background: linear-gradient(135deg, var(--danger), #dc2626);"></i>
                        Confirmar Eliminación
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <p style="font-size: 1.1rem; color: var(--gray-300); margin-bottom: 1.5rem; line-height: 1.6;">
                        ?? <strong>¡ADVERTENCIA!</strong> Esta acción no se puede deshacer.
                    </p>
                    <p style="font-size: 1.05rem; color: var(--gray-400); margin-bottom: 1.5rem; line-height: 1.6;">
                        ¿Estás seguro de que deseas eliminar la encuesta:
                    </p>
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem;">
                        <p style="margin: 0; font-size: 1.15rem; color: #fff; font-weight: 700;">
                            <i class="bi bi-clipboard-check" style="color: var(--danger);"></i> ${title}
                        </p>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.2);">
                        <p style="margin: 0; font-size: 0.95rem; color: var(--gray-400); line-height: 1.5;">
                            <i class="bi bi-info-circle" style="color: var(--danger);"></i> 
                            Se eliminarán todas las preguntas y respuestas asociadas a esta encuesta.
                        </p>
                    </div>
                </div>

                <div class="d-flex gap-3">
                    <button class="btn-modern btn-danger-modern flex-grow-1" onclick="confirmDeleteSurvey(${id})">
                        <i class="bi bi-trash"></i> Sí, Eliminar
                    </button>
                    <button class="btn-modern btn-secondary-modern" onclick="closeDeleteSurveyModal()" style="padding: 1rem 2rem;">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeDeleteSurveyModal() {
    const modal = document.getElementById('deleteSurveyModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

async function confirmDeleteSurvey(id) {
    try {
        await authenticatedFetch(`${API_URL}/api/surveys/${id}`, { method: 'DELETE' });
        closeDeleteSurveyModal();

        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            z-index: 10000;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(24px);
            border: 2px solid var(--success);
            border-radius: 16px;
            padding: 1.25rem 1.75rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.4);
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 350px;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        notification.innerHTML = `
            <i class="bi bi-check-circle-fill" style="font-size: 1.75rem; color: var(--success);"></i>
            <span style="color: #fff; font-weight: 600; font-size: 1rem; flex: 1;">¡Encuesta eliminada exitosamente!</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--gray-400); cursor: pointer; font-size: 1.25rem; padding: 0; transition: color 0.2s;">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        loadSurveys();
    } catch (error) {
        console.error('Error deleting survey:', error);
        closeDeleteSurveyModal();

        // Show error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            z-index: 10000;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(24px);
            border: 2px solid var(--danger);
            border-radius: 16px;
            padding: 1.25rem 1.75rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.4);
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 350px;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        notification.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill" style="font-size: 1.75rem; color: var(--danger);"></i>
            <span style="color: #fff; font-weight: 600; font-size: 1rem; flex: 1;">Error al eliminar la encuesta</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--gray-400); cursor: pointer; font-size: 1.25rem; padding: 0; transition: color 0.2s;">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ==================== CREATE SURVEY VIEW ====================
function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const questionId = questionCounter++;

    const questionHtml = `
        <div class="question-card-modern" id="question_${questionId}">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h6><i class="bi bi-patch-question-fill" style="color: var(--primary);"></i> Pregunta ${questionId + 1}</h6>
                <button type="button" class="btn-modern btn-danger-modern" style="padding: 0.5rem 1rem;" onclick="removeQuestion(${questionId})">
                    <i class="bi bi-x-circle"></i> Eliminar
                </button>
            </div>

            <div class="mb-4">
                <label class="form-label-modern">Texto de la pregunta</label>
                <input type="text" class="form-control-modern question-text" placeholder="Escribe tu pregunta aqui..." required>
            </div>

            <div class="mb-4">
                <label class="form-label-modern">Tipo de pregunta</label>
                <select class="form-control-modern question-type" onchange="updateQuestionOptions(${questionId})">
                    <option value="0">Opcion Multiple</option>
                    <option value="1">Texto Libre</option>
                    <option value="2">Calificacion (1-5)</option>
                </select>
            </div>

            <div class="options-container" id="options_${questionId}">
                <label class="form-label-modern">Opciones (separadas por coma)</label>
                <input type="text" class="form-control-modern question-options" placeholder="Ej: Si, No, Tal vez">
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', questionHtml);
}

function removeQuestion(id) {
    const el = document.getElementById(`question_${id}`);
    if (el) {
        el.style.transform = 'scale(0.8)';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
    }
}

function updateQuestionOptions(id) {
    const questionCard = document.getElementById(`question_${id}`);
    const type = questionCard.querySelector('.question-type').value;
    const optionsContainer = document.getElementById(`options_${id}`);

    if (type === "1") { // Text
        optionsContainer.style.display = 'none';
    } else if (type === "2") { // Rating
        optionsContainer.style.display = 'block';
        optionsContainer.innerHTML = `
            <label class="form-label-modern">Opciones</label>
            <input type="text" class="form-control-modern question-options" value="1,2,3,4,5" readonly>
        `;
    } else { // Multiple Choice
        optionsContainer.style.display = 'block';
        optionsContainer.innerHTML = `
            <label class="form-label-modern">Opciones (separadas por coma)</label>
            <input type="text" class="form-control-modern question-options" placeholder="Ej: Si, No, Tal vez">
        `;
    }
}

async function handleCreateSurvey(e) {
    e.preventDefault();

    const title = document.getElementById('surveyTitle').value;
    const description = document.getElementById('surveyDescription').value;

    const questions = [];
    document.querySelectorAll('.question-card-modern').forEach(card => {
        const text = card.querySelector('.question-text').value;
        const type = parseInt(card.querySelector('.question-type').value);
        const optionsInput = card.querySelector('.question-options');
        const options = optionsInput ? optionsInput.value.split(',').map(o => o.trim()).filter(o => o) : [];

        questions.push({ text, type, options });
    });

    if (questions.length === 0) {
        alert('Debes agregar al menos una pregunta');
        return;
    }

    const survey = { title, description, questions };

    try {
        await authenticatedFetch(`${API_URL}/api/surveys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(survey)
        });

        // Show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-modern alert-success-modern';
        alertDiv.innerHTML = '<i class="bi bi-check-circle"></i> Encuesta creada exitosamente!';
        document.querySelector('#createView .modern-card').prepend(alertDiv);

        setTimeout(() => alertDiv.remove(), 3000);

        // Reset form
        document.getElementById('createSurveyForm').reset();
        document.getElementById('questionsContainer').innerHTML = '';
        questionCounter = 0;

        // Navigate to surveys view
        setTimeout(() => {
            document.querySelector('[data-view="surveys"]').click();
        }, 1500);
    } catch (error) {
        console.error('Error creating survey:', error);
        alert('Error al crear la encuesta');
    }
}

        // ==================== RESPOND VIEW ====================
        async function loadSurveysForRespond() {
            try {
                const response = await authenticatedFetch(`${API_URL}/api/surveys`);
                const surveys = await response.json();

                const select = document.getElementById('surveySelectRespond');
        select.innerHTML = '<option value="">-- Seleccionar --</option>' +
            surveys.map(s => `<option value="${s.id}">${s.title}</option>`).join('');
        
        select.onchange = () => loadSurveyToRespond(parseInt(select.value));
    } catch (error) {
        console.error('Error loading surveys:', error);
        }
    }

    async function loadSurveyToRespond(surveyId) {
        if (!surveyId) {
            document.getElementById('respondContainer').innerHTML = '';
            return;
        }

        try {
            const response = await authenticatedFetch(`${API_URL}/api/surveys/${surveyId}`);
            const survey = await response.json();

            const container = document.getElementById('respondContainer');
            container.innerHTML = `
                <div class="modern-card">
                    <h4 style="color: #fff; font-weight: 700; font-size: 1.5rem; margin-bottom: 1rem;">
                        <i class="bi bi-clipboard-check" style="color: var(--primary);"></i> ${survey.title}
                    </h4>
                    <p style="color: var(--gray-400); margin-bottom: 2rem;">${survey.description}</p>
                    <hr style="border-color: rgba(255,255,255,0.08); margin-bottom: 2rem;">
                    <form id="responseForm">
                        ${survey.questions.map((q, idx) => `
                            <div class="mb-4">
                                <label class="form-label-modern">
                                    <i class="bi bi-patch-question-fill" style="color: var(--primary);"></i> ${idx + 1}. ${q.text}
                                </label>
                                ${renderQuestionInput(q)}
                            </div>
                        `).join('')}

                        <div class="d-flex gap-3">
                            <button type="submit" class="btn-modern btn-primary-modern flex-grow-1">
                                <i class="bi bi-send"></i> Enviar Respuestas
                            </button>
                        </div>
                    </form>
                </div>
            `;

            document.getElementById('responseForm').onsubmit = (e) => submitResponse(e, surveyId, survey.questions);
        } catch (error) {
            console.error('Error loading survey:', error);
        }
    }

    function renderQuestionInput(question) {
        if (question.type === 1) { // Text
            return `<textarea class="form-control-modern question-answer" data-question-id="${question.id}" rows="3" placeholder="Escribe tu respuesta aqui..." required></textarea>`;
        } else { // Multiple Choice or Rating
            return `<div style="margin-top: 1rem;">${question.options.map(option => `
                <label style="display: block; padding: 1rem; background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'; this.style.borderColor='rgba(99,102,241,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.08)'">
                    <input class="question-answer" type="radio" 
                           name="question_${question.id}" 
                           data-question-id="${question.id}" 
                           value="${option}" 
                           style="margin-right: 12px; width: 18px; height: 18px; accent-color: var(--primary);" required>
                    <span style="color: var(--gray-300); font-weight: 500;">${option}</span>
                </label>
            `).join('')}</div>`;
        }
    }

async function submitResponse(e, surveyId, questions) {
    e.preventDefault();

    const answers = [];
    questions.forEach(q => {
        let value;
        if (q.type === 1) { // Text
            value = document.querySelector(`[data-question-id="${q.id}"]`).value;
        } else { // Radio
            const checked = document.querySelector(`input[name="question_${q.id}"]:checked`);
            if (checked) {
                value = checked.value;
            }
        }
        if (value) {
            answers.push({ questionId: q.id, value });
        }
    });

    const response = { surveyId, answers };

    try {
        await authenticatedFetch(`${API_URL}/api/responses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
        });

        // Show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-modern alert-success-modern';
        alertDiv.innerHTML = '<i class="bi bi-check-circle"></i> Respuesta enviada exitosamente! Gracias por participar.';
        document.querySelector('#respondView .modern-card').prepend(alertDiv);

        setTimeout(() => alertDiv.remove(), 3000);

        document.getElementById('respondContainer').innerHTML = '';
        document.getElementById('surveySelectRespond').value = '';
    } catch (error) {
        console.error('Error submitting response:', error);
        alert('Error al enviar la respuesta');
    }
}

// ==================== ANALYTICS VIEW ====================
async function loadSurveysForAnalytics() {
    try {
        const response = await authenticatedFetch(`${API_URL}/api/surveys`);
        const surveys = await response.json();

        const select = document.getElementById('surveySelectAnalytics');
        select.innerHTML = '<option value="">-- Seleccionar --</option>' +
            surveys.map(s => `<option value="${s.id}">${s.title}</option>`).join('');

        select.onchange = () => loadAnalytics(parseInt(select.value));
        } catch (error) {
            console.error('Error loading surveys:', error);
        }
    }

    async function loadAnalytics(surveyId) {
        if (!surveyId) {
            document.getElementById('analyticsContainer').innerHTML = '';
            return;
        }

        try {
            const response = await authenticatedFetch(`${API_URL}/api/analytics/survey/${surveyId}`);
            const analytics = await response.json();

            const container = document.getElementById('analyticsContainer');

            if (analytics.totalResponses === 0) {
                container.innerHTML = '<div class="alert-modern alert-info-modern"><i class="bi bi-info-circle"></i> No hay respuestas para esta encuesta todavia.</div>';
                return;
            }

            container.innerHTML = `
                <div class="modern-card">
                    <h4 style="color: #fff; font-weight: 700; font-size: 1.75rem; margin-bottom: 1rem;">
                        <i class="bi bi-clipboard-data" style="color: var(--primary);"></i> ${analytics.surveyTitle}
                    </h4>
                    <p style="color: var(--gray-300); font-size: 1.15rem; margin-bottom: 2rem;">
                        <i class="bi bi-people-fill" style="color: var(--success);"></i> Total de Respuestas: 
                        <span class="badge-modern badge-primary-modern" style="font-size: 1.1rem; padding: 0.6rem 1.5rem;">${analytics.totalResponses}</span>
                    </p>
                    <hr style="border-color: rgba(255,255,255,0.08); margin-bottom: 2.5rem;">
                    ${analytics.questionAnalytics.map((qa, idx) => `
                        <div style="margin-bottom: 3rem;">
                            <h5 style="color: #fff; font-weight: 700; margin-bottom: 1.5rem;">
                                <i class="bi bi-patch-question" style="color: var(--primary);"></i> ${idx + 1}. ${qa.questionText}
                            </h5>
                            ${renderChart(qa, idx)}
                        </div>
                    `).join('')}
                </div>
            `;

            // Render charts after DOM is ready
            setTimeout(() => {
                analytics.questionAnalytics.forEach((qa, idx) => {
                    if (qa.questionType !== 1) { // Not text
                        renderChartJs(qa, idx);
                        renderGoogleChart(qa, idx);
                    }
                });
            }, 100);
        } catch (error) {
            console.error('Error loading analytics:', error);
            document.getElementById('analyticsContainer').innerHTML = '<div class="alert-modern alert-info-modern"><i class="bi bi-exclamation-triangle"></i> Error al cargar las analiticas</div>';
        }
    }

    function renderChart(qa, index) {
        if (qa.questionType === 1) { // Text responses
            return `
                <div class="alert-modern alert-info-modern">
                    <div>
                        <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 1rem;">
                            <i class="bi bi-chat-left-text"></i> Respuestas de texto:
                        </strong>
                        <div>
                            ${qa.textResponses.map(r => `<div class="text-responses-modern">${r}</div>`).join('')}
                        </div>
                    </div>
                </div>
                        `;
                    } else {
                        return `
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                                <div class="chart-container-modern">
                                    <h6 class="chart-title-modern"><i class="bi bi-pie-chart-fill"></i> Grafico de Pastel</h6>
                                    <div id="google_${index}" style="height: 350px;"></div>
                                </div>
                                <div class="chart-container-modern">
                                    <h6 class="chart-title-modern"><i class="bi bi-graph-up"></i> Grafico de Lineas</h6>
                                    <canvas id="chartjs_line_${index}" style="max-height: 350px;"></canvas>
                                </div>
                            </div>
                        `;
                    }
                }

        function renderChartJs(qa, index) {
            const labels = Object.keys(qa.responseDistribution);
            const data = Object.values(qa.responseDistribution);

            // Line Chart (el único que necesitamos de Chart.js)
            const ctxLine = document.getElementById(`chartjs_line_${index}`);
            if (ctxLine) {
                new Chart(ctxLine, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Tendencia de Respuestas',
                            data: data,
                            borderColor: 'rgba(99, 102, 241, 1)',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

function renderGoogleChart(qa, index) {
    const data = [['Opción', 'Cantidad']];
    Object.entries(qa.responseDistribution).forEach(([key, value]) => {
        data.push([key, value]);
    });

    const dataTable = google.visualization.arrayToDataTable(data);

    const options = {
        title: '',
        pieHole: 0.4, // Donut chart
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
        backgroundColor: 'transparent',
        legend: {
            position: 'bottom',
            textStyle: {
                color: '#9ca3af',
                fontSize: 13
            }
        },
        pieSliceText: 'value',
        pieSliceTextStyle: {
            color: '#ffffff',
            fontSize: 14,
            bold: true
        },
        chartArea: {
            width: '90%',
            height: '75%'
        },
        height: 350,
        tooltip: {
            textStyle: {
                fontSize: 13
            },
            showColorCode: true
        }
    };

    const chart = new google.visualization.PieChart(document.getElementById(`google_${index}`));
    chart.draw(dataTable, options);
}
