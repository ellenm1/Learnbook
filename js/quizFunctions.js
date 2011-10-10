//version 1.19 02-15-11 emeiselm
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
 
var testing = true;
var quizCount=0;//how many quizzes total?
var quiz, qScore, qMax, qType, btnImg, countscore;  
var unfinQz='';
var moduleStatus='';//used to store whether all quizzes are done yet
var gNoScoreQuizMsg = ((typeof window.recommendedMsg=='undefined')?'recommended':window.recommendedMsg);
var gRequiredMsg = ((typeof window.requiredMsg=='undefined')?'required':window.requiredMsg);

 		
//chooses a "finish" button based on if there are any more SCO's - either go to next module or close window
function chooseBtn(){ 
		if (top.API_extensions.gSCOCourseStructure.getNextSCO()!=null&&top.API_extensions.gSCOCourseStructure.getNextSCO().index>0  ){
			btnImg=('nextModule');
			return btnImg; }
		else{ btnImg=('closeWindow');
		      return btnImg;}
		}

//closes window if this is last sco, or else goes on to next sco in course structure sequence.
function closeIfLastSCO(){  
   var courseStructure=top.API_extensions.gSCOCourseStructure
	if(top.API_extensions.gSCOCourseStructure.getNextSCO()!=null&&courseStructure.getNextSCO().index>0){
		courseStructure.changeSCOContent(courseStructure.getNextSCO(),parent.frames[0]);
		}
	else{top.window.close();}
}
//this is run when module is loaded
function setupQuizzes(){
   for(var i=0; i< PageArray.length; i++) { 
            var q =  PageArray[i];
	    if (typeof q.quiz!="undefined"){ 
	        quizCount++;
		    qType=(typeof q.type!="undefined")?q.type:"Q";
		    var objectiveID= (qType+q.quiz);
		    if (testing){ console.log('in setupQuizes objectiveID='+objectiveID) }

 //sets up the maximum score for each objective
           var objStatus =  (parent.SCOGetObjectiveData(objectiveID, "status"   ))?(parent.SCOGetObjectiveData( objectiveID, "status"   )):'';
	       var objMax =     (parent.SCOGetObjectiveData(objectiveID, "score.max"))?(parent.SCOGetObjectiveData( objectiveID, "score.max")):'';
		   var objScore =   (parent.SCOGetObjectiveData(objectiveID, "score.raw"))?(parent.SCOGetObjectiveData( objectiveID, "score.raw")):'';
		  //if there's a score in mlearning, use it, otherwise leave it
		   if (typeof objScore!="undefined"){ q.qScore=parseInt(objScore,10);}
		   qScore=q.qScore; 
		 	
		if ( (objMax!="")&&( typeof objMax!="undefined" )&&!isNaN(objMax) ){  q.qmax=parseInt(objMax,10);    }
		                                     
			qMax=q.qmax;
 			//write to debugging window in data frame
			       if (testing){
			         console.log('from quizFunctions.js: setupQuizzes');
		             console.log((i+1)+': '+objectiveID+', objMax= '+objMax+', objScore= '+objScore);
			         console.log('qMax='+qMax+', qScore='+qScore+'qType'+qType);	
			         }//end  if (testing 
		 }// end if (typeof q.quiz!="undefined"){
		 
      } //end for (var...
    	 
 } //end setupQuizzes function
  
 // ********************************** //
function wait(){}
 // ********************************** //
function showProgressMsg(){
	var progWin=parent.myStage.document.getElementById('quizProgress');	
	progWin.style.display="block";
	if ( !progWin.style.top>0){ progWin.style.display="block";}
	  else{ }
}

 // ********************************** //
function turnOnMsg(){ 
        parent.myStage.document.getElementById("loadingMsg").style.display="block";  
} 
function turnOffMsg(){ 
          parent.myStage.document.getElementById("loadingMsg").style.display="none";
}

