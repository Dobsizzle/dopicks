import WaitingForContent from "../WaitingForContent";
import GamePicker from "../game_picker/GamePicker";
import AllUsersPicks from "../all_users_picks/AllUsersPicks";
import SquaresGame from "../squares_game/SquaresGame";

function MainContent(props) {
  return (
    <div className="mainContentBox">
      {props.mainContentToDisplay == "waiting" && <WaitingForContent />}
      {props.mainContentToDisplay == "picker" && (
        <GamePicker
          currentlySelectedWeek={props.currentlySelectedWeek}
          currentWeekGamesDataByGameID={props.currentWeekGamesDataByGameID}
          currentWeekAllUsersPicksByUserIDByGameID={
            props.currentWeekAllUsersPicksByUserIDByGameID
          }
          currentWeekAllUsersDataByUserID={
            props.currentWeekAllUsersDataByUserID
          }
          allUsersInfoByUserID={props.allUsersInfoByUserID}
          userID={props.userID}
          isAdmin={props.isAdmin}
          loginToken={props.loginToken}
          inEditGamesMode={props.inEditGamesMode}
          addGameToDB={props.addGameToDB}
          onGameEdited={props.onGameEdited}
          onGameDeletedInDB={props.onGameDeletedInDB}
          onSelectionMade={props.onSelectionMade}
          onSubmitClick={props.onSubmitClick}
          onMNFPointTotalInputValueChanged={
            props.onMNFPointTotalInputValueChanged
          }
          doAlert={props.doAlert}
          displayUserProfile={props.displayUserProfile}
          displayUserPaidDialog={props.displayUserPaidDialog}
          numGamesPlayedByUserID={props.numGamesPlayedByUserID}
        />
      )}
      {props.mainContentToDisplay == "allUsersPicks" && (
        <AllUsersPicks
          currentWeekGamesDataByGameID={props.currentWeekGamesDataByGameID}
          currentWeekAllUsersPicksByUserIDByGameID={
            props.currentWeekAllUsersPicksByUserIDByGameID
          }
          currentWeekAllUsersDataByUserID={
            props.currentWeekAllUsersDataByUserID
          }
          allUsersInfoByUserID={props.allUsersInfoByUserID}
          currentWeekMNFTotal={props.currentWeekMNFTotal}
          currentWeekWinComment={props.currentWeekWinComment}
          userID={props.userID}
          isAdmin={props.isAdmin}
          loginToken={props.loginToken}
          doAlert={props.doAlert}
          displayUserProfile={props.displayUserProfile}
          onGameWinnerSelected={props.onGameWinnerSelected}
          onMNFTotalProvided={props.onMNFTotalProvided}
          weekNum={props.currentlySelectedWeek}
        />
      )}

      {props.mainContentToDisplay == "squaresGame" && (
        <SquaresGame
          sbData={props.sbData}
          allPicksLockedUpToThisWeek={props.allPicksLockedUpToThisWeek}
          weekNum={props.currentlySelectedWeek}
          isAdmin={props.isAdmin}
          numGamesPlayedByUserID={props.numGamesPlayedByUserID}
          allUsersInfoByUserID={props.allUsersInfoByUserID}
          doAlert={props.doAlert}
          loginToken={props.loginToken}
          onUserDataChanged={props.onUserDataChanged}
          updateSBData={props.updateSBData}
          userID={props.userID}
        />
      )}
    </div>
  );
}
export default MainContent;
