import React, { useEffect, useState, useContext } from "react"
import { ServerContext } from "../App"
import { MAIN_URL } from "../keys.js"
import slideRock from "../assets/slidingRock.wav"
import Square from "./Sqaure.jsx"
import thump from "../assets/thump.wav"
import "./ChessGame.css"

const playThump = () => {
    new Audio(thump).play()
}
const playSlideRock = () => {

    new Audio(slideRock).play()
}

const url = MAIN_URL
const refreshRate = 1500
let maxAutoRefreshCalls = 20

const BOARD = [
    ["A8", "A7", "A6", "A5", "A4", "A3", "A2", "A1"],
    ["B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1"],
    ["C8", "C7", "C6", "C5", "C4", "C3", "C2", "C1"],
    ["D8", "D7", "D6", "D5", "D4", "D3", "D2", "D1"],
    ["E8", "E7", "E6", "E5", "E4", "E3", "E2", "E1"],
    ["F8", "F7", "F6", "F5", "F4", "F3", "F2", "F1"],
    ["G8", "G7", "G6", "G5", "G4", "G3", "G2", "G1"],
    ["H8", "H7", "H6", "H5", "H4", "H3", "H2", "H1"]
]


export default function ChessGame({ viewOnly }) {
    //const {gameID} = gameInfo

    const { loggedName, server, setServer, page, setPage, selectedGame } = useContext(ServerContext)

    const [clickOne, setClickOne] = useState("")
    const [clickTwo, setClickTwo] = useState("")

    const [cycle, setCycle] = useState(1)
    const [afk, setAfk] = useState(maxAutoRefreshCalls)


    const [blackPos, setBlackPos] = useState([])
    const [whitePos, setWhitePos] = useState([])

    const [gamePlayers, setGamePlayers] = useState([])
    const [playerNum, setPlayerNum] = useState(0)
    const [chat, setChat] = useState([])
  
    //sends move command to API
    useEffect(() => {
        console.log("MANUAL REFRESH")

        if (clickOne && clickTwo) {
            //setAfk(0)
            fetch(`${url}/move/${selectedGame}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "from": clickOne, "to": clickTwo })
            })
                .then(incoming => incoming.json())
                .then(data => {

                    setServer(data.message)
                    console.log("MANUAL response")
                    console.log(data)
                    passData(data)

                })
                .catch(console.error)
            setClickOne("")
        }
    }, [clickTwo])

    useEffect(() => {
        fetch(`${url}/getboard/${selectedGame}`)
            .then(response => response.json())
            .then(passData)
    }, [selectedGame])

    //auto refresh
    useEffect(() => {
        setTimeout(() => {

            if (afk > 0) {
                setAfk(afk - 1)
                console.log("Auto REFRESH")

                fetch(`${url}/getboard/${selectedGame}`)
                    .then(response => response.json())
                    .then(data => {

                        passData(data)
                        try {
                            if (gamePlayers[playerNum].includes("*")) exitPlayer()
                            setServer(data.message)
                        } catch {
                            console.error("Player kick montoring failed(or init start)...")
                        }
                    })
            }

            if (cycle > 0) setCycle(cycle - 1)
            else setCycle(1)
            
        }, refreshRate)
    }, [cycle])//perpetual and intentionally loops

    useEffect(() => {
        if (!viewOnly) estabilishPlayer()
    }, [])


    const handleActivity = (message) => {

        if (message === "●RESET●") chat.push(`${loggedName}: Wants to ♚ RESET ♚ the board`)
        else chat.push(`${loggedName}: ${message}`)

        fetch(`${url}/activity/${selectedGame}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: chat })
        })
            .then(incoming => incoming.json())
            .then(response => {
                    const { message } = response
                    setServer(response.message)
                 })
            .catch(console.error)
    }


    const passData = (data) => {

        setWhitePos([...data.whitePos])
        setBlackPos([...data.blackPos])
        setChat([...data.messages])
        setGamePlayers([...data.players])

    }


    const estabilishPlayer = () => {

        fetch(`${url}/getboard/${selectedGame}`)
            .then(response => response.json())
            .then(data => {

                setServer(`Joining ${loggedName}...`)

                passData(data)
                const { players } = data
                
                if (!players.includes(loggedName)) {
                   if (!players[1] && playerNum == 0) {
                        setPlayerNum(1)
                        players[1] = loggedName
                    }
                    else if (!players[2] && playerNum == 0) {
                        setPlayerNum(2)
                        players[2] = loggedName
                    }

                } else {
                    //handled with cron server mintoring
                    //this kick out handling is a temp inconvience and workaround
                    setPage(0)
                    setServer("User Conflict...")
                    return
                }

                fetch(`${url}/activity/${selectedGame}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ players })
                    })
                    .then(incoming => incoming.json())
                    .then(response => {
                        setServer(response.message)
                        // console.log("SENT UPDATE ACTIVITY")
                    })
                    .catch(console.error)
            })
    }

    const exitPlayer = () => {
        //console.log("LEAVING Player: ", playerNum)
    
        fetch(`${url}/exit/${selectedGame}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ exit: playerNum })
                })
                .then(incoming => incoming.json())
                .then(response => {
                    const { isSuccess } = response
                    setServer(response.message)
                    if (isSuccess) {
                        setPlayerNum(0)
                        setPage(0)
                    }
                })
                .catch(console.error)
    }


    return (
        <>

            <div className="chess-container" onClick={() => { setAfk(maxAutoRefreshCalls) }} >

                <div className="chess-header">
                    <button className="leave-btn" onClick={() => exitPlayer()}>Leave</button>
                    <p>{server || "Server"}</p>
                    <button className="game-btn">Game: {selectedGame}</button>
                </div>

                <h2>{gamePlayers[2] || "No Player..."}</h2>

                <div className="chess-board" onClick={playSlideRock}>
                    {
                        BOARD.map((row, i) => row.map((column, j) =>{
                        return <Square key={(Number(j) + Number(i))} pass={{ i, j, clickOne, setClickOne, clickTwo, setClickTwo, whitePos, blackPos }} />
                        }))
                     }
                </div>
                {/* <button className="" onClick={()=>(handleActivity("●RESET●"))}>RESET</button> */}
               
                <h2><div>{gamePlayers[1] || "No Player..."}</div></h2>
                <h3><div>{`Welcome ${loggedName}!` || "No User..."}</div></h3>

                <div className="message-container">
                    <article className="message-text">{
                        chat
                            ? chat.map(line => line + String.fromCharCode(15) + String.fromCharCode(10))
                            : "Game history empty"
                    }</article>
                    <input rows="1" onKeyDownCapture={e => {
                        if (e.key == "Enter"){
                            handleActivity(e.target.value)  
                            e.target.value=""
                         }
                    }} placeholder="Send message here"></input>
                </div>
            </div>
        </>
    )
}

