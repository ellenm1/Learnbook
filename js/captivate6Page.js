//v.1.9 12-07-12 emeiselm

var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementByID("content").innerHTML+=("<div id='output'><p>generated div</p></div>") ;
 //http://www.sitepoint.com/forums/showthread.php?t=575320
var testing = true; //turn to true to show debugging information for this script

if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 

var so = new SWFObject(iSwf, "Captivate", iWidth, iHeight, "10", "#CCCCCC");
	so.addParam("quality", "high");
	so.addParam("name", "Captivate");
	so.addParam("id", "Captivate");
	//so.addParam("wmode", "window");
	so.addParam("wmode","transparent");
	so.addParam("bgcolor","#FFF");
	so.addParam("menu", "false");
	so.addParam("scale", "showall");
	//so.addParam("play","false");
	so.addParam("allowscriptaccess","always")
	so.setAttribute("redirectUrl", "http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash");

var cp 
var g_bIsInternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
var alreadyRun;
var myVar = 0;
var bScore;
var bMax;
var aPercentScore;
var bPercentScore;
var objectiveID ;
var qPage = parent.data.PageArray[parent.data.znThisPage-1];
var qType="C";//C for captivate.  
qPage.type=qType; //just making sure this is explicitly set in pageArray.

var objectiveID= (qType+qPage.quiz);//this objective's id in the LMS
var msgDiv= document.getElementById('messageDiv');
var finDiv= document.getElementById('finishedDiv');
var lmsObjStatus=parent.SCOGetObjectiveData(objectiveID, "status");
var lmsObjScore=parent.SCOGetObjectiveData(objectiveID, "score.raw");
if (testing){  console.log("bScore= "+bScore+", bMax= "+bMax+", bPercentScore= "+bPercentScore); }

	
if (typeof qPage.quiz!='undefined'){
	if (parent.APIOK()){	                 
	    if (testing){  
					console.log(parent.data.znThisPage-1+"parent.data.znThisPage-1 "+", objective status=" +lmsObjStatus+", lms score= "+lmsObjScore + 'typeof qPage.qScore= '+ typeof qPage.qScore + ', qPage.qScore= '+ qPage.qScore); 
					outputWindow.innerHTML+=(qPage.title+" qPage.index "+qPage.index+", objective status=" +lmsObjStatus+", lms score= "+lmsObjScore + 'typeof qPage.qScore= '+ typeof qPage.qScore + ', qPage.qScore= '+ qPage.qScore);  
	    }//end if testing
	}//end if (parent.APIOK())
           
    else{ 
        outputWindow.innerHTML=("<h1 style=\'color:red;\'>MLearning not available. Interactions will not score! but you can still browse the module</h1>")
    }

}//end if (typeof qPage.quiz!='undefined')

else{ 
     // it just continues on to checkIfTaken (at end of page)
}


