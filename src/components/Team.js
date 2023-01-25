import { useEffect, useRef, useState } from "react";
import { convertToRGBA } from "../myFuncs.js";

const teamNamesByID = [
  "Cardinals",
  "Falcons",
  "Ravens",
  "Bills",
  "Panthers",
  "Bears",
  "Bengals",
  "Browns",
  "Cowboys",
  "Broncos",
  "Lions",
  "Packers",
  "Texans",
  "Colts",
  "Jaguars",
  "Chiefs",
  "Raiders",
  "Chargers",
  "Rams",
  "Dolphins",
  "Vikings",
  "Patriots",
  "Saints",
  "Giants",
  "Jets",
  "Eagles",
  "Steelers",
  "49ers",
  "Seahawks",
  "Buccaneers",
  "Titans",
  "Commanders",
];
const teamCitiesByID = [
  "Arizona",
  "Atlanta",
  "Baltimore",
  "Buffalo",
  "Carolina",
  "Chicago",
  "Cincinnati",
  "Cleveland",
  "Dallas",
  "Denver",
  "Detroit",
  "Green Bay",
  "Houston",
  "Indianapolis",
  "Jacksonville",
  "Kansas City",
  "Las Vegas",
  "Los Angeles",
  "Los Angeles",
  "Miami",
  "Minnesota",
  "New England",
  "New Orleans",
  "New York",
  "New York",
  "Philadelphia",
  "Pittsburgh",
  "San Francisco",
  "Seattle",
  "Tampa Bay",
  "Tennessee",
  "Washington",
];
const teamColorsByID = [
  "rgb(151, 35, 63)",
  "rgb(167, 25, 48)",
  "rgb(26, 25, 95)",
  "rgb(0, 51, 141)",
  "rgb(0, 133, 202)",
  "rgb(11, 22, 42)",
  "rgb(251, 79, 20)",
  "rgb(49, 29, 0)",
  "rgb(0, 53, 148)",
  "rgb(251, 79, 20)",
  "rgb(0, 118, 182)",
  "rgb(24, 48, 40)",
  "rgb(3, 32, 47)",
  "rgb(0, 44, 95)",
  "rgb(0, 103, 120)",
  "rgb(227, 24, 55)",
  "rgb(165, 172, 175)",
  "rgb(0, 128, 198)",
  "rgb(0, 53, 148)",
  "rgb(0, 142, 151)",
  "rgb(79, 38, 131)",
  "rgb(0, 34, 68)",
  "rgb(211, 188, 141)",
  "rgb(1, 35, 82)",
  "rgb(18, 87, 64)",
  "rgb(0, 76, 84)",
  "rgb(255, 182, 18)",
  "rgb(170, 0, 0)",
  "rgb(0, 34, 68)",
  "rgb(213, 10, 10)",
  "rgb(12, 35, 64)",
  "rgb(90, 20, 20)",
];
const teamColors2ByID = [
  "rgb(0, 0, 0)",
  "rgb(0, 0, 0)",
  "rgb(0, 0, 0)",
  "rgb(198, 12, 48)",
  "rgb(16, 24, 32)",
  "rgb(200, 56, 3)",
  "rgb(0, 0, 0)",
  "rgb(255, 60, 0)",
  "rgb(0, 34, 68)",
  "rgb(0, 34, 68)",
  "rgb(176, 183, 188)",
  "rgb(255, 184, 28)",
  "rgb(167, 25, 48)",
  "rgb(162, 170, 173)",
  "rgb(215, 162, 42)",
  "rgb(255, 184, 28)",
  "rgb(0, 0, 0)",
  "rgb(255, 194, 14)",
  "rgb(255, 163, 0)",
  "rgb(252, 76, 2)",
  "rgb(255, 198, 47)",
  "rgb(198, 12, 48)",
  "rgb(16, 24, 31)",
  "rgb(163, 13, 45)",
  "rgb(0, 0, 0)",
  "rgb(165, 172, 175)",
  "rgb(16, 24, 32)",
  "rgb(173, 153, 93)",
  "rgb(105, 190, 40)",
  "rgb(255, 121, 0)",
  "rgb(75, 146, 219)",
  "rgb(255, 182, 18)",
];
const teamCityAbreviations = [
  "ARI",
  "ATL",
  "BAL",
  "BUF",
  "CAR",
  "CHI",
  "CIN",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GB",
  "HOU",
  "IND",
  "JAC",
  "KC",
  "LV",
  "LAC",
  "LAR",
  "MIA",
  "MIN",
  "NE",
  "NO",
  "NYG",
  "NYJ",
  "PHI",
  "PIT",
  "SF",
  "SEA",
  "TB",
  "TEN",
  "WAS",
];

