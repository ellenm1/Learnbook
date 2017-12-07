function ExecuteScript(strId)
{
  switch (strId)
  {
      case "65qzocaWQqq":
        Script1();
        break;
      case "6kK9QX3l4WQ":
        Script2();
        break;
  }
}

function Script1()
{
  var studentID = SCORM_GetStudentID();
var studentName = SCORM_GetStudentName();
var player = GetPlayer();
var detailsArray = studentName.split(',');
var lastName = detailsArray[0];
var firstName =detailsArray[1];
var uniqname, idArray;
var scorePoints = player.GetVar('scorePoints');
var scorePercent = player.GetVar('scorePercent');
var passPercent = player.GetVar('passPercent');
var passPoints = player.GetVar('passPoints');

if (studentID.indexOf("_")!= -1){
    idArray   = studentID.split('_');
    uniqname  = idArray[1];
}
else { uniqname = studentID; }

var emailaddress=uniqname+"@mail.med.umich.edu";
var subject="Results for"+ firstName + " " +lastName;
var body_start="Here are your results. \n Your Total Points Scored: " + scorePoints+"\n Your Percent Scored: " + scorePercent+ "\n Points Required to Pass:" + passPoints + "\n Percent required to Pass:" + passPercent;
var mailto_link='mailto:'+ emailaddress+'?subject='+subject+'&body='+encodeURIComponent(body_start);
win=window.open(mailto_link,'emailWin');
}

function Script2()
{
	var player = GetPlayer();
 	var scorePoints = player.GetVar('scorePoints');
	var scorePercent = player.GetVar('scorePercent');
	var passPercent = player.GetVar('passPercent');
	var passPoints = player.GetVar('passPoints');
	//var maxPoints = Math.round((scorePoints/scorePercent)*100);
    var maxPoints = (scorePercent>0)?Math.round((scorePoints/scorePercent)*100):0;
  getMyData(maxPoints,passPoints,scorePoints,scorePercent, passPercent);
}