function scoreQuizzes(){ //do this at the end, and maybe replace with a function that adds up the scores from the db
	        var progWin=parent.myStage.document.getElementById('quizProgress');
	        var msgWin= parent.myStage.document.getElementById('quizMessages');
			
  if (parent.APIOK()){  //if SCORM is available
                   btnImg = chooseBtn(); //chooses a "nextSco" or "closeWindow" button based on if there are more scos in sequence
                   progWin.style.display="block";
                   moduleStatus='';
            //display a loading message
		var tmp = parent.myStage.document.createElement('div');
		var loadingMsgStr = "Loading data, please wait!<br><img src=\'images/ajax-loader-3.gif\'/>";           
	                parent.myStage.document.getElementById('NavBar').appendChild(tmp);
					tmp.id = 'loadingMsg';
	                tmp.className = 'loadingMsg';		
		            parent.myStage.document.getElementById('loadingMsg').innerHTML=(loadingMsgStr);
		            
		//else {parent.myStage.document.getElementById('NavBar').innerHTML+=("<div id='loadingMsg'>Loading data, please wait!<br><img src=\'images/ajax-loader-2.gif\'/></div>")}
	     turnOnMsg();
			    
				var iMasteryScore = parseInt(parent.SCOGetValue("cmi.student_data.mastery_score"),10);				
				var totalmaxRawScore= 0; //total points possible -sent by questionmark upon finishing each quiz
				var totalRawScore = 0;//total of all quizzes in points
				var totalPercentScore=0; //total of all points received divided by totalmaxRawScore
				var unfinQz=''; 
			              if (testing){	
				                      console.log('iMasteryScore= '+iMasteryScore);
				                      console.log('moduleStatus= '+moduleStatus);
				                      console.log('totalmaxRawScore= '+totalmaxRawScore);
				                      console.log('totalmaxRawScore= '+totalRawScore);
				                      console.log('totalPercentScore= '+totalPercentScore);
			            	}//end debug
	 	  if(testing){console.log('moduleStatus='+moduleStatus )}
	 for(var i=0; i< PageArray.length; i++) { //loop thru all pages
	           var q = PageArray[i]; 
			   if(q.quiz){ //if this page is a quiz
			         var qType=q.type?q.type:"Q";
			         var objectiveID=(qType+q.quiz);
			         var qRm = q.rm?q.rm:"";
			      //normalize countscore for use in classname of button in case it's missing or wrong.
                     countscore=((typeof q.countscore!="undefined")&&(q.countscore>=0))?q.countscore:'1'; 
			     
			      var gReqMsg;
			      
				   if (countscore==1){ gReqMsg=(qRm!="")?qRm+" ":"Required.";  }
			        else{  gReqMsg=(qRm!="")?qRm+" ":"Recommended."; }
              
	          //define a couple of strings:
	         var messageLine1 = '<div id="msg02_p'+(i+1)+'" class="countscore'+countscore+'" >'+gReqMsg+' </div></td>'
			    // parent.myStage.document.getElementById("loadingMsg").innerHTML+=(", "+(i+1));
			                        if (testing){ console.log('in scoreQuizes objectiveID='+objectiveID) }
				//check for status in mlearning. if none, use not attempted for judging quizzes below					
			    objStatus = (typeof parent.SCOGetObjectiveData(objectiveID, "status")!="undefined")?(parent.SCOGetObjectiveData(objectiveID, "status")):'not attempted';
			                        if (testing){ console.log('objStatus= '+ objStatus); }
			  //is a max score set in mlearning? if so, use it as objScore, else use what is CURRENTLY in page array (can be different than what was there when setupQuizzes ran). 
			   objMax =   (typeof  parent.SCOGetObjectiveData(objectiveID, "score.max")!="undefined")?parseInt(parent.SCOGetObjectiveData( objectiveID, "score.max"),10):'q.qmax';
			   //is a raw score set in mlearning? if so, use it as objScore, else use whats currently in page array. 
			   objScore = (typeof parent.SCOGetObjectiveData(objectiveID, "score.raw")!= "undefined")?parseInt(parent.SCOGetObjectiveData( objectiveID, "score.raw"),10):'q.qScore';			   
			  
			  
			   
			    //now, is a max score set in pageArray? if not, use 0 for judging below.
			   qMax   = (typeof q.qmax!="undefined")?q.qmax:0; 
			   //now, is a raw score set in pageArray? if not, use 0 for judging below.
			   qScore= (typeof q.qScore!="undefined")?q.qScore:0; 
		 /*set up the status message for each quiz*/
		  if (testing){	 
		               console.log('about to list all quizzes in quizFunctions.js');
		               console.log('objStatus= '+objStatus);
		                console.log('q.qStatus= '+q.qStatus);
		                console.log('typeof objStatus= '+typeof objStatus);
		                
		                }
		 if( (objStatus=="not attempted")||(q.qStatus=="not attempted")||(typeof objStatus=="undefined") ){
			                   
                                unfinQz += ('<tr><td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                                unfinQz += (messageLine1); 
				                unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--A--><br/></td></tr>');
			                    
				                if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	         }//end if( (objStatus=="not attempted")||(q.qStatus=="not attempted"...    
		      
		      
		   else{    
		       
			   switch(qType)
                     {
                   case "Q": //Questionmark, or anything where they forgot to enter q.type
                             //If never attempted: show 'not completed' message, green btn + go there now . If quiz is Required, set module status to 'incomplete'
			              
					 //questionmark quizzes not yet attempted may show this - not sure this is needed???
						 if ( isNaN(objMax) ){ 
			                    if(countscore==1){ moduleStatus = 'incomplete';	}
			                    unfinQz += ('<tr><td class="unfinQzLft" id="msg01_p'+(i+1)+'"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
							    unfinQz += (messageLine1); 
				                unfinQz += ('<td class="unfinQzRt"  id="msg03_p'+(i+1)+'">You have not completed the quiz on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--B--><br/></td></tr>');
			                    }
				//if there is a raw score or completion status for this quiz in MLearning, it is considered completed (need not be passed)
				 else if(  ( (typeof objScore!="undefined")&&(objStatus!="not attempted")  ) || (objStatus=="completed") ){ 
			           //if it is scored quiz  - or - quiz scores but does not COUNT toward final module score ( score shows up but doesn't count!)    
			           if(typeof countscore=="undefined"||countscore==1||countscore==2){     
			                unfinQz +=('<tr>');
			                  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); 
				              unfinQz +=(messageLine1); 
				              unfinQz +=('<td class="unfinQzRt"><a href=\"'+q.url+'" class="tryagainLink">Try again?</a><!--C--><br/></td>');				
				              unfinQz +=('</tr>');
				              }
				        else if (countscore==0){
				         unfinQz +=('<tr>');
			                  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>' ); 
				              unfinQz +=(messageLine1); 
				              unfinQz +=('<td class="unfinQzRt"><a href=\"'+q.url+'" class="tryagainLink">Try again?</a><!--C2--><br/></td>');				
				              unfinQz +=('</tr>');		        
				        }
				              
			                 }// end  else if( ( (typeof objScore!="undefined")&&(objStatus
			               break;
						   
			     //Captivate	   
                   case "C": 
                            //If never attempted: show 'not completed' message, green btn + go there now . If quiz is required, set module status to 'incomplete'
			               if( (objStatus=="not attempted")||(q.qStatus=="not attempted")||(typeof objStatus=="undefined") ){
			                  unfinQz += ('<tr>');
                              unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                              unfinQz += (messageLine1); 
				              unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--D--><br/></td>');
			                  unfinQz += ('</tr>');
				           if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	         }//end if
							 
						//Required captivate quiz that has been looked at or not, but not yet attempted. Show not completed message, green button. NO score.  
						 else if (countscore==1 && isNaN(objMax) ){  
			                 moduleStatus = 'incomplete';	
			                  unfinQz += ('<tr>');
                              unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
							  unfinQz += (messageLine1);
				              unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--E--><br></td>');
			                  unfinQz += ('</tr>'); 
			                }
							 
					//if there is any raw score for this quiz stored in MLearning or it is completed	 
				   else if(  ( (typeof objScore!="undefined")&&(objStatus!="not attempted") )||(objStatus=="completed")){ 
			                unfinQz +=('<tr>');
			                if(!isNaN(objMax)){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); }
				            //Captivate will cause NaN if you have just looked at the page, but not taken it yet
				             else if ( isNaN(objMax) ){  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');  }
				             unfinQz +=(messageLine1); 
				             unfinQz +=('<td class="unfinQzRt"><a href=\"'+q.url+'" class="tryagainLink">Try again?</a><!--F--></td>');				
				             unfinQz +=('</tr>');
			               }//end  else if(((typeof objScore!="undefined")&&(objStatus!="n
			     
			    
			      break;
                   //interactions
                   case "I":
				  // alert('objStatus='+objStatus+'q.qStatus= '+q.qStatus+'typeof objStatus='+typeof objStatus);
                           if( (objStatus=="")||(typeof objStatus=="undefined")||(typeof objStatus==undefined) ){
			               // if( (objStatus=="")||(q.qStatus==undefined)||(typeof objStatus=="string") ){    
                                unfinQz += ('<tr><td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                                unfinQz += (messageLine1); 
				                unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--M--><br/></td></tr>');
			                    
				                if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	         }//end if( (objStatus==""   
		      
							 
							 //if recommended and attempted but incomplete, interactions quizzes are considered done  -blue try again button
							  if(countscore==0 && q.qStatus=="incomplete"){ 
			                          unfinQz +=('<tr>');
				                       if ( isNaN(objScore) ){ //if there is no score in mlearning, don't show a score
				                             unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
				                             }
				                       else{  
								             unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); 
				                             } 
				                      unfinQz +=(messageLine1); 
									  unfinQz +=('<td class="unfinQzRt"><a href=\"'+q.url+'" class="tryagainLink">Try again?</a><br/><!--H--><br/></td>');				
				                      unfinQz +=('</tr>'); 
			                          } 
			  			      
				  	         //required Interactions page, attempted, incomplete. Show as NOT completed (green). Note this is different than Qmark quizzes.
				  	        else if( (countscore==1)&&(objStatus=="incomplete"||q.qStatus=="incomplete")){ 
			                moduleStatus = 'incomplete';	
			                   unfinQz +=('<tr>');
                               unfinQz += ('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                               unfinQz +=(messageLine1); 
				               unfinQz += ('<td class="unfinQzRt">You have not finished all the items on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--I--><br/></td>');
			                   unfinQz +=('</tr>');  
			                 } //end  else if( (countscore==1)&&(objStatus==
							 
							 //Required or Recommended Interactions quiz, Completed : Show as completed. Show Try Again msg 
			                else if(  (objStatus=="completed"||q.qStatus=="completed") ){ 
			                  unfinQz +=('<tr>');
			            	  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.'+'<br/>' );
				              unfinQz +=(messageLine1); 
				              unfinQz +=('<td class="unfinQzRt"><a href=\"'+q.url+'" class="tryagainLink">Try again?</a><!--J--><br/></td>');				
				              unfinQz +=('</tr>'); 
			                 } //end else if(  (objStatus=="completed"||q.qStatus==
                            break;
                  //qualtrics
				   case "U":
				 if ( (objMax!="")&&( typeof objMax!="undefined" )&&!isNaN(objMax)&&(parseInt(objMax,10)>0) ){  q.qmax=parseInt(objMax,10);    }
		             qMax=q.qmax;
				     if (testing){	console.log('moduleStatus='+moduleStatus+' objStatus= |'+objStatus+'|, objScore= |'+objScore+'|, q.qStatus= |'+q.qStatus+'|') }
                     //no objective status in mlearning: quiz probably has not been taken yet
                     if( (objStatus=="")||(typeof objStatus=="undefined") ){
                                unfinQz += ('<tr><td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');
                                unfinQz += (messageLine1); 
				                unfinQz += ('<td class="unfinQzRt">You have not completed the quiz on page '+(i+1)+' <a href=\"'+q.url+'\" class="gothereLink">Go there now!</a><!--A--><br/></td></tr>');
			                    
				                if(countscore==1){ moduleStatus = 'incomplete'}//if any one page is required but not attempted, set overall module status to incomplete.
				  	         }//end if( (objStatus=="not attempted")||(q.qStatus=="not attempted"...    
		              
		              
		              
                      //if there is any raw score for this quiz stored in MLearning or it is completed, it is considered complete
		             if(((typeof objScore!="undefined")&&(objStatus!="not attempted")&&(objStatus!="") )||(objStatus=="completed")){ 
			                unfinQz +=('<tr>');
			                    if(!isNaN(objMax)){  unfinQz +=('<td class="unfinQzLft" width="360"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>You scored '+qScore +' out of '+ objMax+'.' ); }
				                             else {  unfinQz +=('<td class="unfinQzLft"><b>'+q.buttonTitle+'</b> on page '+(i+1)+'.<br/>');  }
				            unfinQz +=(messageLine1); 
				            unfinQz +=('<td class="unfinQzRt"><a href=\"'+q.url+'" class="tryagainLink">Try again?</a><!--L--><br/></span></td>');				
				            unfinQz +=('</tr>');
			               }//end if (((typeof objScore...
			     
			               break;
			    }//end switch
		       
             }//end else
		   
		     //if there IS NO countscore, or if it is 1 consider the quiz required/counted, and add quiz score to the total module score
		     //if it is 2 or 0, it does not count.
	    if ( (typeof q.countscore=="undefined")||((typeof q.countscore!="undefined")&&(q.countscore==1)) ){
			console.log('quiz: '+objectiveID+'===========');
				console.log('totalmaxRawScore= '+totalmaxRawScore+' qMax='+qMax);
				 totalmaxRawScore+=(qMax);
				 console.log('totalRawScore= '+totalRawScore+' qScore='+qScore);
				 totalRawScore +=parseInt(qScore,10);}
			//don't add objective max score and objective raw score on to totals.
		
		//if (testing){ console.log('page'+(i+1)+': typeof objStatus='+typeof objStatus+', objectiveID= '+objectiveID+' objStatus= '+objStatus+ 'q.qStatus= '+q.qStatus+', objMax= '+objMax+ ', objScore= '+objScore+ ',  qMax='+qMax+', qScore='+qScore+', totalmaxRawScore so far='+ totalmaxRawScore+', totalRawScore so far= '+ totalRawScore+', moduleStatus='+moduleStatus+ ' q.countscore='+q.countscore+' <br>');  } 
			 }//end if q.quiz  
	   }//end page loop 
	   
	    //********************Judge overall module status and total score*******//
 
	  //if the status is not incomplete
			if (moduleStatus != 'incomplete'){	  
	  //and, if there isn't a mastery score we aren't gonna bother with the scores - just set it to completed no matter what.
				if (isNaN(iMasteryScore)) { 
				    parent.SCOSetValue("cmi.core.score.raw", totalPercentScore+"" ); //send raw score
				    parent.SCOSetValue( "cmi.core.lesson_status", "completed" ); 
				alert('there is no mastery score set in MLearning. Module has been marked "complete" instead of pass/fail.');
				} 
				else { //or, if there IS a mastery score : score pass/fail
				  //first determine and then set the percent score in mlearning
				 totalPercentScore=Math.round((totalRawScore/totalmaxRawScore)*100);   
				 parent.SCOSetValue("cmi.core.score.raw", totalPercentScore+'' ); 
					 //if failed set status to failed, if passed, set it to passed.
				(iMasteryScore > totalPercentScore)?( parent.SCOSetValue( "cmi.core.lesson_status", "failed" ),moduleStatus="failed"):(parent.SCOSetValue( "cmi.core.lesson_status", "passed" ),moduleStatus="passed");//end else there IS a mastery score
				//alert('<table id="unfinQzTbl">'+unfinQz+'</table>');
				 msgWin.innerHTML +=('<div id="modStatus">This module is<br><span class="moduleStatusMsg">'+moduleStatus+'</span><hr/><br><br><ul style="padding:0px;"><li>You scored <b>' + totalRawScore+' point(s)</b> out of a possible <b>'+ totalmaxRawScore+'</b>.<br><li>Your total score for this module is <h1 style="display:inline">'+totalPercentScore+'%</h1><br> This module requires <b>'+iMasteryScore+ '%</b> to pass. <br/><span style="font-size:10px;font-style:italic;">If you wish to improve your score,<br> you may retake any quiz by clicking the button(s) below.</span></li></ul></div>' );
				 
				 
				 msgWin.innerHTML +=('<table id="unfinQzTbl">'+unfinQz+'</table>');
				 
				 msgWin.innerHTML +=('<div id="finOptions"><table><tr valign="top"><td class="StatusPageFdbk" ><a href="javascript: parent.SCOFinish();parent.data.closeIfLastSCO();"  onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage(\''+btnImg+'\',\'\',\'images/quiz/over/'+btnImg+'.jpg\',1)"><img src="images/quiz/up/'+btnImg+'.jpg" alt="close window"  width="155" height="48" border="0" name="'+btnImg+'" id="'+btnImg+'"  style="margin:12px;"/></a><p>Clicking the "Send score to MLearning" button above will finalize your score.</p></div></td></tr><tr><td style="padding-top:12px;"><div class="CertInstructions"><img src="images/quiz/certificateDiagram.jpg" width="250" id="certDiag"/></td></tr></table></div><div style=""></div>' );
				 // msgWin.innerHTML +=('' );
				
				}//end else there IS a mastery score
			}//end if moduleStatus is not incomplete
	   //moduleStatus IS incomplete: set status to incomplete and alert to missing quizzes		 
		else if(moduleStatus=='incomplete'){ 
		    parent.SCOSetValue( "cmi.core.lesson_status", "incomplete" ); 
			     
				// msgWin.innerHTML +=('<br><br><span class="moduleStatusMsg">'+moduleStatus+'</span><br>' );
				 msgWin.innerHTML +=('<br>This module is<br><span class="moduleStatusMsg">'+moduleStatus+'</span><hr/><br>' );
				 msgWin.innerHTML +=('<table id="unfinQzTbl">'+unfinQz+'</table>')
				 msgWin.innerHTML +=('<div id="unFinOptions" align="center"><h1 class="red" style="font:18px bold Verdana, Arial,Helvetica, sans-serif;">This module can not be marked <span style="color:#000;">Complete</span> until all required quiz pages are completed.</h1><a href="javascript:top.window.close();" class="closeNowLink">Close and finish later</a></div> ');
				
	
			}//end moduleStatus IS incomplete - set incomplete status in mlearning
		    
		parent.SCOCommit();//commit data to db
		 turnOffMsg(); 

	         if (testing){     
				  console.log('iMasteryScore= '+iMasteryScore);
				  console.log('moduleStatus= '+moduleStatus);
				  console.log('totalmaxRawScore= '+totalmaxRawScore);
				  console.log('totalRawScore= '+totalRawScore);
				  console.log('totalPercentScore= '+totalPercentScore);	
				}
				
				
				msgWin.style.display='block';
				progWin.style.display="none";
				 }//end if parent.APIOK();
 else { msgWin.innerHTML+=('LMS not detected');
        msgWin.style.display='block';
        }//end else
       }//end scoreQuizzes function
  
