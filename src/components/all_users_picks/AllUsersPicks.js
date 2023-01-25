import { teamCityAbreviations } from "../Team";
import UsernameLabel from "./UsernameLabel";
import { useEffect, useState } from "react";
import GameWinnerSelectionDialog from "../popups/GameWinnerSelectionDialog";
import MNFTotalInputDialog from "../popups/MNFTotalInputDialog";
import AllUserPicksRowOfCells from "./AllUserPicksRowOfCells";
import TopRowOfGames from "./TopRowOfGames";
import SetOfCommaDelimitedUsers from "../SetOfCommaDelimitedUsers";
import { buyInAmount } from "../../App";

function AllUsersPicks(props) {
  const CELL_SIZE = 35; // allows for 29x29 image and padding of 3
  const TOP_ROW_HEIGHT = 50;
  const LEFT_COL_WIDTH = (CELL_SIZE + 1) * 3 - 1;

  const [
    gameDataForGameWinnerSelectionDialog,
    setGameDataForGameWinnerSelectionDialog,
  ] = useState(null);
  const [mnfTotalInputDialogIsDisplayed, setMnfTotalInputDialogIsDisplayed] =
    useState(false);
  const [showEliminated, setShowEliminated] = useState(false);
  const [eliminatedUserIDs, setEliminatedUserIDs] = useState({});

  var winners = [];
  var winnerName = null;
  var biggestLosers = [];
  var biggestLoserName = null;
  var thePaidUsersData = []; // vertical axis of grid - user names
  var myUnpaidUsersData = []; // people who didn't pay and thus don't show up in the grid, but this user is admin for them
  var notMyUnpaidUsersData = []; // people who didn't pay and thus don't show up in the grid
  var teamsPlaying = []; // labels for horizontal axis of grid
  var undecidedGameIDs = [];

  useEffect(() => {
    var newEliminatedUserIDs = {};
    if (thePaidUsersData.length > 0 && props.weekNum != 19) {
      if (undecidedGameIDs.length == 0 && props.currentWeekMNFTotal != null && props.currentWeekMNFTotal != -1) {
        for (var i = 0; i < thePaidUsersData.length; i++) {
          if (
            !winners.find(
              (winnerUserData) =>
                winnerUserData.userID == thePaidUsersData[i].userID
            )
          )
            newEliminatedUserIDs[thePaidUsersData[i].userID] = 1;
        }
      } else {
        var mostCorrectPicks = thePaidUsersData[0].numCorrectPicks;
        for (var i = 1; i < thePaidUsersData.length; i++) {
          var currentUser = thePaidUsersData[i];
          if (currentUser.numCorrectPicks == mostCorrectPicks) continue;
          var numFuturePlayoffGames = props.weekNum == 20 ? 2 : 0;
          if (
            currentUser.numCorrectPicks +
              undecidedGameIDs.length +
              numFuturePlayoffGames <
            mostCorrectPicks
          ) {
            for (var j = i; j < thePaidUsersData.length; j++) {
              newEliminatedUserIDs[thePaidUsersData[j].userID] = 1;
            }
            break;
          }

          usersToCompareLoop: for (var j = 0; j < i; j++) {
            var comparedUser = thePaidUsersData[j];
            var numGamesThatNeedToHaveDifferentPicks =
              comparedUser.numCorrectPicks -
              currentUser.numCorrectPicks -
              numFuturePlayoffGames;
            if (numGamesThatNeedToHaveDifferentPicks <= 0) break;
            for (var k = 0; k < undecidedGameIDs.length; k++) {
              if (
                currentUser.allPicks[undecidedGameIDs[k]] != null &&
                currentUser.allPicks[undecidedGameIDs[k]] !=
                  comparedUser.allPicks[undecidedGameIDs[k]]
              )
                numGamesThatNeedToHaveDifferentPicks--;
              if (numGamesThatNeedToHaveDifferentPicks == 0) break;
              if (k == undecidedGameIDs.length - 1) {
                newEliminatedUserIDs[currentUser.userID] = 1;
                break usersToCompareLoop;
              }
            }
          }
        }
      }
    }
    setEliminatedUserIDs(newEliminatedUserIDs);
  }, [
    props.currentWeekAllUsersPicksByUserIDByGameID,
    props.currentWeekGamesDataByGameID,
    props.currentWeekMNFTotal,
    props.currentWeekAllUsersDataByUserID,
    showEliminated,
  ]);

  if (Object.keys(props.currentWeekAllUsersPicksByUserIDByGameID).length == 0) {
    return (
      <div style={{ marginLeft: "10px" }}>
        <span>There are no picks for this week.</span>
      </div>
    );
  }

  var addNumCorrectPicksCounter = false;
  for (var gameID in props.currentWeekGamesDataByGameID) {
    var currentGameData = props.currentWeekGamesDataByGameID[gameID];
    teamsPlaying.push({
      ...currentGameData,
      awayTeamAbreviation: teamCityAbreviations[currentGameData.team1],
      homeTeamAbreviation: teamCityAbreviations[currentGameData.team2],
      gameID: gameID,
    });
    if (currentGameData.winnerID == -1) undecidedGameIDs.push(gameID);
  }
  teamsPlaying.sort((a, b) =>
    a.time < b.time
      ? -1
      : a.time > b.time
      ? 1
      : a.winnerID > -1 && b.winnerID == -1
      ? -1
      : b.winnerID > -1 && a.winnerID == -1
      ? 1
      : parseInt(a.winningTime) - parseInt(b.winningTime)
  );
  for (var userID in props.currentWeekAllUsersPicksByUserIDByGameID) {
    var currentUserPicks =
      props.currentWeekAllUsersPicksByUserIDByGameID[userID];
    var currentUsersData = props.currentWeekAllUsersDataByUserID[userID];
    var currentUsersInfo = props.allUsersInfoByUserID[userID];

    var orderedPicks = [];
    var orderedWinsAndLoses = [];
    var numCorrectPicks = 0;

    for (var i = 0; i < teamsPlaying.length; i++) {
      var gameID = teamsPlaying[i].gameID;
      orderedPicks.push(currentUserPicks[gameID]);
      if (teamsPlaying[i].winnerID != -1) {
        addNumCorrectPicksCounter = true;
        if (currentUserPicks[gameID] == teamsPlaying[i].winnerID) {
          numCorrectPicks++;
          orderedWinsAndLoses[i] = 1;
        } else orderedWinsAndLoses[i] = -1;
      } else orderedWinsAndLoses[i] = 0;
    }

    var allDataForCurrentUser = {
      ...currentUsersData,
      ...currentUsersInfo,
      userID: userID,
      allPicks: currentUserPicks,
      orderedPicks: orderedPicks,
      orderedWinsAndLoses: orderedWinsAndLoses,
      numCorrectPicks: numCorrectPicks,
    };

    if (allDataForCurrentUser.paid == "1" || allDataForCurrentUser.paid == "-2")
      thePaidUsersData.push(allDataForCurrentUser);
    else if (props.isAdmin) {
      if (
        allDataForCurrentUser.parentAdminID == props.userID ||
        allDataForCurrentUser.userID == props.userID
      )
        myUnpaidUsersData.splice(0, 0, allDataForCurrentUser);
      else notMyUnpaidUsersData.push(allDataForCurrentUser);
    }
  }

  if (
    undecidedGameIDs.length == 0 &&
    props.currentWeekMNFTotal &&
    props.currentWeekMNFTotal != -1
  ) {
    var theMNFTotal = props.currentWeekMNFTotal;
    thePaidUsersData.sort((a, b) => {
      return a.numCorrectPicks > b.numCorrectPicks
        ? -1
        : a.numCorrectPicks < b.numCorrectPicks
        ? 1
        : parseInt(a.mnfTotal) <= theMNFTotal &&
          parseInt(a.mnfTotal) > parseInt(b.mnfTotal)
        ? -1
        : parseInt(b.mnfTotal) <= theMNFTotal &&
          parseInt(b.mnfTotal) > parseInt(a.mnfTotal)
        ? 1
        : parseInt(a.mnfTotal) < parseInt(b.mnfTotal)
        ? -1
        : 1;
    });
    if (thePaidUsersData.length > 0) {
      var winningCorrectPicksNum = thePaidUsersData[0].numCorrectPicks;
      var winningMNFTotalVal = thePaidUsersData[0].mnfTotal;
      winners = [thePaidUsersData[0]];
      for (var i = 1; i < thePaidUsersData.length; i++) {
        if (
          thePaidUsersData[i].numCorrectPicks == winningCorrectPicksNum &&
          (thePaidUsersData[i].mnfTotal == winningMNFTotalVal ||
            theMNFTotal == -2)
        )
          winners.push(thePaidUsersData[i]);
        else break;
      }
      if (winners.length == 1) winnerName = thePaidUsersData[0].userName;
      else {
        var lastWinner = winners.splice(winners.length - 1, 1);
        winnerName = winners.map((item) => item.userName).join(", ");
        winnerName += " & " + lastWinner[0].userName;
        winners = winners.concat(lastWinner);
      }

      if (props.weekNum == 21) {
        var numCorrectPicksForBiggestLoser = 9999;
        var mnfTotalForBiggestLoser = 9999;
        for (var i = thePaidUsersData.length - 1; i >= 0; i--) {
          var currentUserData = thePaidUsersData[i];
          if (currentUserData.numCorrectPicks > numCorrectPicksForBiggestLoser)
            break;
          if (currentUserData.orderedPicks.indexOf(undefined) > -1) continue;
          if (
            currentUserData.mnfTotal != mnfTotalForBiggestLoser &&
            theMNFTotal != -2
          ) {
            biggestLosers = [currentUserData];
            mnfTotalForBiggestLoser = currentUserData.mnfTotal;
          } else biggestLosers.push(currentUserData);
          numCorrectPicksForBiggestLoser = currentUserData.numCorrectPicks;
        }

        if (biggestLosers.length == 1)
          biggestLoserName = biggestLosers[0].userName;
        else {
          var lastLoser = biggestLosers.splice(biggestLosers.length - 1, 1);
          biggestLoserName = biggestLosers
            .map((item) => item.userName)
            .join(", ");
          biggestLoserName += " & " + lastLoser[0].userName;
          biggestLosers = biggestLosers.concat(lastLoser);
        }
      }
    }
  } else {
    thePaidUsersData.sort((a, b) =>
      a.numCorrectPicks > b.numCorrectPicks
        ? -1
        : a.numCorrectPicks < b.numCorrectPicks
        ? 1
        : parseInt(a.mnfTotal) < parseInt(b.mnfTotal)
        ? -1
        : 1
    );
  }

  function onUsernameClick(userData) {
    if (
      userData.parentAdminID != props.userID &&
      userData.userID != props.userID
    )
      return;
    props.displayUserProfile(userData.userID);
  }

  function onGameClick(evt) {
    if (!(props.userID == 1 || props.userID == 2)) return;
    var theGameID = evt.currentTarget.getAttribute("gameid");
    var theGameData = props.currentWeekGamesDataByGameID[theGameID];
    theGameData.gameID = theGameID;
    setGameDataForGameWinnerSelectionDialog(theGameData);
  }

  function removeGameWinnerSelectionDialog() {
    setGameDataForGameWinnerSelectionDialog(null);
  }

  function onMNFTotalClick() {
    if (!(props.userID == 1 || props.userID == 2)) return;
    setMnfTotalInputDialogIsDisplayed(true);
  }

  function onMNFTotalProvided(val) {
    removeMNFTotalInputDialog();
    props.onMNFTotalProvided(val);
  }

  function removeMNFTotalInputDialog() {
    setMnfTotalInputDialogIsDisplayed(false);
  }

  function onNumPeoplePlayingClicked() {
    if (!props.isAdmin) return;
    var countsByAdminID = {};
    var adminNamesByID = {};
    for (var i = 0; i < thePaidUsersData.length; i++) {
      var theAdminID = thePaidUsersData[i].parentAdminID;
      if (theAdminID == 0) theAdminID = thePaidUsersData[i].userID;
      if (countsByAdminID[theAdminID] == null) {
        countsByAdminID[theAdminID] = 1;
        adminNamesByID[theAdminID] =
          props.allUsersInfoByUserID[theAdminID].userName;
      } else countsByAdminID[theAdminID]++;
    }

    var keys = Object.keys(countsByAdminID);
    keys.sort((a, b) => countsByAdminID[b] - countsByAdminID[a]);
    var alertBody = "";
    for (var i = 0; i < keys.length; i++) {
      alertBody += adminNamesByID[keys[i]] + ": " + countsByAdminID[keys[i]];
      if (i != keys.length - 1) alertBody += "\n";
    }

    props.doAlert(alertBody, "Users Count For Each Admin");
  }

  function displayPlayoffRules() {
    props.doAlert(
      "• $" +
        buyInAmount * 3 +
        " Buy-In to play ALL 3 WEEKS of playoff Pick 'Em.\n• Submit picks every week before first game.\n• Winner is most correct picks over the 3 weeks.\n• 90% of pot goes to winner.\n• 10% of pot goes to biggest loser (fewest correct picks, with a pick made for every game).\n• Tiebreaker is total points in NFC Championship game.\n• Closest without going over wins tiebreaker. If all go over, lowest number wins.\n• Same tiebreaker rule applies for biggest loser.",
      "Playoffs Pick 'Em Rules"
    );
  }

  return (
    <div>
      {winnerName != null && (
        <div
          style={{
            position: "relative",
            borderTop: "2px solid rgb(245, 175, 0)",
            borderBottom: "2px solid rgb(245, 175, 0)",
            padding: "20px",
            textAlign: "center",
            backgroundImage: "url('/pickem/other_imgs/crown_tile.png')",
            boxShadow:
              "0 18px 20px -10px rgb(255, 190, 0) inset, 0 -18px 20px -10px rgb(255, 190, 0) inset",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                textShadow:
                  "2px 2px 2px rgb(255, 190, 40), -2px 2px 2px rgb(255, 190, 40), 2px -2px 2px rgb(255, 190, 40), -2px -2px 2px rgb(255, 190, 40)",
              }}
            >
              {winnerName + " Won!"}
            </p>
            {props.currentWeekWinComment &&
              props.currentWeekWinComment != "" && (
                <p
                  style={{
                    textShadow:
                      "2px 2px 2px rgb(255, 190, 40), -2px 2px 2px rgb(255, 190, 40), 2px -2px 2px rgb(255, 190, 40), -2px -2px 2px rgb(255, 190, 40)",
                  }}
                >
                  {"(" + props.currentWeekWinComment + ")"}
                </p>
              )}
          </div>
        </div>
      )}

      {biggestLoserName != null && (
        <div
          style={{
            marginBottom: "10px",
            position: "relative",
            borderTop: "2px solid rgb(0, 100, 245)",
            borderBottom: "2px solid rgb(0, 100, 245)",
            padding: "20px",
            textAlign: "center",
            backgroundImage: "url('/pickem/other_imgs/jester_hat_tile.png')",
            boxShadow:
              "0 18px 15px -10px rgb(0, 105, 255) inset, 0 -18px 15px -10px rgb(0, 105, 255) inset",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                textShadow:
                  "1px 1px 1px rgb(60, 145, 255), -1px 1px 1px rgb(60, 145, 255), 1px -1px 1px rgb(60, 145, 255), -1px -1px 1px rgb(60, 145, 255)",
              }}
            >
              {"Biggest Loser" +
                (biggestLosers.length > 1 ? "s" : "") +
                ": " +
                biggestLoserName}
            </p>
          </div>
        </div>
      )}

      {props.weekNum == 18 && winnerName == null && (
        <p style={{ textAlign: "center", margin:"20px" }}>
          Don't miss out on Pick 'Em during the playoffs. Click{" "}
          <span style={{ color: "blue", cursor:"pointer" }} onClick={displayPlayoffRules}>
            here
          </span>{" "}
          for more info.
        </p>
      )}

      <div
        style={{
          textAlign: "center",
          width: "calc(100% - 20px)",
          margin: "10px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            textAlign: "left",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              width: LEFT_COL_WIDTH + 1 + "px",
              display: "inline-block",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: LEFT_COL_WIDTH + 1 + "px",
                height: TOP_ROW_HEIGHT + 1 + "px",
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                boxSizing: "border-box",
                position: "relative",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  position: "absolute",
                  bottom: "2px",
                  width: "100%",
                  textAlign: "center",
                  fontSize: "13px",
                  display: "inline-block",
                  color: props.isAdmin ? "blue" : "black",
                  cursor: props.isAdmin ? "pointer" : "auto",
                }}
                onClick={onNumPeoplePlayingClicked}
              >
                {thePaidUsersData.length} people
              </p>
            </div>
            {thePaidUsersData.map((theUserData, idx) => {
              return (
                <div
                  key={idx}
                  style={{ display: "inline-block", width: "100%" }}
                >
                  <UsernameLabel
                    showAsEliminated={
                      showEliminated &&
                      eliminatedUserIDs[theUserData.userID] != null
                    }
                    cellSize={CELL_SIZE}
                    leftColWidth={LEFT_COL_WIDTH}
                    addNumCorrectPicksCounter={addNumCorrectPicksCounter}
                    userInfo={theUserData}
                    onUsernameClick={onUsernameClick}
                    clickableDivStyle={
                      theUserData.parentAdminID == props.userID ||
                      (theUserData.parentAdminID == 0 &&
                        theUserData.userID == props.userID)
                        ? theUserData.paid == "-2"
                          ? {
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              flexGrow: "1",
                              color: "purple",
                              fontSize: "12px",
                            }
                          : {
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              flexGrow: "1",
                              fontSize: "12px",
                            }
                        : {
                            color: "black",
                            cursor: "auto",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            flexGrow: "1",
                            fontSize: "12px",
                          }
                    }
                  />
                </div>
              );
            })}
          </div>
          <div
            style={{
              width: "calc(100% - " + (LEFT_COL_WIDTH + 1) + "px)",
              display: "inline-block",
              verticalAlign: "top",
              whiteSpace: "nowrap",
              overflowY: "hidden",
            }}
          >
            <TopRowOfGames
              topRowHeight={TOP_ROW_HEIGHT}
              cellSize={CELL_SIZE}
              onGameClick={onGameClick}
              onMNFTotalClick={onMNFTotalClick}
              currentWeekMNFTotal={props.currentWeekMNFTotal}
              teamsPlaying={teamsPlaying}
              userID={props.userID}
              weekNum={props.weekNum}
              includeMNFColumn={props.weekNum < 19 || props.weekNum == 21}
            />

            {thePaidUsersData.map((userData, idx) => {
              return (
                <AllUserPicksRowOfCells
                  key={idx}
                  userData={userData}
                  cellSize={CELL_SIZE}
                  showAsEliminated={
                    showEliminated && eliminatedUserIDs[userData.userID] != null
                  }
                  includeMNFColumn={props.weekNum < 19 || props.weekNum == 21}
                />
              );
            })}
          </div>
        </div>
      </div>

      {props.isAdmin &&
        (myUnpaidUsersData.length > 0 || notMyUnpaidUsersData.length > 0) && (
          <div style={{ margin: "10px 10px 0 10px" }}>
            <span>Unpaid users:&nbsp;</span>
            {myUnpaidUsersData.length > 0 && (
              <SetOfCommaDelimitedUsers
                userDataArray={myUnpaidUsersData}
                styleForClickableUsername={{ color: "red" }}
                onUsernameClick={onUsernameClick}
                addCommaToLastName={notMyUnpaidUsersData.length > 0}
              />
            )}
            {notMyUnpaidUsersData.length > 0 && (
              <SetOfCommaDelimitedUsers
                userDataArray={notMyUnpaidUsersData}
                styleForClickableUsername={{ color: "rgb(150, 0, 0)" }}
                addCommaToLastName={false}
              />
            )}
          </div>
        )}

      {props.isAdmin && Object.keys(eliminatedUserIDs).length > 0 && (
        <p
          style={{ color: "blue", margin: "10px", cursor: "pointer" }}
          onClick={() => {
            setShowEliminated(!showEliminated);
          }}
        >
          {showEliminated ? "hide" : "show"} eliminated
        </p>
      )}

      {gameDataForGameWinnerSelectionDialog != null && (
        <GameWinnerSelectionDialog
          gameData={gameDataForGameWinnerSelectionDialog}
          loginToken={props.loginToken}
          removeGameWinnerSelectionDialog={removeGameWinnerSelectionDialog}
          onGameWinnerSelected={props.onGameWinnerSelected}
        />
      )}

      {mnfTotalInputDialogIsDisplayed && (
        <MNFTotalInputDialog
          doAlert={props.doAlert}
          removeMNFTotalInputDialog={removeMNFTotalInputDialog}
          onMNFTotalProvided={onMNFTotalProvided}
          loginToken={props.loginToken}
          weekNum={props.weekNum}
        />
      )}
    </div>
  );
}

export default AllUsersPicks;
