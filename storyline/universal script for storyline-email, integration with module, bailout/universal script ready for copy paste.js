
 
   
//--------------------------------------------------------------------------------------------------------------------
 
/* ----- begin cut script here ---*/
 //1. test for IE 11 or other browser
 //2. if IE11, load polyfill script, then go to Main function
 //3. if other, just go to main function
 //4. test for standalone or embedded storyline.
 //5. if standalone, just load jquery external script which is needed for the email sender or other scripts that run with standalone
 //6. if embedded load all the external scripts so can do getMyData and email sender and whatever
 //7. test whether jquery actually got loaded in both cases - this tells you if things are ready. if not, wait then try again.
 //8. once jquery is found, doCustomAction - whatever it is. email sender, getMyData or whatever.

 
 //--------------------------------------------------------------------------------------------------------------------
//put a comma after each parameter EXCEPT THE LAST ONE!
var initParams = {
//-------------IF YOU ARE USING EMAIL FUNCTION ON THIS TRIGGER change sendEmail to true----------------
   sendEmail:true,
//-------------IF YOU ARE USING BAILOUT FUNCTION ON THIS TRIGGER change bailout to true----------------
   bailout:false,
//-------------IF YOU WANT IT TO SEND SCORE TO MODULE OR DO A SCORM-FINISH leave set to true-----------
   normalFinish:true,
//-------------IF YOU ARE USING EMAIL ON THIS TRIGGER FILL THIS IN WITH COURSE CODE AND TITLE----------
   coursetitle:"COMP-10050 Information Security for Michigan Medicine IT Professionals",
    //-------------CHANGE THIS TO YOUR MESSAGE----------------
    //-------------The \n creates a line-feed=, think <br>. -----------------------
    //---note: salutation is added automatically --//
   emailbody:"Here is a link to a PDF document containing links to the resources you viewed in the Information Security for Michigan Medicine IT Professionals course: https://mlearningcontent2.med.umich.edu/content/ct/COMP/COMP-10050_InformationSecurityforMMProfessionals/COMP-10500_ITSecurityPoliciesStandardsQuickRef.pdf\n\nPlease help us improve this training by taking a brief survey: https://umichumhs.qualtrics.com/jfe/form/SV_8idCDH0aTl2dRS5"
}

init(initParams);

function init(a_params) {
	
	 console.log("in init");
	 
	var sendEmail = a_params.sendEmail?a_params.sendEmail:false;
	var bailout = a_params.bailout?a_params.bailout:false;
	var coursetitle = a_params.coursetitle?a_params.coursetitle:"";
	var emailbody = a_params.emailbody?a_params.emailbody:"";  
 
  	var pathnm, filenm;
        pathnm = window.location.pathname;
        filenm = pathnm.substring(pathnm.lastIndexOf('/') + 1); 
   var moduletype = checkModuletype(filenm);
   var x_params = {
   		moduletype:moduletype,
		sendEmail:sendEmail,
		bailout:bailout,
		coursetitle:coursetitle,
		emailbody:emailbody   
  	 }
 
 	if (browserSupportsAllFeatures()) { 
        console.log('browser Supports All Features'); 
        
        main(x_params); 
         } //if it supports promises, continue to "main"
	else { //IE11 does not support promises so we have to polyfill it with a special script
       	console.log('need to load IE script'); 
       	loadIEScript('https://cdn.polyfill.io/v2/polyfill.min.js',  x_params);
       } //if not,load the polyfill script

} //end init
 
