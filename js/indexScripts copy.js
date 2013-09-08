	SCOInitialize();SCOSetStatusIncomplete();
	if(typeof SCOUnload =="undefined") SCOUnload ={SCOUnload: function(){}};
	var iMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);
	var lmsStatus = SCOGetValue("cmi.core.lesson_status");
	//there should only ever be one objective labeled "version".
	//this is where we are storing the version number in the LMS, when there is one.
	var lmsVrsn =  (typeof SCOGetObjectiveData("version", "score.raw")!= "undefined"  &&  !isNaN( SCOGetObjectiveData("version", "score.raw") )  ) ?parseInt(SCOGetObjectiveData( "version", "score.raw"),10):null;
	if(testing){console.log('EEK lmsVrsn = '+lmsVrsn+' typeof lmsVrsn ='+ typeof lmsVrsn);}
	if(testing){console.log('iMasteryScore= '+iMasteryScore);  } 		
	setFrameSrc();
	SCOSetStatus();
	