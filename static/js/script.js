document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email-input');
    const emailLabel = document.querySelector('.input-wrapper label');
    const clearInputIcon = document.querySelector('.clear-input-icon');
    const submitBtn = document.querySelector('.submit-btn');
    const hintIcon = document.querySelector('.hint-icon');
    const notification = document.querySelector('.notification');
    const contentBlock = document.querySelector('.content-block');
    const closeIcon = document.querySelector('.hint-overlay .close-icon');

    clearInputIcon.style.display = 'none';

    emailInput.addEventListener('input', () => {
        clearInputIcon.style.display = emailInput.value ? 'flex' : 'none';
    });

    clearInputIcon.addEventListener('click', () => {
        emailInput.value = ''; 
        clearInputIcon.style.display = 'none';
        emailInput.focus();
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = 'notification'; 
        
        switch(type) {
            case 'success':
                notification.classList.add('notification-success');
                break;
            case 'warning':
                notification.classList.add('notification-warning');
                break;
            case 'error':
                notification.classList.add('notification-error');
                break;
        }
        
        notification.style.display = 'flex';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    hintIcon.addEventListener('click', () => {
        const hintOverlay = document.querySelector('.hint-overlay');
        hintOverlay.style.display = 'flex';
    });

    closeIcon.addEventListener('click', () => {
        const hintOverlay = document.querySelector('.hint-overlay');
        hintOverlay.style.display = 'none';
    });

    submitBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
    
        if (!validateEmail(email)) {
            showNotification('Please make sure your email is correct', 'warning');
            return;
        }

        try {
            const turnstileToken = document.querySelector('.cf-turnstile').dataset.response; // Получаем token от Turnstile
            
            if (!turnstileToken) {
                showNotification('Please complete the security check', 'error');
                return;
            }

            // Отправляем запрос напрямую в MailerLite API
            const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_API_TOKEN', // Замените на ваш токен MailerLite
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    groups: ['139980850416584063'], // ID группы
                    cf_turnstile_response: turnstileToken // Отправляем token Turnstile для верификации
                })
            });

            const responseData = await response.json();

            if (response.ok) {
                showNotification('Email successfully sent', 'success');
                console.log('Subscription successful:', responseData);
            } else {
                showNotification(`Error: ${responseData.message || 'Failed to subscribe'}`, 'error');
                console.error('Subscription failed:', responseData);
            }
        } catch (error) {
            showNotification('Network error. Please try again.', 'error');
            console.error('Submission error:', error);
        }
    });
});
