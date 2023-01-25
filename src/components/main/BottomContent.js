import { buyInAmount, squaresBuyInAmount } from "../../App";

function BottomContent(props) {
  return (
    <div style={{ margin: "20px 0 20px 5px", color: "gray" }}>
      {props.selectedWeek <= 18 && (
        <div>
          <p style={{ margin: "0px" }}>{"• $" + buyInAmount + " Buy-In."}</p>
          <p style={{ margin: "0px" }}>• Winner Takes All.</p>
          <p style={{ margin: "0px" }}>
            • Submit picks before start of first game.
          </p>
          <p style={{ margin: "0px" }}>
            • Closest without going over wins tiebreaker. If all go over, lowest
            number wins.
          </p>
        </div>
      )}

      {props.selectedWeek > 18 && props.selectedWeek <= 21 && (
        <div>
          <p style={{ margin: "0px" }}>
            {"• $" +
              buyInAmount * 3 +
              " Buy-In to play ALL 3 WEEKS of playoff Pick 'Em."}
          </p>
          <p style={{ margin: "0px" }}>
            • Submit picks every week before first game.
          </p>
          <p style={{ margin: "0px" }}>
            • Winner is most correct picks over the 3 weeks.
          </p>
          <p style={{ margin: "0px" }}>• 90% of pot goes to winner.</p>
          <p style={{ margin: "0px" }}>
            • 10% of pot goes to biggest loser (fewest correct picks, with a
            pick made for every game).
          </p>
          <p style={{ margin: "0px" }}>
            • Tiebreaker is total points in NFC Championship game.
          </p>
          <p style={{ margin: "0px" }}>
            • Closest without going over wins tiebreaker. If all go over, lowest
            number wins.
          </p>
          <p style={{ margin: "0px" }}>
            • Same tiebreaker rule applies for biggest loser.
          </p>
        </div>
      )}

      {props.selectedWeek == 22 && (
        <div>
          <p style={{ margin: "0px" }}>
            {"• $" +
              squaresBuyInAmount +
              " per square."}
          </p>
          <p style={{ margin: "0px" }}>• Admin lets you select squares once money is recieved.</p>
          <p style={{ margin: "0px" }}>
            {"• Payouts are Q1=$" +
              (squaresBuyInAmount * 15) +
              ", Half=$" +
              (squaresBuyInAmount * 20) +
              ", Q3=$" +
              (squaresBuyInAmount * 30) +
              ", Final=$" +
              (squaresBuyInAmount * 35) + "."}
          </p>
          <p style={{ margin: "0px" }}>• Row and column numbers are randomly generated once game starts.</p>
          <p style={{ margin: "0px" }}>• Squares that are bought and not selected are randomly selected once game starts.</p>
        </div>
      )}
    </div>
  );
}
export default BottomContent;
