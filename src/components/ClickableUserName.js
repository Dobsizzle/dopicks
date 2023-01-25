function ClickableUsername(props) {
  function onUsernameClick() {
    if (props.onUsernameClick != null) props.onUsernameClick(props.userInfo);
  }
  return (
    <span className="clickableUsername" style={props.style} onClick={onUsernameClick}>
      {props.userInfo.userName}
    </span>
  );
}

export default ClickableUsername;
