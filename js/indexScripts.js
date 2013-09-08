	//v.1.1 02.22.13 emeiselm
	SCOInitialize();
	//SCOSetStatusIncomplete(); don't do this right off the bat. it is erasing completions sometimes.
	if(typeof SCOUnload =="undefined") SCOUnload ={SCOUnload: function(){}};
	var iMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);
	var lmsStatus = SCOGetValue("cmi.core.lesson_status");
	var lmsScore =  SCOGetValue("cmi.core.score.raw");
	//there should only ever be one objective labeled "version".
	//this is where we are storing the version number in the LMS, when there is one.
	var lmsVrsn =  (typeof SCOGetObjectiveData("version", "score.raw")!= "undefined"  &&  !isNaN( SCOGetObjectiveData("version", "score.raw") )  ) ?parseInt(SCOGetObjectiveData( "version", "score.raw"),10):null;
	if(testing){console.log('EEK lmsVrsn = '+lmsVrsn+' typeof lmsVrsn ='+ typeof lmsVrsn);}
	if(testing){console.log('iMasteryScore= '+iMasteryScore+', lmsStatus= '+lmsStatus);  } 		
	setFrameSrc();
	SCOSetStatus();
	