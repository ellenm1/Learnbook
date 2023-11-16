var testing=true;
var g_objAPI = null;
gFindAPI();
 
function gFindAPI(){ //just the part of SCOInitialize that finds the api in any window tree available.
	if ((window.parent) && (window.parent != window)){
			g_objAPI = FindAPI(window.parent)
		}
		if ((g_objAPI == null) && (window.opener != null))	{
			g_objAPI = FindAPI(window.opener)
		}
		 
	} 

function getMyData(){
 	//debugger; 
 	var lsPath = qsParm['h']; //localstoragePath
    var cItem =  qsParm['itm']? qsParm['itm'] : null;
    var cObjective = qsParm['obj']? qsParm['obj'] : null;
    var cMax = window.cpAPIInterface.getVariableValue('cpQuizInfoTotalQuizPoints');
    var cScore = window.cpAPIInterface.getVariableValue('cpQuizInfoPointsscored');
    var aPercentScore = cMax!=0?cScore/cMax:1;//if max points are zero, then user got 100 no matter what.
	var cPercentScore = aPercentScore*100;         
   
   
	var objectiveID = "H2"+ cObjective;						 
	 
	 if(testing){
    	console.log('cMax='+cMax+', cScore'+cScore+'objectiveID= '+objectiveID+', cPercentScore= '+ cPercentScore );
    	}				
		
	var ns = $.initNamespaceStorage(lsPath);
	ps=ns.localStorage.get('pageArray');
	 
	ps[cItem].qScore = cScore;
	ps[cItem].qMax = cMax;
	var qCountscore = ps[cItem].countscore;
	if(qCountscore==3){ //if this is a quiz that must be passed to be completed, we need to have a passing score
		var qPassingscore = (typeof ps[cItem].passingScore!="undefined")?ps[cItem].passingScore:80;
		//if there is a passing score in the page array use it otherwise set it to 80.
		}

	ns.localStorage.set('pageArray', ps); //store "ps" data into local storage.
	
	MarkObjectiveDone(cScore,cMax,objectiveID, qCountscore);//these quizzes are considered done once you take them, no matter the score.
 
	var znextPage = parseFloat(cItem)+1; 
	ns.localStorage.set('znThisPage', znextPage);
	console.log('XPC cItem= '+cItem +', znextPage= '+znextPage);
	console.log('XPD ps[cItem].buttonTitle= '+ps[cItem].buttonTitle);
	document.location = '../../index.htm?itm='+znextPage+'&ls=1';   //redirect back to module	 

}
var deviceReady = false;
var initCalled = false ;


function MarkObjectiveDone(cScore,cMax,objectiveID,countscore){//send quiz score data to the LMS
	if(testing){console.log('XPJT in MarkObjectiveDone: objectiveID+= '+objectiveID+', cScore'+cScore+', cMax='+cMax)}
	var ct = SCOGetValue("cmi.objectives._count");
	var checkdata = SCOGetObjectiveData(objectiveID, "status");
	if(testing){console.log('GGGT in MarkObjectiveDone: checkdata = '+ checkdata+ ', cmi.objectives._count='+ct);}
	if(countscore==3){
		var gbPercentScore = pMax!=0?Math.round((pScore/pMax)*100):0;
		var gbStatus = (gbPercentScore >= passingscore ? "passed":"failed");
		SCOSetObjectiveData(objectiveID, "status", gbStatus);
	}
	else {
		SCOSetObjectiveData(objectiveID, "status", "completed");
	}
	SCOSetObjectiveData(objectiveID, "status", "completed");
	SCOSetObjectiveData(objectiveID, "score.raw", cScore.toString());
	SCOSetObjectiveData(objectiveID, "score.max", cMax.toString());
	SCOCommit();	 	
	}  //end MarkObjectiveDone
  

