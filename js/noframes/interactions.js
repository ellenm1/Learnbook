//v. 1.0 12-13.10 emeiselm
//this is included in dummypage after the quizFunctions. It gets run on module load
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
//var testing = false; //turn to true to show debugging information for this script
//Check if there are any interactions, and if the lms is present. If not, bail out.



 
 
//read suspend data 
function loadInteractions()
{ 
   if ( (trackingmode == "scorm")&&APIOK() ){ 		//if using scorm, and we can find the api, look for an interactions array...
   var interactionsLoaded = false;
   
   if (typeof IntArray!="undefined"){ 	//if there is an interactions array...
		if(testing){console.log('JKFF IntArray exists')}
		
		if(ns.localStorage.isSet('interactionsArray') ){ ints = ns.localStorage.get('interactionsArray');}	//if there is an interactions array section in local storage, use it
		
		else {	//if no interactions in local storage, put the data from the js-file based IntArray into local storage																							
			if(testing){console.log('JKEL IntArray exists, and ns.localStorage.isSet(interactionsArray) is false')}
			ns.localStorage.set('interactionsArray',IntArray);
			ints=ns.localStorage.get('interactionsArray');
			loadInteractions();
			interactionsLoaded = true
		}	//end else
	}//end 	if ((typeof IntArray!="undefined")&&(APIOK() 

   
   
		// var intLoaded = false;
		var suspendData =SCOGetValue("cmi.suspend_data")?SCOGetValue("cmi.suspend_data"):"";
		var spStr = suspendData;
		var itmData;
		
		if (testing){console.log('in interactions.js loadInteractions: suspendData= '+suspendData+'suspendData.length='+suspendData.length)}
		if (testing){console.log('ints= '+ints)}//"is" appears to be a reserved word  - not sure where, so am using ints instead of is
		//var suspItms = spStr.split(","); //splits suspend data into an array of "item:ascore:atries" groups.
		
		
		if (testing){console.log('<hr>in function loadInteractions in interactions.js<hr>');}
		
		if(suspendData.length!=0){	//if there IS suspend data...
			var suspItms = spStr.split(","); //splits suspend data into an array of "item:ascore:atries" groups.
		   
		  
			//then plug suspend data values into local storage interactionsarray
			//suspItms[0] will always be empty, so skip it.
			if (testing){console.log('AAE.00')}
			for (var m=1; m<suspItms.length; m++){
				//run thru suspendData string and split it into 3 piece arrays with each piece of data separated by a : 
				itmData = suspItms[m].split(':'); 						
				if (testing){console.log('<hr>Suspend Data for '+i+'= '+itmData+'<br>'); }						 
				var suspItmID    = itmData[0];
				var suspItmScore = itmData[1];
				var suspItmTries = itmData[2];
				var itm = ints[suspItmID]; //itm is one item in the local storage interactions array						        
				
				itm.ascore=suspItmScore?parseInt(suspItmScore,10):0 ;//if there is a score stored in LMS, use it, otherwise set to 0.
				itm.tries =suspItmTries?parseInt(suspItmTries,10):0;//if tries are stored in LMS, use it, otherwise set to 0.
				if (testing){console.log('AAE suspItmID= '+suspItmID+', itm.ascore= '+itm.ascore+', tries= '+itm.tries+',itm.msg= '+itm.msg+' itm.amax='+itm.amax); }				  
				//select a message for the itm
				//recommended and incomplete				
				if((itm.amax==0)&&(itm.tries==0)){
					itm.msg = typeof recommendedMsg!="undefined"?recommendedMsg:'Recommended'; 
					if (testing){console.log('AAE.1')}
				} 
				// recommended and complete
				if ((itm.amax==0)&&(itm.tries>0)){ 
					itm.msg = typeof completedMsg!="undefined"?completedMsg:'Completed'; 
					if (testing){console.log('AAE.2')}
				}			
				//required and incomplete 	//mark required and incomplete					
				else if((itm.amax>0)&&(itm.tries<itm.amax)){
					itm.msg = typeof requiredMsg!="undefined"?requiredMsg:'Must be completed to finish module';
					if (testing){console.log('AAE.3')}
				}//end if (itm.ascore<itm.amax			
				//required and completed //mark complete	
				else if((itm.amax>0)&&(itm.tries>=itm.amax)){	
						itm.msg = typeof completedMsg!="undefined"?completedMsg:'Completed'; 
						if (testing){console.log('AAE.4')}			 
				}//end else												
			}//end for (var i=1; i<suspItms.length; i++)
			if (testing){console.log('AAE.5')}
			//write the "is" data back to localStorage
			ns.localStorage.set('interactionsArray',ints);	//write it all back to interactionsArray in local storage
		}//end if (suspendData != "")		 
		else{   //no suspend data, so just load correct messages:
			if (testing){console.log('ABA.00')}
			
			//select a message for the itm
				//if (testing){console.log('ABA.0')}
			for (var g in ints){
				var itm = ints[g];
				if (testing){console.log('ABA.01 itm.amax='+itm.amax+', itm.ascore='+itm.ascore+'itm.tries='+itm.tries+'itm.msg='+itm.msg)}
			 
					//recommended and incomplete				
					if((itm.amax==0)&&(itm.tries==0)){
						itm.msg = typeof recommendedMsg!="undefined"?recommendedMsg:'Recommended'; 
						if (testing){console.log('ABA.1')} 
					}
					// recommended and complete
					else if ((itm.amax==0)&&(itm.tries>0)){ 
						itm.msg = typeof completedMsg!="undefined"?completedMsg:'Completed';
						if (testing){console.log('ABA.2')}
					}
					
					//required and incomplete 	//mark required and incomplete					
					else if((itm.amax>0)&&(itm.tries<itm.amax)){
						itm.msg = typeof requiredMsg!="undefined"?requiredMsg:'Must be completed to finish module';
						if (testing){console.log('ABA.3')}
					}//end if (itm.ascore<itm.amax
					
					//required and completed //mark complete	
					else if((itm.amax>0)&&(itm.tries>=itm.amax)){	
							itm.msg = typeof completedMsg!="undefined"?completedMsg:'Completed'; 
							if (testing){console.log('ABA.4')}				 
					}//end else	if
					else{ 				
						itm.msg = typeof requiredMsg!="undefined"?requiredMsg:'Must be completed to finish module';
						if (testing){console.log('ABA.5+ itm.msg ='+itm.msg)}
						//not sure which message to put here
						}
					if (testing){console.log('ABA.6 finished with if/else')}
						
			}//end for(var g
			
			ns.localStorage.set('interactionsArray',ints);	//write it all back to interactionsArray in local storage
	 
		
			
		}//end else
		 
			
		interactionsLoaded = true;
		//intLoaded = true;
		if(testing){console.log('Interactions are completely loaded')}	
		
	}//end if ((trackingmode == "scorm")&&APIOK()){ 
 }//end loadInteractions  
 
 
function saveInteractions(){ 	//construct a data string from the current list of interactions
	if (testing){console.log('<br>in function saveInteractions<br>'); }
   
  	var theDataString = '';
  	//move through interaction array (it isn't really an array so can't use length) and build a new suspendData string to push to LMS
   	for (var k in ints){ 
		var itm = ints[k];
		theDataString += (','+itm.id+':'+itm.ascore+':'+itm.tries);
		
		if (testing){console.log("<br>in function saveInteractions: itm["+k+"].id:"+itm.id+"<br> msg: "+itm.msg+"<br> amax:"+itm.amax+"<br> tries: "+itm.tries+"<br>ascore"+itm.ascore+"<br>quiz: "+itm.quiz+"<br>"); }	
		if (testing){console.log("<hr>in function saveInteractions: theDataString= "+theDataString+"<br>");}
	}		
	
	SCOSetValue("cmi.suspend_data",theDataString);//writes to API cache only
	SCOCommit();//writes to the db
	suspendData=SCOGetValue("cmi.suspend_data");	
 }    
   

 	

function clearSuspendData(){
	SCOSetValue("cmi.suspend_data",'');
	SCOSaveData();
}//end clearSuspendData(){

