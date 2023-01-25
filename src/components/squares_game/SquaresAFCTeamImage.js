import {convertToRGBA} from "../../myFuncs";
import {teamColorsByID, teamNamesByID, teamCitiesByID} from "../Team"

export default  function SquaresAFCTeamImage(props) {
  var teamColor = (props.teamID == -1 ? "rgb(206, 17, 38)" : teamColorsByID[props.teamID]);
  var theBoxShadow = "inset 0px 0px 60px 15px " + teamColor;

  var textShadow ="1px 1px 1px " + teamColor;

  var topSpace = props.height - props.cellWidthAndHeight;
  return (
    <div style={{height:props.height, boxSizing:"border-box", width:"100%", boxShadow:theBoxShadow, position:"absolute", top:"0px"}}>
      <div style={{boxSizing:"border-box", height:"100%", position:"relative"}}>
        {props.teamID == -1 && <img src="/pickem/other_imgs/afc.png" style={{position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, calc(-50% - " + topSpace/2 + "px))", height:(topSpace - 10) + "px"}} ></img>}
        {props.teamID != -1 && 
          <div style={{position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, calc(-50% - " + topSpace/2 + "px))", display:"inline-block", zIndex:"3"}}>
            <div style={{whiteSpace:"nowrap"}}>
              <div style={{display:"inline-block", verticalAlign:"11px"}} >
                <p style={{fontSize:"11px", textShadow:textShadow}}>{teamCitiesByID[props.teamID]}</p>
                <p style={{fontSize:"19px", marginTop:"-2px", textShadow:textShadow}}>{teamNamesByID[props.teamID]}</p>
              </div>
              <img src={"/pickem/logos_cropped/" + props.teamID + ".png"} style={{ height:(topSpace + 20) + "px", verticalAlign:"-5px", marginLeft:"5px",}} ></img>
            </div>
        </div>
        }
      </div>


    </div>
  );
}

