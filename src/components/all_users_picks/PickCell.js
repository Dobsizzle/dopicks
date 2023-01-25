function PickCell(props) {
  return (
    <div
      style={{
        height: (props.cellSize) + "px",
        width: (props.cellSize + 1) + "px",
        position: "relative",
        display: "inline-block",
        borderRight: "1px solid black",
        boxSizing:"border-box",
        backgroundImage:
          props.pickResult == 1
            ? "linear-gradient(160deg, rgb(213, 255, 188), rgb(0, 145, 39))"
            : props.pickResult == -1 || props.pickedTeamID == null
            ? "linear-gradient(160deg, rgb(255, 220, 204), rgb(150, 0, 0))"
            : "linear-gradient(160deg, white, rgb(69, 69, 69))",
      }}
    >
      <div
        className="centeredAndScaledBGImg"
        style={{
          position: "absolute",
          inset: "0px",
          backgroundImage:
          props.pickedTeamID != null ? "url('/pickem/logos/" + props.pickedTeamID + ".png')" : "url('/pickem/other_imgs/red_x.png')",
        }}
      ></div>

    </div>
  );
}

export default PickCell;