function doCustomAction(v_params){ 	
	var moduletype = (typeof v_params.moduletype!="undefined")? v_params.moduletype:"browse";
 	var sendEmail   =  v_params.sendEmail;
 	var normalFinish = v_params.normalFinish;
	var bailout     =  v_params.bailout;
	var coursetitle =  v_params.coursetitle;
	var emailbody   =  v_params.emailbody;
 
	console.log('in doCustomAction');
	/* *************this is where to drop custom code********** */
 
 	var player = GetPlayer();
	 /*examples of use: player.getVar(name);
                        player.setVar(name, value); -- this sets the value, does not create the variable if it doesn't exist
                        player.newpropertyname = value --this one allows you to create new properties on the fly
                       */ 

/*these values are needed for getMyData and also to send score by automatic email to the user */	
    var scorePoints  = player.GetVar('scorePoints'); 
    var scorePercent = player.GetVar('scorePercent'); 
    var passPercent  = player.GetVar('passPercent'); 
    var passPoints   = player.GetVar('passPoints'); 
    var maxPoints    = (scorePercent>0)?Math.round((scorePoints/scorePercent)*100):0; 
    
    
    /*  EMAIL  */
    
    //these are how to call learner data in a standalone Storyline
 //SCORM_GetStudentID();
 //SCORM_GetStudentName()
if (sendEmail) {
//debugger;
		var studentID,studentName;   
		if(moduletype=="embedded"){ 
			 studentID =  qsParm['id'];
			if((typeof studentID=="undefined")||(studentID=="")) { sendEmail=false;  }
			 studentName = qsParm['fn'];
			if((typeof studentName=="undefined")||(studentName=="")){ studentName = "";}
		}//if moduletype == "embedded"
      //if it's not embedded, it's either standalone storyline under scorm or standalone not under scorm.
		else if ( !window.SCORM_GetStudentID ) {     //check studentID is not missing for whatever reason
		   sendEmail = false;
		   }
		else {
			studentID = SCORM_GetStudentID();
			studentName = SCORM_GetStudentName();   
		} //standalone storyline

		var uniqname, idArray;
		var detailsArray = studentName.split(',');
		var lastName = detailsArray[0];
		var firstName =(detailsArray[1]).split('%20')[1];
 
		if (studentID.indexOf("_")!= -1){  //are we using scorm engine? or another LMS
			 idArray   = studentID.split('_');
			 uniqname  = idArray[1];
		 }
		else { uniqname = studentID; }
		
		var emailtext = "Hello " + firstName + ", \n\n"+emailbody;
 
   if(sendEmail){
		  jQuery.post("https://mlearningcontent2.med.umich.edu/content/ct/test/emeiselm/storyline/emailSenderPostFlexible.asp", 
			{
			   nm: firstName+" "+lastName,
			   ct: coursetitle,
			   bd: encodeURIComponent(emailtext),
			   id: uniqname
			},
 
			function(data, status){
				//alert("Data: " + data + "\nStatus: " + status);
			});
		}
}//end if (sendEmail)
 
//-------------------END EMAIL FUNCTIOn------------------------------------    
    
/* GET MY DATA */    
   
 if((moduletype=="embedded")){ 
    
    if(bailout){
			var k_params = {
				bailout:true,
				landingIndex:-1
				}	
				getMyData(k_params);  
		}
	else if(normalFinish){ 
			var m_params  = {  
				maxPoints:maxPoints,
				passPoints:passPoints,
				scorePoints:scorePoints,
				scorePercent:scorePercent,
				passPercent:passPercent
				 } 
				 getMyData(m_params);  
			}
       else { 
       		//no finishing function called 
        }
    }
 else if(moduletype=="standalone"){
	  if (confirm("You are about to exit the course!")) { 
	  //put something here - a close button that shows up or whatever makes sense
     	// player.SetVar("Exit_Course",true);  //--this does not close window but does signal to saba that it is done.
      } else {
    	console.log("User Cancelled Exit!");
      }
	}
 else{ //moduletype is "browse" meaning there is very little it can do. Maybe it can close window?
 		window.close();
 		alert('You may now close the window');
 		}
 

   }//end doCustomAction

function qs() {
		var testing = true;
		var qsP = new Object;
		var query = document.location.search.substring(1);
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			 var pos = parms[i].indexOf('=');
			if (testing){ console.log('pos= '+pos);}
		    if (pos > 0) {
				var key = parms[i].substring(0,pos);
				if (testing){ console.log('key= '+key);}
				var val = parms[i].substring(pos+1);
			if (testing){ console.log('val= '+val);}
				qsP[key] = val;				 
					 }//end if
            }//end for	
            return qsP;	
}//end function

//functions for testing for IE 11 
function browserSupportsAllFeatures() {
  return window.Promise && window.fetch;
}
//test is it standalone storyline under scorm control
function checkModuletype(filename){
	var moduletype;
	let qsParm = qs();
	//var qsParm
	
	 switch (filename)
  {
      case "index_lms.html":
         moduletype = "standalone"
        //dont' change sendEmail 
        break;
      case "story.html":
         if ((typeof qsParm['id'] != "undefined") && (typeof qsParm!="")){
           moduletype = "embedded";  //dont' change sendEmail           
          }
         else {
           moduletype= "browse";
           sendEmail = false; //shut off sendEmail;
          }//end else
        break;
       
  }//end switch
  return moduletype;
}

//loads IE script then runs "main" function  
function loadIEScript(src, b_params) {
 	var moduletype  =  b_params.moduletype;
 	var sendEmail   =  b_params.sendEmail;
 	var normalFinish = b_params.normalFinish;
	var bailout     =  b_params.bailout;
	var coursetitle =  b_params.coursetitle;
	var emailbody   =  b_params.emailbody;
 
 
  	var y_params = {
  	 	sendEmail:sendEmail,
		normalFinish:normalFinish,
		bailout:bailout,
		coursetitle:coursetitle,
		emailbody:emailbody,
		moduletype:moduletype    
 	 }
  const js = document.createElement('script');
  js.src = src;
  js.onload = function() {
  	console.log('polyfill script loaded OK');
    main(y_params);
    
  };
  js.onerror = function() {
    main(y_params, new Error('Failed to load IE polyfill script ' + src));
  };
  document.head.appendChild(js);
}//function loadIEScript

