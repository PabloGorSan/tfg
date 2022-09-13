import { ModelDetails } from "./components/ModelDetails";
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import {Form, Row, Col, Button, Collapse} from "react-bootstrap"
import useFetch from './components/useFetch';
import download from "downloadjs";
import { LineChart } from "./components/LineChart";
import { color, CHART_COLORS, transparentize } from "./components/Utils";
import { DatasetList } from "./components/DatasetList"
import { PredictionClassesList } from "./components/PredictionClassesList";

export default function ModelPage(){
    
    const { id } = useParams()

    const { data: modelData, errorModel, isPendingModel } = useFetch('http://127.0.0.1:5000/findModelByID/' + id.toString())
    const { data: userData, errorUser, isPendingUser } = useFetch('http://127.0.0.1:5000/findUserByID/' + localStorage.getItem("user"))
    const { data: datasetsData, errorDatasetss, isPendingDatasets } = useFetch('http://127.0.0.1:5000/getAllDatasets')

    function downloadZip(){
        var fetchURL = "http://localhost:5000/downloadModel/"+id
        fetch(fetchURL,
            {
            method: 'GET'
            }
        ).then((res) => {return res.blob()})
        .then(blob =>{
          download(blob, 'model_'+ id +'.zip', 'application/zip');
        })
    }

    function loadChart(){
        const data = {
            labels: Array.from(Array((modelData['history']['auc'].length)).keys()),
            datasets: [{
                label: 'Area under ROC curve train set',
                data: modelData['history']['auc'],
                fill: false,
                borderColor: CHART_COLORS.red,
                backgroundColor: transparentize(CHART_COLORS.red, 0.5),
                tension: 0.2
                },
                {
                label: 'Area under ROC curve validation set',
                data: modelData['history']['val_auc'],
                fill: false,
                borderColor: CHART_COLORS.blue,
                backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
                tension: 0.2,
                type:'line'
                },
                {
                label: 'Evaluation',
                data: [modelData['history']['val_auc'][1]],
                fill: false,
                borderColor: CHART_COLORS.green,
                backgroundColor: transparentize(CHART_COLORS.green, 0.5),
                tension: 0.2,
                type:'bar'
                }]
            };

        return data
    }

    function options(){
        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
        return options
    }

    return (
        <Fragment>
        {modelData && userData && datasetsData &&
        <div>
            <Row>
                <h1>{modelData['name']}</h1>
                <Col>
                    <h2>Classificator Data</h2>
                    <div className="classificator-data">
                        <ModelDetails data={modelData}  validateButton={userData['admin']} modelID={id} /> 
                    </div>
                </Col>
                <Col>
                    <h2>Classes</h2>
                    <PredictionClassesList classes={modelData['classesIDs']}/>
                </Col>
            </Row>
            <br/>
            <Row>
                {modelData['history'] != null && <LineChart chartData={loadChart()} charOptions={options()}></LineChart>}
            </Row>
            <Row>
                <Col>
                {userData['admin'] == true && 
                <div className="classificator-data">
                    <div className="validate-button">
                        <p>Dataset Validation</p>
                        <DatasetList datasets ={datasetsData} modelID={id} activatedDatasets={modelData['datasets']}></DatasetList>
                        <br/>
                        <Button onClick={downloadZip}>Download</Button>
                    </div>
                </div>

                }
                </Col>
                <Col></Col>
            </Row>
        </div>
        }

        </Fragment>
    )
}