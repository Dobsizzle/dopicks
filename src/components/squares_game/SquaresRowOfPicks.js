import { teamColorsByID, teamNamesByID, teamCitiesByID } from "../Team";

export default function SquaresRowOfPicks(props) {
  

  return (
    <div style={{height:props.cellSize, width:(props.cellSize * 10), boxSizing:"border-box"}}>
      {props.rowOfUserIDs.map((userID, colNum) => {
          return (
            <div key={colNum} style={{width:props.cellSize, height:props.cellSize, display:"inline-block", boxSizing:"border-box", position:"relative", borderRight:"1px solid " + props.afcColor,  borderBottom:"1px solid " + props.nfcColor, }}>
              <p style={{ position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",}}>{userID == -1 ? "" : userID}</p>
            </div>
          )
      })}
    </div>
  );
}
