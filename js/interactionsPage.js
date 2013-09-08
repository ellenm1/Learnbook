//v.1.7 12.05.12 emeiselm
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = parent.testing; 
var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementById("content").innerHTML+=("<div id='output'><p>&nbsp;</p></div>") ;
 
//this is included in each page that contains interactions
if ((parent.data.IntArray)&&(parent.APIOK())){
	var suspendData = parent.SCOGetValue("cmi.suspend_data")?parent.SCOGetValue("cmi.suspend_data"):"";  
	var iMax=0; //maximum points possible for this objective, calculated and stored on this page.
	var iScore="";//total of all points so far for this objective, calculated and stored on this page
	var znP = parent.data.znThisPage;
	var qPage=parent.data.PageArray[znP-1];//this is "quiz page[znP-1] in the page array
	var qQuiz=qPage.quiz; //this page's quiz in the page array
	var qType="I";
	
	qPage.type=qType;
		
	var objectiveID= (qType+qPage.quiz);//this objective's id in the LMS
	var itemList = parent.data.itemList; 
	var recommendedMsg = parent.data.recommendedMsg;
    var requiredMsg    = parent.data.requiredMsg;
    var completedMsg   = parent.data.completedMsg;
	var qMax = parent.data.PageArray[znP-1].qMax;
	var qStatus = parent.data.PageArray[znP-1].qStatus;
	var totalObj = parent.SCOGetValue("cmi.objectives._count");
	var objMax   = parent.SCOGetObjectiveData(objectiveID, "score.max");
	var objScore = parent.SCOGetObjectiveData(objectiveID, "score.raw");
	var objStatus= parent.SCOGetObjectiveData(objectiveID, "status");
	var iStatus = ((objStatus)&&(objStatus!=" "))?objStatus:"not attempted";//incomplete,not attempted,completed
	var LMSobjectivesCount = parent.SCOGetValue("cmi.objectives._count");
		
	//show loading message
	var tmp = document.createElement('div');
	var loadingMsgStr = "Loading data, please wait!<br><img src=\'images/ajax-loader-3.gif\'/>"
	tmp.id = 'loadingMsg';
	tmp.className = 'loadingMsg';
	document.getElementById('NavBar').appendChild(tmp);
	document.getElementById('loadingMsg').innerHTML=(loadingMsgStr);		 
		
	turnOnMsg();       
    if(testing){ console.log("LMS Data from MarkObjectiveDone: objMax= "+objMax+" objScore="+objScore+" objStatus="+objStatus); }
		
	//if no objective in LMS for this page yet, create one and set its status to n/a
	if(isNaN( parent.SCOGetObjectiveIndex(objectiveID) ) ) {
		parent.SCOSetObjectiveData(objectiveID, "status", "not attempted");
			if (testing){console.log("setting status=for "+objectiveID);}
	}
				 
	if (window.testing){console.log("LMSobjectivesCount="+LMSobjectivesCount + "objStatus= " + objStatus);}
	qMax = qMax?qMax:0;// redundant, delete	
	if (testing){
		console.log("interactionsPage.js output for: objectiveID= " +objectiveID+ " <br>znThisPage= " +znP);
		console.log("iMax=" + iMax + " <br>iScore=" + iScore +"prior to iScoreCalc"); 
	}
	setUpInteractions();
	document.body.onbeforeunload+=saveInteractions; //save the data when document is closed
    document.body.onunload+=saveInteractions;		
}//end if ((parent.data.InteractionsArray)&& (parent.APIOK())

else{  outputWindow.innerHTML=("<h1 style=\'color:red;\'>MLearning not available. Interactions will not score! but you can still browse the module</h1>")}//just continue, maybe put error alert in here?
 

