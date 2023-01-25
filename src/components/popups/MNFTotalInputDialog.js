import { myAJAX } from "../../myFuncs";
import ModalDialogBackground from "./ModalDialogBackground";

function MNFTotalInputDialog(props) {
  function onSubmitClick() {
    var val = document.getElementById("mnfTotalInput").value;
    if (isNaN(val)) {
      props.doAlert("MNF Total must be a number.", "Invalid Value");
      return;
    }
    props.onMNFTotalProvided(parseInt(val));
    myAJAX("/php/pickem/set_mnf_total.php", {
      loginToken: props.loginToken,
      weekNum: props.weekNum,
      theTotal: parseInt(val),
    });
  }

  setTimeout(() => {
    document.getElementById("mnfTotalInput").focus();
  }, 50);

  return (
    <div>
      <ModalDialogBackground onClick={props.removeMNFTotalInputDialog} />
      <div className="popupDialog">
        <p style={{ fontWeight: "bold" }}>MNF Total:</p>
        <input
          maxLength={3}
          id="mnfTotalInput"
          style={{ width: "100%", boxSizing: "border-box", marginTop: "5px" }}
        />
        <div
          className="standardButton"
          onClick={onSubmitClick}
          style={{ width: "100%", marginTop: "5px" }}
        >
          Submit
        </div>
      </div>
    </div>
  );
}
export default MNFTotalInputDialog;
