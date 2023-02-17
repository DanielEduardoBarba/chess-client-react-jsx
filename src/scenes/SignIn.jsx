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
   

    
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
   const _user = await signInWithEmailAndPassword(auth,email,pass)
   console.log("RECIEVED: " , email, pass)
        console.log(" USER: ", _user)
    .then(_user=>{
        //setServer(`Welcome ${_user}`)
        console.log("***********", _user.user.displayName)

       setLoggedName(_user.user.displayName)

    })
    .catch(console.log("UHHHHHHHHHHHHs"))
        

}

export default function SignIn(){
       const {setServer, loggedName, setLoggedName} = useContext(ServerContext)
       const[email,setEmail] = useState("")
       const[pass,setPass] = useState("")

return(
    <>
    <div className="signin-container" >

        <form className="email-container" onSubmit={()=>{logInWithEmail(setLoggedName, email, pass)}}>
            <h1>Log In</h1>
            <p>(loggedName)</p>
            <input className="form-inputs" onChange={e=>setEmail(e.target.value)} type="email" name="email" placeholder="email"></input>
            <input className="form-inputs"  onChange={e=>setPass(e.target.value)} type="password" name="password" placeholder="password"></input>
            <button className="form-inputs">Sign In</button>
              
        </form>
        <button className="google-btn" onClick={()=>{logInWithGoogle(setLoggedName)}} type="primary" />
    </div>
    </>
)

}