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
            showNotification('Please make sure your email is correct', 'warning');
            return;
        }
    
        try {
            const response = await fetch('https://connect.mailerlite.com/api', {
                method: 'POST',
                headers: {
                    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZmM0Y2VjOWM5OWY5MDg2MWJkYWQ4ZmQ3ZmQ2NWE0YThmYWQ3MjIzZDgzZWQ2ZTA3NGQ5NDY0YmY4OTZiNTc3NTU3NzM5MzFiOWIyYjE2NmUiLCJpYXQiOjE3MzM0OTU5NTkuOTQ5MzYxLCJuYmYiOjE3MzM0OTU5NTkuOTQ5MzYzLCJleHAiOjQ4ODkxNjk1NTkuOTQ0Mjg4LCJzdWIiOiIxMjMzOTA5Iiwic2NvcGVzIjpbXX0.t0lgr8BqoedPFn8AQ8aFMdS4awvdg7LbxG6JeW9BQnfmbbkURaEbA5EQS7brxi_f4nrvW-BAU4DXiCov4ed022OtM68H5RiE4ZPlVcYrGKj7BgHXo9YsCmO_a9ZQTt8-gSJQc6mfhcziLPlpimPZS8iTxjtHeevaqPqxwFu1xP62K9Dma01ATI0ErM-Xp0sSmffUesM-ISeLIp1LwtMD2731Fe8-YW3rDKCEKOJ18lo4cT7z_IDpqjEWEmOK5y6h-lhUP5JGw9QRE3hvVW2Wy78iRepU0CD2pLN-xrr2ohT_qota07ioE9xhZWKpYuQZctWqymJT2rUfDA3hoVQzHDgqWsyt5lbU3vegx5KVHqE0MiubcrTHmggKVV_BcEnhusR3q6bof1QVFRrBZrhlS7wwZ6WONn68GrOPwsmrFo1ile5pJ0O9GiiXNUiImsk7XXLqGsVvQNy8Popm2GNJ6QOOggZHl1H_c2XHwNE_RtKJSjRTF4Su8qCwURks5IoQQLtXYRBPNFvV6QnXf4mW8u0WPp7HDs7anSlSBzTyaLc-ugw2CXWZ32p5Vmr5B785x2b_IQfHVtM9zVi3xnbG7AV_klZq-4M1j3Q0U599_NK2NoiVEsfiZP4Nkh0z9P--HdQKEwnS29k3aav-kBZCQIf3A9wARDVSQmpgk-HrXhk', // Обновите токен
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Добавлен заголовок Accept
                },
                body: JSON.stringify({
                    email: email,
                    groups: ['139980850416584063']
                })
            });
    
            const responseData = await response.json(); // Парсим JSON ответа ay1

            console.log('Full Response Status:', response.status);
            console.log('Full Response Text:', responseText);
    
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