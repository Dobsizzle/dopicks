import { teamColorsByID } from "../Team";
import SquaresRowOfPicks from "./SquaresRowOfPicks";

export default function SquaresTheGrid(props) {
  var afcTeamColor =
    props.afcTeamID == -1
      ? "rgb(206, 17, 38)"
      : teamColorsByID[props.afcTeamID];
  var nfcTeamColor =
    props.nfcTeamID == -1 ? "rgb(0, 59, 102)" : teamColorsByID[props.nfcTeamID];

  var textShadow = "1px 1px 1px " + afcTeamColor;

  var numsForCols = [];
  if (props.colNums != "") numsForCols = props.colNums.split(",");
  else for (var i = 0; i < 10; i++) numsForCols[i] = "?";

  var rcUserIDs = [];
  for (var i = 0; i < 10; i++) {
    rcUserIDs[i] = [];
    for (var j = 0; j < 10; j++) {
      rcUserIDs[i][j] = -1;
    }
  }
  for (var i = 0; i < props.thePicks.length; i++) {
    rcUserIDs[props.thePicks[i].row][props.thePicks[i].col] =
      props.thePicks[i].userID;
  }

  return (
    <div
      style={{
        width: "100%",
        position: "absolute",
        overflowX: "auto",
        whiteSpace: "nowrap",
        overflowY: "visible",
        top: props.sbLogoHeight - props.cellWidthAndHeight + "px",
      }}
    >
      <div
        style={{
          width: props.cellWidthAndHeight * 10,
          height: props.cellWidthAndHeight * 11,
          boxSizing: "border-box",
          position: "relative",
          left: "0px",
          fontSize:"0px"
        }}
      >
        <div
          style={{
            display: "inline-block",
            height: props.cellWidthAndHeight,
            width: "100%",
            boxSizing: "border-box",
            zIndex: "2",
          }}
        >
          {numsForCols.map((numForCol, idx) => {
            return (
              <div
                key={idx}
                style={{
                  display: "inline-block",
                  boxSizing: "border-box",
                  width: props.cellWidthAndHeight + "px",
                  height: props.cellWidthAndHeight + "px",
                  borderRight: "1px solid " + afcTeamColor,
                  borderBottom: "1px solid " + afcTeamColor,
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
                  {numForCol}
                </p>
              </div>
            );
          })}
        </div>

        {rcUserIDs.map((rowOfUserIDs, rowNum) => {
          return (
            <SquaresRowOfPicks
              key={rowNum}
              rowOfUserIDs={rowOfUserIDs}
              cellSize={props.cellWidthAndHeight}
              afcColor={afcTeamColor}
              nfcColor={nfcTeamColor}
            />
          );
        })}

      </div>
    </div>
  );
}
