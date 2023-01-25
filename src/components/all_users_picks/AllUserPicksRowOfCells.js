import PickCell from "./PickCell";

function AllUserPicksRowOfCells(props) {
  var theWidth =
    (props.userData.orderedPicks.length + (props.includeMNFColumn ? 1 : 0)) * (props.cellSize + 1) + "px";

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: props.cellSize + 1 + "px",
        width: theWidth,
        borderBottom: "1px solid black",
        position: "relative",
      }}
    >
      {props.userData.orderedPicks.map((pickedTeamID, idx) => {
        return (
          <PickCell
            key={idx}
            cellSize={props.cellSize}
            pickResult={props.userData.orderedWinsAndLoses[idx]}
            pickedTeamID={pickedTeamID}
          />
        );
      })}

      {props.includeMNFColumn && (
        <div
          style={{
            height: props.cellSize + "px",
            width: props.cellSize + 1 + "px",
            position: "relative",
            display: "inline-block",
            borderRight: "1px solid black",
            boxSizing: "border-box",
            verticalAlign: "top",
            textAlign: "center",
          }}
        >
          <p style={{ paddingTop: "8px" }}>{props.userData.mnfTotal}</p>
        </div>
      )}

      {props.showAsEliminated && (
        <div
          className="eliminatedPlayerGradient"
          style={{
            position: "absolute",
            inset: "0px",
          }}
        ></div>
      )}
    </div>
  );
}

export default AllUserPicksRowOfCells;
