//v.1.6 01-12-2011 emeiselm


		
		
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementById("content").innerHTML+=("<div id='output'><p>Messages</p></div>") ;
 
//this is included in each page that contains interactions
if ((parent.data.IntArray)&&(parent.APIOK())){
 
 	var testingInteractions = true; //turn to true to show debugging information for this script
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
		//var attempted = (objStatus=="incomplete"||objStatus=="complete")?true:false;//progressbar_long.gif
		
		//show loading message
		 var tmp = document.createElement('div');
	     tmp.id = 'loadingMsg';
	     tmp.className = 'loadingMsg';
	     var loadingMsgStr = "Loading data, please wait!<br><img src=\'images/ajax-loader-3.gif\'/>"
		 document.getElementById('NavBar').appendChild(tmp);
		 document.getElementById('loadingMsg').innerHTML=(loadingMsgStr);
		 
		turnOnMsg();
       
       
               if (testingInteractions){ console.log("LMS Data from MarkObjectiveDone: objMax= "+objMax+" objScore="+objScore+" objStatus="+objStatus); }
		
		//if no objective in LMS for this page yet, create one and set its status to n/a
		if (isNaN( parent.SCOGetObjectiveIndex(objectiveID) ) ) {
			parent.SCOSetObjectiveData(objectiveID, "status", "not attempted");
			if (testingInteractions){console.log("setting status=for "+objectiveID);}
		}
		var LMSobjectivesCount = parent.SCOGetValue("cmi.objectives._count");
		 
		 if (window.testingInteractions){console.log("LMSobjectivesCount="+LMSobjectivesCount + "objStatus= " + objStatus);}
		 qMax = qMax?qMax:iMax;// redundant, delete
		 
		
		if (testingInteractions){
		    console.log("interactionsPage.js output for: objectiveID= " +objectiveID+ " <br>znThisPage= " +znP);
		    console.log("iMax=" + iMax + " <br>iScore=" + iScore +"prior to iScoreCalc"); 
		}
		setUpInteractions();
		//setTimeout('iScoreCalc()',10000);
		document.body.onbeforeunload+= saveInteractions; //save the data when document is closed
        document.body.onunload+= saveInteractions;
		
}//end if ((parent.data.InteractionsArray)&& (parent.APIOK())

else{  outputWindow.innerHTML=("<h1 style=\'color:red;\'>MLearning not available. Interactions will not score! but you can still browse the module</h1>")}//just continue, maybe put error alert in here?
 

function setUpInteractions()
{

 
	               if (testingInteractions){ console.log("In setUpInteractions");}
	   iScore=0;//reset total of all points for this objective to 0 - going to recalculate them now.
	   iMax=0;
	   var itemList = window.itemList; 
	       if(itemList){
		      for (var k in itemList)//move through interaction array
                  { 
		         	var itm=itemList[k];//items are objects with properties like score, required points, tries, etc.
			                              if (testingInteractions){ console.log("k= " +k+ ":"+itm.id+", itm.quiz= " +itm.quiz+ "qQuiz= "+qQuiz+" , itm.ascore= "+itm.ascore+", itm.status= "+itm.status+", itm.msg= "+itm.msg+", itm.tries=  "+itm.tries+", objectiveID= " +objectiveID+ "<br>"); }
			        if(itm.quiz == qQuiz) //does itm.quiz match this page's associated objective(quiz) number in the page array?
			          {
						                   if (testingInteractions){ console.log("Interaction quiz number matches this page\'s quiz number")}
				        
					    setFeedbackMsg(itm.msg, itm.id);
				        iMax+=itm.amax; //add required points for this item to max score for this objective - we are calculating the total max points possible for this objective.
				 
			                  	 if (testingInteractions){  console.log(k+"<br>itm.quiz= " +itm.quiz+"<br> itm.msg= " +itm.msg+  "itm.ascore= "+itm.ascore); }
			                  	 
			                  	 
 //double checking if itm score is same or less than itm max pts (mistake), then add [corrected] score to total raw score for this page
				if (itm.ascore>=itm.amax) { iScore+=parseInt(itm.amax,10);  }	
									else { iScore+=parseInt(itm.ascore,10); }
 if(testingInteractions){console.log("after adding "+itm.id+":itm.ascore"+itm.ascore+", iScore= " +iScore);}
				}//end if (itm.quiz == obj	 
	     }//end for (var k in itemList
					 
			   iScoreCalc();
	           saveInteractions();
			   qMax = iMax;//record max score in pageArray 
			   qScore = iScore; //record total raw score in pageArray
			   qStatus = iStatus;
				
					
					if(iScore>0){parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());} //at least one interaction completed
				    if ((iScore==0)&&(iMax>0)){	parent.SCOSetObjectiveData(objectiveID, "status", "not attempted");}//not tried yet
					 
		        parent.SCOSetObjectiveData("I"+objectiveID, "score.max", iMax.toString());
			     if (iScore>=iMax){  MarkObjectiveDone(itm.quiz);    }//if total raw score equals or exceeds max score, mark this objective done. 
			
	}//end if(itemList)
	//qPage.qStatus= objStatus;
	qStatus= objStatus;
	 if (testingInteractions){  console.log('qStatus= '+qStatus);}
	turnOffMsg();//done loading data, so hide loading message  
}//end function setUpInteractions
 
