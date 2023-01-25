function myAJAX(
  url,
  args,
  dataReturnFunction,
  alertError,
  errorFunction,
  returnsHTML
) {
  // old-school defaults so that minifier works
  dataReturnFunction = dataReturnFunction || null;
  alertError = alertError || true;
  errorFunction = errorFunction || null;
  returnsHTML = returnsHTML || false;

  url = getProperURL(url);

  var formData = new FormData();
  for (var property in args) {
    var val = args[property];
    if (val instanceof File) formData.append(property, val);
    else formData.append(property, JSON.stringify(val));
  }

  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (http.readyState == XMLHttpRequest.DONE) {
      if (http.status == 200) {
        if (!returnsHTML) {
          try {
            var res = JSON.parse(this.responseText);
          } catch (e) {
            if (alertError)
              alert("Bad result from server:<br><br>" + this.responseText);
            return;
          }
          var nowTime = new Date().getTime();

          if (res.result == "error") {
            if (alertError) alert(res.data);
            if (errorFunction != null) errorFunction(res.data);
          } else if (dataReturnFunction != null) dataReturnFunction(res.data);
        } else if (dataReturnFunction != null)
          dataReturnFunction(this.responseText);
      } else {
        if (this.status != 0) {
          if (alertError) alert("There was an error " + this.status);
          if (errorFunction != null)
            errorFunction("There was an error " + this.status);
        }
      }
    }
  };
  http.open("POST", url, true);
  //http.setRequestHeader("Content-type", "application/json");
  http.send(formData);
}

function getFormattedTimeFromDateSeconds(s) {
  if (s == -1) return "TBD";
  var d = new Date(s * 1000);
  var amOrPM = "am";
  var h = d.getHours();
  if (h >= 12) {
    h -= 12;
    amOrPM = "pm";
  }
  if (h == 0) h = 12;
  var m = d.getMinutes().toString();
  if (m.length == 1) m = "0" + m;
  return h + ":" + m + " " + amOrPM;
}

function getHoursAndMinutesFromTime(t) {
  var hourVal;
  var minVal;

  t = t.toString().trim();
  var amOrPM = null;
  if (t.length >= 2) {
    if (t.substring(t.length - 2, t.length).toLowerCase() == "am")
      amOrPM = "am";
    if (t.substring(t.length - 2, t.length).toLowerCase() == "pm")
      amOrPM = "pm";
    if (amOrPM != null) t = t.substring(0, t.length - 2).trim();
  }

  if (t.indexOf(":") > -1) {
    hourVal = t.substring(0, t.indexOf(":")).trim();
    minVal = t.substring(t.indexOf(":") + 1, t.length).trim();
    if ((amOrPM != null && hourVal > 12) || hourVal < 0)
      return ["bad time", "bad time"];
  } else {
    if (t.length == 0) return ["bad time", "bad time"];
    if (t.length <= 2) {
      hourVal = t;
      minVal = "0";
    } else if (t.length == 3) {
      hourVal = parseInt(t.substring(0, 1));
      minVal = parseInt(t.substring(1, 3));
    } else if (t.length == 4) {
      hourVal = parseInt(t.substring(0, 2));
      minVal = parseInt(t.substring(2, 4));
    } else return ["bad time", "bad time"];
  }

  if (isNaN(hourVal) || isNaN(minVal)) return ["bad time", "bad time"];
  hourVal = parseInt(hourVal);
  minVal = parseInt(minVal);

  if (hourVal == 12) hourVal = 0;
  if (amOrPM == "pm") hourVal += 12;
  else if (amOrPM == null && hourVal < 6) hourVal += 12; // times must be entered in at PST. If 5:59 or less and am or pm was not specified, assume PM; 6:00 or later is AM

  if (hourVal > 23 || hourVal < 0) return ["bad time", "bad time"];
  if (minVal > 59 || minVal < 0) return ["bad time", "bad time"];

  return [hourVal, minVal];
}

function getProperURL(url) {
  if (window.location.toString() == "http://localhost:3000/")
    url = "https://localhost" + url;
  else;
  return url;
}

