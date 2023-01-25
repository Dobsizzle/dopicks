import { useRef } from "react";
import { teamCityAbreviations } from "../Team";

function SubmitPicksBar(props) {
  const mnfPointTotalTI = useRef();

  var mnfTeam1 = "N/A",
    mnfTeam2 = "N/A";
  if (props.mnfTeamOneID != -1 && props.mnfTeamTwoID != -1) {
    mnfTeam1 = teamCityAbreviations[props.mnfTeamOneID];
    mnfTeam2 = teamCityAbreviations[props.mnfTeamTwoID];
  }

  

  function onSubmitClick() {
    if (props.currentlySelectedWeek < 19 || props.currentlySelectedWeek == 21) {
      if (mnfPointTotalTI.current.value == "") {
        props.doAlert(
          "Please give a point total for the Monday Night Football game.",
          "Point Total Required"
        );
        return;
      } else if (isNaN(mnfPointTotalTI.current.value)) {
        props.doAlert(
          "The MNF point total must be a number.",
          "Bad MNF Total Value"
        );
        return;
      }
    }
    var mnfVal = mnfPointTotalTI.current?.value;
    if (mnfVal == "" || mnfVal == null) mnfVal = "-1";
    props.onSubmitClick(mnfVal);
  }

  var mnfPointTotalVal = "";
  if (props.currentWeekAllUsersDataByUserID[props.userID] != null && props.currentWeekAllUsersDataByUserID[props.userID].mnfTotal != "-1")
    mnfPointTotalVal = props.currentWeekAllUsersDataByUserID[props.userID].mnfTotal;

  return (
    <div style={{ margin: "10px 5px 0 10px" }}>
      {(props.currentlySelectedWeek < 19 ||
        props.currentlySelectedWeek == 21) && (
        <div style={{ display: "inline-block", marginRight: "20px" }}>
          {props.tempCrud && props.currentlySelectedWeek == 21 && <p style={{color:"magenta", cursor:"pointer"}} onClick={()=>{props.doAlert("The NFC game was chosen as the tiebreaker game, assuming it would be played second. It was a bad assumption. However, we're sticking with the posted rules and going with the first (NFC) game for the tiebreaker.", "Explanation")}}>*tiebreaker is the first game (NFC)*</p>}
          <span>
            <b>Tiebreaker:&nbsp;</b>
            {mnfTeam1 + " vs " + mnfTeam2 + " Total Points: "}
          </span>
          <input
          ref={mnfPointTotalTI}
            defaultValue={mnfPointTotalVal}
            onChange={(evt) => props.onMNFPointTotalInputValueChanged(evt.target.value)}
            maxLength={3}
            style={{ width: "30px" }}
          />
        </div>
      )}

      <div className="standardButton" onClick={onSubmitClick}>
        <span>
          {props.currentWeekAllUsersDataByUserID[props.userID] != null &&
          props.currentWeekAllUsersDataByUserID[props.userID].paid != "-1" &&
          mnfPointTotalVal != ""
            ? "Update Picks"
            : "Submit Picks"}
        </span>
      </div>
    </div>
  );
}
export default SubmitPicksBar;
