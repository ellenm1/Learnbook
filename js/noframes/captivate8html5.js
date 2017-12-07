var cPath = qsParm['p']?qsParm['p'] : null;
	(function()
		{
			if(document.documentMode < 9)
			{
				document.body.innerHTML = "";
				document.write("The content you are trying to view is not supported in the current Document Mode of Internet Explorer. Change the Document Mode to Internet Explorer 9 Standards and try to view the content again.<br>To change the Document Mode, press F12, click Document Mode: <current mode>, and then select Internet Explorer 9 Standards.");
				return;
			}
			window.addEventListener("load",function() 
			{
				setTimeout(function() 
				{					
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = 'assets/js/CPXHRLoader.js';
					script.defer = 'defer';
					script.onload = function()
					{
						var lCSSLoaded = false;
						var lJSLoaded = false;
						function constructDIVs()
						{
							if(lCSSLoaded && lJSLoaded)
							{
								initializeCP();
							}
						}
						cpXHRJSLoader.css( 'assets/css/CPLibraryAll.css',function() {
							lCSSLoaded = true;
							constructDIVs();
						});
						 
						var lJSFiles = [  '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js', '../../js/noframes/jquery.storageapi.js','assets/js/CPM.js', 'assets/playbar/playbarScript.js' ];
						cpXHRJSLoader.js(lJSFiles,function()
						{
							//console.log("js loaded");
							lJSLoaded = true;
							constructDIVs();
						});
					}
					document.getElementsByTagName('head')[0].appendChild(script);
				},1);
			},false);
		})();
		
 

function onBodyLoad()
{
	if(typeof window.device === 'undefined')
	{
		document.addEventListener("deviceready", onDeviceReady, false);
	}
	else
	{
		onDeviceReady();
		
	}
}

function onDeviceReady()
{
	deviceReady = true ;
	if(initCalled === true)
		initializeCP();
}

function initializeCP()
{
	initCalled = true ;
	if(cp.pg && deviceReady === false)
		return;

	function cpInit()
	{
		document.body.innerHTML = " <div class='cpMainContainer' id='cpDocument' style='left: 0px; top:0px;' >	<div id='main_container' style='top:0px;position:absolute;width:100%;height:100%;'>	<div id='projectBorder' style='top:0px;left:0px;width:100%;height:100%;position:absolute;display:block'></div>	<div class='shadow' id='project_container' style='left: 0px; top:0px;width:100%;height:100%;position:absolute;overflow:hidden;' >	<div id='project' class='cp-movie' style='width:100% ;height:100%;overflow:hidden;'>		<div id='project_main' class='cp-timeline cp-main'>			<div id='div_Slide' onclick='cp.handleClick(event)' style='top:0px; width:100% ;height:100% ;position:absolute;-webkit-tap-highlight-color: rgba(0,0,0,0);'></div>		</div>		<div id='autoplayDiv' style='display:block;text-align:center;position:absolute;left:0px;top:0px;'>			<img id='autoplayImage' src='' style='position:absolute;display:block;vertical-align:middle;'/>			<div id='playImage' tabindex='9999' role='button' aria-label='play' onkeydown='cp.CPPlayButtonHandle(event)' onClick='cp.movie.play()' style='position:absolute;display:block;vertical-align:middle;'></div>		</div>	</div>	<div id='toc' style='left:0px;position:absolute;-webkit-tap-highlight-color: rgba(0,0,0,0);'>	</div>	<div id='playbar' style='bottom:0px; position:fixed'>	</div>	<div id='cc' style='left:0px; position:fixed;visibility:hidden;pointer-events:none;' onclick='cp.handleCCClick(event)'>		<div id='ccText' style='left:0px;float:left;position:absolute;width:100%;height:100%;'>		<p style='margin-left:8px;margin-right:8px;margin-top:2px;'>		</p>		</div>		<div id='ccClose' style='background-image:url(./assets/htmlimages/ccClose.png);right:10px; position:absolute;cursor:pointer;width:13px;height:11px;' onclick='cp.showHideCC()'>		</div>	</div>	<div id='gestureIcon' class='gestureIcon'>	</div>	<div id='gestureHint' class='gestureHintDiv'>		<div id='gImage' class='gesturesHint'></div>	</div>	<div id='pwdv' style='display:block;text-align:center;position:absolute;width:100%;height:100%;left:0px;top:0px'></div>	<div id='exdv' style='display:block;text-align:center;position:absolute;width:100%;height:100%;left:0px;top:0px'></div>	</div>	</div></div><div id='blockUserInteraction' class='blocker' style='width:100%;height:100%;'>	<table style='width:100%;height:100%;text-align:center;vertical-align:middle' id='loading' class='loadingBackground'>		<tr style='width:100%;height:100%;text-align:center;vertical-align:middle'>			<td style='width:100%;height:100%;text-align:center;vertical-align:middle'>				<image id='preloaderImage'></image>				<div id='loadingString' class='loadingString'>Loading...</div>			</td>		</tr>	</table></div> <div id='initialLoading'></div>";
		cp.DoCPInit();
		var lCpExit = window["DoCPExit"];
		window["DoCPExit"] = function()
		{
			if(cp.UnloadActivties)
				cp.UnloadActivties();
			lCpExit();
		};
	}
	
	cpInit();
}
 

	
		
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
 	 
 	var lsPath = qsParm['h']; //localstoragePath
    var cItem =  qsParm['itm']? qsParm['itm'] : null;
    var cObjective = qsParm['obj']? qsParm['obj'] : null;
    var cMax = window.cpAPIInterface.getVariableValue('cpQuizInfoTotalQuizPoints');
    var cScore = window.cpAPIInterface.getVariableValue('cpQuizInfoPointsscored');
    var aPercentScore = cMax!=0?cScore/cMax:1;//if max points are zero, then user got 100 no matter what.
	var cPercentScore = aPercentScore*100;         
   
   
	var objectiveID = "H"+ cObjective;						 
	 
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
  

