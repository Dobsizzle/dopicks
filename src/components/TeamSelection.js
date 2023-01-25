import { useRef } from "react";
import Team from "./Team";

function TeamSelection({gameData, userPick, onTeamSelected}) {
  const amp = useRef();
  
  return (
    <div style={{display:"inline-block", position:"relative", width:"268px"}}>
      <Team
        teamID={gameData.team1}
        onClick={onTeamSelected}
        selectedState={
          userPick == null
            ? "none"
            : userPick == gameData.team1
            ? "selected"
            : "selectedAgainst"
        }
        side="left"
      />
      <p ref={amp} className="atSymbol" style={{ position: "relative" }}>
        @
      </p>
      <Team
        teamID={gameData.team2}
        onClick={onTeamSelected}
        selectedState={
          userPick == null
            ? "none"
            : userPick == gameData.team2
            ? "selected"
            : "selectedAgainst"
        }
        side="right"
      />
    </div>
  );
}
export default TeamSelection;
