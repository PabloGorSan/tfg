import { AlgorithmDetails } from "./components/AlgorithmDetails";
import { Fragment, useState  } from "react";
import { useParams } from "react-router-dom";
import useFetch from './components/useFetch';


export default function AlgorithmPageAdmin(){

    const { id } = useParams()
    const { data: algorithmData, errorAlgorithm, isPendingAlgorithm } = useFetch('http://127.0.0.1:5000/findAlgorithmByID/' + id.toString())
    const { data: userData, errorUser, isPendingUser } = useFetch('http://127.0.0.1:5000/findUserByID/' + localStorage.getItem("user"))

    return (
        <Fragment>
            {algorithmData && userData &&
            <div>
                <AlgorithmDetails data={algorithmData} validateButton={userData['admin']} algorithmID={id}/>
                
            </div>
            }
        </Fragment>
    )
}