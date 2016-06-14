/*v 1.13 2-22-2013 emeiselm*/

//based on:
// SCORM 1.2 SCO Logic management script sample
// Copyright 2001,2002,2003 Click2learn, Inc.
// by Claude Ostyn 2003-02-22 
//
// This script implements various aspects of
// common logic behavior of a SCO.
// The SCO can be a HTML document or a frameset.
//
// Change these preset values to suit your taste and requirements.
//Comment these lines out for debugging:
 
var g_bShowApiErrors = true;
var g_strAPINotFound = "Management system interface not found.";
var g_strAPITooDeep = "Cannot find API - too deeply nested.";
var g_strAPIInitFailed = "Found API but LMSInitialize failed.";
var g_strAPISetError = "Trying to set value but API not available.";
var g_nSCO_ScoreMin = 0; 			// must be a number
var g_nSCO_ScoreMax = 100; 		// must be a number > nSCO_Score_Min
var g_SCO_MasteryScore = 99.9; // value by default; may be set to null
var g_bMasteryScoreInitialized = false;

/////////// API INTERFACE INITIALIZATION AND CATCHER FUNCTIONS ////////
var g_nFindAPITries = 0;
var g_objAPI = null;
var g_bInitDone = false;
var g_bFinishDone = false;
var g_bIsSuspended = false;
var	g_bSCOBrowse = false;
var g_dtmInitialized = new Date(); // will be adjusted after initialize
var g_gbGoingToNextSco = false;//used to prevent "suspend or complete?" alert for unscored scos that I added to SCOUnload function used in index.htm - emeiselm

//the completeIfLastPage function is used to check if every page was looked at
//before marking it complete.
//some clients request this, but it should not be used in every module.
function completeIfLastPage(){
	if (!APIOK()){ return false;  } 
	else if (g_bFinishDone == false) {
    	if (znThisPage == ls.length){     
        	SCOFinish(); 
			 
		}else{ 
			//alert('notlastpage')
		}
	}
    else if ((SCOGetValue('cmi.core.lesson_mode') == 'Completed') || (SCOGetValue('cmi.core.lesson_mode') == 'Passed') )  {
		SCOFinish(); 
		}
}
        
function AlertUserOfAPIError(strText) {		 
	if ( (g_bShowApiErrors)) { //if these scripts have been loaded (prevents js errors if an old index page is being used)
		SetCookie('referenceMode',false,1);
		if (ReadCookie('referenceMode')==false){
			alert('You will not receive credit because you arrived here without enrolling. If you want credit, return to MLearning and enroll in this course. "');
			SetCookie('referenceMode',true,1);
		}
		window.status="It appears you did not launch this from MLearning. No score will be recorded";
	}//if showApiErrors
}//function

//search for the scorm adapter
function FindAPI(win) {
	while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
		g_nFindAPITries ++;
		if (g_nFindAPITries > 500) {
			AlertUserOfAPIError(g_strAPITooDeep);
			return null;
		} 
		win = win.parent;
	}
	return win.API;
}

//tells you if you are under SCORM control or not.
function APIOK() { return ((typeof(g_objAPI)!= "undefined") && (g_objAPI != null)) }


function SCOInitialize() { //initializes communication and sets sco status to "incomplete" if status is "not attempted."
	var err = true;
	//if ( (!g_bInitDone)&&(ReadCookie('g_bInitDone')!="true") ) {
	if  (!g_bInitDone) {
		console.log('QWE in SCOInitialize and g_bInitDone is false');
		if ((window.parent) && (window.parent != window)){
			g_objAPI = FindAPI(window.parent)
		}
		if ((g_objAPI == null) && (window.opener != null))	{
			g_objAPI = FindAPI(window.opener)
		}
		if (!APIOK()) {
			AlertUserOfAPIError(g_strAPINotFound);
			err = false
		} else {
			err =  g_objAPI.LMSInitialize("");
			if (err == "true") {
				g_bSCOBrowse = (g_objAPI.LMSGetValue("cmi.core.lesson_mode") == "browse");						
				if (!g_bSCOBrowse) {
					if (g_objAPI.LMSGetValue("cmi.core.lesson_status") == "not attempted") {
						err =  g_objAPI.LMSSetValue("cmi.core.lesson_status","incomplete")
					}
				}
			} else {
				AlertUserOfAPIError(g_strAPIInitFailed)
			}
		}
	}
	if (typeof(SCOInitData) != "undefined") {
		// The SCOInitData function can be defined in another script of the SCO
		SCOInitData()
	}
	g_bInitDone = true;
	g_dtmInitialized = new Date();
	return (err + "") // Force type to string
}