//when captivate page is loaded, check for existing score. If there IS one, ask if you really want score wiped out  - if not, do not show quiz.
function checkIfTaken(){
	if(testing){ console.log('XPC')}
	if (testing){  console.log(parent.data.PageArray[parent.data.znThisPage-1] )}
    if (typeof qPage.quiz!='undefined'){
		var scoreexists=false;
		if (testing){   console.log('in checkiftaken:  qPage= '+ qPage+',  lmsObjStatus='+lmsObjStatus +'lmsObjScore= '+ lmsObjScore+' qPage.qScore= '+qPage.qScore);}
		if (isNaN(qPage.qScore) ){ 
			if (testing){   console.log("<br/>qPage.qScore =='NaN'");}
		 }//end if (isNaN(qPage.qScore
		
		if  (!isNaN(qPage.qScore)&&(qPage.qScore!=0)){
			scoreexists=true;
			if (testing){    console.log("<br/>qPage.qScore !='NaN'");}
		 }//end if  (!isNaN(qPage.qScore)&&(qPage.qScore!=0))
											  											  
		if (scoreexists==true){								  
			document.getElementById("rightColumn").style.height=(iHeight>400?parseInt(iHeight,10)+50+"px":"100%");
			if (testing){    console.log('score Exists: iHeight='+iHeight+', document.getElementById("rightColumn").style.height= '+document.getElementById("rightColumn").style.height);}
			document.getElementById("CaptivateContent").innerHTML=("<div id='container1' style='height:100%'><h2  style='padding-top:12px;color:#FFFF8C;'>"+qPage.buttonTitle+"</h2><p style='color:#FFF;width:75%;line-height:130%;'>You already have a score of "+ qPage.qScore+" for this quiz. Are you sure you want to start it again? Your score will be reset to 0 if you click \"Yes\".</p> <a href='#' onclick='so.write(\"CaptivateContent\")' class='yesBtn'>Yes, start the quiz.</a>&nbsp;<a href='scorePage.htm' class='noBtn'>No, take me to the score and status page</a></div>");
		 }//end  if (scoreexists==true)
														  
	   else{  
	        var so = new SWFObject(iSwf, "Captivate", iWidth, iHeight, "10", "#CCCCCC");
			so.addParam("quality", "high");
			so.addParam("name", "Captivate");
			so.addParam("id", "Captivate");
			so.addParam("wmode","transparent");
			so.addParam("bgcolor","#FFF");
			so.addParam("menu", "false");
			so.addParam("scale", "showall");
			so.addParam("allowscriptaccess","always")
			so.setAttribute("redirectUrl", "http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash");		  
	        so.write("CaptivateContent");   
	   }//end else
	}//if (typeof qPage.quiz!='undefined')
	
	else{  			
			var so = new SWFObject(iSwf, "Captivate", iWidth, iHeight, "10", "#CCCCCC");
			so.addParam("quality", "high");
			so.addParam("name", "Captivate");
			so.addParam("id", "Captivate");
			so.addParam("wmode","transparent");
			so.addParam("bgcolor","#FFF");
			so.addParam("menu", "false");
			so.addParam("scale", "showall");
			so.addParam("allowscriptaccess","always")
			so.setAttribute("redirectUrl", "http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash");
            so.write("CaptivateContent");   
     }//end else
}//end function checkIfTaken()



      
 
   /* 
cpQuizInfoAnswerChoice: "true"
cpQuizInfoAttempts: 1
cpQuizInfoLastSlidePointScored: 10
cpQuizInfoMaxAttemptsOnCurrentQuestion: 1
cpQuizInfoNegativePointsOnCurrentQuestionSlide: 0
cpQuizInfoNoQuestionsPerQuiz: 1
cpQuizInfoPassFail: true
cpQuizInfoPointsPerQuestionSlide: 10
cpQuizInfoPointsscored: 10
cpQuizInfoPretestPointsscored: 0
cpQuizInfoPretestScorePercentage: 0
cpQuizInfoQuestionPartialScoreOn: false
cpQuizInfoQuestionSlideTiming: 0
cpQuizInfoQuestionSlideType: "TrueFalse"
cpQuizInfoQuizPassPercent: 80
cpQuizInfoQuizPassPoints: 8
cpQuizInfoTotalCorrectAnswers: 1
cpQuizInfoTotalProjectPoints: 10
cpQuizInfoTotalQuestionsPerProject: 1
cpQuizInfoTotalQuizPoints: 10
cpQuizInfoTotalUnansweredQuestions: 0
cpQuizScopeSlide: 2
	
			*/
				  
 
