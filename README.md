# TFG

Aplicación web que controle algoritmos de clasificación subidos por los usuarios.
Memoria del TFG: [Ver PDF](./Pablo_Gordillo_Sanchez_Memoria.pdf)

# Contenido

src: Contiene los archivos jsx desarrollados para el cliente.
public: Contiene elementos varios del cliente, como el index.html
PythonEnv: Contiene la lógica en Python desarrollada para el servidor Flask.
jupyterModels: Contiene los jupyterNotebooks donde se han desarrollado los modelos de clasificación y se han tratado los datos del dataset.

Las carpetas src y public pertenecen al proyecto de cliente React. Para su uso, basta con crear un proyecto React y sustituir las carpetas creadas automáticamente por estas.

Las carpetas PythonEnv y jupyterModels pertenecen al proyecto del servidor. Para recrear todo el funcionamiento del servidor se debe crear un entorno virtual e instalar todas las dependencias que vienen especificadas, así como descargar los datasets de ISIC para realizar el entrenamiento. En un proyecto de Flask, PythonEnv y jupyterModels se colocan al mismo nivel que el entorno virtual.
