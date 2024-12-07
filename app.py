from flask import Flask, render_template
from flask_talisman import Talisman

app = Flask(__name__)

# Вариант 1: Полная настройка с Talisman
talisman = Talisman(
    app,
    content_security_policy={
        'default-src': '\'self\'',
        'script-src': [
            '\'self\'', 
            '\'unsafe-inline\'', 
            'https://cdnjs.cloudflare.com'
        ],
        'style-src': [
            '\'self\'', 
            '\'unsafe-inline\''
        ],
        'img-src': [
            '\'self\'', 
            'data:'
        ]
    },
    content_security_policy_nonce_in=['script-src']
)