function getMyData(){
	cp = document.Captivate;
    bMax = cp.cpEIGetValue('m_VarHandle.cpQuizInfoTotalQuizPoints');
    bScore = cp.cpEIGetValue('m_VarHandle.cpQuizInfoPointsscored');
    aPercentScore = bMax!=0?bScore/bMax:1;//if max points are zero, then user got 100 no matter what.
	bPercentScore = aPercentScore*100;         
    if(testing){console.log('bMax='+bMax+', bScore'+bScore+', bPercentScore= '+ bPercentScore );}
              
    $.each(cp.cpEIGetValue('m_VarHandle'), function(name, value){
    	if(testing){console.log(name + ": " + value);} //logs value of every single property of the current captivate object (long!)
     });
 	
	 
	if (parent.APIOK()){	
		qPage = parent.data.PageArray[parent.data.znThisPage-1];
		      //set qscore to whatever is listed either in LMS or array as the score.	
		var qScore = (parent.SCOGetObjectiveData(objectiveID, "score.raw"))?(parent.SCOGetObjectiveData(objectiveID, "score.raw")):parseFloat(qPage.qScore); 				
		sMax = qPage.qMax;		 
		var fin=1;
		document.getElementById("CaptivateContent").style.display='none';
		document.getElementById("rightColumn").style.backgroundColor="#FFF";
		msgDiv.innerHTML='<table width="500" border="0"><tr valign="top"><td width="300" style="border-bottom:1px solid #CCCCCC;">This quizlet has been completed with a score of <b>'+bScore+'<\/b> <h1 style="display:inline">('+parseInt(bPercentScore,10)+'%)<\/h1><br \/><br \/><a href="javascript:NextPage();" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'nextPage\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/nextGreenBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/nextGreenBtn.jpg" alt="Next Page" name="nextPage" width="99" height="69" border="0" id="nextBlueBtn" \/><\/a><\/td><td width="143" style="border-bottom:1px solid #CCCCCC;"><\/td><\/tr><tr><td width="300" style="padding-top:18px"><a href="'+qPage.url+'" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'eraseScoreBtn\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/eraseScoreBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/eraseScoreBtn.jpg" alt="Erase this score and try again!" name="eraseScoreBtn" width="278" height="34" border="0" id="eraseScoreBtn" \/><\/a></td><td width="144">&nbsp;</td></tr><tr><td>This module can not be marked "Complete" until all quizlets have been attempted. Quizlets may be taken multiple times without penalty.<\/td><td><\/td><\/tr><tr><td><a href="scorePage.htm" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\'showStatus\',\'\',\'images\/quiz\/specialIcons\/scorePage\/over\/haveIcompletedBtn.jpg\',1)"><img src="images\/quiz\/specialIcons\/scorePage\/up\/haveIcompletedBtn.jpg" alt="Have I completed all the required quizlets?" name="showStatus" width="279" height="33" border="0" id="showStatus" \/><\/a><\/td><td><\/td><\/tr><\/table>';
		msgDiv.style.display='block';		
			 if (testing){console.log("about to MarkobjectiveDone")}
		MarkObjectiveDone();//these quizzes are considered done once you take them, no matter the score.
			 if (testing){console.log("finished MarkobjectiveDone")}
		var qPage = qPage;
		qPage.qScore = bScore;
		qPage.qMax = bMax;    	 
	 }//end if (parent.APIOK())
}

//send quiz score data to the LMS
function MarkObjectiveDone(){
 	if (testing){console.log("In MarkObjectiveDone and objectiveID= "+objectiveID)}
  	if (testing){console.log("begin MarkObjectiveDone: ,  qPage.index "+qPage.index+", bScore= "+bScore+", bMax= "+bMax+", bPercentScore= "+bPercentScore+", objectiveID= "+ objectiveID +" lms says objective status is" +lmsObjStatus+", lms score is"+lmsObjScore );}
	parent.SCOSetObjectiveData(objectiveID, "status", "completed");
	parent.SCOSetObjectiveData(objectiveID, "score.raw", bScore);
	parent.SCOSetObjectiveData(objectiveID, "score.max", bMax);
	window.parent.SCOCommit();
		//lets check to make sure they match:
	var objScore=parent.SCOGetObjectiveData(objectiveID, "score.raw");
	parent.data.window.location.href=parent.data.window.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
	parent.data.znThisPage=(pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
	window.parent.data.znThisPage=(pageNo);
	if (testing){console.log("end MarkObjectiveDone: qPage "+qPage+", bScore= "+bScore+", bMax= "+bMax+", bPercentScore= "+bPercentScore+", objectiveID= "+ objectiveID +" lms says objective status is" +lmsObjStatus+", lms score is"+objScore);}	  
} //end MarkObjectiveDone
	 	 
  