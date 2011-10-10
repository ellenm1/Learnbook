<!--/*v 1.7 01-24-2011 -emeiselm - added green button*/-->
// this contains functions specific to Perception quizzes
      var afterQuizMsg = parent.data.afterQuizMsg;
	  var qPage=parent.data.PageArray[parent.data.znThisPage-1];
	  var hr= qPage.url.indexOf('href');
	  var hr5= (hr+5);
	  var sHref=((qPage.url).slice(hr5));
      var sSession=(qPage.quiz);
 
// PIP file to call - leave blank to get PIP from 
var sCall = "EMBED"; // default value is "SCORM"

// error messages
// error message when LMS API object cannot be found
// usually because not called from an LMS
// also added to other error messages below, since their most common cause is no LMS

var sNoLMSText= "<b>Important!</b><br> ";
    sNoLMSText+="Quizzes can only be run by MLearning. I can't detect MLearning so this quiz will not open! \n\n";
    sNoLMSText+="This could be because you did not access the module through MLearning, "
	sNoLMSText+="or because technical difficulties are preventing communication with MLearning.\n\n";
    sNoLMSText+="If you intended to take the quiz but did not come through MLearning, please log in to MLearning and launch this module again.\n\n";
    sNoLMSText+="If you are already logged in to MLearning and got this error anyway, ";
    sNoLMSText+="contact the MLearning team.";
// error message when URL of Perception server not defined
var sNoHrefText = "URL of Perception server not defined.";
// error message when assessment ID not defined
var sNoSessionText = "Assessment ID not defined.";
// error message when PIP file not defined
var sNoCallText = "PIP file not defined.";
// error message when unable to get student ID from the LMS
var sNoStudentIDText = "Unable to obtain the student ID from the LMS.";

var _Debug = true;  // set this to false to turn debugging off

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101; 
var _InvalidArgumentError = 201;
var _NotInitialized = 301;
var _NotImplementedError = 401;

// local variable definitions
var apiHandle = null;
var urlEnd = document.URL.split("?")[0];
var bInit = false;
//var sName = "";
var sName  =((parent.SCOGetValue("cmi.core.student_id"))+'');
var sDetails = ((parent.SCOGetValue("cmi.core.student_name"))+'');
var iScore = getParameter('score');
var iMax = getParameter('max');
var iPercentScore = Math.round((iScore/iMax)*100);
var objectiveID=""; 
var msgDiv= document.getElementById('messageDiv');
var finDiv= document.getElementById('finishedDiv');
var qzFrm = document.getElementById('quizFrame');
if (iScore.length > 0) {
	quizFinish();//add quiz score to PageArray and record objectives
} else {
	quizStart(); //go to quiz	
}

function quizStart() {
	// get required parameters
	if (sHref.length == 0) {
		sHref = getParameter('href');	
	}
	if (sHref.length == 0) {
		alert(sNoHrefText + "\n " + sNoLMSText);
		self.close();
	}
	if (sSession.length == 0) {
		sSession = getParameter('session');
	}
	if (sSession.length == 0) {
		alert(sNoSessionText + "\n " + sNoLMSText);
		self.close();
	}

	if (sCall.length == 0) {
		sCall = getParameter('call');
	}
	if (sCall.length == 0) {
		alert(sNoCallText + "\n " + sNoLMSText);
		self.close();
	}

 
	 if (parent.APIOK()){	
			qArrayItem = parent.data.PageArray[parent.data.znThisPage-1]; 
			objectiveID=('Q'+sSession);
			//sscore is just for use in the take it again message. iScore is used for everything else.
			sScore = (parent.SCOGetObjectiveData(objectiveID, "score.raw"))?(parent.SCOGetObjectiveData(objectiveID, "score.raw")):qArrayItem.qScore; //set sscore to whatever is listed there as the score.			
			sMax = qArrayItem.qMax;
			if (sScore == null ||sScore == NaN || sScore == '(null)' || sScore == '' || !sScore) {  //"or" statements necessary because safari determines null differently
 			Go();			 
			}
			else { //there is a score so ask if you really want to take the quiz again
			msgDiv.style.display='block';
			qzFrm.style.display='none';
			msgDiv.innerHTML=('You already have a score of '+sScore+' for this quizlet. ');
			msgDiv.innerHTML+=('<br><br>If you wish to take this quizlet again<br>and lose the existing score, click the button below<br><br>');
			msgDiv.innerHTML+=('<a href=\"javascript:takeItAnyway();\" ><img src=\"images/quiz/up/tryAgain.jpg\" alt=\"Erase my score and let me try again\" style=\"float:left\" name=\"tryAgain\" id=\"tryAgain\"\ onmouseout=\"MM_swapImgRestore()\" onmouseover=\"MM_swapImage(\'tryAgain\',\'\',\'images/quiz/over/tryAgain.jpg\',1)\"/></a>');
			msgDiv.innerHTML+=('<br style="clear:both;"><h1>This module can not be marked "Complete" until all quizlets have been attempted at least once, AND the "Send Score to MLearning" button is clicked on the <a href="scorePage.htm">Score and Status page</a>. Quizlets may be taken multiple times.</h1></p>');
			}
		
	}
else {
	msgDiv.style.display='block';
	msgDiv.innerHTML=(sNoLMSText);
    qzFrm.style.display='none';
	  }
}

