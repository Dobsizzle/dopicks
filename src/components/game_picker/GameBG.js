import { useEffect, useMemo, useRef } from "react";
import { teamColorsByID } from "../Team.js";

function GameBG({ teamOneID, teamTwoID, selectedID }) {
  const bgOne = useRef();
  const bgTwo = useRef();

  const teamOneSelectedBGColor = useRef();
  const teamTwoSelectedBGColor = useRef();
  const teamOneBGTileImgPath = useRef();
  const teamTwoBGTileImgPath = useRef();
  useMemo(() => {
    teamOneSelectedBGColor.current = teamColorsByID[teamOneID];
    teamTwoSelectedBGColor.current = teamColorsByID[teamTwoID];

    var path1 = "/pickem/logos/tiles/" + teamOneID + ".png";
    var path2 = "/pickem/logos/tiles/" + teamTwoID + ".png";
    teamOneBGTileImgPath.current = "url('" + path1 + "')";
    teamTwoBGTileImgPath.current = "url('" + path2 + "')";
    // load images so the tile appears instantly after selecting a team
    new Image().src = path1;
    new Image().src = path2;
  }, [teamOneID, teamTwoID]);

  const oldSelectedID = useRef(null);
  useEffect(() => {
    oldSelectedID.current = selectedID;
  }, [selectedID]);

  useEffect(() => {
    if (selectedID == teamOneID) {
      if (oldSelectedID.current == teamTwoID) bgTwo.current.style.opacity = 1;
      else bgTwo.current.style.opacity = 0;
      bgOne.current.style.opacity = 1;
      bgOne.current.style.zIndex = 3;
      bgTwo.current.style.zIndex = 2;
    } else if (selectedID == teamTwoID) {
      if (oldSelectedID.current == teamOneID) bgOne.current.style.opacity = 1;
      else bgOne.current.style.opacity = 0;
      bgTwo.current.style.opacity = 1;
      bgTwo.current.style.zIndex = 3;
      bgOne.current.style.zIndex = 2;
    } else {
      bgOne.current.style.opacity = 0;
      bgTwo.current.style.opacity = 0;
    }
  }, [selectedID]);

  return (
    <div
      style={{
        background: "rgb(230, 230, 230)",
        position: "absolute",
        inset: "0px",
        overflow: "hidden",
      }}
    >
      <div
        ref={bgOne}
        style={{
          background:
            teamOneSelectedBGColor.current +
            " " +
            teamOneBGTileImgPath.current +
            " 0px 0px/60px 60px",
          position: "absolute",
          transform: "rotate(-10deg)",
          inset: "-50px",
          transition: "opacity .6s"
        }}
      ></div>

      <div
        ref={bgTwo}
        style={{
          background:
            teamTwoSelectedBGColor.current +
            " " +
            teamTwoBGTileImgPath.current +
            " 0px 0px/60px 60px",
          position: "absolute",
          transform: "rotate(-10deg)",
          inset: "-50px",
          transition: "opacity .6s"
        }}
      ></div>

      {selectedID != null && (
        <div
          style={{
            zIndex: 3,
            position: "absolute",
            inset: "0px",
            boxShadow: "3px 3px 10px 0px rgba(256, 256, 256, .5) inset, -3px -3px 10px 0px rgba(0, 0, 0, .5) inset"
          }}
        ></div>
      )}

      <div
        style={{
          zIndex: 3,
          position: "absolute",
          inset: "0px",
          background:
            "linear-gradient(to bottom right, rgba(255, 255, 255, .2), transparent 25%, transparent 75%, rgba(0, 0, 0, 0.2))",
        }}
      ></div>
    </div>
  );
}
export default GameBG;
