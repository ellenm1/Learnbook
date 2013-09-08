<!--/*v 1.8 12-05-2012 -emeiselm*/-->
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
var testing = parent.testing;
// this contains functions specific to Perception quizzes
var afterQuizMsg = parent.data.afterQuizMsg;
var qPage=parent.data.PageArray[parent.data.znThisPage-1];
var hr= qPage.url.indexOf('href');
var hr5= (hr+5);
var sHref=((qPage.url).slice(hr5));
var sSession=(qPage.quiz);
// PIP file to call - leave blank to get PIP from 
var sCall = "EMBED"; // default value is "SCORM"
// error message when LMS API object cannot be found
// usually because not called from an LMS
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
	//parent.data.window.location.href=parent.data.window.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
	parent.data.znThisPage=(pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
	window.parent.data.znThisPage=(pageNo);
	} 
function displayRedirTxt(){  finDiv.innerHTML='<h1>Thank you!<\/h1> You will now be redirected to the next page of this module.';}	
function openMessageBlock(){  finDiv.style.display='block';  }	 

function quizFinish() {
	if(testing){('In quizFinish')}
	var fin=1;
 	qzFrm.style.display='none';
  	setTimeout('openMessageBlock()',25);
    finDiv.innerHTML='One moment please... sending information to MLearning for safekeeping';//      
	objectiveID=('Q'+sSession);
	MarkObjectiveDone(objectiveID);		
	qArrayItem = parent.data.PageArray[parent.data.znThisPage-1];
	if(testing){console.log('PTR parent.data.znThisPage-1='+parent.data.znThisPage-1+' parent.data.znThisPage'+parent.data.znThisPage-1)}
    qArrayItem.qScore = iScore;
	qArrayItem.qMax = iMax;
	if(testing){('In quizFinish: qArrayItem.qScore= '+qArrayItem.qScore+', qArrayItem.qMax'+qArrayItem.qMax)   }
	sSession = qArrayItem.quiz;
	var keys=[];
	for(key in qArrayItem){
		keys.push(key);
		var val = qArrayItem[key]
		console.log(key+':'+key.value);
	}
	if(testing){console.log(keys);}
	for (var key in qArrayItem){
		var val = qArrayItem[key];
		if(testing){console.log(key+' '+val);}	
	}
	
	var gNextPage = parent.data.PageArray[parent.data.znThisPage];
	if(testing){console.log('gNextPage= '+gNextPage);}	
    setTimeout('displayRedirTxt()',2000);
    document.location.href =  gNextPage.url;
}//end function quizFinish()
	//http://www.scorm.com/resources/cookbook/CookingUpASCORM_v1_2.pdf 10.3
   


 
//checks that the quiz iFrame has been rendered, then redirects it to the quiz.
function startup(){ 
    if(frames['quizFrame']){ 
		frames['quizFrame'].location.href=sHref;	 
	}
    else{
		setTimeout("startup()",100);
	}      
}//end function startup()

// construct URL to SCO and navigate to it
function Go(){	
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
	} 
	else{
		alert(sNoLMSText);
		nextPage();//go to next page of module
	}
}//end function Go()

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

