import { Fragment, useState } from "react";
import {useNavigate} from "react-router-dom"

export default function Upload(){

    const [selectedFile, setSelectedFile] = useState()
    const [selectedFile2, setSelectedFile2] = useState([])
    const [isFilePicked, setIsFilePicked] = useState(false)
    const [isFilePicked2, setIsFilePicked2] = useState(false)

    const [modelName, setModelName] = useState()
    const navigate = useNavigate()

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

    const changeHandler2 = (event) => {
		setSelectedFile2(event.target.files);
		setIsFilePicked2(true);
	};

    const changeHandlerName= (event) => {
        setModelName(event.target.value)
    }

    const handleSubmission = () => {
        const formData = new FormData();

		formData.append('file', selectedFile)

		fetch(
			"http://localhost:5000/subirAlgoritmo",
			{
				method: 'POST',
				body: formData,
			}
		)
	};

    const handleSubmission2 = (event) => {
        event.preventDefault()
        const formData = new FormData();

        for (let i = 0; i < selectedFile2.length; i++) {
            formData.append(`file[${i}]`, selectedFile2[i])
        }
        formData.append('nombre', modelName)

		fetch(
			"http://localhost:5000/subirModelo",
			{
				method: 'POST',
				body: formData,
			}
		)
        
	};
    return(
        <Fragment>
            <h2>Hey</h2>
            <div>
                <input type="file" name="file" onChange={changeHandler} />
                {isFilePicked ? (
                    <div>
                        <p>Filename: {selectedFile.name}</p>
                        <p>Filetype: {selectedFile.type}</p>
                        <p>Size in bytes: {selectedFile.size}</p>
                        <p>
                            lastModifiedDate:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p>Select a file to show details</p>
                )}
                <div>
                    <button onClick={handleSubmission}>Submit</button>
                </div>
            </div>

            <h3>Submit de react</h3>
            <div>
                <input type="file" name="file" webkitdirectory="" mozdirectory="" onChange={changeHandler2} />
                Introduce el nombre del fichero
                <input type = "text" name = "nombre" required onChange={changeHandlerName}/>
                <div>
                    <button onClick={handleSubmission2}>Submit</button>
                </div>
            </div>
        </Fragment>
    )
}