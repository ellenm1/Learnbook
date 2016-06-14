//v. 1.0 12-13.10 emeiselm
//this is included in dummypage after the quizFunctions. It gets run on module load
//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = true; //turn to true to show debugging information for this script
//Check if there are any interactions, and if the lms is present. If not, bail out.

  
//read suspend data 
function loadInteractions(wipeInteractions)
{ 
   if ( (trackingmode == "scorm")&&APIOK() ){ 		//if using scorm, and we can find the api, look for an interactions array...
   
   	var interactionsLoaded = false;
	
    //there is only one interactions array. if there are extra interctions in the array left over from earlier versions, it should not hurt anything, I think.
   //so it is ok to load the old array and simply edit it and put it back. Items that have not changed that are not being used will just sit there.
   
   if (typeof IntArray!="undefined"){ 	//if there is an interactions array...
		if(testing){console.log('JKFF IntArray exists')}
		 
		if(ns.localStorage.isSet('interactionsArray') ){ ints = ns.localStorage.get('interactionsArray');}	//if there is an interactions array section in local storage, use it
		
		else {	//if no interactions in localStorage yet, create the interactionsArray section in localStorage. put "IntArray" from pageArray.js into local storage 																						
			if(testing){console.log('JKEL IntArray exists, and ns.localStorage.isSet(interactionsArray) is false')}
			ns.localStorage.set('interactionsArray',IntArray);
			ints=ns.localStorage.get('interactionsArray');
			loadInteractions();
			interactionsLoaded = true
		}	//end else
	}//end 	if ((typeof IntArray!="undefined")&&(APIOK() 
 		
		//if(typeOf wipeInteractions !="undefined" && wipeInteractions==true){
			//do not load ints_ string from suspendData
		
		//}
		
		  
		 
		var suspendData =SCOGetValue("cmi.suspend_data")?SCOGetValue("cmi.suspend_data"):"";
		
		var startInts =  suspendData.indexOf('Ints_');
    	var endInts   =  suspendData.indexOf('_Ints'); 
    	var suspendInteractionsString = (startInts!=-1)?suspendData.substring(startInts,endInts):"";
    	
    	 
		//var interactionsDataFromLMS = end!="0"?suspendData.substring(start+5,end):"";//Ints_ is 5 characters. String starts from after the underscore. If there were no Ints_ in the data yet, the string will be empty.
		var itmData;
		
		
		if (testing){console.log('in interactions.js loadInteractions: suspendInteractionsString= '+suspendInteractionsString+'suspendInteractionsString.length='+suspendInteractionsString.length)}
		if (testing){console.log('ints= '+ints)}//"is" appears to be a reserved word  - not sure where, so am using ints instead of is which would be more consistent with ps and ms
		if (testing){console.log('<hr>in function loadInteractions in interactions.js<hr>');}
		
		
		if(suspendInteractionsString.length>0){	//if there IS suspend data need to load it and use it
			var suspItms = suspendInteractionsString.split(","); //splits suspend data into an array of "item:ascore:atries" groups.
		   
		  
			//then plug suspend data values into local version of interactionsarray "ints"
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
		else{   //there was no suspend data, so just load correct messages:
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
			
			var newstr = "Ints_"+ints+"Ints";
			//if start==-1 there were no Ints in suspendData previously so need to add Ints_.._Ints bookends.
			//var newSuspendData = (startInts ==-1)?suspendData+newstr:(suspendData.replace(/(Ints_)(.+?)(?=_Ints)/, "$1 "+ints))//Dont want to do this yet.
			
			 
			//SCOSetValue("cmi.suspend_data", newSuspendData);//Dont want to do this yet.
			//SCOCommit;//Dont want to do this yet.
			//now store revised version of "ints" in localStorage "interactionsArray" 
			ns.localStorage.set('interactionsArray',ints);	//write "ints" all back to interactionsArray in local storage
	 
		
			
		}//end else
		 
			
		interactionsLoaded = true;
		//intLoaded = true;
		if(testing){console.log('Interactions are completely loaded')}	
		
	}//end if ((trackingmode == "scorm")&&APIOK()){ 
 }//end loadInteractions  
 
 
function saveInteractions(){ 	//construct a data string from the current list of interactions
	var suspendData = SCOGetValue('cmi.suspend_data');
	if (testing){console.log('in function saveInteractions'); }
   
  	var theDataString = '';
  	//move through interaction array (it isn't really an array so can't use length) and build a new suspendData string to push to LMS
   	for (var k in ints){ 
		var itm = ints[k];
		theDataString += (','+itm.id+':'+itm.ascore+':'+itm.tries);
		
		if (testing){console.log("\n in function saveInteractions: itm["+k+"].id:"+itm.id+"\n msg: "+itm.msg+"<br> amax:"+itm.amax+"\n tries: "+itm.tries+"\n ascore"+itm.ascore+"\nquiz: "+itm.quiz+"\n"); }	
		if (testing){console.log("\n in function saveInteractions: theDataString= "+theDataString+"\n");}
	}
		
	//(fixed 5-28-16) bug - needs to be fixed, this will wipe out other data if we are storing that  - need to fix! 
	var newSuspendStr;
	
	if(suspendData.indexOf('Ints_')==-1){
		//means there were no interactions in suspendData. just append prefixed String to suspendData.
			 newSuspendStr = suspendData+'Ints_'+theDataString+'_Ints'; 
		}
	else{ //there was Ints data already in suspendData, so just replace it.
		newSuspendStr = suspendData.replace(/(Ints_)(.+?)(?=_Ints)/, "$1 "+theDataString)
		}  
	
	SCOSetValue("cmi.suspend_data",newSuspendStr);//writes to API cache only
	SCOCommit();//writes to the db
	var updatedSuspendData=SCOGetValue("cmi.suspend_data");
	if(testing){console.log('FIGH newSuspendData='+updatedSuspendData)}
 }    
   

 	

function clearSuspendData(){ //just a utility function to clear all if needed
	SCOSetValue("cmi.suspend_data",'');
	SCOSaveData();
}//end clearSuspendData(){

