export default function ListSectionLabel({
  dayNum,
  labelName,
  labelWidth = "110",
  marginTop = "25",
  fontSize = "22",
}) {
  var dayLookUp = [
    null,
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
  ];

  return (
    <div
      style={{
        marginTop: marginTop + "px",
        marginLeft: "10px",
        position: "relative",
      }}
    >
      <p
        style={{
          textAlign: "left",
          fontSize: fontSize + "px",
          borderLeft: "2px solid rgb(50, 50, 50)",
          borderTop: "2px solid rgb(50, 50, 50)",
          borderBottom: "2px solid rgb(50, 50, 50)",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          padding: "0px 10px 1px 6px",
          width: labelWidth + "px",
          display: "inline-block",
        }}
      >
        {dayNum != null ? dayLookUp[dayNum] : labelName}
      </p>
      <div
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(50, 50, 50, 1) 30%, rgba(50, 50, 50, 0) 99%)",
          height: "2px",
          margin: "-2px 0 0 10px",
        }}
      ></div>
    </div>
  );
}
