// ==================== CONFIGURACIÓN ====================

// Cargar datos del usuario en la vista de configuración
function loadSettingsView() {
    if (!currentUser) return;

    // Cargar nombre y email
    document.getElementById('settingsFullName').value = currentUser.fullName || '';
    document.getElementById('settingsEmail').value = currentUser.email || '';
    
    // Cargar rol
    document.getElementById('settingsUserRole').textContent = currentUser.role || 'Usuario';
    
    // Cargar fecha de creación (si está disponible)
    if (currentUser.createdAt) {
        const createdDate = new Date(currentUser.createdAt);
        document.getElementById('settingsCreatedAt').textContent = createdDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('settingsCreatedAt').textContent = 'No disponible';
    }
}

// Actualizar perfil
document.addEventListener('DOMContentLoaded', function() {
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('settingsFullName').value;

            try {
                const userId = currentUser.id || currentUser.userId;

                console.log('Actualizando perfil para usuario:', userId);
                console.log('Nuevo nombre:', fullName);

                const response = await authenticatedFetch(`${API_URL}/api/users/${userId}/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: fullName,
                        email: currentUser.email
                    })
                });

                console.log('Response status:', response.status);
                console.log('Response content-type:', response.headers.get('content-type'));

                // Verificar el tipo de contenido de la respuesta
                const contentType = response.headers.get('content-type');

                if (!response.ok) {
                    let errorMessage = 'Error al actualizar el perfil';

                    // Intentar leer el error
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            console.error('Error parsing JSON error:', e);
                            const textError = await response.text();
                            errorMessage = textError || errorMessage;
                        }
                    } else {
                        const textError = await response.text();
                        errorMessage = textError || errorMessage;
                    }

                    throw new Error(errorMessage);
                }

                // Parsear respuesta exitosa
                let result;
                if (contentType && contentType.includes('application/json')) {
                    try {
                        result = await response.json();
                        console.log('Update result:', result);
                    } catch (e) {
                        console.warn('Response OK but not JSON, assuming success');
                        result = { message: 'Perfil actualizado exitosamente' };
                    }
                } else {
                    console.warn('Response is not JSON, assuming success');
                    result = { message: 'Perfil actualizado exitosamente' };
                }

                // Actualizar el usuario en el contexto local
                currentUser.fullName = fullName;
                document.getElementById('userWelcome').textContent = `Hola, ${fullName}`;

                // Mostrar mensaje de éxito
                showSettingsNotification(result.message || '¡Perfil actualizado exitosamente!', 'success');
            } catch (error) {
                console.error('Error updating profile:', error);
                showSettingsNotification('Error al actualizar el perfil: ' + error.message, 'error');
            }
        });
    }

    // Cambiar contraseña
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validar que las contraseñas coincidan
            if (newPassword !== confirmPassword) {
                showSettingsNotification('Las contraseñas no coinciden', 'error');
                return;
            }

            // Validar longitud mínima
            if (newPassword.length < 6) {
                showSettingsNotification('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }

            try {
                console.log('Intentando cambiar contraseña...');

                const response = await authenticatedFetch(`${API_URL}/api/auth/change-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });

                console.log('Response status:', response.status);
                console.log('Response content-type:', response.headers.get('content-type'));

                // Verificar el tipo de contenido de la respuesta
                const contentType = response.headers.get('content-type');

                if (!response.ok) {
                    let errorMessage = 'Error al cambiar la contraseña';

                    // Intentar leer el error
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            console.error('Error parsing JSON error:', e);
                        }
                    } else {
                        const textError = await response.text();
                        errorMessage = textError || errorMessage;
                    }

                    throw new Error(errorMessage);
                }

                // Parsear respuesta exitosa
                let result;
                if (contentType && contentType.includes('application/json')) {
                    try {
                        result = await response.json();
                        console.log('Success result:', result);
                    } catch (e) {
                        console.warn('Response OK but not JSON, assuming success');
                        result = { message: 'Contraseña cambiada exitosamente' };
                    }
                } else {
                    console.warn('Response is not JSON, assuming success');
                    result = { message: 'Contraseña cambiada exitosamente' };
                }

                // Limpiar formulario
                changePasswordForm.reset();

                // Mostrar mensaje de éxito
                showSettingsNotification(result.message || '¡Contraseña cambiada exitosamente!', 'success');
            } catch (error) {
                console.error('Error changing password:', error);

                // Verificar si es un error de endpoint no encontrado
                if (error.message.includes('404') || error.message.includes('Not Found')) {
                    showSettingsNotification('Esta funcionalidad requiere reiniciar la aplicación. Por favor, reinicia el servidor.', 'error');
                } else {
                    showSettingsNotification('Error: ' + error.message, 'error');
                }
            }
        });
    }
});

// Mostrar notificaciones en la página de configuración
function showSettingsNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-modern alert-${type}-modern`;
    alertDiv.style.cssText = 'position: fixed; top: 100px; right: 2rem; z-index: 10000; animation: slideInRight 0.4s ease;';
    alertDiv.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// ==================== AYUDA ====================

// Cargar vista de ayuda
function loadHelpView() {
    // La vista de ayuda es estática, no necesita cargar datos
    console.log('Vista de ayuda cargada');
}
