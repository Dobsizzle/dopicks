import { teamColorsByID, teamNamesByID, teamCitiesByID } from "../Team";

export default function SquaresLeftPart(props) {
  var teamColor =
    props.teamID == -1 ? "rgb(0, 59, 102)" : teamColorsByID[props.teamID];
  var theBoxShadow = "inset 0px 0px 60px 15px " + teamColor;

  var textShadow = "1px 1px 1px " + teamColor;

  var numsForRows = [];
  if (props.rowNums != "") numsForRows = props.rowNums.split(",");
  else for (var i = 0; i < 10; i++) numsForRows[i] = "?";

  var topSpace = props.sbLogoWidth - props.cellWidthAndHeight;
  return (
    <div
      style={{
        display: "inline-block",
        width: props.sbLogoWidth + "px",
        height: props.sbLogoHeight + props.cellWidthAndHeight * 10,
        boxSizing: "border-box",
        fontSize: "0px",
      }}
    >
      <div
        className="centeredAndScaledBGImg"
        style={{
          backgroundImage: "url('/pickem/other_imgs/sb_lvii_logo.png')",
          width: props.sbLogoWidth + "px",
          height: props.sbLogoHeight + "px",
          boxSizing: "border-box",
          display: "inline-block",
          backgroundSize: "contain",
          borderTop:
            "1px solid " +
            (props.afcTeamID == -1
              ? "rgb(206, 17, 38)"
              : teamColorsByID[props.afcTeamID]),
          borderRight:
            "1px solid " +
            (props.afcTeamID == -1
              ? "rgb(206, 17, 38)"
              : teamColorsByID[props.afcTeamID]),
          borderBottom: "1px solid " + teamColor,
          borderLeft: "1px solid " + teamColor,
        }}
      ></div>

      <div
        style={{
          display: "inline-block",
          width: "100%",
          height: props.cellWidthAndHeight * 10,
          boxSizing: "border-box",
          boxShadow: theBoxShadow,
          position: "relative",
        }}
      >
        {props.teamID == -1 && (
          <img
            src="/pickem/other_imgs/nfc.png"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(calc(-50% - " + topSpace / 2 + "px), -50%) rotate(-90deg)",
              height: topSpace - 10 + "px",
              marginTop: "5px",
            }}
          ></img>
        )}
        {props.teamID != -1 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(calc(-50% - " + topSpace / 2 + "px), -50%)",
              display: "inline-block",
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                transform: "rotate(-90deg)",
                zIndex: "3",
              }}
            >
              <div style={{ display: "inline-block", verticalAlign: "11px" }}>
                <p style={{ fontSize: "11px", textShadow: textShadow }}>
                  {teamCitiesByID[props.teamID]}
                </p>
                <p
                  style={{
                    fontSize: "19px",
                    marginTop: "-2px",
                    textShadow: textShadow,
                  }}
                >
                  {teamNamesByID[props.teamID]}
                </p>
              </div>
              <img
                src={"/pickem/logos_cropped/" + props.teamID + ".png"}
                style={{
                  height: topSpace + 20 + "px",
                  verticalAlign: "-5px",
                  marginLeft: "5px",
                }}
              ></img>
            </div>
          </div>
        )}

        <div
          style={{
            display: "inline-block",
            width: props.cellWidthAndHeight,
            position: "absolute",
            right: "0px",
            boxSizing: "border-box",
          }}
        >
          {numsForRows.map((numForRow, idx) => {
            return (
              <div
                key={idx}
                style={{
                  display: "inline-block",
                  boxSizing: "border-box",
                  width: props.cellWidthAndHeight + "px",
                  height: props.cellWidthAndHeight + "px",
                  borderRight: "1px solid " + teamColor,
                  borderBottom: "1px solid " + teamColor,
                  position: "relative",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textShadow: textShadow,
                  }}
                >
                  {numForRow}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
