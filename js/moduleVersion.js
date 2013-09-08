//v.1.1 11/24/12 emeiselm
//it checks the url for a parameter "vrsn" and sends the correct variable value 
//to the page "dummypage.htm" where it is used by the function  detArrayVrsn()
/*v 1.20 11/24/12 emeiselm */
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = parent.testing;


//Is there an lmsVersion set? (means a version was read in from the LMS)
//	if so, set the cookie if it is not set already, 
//	change the page Array

//If not,
//	is there a version parameter in the request? 
//	if so, set the cookie 
//	change the page Array
//	if scorm is active, save the new version in the lms and set lmsVersion.

//If not is there a cookie set? (need this if there is no scorm present)- person went away and came back later, probly no scorm.
//	if so, change the page Array
//	if scorm is active, save the new version in the lms and set lms version.


$(document).ready(function() {
	if(   (parent.lmsVrsn!=null)&&!isNaN(parent.lmsVrsn)   ){
  	  	$('body').append('<div id="dialog-modal" style="display:none;"></div>');
   		if(parent.justOpened){
   		if(testing){console.log('parent.lmsVrsn='+parent.lmsVrsn);}
    		$( "#dialog-modal" ).dialog({
    			close:true,
            	height: 140,
           		//autoOpen:false,
           		 modal: true
       	 	});//$( "#dialog-modal" )
    	}//if(parent.justOpen
    }//if(zLmsVrsn)
    $("#dialog-modal").html("<div><img src='images/ajax-loader.gif' /></div>");
    //$("#dialog-modal").hide();   
 });

function openModalDialog(){
	$("#dialog-modal").dialog("open");
}
function closeModalDialog(){
	if(testing){console.log('BBf in function closeModalDialog');}
	$('#dialog-modal').dialog('close');
}


   
function setVrsn(){
   	
   	//set some variables
	var zVrsn = 	qsParm['vrsn'] ? qsParm['vrsn'] : null;
	var zLmsVrsn = 	(parent.lmsVrsn && !isNaN(parent.lmsVrsn) ) ? parent.lmsVrsn : null;
	var zCookieVrsn = ReadCookie('cVrsn');
	if(testing){console.log('EEE zVrsn='+zVrsn+' zLmsVrsn='+zLmsVrsn+ ' zCookieVrsn='+zCookieVrsn)}
	
	 

//Was it just opened AND there an lmsVersion set? (means a version was read in from the LMS)
 	if((parent.justOpened)&&(zLmsVrsn)){
 		openModalDialog();	
 	    if(testing){console.log('BBb zLmsVrsn='+zLmsVrsn);}
 		//if so, set the cookie if it is not set already, 
 		if(testing){console.log('FFF ReadCookie(cVrsn)='+ReadCookie('cVrsn')+' zLmsVrsn='+zLmsVrsn)}  
 		if(ReadCookie('cVrsn')!=zLmsVrsn){ 
				if(testing){console.log('BBd about to set cookie');}	
				SetCookie('cVrsn',zLmsVrsn,1);
				zCookieVrsn = ReadCookie('cVrsn');
				if(testing){console.log('BBa zCookieVrsn is now '+zCookieVrsn);}				 				
			}//	end if(ReadCookie(cVrsn)!=zLmsVrsn
 		 setTimeout('parent.data.detArrayVrsn('+zLmsVrsn+')',1000);
 		
 	}//	end if(zLmsVrsn)


//If not, is there a version parameter in the request?	
 	else if(zVrsn!=null){
 		 
		  if(testing){console.log('BBC');}
 		if(zCookieVrsn!=zVrsn) {//does the version param match the currently set cookie, if any?
 		//	if not, set the cookie, if it needs it
 			if(testing){console.log('BBe about to set cookie');}	
 			SetCookie('cVrsn',zVrsn,1);
 			parent.SCOSetObjectiveData("version","score.raw",zVrsn);
 			zCookieVrsn = ReadCookie('cVrsn');
 			parent.lmsVrsn = zVrsn;
 			zLmsVrsn = zVrsn;
 			if(testing){console.log('BBe zCookieVrsn is now'+zCookieVrsn);}
 		//	change the page Array
 			 setTimeout('parent.data.detArrayVrsn('+zVrsn+')',1000);		
 		}//end if(zCookieVrsn!=zVrsn) 
 		 
 	}//end 	else if(zVrsn!=null)
	
	//if there is no version set, just close the loading message.
	else{  
	if(testing){console.log('no version was set');}
	 parent.SetCookie('cVrsn',"",-1);  
	}
}//end function setVrsn() 
 
setVrsn(); 


 
 
 
 
 