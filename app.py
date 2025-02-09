from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://starsync.io"}})

API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZmM0Y2VjOWM5OWY5MDg2MWJkYWQ4ZmQ3ZmQ2NWE0YThmYWQ3MjIzZDgzZWQ2ZTA3NGQ5NDY0YmY4OTZiNTc3NTU3NzM5MzFiOWIyYjE2NmUiLCJpYXQiOjE3MzM0OTU5NTkuOTQ5MzYxLCJuYmYiOjE3MzM0OTU5NTkuOTQ5MzYzLCJleHAiOjQ4ODkxNjk1NTkuOTQ0Mjg4LCJzdWIiOiIxMjMzOTA5Iiwic2NvcGVzIjpbXX0.t0lgr8BqoedPFn8AQ8aFMdS4awvdg7LbxG6JeW9BQnfmbbkURaEbA5EQS7brxi_f4nrvW-BAU4DXiCov4ed022OtM68H5RiE4ZPlVcYrGKj7BgHXo9YsCmO_a9ZQTt8-gSJQc6mfhcziLPlpimPZS8iTxjtHeevaqPqxwFu1xP62K9Dma01ATI0ErM-Xp0sSmffUesM-ISeLIp1LwtMD2731Fe8-YW3rDKCEKOJ18lo4cT7z_IDpqjEWEmOK5y6h-lhUP5JGw9QRE3hvVW2Wy78iRepU0CD2pLN-xrr2ohT_qota07ioE9xhZWKpYuQZctWqymJT2rUfDA3hoVQzHDgqWsyt5lbU3vegx5KVHqE0MiubcrTHmggKVV_BcEnhusR3q6bof1QVFRrBZrhlS7wwZ6WONn68GrOPwsmrFo1ile5pJ0O9GiiXNUiImsk7XXLqGsVvQNy8Popm2GNJ6QOOggZHl1H_c2XHwNE_RtKJSjRTF4Su8qCwURks5IoQQLtXYRBPNFvV6QnXf4mW8u0WPp7HDs7anSlSBzTyaLc-ugw2CXWZ32p5Vmr5B785x2b_IQfHVtM9zVi3xnbG7AV_klZq-4M1j3Q0U599_NK2NoiVEsfiZP4Nkh0z9P--HdQKEwnS29k3aav-kBZCQIf3A9wARDVSQmpgk-HrXhk"  # Замените на ваш токен
MAILERLITE_URL = "https://connect.mailerlite.com/api/subscribers"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        group_id = data.get('group_id', '139980850416584063')

        if not email:
            return jsonify({"error": "Email is required"}), 400

        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        payload = {
            "email": email,
            "groups": [group_id]
        }

        response = requests.post(MAILERLITE_URL, headers=headers, json=payload)
        response_data = response.json()

        if response.status_code == 201:
            return jsonify({"message": "Subscriber added successfully", "data": response_data}), 201
        else:
            return jsonify({"error": response_data.get('message', 'Unknown error')}), response.status_code

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
