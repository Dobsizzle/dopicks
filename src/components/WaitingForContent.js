function WaitingForContent(props) {
  return (
    <div style={{position:"relative", height:"240px"}}>
        <div
          className="rotating_football centeredAndScaledBGImg"
          style={{ backgroundImage: "url('/pickem/other_imgs/football.png')" }}
        ></div>
        <p style={{ textAlign: "center", position: "absolute", bottom:"0px", width:"100%" }}>Getting Content...</p>
    </div>
  );
}
export default WaitingForContent;