function setUpInteractions(){
	if (testing){ console.log("In setUpInteractions");}
	iScore=0;//reset total of all points for this objective to 0 - going to recalculate them now.
	iMax=0;
	var itemList = window.itemList; 
	if(itemList){
		//move through interaction array
		for (var k in itemList){ 
			//items are objects with properties like score, required points, tries, etc.
		    var itm=itemList[k];
			if (testing){ console.log("k= " +k+ ":"+itm.id+", itm.quiz= " +itm.quiz+ "qQuiz= "+qQuiz+" , itm.ascore= "+itm.ascore+", itm.status= "+itm.status+", itm.msg= "+itm.msg+", itm.tries=  "+itm.tries+", objectiveID= " +objectiveID+ "<br>"); }
			//does itm.quiz match this page's associated objective(quiz) number in the page array?
			if(itm.quiz == qQuiz){
				if (testing){ console.log("Interaction quiz number matches this page\'s quiz number")}	        
				setFeedbackMsg(itm.msg, itm.id);
				iMax+=itm.amax; //add required points for this item to max score for this objective - we are calculating the total max points possible for this objective.	 
				if (testing){  console.log(k+"<br>itm.quiz= " +itm.quiz+"<br> itm.msg= " +itm.msg+  "itm.ascore= "+itm.ascore); }			                  	 			                  	 

 				//double checking if itm score is same or less than itm max pts (mistake), then add [corrected] score to total raw score for this page
				if (itm.ascore>=itm.amax) { iScore+=parseInt(itm.amax,10);  }	
				else { iScore+=parseInt(itm.ascore,10); }
 				if(testing){console.log("after adding "+itm.id+":itm.ascore"+itm.ascore+", iScore= " +iScore);}
			}//end if (itm.quiz ==  qQuiz	 
	     }//end for (var k in itemList
					 
		iScoreCalc();
		saveInteractions();
		qMax = iMax;//record max score in pageArray 
		qScore = iScore; //record total raw score in pageArray
		qStatus = iStatus;
		if(iScore>0){parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());} //at least one interaction completed
		if ((iScore==0)&&(iMax>0)){	parent.SCOSetObjectiveData(objectiveID, "status", "not attempted");}//not tried yet
		parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
		if (iScore>=iMax){  MarkObjectiveDone(itm.quiz);    }//if total raw score equals or exceeds max score, mark this objective done. 			
	}//end if(itemList)
	qStatus= objStatus;
	if (testing){  console.log('qStatus= '+qStatus+ 'thePageArray= '+thePageArray);}
	turnOffMsg();//done loading data, so hide loading message  
}//end function setUpInteractions
 
function setFeedbackMsg(zmsg, itmID){ 
    if(testing){console.log('zmsg='+zmsg+' itmID='+itmID);}
	var itm = parent.data.itemList[itmID];
	itm.msg = zmsg;
 	document.getElementById('msg_'+itmID).innerHTML = (zmsg);	
 }//end setFeedbackMsg(

