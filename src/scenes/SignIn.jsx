import { initializeApp } from "firebase/app"
import {getAuth, signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider} from "firebase/auth"
import { useContext } from "react"
import { ServerContext } from "../App"
import {firebaseConfig} from "../keys.js"
import "./SignIn.css"


const logInWithGoogle = async (setLoggedName, setServer) =>{
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth,provider)
    .then(_user=>{
        //setServer(`Welcome ${_user}`)
        setLoggedName(_user.user.displayName)

    })
        //setLoggedInUser(_user.user)
}

export default function SignIn(){
       const {setServer,setLoggedName} = useContext(ServerContext)

return(
    <>
        <div className="signin-container">
            <h1>Log In</h1>
            <input className="form-inputs" name="email" placeholder="email"></input>
            <input className="form-inputs" name="password" placeholder="password"></input>
            <button className="form-inputs">Sign In</button>
              
        <button className="google-btn" onClick={()=>{
                logInWithGoogle(setLoggedName, setServer)}} type="primary" />
        </div>
    </>
)

}