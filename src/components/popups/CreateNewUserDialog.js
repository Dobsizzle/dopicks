import { useEffect, useRef } from "react";
import { myAJAX } from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground";

function CreateNewUserDialog(props) {
  var usernameTI = useRef();
  var passwordTI = useRef();

  useEffect(()=>{usernameTI.current.focus()}, []);

  function onSubmitButtonClick() {
    var userName = usernameTI.current.value.trim();
    if (userName.length == 0) {
      props.doAlert("Please provide a Username.", "Username Required");
      return;
    }

    var pw = passwordTI.current.value.trim();
    if (pw.length == 0) {
      props.doAlert("Please provide a Password.", "Password Required");
      return;
    }

    myAJAX(
      "/php/pickem/create_new_user.php",
      {
        loginToken: props.loginToken,
        username: userName,
        pw: pw,
      },
      function (data) {
        props.onNewUserCreated(data);
      }
    );
  }


  return (
    <div>
       <ModalDialogBackground onClick={props.closeDialog} />

      <div className="popupDialog">
        <p style={{ fontWeight: "bold", margin: "0 0 3px 0" }}>
          Create New User
        </p>

        <p style={{ margin: "10px 0px 3px 0px", textAlign: "left" }}>
          Username:
        </p>
        <input
          ref={usernameTI}
          style={{ width: "100%", boxSizing: "border-box" }}
        />

        <p style={{ margin: "5px 0px 3px 0px", textAlign: "left" }}>
          Password:
        </p>
        <input
          ref={passwordTI}
          style={{ width: "100%", boxSizing: "border-box" }}
        />

        <div
          className="standardButton"
          style={{
            width: "100%",
            marginTop: "20px",
          }}
          onClick={onSubmitButtonClick}
        >
          Create
        </div>
      </div>
    </div>
  );
}
export default CreateNewUserDialog;
