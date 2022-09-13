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
    if uid == "null":
        return {"admin" : False}
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
    if uid == "null" :
        return []
    else :
        return collectionToJSON(dataService.findModelsByUid(uid))

def findPublicModels():
    return collectionToJSON(dataService.findPublicModels())

def findAllowedModels(uid, args):
    allowed = []
    for i in dataService.getAllModels():
        resp = i.to_dict()
        if (resp['userID'] == uid or resp['public'] == 1) and (args['forceValidated'] == 'false' or resp['validated'] == True):
            resp['id'] = i.id
            allowed.append(resp)
    return jsonify(allowed)


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
    model['trained'] = 2
    dataService.updateDB(data['modelID'],model,'modelos')
    dataset = dataService.findDataset(data['datasetID'])
    modelPath = "./modelos/"+data['modelID']+"/"+os.listdir("./modelos/"+data['modelID'])[0]
    

    modelTrained, history, threshold= tensorflowFunctions.trainModel(data['modelID'],
                                                                    modelPath, 
                                                                    dataset['imagesPath'], 
                                                                    dataset['trainPath'], 
                                                                    dataset['valPath'], 
                                                                    dataset['testPath'])
    model['trained'] = 0
    dataService.updateDB(data['modelID'],model,'modelos')

    model['classesIDs'] = dataset['classesIDs']
    model['trained'] = 1
    model['validated'] = True
    model['count'] = model['count'] + 1
    model['name'] = model['name']+"_v" + str(model['count'])
    newModelID = dataService.saveModelDB(model, model['count'], model['datasets'], threshold, dataset['classesIDs'])
    savePath = "./modelos/"+newModelID+"/"+os.listdir("./modelos/"+data['modelID'])[0]
    modelTrained.save(savePath)
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

    savedID = dataService.saveModelDB(data, 1, [], threshold, classesIDs)
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

def filterModels(data):
    return collectionToJSON(dataService.filterModels(data))

def loginUser(token, data):
    decodedToken = dataService.verifyFirebaseToken(token)
    uid = decodedToken['user_id']

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

