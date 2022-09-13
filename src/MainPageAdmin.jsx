import { Fragment } from "react";
import { ModelFilter } from "./components/ModelFilter";
import useFetch from './components/useFetch';
import { useNavigate } from "react-router-dom";

export default function MainPageAdmin(){
    const { data: modelsFetch, errorModels, isPendingModels } = useFetch('http://127.0.0.1:5000/getAllModels')

    const navigate = useNavigate()

    function goToModelDetails(model){
        navigate("/model/"+model.id)
    }
    
    return(
        <Fragment>
            <div className="web-content">
                <h1>Models</h1>
                {modelsFetch && <ModelFilter models={modelsFetch} clickAction={goToModelDetails} badge={true}></ModelFilter>}
            </div>
        </Fragment>
    )
}