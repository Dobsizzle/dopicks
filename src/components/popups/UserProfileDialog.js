import { useEffect, useRef } from "react";
import { myAJAX, getDataForPreviousWeeksPaid } from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground";

function UserProfileDialog(props) {
  var usernameTI = useRef();
  var pwTI = useRef();
  var paidSelect = useRef();
  var notesTA = useRef();

  useEffect(() => {
    usernameTI.current.value = props.userData.userName;
    pwTI.current.value = props.userData.password;
    paidSelect.current.value =
      props.userData.paid != null ? props.userData.paid : "0";
    notesTA.current.value = props.userData.notes;
  }, []);

  function onSaveChangesClick() {
    var {weeksToUpdatePaid, msg, title, buttonLabels} = getDataForPreviousWeeksPaid(props.userData, paidSelect.current.value, props.weekNum, props.allPicksLockedUpToThisWeek);
    if (weeksToUpdatePaid.length > 1) {
      props.doAlert(msg, title, buttonLabels, [onChangeThisWeekOnly, onChangeAllWeeks, null]);

      function onChangeThisWeekOnly() {
        weeksToUpdatePaid = [props.weekNum];
        doTheChangesAndRemoveThisDialog();
      }
      function onChangeAllWeeks() {
        doTheChangesAndRemoveThisDialog();
      }
    } else doTheChangesAndRemoveThisDialog();

    function doTheChangesAndRemoveThisDialog() {
      var params = {
        loginToken: props.loginToken,
        weekNum: props.weekNum,
        targetUserID: props.userData.userID,
        username: usernameTI.current.value,
        pw: pwTI.current.value,
        paidVal: paidSelect.current.value,
        notes: notesTA.current.value,
        weeksToUpdatePaid: weeksToUpdatePaid
      };
      myAJAX("/php/pickem/edit_user_info.php", params, function (data) {
        props.removeUserProfileDialog();
        props.doAlert(
          "The user info has been updated.",
          "Saved Changes",
          ["OK"],
          [onAlertOK]
        );

        function onAlertOK() {
          props.onUserDataChanged(
            props.userData.userID,
            {
              ...props.userData,
              userName: params.username,
              password: params.pw,
              notes: params.notes,
            },
            { mnfTotal: props.userData.mnfTotal, paid: params.paidVal, madePicks:props.userData.madePicks}, weeksToUpdatePaid
          );
        }
      });
    }
  }

  return (
    <div>
      <ModalDialogBackground onClick={props.removeUserProfileDialog} />

      <div className="popupDialog">
        <p style={{ fontWeight: "bold" }}>User Profile</p>

        <div style={{ marginTop: "10px" }}>
          <p
            style={{
              fontSize: "13px",
              marginRight: "5px",
              display: "inline-block",
              width: "70px",
              textAlign: "right",
            }}
          >
            Name:
          </p>
          <input
            ref={usernameTI}
            style={{
              width: "calc(100% - 75px)",
              display: "inline-block",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginTop: "3px" }}>
          <p
            style={{
              fontSize: "13px",
              marginRight: "5px",
              display: "inline-block",
              width: "70px",
              textAlign: "right",
            }}
          >
            Password:
          </p>
          <input
            ref={pwTI}
            style={{
              width: "calc(100% - 75px)",
              display: "inline-block",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginTop: "3px" }}>
          <p
            style={{
              fontSize: "13px",
              marginRight: "5px",
              display: "inline-block",
              width: "70px",
              textAlign: "right",
            }}
          >
            {props.weekNum < 19 ? "Week " + props.weekNum : "Playoffs"}:
          </p>
          <select
            ref={paidSelect}
            id="paidSelect"
            style={{
              width: "calc(100% - 75px)",
              display: "inline-block",
              boxSizing: "border-box",
            }}
          >
            <option value="1">Paid</option>
            <option value="0">Unpaid</option>
            <option value="-2">Vouched</option>
          </select>
        </div>

        <div style={{ marginTop: "3px" }}>
          <p
            style={{
              fontSize: "13px",
              marginRight: "5px",
              display: "inline-block",
              width: "70px",
              textAlign: "right",
              verticalAlign: "top",
            }}
          >
            Notes:
          </p>
          <textarea
            ref={notesTA}
            style={{
              width: "calc(100% - 75px)",
              display: "inline-block",
              resize: "none",
              height: "50px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          className="standardButton"
          style={{ width: "100%", marginTop: "10px" }}
          onClick={onSaveChangesClick}
        >
          Save Changes
        </div>
      </div>
    </div>
  );
}
export default UserProfileDialog;