function takeItAnyway(){  

	msgDiv.style.display='none';
	qzFrm.style.display='block';// get required parameters
	
	if (sHref.length == 0) { sHref = getParameter('href'); }
	if (sHref.length == 0) {msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoHrefText + "\n" + sNoLMSText+' no sHref'); } //the return stops it here.
	if (sSession.length == 0) { sSession = getParameter('session'); }
	if (sSession.length == 0) { msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoSessionText + "\n" + sNoLMSText+' no sSesssion'); }
	if (sCall.length == 0) { sCall = getParameter('call'); }
	if (sCall.length == 0) { msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoCallText + "\n" + sNoLMSText + 'no sCall'); }	
	
	Go();
}

function MarkObjectiveDone(){//send quiz score data to the LMS
var qPage = qPage;
var totalObj = parent.SCOGetValue("cmi.objectives._count");
var request="cmi.objectives."+totalObj-1+".id";
	parent.SCOSetObjectiveData(objectiveID, "status", "completed");
	parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
	parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
	window.parent.SCOCommit();
	//lets check to make sure they match:
	var objScore=parent.SCOGetObjectiveData(objectiveID, "score.raw");
	parent.data.window.location.href=parent.data.window.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
	parent.data.znThisPage=(pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
	window.parent.data.znThisPage=(pageNo);
	} 
	 
function quizFinish() {
	
	var fin=1;
 	qzFrm.style.display='none';
/*	
	msgDiv.innerHTML=('<table width="500" border="1"><tr><td width=\"347\"><h1>Thank you! Your score is being recorded.<\/h1><p>This quizlet has been completed with a score of <b>')+iScore+(' <h1 style=\"display:inline\">('+iPercentScore+ '%)<\/h1><\/b><\/td>');
	msgDiv.innerHTML+=('<td width="143">');
	msgDiv.innerHTML+=('<a href="javascript:NextPage();" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'nextPage\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/nextBlueBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/nextBlueBtn.jpg" alt="Next Page" name="nextPage" width="99" height="69" border="0" id="nextBlueBtn" \/><\/a>');
    msgDiv.innerHTML+=('XXX<\/td><\/tr><\/table>');*/
	 
	
msgDiv.innerHTML='<table width="500" border="0"><tr valign="top"><td width="300" style="border-bottom:1px solid #CCCCCC;">This quizlet has been completed with a score of <b>'+iScore+'<\/b> <h1 style="display:inline">('+iPercentScore+'%)<\/h1><br \/><br \/><a href="javascript:NextPage();" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'nextPage\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/nextGreenBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/nextGreenBtn.jpg" alt="Next Page" name="nextPage" width="99" height="69" border="0" id="nextBlueBtn" \/><\/a><\/td><td width="143" style="border-bottom:1px solid #CCCCCC;"><\/td><\/tr><tr><td width="300" style="padding-top:18px"><a href="'+qPage.url+'" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'eraseScoreBtn\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/eraseScoreBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/eraseScoreBtn.jpg" alt="Erase this score and try again!" name="eraseScoreBtn" width="278" height="34" border="0" id="eraseScoreBtn" \/><\/a></td><td width="144">&nbsp;</td></tr><tr><td>This module can not be marked "Complete" until all quizlets have been attempted. Quizlets may be taken multiple times without penalty.<\/td><td><\/td><\/tr><tr><td><a href="scorePage.htm" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'showStatus\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/haveIcompletedBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/haveIcompletedBtn.jpg" alt="Have I completed all the required quizlets?" name="showStatus" width="279" height="33" border="0" id="showStatus" \/><\/a><\/td><td><\/td><\/tr><\/table>';
msgDiv.style.display='block';	
	/*finDiv.innerHTML=('<table width="500" border="0"><tr><td width="347"><td width="346">');
	finDiv.innerHTML+=('<a href="'+qPage.url+'" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'eraseScoreBtn\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/eraseScoreBtn.jpg\',1)">');
	finDiv.innerHTML+=('<img src="images\/quiz\/specialIcons\/scorePage\/up\/eraseScoreBtn.jpg" alt="Erase this score and try again!" name="eraseScoreBtn" width="278" height="34" border="0" id="eraseScoreBtn" \/><\/a><\/td>');
	finDiv.innerHTML+=('<td width="144">&nbsp;</td></tr>');
    finDiv.innerHTML+=('<tr><td>This module can not be marked "Complete" until all quizlets have been attempted.<\/td><td>&nbsp;<\/td><\/tr>');
    finDiv.innerHTML+=('<tr><td>');
	finDiv.innerHTML+=('<a href="scorePage.htm" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'showStatus\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/haveIcompletedBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/haveIcompletedBtn.jpg" alt="Have I completed all the required quizlets" name="showStatus" width="279" height="33" border="0" id="showStatus" \/><\/a><\/td><td>&nbsp;<\/td><\/tr>');
    finDiv.innerHTML+=('<tr><td><p>At that point, you may complete this module by clicking the <b>Send Score to MLearning</b> button on the');
	finDiv.innerHTML+=('<a href="scorePage.htm">Score and Status page<\/a>. <\/p><p>Quizlets may be taken multiple times without penalty.<\/td>');
    finDiv.innerHTML+=('<td><\/td><\/tr><\/table>');
	
    finDiv.style.display='block';	*/
	objectiveID=('Q'+sSession);
	MarkObjectiveDone(objectiveID);
	
	
	qArrayItem = parent.data.PageArray[parent.data.znThisPage-1]; 
    qArrayItem.qScore = iScore;
	qArrayItem.qMax = iMax;
	sSession = qArrayItem.quiz;
}
	//http://www.scorm.com/resources/cookbook/CookingUpASCORM_v1_2.pdf 10.3
   


 

 function startup(){ //checks that the quiz iFrame has been rendered, then redirects it to the quiz.
             if(frames['quizFrame']){//alert('yes');	
		        frames['quizFrame'].location.href=sHref;	 
	            }
             else{
		        setTimeout("startup()",100);
		         }      
	      }
// construct URL to SCO and navigate to it

function Go() {
	
    if (parent.APIOK()){

		if (sName.length == 0) {
			alert(sNoStudentIDText + "\n" + sNoLMSText);
			parent.SCOFinish();
			self.close();
			return;
		}

		sHref += '?CALL=' + sCall + '&SESSION=' + sSession + '&NAME=' + sName + '&HOME=' + escape(urlEnd);
		sHref += '&DETAILS=' + sDetails;
	 
       startup();
		
		
		
	} else {
		alert(sNoLMSText);
		nextPage();//go to next page of module
	}
}

function getParameter(name)   
{
		sParms = unescape(document.location.search.substr(1));
        aParms = sParms.split("&");
        iNumParms = aParms.length;
        for (iParm = 0; iParm < iNumParms; iParm++) {
                sParmName = aParms[iParm].split("=")[0];
                sParmValue = aParms[iParm].split("=")[1];
                if (name.toUpperCase() == sParmName.toUpperCase()) {
                        return unescape(sParmValue);
						alert(unescape(sParmValue));
                }
        }
        return "";
		 
}

