//v. 1.0 12-13.10 emeiselm
//this is included in dummypage after the quizFunctions. It gets run on module load

//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 

//Check if there are any interactions, and if the lms is present. If not, bail out.
if ((typeof IntArray!="undefined")&& (parent.APIOK())){
	var testingInteractions = false; //turn to true to show debugging information for this script
		var suspendData = parent.SCOGetValue("cmi.suspend_data")?parent.SCOGetValue("cmi.suspend_data"):"";  
		var iMax=parseInt('0',10); //maximum points possible for this objective.
		var iScore=parseInt('0',10);//total of all points so far
		var outputWindow = document.getElementById("output")?document.getElementById("output"):document.getElementByID("content").innerHTML+=("<div id='output'><p>generated div</p></div>") ;

		//var outputWindow = parent.myStage.document.getElementById("output")?parent.myStage.document.getElementById("output"):setTimeout(parent.myStage.document.getElementById("output"),500);
	    
        var itemList = window.IntArray; //the interactions array stored in the window
		var interactionsLoaded = false;
	
	
}//end if ((typeof IntArray!="undefined")&& (parent.APIOK())
  else{ }//just continue, maybe put error alert in here?
 
 
 /*function definitions*/

function loadInteractions()
    { //read suspend data 
      var intLoaded = false;
	  var spStr = suspendData;
      var suspItms = spStr.split(","); //splits suspend data into an array of "item:ascore:atries" groups.
	  var itmData;
	                             if (testingInteractions){outputWindow.innerHTML+=('<hr>in function loadInteractions in interactions.js<hr>');}
	                             if (suspendData != ""){//then plug its values into IntArray
	      //suspItms[0] will always be empty, so skip it.
		   for (var i=1; i<suspItms.length; i++) 
		               {
						 //run thru suspendData string and split it into 3 piece arrays with each piece of data separated by a : 
					      itmData = suspItms[i].split(':');//creates a 3 piece array like this:  
						
				                  if (testingInteractions){ outputWindow.innerHTML+=('<hr>Suspend Data for '+i+'= '+itmData+'<br>'); }
						 
						 var suspItmID    = itmData[0];
						 var suspItmScore = itmData[1];
						 var suspItmTries = itmData[2];
					     var itm = itemList[suspItmID]; //itm is one item in the interactions array	
					        
					         itm.ascore=suspItmScore?parseInt(suspItmScore,10):0 ;//if there is a score stored in LMS, use it, otherwise set to 0.
					         itm.tries =suspItmTries?parseInt(suspItmTries,10):0;//if tries are stored in LMS, use it, otherwise set to 0.
							  
				            //select a message for the itm
							
							if ((itm.amax==0)&&(itm.tries==0))//recommended and incomplete
								{
									itm.msg = recommendedMsg;//mark recommended
								 }
							if ((itm.amax==0)&&(itm.tries>0)) // recommended and complete
								{ 
									itm.msg = completedMsg;//mark it completed.
								  }
									
							else if ((itm.amax>0)&&(itm.tries<itm.amax))//required and incomplete
								  {  
								 itm.msg = requiredMsg;//mark required and incomplete
								    }//end if (itm.ascore<itm.amax
							else if ((itm.amax>0)&&(itm.tries>=itm.amax)) //required and completed
								{	
								itm.msg = completedMsg;//mark complete
								 
								  }//end else	
								
			                   if (testingInteractions){outputWindow.innerHTML+=('suspItmID= '+suspItmID+', itm.ascore= '+itm.ascore+', tries= '+itm.tries+',itm.msg= '+itm.msg+' <br\/>'); }
					    }//end for (var i=1; i<suspItms.length; i++)
		 }//end if (suspendData != "")
		 
		 
		 //alert('interactions are loaded');
     interactionsLoaded = true;
	 if(testingInteractions){outputWindow.innerHTML+=('<b style="color:red">Interactions are completely loaded</b>')}
	 
	// if (testingInteractions){ alert('loaded interactions');}
	intLoaded = true;
 }//end loadInteractions  
 
 
 function saveInteractions() {
	 if (window.testingInteractions){ outputWindow.innerHTML+=('<br>in function saveInteractions<br>'); }
  //clearSuspendData();
   var theDataString = '';
   for (var k in itemList)//move through interaction array (it isn't really an array so can't use length) and build a new suspendData string to push to LMS
        { 
		  var itm = itemList[k];
		                           if (testingInteractions){ outputWindow.innerHTML+=("<br>in function saveInteractions: itm["+k+"].id:"+itm.id+"<br> msg: "+itm.msg+"<br> amax:"+itm.amax+"<br> tries: "+itm.tries+"<br>ascore"+itm.ascore+"<br>quiz: "+itm.quiz+"<br>"); }
		  theDataString += (','+itm.id+':'+itm.ascore+':'+itm.tries);
		}
		
	                               if (testingInteractions){outputWindow.innerHTML+=("<hr>in function saveInteractions: theDataString= "+theDataString+"<br>");
	                                                        outputWindow.innerHTML+=("<hr>in function saveInteractions: suspendData before saving= "+suspendData+"<br>"); }
	parent.SCOSetValue("cmi.suspend_data",theDataString);//writes to API cache only
	parent.SCOCommit();//writes to the db
	suspendData=parent.SCOGetValue("cmi.suspend_data");
	                           //   if (testingInteractions){ outputWindow.innerHTML+=("<br>in function saveInteractions: suspendData After saving= "+suspendData+"<br>"); }
 }    
   

 	

function clearSuspendData(){
	parent.SCOSetValue("cmi.suspend_data",'');
	parent.SCOSaveData();
}//end clearSuspendData(){

