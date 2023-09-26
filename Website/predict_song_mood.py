import json
import base64
from requests import post, get
import pandas as pd
import numpy as np
import tensorflow as tf
import os
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent


def get_token(client_id, client_secret):
    auth_string = client_id + ':' + client_secret
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = str(base64.b64encode(auth_bytes), 'utf-8')

    url = 'https://accounts.spotify.com/api/token'
    headers = {
        'Authorization': 'Basic ' + auth_base64,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data = {'grant_type': 'client_credentials'}

    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result['access_token']
    return token


def get_auth_header(token):
    return {'Authorization': 'Bearer ' + token}


def search_for_track(token, spotifySearch):
    url = 'https://api.spotify.com/v1/search'
    query = f'?q={spotifySearch}&type=track&limit=1'
    query_url = url + query

    headers = get_auth_header(token)

    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)
    return json_result


def get_audio_futures(token, spotifySearch):
    track_info = search_for_track(token, spotifySearch)
    try:
        track_id = track_info['tracks']['items'][0]['id']
    except:
        return None

    url = 'https://api.spotify.com/v1/audio-features'
    query = f'?ids={track_id}'
    query_url = url + query

    headers = get_auth_header(token)

    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)
    print(json_result)
    return json_result['audio_features'][0]


def predict_song_mood(token, spotifySearch):
    audio_futures = get_audio_futures(token, spotifySearch)
    if audio_futures is None:
        return 'Please Pass In Song data'
    audio_data = pd.DataFrame({
        'valence': audio_futures['valence'],
        'energy': audio_futures['energy'],
        'acousticness': audio_futures['acousticness']
    }, index=[0])

    mood_names = [
        'Angry',
        'Bored',
        'Calm',
        'Content',
        'Delighted',
        'Depressed',
        'Excited',
        'Frustrated',
        'Happy',
        'Relaxed',
        'Tense',
        'Tired',
    ]

    zeros = np.zeros(12)
    fillout = tf.data.Dataset.from_tensor_slices(zeros)

    audio_data = tf.data.Dataset.from_tensor_slices((
        audio_data[['valence', 'energy']],
        audio_data[['acousticness']]
    ))

    sample_dataset = tf.data.Dataset.zip((audio_data, fillout)).batch(32).prefetch(tf.data.AUTOTUNE)

    print(os.path.join(os.path.join(BASE_DIR, 'Website/static/'), "model"))
    model = tf.keras.models.load_model(os.path.join(os.path.join(BASE_DIR, 'Website/static/'), "model"), compile=False)

    model_sample_pred_prob = model.predict(sample_dataset)
    model_sample_pred = np.argmax(model_sample_pred_prob, axis=1)

    return mood_names[model_sample_pred[0]]
