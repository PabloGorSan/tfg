from PythonEnv import app
from PythonEnv import business

from flask import request, render_template

PATH_MODELOS = './modelos'
PATH_ALGORITMOS = './algoritmos'

@app.route("/")
def home():
    return 'Hello world'


@app.route("/clasificarAlgoritmo/<idAlg>/<idFoto>")
def clasificarUsandoAlgoritmo(idAlg, idFoto):
    return business.clasificarUsandoAlgoritmo(str(idAlg), idFoto)


@app.route("/clasificarModelo/<idMod>/<idFoto>")
def clasificarUsandoModelo(idMod, idFoto):
    return business.clasificarUsandoModelo(str(idMod), idFoto)


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

        