import SquaresAFCTeamImage from "./SquaresAFCTeamImage";
import SquaresLeftPart from "./SquaresLeftPart";
import SquaresTheGrid from "./SquaresTheGrid";
import SquaresTopInfo from "./SquaresTopInfo";

export default function SquaresGame(props) {
  const SB_LVII_LOGO_WID = 80;
  const SB_LVII_LOGO_HGT = 80;
  const CELL_WID_AND_HGT = 40;

  function onSquareClicked(row, col) {

  }

  return (
    <div className="mainContentBox">
      <div
        style={{
          textAlign: "center",
          width: "calc(100% - 20px)",
          margin: "0 10px",
          position: "relative",
        }}
      >
        <SquaresTopInfo
          isAdmin={props.isAdmin}
          doAlert={props.doAlert}
          loginToken={props.loginToken}
          onUserDataChanged={props.onUserDataChanged}
          sbData={props.sbData}
          updateSBData={props.updateSBData}
          allUsersInfoByUserID={props.allUsersInfoByUserID}
          numGamesPlayedByUserID={props.numGamesPlayedByUserID}
          userID={props.userID}
        />

        <div style={{marginTop:"20px"}}>
          <SquaresLeftPart
            sbLogoWidth={SB_LVII_LOGO_WID}
            sbLogoHeight={SB_LVII_LOGO_HGT}
            cellWidthAndHeight={CELL_WID_AND_HGT}
            teamID={props.sbData.nfcTeamID}
            afcTeamID={props.sbData.afcTeamID}
            rowNums={props.sbData.rowNums}
          />
          <div
            style={{
              width: "calc(100% - " + SB_LVII_LOGO_WID + "px)",
              maxWidth: CELL_WID_AND_HGT * 10,
              display: "inline-block",
              verticalAlign: "top",
              position: "relative",
            }}
          >
            <SquaresAFCTeamImage
              teamID={props.sbData.afcTeamID}
              leftMargin={SB_LVII_LOGO_WID}
              height={SB_LVII_LOGO_HGT}
              cellWidthAndHeight={CELL_WID_AND_HGT}
            />
            <SquaresTheGrid
              cellWidthAndHeight={CELL_WID_AND_HGT}
              afcTeamID={props.sbData.afcTeamID}
              nfcTeamID={props.sbData.nfcTeamID}
              colNums={props.sbData.colNums}
              sbLogoHeight={SB_LVII_LOGO_HGT}
              thePicks={props.sbData.thePicks}
              userID={props.userID}
              onSquareClicked={onSquareClicked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
