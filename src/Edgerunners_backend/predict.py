import sys
import tensorflow as tf
import numpy as np
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

model_path = 'C:/Users/varga/Documents/Actividades/Jesus.js/React/CopAlert/crime_prediction_model.h5'  
try:
    model = tf.keras.models.load_model(model_path)
except Exception as e:
    print(f'Error al cargar el modelo: {e}')
    sys.exit(1)

def predict_risk(latitude, longitude):
    input_data = np.array([[latitude, longitude]])
    predicted_risk = model.predict(input_data)

    threshold = 0.5  
    risk_level = "bajo" if predicted_risk[0][0] >= threshold else "alto"

    return risk_level

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Uso: predict.py <latitude> <longitude>')
        sys.exit(1)

    try:
        latitude = float(sys.argv[1])
        longitude = float(sys.argv[2])
    except ValueError:
        print('Latitud y longitud deben ser números.')
        sys.exit(1)

    try:
        risk_level = predict_risk(latitude, longitude)
        print(f'Nivel de riesgo predicho: {risk_level}')
    except Exception as e:
        print(f'Error al hacer la predicción: {e}')