//dynamically loads scripts using Promises //IE requires polyfill script to use this
function loadScript(url) {   
			return new Promise(function(resolve, reject) {
				let script = document.createElement('script');
				script.src = url;
				script.async = false;
				script.onload = function() {
					resolve(url);
				};
				script.onerror = function() {
					reject(url);
				};
				document.body.appendChild(script);
			 });//end return new Promise
			 //debugger;
      }//function loadScript(url)      
      
function main(c_params,err) 
{ 
    var moduletype  =  c_params.moduletype;
 	var sendEmail   =  c_params.sendEmail;
 	var normalFinish = c_params.normalFinish;
	var bailout     =  c_params.bailout;
	var coursetitle =  c_params.coursetitle;
	var emailbody   =  c_params.emailbody;
 

  // Is this a standalone SCORM storyline or browse? they may need jquery but will not need any of the scorm, cookie or getMyData related scripts. all it needs is jquery, but there could be times you want to import another script, so put that here
   if((moduletype=="standalone")||(moduletype=="browse")){
       if (window.jQuery == null){
   
				let scripts = [
							'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js' 
						  ];
				let promises = [];
				//run through the array of scripts and load each one
				scripts.forEach(function(url) {
					promises.push(loadScript(url));
				});//scripts.forEach
		
				/*
				A promise is defined as an object that has a function as the value for the property then:
				.then(fulfilledHandler, errorHandler, progressHandler)
				https://gist.github.com/domenic/3889970
				*/
				Promise.all(promises).then( 	
					function(){ 
					
									var d_params = {
										moduletype:moduletype,
										sendEmail:sendEmail,
										normalFinish:normalFinish,
										bailout:bailout,
										coursetitle:coursetitle,
										emailbody:emailbody		   				 
										}	
								console.log('standalone Promise fulfilled');
								 
								testForJquery( function(){ doCustomAction(d_params) }  )
								}, 
					function(){console.log('standalone Promise failure');},
					function(){console.log('standalone Promise progress');} 
										);//end then  
               }//      if (window.jQuery == null
               
        else{ //window.jquery != null       
        	var d_params = {
							moduletype:moduletype,
							sendEmail:sendEmail,
							normalFinish:normalFinish,
							bailout:bailout,
							coursetitle:coursetitle,
							emailbody:emailbody		   				 
							}	
        	doCustomAction(d_params); 
        } // else{ //window.jquery != null
        
   	} //if(moduletype=="standalone"
   
   //Or is this an embedded storyline?	
   	 else if (moduletype=="embedded") { 	 
   	 if (window.jQuery == null){
   	    console.log('this is an embedded storyline'); //do embedded stuff   	    	
    	let scripts = [		
					'https://mlearningcontent2.med.umich.edu/content/manifests/external/storyline/js/querystring.min.js',
					'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js',
					'https://mlearningcontent2.med.umich.edu/content/manifests/external/storyline/js/cookie.min.js',
					'https://mlearningcontent2.med.umich.edu/content/manifests/external/storyline/js/jquery.storageapi.js',
					'https://mlearningcontent2.med.umich.edu/content/manifests/external/storyline/js/SCORMGeneric.js',
					'https://mlearningcontent2.med.umich.edu/content/manifests/external/storyline/js/SCORMObjectiveLogic.js',
					'https://mlearningcontent2.med.umich.edu/content/manifests/external/storyline/js/storylineHTML5.js'
				];
    	let promises = [];// save all Promises as array
	    //run through the array of scripts and load each one
	    scripts.forEach(function(url) { promises.push( loadScript(url));  });//scripts.forEach

		Promise.all(promises).then(
			 function(){  
			 			  console.log('all scripts loaded. Standalone Promise fulfilled'); 
 
						  var d_params = {
							moduletype:moduletype,
							sendEmail:sendEmail,
							normalFinish:normalFinish,
							bailout:bailout,
							coursetitle:coursetitle,
							emailbody:emailbody		   				 
							}	
						  testForJquery(function(){doCustomAction(d_params) });
					}
				).catch(function(script) { console.log(script + ' failed to load');});//end then  
	
			}//      if (window.jQuery == null
			   
			else{ //window.jquery != null
				doCustomAction(d_params)  
			} // else{ //window.jquery != null
			
    	
    	}//if (moduletype=="embedded")
     else if (moduletype=="browse"){ //moduletype=="browse"
     		console('moduletype==browse - dont do anything');
     		//are there some scripts we might want to run under browse?
      }
     else{ 
    	 	console('it is not clear what type of module this is');
    	}
    //not bothering with anything else right now - standalone non-scorm, 
 
  
 }	//main 

function testForJquery(func){
		console.log('in test for jquery');
		if (window.jQuery != null){ //if jquery IS loaded, do custom function
		   	console.log('window.$ != null');
			func();
	}
	else { 
			console.log('about to run setTimeout BBB');
			setTimeout(function(){testForJquery(func) }, 500);
			}
	
}

 // - end custom code block cut here ---//

 