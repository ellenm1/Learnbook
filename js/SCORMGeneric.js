/*v 1.10 2-8-2007 emeiselm*/

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
var	g_bSCOBrowse = false;
var g_dtmInitialized = new Date(); // will be adjusted after initialize

//the completeIfLastPage function is used to check if every page was looked at
//before marking it complete.
//some clients request this, but it should not be used in every module.
function completeIfLastPage() {
	//alert('self.data.PageArray.length' +self.data.znThisPage + ' ' +self.data.PageArray.length);
	 if (!APIOK()){ return false;  } 
	  else if (g_bFinishDone == false) {
                 if (self.data.znThisPage == self.data.PageArray.length){     
                 SCOFinish(); 
				 //alert('lastpage')
				 } else  { 
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
		 window.status="It appears you did not launch this from MLearning. No score will not be recorded";
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
	if (!g_bInitDone) {
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
	g_dtmInitialized = new Date();
	return (err + "") // Force type to string
}

  function SCOSaveData(){// this function will be called when this SCO is unloaded
  if(APIOK()){
  SCOCommit();
  if(frames.data.quizCount==0){ SCOSetStatusCompleted() }
  else if (frames.data.quizCount>0){ SCOSetValue("cmi.core.exit", "" ); }//needed to finalize quiz score?
 }
}


function SCOFinish() {
	if ((APIOK()) && (g_bFinishDone == false)) {
		if (typeof(SCOSaveData) != "undefined"){
			SCOReportSessionTime();
			// The SCOSaveData function can be defined in another script of the SCO
			 SCOSaveData();
		}
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
function SCOSetStatusIncomplete(){
SCOSetValue("cmi.core.lesson_status","incomplete");
		SCOCommit(); 
}
// Since only the designer of a SCO knows what completed means, another
// script of the SCO may call this function to set completed status. 
// The function checks that the SCO is not in browse mode, and 
// avoids clobbering a "passed" or "failed" status since they imply "completed".
function SCOSetStatusCompleted(){
	var stat = SCOGetValue("cmi.core.lesson_status");
	  if (SCOGetValue('cmi.core.lesson_mode') != "browse"){
		  if ((stat!="completed") && (stat != "passed") && (stat != "failed")){
			return SCOSetValue("cmi.core.lesson_status","completed");
               // alert('module completed (SCOSetStatusCompleted)')
		}
	} else { }
		
}

function SCOBookmark(){ //rewrote this function to be in the frameset
    qArrayItem = frames.data.PageArray[frames.data.znThisPage-1];
	//alert(qArrayItem.quiz+' | '+qArrayItem.index);
   if (!APIOK()){//new 8-12-07 (moved SCOBookmark to index, not page itself)
	  // alert('api not ok')
		return false;
	           }
			   //this is not the first page or the last, and is NOT a quiz.
	 if ( (frames.data.znThisPage > 1)  &&  (frames.data.znThisPage < frames.data.PageArray.length) && (! qArrayItem.quiz)){
		 //bookmark this location in mlearning
		              SCOSetValue('cmi.core.lesson_location', frames.myStage.thispage); 
		            // alert('bookmarked');
		              SCOCommit();	
                         }
						 //if this is the last page
   else if (frames.data.znThisPage == frames.data.PageArray.length){  
   //set the status to completed or passed.
                       SCOSetStatusCompleted();
                     // alert('You have completed this module.');
                          }
   else if (qArrayItem.quiz){ 
  // alert('I am not bookmarking'); 
   } //  do not bookmark.
						 
     }


