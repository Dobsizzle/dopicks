import React, { useState } from "react";
import SetOfCommaDelimitedUsers from "../SetOfCommaDelimitedUsers";
import ModalDialogBackground from "./ModalDialogBackground";
import SquareAllocationsDialog from "./SquareAllocationsDialog";

export default function AllNonPlayingUsersDialog({
  sortedUsers,
  closeDialog,
  doAlert,
  loginToken,
  onUserDataChanged,
  sbData,
  updateSBData
}) {
  const [userDataForSquaresAllocation, setUserDataForSquareAllocation] =
    useState(null);

  function onUserNameClick(userData) {
    setUserDataForSquareAllocation(userData);
  }
  function closeSquareAllocationsDialog() {
    setUserDataForSquareAllocation(null);
  }

  return (
    <>
      <ModalDialogBackground onClick={closeDialog} />

      <div className="popupDialog">
        <p style={{ fontWeight: "bold", margin: "0 0 3px 0" }}>Select User:</p>

        <SetOfCommaDelimitedUsers
          userDataArray={sortedUsers}
          onUsernameClick={onUserNameClick}
          addCommaToLastName={false}
        />
      </div>

      {userDataForSquaresAllocation != null && (
        <SquareAllocationsDialog
          userData={userDataForSquaresAllocation}
          closeDialog={closeSquareAllocationsDialog}
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
