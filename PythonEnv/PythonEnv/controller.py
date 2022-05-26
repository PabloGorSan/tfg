from PythonEnv import app
from PythonEnv import business




from flask import request, render_template

PATH_MODELOS = './modelos'
PATH_ALGORITMOS = './algoritmos'
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

@app.route("/findImageByID/<idImage>")
def findImageByID(idImage):
    return business.findImageByID(str(idImage))

@app.route("/findImageByName/<nameImage>")
def findImageByName(nameImage):
    return business.findImageByName(str(nameImage))


@app.route("/clasificarAlgoritmo/<idAlg>/<idFoto>")
def clasificarUsandoAlgoritmo(idAlg, idFoto):
    return business.clasificarUsandoAlgoritmo(str(idAlg), idFoto)


@app.route("/classifyUsingModel/<idMod>/<idFoto>")
def clasificarUsandoModelo(idMod, idFoto):
    return business.clasificarUsandoModelo(str(idMod), idFoto)

@app.route("/classifyUsingModel", methods = ['POST'])
def classifyUsingModel():
    if request.method == 'POST':
        return business.classifyUsingModel(request.files, request.form['modelID'])


@app.route('/subirAlgoritmo', methods=['GET', 'POST'])
def subirAlgoritmo():
    if request.method == 'GET':
        return render_template('subirAlgoritmo.html')
    elif request.method == 'POST':
        return business.subirAlgoritmo(request.files, PATH_ALGORITMOS)


@app.route('/subirModelo', methods=['GET', 'POST'])
def subirModelo():
    if request.method == 'GET':
        return render_template('subirModelo.html')
    elif request.method == 'POST':
        return business.subirModelo(request.files, request.form['nombre'], PATH_MODELOS)


@app.route('/uploadImage', methods=['POST'])
def updloadImage():
    if request.method == 'POST':
        return business.uploadImage(request.files, PATH_IMAGES)

        