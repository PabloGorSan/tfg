from PythonEnv import app
from PythonEnv import business

from flask import request, render_template

PATH_MODELS = './modelos'
PATH_ALGORITHMS = './algoritmos'
PATH_IMAGES = './imagenes'

@app.route("/")
def home():
    return 'Hello world'

@app.route("/getAllAlgorithms")
def getAllAlgorithms():
    return business.getAllAlgorithms()

@app.route("/getAllModels")
def getAllModels():
    return business.getAllModels()

@app.route("/getAllDatasets")
def getAllDatasets():
    return business.getAllDatasets()

@app.route("/findAlgorithmByID/<idAlg>")
def findAlgorithmByID(idAlg):
    return business.findAlgorithmByID(str(idAlg))

@app.route("/findModelByID/<idModel>")
def findModelByID(idModel):
    return business.findModelByID(str(idModel))

@app.route("/findClassByID/<idClass>")
def findClassByID(idClass):
    return business.findClassByID(str(idClass))

@app.route("/findImageByID/<idImage>")
def findImageByID(idImage):
    return business.findImageByID(str(idImage))

@app.route("/findImageByName/<nameImage>")
def findImageByName(nameImage):
    return business.findImageByName(str(nameImage))

@app.route("/findModelsByUid/<uid>")
def findModelsByUid(uid):
    return business.findModelsByUid(str(uid))

@app.route("/findAllowedModels/<uid>")
def findAllowedModels(uid):
    return business.findAllowedModels(str(uid),request.args.to_dict())

@app.route("/findUserByID/<uid>")
def findUser(uid):
    return business.findUserByID(str(uid))

@app.route("/clasificarAlgoritmo/<idAlg>/<idFoto>")
def clasificarUsandoAlgoritmo(idAlg, idFoto):
    return business.clasificarUsandoAlgoritmo(str(idAlg), idFoto)

#No utilizado en este momento
@app.route("/classifyUsingModel/<idMod>/<idFoto>")
def clasificarUsandoModelo(idMod, idFoto):
    return business.clasificarUsandoModelo(str(idMod), idFoto)

@app.route("/classifyUsingModel", methods = ['POST'])
def classifyUsingModel():
    if request.method == 'POST':
        return business.classifyUsingModel(request.files, request.form['modelID'])

@app.route("/trainModel", methods= ['POST'])
def trainModel():
    if request.method == 'POST':
        return business.trainModel(request.form)


@app.route('/uploadAlgorithm', methods=['GET', 'POST'])
def uploadAlgorithm():
    if request.method == 'GET':
        return render_template('subirAlgoritmo.html')
    elif request.method == 'POST':
        return business.uploadAlgorithm(request.files, request.form, PATH_ALGORITHMS)


@app.route('/uploadModel', methods=['GET', 'POST'])
def uploadModel():
    if request.method == 'GET':
        return render_template('subirModelo.html')
    elif request.method == 'POST':
        return business.uploadModel(request.files, request.form, PATH_MODELS)


@app.route('/uploadImage', methods=['POST'])
def updloadImage():
    if request.method == 'POST':
        return business.uploadImage(request.files, PATH_IMAGES)

@app.route('/filterAlgorithms', methods=['POST'])
def filterAlgorithms():
    if request.method == 'POST':
        return business.filterAlgorithms(request.form)

@app.route('/changeValidation', methods=['GET'])
def changeValidation():
    if request.method == 'GET':
        return business.changeValidation(request.args.to_dict())

@app.route('/activateDataset', methods=['GET'])
def activateDataset():
    if request.method == 'GET':
        return business.activateDataset(request.args.to_dict())

@app.route('/loginUser', methods=['POST'])
def loginUser():
    if request.method == 'POST':
        token = request.headers["Authorization"]
        return business.loginUser(token, request.form)

@app.route('/downloadModel/<id>', methods=['GET'])
def downloadModel(id):
    if request.method == 'GET':
        return business.downloadModel(str(id), "modelos")

        