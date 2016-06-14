 //comes before onepage.js. This should not be required on any of the quizWrappers
 
	//if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
	//var testing = true;
	var trackingmode = "scorm"; //possible values so far: scorm, xapi
	var justOpened = true;	
	var quizSetupDone = false;
	var vrsnDone = false;
	var iMasteryScore,lmsScore,lmsStatus,lmsVrsn,zVrsn, cookieVrsn,zCookieVrsn,isScoredModule,moduleScore;	
	var quizCount=0;//how many quizzes total?
	var quiz, qScore, qMax, qType, btnImg, countscore;  
	var unfinQz='';
	var gNoScoreQuizMsg = ((typeof recommendedMsg=='undefined')?'recommended':recommendedMsg);
	var gRequiredMsg = ((typeof requiredMsg=='undefined')?'required':requiredMsg);
	var interactionsQuizzes;
 	var sName,sDetails;	

function initTracking(){ //this is called on onepage.js. never called by perceptionQuizWrap.
	 if(trackingmode == "scorm"){
	 	//if(   !ReadCookie('g_bInitDone') || ReadCookie('g_bInitDone') !='true'  ){
	 		if(testing){console.log( 'ReadCookie(\'g_bInitDone\')='+ReadCookie('g_bInitDone') )}
			
			try {
   				//throw "myException"; // generates an exception
   				SCOInitialize();
				}
			catch (e) {
   			// statements to handle any exceptions
   				if(testing){console.log('exception was'+e);} // pass exception object to error handler
			}

			SetCookie('g_bInitDone','true',1);
			if(APIOK()){
				if(testing){console.log('SFR In initTracking: APIOK')}
				if(typeof SCOUnload =="undefined") SCOUnload ={SCOUnload: function(){}};//can be defined elsewhere;
				iMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);				 
				lmsStatus = SCOGetValue("cmi.core.lesson_status");
				lmsScore =  SCOGetValue("cmi.core.score.raw");
				sName  =((SCOGetValue("cmi.core.student_id"))+'');
				sDetails = ((SCOGetValue("cmi.core.student_name"))+'');	
				if(testing){console.log('sName='+sName +'sDetails='+sDetails+', iMasteryScore = '+iMasteryScore)}
				//there should only ever be one objective labeled "version".
				//this is where we are storing the version number in the LMS, when there is one.
				lmsVrsn =  (typeof SCOGetObjectiveData("version", "score.raw")!= "undefined"  &&  !isNaN( SCOGetObjectiveData("version", "score.raw") )  ) ?parseInt(SCOGetObjectiveData( "version", "score.raw"),10):null;
				if(testing){console.log('EEK lmsVrsn = '+lmsVrsn+' typeof lmsVrsn ='+ typeof lmsVrsn +', lmsStatus= '+lmsStatus);}
				
				SCOSetStatus();//this should put a 0 score into LMS if it is scored module
				//bookmarkAlert();
				
			}//if(APIOK())
	//	}//end if(  (!ReadCookie('g_bInitDone')
	}//end if(trackingmode=="scorm")
	
	if(trackingmode == "xapi"){
		//tincan stuff
	}	

}//end initTracking

//http://rusticisoftware.github.io/TinCanJS/doc/api/latest/
//http://www.articulate.com/tincanapi/

