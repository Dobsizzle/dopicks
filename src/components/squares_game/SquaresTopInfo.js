import { useState, useRef, useMemo } from "react";
import ListOfAllUsersForAdmin from "../popups/ListOfAllUsersForAdmin";

export default function SquaresTopInfo({
  isAdmin,
  doAlert,
  loginToken,
  onUserDataChanged,
  sbData,
  updateSBData,
  allUsersInfoByUserID,
  numGamesPlayedByUserID,
  userID,
}) {
  const [showAllUsersForAdmin, setShowAllUsersForAdmin] = useState(false);

  const sortedUsersForAdminList = useRef(null);

  useMemo(() => {
    if (!isAdmin) return;
    sortedUsersForAdminList.current = [];
    for (var userID in numGamesPlayedByUserID) {
      sortedUsersForAdminList.current.push({
        ...allUsersInfoByUserID[userID],
        userID: userID,
      });
    }
    sortedUsersForAdminList.current = sortedUsersForAdminList.current.sort(
      (a, b) => {
        return a.userName.toLowerCase().localeCompare(b.userName.toLowerCase());
      }
    );
  }, [numGamesPlayedByUserID, allUsersInfoByUserID]);

  var numberOfUnassignedPicks = 100 - parseInt(sbData.numPicksAssigned);
  var availableSquaresMessage;
  if (numberOfUnassignedPicks == 0)
    availableSquaresMessage = "There are no more squares available.";
  else if (numberOfUnassignedPicks > 50)
    availableSquaresMessage =
      numberOfUnassignedPicks + " squares available.";
  else if (numberOfUnassignedPicks > 1)
    availableSquaresMessage =
      "Only " + numberOfUnassignedPicks + " more squares left!";
  else availableSquaresMessage = "Just ONE square left!";

  var totalPicks = allUsersInfoByUserID[userID].sbTotalPicks ? allUsersInfoByUserID[userID].sbTotalPicks : 0;
  var usedPicks = allUsersInfoByUserID[userID].picksUsed ? allUsersInfoByUserID[userID].picksUsed : 0;
  var remainingSelections = totalPicks - usedPicks;
  var usersSquaresInfo = "You have " + totalPicks + " square" + (totalPicks == 1 ? "" : "s");
  if (totalPicks > 0) {
    usersSquaresInfo += " with " + remainingSelections + " selection" + (remainingSelections == 1 ? "" : "s") + " remaining."
    if (remainingSelections > 0) usersSquaresInfo += " Click on a square to select it.";
    else if (numberOfUnassignedPicks > 0 && !isAdmin) usersSquaresInfo += " To get more squares, contact your admin."
  } else if (numberOfUnassignedPicks > 0 && !isAdmin) usersSquaresInfo += ". Contact your admin to get squares.";
  else usersSquaresInfo += ".";

  function closeAllUsersForAdminDialog() {
    setShowAllUsersForAdmin(false);
  }

  return (
    <>
      <p style={{ margin: "5px 10px" }}>{availableSquaresMessage}</p>
      <p style={{ margin: "5px 10px" }}>{usersSquaresInfo}</p>
      {isAdmin && (
        <div style={{ margin: "5px 10px" }}>
          <p
            style={{
              color: "blue",
              cursor: "pointer",
              display: "inline-block",
            }}
            onClick={() => {
              setShowAllUsersForAdmin(true);
            }}
          >
            give square selections to users
          </p>
        </div>
      )}

      {isAdmin && showAllUsersForAdmin && (
        <ListOfAllUsersForAdmin
          sortedUsers={sortedUsersForAdminList.current}
          closeDialog={closeAllUsersForAdminDialog}
          doAlert={doAlert}
          loginToken={loginToken}
          onUserDataChanged={onUserDataChanged}
          sbData={sbData}
          updateSBData={updateSBData}
        />
      )}
    </>
  );
}
