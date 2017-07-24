//*****************Quizzing functions*************//		
 //*********scorm gets this from scorm, tincan gets it from lms or from login	
	//var username = "emeiselm", details = "Ellen Meiselman"; //CHANGE
	//var trackingmode = "scorm";	
	
	


//*********	

testing = true;
	
function openMessageBlock(){  $("#finishedDiv").show(); }	 
function turnOnMsg(){  $("myModal").show();  } 
function turnOffMsg(){$("myModal").hide();  }


//chooses a "finish" button based on if there are any more SCO's - either go to next module or close window
function chooseBtn(){ 
    btnImg=('nextModule');
	return btnImg; 
}//end function chooseBtn
// ********************************** //


function checkAPI(){ //CHANGE add tincan option
	if (!APIOK()){
		var msgWin= $('#quizMessages');
		msgWin.innerHTML=('Quizzes only run when you access this module through MLearning.');
		msgWin.innerHTML+=('<a href="top.window.close();">Close module</a>')
		return; 
	}
}
 

//*********	   
function scoreQuizzes(){ //CHANGE NEEDED: insert these into standard message boxes provided by metro
	var progWin=document.getElementById('quizProgress');
	var msgWin= document.getElementById('quizMessages');
			
  	if ((trackingmode == "scorm")&&APIOK()){  //CHANGE NEEDED: if SCORM is available. what if tincan?
        btnImg = chooseBtn(); //chooses a "nextSco" or "closeWindow" button based on if there are more scos in sequence
        progWin.style.display="block";
        moduleStatus='';
        //display a loading message
		//var tmp = document.createElement('div');
		var loadingMsgStr = '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>Loading...</h3></div>';
			loadingMsgStr +='<div class="modal-body"><p><img src="images/ajax-loader-3.gif"/>&nbsp;Loading data, please wait!<br></p></div>';
		          
	       // $('#sidebar-left').append(tmp); //CHANGE NEEDED: 
			//tmp.id = 'loadingMsg';
	       // tmp.className = 'loadingMsg';		
		   	$('#myModal').html(loadingMsgStr);
	    	$('#myModal').modal({backdrop:false}); 
	    	turnOnMsg();			    
		var iMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);				
		var totalmaxRawScore= 0; //total points possible -sent by questionmark upon finishing each quiz
		var totalRawScore = 0;//total of all quizzes in points
		var totalPercentScore=0; //total of all points received divided by totalmaxRawScore
		var unfinQz=''; 
		if (testing){	
			console.log('In scoreQuizzes: iMasteryScore= '+iMasteryScore+', moduleStatus= '+moduleStatus);
			console.log('totalmaxRawScore= '+totalmaxRawScore+', totalRawScore= '+totalRawScore+', totalPercentScore= '+totalPercentScore);
		}//end debug
	  
	 	
	 	var ps = ns.localStorage.get('pageArray');
		 
	 
	 	for(var i=0; i< ps.length; i++){ //loop thru all pages
	        var q = ps[i]; 
			if(q.quiz){ //if this page is a quiz
			    var qType=q.type?q.type:"Q";
			    var objectiveID=(qType+q.quiz);
			    var qPassingscore = (typeof q.passingscore!="undefined")?q.passingscore:null;
			    var qRm = q.rm?q.rm:"";
			    var gReqMsg;
			    //normalize countscore for use in classname of button in case it's missing or wrong.
                countscore=((typeof q.countscore!="undefined")&&(q.countscore>=0))?q.countscore:'1'; 
			    if (countscore==1||countscore==3){ gReqMsg=(qRm!="")?qRm+" ":"Required.";  }
			    else{  gReqMsg=(qRm!="")?qRm+" ":"Recommended."; }
              	for (var key in q){ //loop thru all properties of q and define them as variables
					var val = q[key];
					if(testing){console.log(key+' '+val);}	
				}
	        	//define a couple of strings:
	        	var messageLine1 = '<div id="msg02_p'+(i+1)+'" class="countscore'+countscore+'" >'+gReqMsg+' </div></td>'
			    
			    if (testing){ console.log('in scoreQuizes objectiveID='+objectiveID) }
				//check for status in mlearning. if none, use not attempted for judging quizzes below					
			    objStatus = (typeof SCOGetObjectiveData(objectiveID, "status")!="undefined")?(SCOGetObjectiveData(objectiveID, "status")):'not attempted';
			    if (testing){ console.log('objStatus= '+ objStatus); }
			    
			  	//is a max score set in mlearning? if so, use it as objScore, else use what is CURRENTLY in page array (can be different than what was there when setupQuizzes ran). 
			  	objMax =   (typeof  SCOGetObjectiveData(objectiveID, "score.max")!="undefined")?parseInt(SCOGetObjectiveData( objectiveID, "score.max"),10):'q.qMax';
			  	 if (testing){ console.log('objMax= '+ objMax); }
			   	//is a raw score set in mlearning? if so, use it as objScore, else use whats currently in page array. 
			   	objScore = (typeof SCOGetObjectiveData(objectiveID, "score.raw")!= "undefined")?parseInt(SCOGetObjectiveData( objectiveID, "score.raw"),10):'q.qScore';			   
     			if(testing){ console.log('GXQ typeof objScore='+typeof objScore+' objScore='+objScore);  } 			   
			    //now, is a max score set in pageArray? if not, use 0 for judging below.
			   	qMax   = (typeof objMax!="undefined")?parseInt(objMax,10):0; 			   
			   	//now, is a raw score set in pageArray? if not, use 0 for judging below.
			   	qScore= ( (typeof objMax!="undefined")&&(!isNaN(objScore) ) )?parseInt(objScore,10):0; 
			   	qPercentScore = qMax!=0?Math.round((qScore/qMax)*100):0;
				if(testing){ console.log('GXP typeof q.qScore='+typeof q.qScore+' q.qScore='+q.qScore+'qScore= '+qScore+', qMax'+qMax+'qPercentScore='+qPercentScore);  } 	
		 		/*set up the status message for each quiz*/
		  		if (testing){	 
		            console.log('about to list all quizzes in quizFunctions.js');
		        	console.log('objStatus= '+objStatus);
		            console.log('q.qStatus= '+q.qStatus);
		            console.log('typeof objStatus= '+typeof objStatus);		                
		            }//end if(testing)
				if((objStatus=="not attempted")||(q.qStatus=="not attempted")||(typeof objStatus=="undefined") ){			                   
                    unfinQz += ('<tr><td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                    unfinQz += (messageLine1); 
				    unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--A--><br/></td></tr>');			                    
				    //if any one page is required but not attempted, set overall module status to incomplete.
				    if(countscore==1||countscore==3){ moduleStatus='incomplete';}
				}//end if( (objStatus=="not attempted")||(q.qStatus=="not attempted"...    
		      		      
				else{    		       
			   		switch(qType){
                   	case "Q": 	//Questionmark, or anything where they forgot to enter q.type
                    			//If never attempted: show 'not completed' message, green btn + go there now . If quiz is Required, set module status to 'incomplete'
			            
						//questionmark quizzes not yet attempted may show this - not sure this is needed???
						if ( isNaN(objMax) ){ 
									if(countscore==1){ moduleStatus = 'incomplete';	}
									unfinQz += ('<tr><td class="unfinQzLft" id="msg01_p'+(i+1)+'"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
									unfinQz += (messageLine1); 
									unfinQz += ('<td class="unfinQzRt"  id="msg03_p'+(i+1)+'">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--B--><br/></td></tr>');
									}
						//if there is a raw score or completion status for this quiz in MLearning, it is considered completed (need not be passed)
						else if(  ( (typeof objScore!="undefined")&&(objStatus!="not attempted")  ) || (objStatus=="completed")||(objStatus=="passed") ){ 
							//if it is scored quiz  - or - if quiz scores but does not COUNT toward final module score ( score shows up but doesn't count!)    
							if(typeof countscore=="undefined"||countscore==1||countscore==2){     
								unfinQz +=('<tr>');
								unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); 
								unfinQz +=(messageLine1); 
								unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--C--><br/></td>');				
								unfinQz +=('</tr>');
							}//end if(typeof coun
							else if( countscore==3  ){//this is a quiz that MUST BE PASSED to complete the module
								if ( objStatus =="passed") { 
								 
									unfinQz +=('<tr>');
								unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+', or '+	qPercentScore+'%. ' ); 
								unfinQz +=('Required score was '+	qPassingscore+'%'+' so this quiz is PASSED. ');
								unfinQz +=(messageLine1); 
								unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--N--><br/></td>');				
								unfinQz +=('</tr>');
								}
								else if(objStatus=="failed"){
								if(testing){console.log('objectiveStatus was failed');}
									unfinQz +=('<tr>');
									unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+', or '+	qPercentScore+'%. ' );
									unfinQz +=('Required score was '+	qPassingscore+'%'+' so this quiz is FAILED. '); 
									unfinQz +=(messageLine1); 
									unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="failedLink">Please try again!</a><!--O--><br/></td>');				
									unfinQz +=('</tr>');
									moduleStatus = 'incomplete';
								}
								//do we need something to catch "completed" here
							}
							
							
							else if (countscore==0){
								unfinQz +=('<tr>');
								unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>' ); 
								unfinQz +=(messageLine1);  	
								unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--C2--><br/></td>');				
								unfinQz +=('</tr>');		        
							}//end else if (countscor
								  
						}// end  else if( ( (typeof objScore!="undefined")&&(objStatus
					break;
						   
			     	//Captivate	   
                   	case "C": 
                        //If never attempted: show 'not completed' message, green btn + go there now . If quiz is required, set module status to 'incomplete'
			            if( (objStatus=="not attempted")||(q.qStatus=="not attempted")||(typeof objStatus=="undefined") ){
			                unfinQz += ('<tr>');
                            unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                            unfinQz += (messageLine1); 
				            unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--D--><br/></td>');
			                unfinQz += ('</tr>');
				           	if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	      }//end if
							 
						//Required captivate quiz that has been looked at or not, but not yet attempted. Show not completed message, green button. NO score.  
						else if (countscore==1 && isNaN(objMax) ){  
			                moduleStatus = 'incomplete';	
			                unfinQz += ('<tr>');
                            unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
							unfinQz += (messageLine1);
				            unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--E--><br></td>');
			                unfinQz += ('</tr>'); 
			                }
							 
						//if there is any raw score for this quiz stored in MLearning or it is completed	 
				  		else if(  ( (typeof objScore!="undefined")&&(objStatus!="not attempted") )||(objStatus=="completed")){ 
			                unfinQz +=('<tr>');
			                if(!isNaN(objMax)){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); }
				            //Captivate will cause NaN if you have just looked at the page, but not taken it yet
				            else if ( isNaN(objMax) ){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');  }
				            unfinQz +=(messageLine1); 
				            unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--F--></td>');				
				            unfinQz +=('</tr>');
			            }//end  else if(((typeof objScore!="undefined")&&(objStatus!="n			     			    
			     	break;
			     	 	case "H": 
                        //If never attempted: show 'not completed' message, green btn + go there now . If quiz is required, set module status to 'incomplete'
			            if( (objStatus=="not attempted")||(q.qStatus=="not attempted")||(typeof objStatus=="undefined") ){
			                unfinQz += ('<tr>');
                            unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                            unfinQz += (messageLine1); 
				            unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--D--><br/></td>');
			                unfinQz += ('</tr>');
				           	if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	      }//end if
							 
						//Required captivate quiz that has been looked at or not, but not yet attempted. Show not completed message, green button. NO score.  
						else if (countscore==1 && isNaN(objMax) ){  
			                moduleStatus = 'incomplete';	
			                unfinQz += ('<tr>');
                            unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
							unfinQz += (messageLine1);
				            unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--E--><br></td>');
			                unfinQz += ('</tr>'); 
			                }
							 
						//if there is any raw score for this quiz stored in MLearning or it is completed	 
				  		else if(  ( (typeof objScore!="undefined")&&(objStatus!="not attempted") )||(objStatus=="completed")){ 
			                unfinQz +=('<tr>');
			                if(!isNaN(objMax)){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); }
				            //Captivate will cause NaN if you have just looked at the page, but not taken it yet
				            else if ( isNaN(objMax) ){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');  }
				            unfinQz +=(messageLine1); 
				            unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--F--></td>');				
				            unfinQz +=('</tr>');
			            }//end  else if(((typeof objScore!="undefined")&&(objStatus!="n			     			    
			     	break;
                   	//interactions
                   	case "I":				 
                        if( (objStatus=="")||(typeof objStatus=="undefined")||(typeof objStatus==undefined) ){ 
                            unfinQz += ('<tr><td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                            unfinQz += (messageLine1); 
				            unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--M--><br/></td></tr>');    
				            if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	  	}//end if( (objStatus==""   
		      
							 
						//if recommended and attempted but incomplete, interactions quizzes are considered done  -blue try again button
						if(countscore==0 && q.qStatus=="incomplete"){ 
			            	unfinQz +=('<tr>');
			            	//if there is no score in mlearning, don't show a score
				            if(isNaN(objScore) ){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');  }
				            else{                  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' );  } 
				            unfinQz +=(messageLine1); 
							unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><br/><!--H--><br/></td>');				
				            unfinQz +=('</tr>'); 
			            }//end if(countscore==0 && q.qS
			  			      
				  	  	//required Interactions page, attempted, incomplete. Show as NOT completed (green). Note this is different than Qmark quizzes.
				  	  	else if( (countscore==1)&&(objStatus=="incomplete"||q.qStatus=="incomplete")){ 
			            	moduleStatus = 'incomplete';	
			                unfinQz +=('<tr>');
                            unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                            unfinQz +=(messageLine1); 
				            unfinQz += ('<td class="unfinQzRt">You have not finished all the items on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--I--><br/></td>');
			                unfinQz +=('</tr>');  
			            } //end  else if( (countscore==1)&&(objStatus==
							 
						//Required or Recommended Interactions quiz, Completed : Show as completed. Show Try Again msg 
			            else if(  (objStatus=="completed"||q.qStatus=="completed") ){ 
			                unfinQz +=('<tr>');
			            	unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.'+'<br/>');
				            unfinQz +=(messageLine1); 
				            unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--J--><br/></td>');				
				            unfinQz +=('</tr>'); 
			            } //end else if(  (objStatus=="completed"||q.qStatus==
                    break;
                  	//qualtrics
				   	case "U":
				 		if ( (objMax!="")&&( typeof objMax!="undefined" )&&!isNaN(objMax)&&(parseInt(objMax,10)>0) ){  q.qMax=parseInt(objMax,10); }
		             	qMax=q.qMax;
				     	if (testing){	console.log('moduleStatus='+moduleStatus+' objStatus= |'+objStatus+'|, objScore= |'+objScore+'|, q.qStatus= |'+q.qStatus+'|') }
                     	//no objective status in mlearning: quiz probably has not been taken yet
                     	if( (objStatus=="")||(typeof objStatus=="undefined") ){
                            unfinQz += ('<tr><td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                            unfinQz += (messageLine1); 
				            unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a id="quiz'+ i +'" class="gothereLink btn btn-large btn-success">Go there now!</a><!--A--><br/></td></tr>');    
				            if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	  	}//end if( (objStatus=="not attempted")||(q.qStatus=="not attempted"...    
		              
		              
		              
                      //if there is any raw score for this quiz stored in MLearning or it is completed, it is considered complete
		             	if(((typeof objScore!="undefined")&&(objStatus!="not attempted")&&(objStatus!="") )||(objStatus=="completed")){ 
							unfinQz +=('<tr>');
							if(!isNaN(objMax)){  unfinQz +=('<td class="unfinQzLft" width="360"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); }
							else {  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');  }
							unfinQz +=(messageLine1); 
							unfinQz +=('<td class="unfinQzRt"><a id="quiz'+ i +'" class="tryagainLink">Try again?</a><!--L--><br/></span></td>');				
							unfinQz +=('</tr>');
			            }//end if (((typeof objScore...
			     
			        break;
			    	}//end switch		       
             	}//end else
		   
		     //if there IS NO countscore, or if it is 1 consider the quiz required/counted, and add quiz score to the total module score
		     //if it is 2 or 0, it does not count.
		    
	    	if ( 
	    		typeof q.countscore=="undefined"||  (typeof q.countscore!="undefined" &&(q.countscore==1||q.countscore==3) )
	    	
	    	 ){
				//console.log('quiz: '+objectiveID+'===========');
				//console.log('totalmaxRawScore= '+totalmaxRawScore+' qMax='+qMax);
				totalmaxRawScore+=parseInt(qMax,10);
				//console.log('after adding qmax, totalmaxRawScore= '+totalmaxRawScore);
				//console.log('totalRawScore= '+totalRawScore+' qScore='+qScore);
				totalRawScore +=parseInt(qScore,10);
				//console.log('after adding qScore, totalRawScore= '+totalRawScore);
			}//end if((typeof q.countscore
				//don't add objective max score and objective raw score on to totals.		
				//if (testing){ console.log('page'+(i+1)+': typeof objStatus='+typeof objStatus+', objectiveID= '+objectiveID+' objStatus= '+objStatus+ 'q.qStatus= '+q.qStatus+', objMax= '+objMax+ ', objScore= '+objScore+ ',  qMax='+qMax+', qScore='+qScore+', totalmaxRawScore so far='+ totalmaxRawScore+', totalRawScore so far= '+ totalRawScore+', moduleStatus='+moduleStatus+ ' q.countscore='+q.countscore+' <br>');  } 
			}//end if q.quiz  
	   }//end page loop 
	   
	    //********************Judge overall module status and total score*******//
 
	  	//if the status is NOT incomplete (i.e. it IS passed, failed, completed)
		if (moduleStatus != 'incomplete'){	  
	  	//and, if there isn't a mastery score we aren't gonna bother with the scores - just set it to completed no matter what.
			if (isNaN(iMasteryScore)) { 
				SCOSetValue("cmi.core.score.raw", totalPercentScore+"" ); //send raw score
				SCOSetValue( "cmi.core.lesson_status", "completed" ); 
				alert('there is no mastery score set in MLearning. Module has been marked "complete" instead of pass/fail.');
			} 
			else { //or, if there IS a mastery score : score pass/fail
				//first determine and then set the percent score in mlearning
				totalPercentScore=(totalmaxRawScore!=0?Math.round((totalRawScore/totalmaxRawScore)*100):0);   
				SCOSetValue("cmi.core.score.raw", totalPercentScore+'' ); 
				//if failed set status to failed, if passed, set it to passed.
				(iMasteryScore > totalPercentScore)?( SCOSetValue( "cmi.core.lesson_status", "failed" ),moduleStatus="failed"):(SCOSetValue( "cmi.core.lesson_status", "passed" ),moduleStatus="passed");
				SCOCommit(); 
				//end else there IS a mastery score
				 
				msgWin.innerHTML +=('<div id="modStatus">This module is<br><span class="moduleStatusMsg">'+moduleStatus+'</span>');				 
				msgWin.innerHTML +=(' <div id="finOptions">');
				msgWin.innerHTML +=('<table><tr valign="top"><td class="StatusPageFdbk" ><div class="finalCompleteButton btn  btn-large" onMouseDown="SCOCommit();SCOFinish();">Send my<br/>score!<br/>I\'m done!.</div></td><td class="StatusPageFdbk"><div class="finalSuspendButton btn btn-large btn-danger" onmousedown="suspendActions(this.id);">Save progress<br/>achieved so far<br/>and finish later.</div></div></td></tr><tr><td style="padding-top:12px;"></td></tr></table></div>');
 				 
				msgWin.innerHTML +=('<ul><li>You scored <b>' + totalRawScore+' point(s)</b> out of a possible <b>'+ totalmaxRawScore+'</b>.<br><li>Your total score for this module is <h1 style="display:inline">'+totalPercentScore+'%</h1><br> This module requires <b>'+iMasteryScore+ '%</b> to pass. <br/><span style="font-size:10px;font-weight:bold;color:red;">If you wish to improve your score, you may retake any quiz by clicking the button(s) below.</span></li></ul></div>' );
				 				 
				msgWin.innerHTML +=('<table id="unfinQzTbl">'+unfinQz+'</table>');				 
				if (typeof zEnvironment!='undefined'){
					switch(zEnvironment){
						case 'saba':
						//for now, don't put any image or message related to where to find certificates.
						break;
						case 'mlearning':
						//do something
						break;
						default:
						//'<div id="certHelp"></div>'
					}
				}
				else{  //zEnvironment is undefined
					 msgWin.innerHTML +=('<div class="CertInstructions"></div>' ); 
				}	
		 			
				$('.finalCompleteButton').click(function(){ns.localStorage.removeAll()})
			}//end else there IS a mastery score
		}//end if moduleStatus is not incomplete
	   
	   //moduleStatus IS incomplete: set status to incomplete and alert to missing quizzes		 
		else if(moduleStatus=='incomplete'){ 
		    	SCOSetValue( "cmi.core.lesson_status", "incomplete" ); 			     
				msgWin.innerHTML +=('<div id="modStatus">This module is<br><span class="moduleStatusMsg">'+moduleStatus+'</span>' );				 
				msgWin.innerHTML +=('<div id="unFinOptions" align="center"><h1 class="red alert alert-error" style="font:18px bold Verdana, Arial,Helvetica, sans-serif;">This module can not be marked <span style="color:#000;">Complete</span> until all required quiz pages are completed.</h1><table style="margin-top:6px;"><tr valign="top"><td class="StatusPageFdbk" ><div class="finalSuspendButton btn btn-large btn-danger" onmousedown="suspendActions(this.id);">Save progress<br/>achieved so far<br/>and finish later.</div></div></td></tr></table></div>');
				msgWin.innerHTML +=('<table id="unfinQzTbl">'+unfinQz+'</table>');					
		}//end moduleStatus IS incomplete - set incomplete status in mlearning
		    
		SCOCommit();//commit data to db
		turnOffMsg(); 

	    if (testing){     
			console.log('iMasteryScore= '+iMasteryScore+', moduleStatus= '+moduleStatus);
			console.log('totalmaxRawScore= '+totalmaxRawScore+'totalRawScore= '+totalRawScore+'totalPercentScore= '+totalPercentScore);
		}
								
		msgWin.style.display='block';
		progWin.style.display="none";
	}//end if APIOK();
 	else{ 
 		msgWin.innerHTML+=('LMS not detected, so status cannot be retrieved.');
        msgWin.style.display='block';
        }//end else
}//end scoreQuizzes function
  
//http://rusticisoftware.github.io/TinCanJS/doc/api/latest/