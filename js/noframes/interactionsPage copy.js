//v.1.7 12.05.12 emeiselm
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
//var testing = false; 
//var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementById("content").innerHTML+=("<div id='output'><p>&nbsp;</p></div>") ;
 

//else{  outputWindow.innerHTML=("<h1 style=\'color:red;\'>MLearning not available. Interactions will not score! but you can still browse the module</h1>")}//just continue, maybe put error alert in here?
 
 
function setUpInteractions(){
//this is included in each page that contains interactions
//it runs as the callback after ChangeLinks once the page loads.

if ( (trackingmode == "scorm")&&APIOK() ){ 
	ints=ns.localStorage.get('interactionsArray');
	if   (typeof ints!="undefined"){//if there is an interactions array...
		if(testing){ console.log("GER in setUpInteractions");   }
		var suspendData = SCOGetValue("cmi.suspend_data")?SCOGetValue("cmi.suspend_data"):"";  
		iMax=0; //maximum points possible for this objective, calculated and stored on this page.
		iScore=0;//total of all points so far for this objective, calculated and stored on this page		 	 
		
		var objectiveID= ("I"+ps[znThisPage].quiz);//this objective's id in the LMS		 
		var recommendedMsg = ms.recommendedMsg?ms.recommendedMsg:'Recommended';
		var requiredMsg    = ms.requiredMsg?ms.requiredMsg:'Must be completed to finish module';
		var completedMsg   = ms.completedMsg?ms.completedMsg:'Completed';
		
		ps[znThisPage].qMax =  ps[znThisPage].qMax ? ps[znThisPage].qMax:0;  //set stored qMax as whatever's in the pageArray otherwise 0.
 
		//var totalObj = SCOGetValue("cmi.objectives._count");
		//var objMax   = SCOGetObjectiveData(objectiveID, "score.max");
		//var objScore = SCOGetObjectiveData(objectiveID, "score.raw");
		var objStatus= SCOGetObjectiveData(objectiveID, "status");
		var iStatus = ((objStatus)&&(objStatus!=" "))?objStatus:"not attempted";//poss. values= incomplete,not attempted,completed
		var LMSobjectivesCount = SCOGetValue("cmi.objectives._count");
		
		//show loading message
		//var tmp = document.createElement('div');
		var loadingMsgStr = '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>Loading...</h3></div>';
			loadingMsgStr +='<div class="modal-body"><p><img src="images/ajax-loader-3.gif"/>&nbsp;Loading data, please wait!<br></p></div>';
		          
		 
		
		
		//tmp.id = 'loadingMsg';
		//tmp.className = 'loadingMsg';
		//document.getElementById('NavBar').appendChild(tmp);
		//document.getElementById('loadingMsg').innerHTML=(loadingMsgStr);		 
		//http://www.w3resource.com/twitter-bootstrap/modals-tutorial.php
		$('#myModal').html(loadingMsgStr);
		$('#myModal').modal({backdrop:false});
		$('#myModal').modal('show');
		        
		//if(testing){ console.log("LMS Data from MarkObjectiveDone: objMax= "+objMax+" objScore="+objScore+" objStatus="+objStatus); }
		
		//if no objective in LMS for this page yet, create one and set its status to n/a
		if(isNaN( SCOGetObjectiveIndex(objectiveID) ) ) {
			SCOSetObjectiveData(objectiveID, "status", "not attempted");
				if (testing){console.log("setting status=for "+objectiveID);}
		}
				 
		if (testing){console.log("LMSobjectivesCount="+LMSobjectivesCount + "objStatus= " + objStatus);}
		if (testing){
			console.log("interactionsPage.js output for: objectiveID= " +objectiveID+ " <br>znThisPage= " +znThisPage+ ' qMax now ='+qMax);
			console.log("iMax=" + iMax + " <br>iScore=" + iScore +"prior to iScoreCalc"); 
		}//end if (testing)

 		//iscore is the score stored on this page, recalculated each time return to page
		iScore=0;//reset total of all points for this objective to 0 - going to recalculate them now.
		iMax=0;
		
		var ints = ns.localStorage.get('interactionsArray'); 
	 
			//move through interaction array
			for (var k in ints){ 
				//items are objects with properties like score, required points, tries, etc.
				var itm=ints[k];
				if (testing){ console.log("k= " +k+ ":"+itm.id+", itm.quiz= " +itm.quiz+  " , itm.ascore= "+itm.ascore+", itm.status= "+itm.status+", itm.msg= "+itm.msg+", itm.tries=  "+itm.tries+", objectiveID= " +objectiveID+ "<br>"); }
				//does itm.quiz match this page's associated objective(quiz) number in the page array?
				if(itm.quiz == ps[znThisPage].quiz){
					if (testing){ console.log("Interaction quiz number matches this page\'s quiz number")}	        
					setFeedbackMsg(itm.msg, itm.id);//display the red message under the interaction
					iMax+=itm.amax; //add required points for this item to max score for this objective - we are calculating the total max points possible for this objective.	 
					if (testing){  console.log(k+"<br>itm.quiz= " +itm.quiz+"<br> itm.msg= " +itm.msg+  "itm.ascore= "+itm.ascore); }			                  	 			                  	 

					//double checking if itm score is same or less than itm max pts (mistake), then add [corrected] score to total raw score for this page
					if (itm.ascore>=itm.amax) { iScore+=parseInt(itm.amax,10);  }	
					else { iScore+=parseInt(itm.ascore,10); }
					if(testing){console.log("after adding "+itm.id+":itm.ascore"+itm.ascore+", iScore= " +iScore);}
				}//end if (itm.quiz ==  qQuiz	 
			 }//end for (var k in ints
			$('#myModal').modal('hide');	//is this too early?	 
			iScoreCalc(objectiveID);//objectiveID = ("I"+qPage.quiz)
			saveInteractions();
			ps[znThisPage].qMax = iMax;//record max score in pageArray 
			ps[znThisPage].qScore = iScore; //record total raw score in pageArray
			ps[znThisPage].qStatus = iStatus;//record quiz status in pagearray
			
			SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
			if ((iScore == 0)&&(iMax>0)){	SCOSetObjectiveData(objectiveID, "status", "not attempted");}//not tried yet
			else if(iScore > 0){//if there is a score, choose from complete and incomplete
				SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());												
				if (iScore >= iMax){  
					MarkObjectiveDone(objectiveID, iMax, iScore); 
					if(testing){ 'EWS iScore was >=iMax, so I marked objectiveID '+objectiveID+' complete'  }    
					}//if total raw score equals or exceeds max score, mark this objective done. 			
				else if(iScore < iMax){ SCOSetObjectiveData(objectiveID, "status", "incomplete");  }
		} //else if(iScore > 0) at least one interaction completed. Not yet ready to say what status is.
		ps[znThisPage].qStatus= objStatus;
		ns.localStorage.set('pageArray',ps);
	 
		 
		//http://stackoverflow.com/questions/10379624/how-to-pass-values-arguments-to-modal-show-function-in-twitter-bootstrat
		//https://groups.google.com/forum/#!topic/twitter-bootstrap-stackoverflow/NXu2-n-FK44
		}//end if(ints)	 
	}//end if ( (trackingmode == "scorm")&&APIOK() ){ 
		
}//end function setUpInteractions
 
