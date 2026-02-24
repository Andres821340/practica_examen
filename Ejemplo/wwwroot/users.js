// ==================== USERS MANAGEMENT (ADMIN ONLY) ====================
async function loadUsers() {
    try {
        const response = await authenticatedFetch(`${API_URL}/api/users`);
        const users = await response.json();

        const container = document.getElementById('usersList');

        if (users.length === 0) {
            container.innerHTML = '<div class="alert-modern alert-info-modern"><i class="bi bi-info-circle"></i> No hay usuarios registrados.</div>';
            return;
        }

        container.innerHTML = users.map(user => `
            <div class="survey-item-modern">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h5><i class="bi bi-person-circle" style="color: var(--primary);"></i> ${user.fullName}</h5>
                        <p style="margin-bottom: 0.75rem;"><i class="bi bi-envelope"></i> ${user.email}</p>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                            <span class="badge-modern ${user.roles.includes('Administrador') ? 'badge-secondary-modern' : 'badge-primary-modern'}">
                                <i class="bi bi-shield-check"></i> ${user.roles.join(', ')}
                            </span>
                            <span class="badge-modern badge-primary-modern">
                                <i class="bi bi-calendar"></i> Registrado: ${new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                        <button class="btn-modern btn-success-modern" onclick="changeUserRole('${user.id}', '${user.fullName}', '${user.roles[0]}')" style="padding: 0.75rem 1.5rem;">
                            <i class="bi bi-arrow-left-right"></i> Cambiar Rol
                        </button>
                        <button class="btn-modern btn-primary-modern" onclick="editUser('${user.id}', '${user.fullName}', '${user.email}')" style="padding: 0.75rem 1.5rem;">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn-modern btn-danger-modern" onclick="deleteUser('${user.id}', '${user.fullName}')" style="padding: 0.75rem 1.5rem;">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = '<div class="alert-modern alert-info-modern"><i class="bi bi-exclamation-triangle"></i> Error al cargar usuarios</div>';
    }
}

async function changeUserRole(userId, userName, currentRole) {
    const newRole = currentRole === 'Administrador' ? 'Usuario' : 'Administrador';

    // Create custom confirmation modal
    const modalHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;" id="roleChangeModal">
            <div class="modern-card" style="max-width: 500px; width: 90%; margin: 1rem; animation: slideUp 0.3s ease;">
                <div class="card-header-modern" style="border-bottom: 2px solid rgba(99, 102, 241, 0.2); margin-bottom: 1.5rem;">
                    <div class="card-title-modern">
                        <i class="bi bi-shield-exclamation"></i>
                        Confirmar Cambio de Rol
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <p style="font-size: 1.1rem; color: var(--gray-300); margin-bottom: 1.5rem; line-height: 1.6;">
                        ¿Estás seguro de cambiar el rol de:
                    </p>
                    <div style="background: rgba(99, 102, 241, 0.1); border-left: 4px solid var(--primary); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem;">
                        <p style="margin: 0; font-size: 1.15rem; color: #fff; font-weight: 700;">
                            <i class="bi bi-person-fill" style="color: var(--primary);"></i> ${userName}
                        </p>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.03); padding: 1.25rem; border-radius: 12px;">
                        <div style="text-align: center; flex: 1;">
                            <p style="font-size: 0.85rem; color: var(--gray-500); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Rol Actual</p>
                            <span class="badge-modern ${currentRole === 'Administrador' ? 'badge-secondary-modern' : 'badge-primary-modern'}" style="font-size: 1rem; padding: 0.75rem 1.25rem;">
                                <i class="bi bi-shield-check"></i> ${currentRole}
                            </span>
                        </div>
                        <div style="font-size: 2rem; color: var(--primary);">
                            <i class="bi bi-arrow-right"></i>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <p style="font-size: 0.85rem; color: var(--gray-500); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Nuevo Rol</p>
                            <span class="badge-modern ${newRole === 'Administrador' ? 'badge-secondary-modern' : 'badge-primary-modern'}" style="font-size: 1rem; padding: 0.75rem 1.25rem;">
                                <i class="bi bi-shield-check"></i> ${newRole}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-3">
                    <button class="btn-modern btn-success-modern flex-grow-1" onclick="confirmRoleChange('${userId}', '${userName}', '${newRole}')">
                        <i class="bi bi-check-circle"></i> Confirmar Cambio
                    </button>
                    <button class="btn-modern btn-danger-modern" onclick="closeRoleChangeModal()" style="padding: 1rem 2rem;">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add animation styles
    if (!document.getElementById('modalAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'modalAnimationStyles';
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeRoleChangeModal() {
    const modal = document.getElementById('roleChangeModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

async function confirmRoleChange(userId, userName, newRole) {
    closeRoleChangeModal();

    try {
        await authenticatedFetch(`${API_URL}/api/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });

        // Success notification
        showNotification(`¡Rol actualizado exitosamente! ${userName} ahora es ${newRole}`, 'success');

        loadUsers();
    } catch (error) {
        console.error('Error changing user role:', error);
        showNotification('Error al cambiar el rol del usuario. Por favor, intenta de nuevo.', 'error');
    }
}

