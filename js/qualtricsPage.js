//v 1.9 12-21-2012 emeiselm
// this contains functions specific to Qualtrics quizzes
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementById("content").innerHTML+=("<div id='output'><!--Messages--></div>"); 
 
if ( parent.APIOK() ){    
    var testing = parent.testing;     
    var afterQuizMsg = parent.data.afterQuizMsg;
    var qPage=parent.data.PageArray[parent.data.znThisPage-1];
    var hr= qPage.url.indexOf('href');
    var hr5= (hr+5);
    var sHref=((qPage.url).slice(hr5));//return just the part of the quiz URL after "href"
    var qType="U";//just in case it wasn't put into the pageArray;
    var objectiveID= (qType+qPage.quiz);//this objective's id in the LMS
    var totalObj = parent.SCOGetValue("cmi.objectives._count");
	var objMax   = parent.SCOGetObjectiveData(objectiveID, "score.max");
	var objScore = parent.SCOGetObjectiveData(objectiveID, "score.raw");
	var objStatus= parent.SCOGetObjectiveData(objectiveID, "status");
    	qPage.qStatus= objStatus;
    var qStatus = qPage.qStatus;
 
    // error message when LMS API object cannot be found usually because not called from an LMS
    // also added to other error messages below, since their most common cause is no LMS
    var sNoLMSText= "<b>Important!</b><br> ";
        sNoLMSText+="Quizzes can only be run by MLearning. I can't detect MLearning so this quiz will not open! \n\n";
        sNoLMSText+="This could be because you did not access the module through MLearning, "
	    sNoLMSText+="or because technical difficulties are preventing communication with MLearning.\n\n";
        sNoLMSText+="If you intended to take the quiz but did not come through MLearning, please log in to MLearning and launch this module again.\n\n";
        sNoLMSText+="If you are already logged in to MLearning and got this error anyway, ";
        sNoLMSText+="contact the MLearning team.";
    // error message when URL of Perception server not defined
    var sNoHrefText = "URL of Qualtrics survey not defined.";
    // error message when assessment ID not defined
    var sNoSessionText = "sNoSessionText goes here - not defined.";
    // error message when unable to get student ID from the LMS
    var sNoStudentIDText = "Unable to obtain the student ID from the LMS.";

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
    var sName  =((parent.SCOGetValue("cmi.core.student_id"))+'');
    var sDetails = ((parent.SCOGetValue("cmi.core.student_name"))+'');
    var sScore;//sScore is just for use in the take it again function
    var iScore = parseInt(getParameter('score'),10);//used in everything else
	//qualtrics PercentScore  is not reliable in some situations, such as when you provide identical looking questions to allow multiple tries on a question (Ulam Hazard quiz)
   // var iPercent = parseInt(getParameter('p'),10);
	//calculate multiplier if possible (iPercent must be greater than zero)
   // var mult = (iPercent>0)?(100/iPercent):0;//since mult is derived from qualtrics' percentScore which is not reliable in some situations, we're only going to use the max score hardcoded in pageArray
    var sMax;
    var iMax; 
	//var iPercentScore;
   // if(testing){console.log('iScore= '+iScore+' iPercent= '+iPercent+' mult= '+  mult )}
    var msgDiv= document.getElementById('messageDiv');
    var finDiv= document.getElementById('finishedDiv');
    var qzFrm = document.getElementById('quizFrame');
//if there's a score, it means you are coming back from taking the quiz
	if(!isNaN(iScore)){ quizFinish(); }
    else{quizStart(); }
}//end if parent.APIOK

else{ 
     	console.log("<h1 style=\'color:red;\'>MLearning not available. Quiz cannot be accessed outside of MLearning. But you can still browse the module</h1>");
    }//just continue, maybe put error alert in here?


function quizStart(){
	// get required parameters
	if (sHref.length == 0){
		sHref = getParameter('href');	
	}
	if (sHref.length == 0){
		alert(sNoHrefText + "\n " + sNoLMSText);
		self.close();
	}
	
	if (parent.APIOK()){			 
		//sScore is just for use in this take it again function. iScore is used for everything else.
		sScore = (parent.SCOGetObjectiveData(objectiveID, "score.raw"))?(parent.SCOGetObjectiveData(objectiveID, "score.raw")):qPage.qScore; //set sscore to whatever is listed there as the score.			
		iMax = ((qPage.qMax!="")&&!isNaN(qPage.qMax))?qPage.qMax:0;//if there's nothing in PageArray, set max pts to 0.
		if((qPage.qMax=="")&&(countscore==0)){ msgDiv.innerHTML=("no maximum score was set for this quiz, but it is supposed to have one. Please alert MLearning of this problem." ) }
		if (sScore == null ||sScore == NaN || sScore == '(null)' || sScore == '' || !sScore) {  
			//"or" statements necessary because safari determines null differently
 			Go();			 
		}//end if (sScore == n
		else{ //there is a score so ask if you really want to take the quiz again
			msgDiv.style.display='block';
			qzFrm.style.display='none';
			msgDiv.innerHTML=('You already have a score of '+sScore+' for this quizlet. ');
			msgDiv.innerHTML+=('<br><br>If you wish to take this quizlet again<br>and lose the existing score, click the button below<br><br>');
			msgDiv.innerHTML+=('<a href=\"javascript:takeItAnyway();\" ><img src=\"images/quiz/up/tryAgain.jpg\" alt=\"Erase my score and let me try again\" style=\"float:left\" name=\"tryAgain\" id=\"tryAgain\"\ onmouseout=\"MM_swapImgRestore()\" onmouseover=\"MM_swapImage(\'tryAgain\',\'\',\'images/quiz/over/tryAgain.jpg\',1)\"/></a>');
			msgDiv.innerHTML+=('<br style="clear:both;"><h1>This module can not be marked "Complete" until all quizlets have been attempted at least once, AND the "Send Score to MLearning" button is clicked on the <a href="scorePage.htm">Score and Status page</a>. Quizlets may be taken multiple times.</h1></p>');
		}
						
		//If we can calculate iMax from the data qualtrics sends, do so
		//if(testing){console.log('mult='+mult+', iScore='+iScore+', sMax='+sMax);}
		//iMax =  (!isNaN(mult)&&(mult>0))?(mult*iScore):sMax; 	 
	}//end if (parent.APIOK()){
	else {
		msgDiv.style.display='block';
		msgDiv.innerHTML=(sNoLMSText);
    	qzFrm.style.display='none';
	}
}//end function quizStart

