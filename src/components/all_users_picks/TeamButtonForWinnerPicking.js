import {convertToRGBA} from "../../myFuncs";
import {teamColorsByID} from "../Team"

function TeamButtonForWinnerPicking(props) {
  function onThisButtonClick() {
    props.onOutcomeButtonClick(props.teamID);
  }

  return (
    <div
      style={{
        display: "inline-block",
        width: "100px",
        textAlign: "center",
        border:
          props.isWinner
            ? "1px solid " + teamColorsByID[props.teamID]
            : "1px solid black",
        boxShadow:
        props.isWinner
            ? "inset 0px 0px 100px 1px " +
              convertToRGBA(teamColorsByID[props.teamID], 0.8)
            : "",
        borderRadius: "10px",
        cursor: "pointer",
        height: "131px"
      }}
      onClick={onThisButtonClick}
    >
      <div
        className="centeredAndScaledBGImg"
        style={{
          display: "inline-block",
          backgroundImage:
            props.isWinner
              ? "url('/pickem/other_imgs/crown.png')"
              : "url('/pickem/other_imgs/crown_outline.png')",
          width: "60px",
          height: "39px",
          margin: "5px 0 -5px 0",
          overflow: "visible",
          filter:
            props.isWinner
              ? "drop-shadow(0px 0px 5px " +
                convertToRGBA(teamColorsByID[props.teamID], 0.8) +
                ")"
              : "",
        }}
      ></div>
      <div
        className="centeredAndScaledBGImg"
        style={{
          display: "inline-block",
          backgroundImage:
            "url('/pickem/logos/" + props.teamID + ".png')",
          width: "90px",
          height: "90px",
        }}
      ></div>
    </div>
  );
}

export default TeamButtonForWinnerPicking;
