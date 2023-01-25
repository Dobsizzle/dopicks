import MainContent from "./components/main/MainContent";
import BottomContent from "./components/main/BottomContent";
import LoginDialog from "./components/popups/LoginDialog";
import Alert from "./components/popups/Alert";
import { myAJAX, getCookieVal } from "./myFuncs";
import { useEffect, useRef, useState } from "react";
import TopContent from "./components/main/TopContent";
import { getDefaultWeekSelectValue } from "./components/main/TopContent";
import UserProfileDialog from "./components/popups/UserProfileDialog";
import UserPaidDialog from "./components/popups/UserPaidDialog";

const nflDay1 = new Date("September 8, 2022");
const buyInAmount = 10;
const squaresBuyInAmount = 5;
const adminName = "Matt";

function App() {
  const APP_VERSION = 1;    // used to make sure people had the latest code when making conference game picks

  const allDataByWeek = useRef(null);
  const allPicksLockedUpToThisWeek = useRef(0);
  const gamesPickedDirtyBit = useRef(false);
  const userID = useRef(-1);
  const userName = useRef("unknown person");
  const isAdmin = useRef(false);
  const loginToken = useRef("");
  const theSelectedWeekRef = useRef();
  const numGamesPlayedByUserID = useRef();
  const currentWeekWinComment = useRef("");

  const [displayLoginDialog, setDisplayLoginDialog] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [userDataForProfileDialog, setUserDataForProfileDialog] =
    useState(null);
  const [mainContentToDisplay, setMainContentToDisplay] = useState("waiting");
  const [theSelectedWeek, setTheSelectedWeek] = useState(-1);
  const [currentWeekGamesDataByGameID, setCurrentWeekGamesDataByGameID] =
    useState(null);
  const [
    currentWeekAllUsersPicksByUserIDByGameID,
    setCurrentWeekAllUsersPicksByUserIDByGameID,
  ] = useState(null);
  const [currentWeekAllUsersDataByUserID, setCurrentWeekAllUsersDataByUserID] =
    useState(null);
  const [currentWeekMNFTotal, setCurrentWeekMNFTotal] = useState(null);
  const [allUsersInfoByUserID, setAllUsersInfoByUserID] = useState(null);
  const [sbData, setSBData] = useState(null);
  const [adminButtonIDs, setAdminButtonIDs] = useState([]);
  const [inEditGamesMode, setInEditGamesMode] = useState(false);
  const [userDataForPaidUserDialog, setUserDataForPaidUserDialog] =
    useState(null);

  useEffect(() => {
    loginToken.current = getCookieVal("loginToken");
    if (loginToken.current !== "") getInitData(null, false);
    else setDisplayLoginDialog(true);
  }, []);

  var getInitDataFuncRef = useRef();
  useEffect(() => {
    getInitDataFuncRef.current = getInitData;
  });
  useEffect(() => {
    setInterval(() => {
      getInitDataFuncRef.current();
    }, 10000);
  }, []);

  function getInitData(pw = null, isAutoUpdate = true, weekToSelect = null) {
    if (pw == null && loginToken.current == "") return;
    // pw is from login screen. If coming from that, use that, else use the login token
    var args =
      pw == null ? { loginToken: loginToken.current, version:APP_VERSION } : { password: pw, version:APP_VERSION };
    myAJAX("/php/pickem/get_initial_data.php", args, (data) => {
      if (pw != null) loginToken.current = data.freshToken;

      var nowTime = new Date().getTime();
      var expires = "expires=" + new Date(nowTime + 8640000000).toUTCString(); // 100 days in ms (max is 1 week though in Safari)
      document.cookie =
        "loginToken=" + loginToken.current + ";" + expires + ";SameSite=lax";
      if (pw != null) setDisplayLoginDialog(false);

      if (!isAutoUpdate) console.log("---- init data: ----");
      if (!isAutoUpdate) console.log(data);
      if (isAutoUpdate) {
        var savedUserPicks =
          allDataByWeek.current[theSelectedWeekRef.current]
            .allUsersPicksByUserIDByGameID[userID.current];
        var savedMNFTotal =
          allDataByWeek.current[theSelectedWeekRef.current]
            .allUsersDataByUserID[userID.current];
        if (savedMNFTotal != null) savedMNFTotal = savedMNFTotal.mnfTotal;
      }
      allDataByWeek.current = data.allDataByWeek;
      allPicksLockedUpToThisWeek.current = data.allPicksLockedUpToThisWeek;
      numGamesPlayedByUserID.current = data.numGamesPlayedByUserID;
      userID.current = parseInt(data.userID);
      userName.current = data.userName;
      isAdmin.current =
        data.allUsersInfoByUserID[userID.current].isAdmin == "1";
      setAllUsersInfoByUserID(data.allUsersInfoByUserID);
      setSBData(data.sbData);
      if (!isAutoUpdate)
        onNewWeekSelected(
          weekToSelect != null ? weekToSelect : getDefaultWeekSelectValue()
        );
      else {
        updateCurrentWeekGamesDataByGameID();
        if (savedUserPicks != null) allDataByWeek.current[
          theSelectedWeekRef.current
        ].allUsersPicksByUserIDByGameID[userID.current] = savedUserPicks;
        updateCurrentWeekAllUsersPicksByUserIDByGameID();
        if (savedMNFTotal != null) {
          if (
            allDataByWeek.current[theSelectedWeekRef.current]
              .allUsersDataByUserID[userID.current] != null
          )
            allDataByWeek.current[
              theSelectedWeekRef.current
            ].allUsersDataByUserID[userID.current].mnfTotal = savedMNFTotal;
          else
            allDataByWeek.current[
              theSelectedWeekRef.current
            ].allUsersDataByUserID[userID.current] = {
              mnfTotal: savedMNFTotal,
              paid: "-1",
            };
        }
        updateCurrentWeekAllUsersDataByUserID();
        setCurrentWeekMNFTotal(
          allDataByWeek.current[theSelectedWeekRef.current].mnfTotal
        );
        currentWeekWinComment.current = allDataByWeek.current[theSelectedWeekRef.current].winComment;
        updateMainContentToDisplayBasedOnWeekNum();
      }
    });
  }

  function onNewWeekSelected(val, clearDirtyBit = true, revertPicks = false) {
    theSelectedWeekRef.current = val;
    setTheSelectedWeek(val);
    if (clearDirtyBit) gamesPickedDirtyBit.current = false;
    if (revertPicks) {
      getInitData(null, false, val);
      return;
    }

    updateCurrentWeekGamesDataByGameID();
    updateCurrentWeekAllUsersPicksByUserIDByGameID();
    updateCurrentWeekAllUsersDataByUserID();
    setCurrentWeekMNFTotal(allDataByWeek.current[val].mnfTotal);
    currentWeekWinComment.current = allDataByWeek.current[theSelectedWeekRef.current].winComment;
    updateMainContentToDisplayBasedOnWeekNum();
  }

  function updateCurrentWeekGamesDataByGameID(
    weekNum = theSelectedWeekRef.current
  ) {
    setCurrentWeekGamesDataByGameID({
      ...allDataByWeek.current[weekNum].gamesDataByGameID,
    });
  }
  function updateCurrentWeekAllUsersPicksByUserIDByGameID(
    weekNum = theSelectedWeekRef.current
  ) {
    setCurrentWeekAllUsersPicksByUserIDByGameID({
      ...allDataByWeek.current[weekNum].allUsersPicksByUserIDByGameID,
    });
  }
  function updateCurrentWeekAllUsersDataByUserID(
    weekNum = theSelectedWeekRef.current
  ) {
    setCurrentWeekAllUsersDataByUserID({
      ...allDataByWeek.current[weekNum].allUsersDataByUserID,
    });
  }
  function updateMainContentToDisplayBasedOnWeekNum(
    weekNum = theSelectedWeekRef.current
  ) {
    if (weekNum == 22) {
      setMainContentToDisplay("squaresGame");
      setAdminButtonIDs(["createUser"]);
    } else if (weekNum <= allPicksLockedUpToThisWeek.current) {
      setMainContentToDisplay("allUsersPicks");
      setAdminButtonIDs(["createUser"]);
    } else {
      setMainContentToDisplay("picker");
      if (userID.current == 1)
        setAdminButtonIDs(["createUser", "createGame", "editGamesToggleOff"]);
      else setAdminButtonIDs(["createUser"]);
    }
  }
  function updateSBData(newData) {
    setSBData(newData);
  }

  function onSelectionMade(gameID, teamID) {
    gamesPickedDirtyBit.current = true;
    if (
      allDataByWeek.current[theSelectedWeekRef.current]
        .allUsersPicksByUserIDByGameID[userID.current] == null
    )
      allDataByWeek.current[
        theSelectedWeekRef.current
      ].allUsersPicksByUserIDByGameID[userID.current] = {};
    var allPicks =
      allDataByWeek.current[theSelectedWeekRef.current]
        .allUsersPicksByUserIDByGameID[userID.current];
    allPicks[gameID] = teamID;
    updateCurrentWeekAllUsersPicksByUserIDByGameID();
  }

  function onMNFPointTotalInputValueChanged(newVal) {
    gamesPickedDirtyBit.current = true;
  }

  function onGameAdded(data) {
    var gamesData =
      allDataByWeek.current[theSelectedWeekRef.current].gamesDataByGameID;
    gamesData[data.gameID] = data.newGameData;
    updateCurrentWeekGamesDataByGameID();
  }

  function onGameEdited(data, gameID) {
    var gamesData =
      allDataByWeek.current[theSelectedWeekRef.current].gamesDataByGameID;
    gamesData[gameID] = data;
    updateCurrentWeekGamesDataByGameID();
  }

  function onGameDeletedInDB(gameID) {
    var gamesData =
      allDataByWeek.current[theSelectedWeekRef.current].gamesDataByGameID;
    delete gamesData[gameID];
    updateCurrentWeekGamesDataByGameID();
  }

  function onNewUserCreated(data) {
    setAllUsersInfoByUserID({
      ...allUsersInfoByUserID,
      [data.newUserID]: data.newUserData,
    });

    navigator.clipboard
      .writeText(
        "Hey, " +
          data.newUserData.userName +
          ". The URL for the pick 'em game is https://www.bit.ly/Footballpickem and your password is: " +
          data.newUserData.password
      )
      .then(
        () => console.log("successful write to clipboard."),
        (error) => {
          console.log("could not write to clipboard.");
          console.log(error);
        }
      );

    doAlert(
      "Tell " +
        data.newUserData.userName +
        " to go to https://www.bit.ly/Footballpickem and use the password: " +
        data.newUserData.password,
      "User Created"
    );
  }

  function onUserDataChanged(theUserID, newInfo, newWeeklyData, weeksToUpdatePaid=[]) {
    if (newInfo != null)
      setAllUsersInfoByUserID({
        ...allUsersInfoByUserID,
        [theUserID]: newInfo,
      });
    if (newWeeklyData != null) {
      allDataByWeek.current[theSelectedWeekRef.current].allUsersDataByUserID[
        theUserID
      ] = newWeeklyData;
      updateCurrentWeekAllUsersDataByUserID();

      if (weeksToUpdatePaid.indexOf(19) > -1 || weeksToUpdatePaid.indexOf(19) > -1 || weeksToUpdatePaid.indexOf(19) > -1) {
        if (weeksToUpdatePaid.indexOf(19) == -1) weeksToUpdatePaid.push(19);
        if (weeksToUpdatePaid.indexOf(20) == -1) weeksToUpdatePaid.push(20);
        if (weeksToUpdatePaid.indexOf(21) == -1) weeksToUpdatePaid.push(21);
      }

      for (var i = 0; i < weeksToUpdatePaid.length; i++) {
        if (i != theSelectedWeekRef.current) {
          if (allDataByWeek.current[weeksToUpdatePaid[i]].allUsersDataByUserID[theUserID] != null) allDataByWeek.current[weeksToUpdatePaid[i]].allUsersDataByUserID[theUserID].paid = newWeeklyData.paid;
          else allDataByWeek.current[weeksToUpdatePaid[i]].allUsersDataByUserID[theUserID] = {mnfTotal: "-1", paid: newWeeklyData.paid, madePicks:"0"}
        }
      }
    }
  }

  function onGameWinnerSelected(gameID, teamID, winningTime) {
    allDataByWeek.current[theSelectedWeekRef.current].gamesDataByGameID[
      gameID
    ].winnerID = teamID;
    allDataByWeek.current[theSelectedWeekRef.current].gamesDataByGameID[
      gameID
    ].winningTime = winningTime;
    updateCurrentWeekGamesDataByGameID();
  }

  function onMNFTotalProvided(theTotal) {
    setCurrentWeekMNFTotal(theTotal);
  }

  function onSubmitClick(mnfPointTotal) {
    var haveAPickForAllGames = true;

    for (var gameID in currentWeekGamesDataByGameID) {
      if (
        typeof currentWeekAllUsersPicksByUserIDByGameID[userID.current] ==
          "undefined" ||
        typeof currentWeekAllUsersPicksByUserIDByGameID[userID.current][
          gameID
        ] == "undefined"
      ) {
        haveAPickForAllGames = false;
        break;
      }
    }

    if (!haveAPickForAllGames) {
      doAlert(
        "You need to make a pick for all games first.",
        "Invalid Selection"
      );
      return;
    }

    var isReSubmit = false;
    var hasPaid = false;
    if (currentWeekAllUsersDataByUserID[userID.current] != null) {
      isReSubmit =
        currentWeekAllUsersDataByUserID[userID.current].mnfTotal != "-1";
      hasPaid = currentWeekAllUsersDataByUserID[userID.current].paid == "1";
    }

    gamesPickedDirtyBit.current = false;
    myAJAX(
      "/php/pickem/submit_picks.php",
      {
        loginToken: loginToken.current,
        weekNum: theSelectedWeekRef.current,
        picksByGameID: currentWeekAllUsersPicksByUserIDByGameID[userID.current],
        mnfPointTotal: mnfPointTotal,
        version:APP_VERSION
      },
      function (data) {
        var userData =
          allDataByWeek.current[theSelectedWeekRef.current]
            .allUsersDataByUserID[userID.current];
        if (userData != null) {
          userData.madePicks = "1";
          userData.mnfTotal = mnfPointTotal;
        } else {
          userData = {
            madePicks: "1",
            mnfTotal: mnfPointTotal,
            paid: "0",
          };
          allDataByWeek.current[
            theSelectedWeekRef.current
          ].allUsersDataByUserID[userID.current] = userData;
        }

        updateCurrentWeekAllUsersDataByUserID();

        var thisWeekBuyInAmount = buyInAmount;
        if (theSelectedWeekRef.current == 19) thisWeekBuyInAmount *= 3;
        doAlert(
          "Your picks have been " +
            (isReSubmit ? "updated" : "submitted") +
            "!" +
            (hasPaid ? "" : " Don't forget to pay the $" + thisWeekBuyInAmount + "."),
          isReSubmit ? "Picks Updated" : "Picks Submitted"
        );
      }
    );
  }

  function onEditGamesButtonClick() {
    var newVal = !inEditGamesMode;
    setAdminButtonIDs([
      "createUser",
      "createGame",
      newVal ? "editGamesToggleOn" : "editGamesToggleOff",
    ]);
    setInEditGamesMode(newVal);
  }

  function onLogOutClick() {
    var nowTime = new Date().getTime();
    var expires = "expires=" + new Date(nowTime - 1).toUTCString(); // 100 days in ms (max is 1 week though in Safari)
    document.cookie = "loginToken=;" + expires + ";SameSite=lax";
    loginToken.current = "";
    setDisplayLoginDialog(true);
  }

  function doAlert(
    body,
    title = "Alert",
    buttonLabels = ["OK"],
    buttonFunctions = []
  ) {
    setAlertData({
      title: title,
      body: body,
      buttonLabels: buttonLabels,
      buttonFuncs: buttonFunctions,
    });
  }
  function removeAlertOnButtonClick() {
    setAlertData(null);
  }

  function displayUserProfile(theUserID) {
    setUserDataForProfileDialog(getUserDataForPaidUserDialogOrProfileDialog(theUserID));
  }

  function removeUserProfileDialog() {
    setUserDataForProfileDialog(null);
  }

  function displayUserPaidDialog(theUserID) {
    setUserDataForPaidUserDialog(getUserDataForPaidUserDialogOrProfileDialog(theUserID));
  }

  function removeUserPaidDialog() {
    setUserDataForPaidUserDialog(null);
  }

  function onProfileButtonClick(theUserID) {
    setUserDataForPaidUserDialog(null);
    displayUserProfile(theUserID);
  }

  function getUserDataForPaidUserDialogOrProfileDialog(theUserID) {
    var userData = {
      ...allUsersInfoByUserID[theUserID],
      ...allDataByWeek.current[theSelectedWeekRef.current].allUsersDataByUserID[
        theUserID
      ],
      userID: theUserID,
    };
    if (userData.mnfTotal == null) userData.mnfTotal = -1;
    if (userData.paid == null) userData.paid = 0;
    if (userData.madePicks == null) userData.madePicks = 0;
    var paidHistory = {};
    for (var weekNum in allDataByWeek.current) {
      var didPay =
        allDataByWeek.current[weekNum].allUsersDataByUserID[theUserID]?.paid;
      paidHistory[weekNum] = didPay == null ? "0" : didPay;
    }
    userData.paidHistory = paidHistory;
    return userData;
  }

  return (
    <>
      {!displayLoginDialog && (
        <div>
          <TopContent
            userName={userName.current}
            isAdmin={isAdmin.current}
            userID={userID.current}
            adminButtonIDs={adminButtonIDs}
            loginToken={loginToken.current}
            weekNum={theSelectedWeek}
            gamesPickedDirtyBit={gamesPickedDirtyBit.current}
            onLogOutClick={onLogOutClick}
            onGameAdded={onGameAdded}
            onNewUserCreated={onNewUserCreated}
            onEditGamesButtonClick={onEditGamesButtonClick}
            onSelectedWeekChange={onNewWeekSelected}
            doAlert={doAlert}
          />
          <MainContent
            mainContentToDisplay={mainContentToDisplay}
            currentlySelectedWeek={theSelectedWeek}
            currentWeekGamesDataByGameID={currentWeekGamesDataByGameID}
            currentWeekAllUsersPicksByUserIDByGameID={
              currentWeekAllUsersPicksByUserIDByGameID
            }
            currentWeekAllUsersDataByUserID={currentWeekAllUsersDataByUserID}
            currentWeekMNFTotal={currentWeekMNFTotal}
            currentWeekWinComment={currentWeekWinComment.current}
            userID={userID.current}
            loginToken={loginToken.current}
            allUsersInfoByUserID={allUsersInfoByUserID}
            sbData={sbData}
            isAdmin={isAdmin.current}
            inEditGamesMode={inEditGamesMode}
            numGamesPlayedByUserID={numGamesPlayedByUserID.current}
            onGameEdited={onGameEdited}
            onGameDeletedInDB={onGameDeletedInDB}
            onSelectionMade={onSelectionMade}
            onSubmitClick={onSubmitClick}
            onMNFPointTotalInputValueChanged={onMNFPointTotalInputValueChanged}
            onGameWinnerSelected={onGameWinnerSelected}
            onMNFTotalProvided={onMNFTotalProvided}
            doAlert={doAlert}
            displayUserProfile={displayUserProfile}
            displayUserPaidDialog={displayUserPaidDialog}
            allPicksLockedUpToThisWeek={allPicksLockedUpToThisWeek.current}
            onUserDataChanged={onUserDataChanged}
            updateSBData={updateSBData}
          />
          <BottomContent selectedWeek={theSelectedWeek} />
        </div>
      )}

      {alertData != null && (
        <Alert
          alertData={alertData}
          removeAlertOnButtonClick={removeAlertOnButtonClick}
        />
      )}

      {displayLoginDialog && (
        <LoginDialog onPWEntered={getInitData} doAlert={doAlert} />
      )}

      {userDataForPaidUserDialog != null && (
        <UserPaidDialog
          userData={userDataForPaidUserDialog}
          loginToken={loginToken.current}
          selectedWeekNum={theSelectedWeekRef.current}
          onUserDataChanged={onUserDataChanged}
          removeUserPaidDialog={removeUserPaidDialog}
          onProfileButtonClick={onProfileButtonClick}
          doAlert={doAlert}
          allPicksLockedUpToThisWeek={allPicksLockedUpToThisWeek.current}
        />
      )}

      {userDataForProfileDialog != null && (
        <UserProfileDialog
          doAlert={doAlert}
          userData={userDataForProfileDialog}
          loginToken={loginToken.current}
          weekNum={theSelectedWeekRef.current}
          removeUserProfileDialog={removeUserProfileDialog}
          onUserDataChanged={onUserDataChanged}
          allPicksLockedUpToThisWeek={allPicksLockedUpToThisWeek.current}
        />
      )}
    </>
  );
}

export default App;
export { nflDay1, buyInAmount, squaresBuyInAmount, adminName };
