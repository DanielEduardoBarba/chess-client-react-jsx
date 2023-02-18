
export default function Square({pass}) {

    const {i,j,clickOne,setClickOne,clickTwo,setClickTwo, whitePos, blackPos} = pass
    return (
        <>
            {
            (Number(j) + Number(i)) % 2
            ? <button key={String(j) + String(i)} className="blackSquare" onClick={() => {

                if (clickOne !== "") setClickTwo(String(j) + String(i))
                else setClickOne(String(j) + String(i))

            }} id={String(j) + String(i)}>{placePieces(j, i, whitePos, blackPos)}</button>

            : <button key={String(j) + String(i)} className="whiteSquare" onClick={() => {

                if (clickOne !== "") setClickTwo(String(j) + String(i))
                else setClickOne(String(j) + String(i))

            }} id={String(j) + String(i)}>{placePieces(j, i, whitePos, blackPos)}</button>
        }

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

    if (wPiece != "") return wPieces[wIndex]
    if (bPiece != "") return bPieces[bIndex]
    

}