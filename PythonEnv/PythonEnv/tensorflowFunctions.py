import tensorflow as tf
from tensorflow import keras
import pandas as pd
import numpy as np
import imageio
from sklearn.metrics import roc_curve

BATCH_SIZE = 64
AUTO = tf.data.experimental.AUTOTUNE

def trainModel(modelID, modelPath, imagesPath, trainPath, valPath, testPath):

    train = pd.read_csv(trainPath)
    val = pd.read_csv(valPath)
    test = pd.read_csv(testPath)

    train_ds = load_ds(train, imagesPath)
    val_ds = load_ds(val, imagesPath)
    test_ds = load_ds(test, imagesPath)

    model = keras.models.load_model(modelPath)

    model.compile(
        optimizer=keras.optimizers.Adam(),
        loss=keras.losses.BinaryCrossentropy(),
        metrics=[keras.metrics.AUC(name="auc", curve='ROC')]
    )

    filepath = f'models/checkpoints/{modelID}'
    cb = tf.keras.callbacks.ModelCheckpoint(
        filepath = filepath,
        monitor="val_auc",
        verbose=0,
        save_best_only=True,
        save_weights_only=True,
        mode="max"
    )

    history = model.fit(train_ds,
                    epochs=10,
                    validation_data=val_ds,
                    validation_steps=10,
                    callbacks=[cb]
                   )

    model.load_weights(filepath)
    results = model.evaluate(test_ds)
    history.history['evaluation'] = results

    threshold = findThreshold(model, imagesPath, testPath)

    return model, history.history, threshold

def findThreshold(model, imagesPath, testPath):
    test = pd.read_csv(testPath)

    predictions_df = pd.DataFrame({'image_name': [],
                               'target': [],
                               'prediction':[]})

    for index, row in test.iterrows():
        name = row['image_name']
        image = imageio.v2.imread(f'{imagesPath}/{name}.jpg')
        image = np.expand_dims(image, axis=0)
        p = model(image).numpy()[0][0]
        new_row = pd.DataFrame({'image_name':[name],
                            'target':[row['target']],
                            'prediction':[p]})
        predictions_df = pd.concat([predictions_df, new_row])

    fpr, tpr, thresholds = roc_curve(predictions_df['target'],predictions_df['prediction'])

    gmeans = np.sqrt(tpr *(1-fpr))
    ix = np.argmax(gmeans)
    return thresholds[ix]

def decode(name, label):
    img = tf.io.read_file(name)
    img = tf.image.decode_jpeg(img, channels = 3)
    img = tf.cast(img, tf.float32)
    return img, label
    
def load_ds(df, imagesPath):
    options = tf.data.Options()
    options.experimental_deterministic = False
    imgs, labels = df["image_name"].values, df["target"].values
    imgs = [f'{imagesPath}/{name}.jpg' for name in imgs]
    ds = tf.data.Dataset.from_tensor_slices((imgs, labels))
    ds = ds.with_options(options)
    ds = ds.map(decode, num_parallel_calls=AUTO)
    ds = ds.cache()
    ds = ds.shuffle(2048)
    ds = ds.batch(BATCH_SIZE)
    ds = ds.prefetch(buffer_size=AUTO)
    return ds