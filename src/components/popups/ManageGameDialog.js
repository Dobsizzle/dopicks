import { nflDay1 } from "../../App";
import Team from "../Team";
import { teamCityAbreviations } from "../Team";
import { useEffect, useRef, useState } from "react";
import {
  getHoursAndMinutesFromTime,
  getFormattedTimeFromDateSeconds,
  myAJAX,
} from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground";

function ManageGameDialog(props) {
  var awayTeamTI = useRef();
  var homeTeamTI = useRef();
  var dayOfWeekSelect = useRef();
  var timeTI = useRef();

  const [awayTeamID, setAwayTeamID] = useState(
    props.gameData == null ? -1 : props.gameData.team1
  );
  const [homeTeamID, setHomeTeamID] = useState(
    props.gameData == null ? -1 : props.gameData.team2
  );

  
  useEffect(()=>{
    if (props.gameData != null) {
      awayTeamTI.current.value=teamCityAbreviations[props.gameData.team1];
      homeTeamTI.current.value=teamCityAbreviations[props.gameData.team2];
      timeTI.current.value=getFormattedTimeFromDateSeconds(props.gameData.time);
      dayOfWeekSelect.current.value = props.gameData.day;
    } else dayOfWeekSelect.current.value = 4;
  },[]);
  useEffect(()=>awayTeamTI.current.focus(), []);

  function onTeamTIKeyUp(evt) {
    var tiVal;
    var usingAwayTeam = false;
    var usingHomeTeam = false;
    if (evt.target == awayTeamTI.current) {
      tiVal = awayTeamTI.current.value;
      usingAwayTeam = true;
    } else {
      tiVal = homeTeamTI.current.value;
      usingHomeTeam = true;
    }

    if (tiVal.length < 2) {
      if (usingAwayTeam) setAwayTeamID(-1);
      else if (usingHomeTeam) setHomeTeamID(-1);
      return;
    }

    var idx = teamCityAbreviations.indexOf(tiVal.toUpperCase());
    if (idx > -1) {
      if (usingAwayTeam) {
        setAwayTeamID(idx);
        awayTeamTI.current.value = tiVal.toUpperCase();
        if (homeTeamTI.current.value == "") homeTeamTI.current.focus();
      } else if (usingHomeTeam) {
        setHomeTeamID(idx);
        homeTeamTI.current.value = tiVal.toUpperCase();
        if (timeTI.current.value == "") timeTI.current.focus();
      }
    } else {
      if (usingAwayTeam) setAwayTeamID(-1);
      else if (usingHomeTeam) setHomeTeamID(-1);

      if (tiVal.length == 3)
        props.doAlert(
          "Unrecognized city abbreviation. Valid values are: " +
            teamCityAbreviations.join(", "),
          "Bad City Value"
        );
    }
  }

  function onTimeTIKeyDown(evt) {
    var val = timeTI.current.value;
    // slight bug here. Assuming if key wasn't backspace, key down would exceed max chars, but if the text was selected for replacement, then exceeding max wouldn't happen
    if (evt.keyCode != 8 && val.length == 8) {
      props.doAlert(
        "8 characters are used for time. Must be Pacific Standard time. All of these times are valid and equivalent: 4:00 pm, 400 pm, 16:00, 1600, 400, 4.",
        "Valid Times"
      );
    }
  }

  function onSubmitButtonClick() {
    if (awayTeamID == -1) {
      props.doAlert("Need an Away Team.", "Missing Field");
      return;
    } else if (homeTeamID == -1) {
      props.doAlert("Need a Home Team.", "Missing Field");
      return;
    } else if (homeTeamID == awayTeamID) {
      props.doAlert("Home and Away Teams cannot be the same.", "Bad Data");
      return;
    }

    var timeVal = timeTI.current.value;
    if (timeVal.length == 0) {
      props.doAlert("Need a Time value.", "Time Required");
      return;
    }
    if (timeVal.trim().toLowerCase() != "tbd") {
      const [hourVal, minVal] = getHoursAndMinutesFromTime(timeVal);
      if (hourVal == "bad time") {
        props.doAlert(
          "Bad Time value. All of these times are valid and equivalent: 4:00 pm, 400 pm, 16:00, 1600, 400, 4. (if not specified with am/pm or military time, times at 6:00 or later are assumed to be PM).",
          "Valid Times"
        );
        return;
      }
    }

    if (props.gameData == null)
      addGameToDB(awayTeamID, homeTeamID, dayOfWeekSelect.current.value, timeVal);
    else {
      if (
        props.gameData.team1 != awayTeamID ||
        props.gameData.team2 != homeTeamID
      ) {
        var countPicksForGame = 0;
        for (var userID in props.currentWeekAllUsersPicksByUserIDByGameID) {
          if (props.currentWeekAllUsersPicksByUserIDByGameID[userID] != null &&
            props.currentWeekAllUsersPicksByUserIDByGameID[userID][
              props.gameData.gameID
            ] != null
          )
            countPicksForGame++;
        }
        if (countPicksForGame > 0) {
          props.doAlert(
            countPicksForGame +
              " user" +
              (countPicksForGame > 1 ? "s have" : " has") +
              " already made a pick for this game. Making this change is probably a bad idea. Make the change anyway?",
            "Are You Sure?",
            ["Yes", "No"],
            [makeTheEdit, null]
          );
        } else makeTheEdit();
      } else makeTheEdit();

      function makeTheEdit() {
        editGameInDB(
          awayTeamID,
          homeTeamID,
          dayOfWeekSelect.current.value,
          timeVal,
          props.gameData.gameID
        );
      }
    }
  }

  

  function addGameToDB(awayTeamID, homeTeamID, day, time) {
    myAJAX(
      "/php/pickem/create_new_game.php",
      {
        loginToken: props.loginToken,
        awayTeamID: awayTeamID,
        homeTeamID: homeTeamID,
        weekNum: props.weekNum,
        day: day,
        time: convertTimeToSeconds(props.weekNum, day, time),
      },
      function (data) {
        props.onGameAdded(data);
      }
    );
  }

  function editGameInDB(awayTeamID, homeTeamID, day, time, gameID) {
    myAJAX(
      "/php/pickem/edit_game.php",
      {
        loginToken: props.loginToken,
        awayTeamID: awayTeamID,
        homeTeamID: homeTeamID,
        day: day,
        time: convertTimeToSeconds(props.weekNum, day, time),
        gameID: gameID,
      },
      function (data) {
        props.onGameEdited(data, gameID);
      }
    );
  }

  function convertTimeToSeconds(w, d, t) {
    if (t.trim().toLowerCase() == "tbd") return -1;

    var newDate = new Date(nflDay1.getTime());
    newDate.setDate(newDate.getDate() + (w - 1) * 7 + (d - 1));
    const [hourVal, minVal] = getHoursAndMinutesFromTime(t);
    newDate.setHours(hourVal, minVal);
    return newDate.getTime() / 1000;
  }

  return (
    <div>
      <ModalDialogBackground onClick={props.closeDialog} />

      <div className="popupDialog">
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
          {props.gameData == null
            ? "Create Game For Week " + props.weekNum
            : "Edit Game"}
        </p>
        <div>
          <div style={{ display: "inline-block", textAlign: "center" }}>
            {awayTeamID == -1 && (
              <div className="teamCardContainer">
                <div
                  className="teamCard"
                  style={{ background: "white", border: "1px solid black" }}
                ></div>
              </div>
            )}
            {awayTeamID > -1 && <Team teamID={awayTeamID} />}
            <div style={{ display: "block" }}>
              <p
                style={{
                  marginTop: "0",
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                Away:&nbsp;
              </p>
              <input
              ref={awayTeamTI}
                maxLength={3}
                onKeyUp={onTeamTIKeyUp}
                style={{
                  display: "inline-block",
                  width: "35px",
                  height: "16px",
                }}
              />
            </div>
          </div>

          <p
            className="atSymbol"
            style={{ background: "white", margin: "50px 0 0 0" }}
          >
            @
          </p>

          <div style={{ display: "inline-block", textAlign: "center" }}>
            {homeTeamID == -1 && (
              <div className="teamCardContainer">
                <div
                  className="teamCard"
                  style={{ background: "white", border: "1px solid black" }}
                ></div>
              </div>
            )}
            {homeTeamID > -1 && <Team teamID={homeTeamID} />}
            <div style={{ display: "block" }}>
              <p
                style={{
                  marginTop: "0",
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                Home:&nbsp;
              </p>
              <input
                ref={homeTeamTI}
                maxLength={3}
                onKeyUp={onTeamTIKeyUp}
                style={{
                  display: "inline-block",
                  width: "35px",
                  height: "16px",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "inline-block", marginTop: "10px" }}>
          <span style={{ fontSize: "13px" }}>Day:&nbsp;</span>
          <select
            ref={dayOfWeekSelect}
            style={{ marginRight: "15px" }}
            fontSize="13px"
          >
            <option value="5">Mon</option>
            <option value="6">Tue</option>
            <option value="7">Wed</option>
            <option value="1">Thu</option>
            <option value="2">Fri</option>
            <option value="3">Sat</option>
            <option value="4">Sun</option>
          </select>

          <span style={{ fontSize: "13px" }}>Time:&nbsp;</span>
          <input
            ref={timeTI}
            maxLength={8}
            style={{ width: "60px" }}
            onKeyDown={onTimeTIKeyDown}
          />
        </div>

        <div
          style={{ position: "relative", height: "32px", marginTop: "20px" }}
        >
          <div
            className="standardButton"
            onClick={props.closeDialog}
            style={{
              position: "absolute",
              width: "120px",
              left: "0px",
            }}
          >
            Cancel
          </div>
          <div
            className="standardButton"
            onClick={onSubmitButtonClick}
            style={{
              position: "absolute",
              width: "120px",
              right: "0px",
            }}
          >
            {props.gameData == null ? "Create" : "Edit"}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManageGameDialog;
