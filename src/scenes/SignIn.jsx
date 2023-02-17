import { initializeApp } from "firebase/app"
import {getAuth, signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider} from "firebase/auth"
import { useContext, useState } from "react"
import { ServerContext } from "../App"
import {firebaseConfig} from "../keys.js"
import "./SignIn.css"


const logInWithGoogle = async (setLoggedName) =>{
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth,provider)
    .then(_user=>{
        //setServer(`Welcome ${_user}`)
        setLoggedName(_user.user.displayName)

    })
    .catch(console.error)
        //setLoggedInUser(_user.user)
}

const logInWithEmail = async (setLoggedName, email, pass ) =>{
   
    console.log(email,"***********", pass)
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    signInWithEmailAndPassword(auth,email,pass)
    .then(_user=>{
        //setServer(`Welcome ${_user}`)
        console.log("***********", _user.user.email)

       setLoggedName(_user.user.email)

    })
    .catch(console.error)
        

}

export default function SignIn(){
       const {setServer, loggedName, setLoggedName} = useContext(ServerContext)
       const[email,setEmail] = useState("")
       const[pass,setPass] = useState("")

return(
    <>
    <div className="signin-container" >

        <form className="email-container">
            <h1>Log In</h1>
            <input className="form-inputs" onChange={e=>setEmail(e.target.value)} type="email" name="email" placeholder="email"></input>
            <input className="form-inputs"  onChange={e=>setPass(e.target.value)} type="password" name="password" placeholder="password"></input>
            <button className="form-inputs" onClick={()=>{logInWithEmail(setLoggedName, email, pass)}} >Sign In</button>      
        </form>
        <button className="google-btn" onClick={()=>{logInWithGoogle(setLoggedName)}} type="primary" />
    </div>
    </>
)

}