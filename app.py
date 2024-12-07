import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Ваш Secret Key, полученный от Cloudflare Turnstile
SECRET_KEY = '0x4AAAAAAA1sETww02OxvNSOxeBnM7CQzJk'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        turnstile_token = data.get('cf_turnstile_response')

        # Верификация Turnstile
        verification_url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
        payload = {
            'secret': SECRET_KEY,
            'response': turnstile_token
        }
        response = requests.post(verification_url, data=payload)
        result = response.json()

        if not result.get('success'):
            return jsonify({"error": "Turnstile verification failed"}), 400

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Логика добавления в MailerLite или другую обработку
        return jsonify({"message": "Subscription successful"}), 201

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
