import { useState, createContext } from 'react'
import ChessGame from './components/ChessGame'
import Lobby from './components/Lobby'
import './App.css'
import Welcome from './scenes/Welcome'
import SignIn from './scenes/SignIn'

export const ServerContext = createContext(null)

function App() {
  const [page, setPage] = useState(0)
  const [remoteRefresh, setRemoteRefresh] = useState(0)
  const [loggedName, setLoggedName] = useState("")
  const [selectedGame, setSelectedGame] = useState(0)
  const [welcome, setWelcome] = useState(0)
  const [server, setServer] = useState("")


  return (
    <ServerContext.Provider value={{ server, setServer, loggedName, setLoggedName, remoteRefresh, setRemoteRefresh, page, setPage, selectedGame, setSelectedGame }}>

      <main >
        <div className="body-main">{
          !welcome
            ? <Welcome setWelcome={setWelcome} />
            : !loggedName
              ? <SignIn />
              : page
                ? <ChessGame />
                : <Lobby />
        }</div>
      </main>

    </ServerContext.Provider>
  );
}

export default App;
