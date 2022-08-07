from flask import current_app, send_from_directory
import google.cloud.firestore as gc
from google.oauth2 import service_account
from google.oauth2 import id_token
from google.auth.transport import requests
from itertools import chain
from zipfile import ZipFile

from PythonEnv import app
from werkzeug.utils import secure_filename

import os

import firebase_admin
from firebase_admin import auth


credentials = service_account.Credentials.from_service_account_file('serviceAccount.json')
db = gc.Client('tfgpablo-e55fb', credentials)

def getAllAlgorithm():
    return db.collection('algoritmos').stream()

def getAllModels():
    return db.collection('modelos').stream()

def getAllDatasets():
    return db.collection('datasets').stream()

def findAlgorithm(id):
    return db.collection('algoritmos').document(id).get().to_dict()

def findModel(id):
    return db.collection('modelos').document(id).get().to_dict()

def findClass(id):
    return db.collection('classes').document(id).get().to_dict()

def findUser(id):
    return db.collection('users').document(id).get()

def findImage(id):
    return db.collection('images').document(id).get().to_dict()

def findImageByName(name):
    return db.collection('images').where("name", "==", name).limit(1)

def findModelsByUid(uid):
    return db.collection('modelos').where("userID", "==", uid).stream()

def findDataset(id):
    return db.collection('datasets').document(id).get().to_dict()


def saveFile(file, folderPath):
    app.config['UPLOAD_FOLDER'] = folderPath
    path = os.path.dirname(file.filename)
    path2 = os.path.join(app.config['UPLOAD_FOLDER'], path)
    if not os.path.exists(path2):
        os.mkdir(path2)
    filename = os.path.join(path, secure_filename(os.path.basename(file.filename)))
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

def downloadFile(id, folderPath):
    #Get path
    app.config['UPLOAD_FOLDER'] = folderPath
    absolutePath = "C:\\Users\\Usuario\\Desktop\\Pablo\\TFG\\PythonEnv"
    path = id
    path2 = os.path.join(app.config['UPLOAD_FOLDER'], path)
    path3 = os.path.join(absolutePath, path2)

    #Zip files
    zipObj = ZipFile('.\modelos\\zip_' + id + '.zip','w')
    for folderName, subfolders, filenames in os.walk(path3):
        for filename in filenames:
            filePath = os.path.join(folderName, filename)
            zipObj.write(filePath, os.path.basename(filePath))
    zipObj.close()

    #Send zip
    pathZip = os.path.join(absolutePath, app.config['UPLOAD_FOLDER'])
    return send_from_directory(pathZip, "zip_"+id+".zip")


def saveAlgorithmDB(filename, data):
    content = {
        'name' : data['name'],
        'type' : int(data['type']),
        'x' : int(data['x']),
        'y' : int(data['y']),
        'channel' : int(data['channel']),
        'filename' : filename
    }
    doc = db.collection('algoritmos').document()
    doc.set(content)
    return doc.id


def saveModelDB(data, threshold, classesIDs):
    
    content = {
        'name' : data['name'],
        'type' : int(data['type']),
        'x' : int(data['x']),
        'y' : int(data['y']),
        'channel' : int(data['channel']),
        'predictionFormat' : int(data['predictionFormat']),
        'numberClasses' : int(data['numberClasses']),
        'public': int(data['public']),
        'trained':int(data['trained']),
        'threshold' : float(threshold),
        'classesIDs' : classesIDs,
        'userID' : data['userID'],
        'validated': False
    }
    doc = db.collection('modelos').document()
    doc.set(content)
    return doc.id

def saveClassDB(name, desc):
    content = {
        'name' : name,
        'description' : desc
    }
    doc = db.collection('classes').document()
    doc.set(content)
    return doc.id

def saveUserDB(content, id):
    doc = db.collection('users').document(id)
    doc.set(content)
    return doc.id


#No en uso ahora mismo
def saveImageDB(name):
    content = {
        'name' : name
    }
    db.collection('images').document().set(content)

def filterAlgorithms(data):
    query = db.collection('algoritmos')

    docs = []

    if(data['validated'] == "true"):
        docs = chain(query.where('validated', '==', True).stream(), docs)
    if(data['nonValidated'] == "true"):
        docs = chain(query.where('validated', '==', False).stream(), docs)

    return list(docs)
    
def updateDB(id, data, table):
    ref = db.collection(table).document(id)
    ref.update(data)
    return ref.get().to_dict()

def verifyFirebaseToken(token):
    return id_token.verify_firebase_token(token, requests.Request(), "tfgpablo-e55fb")
    
