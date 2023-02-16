import { useContext } from "react"
import { ServerContext } from "../App"
import "./Match.css"

export default function Match({lobby}){

   const {setRemoteRefresh, setPage, selectedGame,setSelectedGame} = useContext(ServerContext)
   

    return(
        <>
        <div className="match" onClick={()=>{setSelectedGame(lobby.boardID)}}>
            <article>Game: {lobby.boardID}</article>
            <div>P1: {lobby.players[1]}</div>
            <div>P2: {lobby.players[2]}</div>
        </div>
        {   lobby.players[1]=="" || lobby.players[2]==""
            ?<button className="enter-btn" onClick={() => {
                setSelectedGame(lobby.boardID)
                setPage(lobby.boardID)
            }}>JOIN GAME</button> 
            :<button className="enter-btn-no" >GAME FULL</button>
        }
        </>
    )
}