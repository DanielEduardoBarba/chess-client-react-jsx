import { useState, useContext, useEffect } from "react"
import { ServerContext } from "../App"
import { MAIN_URL } from "../keys.js"
import Match from "./Match"
import "./Lobby.css"
import ChessGame from "./ChessGame"

const url = MAIN_URL

export default function Lobby() {

    const { page, setPage } = useContext(ServerContext)
    const { setLoggedName, selectedGame, setSelectedGame } = useContext(ServerContext)
    const [cycle, setCycle] = useState(1)

    const [games, setGames] = useState([])
    const [con, setCon] = useState("")

    const getLobby = () => {
        // console.log("GETTING LOBBY")
        // console.log(`${url}/getlobby`)
        // setCon( con +"#")
        fetch(`${url}/getlobby`)
            .then(incoming => incoming.json())
            .then(data => {
                // console.log("LOBBY GOT BACK")
                // console.log(data)
                //setCon( con +"$")
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
                <ChessGame viewOnly={1} />
            </div>
            {/* <p>{con || " console"}</p> */}
            <div className="lobby-container">
                <button className="logout-btn" onClick={() => { setLoggedName(0) }}>LOGOUT</button>
                <button className="refresh-btn" onClick={getLobby}>Refresh</button>
                <div>{games.map(lobby => (
                    lobby.boardID
                        ? <Match key={lobby.boardID} lobby={lobby} />
                        : ""))}</div>
            </div>


            {/* <button className="join-btn" onClick={() => {
                        if()
                        setPage(selectedGame)
                         }}>JOIN GAME</button> */}


        </>
    )
}