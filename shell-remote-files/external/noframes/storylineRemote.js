  
	
		
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
//for remote storyline this is an example of the URL and query string available to get paths and parameters from.
//p is needed to get the redirector
//h is the path to storylineQuizWrap
//itm is needed for cItem
//obj is needed for cObjective
//https://mlearningcontent2.med.umich.edu/content/ct/test/emeiselm/shell-remote-files/storyline/minimalEmbeddedButton2/story.html?p=https://mlearningcontent.med.umich.edu/content/ct/test/ellen/shell-lms-side/includes/storRedirector.htm&itm=1&obj=448039260562&h=https://mlearningcontent.med.umich.edu/content/ct/test/ellen/shell-lms-side/storylineQuizWrap.htm&id=emeiselm&fn=Meiselman,Ellen 

function getMyData(params){
	var maxPoints = (typeof params.maxPoints!="undefined")? params.maxPoints:null;
	var passPoints = (typeof params.passPoints!="undefined")? params.passPoints:null;
	var scorePoints = (typeof params.scorePoints!="undefined")? params.scorePoints:null;
	var scorePercent = (typeof params.scorePercent!="undefined")? params.scorePercent:null;
	var passPercent = (typeof params.passPercent!="undefined")? params.passPercent:null;
	//var passPercent = (typeof params.passPercent!="undefined")? params.passPercent:null;
	var bailout = (typeof params.bailout!="undefined")? params.bailout:false;
	var setLandingPage = (typeof params.landingIndex!="undefined")? params.landingIndex:null;
	if(testing){console.log('qsParm["itm"]'+ qsParm['itm']);}

	var cItem             =  qsParm['itm']? qsParm['itm'] : -1;
 	var quizWrapPath   = qsParm['h']; //localstoragePath for non-remotes and 
	var redirectorPath = qsParm['p'];	
 	var cObjective        = qsParm['obj']? qsParm['obj'] : null;
    var cMax              = parseFloat(maxPoints);
    var cScore            = parseFloat(scorePoints);
    var aPercentScore     = cMax!=0?cScore/cMax:1;//if max points are zero, then user got 100 no matter what.
	var cPercentScore     = aPercentScore*100;           
	var objectiveID   = "SR"+ cObjective;		
//var decodedModulePath = decodeURIComponent(lsPath);	
    
    if((setLandingPage)&&(setLandingPage!="undefined")){  
    	cItem = setLandingPage; //typically used in bailout button but may be used - for any reason -  to set specific landing pages after the storyline
   		                        //cItem is actually the desired itm index minus 1. So to go back to the first item in the pageArray, which is "itm=0" use -1 for setLandingPage
    }
    else{ cItem =  qsParm['itm']? qsParm['itm'] : null; }
  	
	if(testing){console.log('cMax='+cMax+', cScore'+cScore+'objectiveID= '+objectiveID+', cPercentScore= '+ cPercentScore );	
	            console.log('redirectorPath= '+redirectorPath+', quizWrapPath= '+quizWrapPath);
	        }	//end if (testing)	
	   document.location = redirectorPath+'?p='+quizWrapPath+'&itm='+cItem+'&ls=1+&Score='+cScore+'&Max='+cMax;   //redirect back to module	 
			} 
//var deviceReady = false;
//var initCalled = false ;

 //this is the bailout function
 
function exitWithoutRecording(landingPageIndex,ns, pathToIndex ){
	        var decodedModulePath = decodeURIComponent(lsPath);
			var redirectorPath =     '//' + window.location.hostname +'/'+ decodedModulePath+'/includes/storylineRedirector.htm';
	        var quizWrapPath   =     '//' + window.location.hostname +'/'+ decodedModulePath+'/storylineQuizWrap.htm';
			var znextPage = parseFloat(landingPageIndex)+1; 
			ns.localStorage.set('znThisPage', znextPage);
			//document.location = '//' + window.location.hostname +'/'+ pathToIndex+'/index.htm?itm='+znextPage+'&ls=1';   //redirect back to module	
			var redirectorPath =     '//' + window.location.hostname +'/'+ decodedModulePath+'/includes/storylineRedirector.htm';
	        var quizWrapPath   =     '//' + window.location.hostname +'/'+ decodedModulePath+'/storylineQuizWrap.htm';
		   document.location = redirectorPath+'?p='+quizWrapPath+'itm='+cItem+'&ls=1';
}
  

