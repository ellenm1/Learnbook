//v 1.7 01-12-2011 emeiselm
// this contains functions specific to Qualtrics quizzes
//alter quizFinish() function: search for " //change the link to wherever "
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementById("content").innerHTML+=("<div id='output'><!--Messages--></div>") ;
 
 
if ( parent.APIOK() ){
 
    
     var testing = true;     
     var afterQuizMsg = parent.data.afterQuizMsg;
     var qPage=parent.data.PageArray[parent.data.znThisPage-1];
     var hr= qPage.url.indexOf('href');
     var hr5= (hr+5);
     var sHref=((qPage.url).slice(hr5));//return just the part of the quiz URL after "href"
     var qType="U";//just in case it wasn't put into the pageArray;
     var objectiveID= (qType+qPage.quiz);//this objective's id in the LMS
     var qStatus = qPage.qStatus;
     var totalObj = parent.SCOGetValue("cmi.objectives._count");
	 var objMax   = parent.SCOGetObjectiveData(objectiveID, "score.max");
	 var objScore = parent.SCOGetObjectiveData(objectiveID, "score.raw");
	 var objStatus= parent.SCOGetObjectiveData(objectiveID, "status");
    //C for captivate. Q for questionmark, I for interactions,U for Qualtrics 
     qStatus= objStatus;
 
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
//alert('urlEnd='+urlEnd);
    var bInit = false;
//var sName = "";
    var sName  =((parent.SCOGetValue("cmi.core.student_id"))+'');
    var sDetails = ((parent.SCOGetValue("cmi.core.student_name"))+'');
    var sScore;
    var iScore = parseInt(getParameter('score'),10);
//qualtrics PercentScore
    var iPercent = parseInt(getParameter('p'),10);
//calculate multiplier if possible (iPercent must be greater than zero)
    var mult = (iPercent>0)?(100/iPercent):0;
    var sMax=qPage.qmax;
    var iMax=qPage.qmax; 
//var iPercentScore;
    if(testing){console.log('iScore= '+iScore+' iPercent= '+iPercent+' mult= '+  mult )}

     var msgDiv= document.getElementById('messageDiv');
     var finDiv= document.getElementById('finishedDiv');
     var qzFrm = document.getElementById('quizFrame');
//alert(iScore)
//wais this quiz taken?
//if (iScore.length > 0) {
if (!isNaN(iScore)){ quizFinish(); }
     else {  quizStart();    }
}
else{ 
     console.log("<h1 style=\'color:red;\'>MLearning not available. Quiz cannot be accessed outside of MLearning. But you can still browse the module</h1>");
      }//just continue, maybe put error alert in here?




function quizStart() {
	// get required parameters
	if (sHref.length == 0) {
		sHref = getParameter('href');	
	}
	if (sHref.length == 0) {
		alert(sNoHrefText + "\n " + sNoLMSText);
		self.close();
	}
	
 
	 if (parent.APIOK()){			 
			//sScore is just for use in this take it again function. iScore is used for everything else.
			sScore = (parent.SCOGetObjectiveData(objectiveID, "score.raw"))?(parent.SCOGetObjectiveData(objectiveID, "score.raw")):qPage.qScore; //set sscore to whatever is listed there as the score.			
			sMax = qPage.qmax;
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
			
			
			//If we can calculate iMax from the data qualtrics sends, do so
			iMax =  (mult>0)?(mult*iScore):sMax;
		 	 
	}//end if (parent.APIOK()){
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
	if (objectiveID.length == 0) { objectiveID = qType+qPage.quiz; }
	if (objectiveID.length == 0) { msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoSessionText + "\n" + sNoLMSText+' no sSesssion'); }
	
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
	iStatus="completed";//set status on page
	qStatus="completed";//set status in pageArray;
	//lets check to make sure they match:
	var objScore=parent.SCOGetObjectiveData(objectiveID, "score.raw");
	//parent.data.window.location.href=parent.data.window.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
	parent.data.znThisPage=(pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
	window.parent.data.znThisPage=(pageNo);
	} 
	 
function quizFinish() {
	
	var fin=1;
 	qzFrm.style.display='none';

//change the link to wherever you want the user to land: http://mlearning.med.umich.edu/quiz/cbtlib/modules/esn/CRRT/page01.htm?vrsn=2. Make sure the file specified is in that version's page array.  
msgDiv.innerHTML='<table width="500" border="0"><tr valign="top"><td width="300" style="border-bottom:1px solid #CCCCCC;">Thank you! You have completed the Pre-Test <br \/> <\/td><td width="143" style="border-bottom:1px solid #CCCCCC;"> <\/td><\/tr><tr><td width="300"><a href="http://mlearning.med.umich.edu/quiz/cbtlib/modules/esn/CRRT/page01.htm?vrsn=2">Click here to continue on with the module. This page will refresh, and the rest of the content will appear.</a><\/td><td><\/td><\/tr><tr><td><\/td><td>&nbsp;<\/td><\/tr><\/table>';
msgDiv.style.display='block';	
	 
	MarkObjectiveDone(objectiveID);
	
	
	qPage = parent.data.PageArray[parent.data.znThisPage-1]; 
    qPage.qScore = iScore;
	

}
	//http://www.scorm.com/resources/cookbook/CookingUpASCORM_v1_2.pdf 10.3
   

function test(){  alert('running test function');}
 

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

		sHref += '&id=' + sName + '&url=' + escape(urlEnd)+'&home=' + escape(urlEnd);
		sHref += '&fn=' + sDetails + '&obj='+ qPage.quiz+'&dom='+document.domain;
	 
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

