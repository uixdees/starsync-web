from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Разрешение CORS для взаимодействия с фронтендом

# Ваш API-токен MailerLite
API_TOKEN = "ваш_токен"
MAILERLITE_URL = "https://connect.mailerlite.com/api/subscribers"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        # Получение данных из запроса
        data = request.get_json()
        email = data.get('email')
        group_id = data.get('group_id', '139980850416584063')  # ID группы по умолчанию

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Формируем запрос к MailerLite
        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        payload = {
            "email": email,
            "groups": [group_id]
        }

        # Отправка запроса на MailerLite
        response = requests.post(MAILERLITE_URL, headers=headers, json=payload)
        response_data = response.json()

        if response.status_code == 201:  # Подписчик успешно добавлен
            return jsonify({"message": "Subscriber added successfully", "data": response_data}), 201
        else:
            return jsonify({"error": response_data.get('message', 'Unknown error')}), response.status_code

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
