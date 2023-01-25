import ClickableUsername from "./ClickableUserName";

export default function SetOfCommaDelimitedUsers({userDataArray, styleForClickableUsername={}, onUsernameClick=null, addCommaToLastName}) {
  return (
    <>
      {userDataArray.map((userData, idx) => {
        return (
          <div key={idx} style={{ display: "inline-block" }}>
            <ClickableUsername
              style={styleForClickableUsername}
              userInfo={userData}
              onUsernameClick={onUsernameClick}
            />
            {(idx != userDataArray.length - 1 || addCommaToLastName) && <span>,&nbsp;</span>}
          </div>
        );
      })}
    </>
  );
}
