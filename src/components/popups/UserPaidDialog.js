import { myAJAX, getDataForPreviousWeeksPaid } from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground";

function UserPaidDialog(props) {
  function onPaidClick() {
    updateInDBIsPaid(1);
  }

  function onUnpaidClick() {
    updateInDBIsPaid(0);
  }

  function onVouchClick() {
    updateInDBIsPaid(-2);
  }

  function updateInDBIsPaid(paidVal) {
    console.log(props.userData);
    var { weeksToUpdatePaid, msg, title, buttonLabels } =
      getDataForPreviousWeeksPaid(
        props.userData,
        paidVal,
        props.selectedWeekNum,
        props.allPicksLockedUpToThisWeek
      );

    if (weeksToUpdatePaid.length > 1) {
      props.doAlert(msg, title, buttonLabels, [
        onChangeThisWeekOnly,
        onChangeAllWeeks,
        null,
      ]);

      function onChangeThisWeekOnly() {
        weeksToUpdatePaid = [props.weekNum];
        doTheChangesAndRemoveThisDialog();
      }
      function onChangeAllWeeks() {
        doTheChangesAndRemoveThisDialog();
      }
    } else doTheChangesAndRemoveThisDialog();

    function doTheChangesAndRemoveThisDialog() {
      myAJAX(
        "/php/pickem/edit_user_info.php",
        {
          loginToken: props.loginToken,
          weekNum: props.selectedWeekNum,
          targetUserID: props.userData.userID,
          paidVal: paidVal,
          weeksToUpdatePaid: weeksToUpdatePaid
        },
        function () {
          var newUserData = {
            paid: paidVal.toString(),
            mnfTotal: props.userData.mnfTotal,
            madePicks: props.userData.madePicks,
          };
          props.removeUserPaidDialog();
          props.onUserDataChanged(props.userData.userID, null, newUserData, weeksToUpdatePaid);
        }
      );
    }
  }

  function onProfileButtonClick() {
    props.onProfileButtonClick(props.userData.userID);
  }

  return (
    <div>
      <ModalDialogBackground onClick={props.removeUserPaidDialog} />

      <div className="popupDialog">
        <p style={{ fontWeight: "bold" }}>{props.userData.userName}:</p>
        <div style={{ marginTop: "10px" }}>
          <div
            onClick={onPaidClick}
            style={{
              display: "inline-block",
              width: "100px",
              height: "123px",
              textAlign: "center",
              border: "1px solid black",
              borderRadius: "10px",
              cursor: "pointer",
              paddingTop: "8px",
            }}
          >
            <div
              className="centeredAndScaledBGImg"
              style={{
                display: "inline-block",
                backgroundImage: "url('/pickem/other_imgs/paid.png')",
                width: "90px",
                height: "90px",
              }}
            ></div>
            <p
              style={{
                fontWeight: "bold",
                display: "inline-block",
                marginTop: "5px",
              }}
            >
              Paid
            </p>
          </div>

          <div
            style={{
              width: "64px",
              height: "133px",
              display: "inline-block",
              margin: "0 5px",
              position: "relative",
              verticalAlign: "top",
            }}
          >
            <div
              onClick={onProfileButtonClick}
              style={{
                width: "64px",
                height: "64px",
                paddingTop: "4px",
                display: "inline-block",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid black",
                boxSizing: "border-box",
                left: "0px",
                cursor: "pointer",
                position: "absolute",
              }}
            >
              <div
                className="centeredAndScaledBGImg"
                style={{
                  display: "inline-block",
                  backgroundImage: "url('/pickem/other_imgs/profile.png')",
                  width: "40px",
                  height: "40px",
                }}
              ></div>
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>Profile</p>
            </div>

            <div
              onClick={onVouchClick}
              style={{
                width: "64px",
                height: "64px",
                paddingTop: "4px",
                display: "inline-block",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid black",
                boxSizing: "border-box",
                bottom: "0px",
                left: "0px",
                cursor: "pointer",
                position: "absolute",
              }}
            >
              <div
                className="centeredAndScaledBGImg"
                style={{
                  display: "inline-block",
                  backgroundImage: "url('/pickem/other_imgs/vouch.png')",
                  width: "40px",
                  height: "40px",
                }}
              ></div>
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>Vouch</p>
            </div>
          </div>

          <div
            onClick={onUnpaidClick}
            style={{
              display: "inline-block",
              width: "100px",
              height: "123px",
              textAlign: "center",
              border: "1px solid black",
              borderRadius: "10px",
              cursor: "pointer",
              paddingTop: "8px",
            }}
          >
            <div
              className="centeredAndScaledBGImg"
              style={{
                display: "inline-block",
                backgroundImage: "url('/pickem/other_imgs/unpaid.png')",
                width: "90px",
                height: "90px",
              }}
            ></div>
            <p
              style={{
                fontWeight: "bold",
                display: "inline-block",
                marginTop: "5px",
              }}
            >
              Unpaid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserPaidDialog;
