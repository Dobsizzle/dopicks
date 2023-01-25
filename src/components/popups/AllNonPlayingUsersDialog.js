import React from "react";
import SetOfCommaDelimitedUsers from "../SetOfCommaDelimitedUsers";
import ModalDialogBackground from "./ModalDialogBackground";

export default function AllNonPlayingUsersDialog({
  usersNotPlaying,
  allUsersInfoByUserID,
  closeDialog,
  onNonPlayingUserClicked,
}) {
  var sortedUserIDsByTimesPlayed = [];
  for (var i = 0; i < 22; i++) sortedUserIDsByTimesPlayed[i] = [];
  for (var userID in usersNotPlaying) {
    sortedUserIDsByTimesPlayed[21 - usersNotPlaying[userID]].push({
      // index 21 is people who played 0 times, 20 is 1 time, etc. This is so map call displays in decending order.
      ...allUsersInfoByUserID[userID],
      userID: userID,
    });
  }
  for (var i = 0; i < 22; i++) {
    sortedUserIDsByTimesPlayed[i].sort((a, b) => {
      return a.userName.toLowerCase().localeCompare(b.userName.toLowerCase());
    });
  }
  return (
    <>
      <ModalDialogBackground onClick={closeDialog} />

      <div className="popupDialog">
        <p style={{ fontWeight: "bold", margin: "0 0 3px 0" }}>
          Users You Admin For:
        </p>

        <div>
          {sortedUserIDsByTimesPlayed.map((setOfUserIDs, idx) => {
            return (
              <React.Fragment key={idx}>
                {setOfUserIDs.length > 0 && (
                  <div
                    style={{
                      textAlign: "left",
                      border: "1px solid black",
                      borderRadius: "5px",
                      position: "relative",
                      marginTop: "16px",
                      padding: "3px 5px",
                    }}
                  >
                    <p
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "10px",
                        backgroundColor: "white",
                        padding: "0 5px",
                      }}
                    >
                      <span style={{ fontSize: "11px" }}>played </span>
                      {21 - idx}
                      <span style={{ fontSize: "11px" }}>
                        {" "}
                        {21 - idx == 1 ? "time" : "times"}
                      </span>
                    </p>

                    <SetOfCommaDelimitedUsers
                      userDataArray={setOfUserIDs}
                      onUsernameClick={onNonPlayingUserClicked}
                      addCommaToLastName={false}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}
