import { useState, useRef } from "react";
import ManageGameDialog from "../popups/ManageGameDialog";
import CreateNewUserDialog from "../popups/CreateNewUserDialog";
import { nflDay1 } from "../../App";

function TopContent(props) {
  var theSelect = useRef();

  function onSelectChange() {
    var oldVal = props.weekNum;
    var newVal = theSelect.current.value;

    if (props.gamesPickedDirtyBit)
      props.doAlert(
        "Changes were made, but not submitted. Change week anyway and lose the changes?",
        "Unsaved Changes",
        ["Yes", "No"],
        [yesFunc, noFunc]
      );
    else reallyDoChange(newVal);

    function yesFunc() {
      reallyDoChange(newVal, true);
    }
    function noFunc() {
      props.onSelectedWeekChange(oldVal, false);
    }
  }

  function reallyDoChange(weekNum, doPicksRevert = false) {
    props.onSelectedWeekChange(weekNum, true, doPicksRevert);
  }

  var adminButtonImages = {
    createUser: "url('/pickem/other_imgs/create_user.png')",
    createGame: "url('/pickem/other_imgs/create_game.png')",
    editGamesToggleOff: "url('/pickem/other_imgs/edit_games_toggle_off.png')",
    editGamesToggleOn: "url('/pickem/other_imgs/edit_games_toggle_on.png')",
  };
  var adminButtonFuncs = {
    createUser: onCreateUserButtonClick,
    createGame: onCreateGameButtonClick,
    editGamesToggleOff: onEditGamesButtonClick,
    editGamesToggleOn: onEditGamesButtonClick,
  };

  const [createGameDialogIsDisplayed, setCreateGameDialogIsDisplayed] =
    useState(false);

  const [createNewUserDialogIsDisplayed, setCreateNewUserDialogIsDisplayed] =
    useState(false);

  function removeManageGameDialog() {
    setCreateGameDialogIsDisplayed(false);
  }

  function removeCreateNewUserDialog() {
    setCreateNewUserDialogIsDisplayed(false);
  }

  function onCreateUserButtonClick() {
    setCreateNewUserDialogIsDisplayed(true);
  }

  function onCreateGameButtonClick() {
    setCreateGameDialogIsDisplayed(true);
  }
  function onGameAdded(data) {
    setCreateGameDialogIsDisplayed(false);
    props.onGameAdded(data);
  }

  function onNewUserCreated(data) {
    setCreateNewUserDialogIsDisplayed(false);
    props.onNewUserCreated(data);
  }

  function onEditGamesButtonClick() {
    props.onEditGamesButtonClick();
  }

  return (
    <div style={{ backgroundImage:"url('/pickem/other_imgs/football_field.jpg')", backgroundPosition: "center bottom", backgroundRepeat:"no-repeat", backgroundSize:"cover", position:"relative", height:"89px"}}>
      <div style={{position:"absolute", inset:"0px", background:"linear-gradient(to right, white, rgba(255, 255, 255, .5) 200px, transparent, rgba(255, 255, 255, .5) calc(100% - 200px), white), linear-gradient(to bottom, rgba(255, 255, 255, .3), white)"}}></div>
      <div
        style={{display: "inline-block", lineHeight: "0", padding:"10px", height:"100%", width:"250px", position:"absolute", top:"0px", left:"0px"}}
      >
        <div style={{display: "inline-block" }}>
          <div
            className="centeredAndScaledBGImg"
            style={{
              display: "inline-block",
              backgroundImage: "url('/pickem/logos/nfl.png')",
              width: "30px",
              height: "41px",
              marginRight: "10px",
              verticalAlign: "-8px",
            }}
          ></div>
          <span style={{fontSize: "35px"}}>Pick 'Em</span>
        </div>
        <br />

        <div style={{ display: "inline-block", marginTop:"3px" }}>
          <p style={{ fontSize: "18px", marginRight:"5px", display:"inline-block", verticalAlign:"middle" }}>Week</p>
          <select
            style={{ verticalAlign: "middle" }}
            ref={theSelect}
            value={props.weekNum}
            className="titleAndWeekSelecterSelect"
            onChange={onSelectChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">Wild Card</option>
            <option value="20">Divisional</option>
            <option value="21">Conference</option>
            {props.userID == 1 && <option value="22">Super Bowl</option>}
          </select>
        </div>
      </div>

      <div style={{ position:"absolute", top:"0px", right:"0px", display: "inline-block" }}>
        <div
          style={{
            textAlign:"right",
            display: "inline-block",
            padding:"10px",
            height:"100%",
            width:"200px",
          }}
        >
          <p style={{display:"inline-block"}}>Hi, {props.userName}!</p>
          <br/>
          <p
            style={{ color: "blue", cursor: "pointer", display:"inline-block" }}
            onClick={props.onLogOutClick}
          >
            log out
          </p>
          <br/>
          {props.isAdmin && (
          <div
            style={{
              display: "inline-block", marginTop:"5px"
            }}
          >
            {props.adminButtonIDs.map((id, idx) => {
              return (
                <div
                  className="adminButton centeredAndScaledBGImg"
                  style={{ backgroundImage: adminButtonImages[id] }}
                  key={idx}
                  onClick={adminButtonFuncs[id]}
                ></div>
              );
            })}
          </div>
        )}
        </div>

        {createGameDialogIsDisplayed && (
          <ManageGameDialog
            closeDialog={removeManageGameDialog}
            gameData={null}
            loginToken={props.loginToken}
            onGameAdded={onGameAdded}
            weekNum={props.weekNum}
            doAlert={props.doAlert}
          />
        )}

        {createNewUserDialogIsDisplayed && (
          <CreateNewUserDialog
            loginToken={props.loginToken}
            closeDialog={removeCreateNewUserDialog}
            onNewUserCreated={onNewUserCreated}
            doAlert={props.doAlert}
          />
        )}
      </div>
    </div>
  );
}

function getDefaultWeekSelectValue() {
  var currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // so that DST ending doesn't mess things up
  //currentDate = new Date('January 29, 2023 03:24:00')   //TEMP
  var days =
    (currentDate.getTime() - nflDay1.getTime()) / (24 * 60 * 60 * 1000);

  if (days < 0) return 1;

  var weekNum = Math.floor(days / 7) + 1;
  var dayNum = Math.floor(days) % 7;

  if (dayNum > 4) weekNum++;

  if (weekNum <= 21) return weekNum;
  else return 22;
}

export default TopContent;
export { getDefaultWeekSelectValue };