function setFeedbackMsg(msg, itmID){ 
 
document.getElementById('msg_'+itmID).innerHTML = (msg);	}//end setFeedbackMsg(

function recordItem(itemID, dscore)
{
	loadingMsgStr = "Sending data to MLearning, may take time before status is updated!<br><img src=\'images\/ajax-loader-3.gif\'/>"
         turnOnMsg();
        
	var itm = parent.data.itemList[itemID];
	 if (testingInteractions){ console.log('In recordItem, itm.tries= '+itm.tries)}
	// alert('<br>In recordItem,  itm.tries = '+itm.tries+'<br>');
	itm.tries =parseFloat(itm.tries); 
	 if (testingInteractions){ console.log('In recordItem, parseInt(itm.tries,10)= '+itm.tries+'<br>')}
	itm.tries=(itm.tries+1);//update tries for this item in the interaction array
	//alert('<br>In recordItem, just set itm.tries to '+itm.tries+'<br>');
	 if (testingInteractions){ console.log('In recordItem, just set itm.tries to '+itm.tries+'<br>')}
	itm.ascore=parseFloat(dscore);
	 if (testingInteractions){ console.log('in record item just set itm.ascore to '+itm.ascore+'<br>')}

	 
	 
	//if this is required but not attempted: page is incomplete   
	   if ((itm.amax > 0)&&(itm.tries==0)) { setFeedbackMsg(requiredMsg, itm.id);   }
		  
		  //if recommended but not attempted  
    else if ((itm.amax==0)&&(itm.tries==0)){ setFeedbackMsg(recommendedMsg, itm.id); }      
      
      //if required and attempted
	else if ((itm.amax > 0) && (itm.tries > 0 )) { setFeedbackMsg(completedMsg, itm.id); }
	
	 //if recommended and attempted        
    else if ((itm.amax ==0) && (itm.tries > 0 )){ setFeedbackMsg(completedMsg, itm.id);  }
	//insert additional score tracking here if needed
	else { alert('itm.tries error in function recordItem<br>Please note this data and send to MLearning team.<br>+itmID= '+itmID+' itm.amx= '+itm.amax+' itm.tries= '+itm.tries); }	 
	 //this will mark the objective done if iScore >=iMax	 	
	iScoreCalc();
	 if (testingInteractions){ console.log('<br>in record item, just ran iScoreCalc: iScore is'+iScore + 'iMax is'+iMax+'<br>')}
	
	saveInteractions();	//this saves the current string of interaction data for all pages
	       if (testingInteractions){  
	                               console.log('<br>in recordItem: iScore = '      +iScore   +'<br>');
		                           console.log('<br>in recordItem: itm.tries = '  +itm.tries+'<br>');
		                            }
        qPage.qScore = iScore; //record in pageArray
  
 turnOffMsg();
 }//end function recordItem 

 function iScoreCalc()
   {
	   var tempStatus=1; //used to store whether all required items have been completed yet
	   iScore = 0;//iscore is total points for this quiz
     for (var m in itemList)//move through interaction array to find ones for this page
        { 
	      var itm = itemList[m];
                         if (testingInteractions){ console.log('<br>in iScoreCalc itm.id:'+itm.id)+'objectiveID= '+objectiveID + ', objectiveID.slice(1)= '+objectiveID.slice(1)+' typeof itm.ascore'+ typeof itm.ascore;}		  
		 
		 if (itm.quiz == objectiveID.slice(1)) {   
				   iScore+=(itm.ascore*1);
	               if (testingInteractions){ console.log('<br>after adding itm['+m+'].ascore: (itm.ascore*1)'+(itm.ascore*1)+' iScore now ='+iScore);}
				 }//end if (itm.quiz ==qPage.quiz)
		      if ((itm.amax > 0)&&(itm.tries==0)){tempStatus = 0;  }
		// else if ((itm.amax ==0)&&(itm.tries==0)){   }//no change in status
		// else if ((itm.amax > 0)&&(itm.tries >0)){   }//no change in status
	      }//end for (var m=0;
			         if (testingInteractions){console.log("<br> iMax=" + iMax + " <br>iScore=" + iScore +"after iScoreCalc<hr><br>"); }		                         
		   	parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
		    parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
			
			if((tempStatus==1)&&(iScore >= iMax)){ //all req. items attempted, and score >= page maximum
			 
			      MarkObjectiveDone();
			      if (testingInteractions){console.log("<br> ran MarkObjectiveDone after iScoreCalc<hr><br>"); }
			}
			else{ parent.SCOSetObjectiveData(objectiveID, "status", "incomplete");
			      iStatus="incomplete";//set status on page
				  qStatus="incomplete";//set status in pageArray
			   }
			return iScore;
    }//end iScoreCalc


