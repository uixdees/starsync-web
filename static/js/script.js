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
            const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
                method: 'POST',
                headers: {
                    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNTU5NzMwMWE1MjgwM2RhMWU5NDc0ZTM4NjRjOTBiYWI1ZDUzMmY5MDNjYTI5N2NhYjM0ZDU5MjRiNDFhMzVkZWIzMDcxMGJhOGJmYzYwNDMiLCJpYXQiOjE3MzM1NTgxNTAuMzI4NDIyLCJuYmYiOjE3MzM1NTgxNTAuMzI4NDI1LCJleHAiOjQ4ODkyMzE3NTAuMzI0MDEzLCJzdWIiOiIxMjMzOTA5Iiwic2NvcGVzIjpbXX0.NFO6j_4Nu0QFTFDn5-CDjG079Ob9oSw4cLTzVKQ12b52eFIs-fE3QI93rYcpK6FhnB_Mmqm6qsShfzJLa8oWV7SEmXQNkV8Erlo4_0t55k_5MW0fmgwPS-TyyGr4R4wVbm3GTaEmWG_xBOWk38P-C7Tu6U9QiyyzLPJ7F1MXvjiGD712JS9gvF664_si9CPQbIBiaeJt_pklwSnPeA6guGqbyKhBS5Wj1KeJEb7DR7FXTWTG45DWjeI141svMMINP7jSzgcCTeH4i0n-4Xpo4TnTxC1SCXHzQKqAJ7fmXAmu-yoV5h16IM6pn9qrVzNv3WxTqt8hFqYdwqPyzB1NrLQWySbfH4FzWDch_zpY5mBT2hUJb-XHR5otjMP3u2wbdxn0HNzrkZPpXAT0BucanSteCq1iug2pcC_2TStIetwXc4m_Pgs9desv0bh4-6g3k-AYOxgai2LK9-Qle3vVoXJiOb9JkPiMuwJyNpbY_vVcCHbvJrhoOPXKs6yFmEJwox5lq0kT1OT-pxnWDCXSCQYIzyhlbOYEXkmKoJxP40goXk-PzuREn02L-CnLkzeqkUDpYm93LVfh4GYOxBFELfe1Fn6TejPQPYtTZ5zaJ2TA4U7GvvsH9bnKkXS4WRdZIbrT9J3rPK-yM_hYKz9xn96vARch6c4ho_87Q3UAWgg', // Обновите токен
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Добавлен заголовок Accept
                },
                body: JSON.stringify({
                    email: email,
                    groups: ['betatesters']
                })
            });
    
            const responseData = await response.json(); // Парсим JSON ответа

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