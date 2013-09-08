//v. 1.0 12-13.10 emeiselm
//this is included in dummypage after the quizFunctions. It gets run on module load
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = parent.testing; //turn to true to show debugging information for this script
//Check if there are any interactions, and if the lms is present. If not, bail out.
if ((typeof IntArray!="undefined")&&(parent.APIOK())){
	var suspendData = parent.SCOGetValue("cmi.suspend_data")?parent.SCOGetValue("cmi.suspend_data"):"";  
	var iMax=parseInt('0',10); //maximum points possible for this objective.
	var iScore=parseInt('0',10);//total of all points so far	    
    var itemList = window.IntArray; //the interactions array stored in the window
	var interactionsLoaded = false;		
}//end if ((typeof IntArray!="undefined")&& (parent.APIOK())
else{if (testing){console.log('AFF.00')} }//just continue, maybe put error alert in here?
 
 
//read suspend data 
function loadInteractions()
{ 
   	// var intLoaded = false;
	var spStr = suspendData;
	if (testing){console.log('suspendData= '+suspendData+'suspendData.length='+suspendData.length)}
	if (testing){console.log('IntArray= '+IntArray)}
    var suspItms = spStr.split(","); //splits suspend data into an array of "item:ascore:atries" groups.
	var itmData;
	if (testing){console.log('<hr>in function loadInteractions in interactions.js<hr>');}
	if(suspendData.length!=0){
	//if((suspendData != "")&&(suspendData.length!=0)){
	    //then plug its values into IntArray
	    //suspItms[0] will always be empty, so skip it.
	    if (testing){console.log('AAE.00')}
		for (var i=1; i<suspItms.length; i++){
			//run thru suspendData string and split it into 3 piece arrays with each piece of data separated by a : 
			itmData = suspItms[i].split(':'); 						
			if (testing){console.log('<hr>Suspend Data for '+i+'= '+itmData+'<br>'); }						 
			var suspItmID    = itmData[0];
			var suspItmScore = itmData[1];
			var suspItmTries = itmData[2];
			var itm = itemList[suspItmID]; //itm is one item in the interactions array						        
			itm.ascore=suspItmScore?parseInt(suspItmScore,10):0 ;//if there is a score stored in LMS, use it, otherwise set to 0.
			itm.tries =suspItmTries?parseInt(suspItmTries,10):0;//if tries are stored in LMS, use it, otherwise set to 0.
			if (testing){console.log('AAE suspItmID= '+suspItmID+', itm.ascore= '+itm.ascore+', tries= '+itm.tries+',itm.msg= '+itm.msg+' itm.amax='+itm.amax); }				  
			//select a message for the itm
			//recommended and incomplete				
			if((itm.amax==0)&&(itm.tries==0)){
				itm.msg = recommendedMsg; 
				if (testing){console.log('AAE.1')}
			} 
			// recommended and complete
			if ((itm.amax==0)&&(itm.tries>0)){ 
				itm.msg = completedMsg; 
				if (testing){console.log('AAE.2')}
			}			
			//required and incomplete 	//mark required and incomplete					
			else if((itm.amax>0)&&(itm.tries<itm.amax)){
				itm.msg = requiredMsg;
				if (testing){console.log('AAE.3')}
			}//end if (itm.ascore<itm.amax			
			//required and completed //mark complete	
			else if((itm.amax>0)&&(itm.tries>=itm.amax)){	
					itm.msg = completedMsg;	
					if (testing){console.log('AAE.4')}			 
			}//end else												
		}//end for (var i=1; i<suspItms.length; i++)
		if (testing){console.log('AAE.5')}
	}//end if (suspendData != "")		 
	else{
		if (testing){console.log('ABA.00')}
		//no suspend data, so just load correct messages:
		//select a message for the itm
			if (testing){console.log('ABA.0')}
		for (var g in IntArray){
			var itm = IntArray[g];
			if (testing){console.log('ABA.01 itm.amax='+itm.amax+'itm.tries'+itm.tries)}
			 
			if (testing){console.log('itm.amax='+itm.amax+', itm.ascore='+itm.ascore+'itm.tries='+itm.tries+'itm.msg='+itm.msg)}
		 
				//recommended and incomplete				
				if((itm.amax==0)&&(itm.tries==0)){
					itm.msg = recommendedMsg;
					if (testing){console.log('ABA.1')} 
				}
				// recommended and complete
				if ((itm.amax==0)&&(itm.tries>0)){ 
					itm.msg = completedMsg;  
					if (testing){console.log('ABA.2')}
				}
				
				//required and incomplete 	//mark required and incomplete					
				else if((itm.amax>0)&&(itm.tries<itm.amax)){
					itm.msg = requiredMsg;
					if (testing){console.log('ABA.3')}
				}//end if (itm.ascore<itm.amax
				
				//required and completed //mark complete	
				else if((itm.amax>0)&&(itm.tries>=itm.amax)){	
						itm.msg = completedMsg;
						if (testing){console.log('ABA.4')}				 
				}//end else	if
				else{ 				
					itm.msg = requiredMsg; 
					if (testing){console.log('ABA.5+ itm.msg ='+itm.msg)}
					//not sure which message to put here
					}
				if (testing){console.log('ABA.6')}	
			if (testing){console.log('ABA.7')}	
		}//end for(var g
			
 
	
		
	}
	 
		
    interactionsLoaded = true;
    //intLoaded = true;
	if(testing){console.log('<b style="color:red">Interactions are completely loaded</b>')}	 	
 }//end loadInteractions  
 
 
function saveInteractions(){
	if (window.testing){console.log('<br>in function saveInteractions<br>'); }
  	//clearSuspendData();
  	var theDataString = '';
  	//move through interaction array (it isn't really an array so can't use length) and build a new suspendData string to push to LMS
   	for (var k in itemList){ 
		var itm = itemList[k];
		if (testing){console.log("<br>in function saveInteractions: itm["+k+"].id:"+itm.id+"<br> msg: "+itm.msg+"<br> amax:"+itm.amax+"<br> tries: "+itm.tries+"<br>ascore"+itm.ascore+"<br>quiz: "+itm.quiz+"<br>"); }
		theDataString += (','+itm.id+':'+itm.ascore+':'+itm.tries);
	}		
	if (testing){console.log("<hr>in function saveInteractions: theDataString= "+theDataString+"<br>");}	                                                        
	parent.SCOSetValue("cmi.suspend_data",theDataString);//writes to API cache only
	parent.SCOCommit();//writes to the db
	suspendData=parent.SCOGetValue("cmi.suspend_data");
	//   if (testing){ outputWindow.innerHTML+=("<br>in function saveInteractions: suspendData After saving= "+suspendData+"<br>"); }
 }    
   

 	

function clearSuspendData(){
	parent.SCOSetValue("cmi.suspend_data",'');
	parent.SCOSaveData();
}//end clearSuspendData(){