// this function will be called when this SCO is unloaded
function SCOSaveData(){
  	if(APIOK()){
  	SCOCommit();
  	if((quizCount==0)&&(!g_bIsSuspended)){ 
 	//   if(testing){ console.log('GAB i am about to set status to completed')  }
  	SCOSetStatusCompleted() }
  	else if (quizCount>0){ SCOSetValue("cmi.core.exit", "" ); }//needed to finalize quiz score?
 	}
}

function SCOSuspend(){// this function will be called when this SCO is unloaded
	if (APIOK() && (g_bFinishDone == false) ){
		SCOCommit();
		SCOSetValue("cmi.core.exit", "suspend" );
		g_bIsSuspended = true;
		SCOFinish();
	}
}

function SCOFinish(){
	if ((APIOK()) && (g_bFinishDone == false)){
		if (typeof(SCOSaveData) != "undefined"){
			SCOReportSessionTime();
			// The SCOSaveData function can be defined in another script of the SCO
			SCOSaveData();
		}//end if(typeof
		SetCookie(g_bInitDone,"",-1);
		g_bFinishDone = (g_objAPI.LMSFinish("") == "true");
	}
	return (g_bFinishDone + "" ) // Force type to string
}

 
// Call these catcher functions rather than trying to call the API adapter directly
function SCOGetValue(nam)			{return ((APIOK())?g_objAPI.LMSGetValue(nam.toString()):"")}
function SCOCommit(parm)			{return ((APIOK())?g_objAPI.LMSCommit(""):"false")}
function SCOGetLastError(parm){return ((APIOK())?g_objAPI.LMSGetLastError(""):"-1")}
function SCOGetErrorString(n)	{return ((APIOK())?g_objAPI.LMSGetErrorString(n):"No API")}
function SCOGetDiagnostic(p)	{return ((APIOK())?g_objAPI.LMSGetDiagnostic(p):"No API")}

//LMSSetValue is implemented with more complex data
//management logic below

var g_bMinScoreAcquired = false;
var g_bMaxScoreAcquired = false;

// Special logic begins here
function SCOSetValue(nam,val){
	var err = "";
	if (!APIOK()){
			AlertUserOfAPIError(g_strAPISetError + "\n" + nam + "\n" + val);
			err = "false"
	} else if (nam == "cmi.core.score.raw") err = privReportRawScore(val)
	if (err == ""){
			err =  g_objAPI.LMSSetValue(nam,val.toString() + "");
			if (err != "true") return err
	}
	if (nam == "cmi.core.score.min"){
		g_bMinScoreAcquired = true;
		g_nSCO_ScoreMin = val
	}
	else if (nam == "cmi.core.score.max"){
		g_bMaxScoreAcquired = true;
		g_nSCO_ScoreMax = val
	}
	return err
}
function privReportRawScore(nRaw) { // called only by SCOSetValue
	if (isNaN(nRaw)) return "false";
	if (!g_bMinScoreAcquired){
		if (g_objAPI.LMSSetValue("cmi.core.score.min",g_nSCO_ScoreMin+"")!= "true") return "false"
	}
	if (!g_bMaxScoreAcquired){
		if (g_objAPI.LMSSetValue("cmi.core.score.max",g_nSCO_ScoreMax+"")!= "true") return "false"
	}
	if (g_objAPI.LMSSetValue("cmi.core.score.raw", nRaw)!= "true")	return "false";
	g_bMinScoreAcquired = false;
	g_bMaxScoreAcquired = false;
	if (!g_bMasteryScoreInitialized){
		var nMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);
		if (!isNaN(nMasteryScore)) g_SCO_MasteryScore = nMasteryScore
  }
	if (isNaN(g_SCO_MasteryScore)) return "false";
	var stat = (nRaw >= g_SCO_MasteryScore? "passed" : "failed");
	if (SCOSetValue("cmi.core.lesson_status",stat) != "true") return "false";
	return "true"
}