function recordItem(itemID, dscore){
	loadingMsgStr = "Sending data to MLearning, may take time before status is updated!<br><img src=\'images\/ajax-loader-3.gif\'/>"
    turnOnMsg();
        
	var itm = parent.data.itemList[itemID];
	if (testing){ console.log('In recordItem, itm.tries= '+itm.tries)}
	itm.tries =parseFloat(itm.tries); 
	if (testing){ console.log('In recordItem, parseInt(itm.tries,10)= '+itm.tries+'<br>')}
	itm.tries=(itm.tries+1);//update tries for this item in the interaction array
	if (testing){ console.log('In recordItem, just set itm.tries to '+itm.tries+'<br>')}
	itm.ascore=parseFloat(dscore);
	if (testing){ console.log('in record item just set itm.ascore to '+itm.ascore+'<br>')}
	//if this is required but not attempted: page is incomplete   
	if ((itm.amax > 0)&&(itm.tries==0)) { 
		setFeedbackMsg(requiredMsg, itm.id);
		if(testing){console.log('p1') }   
	}
	//if recommended but not attempted  
    else if ((itm.amax==0)&&(itm.tries==0)){ 
    	setFeedbackMsg(recommendedMsg, itm.id);
    	if(testing){console.log('p2') }  
    }            
    //if required and attempted
	else if ((itm.amax > 0) && (itm.tries > 0 )) { 
		 
		setFeedbackMsg(completedMsg, itm.id);
		if(testing){console.log('p3') } 
		}	
	//if recommended and attempted        
    else if ((itm.amax ==0) && (itm.tries > 0 )){ setFeedbackMsg(completedMsg, itm.id);  }
	//insert additional score tracking here if needed
	else { alert('itm.tries error in function recordItem<br>Please note this data and send to MLearning team.<br>+itmID= '+itmID+' itm.amx= '+itm.amax+' itm.tries= '+itm.tries); }	 
	
	//this will mark the objective done if iScore >=iMax	 	
	iScoreCalc();	
	if (testing){ console.log('<br>in record item, just ran iScoreCalc: iScore is'+iScore + 'iMax is'+iMax+'<br>')}
	
	saveInteractions();	//this saves the current string of interaction data for all pages
	if (testing){  
	    console.log('<br>ABC in recordItem: iScore = '      +iScore   +'<br>');
		console.log('<br>in recordItem: itm.tries = '  +itm.tries+'<br>');
	}
    qPage.qScore = iScore; //record in pageArray
	turnOffMsg();
 }//end function recordItem 

 function iScoreCalc(){
	var tempStatus=1; //used to store whether all required items have been completed yet
	iScore = 0;//iscore is total points for this quiz
	//move through interaction array to find ones for this page
    for (var m in itemList){ 
		var itmm = itemList[m];
        if (testing){ console.log('<br>in iScoreCalc itm.id:'+itmm.id +' objectiveID= '+objectiveID + ', objectiveID.slice(1)= '+objectiveID.slice(1)+' typeof itmm.ascore'+ typeof itmm.ascore+' itmm.tries= '+itmm.tries);}		  
		if (itmm.quiz == objectiveID.slice(1)){   
			iScore+=(itmm.ascore*1);//increment iScore by number of points earned from this item
	        if (testing){ console.log('<br>after adding itm['+m+'].ascore: (itmm.ascore*1)'+itmm.ascore*1+'itmm.tries= '+itmm.tries+', iScore now ='+iScore);}
	        if ((itmm.amax > 0)&&(itmm.tries==0)){
			tempStatus = 0; 
			if(testing){console.log('PGT I just set tempStatus to 0: itmm.amx= '+itmm.amax+' itmm.tries= '+itmm.tries+' tempStatus='+tempStatus)  }}
		}//end if (itmm.quiz ==qPage.quiz)
		
	}//end for (var m=0;
		if (testing){console.log("<br> iMax=" + iMax + " <br>iScore=" + iScore +"after iScoreCalc<hr><br>"); }		                         
		parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
		parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
		
		//all req. items attempted, and score >= page maximum
		if((tempStatus==1)&&(iScore >= iMax)){ 
			MarkObjectiveDone();
			if (testing){console.log("<br> ran MarkObjectiveDone after iScoreCalc<hr><br>"); }
		}
		else{ parent.SCOSetObjectiveData(objectiveID, "status", "incomplete");
			iStatus="incomplete";//set status on page
			qStatus="incomplete";//set status in pageArray
			if (testing){console.log("<br> XPG set objectiveID status to incomplete"+objectiveID+" iStatus"+iStatus+"qStatus="+qStatus); }
		}//end else
		return iScore;
 }//end iScoreCalc


function turnOnMsg(){   document.getElementById("loadingMsg").style.display="block";  } 
function turnOffMsg(){  document.getElementById("loadingMsg").style.display="none";}


function saveInteractions(){
	parent.data.saveInteractions();
	if (testing){ console.log('I just saved interactions from interactionsPage.js'); }
}
 
//if total score on this page = total max score for this page, then mark objective completed<br />
//send quiz score data to the LMS
function MarkObjectiveDone(){
	if (testing){console.log("<br>in MarkObjectiveDone: about to setobjective"+objectiveID+"completed</br>");}
	parent.SCOSetObjectiveData(objectiveID, "status", "completed");//set status in LMS
	parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
	parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
	window.parent.SCOCommit();
	iStatus="completed";//set status on page
	qStatus="completed";//set status in pageArray;
	//lets check to make sure they match:
	if (testing){ console.log("<hr><b style=\"color:blue\">LMS Data from MarkObjectiveDone:</b><br/>objectiveID="+objectiveID+" objMax= "+objMax+"<br>objScore="+objScore+"<br>objStatus="+objStatus+"<br>"); }
	//var ptwin = parent.data.window;
	//ptwin.location.href=ptwin.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
	znP=(window.pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
	window.znP=(pageNo);
} //end MarkObjectiveDone()
	
//used only for testing	
function clearObjectiveData(){  
	parent.SCOSetObjectiveData(objectiveID, "score.raw", "0");
	parent.SCOSetObjectiveData(objectiveID, "score.max", "0");
	parent.SCOSetObjectiveData(objectiveID, "status", "incomplete");
}