var textShadowOverrideColors = {
  0: "rgb(255, 182, 18)",
  1: "rgb(165, 172, 175)",
  2: "rgb(158, 124, 12)",
  4: "rgb(191, 192, 191)",
  6: "rgb(255, 255, 255)",
  8: "rgb(134, 147, 151)",
  24: "rgb(255, 255, 255)",
  26: "rgb(165, 172, 175)",
};

//const teamCityAbreviations = ["ARZ", "ATL", "BLT", "BUF", "CAR", "CHI", "CIN", "CLV", "DAL", "DEN", "DET", "GB", "HST", "IND", "JAX", "KC", "LV", "LAC", "LA", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SF", "SEA", "TB", "TEN", "WAS"];    // these are "official", but no good
//const teamColorsByID = ["rgb(151, 35, 63)", "rgb(167, 25, 48)", "rgb(26, 25, 95)", "rgb(0, 51, 141)", "rgb(0, 133, 202)", "rgb(11, 22, 42)", "rgb(251, 79, 20)", "rgb(49, 29, 0)", "rgb(0, 53, 148)", "rgb(251, 79, 20)", "rgb(0, 118, 182)", "rgb(24, 48, 40)", "rgb(3, 32, 47)", "rgb(0, 44, 95)", "rgb(16, 24, 32)", "rgb(227, 24, 55)", "rgb(0, 0, 0)", "rgb(0, 128, 198)", "rgb(0, 53, 148)", "rgb(0, 142, 151)", "rgb(79, 38, 131)", "rgb(0, 34, 68)", "rgb(211, 188, 141)", "rgb(1, 35, 82)", "rgb(18, 87, 64)", "rgb(0, 76, 84)", "rgb(255, 182, 18)", "rgb(170, 0, 0)", "rgb(0, 34, 68)", "rgb(213, 10, 10)", "rgb(12, 35, 64)", "rgb(90, 20, 20)"];     // changed jags and raiders
//const teamColors2ByID = ["rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(198, 12, 48)", "rgb(16, 24, 32)", "rgb(200, 56, 3)", "rgb(0, 0, 0)", "rgb(255, 60, 0)", "rgb(0, 34, 68)", "rgb(0, 34, 68)", "rgb(176, 183, 188)", "rgb(255, 184, 28)", "rgb(167, 25, 48)", "rgb(162, 170, 173)", "rgb(215, 162, 42)", "rgb(255, 184, 28)", "rgb(165, 172, 175)", "rgb(255, 194, 14)", "rgb(255, 163, 0)", "rgb(252, 76, 2)", "rgb(255, 198, 47)", "rgb(198, 12, 48)", "rgb(16, 24, 31)", "rgb(163, 13, 45)", "rgb(0, 0, 0)", "rgb(165, 172, 175)", "rgb(16, 24, 32)", "rgb(173, 153, 93)", "rgb(105, 190, 40)", "rgb(255, 121, 0)", "rgb(75, 146, 219)", "rgb(255, 182, 18)"];