function MillisecondsToCMIDuration(n) {
//Convert duration from milliseconds to 0000:00:00.00 format
	var hms = "";
	var dtm = new Date();	dtm.setTime(n);
	var h = "000" + Math.floor(n / 3600000);
	var m = "0" + dtm.getMinutes();
	var s = "0" + dtm.getSeconds();
	var cs = "0" + Math.round(dtm.getMilliseconds() / 10);
	hms = h.substr(h.length-4)+":"+m.substr(m.length-2)+":";
	hms += s.substr(s.length-2)+"."+cs.substr(cs.length-2);
	return hms
}

// SCOReportSessionTime is called automatically by this script,
// but you may call it at any time also from the SCO
function SCOReportSessionTime() {
	var dtm = new Date();
	var n = dtm.getTime() - g_dtmInitialized.getTime();
	return SCOSetValue("cmi.core.session_time",MillisecondsToCMIDuration(n))
}

function SCOSetStatusIncomplete(){ //added a ratchet UP rule to this
	if((SCOGetValue("cmi.core.lesson_status")!="completed")||(SCOGetValue("cmi.core.lesson_status")!="passed")){
   		SCOSetValue("cmi.core.lesson_status","incomplete");
		SCOCommit(); 
	}
	
}
// Since only the designer of a SCO knows what completed means, another
// script of the SCO may call this function to set completed status. 
// The function checks that the SCO is not in browse mode, and 
// avoids clobbering a "passed" or "failed" status since they imply "completed".
function SCOSetStatusCompleted(){
	var stat = SCOGetValue("cmi.core.lesson_status");
	if ((SCOGetValue('cmi.core.lesson_mode') != "browse")&&(!g_bIsSuspended)){
		if ((stat!="completed") && (stat != "passed") && (stat != "failed")){
			return SCOSetValue("cmi.core.lesson_status","completed");
		}
	} 
	else { }		
}

