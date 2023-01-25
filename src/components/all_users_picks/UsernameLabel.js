import ClickableUsername from "../ClickableUserName";

function UsernameLabel(props) {
  return (
    <div className="allUsersPicksUsernameLabel" style={{height:(props.cellSize + 1) + "px", width:(props.leftColWidth + 1) + "px"}}>
      <ClickableUsername
        userInfo={props.userInfo}
        onUsernameClick={props.onUsernameClick}
        style={props.clickableDivStyle}
      />
      {props.addNumCorrectPicksCounter && (
        <span style={{fontSize:"12px"}}>&nbsp;{"(" + props.userInfo.numCorrectPicks + ")"}</span>
      )}
      {props.showAsEliminated && (
        <div className="eliminatedPlayerGradient"
          style={{
            position: "absolute",
            inset: "0px",
          }}
        ></div>
      )}
    </div>
  );
}

export default UsernameLabel;
