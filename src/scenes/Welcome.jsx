import "./Welcome.css"

export default function Welcome({setWelcome}){

    return(
        <>
        <div className="welcome-container">

        <h1 className="greeting">Call it Chess!</h1>
        <button className="call-to-action" onClick={()=>setWelcome(1)}>Click to PLAY!</button>
        </div>
        </>
    )
}