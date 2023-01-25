import TeamButtonForWinnerPicking from "../all_users_picks/TeamButtonForWinnerPicking.js";
import { myAJAX } from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground.js";

function GameWinnerSelectionDialog(props) {
  function onNoneClick() {
    onOutcomeButtonClick(-1);
  }

  function onTieClick() {
    onOutcomeButtonClick(99);
  }

  function onOutcomeButtonClick(teamID) {
    myAJAX(
      "/php/pickem/set_game_winner.php",
      {
        loginToken: props.loginToken,
        gameID: props.gameData.gameID,
        winningTeamID: teamID,
      },
      function (winningTime) {
        props.onGameWinnerSelected(props.gameData.gameID, teamID, winningTime);
        props.removeGameWinnerSelectionDialog();
      }
    );
  }

  return (
    <div>
      <ModalDialogBackground onClick={props.removeGameWinnerSelectionDialog} />
      
      <div className="popupDialog">
        <p style={{ fontWeight: "bold" }}>Select Winner:</p>
        <div style={{ marginTop: "10px", height: "133px" }}>
          <TeamButtonForWinnerPicking
            teamID={props.gameData.team1}
            isWinner={props.gameData.winnerID == props.gameData.team1}
            onOutcomeButtonClick={onOutcomeButtonClick}
          />

          <div
            style={{
              width: "64px",
              height: "133px",
              display: "inline-block",
              margin: "0 5px",
              position: "relative",
              verticalAlign: "top",
            }}
          >
            <div
              onClick={onNoneClick}
              style={{
                width: "64px",
                height: "64px",
                paddingTop: "22px",
                display: "inline-block",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid black",
                boxSizing: "border-box",
                top: "0px",
                left: "0px",
                cursor: "pointer",
                position: "absolute",
                boxShadow:
                  props.gameData.winnerID == -1
                    ? "0 0 30px 1px rgb(147, 179, 196) inset"
                    : "",
              }}
            >
              <p style={{ fontWeight: "bold", fontSize: "12px" }}>None</p>
            </div>

            <div
              onClick={onTieClick}
              style={{
                width: "64px",
                height: "64px",
                paddingTop: "12px",
                display: "inline-block",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid black",
                boxSizing: "border-box",
                bottom: "0px",
                left: "0px",
                cursor: "pointer",
                position: "absolute",
                boxShadow:
                  props.gameData.winnerID == 99
                    ? "0 0 30px 1px rgb(147, 179, 196) inset"
                    : "",
              }}
            >
              <div
                className="centeredAndScaledBGImg"
                style={{
                  display: "inline-block",
                  backgroundImage:
                    props.gameData.winnerID == 99
                      ? "url('/pickem/other_imgs/crown_split.png')"
                      : "url('/pickem/other_imgs/crown_split_outline.png')",
                  width: "47px",
                  height: "22px",
                }}
              ></div>
              <p style={{ fontWeight: "bold", fontSize: "12px" }}>Tie</p>
            </div>
          </div>

          <TeamButtonForWinnerPicking
            teamID={props.gameData.team2}
            isWinner={props.gameData.winnerID == props.gameData.team2}
            onOutcomeButtonClick={onOutcomeButtonClick}
          />
        </div>
      </div>
    </div>
  );
}

export default GameWinnerSelectionDialog;
