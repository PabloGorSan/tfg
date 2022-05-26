from PythonEnv import dataService
import tensorflow as tf
import tensorflow_io as tfio
from tensorflow import keras
import numpy as np
import subprocess
from flask import jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import MultiDict

import matplotlib.pyplot as plt
import imageio

def getAllAlgorithms():
    return collectionToJSON(dataService.getAllAlgorithm())

def getAllModels():
    return collectionToJSON(dataService.getAllModels())

def findImageByID(id):
    return dataService.findImage(id)

def findImageByName(name):
    image = "a"
    for i in dataService.findImageByName(name).stream():
        resp = i.to_dict()
        for key, value in resp.items(): resp.update({key : str(value)})
        resp.update({"id":i.id})
        image = resp

    return image

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

#No en uso ahora mismo
def clasificarUsandoModelo(idMod, idFoto):
    #Cargar el modelo
    modDic = dataService.findModelo(idMod)
    new_model = tf.keras.models.load_model('./modelos/' + modDic['nombre'])

    #Cargar la imagen a clasificar
    imageData = dataService.findImage(idFoto)
    image = imageio.imread('./imagenes/'+imageData["name"])

    #Ajustar la imagen a los parametros de entrada del modelo
    image = tf.image.resize(image,(28,28))
    image = tfio.experimental.color.rgb_to_grayscale(image)

    image = (np.expand_dims(image,0))

    #Clasificacion
    predictions_single = new_model.predict(image)
    dict = {"result" : str(np.argmax(predictions_single[0]))}
    return jsonify(dict)

def classifyUsingModel(files, idMod):
    #Cargar la imagen a clasificar
    image = imageio.imread(files['image'])

    #Cargar el modelo
    modDic = dataService.findModelo(idMod)
    new_model = tf.keras.models.load_model('./modelos/' + modDic['nombre'])

    #Ajustar la imagen a los parametros de entrada del modelo
    image = tf.image.resize(image,(28,28))
    image = tfio.experimental.color.rgb_to_grayscale(image)

    image = (np.expand_dims(image,0))

    #Clasificacion
    predictions_single = new_model.predict(image)
    dict = {"result" : str(np.argmax(predictions_single[0]))}
    return jsonify(dict)

def subirAlgoritmo(files, folderPath):
    file = files['file']

    dataService.saveArchivo(file, folderPath)
    dataService.saveAlgoritmoBD(secure_filename(file.filename))
    return 'OK'


def subirModelo(files, nombreNuevo, folderPath):

    for file in MultiDict(files):
        fileDataStructure = MultiDict(files).getlist(file)[0]

        nombreActual = fileDataStructure.filename.rsplit(sep='/')[0]
        fileDataStructure.filename = fileDataStructure.filename.replace(nombreActual, nombreNuevo)
        dataService.saveArchivo(fileDataStructure, folderPath)
        
    dataService.saveModeloBD(nombreNuevo)
    return "OK"

#No en uso ahora mismo
def uploadImage(files, folderPath):
    file = files['image']

    dataService.saveArchivo(file, folderPath)
    """dataService.saveImageDB(secure_filename(file.filename))"""
    return "OK"

def collectionToJSON(collection):
    d = []
    for i in collection.stream():
        resp = i.to_dict()
        for key, value in resp.items(): resp.update({key : str(value)})
        resp.update({"id":i.id})
        d.append(resp)
       
    return jsonify(d)   