function turnOnMsg(){   document.getElementById("loadingMsg").style.display="block";  } 
function turnOffMsg(){  document.getElementById("loadingMsg").style.display="none";}


function saveInteractions(){
	    parent.data.saveInteractions();
	                   if (window.testingInteractions){ console.log('I just saved interactions from interactionsPage.js'); }
}
 
   //if total score on this page = total max score for this page, then mark objective completed<br />
function MarkObjectiveDone()
  {//send quiz score data to the LMS
       //saveInteractions();
	  // alert(objectiveID);
	 if (window.testingInteractions){console.log("<br>in MarkObjectiveDone: about to setobjective"+objectiveID+"completed</br>");}
		parent.SCOSetObjectiveData(objectiveID, "status", "completed");//set status in LMS
		parent.SCOSetObjectiveData(objectiveID, "score.raw", iScore.toString());
		parent.SCOSetObjectiveData(objectiveID, "score.max", iMax.toString());
		window.parent.SCOCommit();
		iStatus="completed";//set status on page
		qStatus="completed";//set status in pageArray;
		//lets check to make sure they match:
	 if (window.testingInteractions){ console.log("<hr><b style=\"color:blue\">LMS Data from MarkObjectiveDone:</b><br/>objectiveID="+objectiveID+" objMax= "+objMax+"<br>objScore="+objScore+"<br>objStatus="+objStatus+"<br>"); }
		var ptwin = parent.data.window;
		
		ptwin.location.href=ptwin.location.href;//refresh the dummy page to make sure the pageArray reflects the LMS values.
		//alert('I just refreshed the dummy page');
		znP=(window.pageNo);//when you refresh the dummy page, this variable is lost, so replace it.
		window.znP=(pageNo);
		
	} //end MarkObjectiveDone()
	
	
	function clearObjectiveData(){  //used only for testing
		parent.SCOSetObjectiveData(objectiveID, "score.raw", "0");
		parent.SCOSetObjectiveData(objectiveID, "score.max", "0");
		parent.SCOSetObjectiveData(objectiveID, "status", "incomplete");
	}