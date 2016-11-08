 
	if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
	var testing = true;
 
var sSession; //this is just the quiz number without a letter prefix. 
//objectiveID has the letter prefix.
var objectiveID=""; 
var _NoError = 0;
var _GeneralException = 101; 
var _InvalidArgumentError = 201;
var _NotInitialized = 301;
var _NotImplementedError = 401;
var isQuizWrap = true;
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

$(document).ready(function() {
	//initTracking(); 	  
	//printNavBar();

	//$("#itm"+znThisPage).css("background-color","orange");	 	
	$("#sidebar-left li a").click(function() {   
	//	document.location.href = "index.htm?itm="+this.id;
	});
	
	$(".prevbtn").click(function(){
		//document.location.href = "index.htm?itm="+(parseFloat(pItem)-1);
	});
	$(".nextbtn").click(function(){
		//document.location.href = "index.htm?itm="+(parseFloat(pItem)+1);
	});
	
 	//quiz finish
	//if(testing){console.log("CDP  +pScore="+pScore)} 
	 
	if(pScore && pScore.length>0){
		  		
		  		if(testing){console.log("CPP  +pScore="+pScore+", pMax="+pMax)} 
		  		quizFinish();
		  		pScore =null;
		  		$('#finishedDiv').show();
		  		
	}//end if(typeof pScore
	
	else{
		//var thisquiz = ps[pItem].url;
		//$('#takeAgain').append('<a href="'+thisquiz+'">Let me try this quizlet again! (click here)</a>');
			znThisPage = pItem;
			setTimeout('openMessageBlock()',25);
    		$("#finishedDiv").html('<div class="alert alert-block">One moment please... </div>');
			 setTimeout('displayRedirTxt(znThisPage)',1000);
	}
	
});

 
//*****************navigation functions*************//
//these are also different for this quiz wrapper page than those on index page 
function nextPage(pageIndex){
	var newPage = (parseFloat(pageIndex) +1);
	if(newPage==ps.length){ alert('You are on the last page!');return;  }
	//note - we are going to hide the unneeded button in the top nav, but in case someone uses these functions elsewhere, the message is still needed.
	if(testing){console.log('GFF np='+newPage+', pageIndex='+newPage)}
	ns.localStorage.set('znThisPage', newPage);
 // document.location.href = "index.htm?itm="+pageIndex+"&ls=1";//ls=1 signals index.htm NOT to wipe local storage.
 	var ts = Math.round(new Date().getTime() / 1000);
  	document.location.href = "index.htm?ls=1&ts="+ts;//ls=1 signals index.htm NOT to wipe local storage.
}//end nextPage()


function prevPage(pageIndex){
	var newPage = (parseFloat(pageIndex) -1);
	if(newPage<0){ alert('You are on the first page!');return;  }
	//note - we are going to hide the unneeded button in the top nav, but in case someone uses these functions elsewhere, the message is still needed.
	console.log('GFF np='+newPage+', pageIndex='+newPage);
	ns.localStorage.set('znThisPage', newPage);
	 document.location.href = "index.htm?itm="+newPage;
}		
//*****************Quizzing functions specific to perception quizzes. Functions that pertain to all quizzes are in quizFunctions.js *************//		

function MarkObjectiveDone(objectiveID, countscore, passingscore){//send quiz score data to the LMS
	if(testing){console.log('XPJT in MarkObjectiveDone: objectiveID+= '+objectiveID+', pscore'+pScore+', pMax='+pMax +' apiok='+APIOK())}
	var ct = SCOGetValue("cmi.objectives._count");
	var checkstatus = SCOGetObjectiveData(objectiveID, "status");
	if(testing){console.log('GGGT in MarkObjectiveDone: checkstatus = '+ checkstatus+ 'cmi.objectives._count='+ct);}
	if(countscore==3){
		var gbPercentScore = pMax!=0?Math.round((pScore/pMax)*100):0;
		var gbStatus = (gbPercentScore >= passingscore ? "passed":"failed");
		SCOSetObjectiveData(objectiveID, "status", gbStatus);
	}
	else {
		SCOSetObjectiveData(objectiveID, "status", "completed");
	}
	SCOSetObjectiveData(objectiveID, "score.raw", pScore.toString());
	SCOSetObjectiveData(objectiveID, "score.max", pMax.toString());
	SCOCommit();	 	
	}  //end MarkObjectiveDone
  

//*********	
function quizFinish() {
	if(testing){('In quizFinish')}
	znThisPage = pItem;
	var fin=1; 	 
  	setTimeout('openMessageBlock()',25);
    $("#finishedDiv").html('<div class="alert alert-block">One moment please... sending information to MLearning for safekeeping</div>');
	//console.trace();
    sSession = ps[znThisPage].quiz;          
	objectiveID=('Q'+sSession);
	//objectiveID=(ps[znThisPage].type+sSession);
	if(testing){console.log('FFR sSession='+sSession)}
	ps[znThisPage].qScore = pScore;
	ps[znThisPage].qMax = pMax;
	var qCountscore = ps[znThisPage].countscore;
	if(qCountscore==3){ //if this is a quiz that must be passed to be completed, we need to have a passing score
		var qPassingscore = (typeof ps[znThisPage].passingScore!="undefined")?ps[znThisPage].passingScore:80;
		//if there is a passing score in the page array use it otherwise set it to 80.
		}

	MarkObjectiveDone(objectiveID, qCountscore, qPassingscore);



	ns.localStorage.set('pageArray', ps); //store "ps" data into local storage.

 
	var gNextPage = znNextPage;
	 	
   setTimeout('displayRedirTxt(znThisPage)',1000);
     
}//end function quizFinish()
	//http://www.scorm.com/resources/cookbook/CookingUpASCORM_v1_2.pdf 10.3
//*********	
function displayRedirTxt(mznThisPage){   
	$("#finishedDiv").html('<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button><strong>Thank you!<\/strong> You will now be redirected to the next page of this module.<\/div>');
	nextPage(mznThisPage);//redirects us back to index.htm
	}	//end displayRedirTxt  
 
//*********	 	
function takeItAnyway(){  
$("#messageDiv").hide();
	qzFrm.style.display='block';// get required parameters
	
	if (sHref.length == 0) { sHref = getParameter('href'); }
	if (sHref.length == 0) {msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoHrefText + "\n" + sNoLMSText+' no sHref'); } //the return stops it here.
	if (sSession.length == 0) { sSession = getParameter('session'); }
	if (sSession.length == 0) { msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoSessionText + "\n" + sNoLMSText+' no sSession'); }
	if (sCall.length == 0) { sCall = getParameter('call'); }
	if (sCall.length == 0) { msgDiv.style.display='block'; qzFrm.style.display='none';msgDiv.innerHTML=(sNoCallText + "\n" + sNoLMSText + 'no sCall'); }	
	
	Go();
}//end takeItAnyway
 


//http://rusticisoftware.github.io/TinCanJS/doc/api/latest/


/* 
	var keys=[];
	for(key in thispagesdata ){
		keys.push(key);
		var val = thispagesdata[key]
		console.log(key+':'+key.value);
	}//end for(key
	
	if(testing){console.log(keys);}
	
	for (var key in thispagesdata ){
		var val = thispagesdata[key];
		//if(testing){console.log(key+' '+val);}	
	}//for (var key
*/	