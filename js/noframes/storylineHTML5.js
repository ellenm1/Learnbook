  
	
		
 var testing=true;
 var jq = jQuery.noConflict();
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
/*note that storyline's user.js should have a script similar to this:
	var player = GetPlayer();
	var gScorePoints = player.GetVar('scorePoints');
	var gScorePercent = player.GetVar('scorePercent');
	var gPassPercent = player.GetVar('passPercent');
	var gPassPoints = player.GetVar('passPoints');
	var gMaxPoints = (gScorePercent>0)?Math.round((gScorePoints/gScorePercent)*100):0;
 
	var params = {
		maxPoints:gMaxPoints,
		passPoints:gPassPoints,
		scorePoints:gScorePoints,
		scorePercent:gScorePercent,
		passPercent:gPassPercent 
	}
	getMyData(params);

*/
/*data types for getMyData():
	maxPoints: integer;
	passPoints: integer;
	scorePoints: integer;
	scorePercent: integer;
	passpercent: integer;
	bailout: boolean
	setLandingPage: pos or neg integer, -1, 0, 1, 2, etc.
*/
//these are the url params that are provided in the storylineHTML5wrap.htm query string by the quizStart function:
 	//  document.location = qurl+'?p='+qurl+'&itm='+qindex+'&obj='+quiz+'&h='+thispath;
 	
//function getMyData(maxPoints,passPoints,scorePoints,scorePercent, passPercent,bailout,setLandingPage){
function getMyData(params){
//function getMyData(maxPoints,passPoints,scorePoints,scorePercent, passPercent,bailout,setLandingPage){
	var maxPoints = (typeof params.maxPoints!="undefined")? params.maxPoints:null;
	var passPoints = (typeof params.passPoints!="undefined")? params.passPoints:null;
	var scorePoints = (typeof params.scorePoints!="undefined")? params.scorePoints:null;
	var scorePercent = (typeof params.scorePercent!="undefined")? params.scorePercent:null;
	var passPercent = (typeof params.passPercent!="undefined")? params.passPercent:null;
	var passPercent = (typeof params.passPercent!="undefined")? params.passPercent:null;
	var bailout = (typeof params.bailout!="undefined")? params.bailout:false;
	var setLandingPage = (typeof params.landingIndex!="undefined")? params.landingIndex:null;
	if(testing){console.log('qsParm["itm"]'+ qsParm['itm']);}
	var cItem =  qsParm['itm']? qsParm['itm'] : -1;
 	var lsPath = qsParm['h']; //localstoragePath
 	
    
    if((setLandingPage)&&(setLandingPage!="undefined")){  
    	cItem = setLandingPage; //typically used in bailout button but may be used - for any reason -  to set specific landing pages after the storyline
   		//cItem is actually the desired itm index minus 1. So to go back to the first item in the pageArray, which is "itm=0" use -1 for setLandingPage
    }
    else{
    	cItem =  qsParm['itm']? qsParm['itm'] : null;
    	}
   
    var cObjective = qsParm['obj']? qsParm['obj'] : null;
    var cMax =  parseFloat(maxPoints);
    var cScore = parseFloat(scorePoints);
    var aPercentScore = cMax!=0?cScore/cMax:1;//if max points are zero, then user got 100 no matter what.
	var cPercentScore = aPercentScore*100;           
	var objectiveID = "S"+ cObjective;						 

	 if(testing){
    	console.log('cMax='+cMax+', cScore'+cScore+'objectiveID= '+objectiveID+', cPercentScore= '+ cPercentScore );
    	}				
	
	jq(document).ready(	
	    function($){
	     if(bailout){
     		exitWithoutRecording(cItem);
    	}
    	else { //continue to mark objective done and go to next page
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
			//debugger;
			document.location = '../../index.htm?itm='+znextPage+'&ls=1';   //redirect back to module	
			} 
	});
}
var deviceReady = false;
var initCalled = false ;

 //this is the bailout function
 
function exitWithoutRecording(landingPageIndex ){
			var znextPage = parseFloat(cItem)+1; 
			ns.localStorage.set('znThisPage', znextPage);
			document.location = '../../index.htm?itm='+znextPage+'&ls=1';   //redirect back to module	
}

function MarkObjectiveDone(cScore,cMax,objectiveID,countscore){//send storyline quiz score data to the LMS
	if(testing){console.log('XPJT in MarkObjectiveDone: objectiveID+= '+objectiveID+', cScore'+cScore+', cMax='+cMax)}
	
	if(cScore!="undefined"){
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
	}//end if(cScore!="undefined")
	 	
	}  //end MarkObjectiveDone
  

