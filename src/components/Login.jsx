import { Fragment } from "react";
import { firebase } from "../Firebase"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, getAdditionalUserInfo } from "firebase/auth";
import { Button } from "react-bootstrap"
import {useNavigate, useLocation} from "react-router-dom"

export function Login() {

    const navigate = useNavigate()

    

    function loginRequest(token, name, email, isNew){
        const formData = new FormData();
		formData.append('name', name)
        formData.append('email',email)

        fetch(
            "http://localhost:5000/loginUser",
            {
            method: 'POST',
            headers:{ "Authorization": token},
            body: formData,
            }
        )
        .then(response => {
            return response.json()
        })
        .then(data => {
            localStorage.setItem("user", data['id'])
            if(data['admin']) {
                navigate("/admin/main")
                window.location.reload()
            } else {
                navigate("/main")
                window.location.reload()
            }
        })
    
    }

    function signWithGoogle(){
        const auth = getAuth()
        const provider = new GoogleAuthProvider()

        if(auth.currentUser) {
            signOut(auth)
        }

        signInWithPopup(auth, provider)
        .then((result) => {
            const name = result.user.displayName
            const email = result.user.email
            const isNew = getAdditionalUserInfo(result).isNewUser


            auth.currentUser.getIdToken()
            .then(data => {
                loginRequest(data, name, email, isNew)
            })

        })


    }

    return(
        <Fragment>
            <Button onClick={signWithGoogle}>Logueate</Button>
        </Fragment>
    )
}