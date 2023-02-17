import React, { useEffect, useState, useContext } from "react"
import { MAIN_URL } from "../keys.js"
import "./ChessGame.css"
import thump from "../assets/thump.wav"
import slideRock from "../assets/slidingRock.wav"
import { ServerContext } from "../App"

const playThump = () => {
    new Audio(thump).play()
}
const playSlideRock = () => {

    new Audio(slideRock).play()
}

const url = MAIN_URL
const refreshRate = 1000
let maxAutoRefreshCalls = 5

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


export default function ChessGame({viewOnly}) {
    //const {gameID} = gameInfo

    const { loggedName, setLoggedName, server, setServer,page, setPage, selectedGame, setSelectedGame } = useContext(ServerContext)

    const [clickOne, setClickOne] = useState("")
    const [clickTwo, setClickTwo] = useState("")
    const [moves, setMoves] = useState(0)
    
    const [realTime, setRealTime] = useState(true)
    const [throttle, setThrottle] = useState(1)
    const [cycle, setCycle] = useState(1)
    const [afk, setAfk] = useState(maxAutoRefreshCalls)


    const [blackPos, setBlackPos] = useState([])
    const [whitePos, setWhitePos] = useState([])
    const [gameData, setGameData] = useState({})
    const [chat, setChat] = useState([])
    const [playerNum, setPlayerNum] = useState(0)
    const [gamePlayers, setGamePlayers] = useState([])
    const [userComment, setUserComment] = useState("")

    //sends move command to API
    useEffect(() => {
        // if (throttle) {


        console.log("MANUAL REFRESH")
        if (clickOne && clickTwo) {
            fetch(`${url}/move/${selectedGame}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "from": clickOne, "to": clickTwo })
                })
                .then(incoming => incoming.json())
                .then(data => {
                    const { message } = data
                    setServer(data.message)
                    
                    //setMoves(moves + 1)
                    //setServer(server)
                    
                    console.log(data)
                    setWhitePos([...data.whitePos])
                    setBlackPos([...data.blackPos])
                    setChat([...data.messages])
                    setGamePlayers([...data.players])

                    //console.log("SENT MOVE and RETURNED")

                })
                .catch(console.error)
            setClickOne("")
        }
        // }
        // setClickOne("")
        // setThrottle(0)
        // console.log(throttle)
        // console.log(clickOne)

    }, [clickTwo])

    //MANUAL updates board with board AFTER a change in black or white positions
    // useEffect(() => {
    //     fetch(`${url}/getboard/${selectedGame}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             // console.log("OK")
    //             // console.log(data.blackPos,"--BLACK--",blackPos)
    //             // console.log(data.whitePos,"--WHITE--",whitePos)
    //             // if(data.blackPos != blackPos || data.whitePos != whitePos){

    //             //console.log("BOARD CAME BACK!!!", data, "BOARD CAME BACK!!!!")
    //             setBlackPos([...data.blackPos])
    //             setWhitePos([...data.whitePos])
    //             setChat([...data.messages])
    //             setGameData({...data})
    //             // }
    //         })
    //         .catch(console.alert)
    // }, [moves])

    useEffect(()=>{
        fetch(`${url}/getboard/${selectedGame}`)
                    .then(response => response.json())
                    .then(data => {
                        setBlackPos([...data.blackPos])
                        setWhitePos([...data.whitePos])
                        setChat([...data.messages])
                        setGamePlayers([...data.players])
                        //setServer("Opponent moved!")
                    })
    },[selectedGame])

    //auto refresh
    useEffect(() => {
        setTimeout(() => {

            if (afk > 0) {
                setAfk(afk - 1)
                console.log("Auto REFRESH")
                fetch(`${url}/getboard/${selectedGame}`)
                    .then(response => response.json())
                    .then(data => {
                        setBlackPos([...data.blackPos])
                        setWhitePos([...data.whitePos])
                        setChat([...data.messages])
                        setGamePlayers([...data.players])
                        
                       // setServer("Opponent moved!")
                    })
            }

            if (cycle > 0) setCycle(cycle - 1)
            else {

                setCycle(1)

            }


        }, refreshRate)
        // console.log(throttle)
        // console.log(clickOne)
        // console.log(clickTwo)
    }, [cycle])//perpetual and intentionally loops

    useEffect(()=>{
        console.log("VIEWONLY", viewOnly)
       if(!viewOnly) estabilishPlayer()
    },[])


    const handleActivity = (message) => {
        if(message="●RESET●")chat.push(`${loggedName}: Wants to ♚ RESET ♚ the board`)
        else chat.push(`${loggedName}: ${message}`)
        fetch(`${url}/activity/${selectedGame}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: chat  })
        })
            .then(incoming => incoming.json())
            .then(response => {
                const { message } = response
                // console.log(response)
                setServer(response.message)

                // setMoves(moves + 1)
                // console.log("SENT UPDATE ACTIVITY")

            })
            .catch(console.error)

    }
    const estabilishPlayer = () => {
        fetch(`${url}/getboard/${selectedGame}`)
        .then(response => response.json())
        .then(data => {
            setBlackPos([...data.blackPos])
            setWhitePos([...data.whitePos])
            setChat([...data.messages])
            setServer(`Joining ${loggedName}...`)

            const {players} =data
            console.log("PLAYER CHECK: ",!players.includes(loggedName),"LOGNAME: ", loggedName)
            if(!players.includes(loggedName)){
                console.log("PLayer came with this logic: ",!players.includes(loggedName))
                if(!players[1] && playerNum==0){
                    console.log("Player IDed as #1")
                    setPlayerNum(1)
                    players[1]=loggedName
                }
                else if(!players[2] && playerNum==0){
                    console.log("Player IDed as #2")
                    setPlayerNum(2)
                    players[2]= loggedName
                }

            }else {
                    setPage(0)
                    setServer("User Conflict...")
                    return
            }
            
           
                        fetch(`${url}/activity/${selectedGame}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({players})
                        })
                            .then(incoming => incoming.json())
                            .then(response => {
                                const { message } = response
                                // console.log(response)
                                setServer(response.message)
                
                                // setMoves(moves + 1)
                                // console.log("SENT UPDATE ACTIVITY")
                
                            })
                            .catch(console.error)
        })
    }

    const exitPlayer = () =>{
        console.log("LEAVING Player: ",playerNum)
        // let players=[]
        // if(playerNum==1){
        //     players[1]=""
        //     console.log("Player 1 is leaving")
            
        // }
        // if(playerNum==2) {
        //     players[2]=""
        //     console.log("Player 2 is leaving")
        // } 
        
       // console.log(players)
        fetch(`${url}/exit/${selectedGame}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({exit: playerNum})
        })
        .then(incoming => incoming.json())
        .then(response => {
            const { isSuccess } = response
            console.log(response)
            setServer(response.message)
            console.log("isSuccess: ", isSuccess)
            if(isSuccess){
                setPlayerNum(0)
                setPage(0)
                console.log("Left GAME")

            }
                // setMoves(moves + 1)

            })
            .catch(console.error)



    }


    return (
        <>

            <div className="chess-container" onClick={() => { setAfk(maxAutoRefreshCalls) }} >
                <div className="chess-header">
                    <button className="leave-btn" onClick={()=>exitPlayer()}>Leave</button>
                    <p>{server || "Server"}</p>
                    <button className="game-btn">Game: {selectedGame}</button>
                </div>

                <h2>{gamePlayers[1] || "No Player..."}</h2>
                <div className="chess-board" onClick={playSlideRock}>
                    {
                        BOARD.map((row, i) => row.map(
                            (column, j) =>
                                (Number(j) + Number(i)) % 2
                                    ? <button key={String(j) + String(i)} className="blackSquare" onClick={() => {

                                        if (clickOne !== "") {
                                            setClickTwo(String(j) + String(i))
                                            setThrottle(1)
                                        }
                                        else setClickOne(String(j) + String(i))


                                    }} id={String(j) + String(i)}>{placePieces(j, i, whitePos, blackPos)}</button>

                                    : <button key={String(j) + String(i)} className="whiteSquare" onClick={() => {

                                        if (clickOne !== "") {
                                            setClickTwo(String(j) + String(i))
                                            setThrottle(1)
                                        }
                                        else setClickOne(String(j) + String(i))


                                    }} id={String(j) + String(i)}>{placePieces(j, i, whitePos, blackPos)}</button>
                        ))
                    }
                </div>
                <button className="" onClick={()=>(handleActivity("●RESET●"))}>RESET</button>
               <h2><div>{gamePlayers[2] || "No Player..."}</div></h2>
               <h3><div>{`Welcome ${loggedName}!` || "No User..."}</div></h3>
             

                <div className="message-container">
                    <article className="message-text">{
                        chat
                            ? chat.map(line => line + String.fromCharCode(15) + String.fromCharCode(10))
                            : "Game history empty"
                    }</article>
                    <input rows="1" onChange={e => setUserComment(e.target.value)} onKeyDownCapture={e => {
                        if (e.key == "Enter") {
                            const pass = e.target.value
                            e.target.value = ""
                            handleActivity(pass)
                            e.target.value = ""
                        }
                    }} placeholder="Send message here"></input>
                </div>


                {/* <button onClick={() => {
                    //console.log("HI")
                    fetch(`${url}/getboard/${selectedGame}`)
                        .then(incoming => incoming.json())
                        .then(data => {
                            //console.log("OK")
                            //console.log(data)
                            setBlackPos([...data.blackPos])
                            setWhitePos([...data.whitePos])
                            setGameData({...data})
                        })
                }}>REFRESH</button>
                <br />

                <br /> */}
                {/* <br />
                <button onClick={() => {
                    //console.log("HI")
                    fetch(`${url}/resetboard/${selectedGame}`)
                        .then(incoming => incoming.json())
                        .then(response => {
                            //console.log(response)
                            setServer(response.message)
                            setMoves(0)
                        })
                }}>RESET board</button> */}

            </div>
        </>
    )
}

const wPieces = "♟♟♟♟♟♟♟♟♜♞♝♛♚♝♞♜"
const bPieces = "♙♙♙♙♙♙♙♙♖♘♗♕♔♗♘♖"

const placePieces = (j, i, whitePos, blackPos) => {
    const wPiece = whitePos.filter(el => el == String(j) + String(i))
    const bPiece = blackPos.filter(el => el == String(j) + String(i))
    const wIndex = whitePos.indexOf(wPiece[0])
    const bIndex = blackPos.indexOf(bPiece[0])

    if (wPiece != "") {
        //console.log("WHITE: ", wPiece)
        return wPieces[wIndex]
    }
    if (bPiece != "") {
        //console.log("BLACK: ", bPiece)
        return bPieces[bIndex]
    }

}





