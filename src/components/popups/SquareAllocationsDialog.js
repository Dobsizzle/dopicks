import { useEffect, useRef, useState } from "react";
import ModalDialogBackground from "./ModalDialogBackground";
import { myAJAX } from "../../myFuncs";

export default function SquareAllocationsDialog({
  userData,
  closeDialog,
  doAlert,
  loginToken,
  onUserDataChanged,
  sbData,
  updateSBData
}) {

  console.log(sbData);
  const squaresGivenTI = useRef();
  const animationInterval = useRef(null);
  const animationText = useRef();
  useEffect(selectValInSquaresGivenTI, []);

  const [animateWaitingForServer, setAnimateWaitingForServer] = useState(false);

  function onOKClicked() {
    var errorMsg = "";
    var newVal = squaresGivenTI.current.value.trim();
    if (newVal == "") newVal = 0;
    if (isNaN(newVal)) errorMsg = "The Squares Given value must be a number.";
    newVal = parseInt(newVal);
    var oldVal =
      userData.sbTotalPicks == null ? 0 : parseInt(userData.sbTotalPicks);
    if (newVal == oldVal) {
      closeDialog();
      return;
    }
    var numAlreadUsed =
      userData.sbPicksUsed == null ? 0 : parseInt(userData.sbPicksUsed);
    if (newVal < numAlreadUsed)
      errorMsg =
        "Squares Given cannot be decreased below the Squares Used value(" +
        numAlreadUsed +
        ").";
    if (newVal > 100) errorMsg = "Squares Given cannot exceed 100.";
    if (newVal < 0) errorMsg = "Squares Given must be zero or greater.";
    if (errorMsg != "") {
      doAlert(errorMsg, "Bad Value", ["OK"], [selectValInSquaresGivenTI]);
      return;
    }

    var confirmationMsg, confimationTitle;
    if (oldVal == 0) {
      confirmationMsg =
        "Give " + userData.userName + " " + newVal + " squares to select?";
      confimationTitle = "Give " + newVal + " Squares?";
    } else {
      confirmationMsg =
        (newVal > oldVal ? "Increase " : "Decrease ") +
        userData.userName +
        "'s squares from " +
        oldVal +
        " to " +
        newVal +
        "?";
      confimationTitle =
        (newVal > oldVal ? "Increase" : "Decrease") + " Squares Given?";
    }
    if (Math.abs(newVal - oldVal) > 10) {
      if (oldVal == 0) confirmationMsg += " That's a lot of squares!";
      else confirmationMsg += " That's a big " + (newVal > oldVal ? "increase!" : "decrease!");
      confirmationMsg += " Are you sure?";
    }
      

    doAlert(
      confirmationMsg,
      confimationTitle,
      ["Yes", "No"],
      [cont, selectValInSquaresGivenTI]
    );

    function cont() {
      setAnimateWaitingForServer(true);
      animationInterval.current = setInterval(() => {
        var txt = animationText.current.innerHTML;
        txt += ".";
        if (txt == "....") txt = ".";
        animationText.current.innerHTML = txt;
      }, 500);

      myAJAX(
        "/php/pickem/give_squares_picks.php",
        {
          loginToken: loginToken,
          userID: userData.userID,
          numPicks: newVal,
        },
        function (data) {
          setAnimateWaitingForServer(false);
          clearInterval(animationInterval.current);
          onUserDataChanged(userData.userID, {
            ...userData,
            sbTotalPicks: newVal,
          });
          updateSBData({...sbData, numPicksAssigned:(parseInt(sbData.numPicksAssigned) + (newVal - oldVal))})
          var msg =
            userData.userName +
            " has been given " +
            newVal +
            " square" +
            (newVal == 1 ? "" : "s") +
            " to pick.";
          if (newVal != oldVal)
            msg =
              userData.userName +
              " now has " +
              newVal +
              " square" +
              (newVal == 1 ? "" : "s") +
              ".";
          var title = "Squares Given";
          if (newVal < oldVal) title = "Squares Taken Away";
          doAlert(msg, title, ["OK"], [closeDialog]);
        },
        true,
        function () {
          setAnimateWaitingForServer(false);
          clearInterval(animationInterval.current);
        }
      );
    }
  }

  function selectValInSquaresGivenTI() {
    squaresGivenTI.current.focus();
    squaresGivenTI.current.select();
  }

  return (
    <>
      <ModalDialogBackground onClick={closeDialog} />

      <div className="popupDialog">
        <p style={{ fontWeight: "bold", margin: "0 0 3px 0" }}>
          {userData.userName}
        </p>
        <div style={{ textAlign: "left" }}>
          <p style={{ width: "125px", display: "inline-block" }}>
            Squares Given:
          </p>
          <input
            ref={squaresGivenTI}
            defaultValue={
              userData.sbTotalPicks == null ? "0" : userData.sbTotalPicks
            }
            style={{ width: "25px" }}
          ></input>
        </div>
        <div style={{ textAlign: "left" }}>
          <p style={{ width: "125px", display: "inline-block" }}>
            Squares Used:{" "}
          </p>
          <p style={{ display: "inline-block" }}>
            {userData.sbPicksUsed == null ? "0" : userData.sbPicksUsed}
          </p>
        </div>

        <div
          className="standardButton"
          style={{
            width: "calc(50% - 2px)",
            float: "right",
            marginTop: "10px",
          }}
          onClick={onOKClicked}
        >
          OK
        </div>

        {animateWaitingForServer && (
          <div
            style={{
              position: "absolute",
              inset: "0px",
              background: "rgba(0, 0, 0, .9)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p
                ref={animationText}
                style={{
                  color: "white",
                  fontSize: "20px",
                  display: "inline-block",
                }}
              >
                giving picks
              </p>
              <p
                ref={animationText}
                style={{
                  color: "white",
                  fontSize: "20px",
                  width: "25px",
                  display: "inline-block",
                  textAlign: "left",
                }}
              >
                ...
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