function setFeedbackMsg(zmsg, itmID){ 
    if(testing){console.log('zmsg='+zmsg+' itmID='+itmID);}
	var itm = ints[itmID];
	itm.msg = zmsg;
 	document.getElementById('msg_'+itmID).innerHTML = (zmsg);	
 }//end setFeedbackMsg(

function recordItem(itemID, dscore){	//record score to interactions array in local storage and to SCORM suspend data
	if ((trackingmode == "scorm")&&APIOK()){ 
		loadingMsgStr = "Sending data to MLearning, may take time before status is updated!<br><img src=\'images\/ajax-loader-3.gif\'/>"
		turnOnMsg();
			
		var itm = ints[itemID];
		//var objectiveID = 'I'+ints[itemID].quiz;
		var objectiveID = 'I'+ps[znThisPage].quiz;
		if (testing){ console.log('In recordItem, itm.tries= '+itm.tries)}
		
		
		itm.tries=(parseInt(itm.tries,10)+1);//increment tries for this item in the interaction array
		if (testing){ console.log('QWR In recordItem, just set itm.tries to '+itm.tries+'<br>')}
		
		itm.ascore=parseInt(dscore,10);//save new score to interactions array in local storage
		itm.amax = parseInt(itm.amax,10);//just making sure this is an integer
		if (testing){ console.log('QWT in record item just set itm.ascore to '+itm.ascore+'<br>')}
		//if this is required but not attempted: page is incomplete   
		
		if ((itm.amax > 0)&&(itm.tries==0)) { 
			setFeedbackMsg(requiredMsg, itm.id);
			//if(testing){console.log('p1') } 
			iStatus = "incomplete";
		}
		//if recommended but not attempted  
		else if ((itm.amax==0)&&(itm.tries==0)){ 
			setFeedbackMsg(recommendedMsg, itm.id);
			//if(testing){console.log('p2') }  
		}            
		//if required and attempted
		else if ((itm.amax > 0) && (itm.tries > 0 )) { 
			 
			setFeedbackMsg(completedMsg, itm.id);
			//if(testing){console.log('p3') } 
			}	
		//if recommended and attempted        
		else if ((itm.amax ==0) && (itm.tries > 0 )){ setFeedbackMsg(completedMsg, itm.id);  }
		//insert additional score tracking here if needed
		else { alert('itm.tries error in function recordItem<br>Please note this data and send to MLearning team.<br>+itmID= '+itmID+' itm.amx= '+itm.amax+' itm.tries= '+itm.tries); }	 
		
		ns.localStorage.set('interactionsArray', ints); 
				
		//this will mark the objective done if iScore >=iMax	 	
		iScoreCalc(objectiveID);	
		saveInteractions();	//this saves the current string of interaction data for all pages
			 
		if (testing){  
			console.log('<br>in record item, just ran iScoreCalc: iScore= '+iScore + 'iMax= '+iMax+'+iStatus= '+iStatus+', itm.tries='+itm.tries+'<br>')
		}
		
		
		$('#myModal').modal('hide');
	}	//end if ((trackingmode == "scorm")&&APIOK()){ 
	
	else{}	//do nothing
 }	//end function recordItem 

 function iScoreCalc(objectiveID){ //calcs score and max and completion for this quiz page as a whole
	var tempStatus=1; //1=completed, 0=incomplete. used to store whether all required items have been completed yet
	iScore = 0;//iscore is total points for this quiz
	iMax = 0;
	
	//move through interaction array to find interactions that belong to this page's quiz
    for (var m in ints){ 
		var itmm = ints[m];
        if (testing){ console.log('<br>in iScoreCalc itmm.id:'+itmm.id)+'objectiveID= '+objectiveID + ', objectiveID.slice(1)= '+objectiveID.slice(1)+' typeof itmm.ascore'+ typeof itmm.ascore;}		  
			if (itmm.quiz == objectiveID.slice(1)){   //itm belongs to this quiz
				iScore+=(itmm.ascore*1);//increment this quiz' score by the amount earned for this interaction
				iMax+= (itmm.amax*1);//increment this quiz' max score by the max amount possible for this interaction
				if (testing){ console.log('TTT after adding itmm['+m+'].ascore: (itm.ascore*1)'+(itmm.ascore*1)+' iScore now ='+iScore);}
	
			 //if itmm's max score is more than 0 and tries = 0, it means you didn't finish a required interaction, so the quiz is incomplete.
			if ((itmm.amax > 0)&&(itmm.tries==0)){
				tempStatus = 0; 
				//iStatus = "incomplete" 
				if(testing){console.log('PGT I just set tempStatus to 0: itmm.amx= '+itmm.amax+' itmm.tries= '+itmm.tries+' tempStatus='+tempStatus)  }
			}//if ((itmm.amax > 0)
		}//end if (itmm.quiz == objectiveID.slice(1))	
	}//end for (var m=0;
		
		if (testing){console.log("<br> iMax=" + iMax + " <br>iScore=" + iScore +"after iScoreCalc<hr><br>"); }		                         		 
		SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
		SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
		
		//all req. items attempted, and score >= page maximum
		if((tempStatus==1)&&(iScore >= iMax)){ 
			iStatus = "completed";
			MarkObjectiveDone(objectiveID,iMax,iScore);
			if (testing){console.log("<br> ran MarkObjectiveDone after iScoreCalc<hr><br>"); }
		}//if((tempStatus==1)
		else{ 
			SCOSetObjectiveData(objectiveID, "status", "incomplete");
			iStatus="incomplete";//set status on page
			if (testing){console.log("<br> XPG set objectiveID status to incomplete"+objectiveID+" iStatus"+iStatus); }
		}//end else
		 
 	
		ps[znThisPage].qScore=iScore;//set score in pageArray;
		ps[znThisPage].qMax=iMax;//set score in pageArray;
		ps[znThisPage].qStatus=iStatus;//set status in pageArray
		ns.localStorage.set('pageArray',ps); //store it all back to local storage.
		SCOCommit();		
		return iScore, iStatus;
 }//end iScoreCalc


