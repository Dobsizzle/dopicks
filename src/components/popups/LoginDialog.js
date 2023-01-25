import { useEffect, useRef } from "react";
import { myAJAX } from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground";

function LoginDialog(props) {
  var loginTI = useRef();

  function onSubmitButtonClick() {
    var pw = loginTI.current.value.trim();
    if (pw.length == 0) {
      props.doAlert(
        "Please provide a password to login and access the Pick Em app.",
        "Password Required"
      );
      return;
    }
    props.onPWEntered(pw, false);
  }

  function onLoginTIKeyUp(evt) {
    if (evt.keyCode == 13) onSubmitButtonClick();
  }

  useEffect(()=>{loginTI.current.focus();})

  return (
    <div>
      <ModalDialogBackground />
      <div className="popupDialog">
        <div>
          <div
            className="centeredAndScaledBGImg"
            style={{
              display: "inline-block",
              backgroundImage: 'url("/pickem/logos/nfl.png")',
              width: "26px",
              height: "36px",
              marginRight: "10px",
              verticalAlign: "-8px",
            }}
          ></div>
          <span style={{ fontSize: "30px" }}>Pick 'Em&nbsp;</span>
        </div>
        <p style={{ margin: "10px 0px 3px 0px" }}>Password:</p>
        <input
          type="password"
          ref={loginTI}
          style={{ width: "100%", boxSizing: "border-box" }}
          onKeyUp={onLoginTIKeyUp}
        />
        <div
          className="standardButton"
          style={{ width: "100%", marginTop: "10px" }}
          onClick={onSubmitButtonClick}
        >
          Submit
        </div>
      </div>
    </div>
  );
}
export default LoginDialog;
