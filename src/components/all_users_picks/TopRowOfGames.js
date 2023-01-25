function TopRowOfGames(props) {
  var theWidth =
    (props.teamsPlaying.length + (props.includeMNFColumn ? 1 : 0)) *
      (props.cellSize + 1) +
    "px";
  var theHeight = props.topRowHeight + 1 + "px";

  return (
    <div
      style={{
        height: theHeight,
        width: theWidth,
        borderBottom: "1px solid black",
        boxSizing: "border-box",
      }}
    >
      {props.teamsPlaying.map((teamsData, idx) => {
        return (
          <div
            key={idx}
            style={{
              height: props.topRowHeight + 1 + "px",
              width: props.cellSize + 1 + "px",
              display: "inline-block",
              textAlign: "center",
              position: "relative",
              borderRight: "1px solid black",
              boxSizing: "border-box",
            }}
          >
            <div
              onClick={props.onGameClick}
              gameid={teamsData.gameID}
              style={
                props.userID == 1 || props.userID == 2
                  ? {
                      position: "absolute",
                      bottom: "3px",
                      width: "100%",
                      color: "blue",
                      cursor: "pointer",
                    }
                  : {
                      position: "absolute",
                      bottom: "3px",
                      width: "100%",
                    }
              }
            >
              <p style={{ width: "100%", fontSize: "12px" }}>
                {teamsData.awayTeamAbreviation}
              </p>
              <p style={{ width: "100%", fontSize: "9px" }}>@</p>
              <p style={{ width: "100%", fontSize: "12px" }}>
                {teamsData.homeTeamAbreviation}
              </p>
            </div>
          </div>
        );
      })}

      {props.includeMNFColumn && (
        <div
          style={{
            height: "100%",
            width: props.cellSize + 1 + "px",
            boxSizing: "border-box",
            display: "inline-block",
            textAlign: "center",
            position: "relative",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
          }}
        >
          <div
            onClick={props.onMNFTotalClick}
            style={
              props.userID == 1 || props.userID == 2
                ? {
                    position: "absolute",
                    bottom: "3px",
                    width: "100%",
                    color: "blue",
                    cursor: "pointer",
                  }
                : {
                    position: "absolute",
                    bottom: "3px",
                    width: "100%",
                  }
            }
          >
            {props.weekNum != 21 && props.weekNum != 18 && (
              <div>
                <p style={{ width: "100%", fontSize: "12px" }}>MNF</p>
                <p style={{ width: "100%", fontSize: "12px" }}>total</p>
              </div>
            )}
            {props.weekNum == 18 && (
              <div>
                <p style={{ width: "100%", fontSize: "12px" }}>SNF</p>
                <p style={{ width: "100%", fontSize: "12px" }}>total</p>
              </div>
            )}
            {props.weekNum == 21 && (
              <div>
                <p style={{ width: "100%", fontSize: "12px" }}>NFC</p>
                <p style={{ width: "100%", fontSize: "12px" }}>total</p>
              </div>
            )}
            <p style={{ width: "100%", fontSize: "12px" }}>
              (
              {props.currentWeekMNFTotal != null &&
              props.currentWeekMNFTotal > -1
                ? props.currentWeekMNFTotal
                : props.currentWeekMNFTotal != null &&
                  props.currentWeekMNFTotal == -2
                ? "N/A"
                : "?"}
              )
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopRowOfGames;