//should be used only at launch to set status and score
function SCOSetStatus(){
	if(APIOK()){ //if under scorm control  
		//is this a scored module?
		if(  (typeof iMasteryScore!="undefined")&&(!isNaN(iMasteryScore) )&&(iMasteryScore>0) ){                                                   
    		isScoredModule = true; 
    		if(testing){ console.log('B33 isScoreModule = '+isScoredModule);}
    		if(  (typeof lmsScore!="undefined")&&(!isNaN(lmsScore) )&&(lmsScore>0) ){   
    			moduleScore = lmsScore;
    			console.log('lmsScore='+lmsScore);
    		}
    		else{moduleScore=0;}
    		// this is probably a scored module, but sometimes a mastery score is set on a module with no quizzes. double check this after running setup quizzes.   
    	}              
    	//check if they already have a completed or passed status in lms
    	
    	if( (lmsStatus=="completed")&&(typeof qsParm['ls']=="undefined") ){
   			var conf = confirm("You have already completed this module. Are you sure you want to continue? Your score may change.\n Click NO or CANCEL to close window and save your existing status");
    		if(conf == true){
				SCOSetValue("cmi.core.lesson_status","incomplete"); //this won't work I don't think, with current rustici settings.
   			}//end if(conf == true)
   			else{  //they want to close module
   				if(testing){console.log('PPR lmsStatus='+lmsStatus+' and user asked to close the window')  }
					SCOSetValue("cmi.core.lesson_status","completed");
					SCOSetValue("cmi.core.exit","");
					//SCOSaveData();
					//if(window.data.cookieVrsn){parent.SetCookie('cVrsn',"",-1);}
					SCOReportSessionTime();
					g_bFinishDone = (g_objAPI.LMSFinish("") == "true");		
   			}	//end else
   		}//end if(lmsStatus=="completed")		
   			
    	if(lmsStatus=="passed"){ 
    			//ask user do they want to continue or close module.				
    			var conf = confirm("You have already completed this module with a score of "+lmsScore+ "% in MLearning. Are you sure you want to continue? You will lose your completed status and score. \n Click NO or CANCEL to close window and save your existing status and score.");
    			if(conf == true){
						//use the score from the LMS.
						SCOSetValue("cmi.core.lesson_status","incomplete");
						moduleScore = lmsScore;
   					}//end if(conf == true)
   				else{  //they want to close module
   					if(testing){console.log('PPX lmsStatus='+lmsStatus+' and user asked to close the window')  }
					closingActions();
   				}	//end else
   		}//end if(lmsStatus=="passed")
   		
   		else{ //there was no previous completion in the lms
   			//if scored module, make sure it doesn't mark itself complete unexpectedly
    			if( isScoredModule){ // this is a scored module
           			if(lmsStatus != "passed"){
			  			SCOSetValue("cmi.core.score.raw", moduleScore); 
			   			SCOSetValue("cmi.core.lesson_status", "incomplete");
			   			SCOCommit;                         
					}//end if(lmsStatus != "passed")  
				else { //not a scored module, so its ok if they close module and it simply completes.
					SCOSetValue("cmi.core.lesson_status", "incomplete");
			   		SCOCommit;                         
				}                                                
        	}//end if( isScoredModule)  		   		
   		}//end else  		   	
    }//end if(APIOK())
}//end function SCOSetStatus    


function SCOUnload(){// this function will be called when this SCO is unloaded						
	if ( APIOK() && (!g_bFinishDone)&&(!g_bIsSuspended) ){
		if(isScoredModule){
			if(testing){ console.log('ACE g_bFinishDone= '+g_bFinishDone+', g_bIsSuspended= '+g_bIsSuspended);    }
			SCOCommit();
			SCOSetValue("cmi.core.lesson_status", "incomplete");
			//SCOSetValue("cmi.core.success_status", "Unknown");//this is a mistake: it only belongs in scorm2004
			SCOSetValue("cmi.core.exit", "suspend" );
			g_bIsSuspended = true;
			SCOFinish();
		}//end if(isScoredModule
		else if((!g_bFinishDone)&&(!g_bIsSuspended)&&(!g_gbGoingToNextSco)){   //unscored only
		if(testing){ console.log('ABE g_bFinishDone= '+g_bFinishDone+', g_bIsSuspended= '+g_bIsSuspended+', g_gbGoingToNextSco='+g_gbGoingToNextSco);    }
		var r=confirm("If you want to mark this module complete, please click \"OK\" Otherwise, click \"Cancel\" and I will save your progress for later");
        if (r==true) {SCOSetValue("cmi.core.lesson_status", "completed"); SCOSetValue("cmi.core.exit", "" ); SCOFinish();  }
        else {  SCOSetValue("cmi.core.lesson_status", "incomplete");SCOSetValue("cmi.core.exit", "suspend" ); g_bIsSuspended = true; SCOFinish(); }
		}
	}//end if(APIOK
}//end function SCOUnload
                                                                                                            
function SCOBookmark(){  
    pArrayItem = ps[znThisPage];
    var isQuiz = (typeof pArrayItem.quiz!="undefined")?true:false;
   	if (!APIOK()){ return false; }
	//this is not the first page or the last, and is NOT a quiz.
	if ( (znThisPage > 1)  &&  (znThisPage < ps.length) && (!isQuiz)){
		//bookmark this location in mlearning
		SCOSetValue('cmi.core.lesson_location', znThisPage); 
		SCOCommit();	
    }
	//if this is the last page
   else if (znThisPage == ps.length){  
		//
                          }
   else if (isQuiz){ 
  		// alert('I am not bookmarking'); 
   } //  do not bookmark.
						 
     }


