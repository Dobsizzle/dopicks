import { getFormattedTimeFromDateSeconds, myAJAX } from "../../myFuncs.js";
import TeamSelection from "../TeamSelection.js";
import GameBG from "./GameBG.js";

function Game(props) {
  function onTeamSelected(teamID) {
    props.onTeamSelected(props.gameData.gameID, teamID);
  }

  var path3 = "/pickem/other_imgs/edit_pencil_blue.png";
  var path4 = "/pickem/other_imgs/minus_red.png";
  var bluePencilPath = "url('" + path3 + "')";
  var redMinusPath = "url('" + path4 + "')";
  new Image().src = path3;
  new Image().src = path4;

  function onEditGameClick() {
    props.onEditGameClick(props.gameData);
  }

  function onRemoveGameClick() {
    var countPicksForGame = 0;
    for (var userID in props.currentWeekAllUsersPicksByUserIDByGameID) {
      if (
        props.currentWeekAllUsersPicksByUserIDByGameID[userID][
          props.gameData.gameID
        ] != null
      )
        countPicksForGame++;
    }
    if (countPicksForGame > 0) {
      props.doAlert(
        countPicksForGame +
          " user" +
          (countPicksForGame > 1 ? "s have" : " has") +
          " already made a pick for this game. Making this change is probably a bad idea. Make the change anyway?",
        "Are You Sure?",
        ["Yes", "No"],
        [deleteFromDB, null]
      );
    } else deleteFromDB();

    function deleteFromDB() {
      myAJAX(
        "/php/pickem/delete_game.php",
        {
          loginToken: props.loginToken,
          gameID: props.gameData.gameID,
        },
        function (data) {
          props.onGameDeletedInDB(props.gameData.gameID);
        }
      );
    }
  }

  return (
    <div
      className="gameCard"
    >
      <GameBG teamOneID={props.gameData.team1} teamTwoID={props.gameData.team2} selectedID={props.userPick}/>

      <div
        style={{ width: "271px", marginBottom: "5px", position: "relative", height: "25px" }}
      >
        <p className="gameTimeP">
          {getFormattedTimeFromDateSeconds(props.gameData.time)}
        </p>
        {props.inEditGamesMode && (
          <div
            style={{
              background: "rgba(50, 50, 50, .8)",
              borderRadius: "5px",
              padding: "3px 5px 0 5px",
              height: "19px",
              display: "inline-block",
              position: "absolute",
              right: "3px",
              zIndex: "6"
            }}
          >
            <div
              style={{
                backgroundImage: bluePencilPath,
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundSize: "cover",
                cursor: "pointer",
                marginRight: "15px",
              }}
              onClick={onEditGameClick}
            ></div>
            <div
              style={{
                backgroundImage: redMinusPath,
                display: "inline-block",
                width: "15px",
                height: "15px",
                backgroundSize: "cover",
                cursor: "pointer",
              }}
              onClick={onRemoveGameClick}
            ></div>
          </div>
        )}
      </div>

      <TeamSelection gameData={props.gameData} userPick={props.userPick} onTeamSelected={onTeamSelected}/>
    </div>
  );
}
export default Game;
