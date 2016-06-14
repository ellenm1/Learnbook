 
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
var g_objAPI = FindAPI(window.parent);
 
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
	if(testing){console.log("CDP  +pScore="+pScore)} 
	 
	if(pScore && pScore.length>0){
		  		
		  		if(testing){console.log("CPP  +pScore="+pScore+", pMax="+pMax)} 
		  		quizFinish();
		  		pScore =null;
		  		$('#finishedDiv').show();
		  		
	}//end if(typeof pScore
	var thisquiz = ps[pItem].url;
	$('#takeAgain').append('<a href="'+thisquiz+'">Let me try this quizlet again! (click here)</a>');
	
	
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
//*****************Quizzing functions specific to Qualtrics quizzes. Functions that pertain to all quizzes are in quizFunctions.js *************//		

function MarkObjectiveDone(objectiveID){//send quiz score data to the LMS
	if(testing){console.log('XPJT in MarkObjectiveDone: objectiveID+= '+objectiveID+', pscore'+pScore+', apiok='+APIOK())} 
	var ct = SCOGetValue("cmi.objectives._count");
	var pMax=ps[znThisPage].qmax; //qualtrics doesn't provide max so we must get it from page array
	var pPercent = parseInt((pScore/pMax)*100,10);
	SCOSetObjectiveData(objectiveID, "status", "completed");
	SCOSetObjectiveData(objectiveID, "score.raw", pScore.toString());
	SCOSetObjectiveData(objectiveID, "score.max", pMax.toString());
	SCOCommit();	 	
	var checkdata = SCOGetObjectiveData(objectiveID, "status");
	if(testing){console.log('GGGT in MarkObjectiveDone: checkdata = '+ checkdata+ 'cmi.objectives._count='+ct);}
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
	objectiveID=('U'+sSession);
	
	if(testing){console.log('FFR sSession='+sSession)}
	MarkObjectiveDone(objectiveID);	
 
	 
	ps[znThisPage].qScore = pScore;
	ps[znThisPage].qMax = pMax;
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