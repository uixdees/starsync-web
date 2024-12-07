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

        // Использование функции hideNotification вместо анонимной функции
        setTimeout(hideNotification, 3000);
    }

    // Функция для скрытия уведомления
    function hideNotification() {
        notification.style.display = 'none';
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
            const serverUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5000' 
                : 'https://starsync.herokuapp.com'; // Замените на ваш серверный URL

            const response = await fetch(`${serverUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    group_id: '139980850416584063' // ID группы
                })
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                showNotification('Email successfully sent', 'success');
                console.log('Subscription successful:', responseData);
            } else {
                showNotification(`Error: ${responseData.error || 'Failed to subscribe'}`, 'error');
                console.error('Subscription failed:', responseData);
            }
        } catch (error) {
            showNotification('Network error. Please try again.', 'error');
            console.error('Submission error:', error);
        }
    });
});
