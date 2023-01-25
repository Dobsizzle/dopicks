import Game from "./Game";
import SubmitPicksBar from "./SubmitPicksBar";
import WhoIsPlaying from "./WhoIsPlaying";
import ManageGameDialog from "../popups/ManageGameDialog";
import { adminName } from "../../App";
import React, { useState } from "react";
import ListSectionLabel from "../ListSectionLabel";

function GamePicker(props) {
  const TEMP_CRUD = true;    //remove all this temp stuff after season is over. Was done to make the first game converence finals week the tiebreaker (because rules said NFC game)

  const [manageGameDialogIsDisplayed, setManageGameDialogIsDisplayed] =
    useState(false);
  const [gameDataForManageGameDialog, setGameDataForManageGameDialog] =
    useState(null);

  function onTeamSelected(gameID, teamID) {
    props.onSelectionMade(gameID, teamID);
  }
  function removeManageGameDialog() {
    setManageGameDialogIsDisplayed(false);
  }
  function onEditGameClick(gameData) {
    setGameDataForManageGameDialog(gameData);
    setManageGameDialogIsDisplayed(true);
  }
  function onGameEdited(data, gameID) {
    setManageGameDialogIsDisplayed(false);
    props.onGameEdited(data, gameID);
  }

  var mnfTeamOneID = -1;
  var mnfTeamTwoID = -1;

  var gamesByDayNum = [[], [], [], [], [], [], [], []]; // 1 is Thur, 7 is Wed
  for (var currentGameID in props.currentWeekGamesDataByGameID) {
    props.currentWeekGamesDataByGameID[currentGameID].gameID = currentGameID; // need to put the gameID into the data obj
    gamesByDayNum[props.currentWeekGamesDataByGameID[currentGameID].day].push(
      props.currentWeekGamesDataByGameID[currentGameID]
    );
  }
  for (var i = 0; i < gamesByDayNum.length; i++) {
    gamesByDayNum[i].sort((a, b) => {
      if (parseInt(a.time) <= parseInt(b.time)) return -1;
      else return 1;
    });
  }

  if (props.currentlySelectedWeek < 18 && gamesByDayNum[5].length > 0) {
    mnfTeamOneID = parseInt(
      gamesByDayNum[5][gamesByDayNum[5].length - 1].team1
    );
    mnfTeamTwoID = parseInt(
      gamesByDayNum[5][gamesByDayNum[5].length - 1].team2
    );
  } else if (
    props.currentlySelectedWeek == 18 ||
    props.currentlySelectedWeek == 21
  ) {
    // gets SNF game in week 18 (there is no MNF) and gets 2nd game in Conference games week
    for (var i = gamesByDayNum.length - 1; i--; i >= 0) {
      if (gamesByDayNum[i].length > 0) {
        var lastGameData = gamesByDayNum[i][gamesByDayNum[i].length - 1];
        if (lastGameData.time != "-1") {
          mnfTeamOneID = parseInt(lastGameData.team1);
          mnfTeamTwoID = parseInt(lastGameData.team2);
        }
        if (props.currentlySelectedWeek == 21 && TEMP_CRUD) {
          var game = gamesByDayNum[i][0];
          mnfTeamOneID = parseInt(game.team1);
          mnfTeamTwoID = parseInt(game.team2);
        }
        break;
      }
    }
  }

  return (
    <>
      <WhoIsPlaying
        currentWeekAllUsersDataByUserID={props.currentWeekAllUsersDataByUserID}
        userID={props.userID}
        isAdmin={props.isAdmin}
        allUsersInfoByUserID={props.allUsersInfoByUserID}
        doAlert={props.doAlert}
        displayUserProfile={props.displayUserProfile}
        loginToken={props.loginToken}
        selectedWeekNum={props.currentlySelectedWeek}
        numGamesPlayedByUserID={props.numGamesPlayedByUserID}
        displayUserPaidDialog={props.displayUserPaidDialog}
      />

      {Object.keys(props.currentWeekGamesDataByGameID).length > 0 && (
        <div style={{ marginTop: "-15px" }}>
          {gamesByDayNum.map((setOfGameData, idx) => {
            return (
              <React.Fragment key={idx}>
                {setOfGameData.length > 0 && <ListSectionLabel dayNum={idx} />}

                {setOfGameData.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, 291px)",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "10px",
                    }}
                  >
                    {setOfGameData.map((gameData, idx2) => (
                      <Game
                        doAlert={props.doAlert}
                        key={idx2}
                        gameData={gameData}
                        onTeamSelected={onTeamSelected}
                        inEditGamesMode={props.inEditGamesMode}
                        onEditGameClick={onEditGameClick}
                        currentWeekAllUsersPicksByUserIDByGameID={
                          props.currentWeekAllUsersPicksByUserIDByGameID
                        }
                        onGameDeletedInDB={props.onGameDeletedInDB}
                        loginToken={props.loginToken}
                        userPick={
                          props.currentWeekAllUsersPicksByUserIDByGameID[
                            props.userID
                          ] != null &&
                          props.currentWeekAllUsersPicksByUserIDByGameID[
                            props.userID
                          ][gameData.gameID] != null
                            ? props.currentWeekAllUsersPicksByUserIDByGameID[
                                props.userID
                              ][gameData.gameID]
                            : null
                        }
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {Object.keys(props.currentWeekGamesDataByGameID).length > 0 && (
        <SubmitPicksBar
          onSubmitClick={props.onSubmitClick}
          currentWeekAllUsersDataByUserID={
            props.currentWeekAllUsersDataByUserID
          }
          onMNFPointTotalInputValueChanged={
            props.onMNFPointTotalInputValueChanged
          }
          userID={props.userID}
          mnfTeamOneID={mnfTeamOneID}
          mnfTeamTwoID={mnfTeamTwoID}
          currentlySelectedWeek={props.currentlySelectedWeek}
          doAlert={props.doAlert}
          tempCrud={TEMP_CRUD}
        />
      )}

      {Object.keys(props.currentWeekGamesDataByGameID).length == 0 &&
        props.currentlySelectedWeek > 18 && (
          <p
            style={{
              textAlign: "center",
              margin: "50px 0",
              fontWeight: "bold",
            }}
          >
            Playoff games are TBD.
          </p>
        )}

      {Object.keys(props.currentWeekGamesDataByGameID).length == 0 &&
        props.currentlySelectedWeek <= 18 && (
          <p style={{ textAlign: "center" }}>
            No games to display for week {props.currentlySelectedWeek}.{" "}
            {adminName}
            's fault.
          </p>
        )}

      {manageGameDialogIsDisplayed && (
        <ManageGameDialog
          closeDialog={removeManageGameDialog}
          gameData={gameDataForManageGameDialog}
          currentWeekAllUsersPicksByUserIDByGameID={
            props.currentWeekAllUsersPicksByUserIDByGameID
          }
          loginToken={props.loginToken}
          weekNum={props.currentlySelectedWeek}
          onGameEdited={onGameEdited}
          doAlert={props.doAlert}
        />
      )}
    </>
  );
}
export default GamePicker;
