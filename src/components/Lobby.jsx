import { useState, useContext, useEffect } from "react"
import { ServerContext } from "../App"
import { MAIN_URL } from "../keys.js"
import Match from "./Match"
import ChessGame from "./ChessGame"
import "./Lobby.css"

const url = MAIN_URL

export default function Lobby() {

    const { setLoggedName} = useContext(ServerContext)
    const [games, setGames] = useState([])

    const getLobby = () => {
        fetch(`${url}/getlobby`)
            .then(incoming => incoming.json())
            .then(data => {
                setGames([...data.lobbies])
            })
            .catch(console.error)
    }

    useEffect(() => {
        getLobby()
    }, [])


    return (
        <>
            <div className="cover-game">
            <ChessGame viewOnly={1}/>
            </div>
                    <div className="lobby-container">
                        <button className="logout-btn" onClick={()=>{setLoggedName(0)}}>LOGOUT</button>
                        <button className="refresh-btn" onClick={getLobby}>Refresh</button>
                            <div>{games.map(lobby => (
                                lobby.boardID
                                ?<Match key={lobby.boardID} lobby={lobby} />
                                :""))}</div>
                    </div>
        </>
    )
}