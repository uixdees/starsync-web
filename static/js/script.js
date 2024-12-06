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

    function simulateCloudflareVerification() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 1000);
        });
    }

    submitBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            showNotification('There was an error when sending an email', 'warning');
            return;
        }

        try {
            const verified = await simulateCloudflareVerification();

            if (verified) {
                showNotification('Email successfully sent', 'success');
            } else {
                showNotification('Please make sure your email is correct', 'error');
            }
        } catch (error) {
            showNotification('Please make sure your email is correct', 'error');
        }
    });
});