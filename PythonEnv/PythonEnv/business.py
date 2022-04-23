from PythonEnv import dataService
import tensorflow as tf
from tensorflow import keras
import numpy as np
import subprocess
from werkzeug.utils import secure_filename

def clasificarUsandoAlgoritmo(idAlg, idFoto):
    algDic = dataService.findAlgoritmo(idAlg)
    comp = './.venv/Scripts/python'
    path = 'C:/Users/Usuario/PycharmProjects/algoritmoClasificacion/' + algDic['nombre']
    param = idFoto

    url = comp + ' ' + path + ' ' + param
    
    p = subprocess.Popen(url,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True)

    out,err=p.communicate()
    p.stdin.close()
    return out


def clasificarUsandoModelo(idMod, idFoto):
    modDic = dataService.findModelo(idMod)
    new_model = tf.keras.models.load_model('./modelos/' + modDic['nombre'])

    #Carga del dataset, debería ser de otra forma cuando esté el dataset final
    fashion_mnist = keras.datasets.fashion_mnist
    (train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()

    train_images = train_images / 255.0
    test_images = test_images / 255.0

    img = test_images[int(idFoto)]
    img = (np.expand_dims(img,0))

    #Clasificacion
    predictions_single = new_model.predict(img)
    return str(np.argmax(predictions_single[0]))


def subirAlgoritmo(files, folderPath):
    file = files['file']

    dataService.saveArchivo(file, folderPath)
    dataService.saveAlgoritmoBD(secure_filename(file.filename))
    return 'OK'


def subirModelo(files, nombreNuevo, folderPath):
    filesList = files.getlist('file[]')
    nombreActual = filesList[0].filename.rsplit(sep='/')[0]
    
    for file in filesList:
        file.filename = file.filename.replace(nombreActual, nombreNuevo)
        dataService.saveArchivo(file, folderPath)
        
    dataService.saveModeloBD(nombreNuevo)
    return "OK"