function getCookieVal(cName) {
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(cName + "=") == 0) {
      return c.substring(cName.length + 1, c.length);
    }
  }
  return "";
}

function convertToRGBA(rgb, alpha) {
  var ret = "rgba(";
  ret += rgb.substring(4, rgb.length - 1);
  ret += ", " + alpha.toString() + ")";
  return ret;
}

function getDataForPreviousWeeksPaid(userData, newPaidVal, weekNum, allPicksLockedUpToThisWeek) {
  var ret = {};
  var history = userData.paidHistory;
  if (weekNum > 19 && weekNum < 22) weekNum = 19;
  ret.weeksToUpdatePaid = [parseInt(weekNum)];
  var mentionPaid, mentionUnpaid, mentionVouched;
  mentionPaid = mentionUnpaid = mentionVouched = false;

  if (
    weekNum > allPicksLockedUpToThisWeek &&
    newPaidVal != userData.paid
  ) {
    for (var i = weekNum - 1; i > allPicksLockedUpToThisWeek; i--) {
      if (history[i] != newPaidVal) {
        if (newPaidVal == "1") {
          if (history[i] == "0") {
            ret.weeksToUpdatePaid.push(i);
            mentionUnpaid = true;
          } else if (history[i] == "-2") {
            ret.weeksToUpdatePaid.push(i);
            mentionVouched = true;
          }
        } else if (newPaidVal == "0") {
          if (history[i] == "1") {
            ret.weeksToUpdatePaid.push(i);
            mentionPaid = true;
          } else if (history[i] == "-2") {
            ret.weeksToUpdatePaid.push(i);
            mentionVouched = true;
          }
        } else if (newPaidVal == "-2") {
          if (history[i] == "0") {
            ret.weeksToUpdatePaid.push(i);
            mentionUnpaid = true;
          }
        }
      }
    }
    if (
      history[allPicksLockedUpToThisWeek] != newPaidVal &&
      newPaidVal == "1" &&
      history[weekNum] == "-2"
    )
    ret.weeksToUpdatePaid.push(allPicksLockedUpToThisWeek);
  }

  if (ret.weeksToUpdatePaid.length > 1) {
    var newPaidValWord =
      newPaidVal == "1" ? "paid" : newPaidVal == "0" ? "unpaid" : "vouched";
    ret.msg = "";
    ret.title = "Change Previous Weeks Also?";
    var weekName = "Week " + weekNum;
    if (weekNum == 19) weekName = "Playoffs";
    ret.buttonLabels = ["Only " + weekName, "All Weeks", "Cancel"];
    if (ret.weeksToUpdatePaid.length == 2) {
      var theWeek = ret.weeksToUpdatePaid[ret.weeksToUpdatePaid.length - 1];
      var theValue =
        history[theWeek] == "1"
          ? "paid"
          : history[theWeek] == "0"
          ? "unpaid"
          : "vouched";
      ret.msg =
        "The previous week " +
        theWeek +
        " is set to " +
        theValue +
        ". Change Only " +
        weekName +
        " or change Both Weeks to " +
        newPaidValWord +
        "?";
      ret.buttonLabels = ["Only " + weekName, "Both Weeks", "Cancel"];
      ret.title = "Change Previous Week Also?";
    } else {
      var theWeeks =
      ret.weeksToUpdatePaid.slice(1).reverse().join(", ") + " & " + weekName;
      var theValues = "";
      if (mentionPaid) theValues = "paid";
      if (mentionUnpaid) theValues = "unpaid";
      if (mentionVouched) {
        if (theValues == "") theValues = "vouched";
        else theValues += "or vouched";
      }

      ret.msg =
        "Weeks " +
        theWeeks +
        " are marked " +
        theValues +
        ". Change only " +
        weekName +
        " or change all these weeks to " +
        newPaidValWord +
        "?";
    }
  }
  return ret;
}

export {
  myAJAX,
  getFormattedTimeFromDateSeconds,
  getHoursAndMinutesFromTime,
  getCookieVal,
  convertToRGBA,
  getDataForPreviousWeeksPaid
};
