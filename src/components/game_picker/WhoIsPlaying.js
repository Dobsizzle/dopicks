import { useState } from "react";
import AllNonPlayingUsersDialog from "../popups/AllNonPlayingUsersDialog";
import UserPaidDialog from "../popups/UserPaidDialog";
import UserProfileDialog from "../popups/UserProfileDialog";
import SetOfCommaDelimitedUsers from "../SetOfCommaDelimitedUsers";

function WhoIsPlaying(props) {
  const [showAllNonPlayingUsers, setShowAllNonPlayingUsers] = useState(false);

  var myPaidUsers = [];
  var notMyPaidUsers = [];
  var myUnpaidUsers = [];
  var notMyUnpaidUsers = [];
  var myVouchedUsers = [];
  var totalUsers = 0;

  var usersNotPlaying = { ...props.numGamesPlayedByUserID };

  for (var currentUserID in props.currentWeekAllUsersDataByUserID) {
    var currentUserData = props.currentWeekAllUsersDataByUserID[currentUserID];
    var currentUserInfo = props.allUsersInfoByUserID[currentUserID];

    var currentUser = {
      ...currentUserData,
      ...currentUserInfo,
      userID: currentUserID,
    };
    if (currentUser.madePicks == "0") continue;
    if (currentUser.paid == "1") {
      if (currentUserID == props.userID) {
        if (props.isAdmin) myPaidUsers.splice(0, 0, currentUser);
        else notMyPaidUsers.splice(0, 0, currentUser);
      } else {
        if (currentUser.parentAdminID == props.userID)
          myPaidUsers.push(currentUser);
        else notMyPaidUsers.push(currentUser);
      }
    } else if (currentUser.paid == "0") {
      if (currentUserID == props.userID) {
        if (props.isAdmin) myUnpaidUsers.splice(0, 0, currentUser);
        else notMyUnpaidUsers.splice(0, 0, currentUser);
      } else {
        if (currentUser.parentAdminID == props.userID)
          myUnpaidUsers.push(currentUser);
        else notMyUnpaidUsers.push(currentUser);
      }
    } else if (currentUser.paid == "-2") {
      if (
        currentUser.parentAdminID == props.userID ||
        (currentUserID == props.userID && props.isAdmin)
      )
        myVouchedUsers.push(currentUser);
      else {
        if (currentUserID == props.userID)
          notMyUnpaidUsers.splice(0, 0, currentUser);
        else notMyPaidUsers.push(currentUser);
      }
    }
    delete usersNotPlaying[currentUser.userID];
    totalUsers++;
  }

  function onUsernameClick(userData) {
    if (
      userData.parentAdminID == props.userID ||
      (userData.parentAdminID == 0 && userData.userID == props.userID)
    )
      props.displayUserPaidDialog(userData.userID);
    else {
      if (
        userData.paid == "0" ||
        (userData.paid == "-2" && userData.userID == props.userID)
      ) {
        var msg =
          "This user's admin has not yet marked " +
          userData.userName +
          " as 'paid'.";
        if (userData.userID == props.userID)
          msg =
            props.allUsersInfoByUserID[userData.parentAdminID].userName +
            " has not yet marked you as 'paid'.";
        props.doAlert(msg, "Not Paid Yet");
      }
    }
  }

  function closeAllNonPlayingUsersDialog() {
    setShowAllNonPlayingUsers(false);
  }

  function onNonPlayingUserClicked(userData) {
    props.displayUserProfile(userData.userID);
  }

  if (totalUsers == 0 && !props.isAdmin) return <div></div>;

  return (
    <div style={{ textAlign: "center", margin: "0 5px" }}>
      <span>
        {totalUsers +
          " " +
          (totalUsers == 1 ? "person" : "people") +
          " playing so far: "}
      </span>

      {myPaidUsers.length > 0 && (
        <SetOfCommaDelimitedUsers
          userDataArray={myPaidUsers}
          onUsernameClick={onUsernameClick}
          addCommaToLastName={
            notMyPaidUsers.length > 0 ||
            myVouchedUsers.length > 0 ||
            myUnpaidUsers.length > 0 ||
            notMyUnpaidUsers.length > 0
          }
        />
      )}
      {notMyPaidUsers.length > 0 && (
        <SetOfCommaDelimitedUsers
          userDataArray={notMyPaidUsers}
          styleForClickableUsername={{ color: "black", cursor: "auto" }}
          addCommaToLastName={
            myVouchedUsers.length > 0 ||
            myUnpaidUsers.length > 0 ||
            notMyUnpaidUsers.length > 0
          }
        />
      )}
      {myVouchedUsers.length > 0 && (
        <SetOfCommaDelimitedUsers
          userDataArray={myVouchedUsers}
          styleForClickableUsername={{ color: "purple" }}
          onUsernameClick={onUsernameClick}
          addCommaToLastName={
            myUnpaidUsers.length > 0 || notMyUnpaidUsers.length > 0
          }
        />
      )}
      {myUnpaidUsers.length > 0 && (
        <SetOfCommaDelimitedUsers
          userDataArray={myUnpaidUsers}
          styleForClickableUsername={{ color: "red" }}
          onUsernameClick={onUsernameClick}
          addCommaToLastName={notMyUnpaidUsers.length > 0}
        />
      )}
      {notMyUnpaidUsers.length > 0 && (
        <SetOfCommaDelimitedUsers
          userDataArray={notMyUnpaidUsers}
          styleForClickableUsername={{ color: "rgb(150, 0, 0)" }}
          onUsernameClick={onUsernameClick}
          addCommaToLastName={false}
        />
      )}

      {props.isAdmin && Object.keys(usersNotPlaying).length > 0 && (
        <div>
          <p
            style={{
              color: "blue",
              cursor: "pointer",
              display: "inline-block",
            }}
            onClick={() => {
              setShowAllNonPlayingUsers(true);
            }}
          >
            {totalUsers == 0 ? "show my users" : "show my other users"}
          </p>
        </div>
      )}

      {props.isAdmin &&
        Object.keys(usersNotPlaying).length > 0 &&
        showAllNonPlayingUsers && (
          <AllNonPlayingUsersDialog
            usersNotPlaying={usersNotPlaying}
            allUsersInfoByUserID={props.allUsersInfoByUserID}
            closeDialog={closeAllNonPlayingUsersDialog}
            onNonPlayingUserClicked={onNonPlayingUserClicked}
          />
        )}
    </div>
  );
}
export default WhoIsPlaying;
