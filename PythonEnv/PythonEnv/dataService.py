import google.cloud.firestore as gc
from google.oauth2 import service_account

from PythonEnv import app
from werkzeug.utils import secure_filename

import os

credentials = service_account.Credentials.from_service_account_file('serviceAccount.json')
db = gc.Client('tfgpablo-e55fb', credentials)

def getAllAlgorithm():
    return db.collection('algoritmos')

def getAllModels():
    return db.collection('modelos')

def findAlgoritmo(id):
    return db.collection('algoritmos').document(id).get().to_dict()

def findModelo(id):
    return db.collection('modelos').document(id).get().to_dict()

def findImage(id):
    return db.collection('images').document(id).get().to_dict()

def findImageByName(name):
    return db.collection('images').where("name", "==", name).limit(1)


def saveArchivo(file, folderPath):
    app.config['UPLOAD_FOLDER'] = folderPath
    path = os.path.dirname(file.filename)
    path2 = os.path.join(app.config['UPLOAD_FOLDER'], path)
    if not os.path.exists(path2):
        os.mkdir(path2)
    filename = os.path.join(path, secure_filename(os.path.basename(file.filename)))
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


def saveAlgoritmoBD(nombre):
    content = {
        'nombre' : nombre
    }
    db.collection('algoritmos').document().set(content)


def saveModeloBD(nombre):
    content = {
        'nombre' : nombre
    }
    db.collection('modelos').document().set(content)

#No en uso ahora mismo
def saveImageDB(name):
    content = {
        'name' : name
    }
    db.collection('images').document().set(content)