function showNotification(message, type = 'success') {
    const iconMap = {
        'success': 'bi-check-circle-fill',
        'error': 'bi-exclamation-triangle-fill',
        'info': 'bi-info-circle-fill'
    };

    const colorMap = {
        'success': 'var(--success)',
        'error': 'var(--danger)',
        'info': 'var(--info)'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        z-index: 10000;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(24px);
        border: 2px solid ${colorMap[type]};
        border-radius: 16px;
        padding: 1.25rem 1.75rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px ${colorMap[type]}40;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 350px;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    notification.innerHTML = `
        <i class="bi ${iconMap[type]}" style="font-size: 1.75rem; color: ${colorMap[type]};"></i>
        <span style="color: #fff; font-weight: 600; font-size: 1rem; flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--gray-400); cursor: pointer; font-size: 1.25rem; padding: 0; transition: color 0.2s;">
            <i class="bi bi-x-lg"></i>
        </button>
    `;

    // Add animation style if not exists
    if (!document.getElementById('notificationAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationAnimationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==================== EDIT USER ====================
async function editUser(userId, userName, userEmail) {
    const modalHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;" id="editUserModal">
            <div class="modern-card" style="max-width: 600px; width: 90%; margin: 1rem; animation: slideUp 0.3s ease;">
                <div class="card-header-modern" style="border-bottom: 2px solid rgba(99, 102, 241, 0.2); margin-bottom: 1.5rem;">
                    <div class="card-title-modern">
                        <i class="bi bi-pencil-square"></i>
                        Editar Usuario
                    </div>
                </div>

                <form id="editUserForm" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div class="form-group-modern">
                        <label class="form-label-modern">
                            <i class="bi bi-person"></i>
                            Nombre Completo
                        </label>
                        <input type="text" class="input-modern" id="editUserFullName" value="${userName.replace(/"/g, '&quot;')}" required>
                    </div>

                    <div class="form-group-modern">
                        <label class="form-label-modern">
                            <i class="bi bi-envelope"></i>
                            Correo Electrónico
                        </label>
                        <input type="email" class="input-modern" id="editUserEmail" value="${userEmail}" required>
                    </div>

                    <div class="form-group-modern">
                        <label class="form-label-modern">
                            <i class="bi bi-lock"></i>
                            Nueva Contraseña (dejar en blanco para no cambiar)
                        </label>
                        <input type="password" class="input-modern" id="editUserPassword" placeholder="••••••••" minlength="6">
                    </div>

                    <div class="d-flex gap-3">
                        <button type="submit" class="btn-modern btn-success-modern flex-grow-1">
                            <i class="bi bi-check-circle"></i> Guardar Cambios
                        </button>
                        <button type="button" class="btn-modern btn-danger-modern" onclick="closeEditUserModal()">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('editUserForm').onsubmit = async (e) => {
        e.preventDefault();
        await confirmEditUser(userId);
    };
}

function closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

async function confirmEditUser(userId) {
    const fullName = document.getElementById('editUserFullName').value;
    const email = document.getElementById('editUserEmail').value;
    const password = document.getElementById('editUserPassword').value;

    try {
        const updateData = {
            fullName,
            email
        };

        if (password && password.trim() !== '') {
            updateData.password = password;
        }

        console.log('Updating user:', userId);
        console.log('Update data:', updateData);

        const response = await authenticatedFetch(`${API_URL}/api/users/${userId}/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Primero verificar si la respuesta es OK
        if (!response.ok) {
            // Intentar leer el cuerpo de la respuesta
            let errorMessage = 'Error al actualizar el usuario';
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    errorMessage = errorData.message || errorData.errors || errorMessage;
                } else {
                    const textError = await response.text();
                    console.error('Error response (text):', textError);
                    errorMessage = textError || errorMessage;
                }
            } catch (parseError) {
                console.error('Error parsing error response:', parseError);
            }
            throw new Error(errorMessage);
        }

        // Si la respuesta es OK, intentar parsear el JSON
        let result;
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('Update result:', result);
            } else {
                // Si no es JSON, leer como texto
                const textResult = await response.text();
                console.log('Update result (text):', textResult);
                result = { message: 'Usuario actualizado exitosamente' };
            }
        } catch (parseError) {
            console.warn('Could not parse response as JSON, assuming success:', parseError);
            result = { message: 'Usuario actualizado exitosamente' };
        }

        closeEditUserModal();
        showNotification(result.message || '¡Usuario actualizado exitosamente!', 'success');
        loadUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification(error.message || 'Error al actualizar el usuario. Por favor, intenta de nuevo.', 'error');
    }
}

// ==================== DELETE USER ====================
async function deleteUser(userId, userName) {
    const modalHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;" id="deleteUserModal">
            <div class="modern-card" style="max-width: 500px; width: 90%; margin: 1rem; animation: slideUp 0.3s ease;">
                <div class="card-header-modern" style="border-bottom: 2px solid rgba(239, 68, 68, 0.3); margin-bottom: 1.5rem;">
                    <div class="card-title-modern">
                        <i class="bi bi-exclamation-triangle" style="background: linear-gradient(135deg, var(--danger), #dc2626);"></i>
                        Confirmar Eliminación
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <p style="font-size: 1.1rem; color: var(--gray-300); margin-bottom: 1.5rem; line-height: 1.6;">
                        ⚠️ <strong>¡ADVERTENCIA!</strong> Esta acción no se puede deshacer.
                    </p>
                    <p style="font-size: 1.05rem; color: var(--gray-400); margin-bottom: 1.5rem; line-height: 1.6;">
                        ¿Estás seguro de que deseas eliminar al usuario:
                    </p>
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem;">
                        <p style="margin: 0; font-size: 1.15rem; color: #fff; font-weight: 700;">
                            <i class="bi bi-person-fill" style="color: var(--danger);"></i> ${userName}
                        </p>
                    </div>
                    <div style="background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.2);">
                        <p style="margin: 0; font-size: 0.95rem; color: var(--gray-400); line-height: 1.5;">
                            <i class="bi bi-info-circle" style="color: var(--danger);"></i> 
                            Se eliminarán todos los datos asociados a este usuario, incluyendo respuestas a encuestas.
                        </p>
                    </div>
                </div>

                <div class="d-flex gap-3">
                    <button class="btn-modern btn-danger-modern flex-grow-1" onclick="confirmDeleteUser('${userId}', '${userName}')">
                        <i class="bi bi-trash"></i> Sí, Eliminar Usuario
                    </button>
                    <button class="btn-modern btn-success-modern" onclick="closeDeleteUserModal()" style="padding: 1rem 2rem;">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeDeleteUserModal() {
    const modal = document.getElementById('deleteUserModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

async function confirmDeleteUser(userId, userName) {
    closeDeleteUserModal();

    try {
        const response = await authenticatedFetch(`${API_URL}/api/users/${userId}/delete`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            let errorMessage = 'Error al eliminar el usuario';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.error('Error parsing error response:', e);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        showNotification(result.message || `Usuario "${userName}" eliminado exitosamente`, 'success');
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification(error.message || 'Error al eliminar el usuario. Por favor, intenta de nuevo.', 'error');
    }
}

// ==================== RESPONSES VIEW (ADMIN ONLY) ====================
async function loadSurveysForResponses() {
    try {
        const response = await authenticatedFetch(`${API_URL}/api/surveys`);
        const surveys = await response.json();

        const select = document.getElementById('surveySelectResponses');
        select.innerHTML = '<option value="">-- Seleccionar Encuesta --</option>';

        surveys.forEach(survey => {
            const option = document.createElement('option');
            option.value = survey.id;
            option.textContent = survey.title;
            select.appendChild(option);
        });

        select.onchange = async (e) => {
            const surveyId = e.target.value;
            if (surveyId) {
                await loadSurveyResponses(surveyId);
            } else {
                document.getElementById('responsesContainer').innerHTML = '';
            }
        };

    } catch (error) {
        console.error('Error loading surveys:', error);
    }
}

async function loadSurveyResponses(surveyId) {
    try {
        // Use the correct endpoint that returns survey responses with user information
        const responsesResponse = await authenticatedFetch(`${API_URL}/api/responses/survey/${surveyId}`);
        const responses = await responsesResponse.json();

        const container = document.getElementById('responsesContainer');

        if (!responses || responses.length === 0) {
            container.innerHTML = `
                <div class="alert-modern alert-info-modern" style="margin-top: 2rem;">
                    <i class="bi bi-info-circle"></i> Esta encuesta aún no ha sido respondida por ningún usuario.
                </div>
            `;
            return;
        }

        // Fetch all users to get full information
        const usersResponse = await authenticatedFetch(`${API_URL}/api/users`);
        const users = await usersResponse.json();
        const usersMap = {};
        users.forEach(user => {
            usersMap[user.id] = user;
        });

        // Group responses by user
        const userResponsesMap = {};
        responses.forEach(response => {
            const userId = response.submittedByUserId;
            if (!userResponsesMap[userId]) {
                userResponsesMap[userId] = [];
            }
            userResponsesMap[userId].push(response);
        });

        const totalResponses = Object.keys(userResponsesMap).length;

        container.innerHTML = `
            <div class="modern-card" style="margin-top: 2rem; background: rgba(99, 102, 241, 0.05);">
                <div class="card-header-modern" style="border-bottom: 2px solid rgba(99, 102, 241, 0.2);">
                    <div class="card-title-modern">
                        <i class="bi bi-clipboard-data"></i>
                        Resumen de Respuestas
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
                    <div style="background: rgba(99, 102, 241, 0.1); border-left: 4px solid var(--primary); padding: 1.5rem; border-radius: 12px;">
                        <div style="font-size: 0.85rem; color: var(--gray-400); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">
                            <i class="bi bi-people"></i> Total de Usuarios
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: #fff;">${totalResponses}</div>
                    </div>
                    <div style="background: rgba(139, 92, 246, 0.1); border-left: 4px solid var(--secondary); padding: 1.5rem; border-radius: 12px;">
                        <div style="font-size: 0.85rem; color: var(--gray-400); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">
                            <i class="bi bi-file-earmark-text"></i> Total de Respuestas
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: #fff;">${responses.length}</div>
                    </div>
                </div>
            </div>

            <div class="modern-card" style="margin-top: 2rem;">
                <div class="card-header-modern">
                    <div class="card-title-modern">
                        <i class="bi bi-person-lines-fill"></i>
                        Detalle por Usuario
                    </div>
                </div>
                ${Object.keys(userResponsesMap).map(userId => {
                    const userResponses = userResponsesMap[userId];
                    const user = usersMap[userId];

                    if (!user) return '';

                    // Get the latest response date
                    const latestResponse = userResponses.reduce((latest, current) => {
                        return new Date(current.submittedAt) > new Date(latest.submittedAt) ? current : latest;
                    });

                    return `
                        <div class="survey-item-modern">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h5>
                                        <i class="bi bi-person-circle" style="color: var(--primary);"></i> 
                                        ${user.fullName}
                                    </h5>
                                    <p style="margin-bottom: 0.75rem;">
                                        <i class="bi bi-envelope"></i> ${user.email}
                                    </p>
                                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                        <span class="badge-modern badge-primary-modern">
                                            <i class="bi bi-calendar-check"></i> 
                                            Última respuesta: ${new Date(latestResponse.submittedAt).toLocaleDateString('es-ES', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        <span class="badge-modern badge-secondary-modern">
                                            <i class="bi bi-file-earmark-check"></i> 
                                            ${userResponses.length} respuesta(s)
                                        </span>
                                        <span class="badge-modern ${user.roles.includes('Administrador') ? 'badge-secondary-modern' : 'badge-primary-modern'}">
                                            <i class="bi bi-shield-check"></i> 
                                            ${user.roles.join(', ')}
                                        </span>
                                    </div>

                                    ${userResponses.length > 1 ? `
                                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                                            <p style="color: var(--gray-400); font-size: 0.9rem; margin-bottom: 0.75rem;">
                                                <i class="bi bi-clock-history"></i> Historial de respuestas:
                                            </p>
                                            ${userResponses.map((resp, index) => `
                                                <div style="margin-left: 1rem; margin-bottom: 0.5rem;">
                                                    <span style="color: var(--gray-500); font-size: 0.85rem;">
                                                        ${index + 1}. ${new Date(resp.submittedAt).toLocaleDateString('es-ES', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Error loading survey responses:', error);
        document.getElementById('responsesContainer').innerHTML = `
            <div class="alert-modern alert-info-modern" style="margin-top: 2rem;">
                <i class="bi bi-exclamation-triangle"></i> Error al cargar las respuestas. Por favor, intenta de nuevo.
            </div>
        `;
    }
}