function turnOnMsg(){   $('#myModal').modal('show'); } 
function turnOffMsg(){ $('#myModal').modal('hide');}

 
 
//if total score on this page = total max score for this page, then mark objective completed<br />
//send quiz score data to the LMS
function MarkObjectiveDone(objectiveID,iMax,iScore){
	 turnOnMsg();
	if (testing){console.log("<br>in MarkObjectiveDone: about to setobjective"+objectiveID+"completed</br>");}
	ps[znThisPage].qStatus="completed";//set status in pageArray;
	ns.localStorage.set('pageArray',ps); 
	SCOSetObjectiveData(objectiveID, "status", "completed");//set status in LMS
	SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
	SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
	SCOCommit();
	
 if (testing){ console.log("<hr><b style=\"color:blue\">LMS Data from MarkObjectiveDone:</b><br/>objectiveID="+objectiveID+ "SCOSetObjectiveData(objectiveID, \"status\")="+SCOGetObjectiveData(objectiveID, "status") ); }

turnOffMsg()
 

} //end MarkObjectiveDone()
	
//used only for testing	
function clearObjectiveData(){  
	SCOSetObjectiveData(objectiveID, "score.raw", "0");
	SCOSetObjectiveData(objectiveID, "score.max", "0");
	SCOSetObjectiveData(objectiveID, "status", "incomplete");
}