function Team(props) {
  const theTeamCard = useRef();
  const bOnce = useRef(false)

  useEffect(() => {
    var className = "teamCard centeredAndScaledBGImg";

    if (props.selectedState == "selected") {
      if (props.side == "left") {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          className += " teamCardBig teamCardBigLeft";
        } else theTeamCard.current.style.transitionTimingFunction = "ease-out";
      } else {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          className += " teamCardBig teamCardBigRight";
        } else theTeamCard.current.style.transitionTimingFunction = "ease-out";
      }
    } else if (props.selectedState == "selectedAgainst") {
      if (props.side == "left") {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          className += " teamCardSmall teamCardSmallLeft";
        } else theTeamCard.current.style.transitionTimingFunction = "ease-out";
      } else {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          className += " teamCardSmall teamCardSmallRight";
        } else theTeamCard.current.style.transitionTimingFunction = "ease-out";
      }
    }
    theTeamCard.current.className = className;
    if (!bOnce.current) {
      bOnce.current = true;
      onTeamCardTransitionEnd();
    }
  }, [props.selectedState]);

  function onTeamCardTransitionEnd() {
    if (props.selectedState == "selected") {
      if (props.side == "left") {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          theTeamCard.current.className = "teamCard centeredAndScaledBGImg teamCardBig teamCardBigLeft";
        }
      } else {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          theTeamCard.current.className = "teamCard centeredAndScaledBGImg teamCardBig teamCardBigRight";
        }
      }
    } else if (props.selectedState == "selectedAgainst") {
      if (props.side == "left") {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          theTeamCard.current.className = "teamCard centeredAndScaledBGImg teamCardSmall teamCardSmallLeft";
        }
      } else {
        if (theTeamCard.current.className == "teamCard centeredAndScaledBGImg") {
          theTeamCard.current.style.transitionTimingFunction = "ease-in";
          theTeamCard.current.className = "teamCard centeredAndScaledBGImg teamCardSmall teamCardSmallRight";
        }
      }
    }
  }

  var color1 = teamColorsByID[props.teamID];
  var color2 = teamColors2ByID[props.teamID];
  if (textShadowOverrideColors[props.teamID] != null)
    color2 = textShadowOverrideColors[props.teamID];
  var textShadow =
    "1px 1px 2px " +
    color2 +
    ", -1px 1px 2px " +
    color2 +
    ", 1px -1px 2px " +
    color2 +
    ", -1px -1px 2px " +
    color2;
  var imageUrl = 'url("/pickem/logos/' + props.teamID + '.png")';

  //var selectedShadow = teamColorsByID[props.teamID] + " 0px 0px 10px 5px";
  var selectedShadow = "black 3px 3px 10px 2px";
  var notSelectedShadow = "rgb(0, 0, 0) 0px 0px 0px 0px";

  var overlayGradient =
    "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.15) 25%, transparent 50%)";

  function onClick() {
    if (props.onClick) props.onClick(props.teamID);
  }

  return (
    <div className="teamCardContainer">
      <div
        ref={theTeamCard}
        onTransitionEnd = {onTeamCardTransitionEnd}
        style={{
          backgroundImage: imageUrl,
          position: "absolute",
          boxSizing: "border-box",
          boxShadow:
            props.selectedState == "selected"
              ? selectedShadow
              : notSelectedShadow,
          overflow: "hidden",
          // border: props.selectedState != "selectedAgainst" ? "1px solid " + teamColorsByID[props.teamID] : ""
          border:
            props.selectedState == "none"
              ? "1px solid " + teamColorsByID[props.teamID]
              : props.selectedState == "selectedAgainst"
              ? "0px solid rgb(25, 25, 25)"
              : "1px solid rgb(190, 190, 190)",
        }}
        onClick={onClick}
      >
        <p
          className="teamText"
          style={{
            color: teamColorsByID[props.teamID],
            textShadow: textShadow,
            top: "5px",
            fontSize:
              props.selectedState == "selected"
                ? "16px"
                : props.selectedState == "selectedAgainst"
                ? "13px"
                : "14px",
          }}
        >
          {teamCitiesByID[props.teamID]}
        </p>
        <p
          className="teamText"
          style={{
            color: teamColorsByID[props.teamID],
            textShadow: textShadow,
            bottom: "5px",
            fontSize:
              props.selectedState == "selected"
                ? "16px"
                : props.selectedState == "selectedAgainst"
                ? "13px"
                : "14px",
          }}
        >
          {teamNamesByID[props.teamID]}
        </p>
        <div
          style={
            props.selectedState == "selectedAgainst"
              ? {}
              : {
                  backgroundImage: overlayGradient,
                  position: "absolute",
                  inset: "0px",
                }
          }
        ></div>
      </div>
    </div>
  );
}

export default Team;
export { teamNamesByID, teamCitiesByID, teamColorsByID, teamCityAbreviations };
