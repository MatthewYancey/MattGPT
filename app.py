from flask import Flask, render_template, redirect, url_for, request, session, jsonify
from api_assistant import Assistant, Assistant_Test
import os

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY')
# assistant = Assistant_Test(3)
assistant = Assistant()

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route('/')
def index():
    if 'chat_log' not in session:
        session['chat_log'] = ['']
    print(session['chat_log'])
    return render_template('index.html', chat_log='\n'.join(session['chat_log']))

@app.route('/path-to-ajax-handler', methods=['POST'])
def ajax_handler():
    data = request.json
    user_message = data['message']
    assistant_response = assistant.submit_message(user_message)
    print(f'Assitant response {assistant_response}')
    return jsonify({'response': assistant_response})

if __name__ == '__main__':
    app.run(debug=True)
