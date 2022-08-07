import { Fragment } from "react";
import { ModelFilter } from "./components/ModelFilter";
import useFetch from './components/useFetch';
import { useNavigate } from "react-router-dom";

export default function MainPageAdmin(){
    const { data: algorithmsFetch, errorAlgorithms, isPendingAlgorithms } = useFetch('http://127.0.0.1:5000/getAllAlgorithms')

    const navigate = useNavigate()

    function goToAlgorithmDetails(model){
        navigate("/admin/algorithm/"+model.id)
    }
    
    return(
        <Fragment>
            <h2>Algorithms</h2>
            {algorithmsFetch && <ModelFilter models={algorithmsFetch} clickAction={goToAlgorithmDetails}></ModelFilter>}
        </Fragment>
    )
}