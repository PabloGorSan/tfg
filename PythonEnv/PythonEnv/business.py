from PythonEnv import dataService
from PythonEnv import tensorflowFunctions
import tensorflow as tf
import tensorflow_io as tfio
from tensorflow import keras
import numpy as np
import subprocess
from flask import jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import MultiDict
import os

import matplotlib.pyplot as plt
import imageio


def getAllAlgorithms():
    return collectionToJSON(dataService.getAllAlgorithm())

def getAllModels():
    return collectionToJSON(dataService.getAllModels())

def getAllDatasets():
    return collectionToJSON(dataService.getAllDatasets())

def findAlgorithmByID(idAlg):
    return dataService.findAlgorithm(idAlg)

def findModelByID(idModel):
    return dataService.findModel(idModel)

def findClassByID(idClass):
    return dataService.findClass(idClass)

def findUserByID(uid):
    return dataService.findUser(uid).to_dict()

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

def findModelsByUid(uid):
    return collectionToJSON(dataService.findModelsByUid(uid))

def findAllowedModels(uid, args):
    allowed = []
    for i in dataService.getAllModels():
        resp = i.to_dict()
        if (resp['userID'] == uid or resp['public'] == 1) and (args['forceValidated'] == 'false' or resp['validated'] == True):
            resp['id'] = i.id
            allowed.append(resp)
    return jsonify(allowed)

def clasificarUsandoAlgoritmo(idAlg, idFoto):
    algDic = dataService.findAlgorithm(idAlg)
    comp = './.venv/Scripts/python'
    path = './algoritmoClasificacion/' + algDic['filename']
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

#No esta en uso ahora mismo
def clasificarUsandoModelo(idMod, idFoto):
    #Cargar el modelo
    modDic = dataService.findModel(idMod)
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
    modDic = dataService.findModel(idMod)
    PATH = './modelos/' + idMod
    modelName = os.listdir(PATH)[0]
    model = tf.keras.models.load_model(f'{PATH}/{modelName}')

    #Ajustar la imagen a los parametros de entrada del modelo
    image = changeImageParameters(image, modDic)

    #Clasificacion
    predictions_single = model(image).numpy()
    if(modDic['predictionFormat'] == 1): #Binary probability
        result = 0 if predictions_single[0][0] < modDic['threshold'] else 1
        dict = {"result" : result,
                "classID" : modDic['classesIDs'][result]
                }   
    elif(modDic['predictionFormat'] == 2 or modDic['predictionFormat'] == 4): #Multicategorical probability y One-Hot Encoded
        dict = {"result" : str(np.argmax(predictions_single[0])),
                "classID" : str(np.argmax(predictions_single[0]))
                } 
    elif(modDic['predictionFormat'] == 3): #Integer Encoded
        dict = {"result" : str(predictions_single[0][0]),
                "classID" : str(predictions_single[0][0])
                } 
    return jsonify(dict)

def trainModel(data):
    model = dataService.findModel(data['modelID'])
    dataset = dataService.findDataset(data['datasetID'])
    modelPath = "./modelos/"+data['modelID']+"/"+os.listdir("./modelos/"+data['modelID'])[0]
    savePath = "./modelos/"+data['modelID']+"_v2/"+os.listdir("./modelos/"+data['modelID'])[0]

    history, threshold= tensorflowFunctions.trainModel(data['modelID'], modelPath, savePath, dataset['imagesPath'], dataset['trainPath'], dataset['valPath'], dataset['testPath'])
    model['classesIDs'] = dataset['classesIDs']
    model['trained'] = 1
    model['name'] = model['name']+"_v2"
    newModelID = dataService.saveModelDB(model, threshold, dataset['classesIDs'])
    content = {
        'history' : history
    }
    dataService.updateDB(newModelID, content, 'modelos')
    return history

def uploadAlgorithm(files, data, folderPath):
    file = files['file']
    file.filename = data['name'] + "/" + file.filename
    dataService.saveFile(file, folderPath)
    savedID = dataService.saveAlgorithmDB(file.filename, data)
    dict = {"id" : savedID}
    return jsonify(dict)

def uploadModel(files, data, folderPath):
    #Guardar clases en la base de datos
    classesIDs = []
    threshold = 0
    if int(data['trained']) == 1:
        threshold = data['threshold']
        names = data['classesNames'].split(",")
        descs = data['classesDescs'][:-3].split("/nd,")
        for i in range(int(data['numberClasses'])):
            classesIDs.append(dataService.saveClassDB(names[i], descs[i]))

    savedID = dataService.saveModelDB(data, threshold, classesIDs)
    #Guardar en local
    for file in MultiDict(files):
        fileDataStructure = MultiDict(files).getlist(file)[0]
        fileDataStructure.filename = str(savedID) + "/" + fileDataStructure.filename
        dataService.saveFile(fileDataStructure, folderPath)
    
    dict = {"id" : savedID}
    
    return jsonify(dict)


def uploadModelFolder(files, data, folderPath):
    for file in MultiDict(files):
        fileDataStructure = MultiDict(files).getlist(file)[0]
        currentName = fileDataStructure.filename.rsplit(sep='/')[0]
        fileDataStructure.filename = fileDataStructure.filename.replace(currentName, data['name'])
        dataService.saveFile(fileDataStructure, folderPath)
        
    savedID = dataService.saveModelDB(data)
    dict = {"id" : savedID}
    return jsonify(dict)


#No en uso ahora mismo
def uploadImage(files, folderPath):
    file = files['image']

    dataService.saveFile(file, folderPath)
    dataService.saveImageDB(secure_filename(file.filename))
    return "OK"

def filterAlgorithms(data):
    return collectionToJSON(dataService.filterAlgorithms(data))

def loginUser(token, data):
    
    decodedToken = dataService.verifyFirebaseToken(token)
    print(decodedToken)
    uid = decodedToken['user_id']
    print(uid)

    doc = dataService.findUser(uid)
    if(doc.exists):
        content = doc.to_dict()
        content['id'] = doc.id
        return jsonify(content)
    else:
        content = {
            'name' : data['name'],
            'email' : data['email'],
            'admin' : False
        }
        savedID = dataService.saveUserDB(content, uid)
        content['id'] = savedID
        return jsonify(content)

def downloadModel(id, folderPath):
    return dataService.downloadFile(id, folderPath)

def changeValidation(args):
    data = {
        "validated" : args['validated'] == "true"
    }
    if args['table'] == 'models':
        return dataService.updateDB(args['id'], data, 'modelos')
    else:
        return dataService.updateDB(args['id'], data, 'algoritmos')

def activateDataset(args):
    model = dataService.findModel(args['modelID'])
    activated = args['activated'] == "true"
    if activated:
        model['datasets'].append(args['datasetID'])
        model['datasets'] = sorted(set(model['datasets']))
    else:
        model['datasets'].remove(args['datasetID'])
    

    return dataService.updateDB(args['modelID'], model, 'modelos')


#Metodos auxiliares    

def collectionToJSON(collection):
    d = []
    for i in collection:
        resp = i.to_dict()
        for key, value in resp.items(): resp.update({key : str(value)})
        resp.update({"id":i.id})
        d.append(resp)
       
    return jsonify(d)   

#Hay que añadir las distintas combinaciones de rgb-gbr-gray...
def changeImageParameters(image, data):
    image = tf.image.resize(image,(data['x'],data['y']))
    if(data['channel'] == 1):
        image = tfio.experimental.color.rgb_to_grayscale(image)
    image = (np.expand_dims(image,0))
    return image




def verifyUser(uid, id):
    return uid == id

