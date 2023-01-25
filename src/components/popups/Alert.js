import ModalDialogBackground from "./ModalDialogBackground";

function Alert(props) {
  function onButtonClick(evt) {
    var idx = evt.target.getAttribute("idx");
    props.removeAlertOnButtonClick();
    if (
      props.alertData.buttonFuncs != null &&
      props.alertData.buttonFuncs[idx] != null
    )
      props.alertData.buttonFuncs[idx](idx);
  }

  return (
    <div>
      <ModalDialogBackground style={{ zIndex: "500" }} />

      <div className="popupDialog" style={{ zIndex: "500" }}>
        <p style={{ fontWeight: "bold", margin: "0px" }}>
          {props.alertData.title}
        </p>
        <div
          style={{
            height: "1px",
            backgroundImage:
              "linear-gradient(to right, transparent, rgb(0, 0, 0) 50%, transparent)",
            marginTop: "5px",
          }}
        ></div>
        <p style={{ textAlign: "left", margin: "15px 0", whiteSpace:"pre-wrap" }}>
          {props.alertData.body}
        </p>
        <div style={{ textAlign: "left" }}>
          {props.alertData.buttonLabels.map((buttonLabel, idx) => {
            return (
              <div
                className="standardButton"
                style={{
                  width: "calc(50% - 5px)",
                  float:
                    props.alertData.buttonLabels.length == 1 ? "right" : "none",
                  marginRight: idx % 2 == 0 && props.alertData.buttonLabels.length != 1 ? "10px" : "0px",
                  marginTop: idx > 1 ? "10px" : "0px"
                }}
                key={idx}
                idx={idx}
                onClick={onButtonClick}
              >
                {buttonLabel}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Alert;