function takeItAnyway(){  
	msgDiv.style.display='none';
	qzFrm.style.display='block';// get required parameters	
	if (sHref.length == 0) { sHref = getParameter('href'); }
	if (sHref.length == 0) {msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoHrefText + "\n" + sNoLMSText+' no sHref'); } 
	if (objectiveID.length == 0) { objectiveID = qType+qPage.quiz; }
	if (objectiveID.length == 0) { msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoSessionText + "\n" + sNoLMSText+' no sSesssion'); }
	
	Go();
}

//send quiz score data to the LMS
function MarkObjectiveDone(){
	//var qPage = parent.data.PageArray[parent.data.znThisPage-1];
	var totalObj = parent.SCOGetValue("cmi.objectives._count");
	var request="cmi.objectives."+totalObj-1+".id";
	parent.SCOSetObjectiveData(objectiveID, "status", "completed");
	parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
	if(typeof iMax=="undefined"){iMax=qPage.qmax}
	iPercent = parseInt((iScore/iMax)*100,10);
	parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
	if(testing){console.log('typeof iMax='+typeof iMax+', iMax='+iMax)}
		if(testing){ console.log('iPercent='+iPercent+', iMax='+iMax+', iScore='+iScore)  }
	window.parent.SCOCommit();
	iStatus="completed";//set status on page
	qStatus="completed";//set status in pageArray;
	//lets check to make sure they match:
	var objScore=parent.SCOGetObjectiveData(objectiveID, "score.raw");
	//parent.data.window.location.href=parent.data.window.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
	parent.data.znThisPage=(pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
	window.parent.data.znThisPage=(pageNo);
} 
	 
function quizFinish(){	
	qPage = parent.data.PageArray[parent.data.znThisPage-1]; 
	qPage.qScore = iScore;	
	var fin=1;
 	qzFrm.style.display='none';	
	MarkObjectiveDone(objectiveID);
	msgDiv.innerHTML='<table width="500" border="0"><tr valign="top"><td width="300" style="border-bottom:1px solid #CCCCCC;">This quizlet has been completed with a score of <b>'+iScore+'<\/b> <h1 style="display:inline">('+iPercent+'%)<\/h1><br \/><\/td><td width="143" style="border-bottom:1px solid #CCCCCC;"><a href="javascript:NextPage();" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'nextPage\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/nextBlueBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/nextBlueBtn.jpg" alt="Next Page" name="nextPage" width="99" height="69" border="0" id="nextBlueBtn" \/><\/a><\/td><\/tr><tr><td width="300"><a href="'+qPage.url+'" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'eraseScoreBtn\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/eraseScoreBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/eraseScoreBtn.jpg" alt="Erase this score and try again!" name="eraseScoreBtn" width="278" height="34" border="0" id="eraseScoreBtn" \/><\/a></td><td width="144">&nbsp;</td></tr><tr><td>This module can not be marked "Complete" until all quizlets have been attempted. Quizlets may be taken multiple times without penalty.<\/td><td><\/td><\/tr><tr><td><a href="scorePage.htm" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'showStatus\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/haveIcompletedBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/haveIcompletedBtn.jpg" alt="Have I completed all the required quizlets?" name="showStatus" width="279" height="33" border="0" id="showStatus" \/><\/a><\/td><td><\/td><\/tr><\/table>';
	msgDiv.style.display='block';		 			
}
	//http://www.scorm.com/resources/cookbook/CookingUpASCORM_v1_2.pdf 10.3
   
function test(){  alert('running test function');}
 
function startup(){ //checks that the quiz iFrame has been rendered, then redirects it to the quiz.
    if(frames['quizFrame']){ 	
		frames['quizFrame'].location.href=sHref;	 
	}
    else{
		setTimeout("startup()",100);
	}      
}//end function startup


// construct URL to SCO and navigate to it
function Go(){	
    if (parent.APIOK()){
		if (sName.length == 0) {
			alert(sNoStudentIDText + "\n" + sNoLMSText);
			parent.SCOFinish();
			self.close();
			return;
		}
	sHref += '&id=' + sName + '&url=' + escape(urlEnd)+'&home=' + escape(urlEnd);
	sHref += '&fn=' + sDetails + '&obj='+ qPage.quiz+'&dom='+document.domain;	 
    startup();						
	} else {
		alert(sNoLMSText);
		nextPage();//go to next page of module
	}
}

function getParameter(name){
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