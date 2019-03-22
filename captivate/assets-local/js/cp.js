
/*captivate 9 does a poor job of escaping custom scripts that are in a script window, which causes them to error out,
 so put scripts into this external page and call them this way: 
 in the first slide, select the slide itself, and open the Properties panel for the slide. 
 --Click the Actions tab and select On Enter > Execute Javascript.
 --In the script window, paste this code.
		 
		 var urlstr = "../assets-local/js/cp.js";
			  urlstr = "<script src="+urlstr+"></script>";
		$("body").append(urlstr);
--Make sure this cp.js file is in the /captivate/assets-local/js/ folder.
 */ 
function sendEmail(){
//debugger;
	 var uniqname, studentID, studentName, lastName, firstName, coursetitle, emailbody, detailsArray, idArray, params;
 	 //make your changes to the course title and email text here:
 	 coursetitle = "ICEX-10250 High Level Disinfection"; 
	 emailbody = "Here is a link to a PDF document containing links to all of the resources you viewed in the HLD course as well as a link you can use to review the course in a review, non-assessed mode:\n\n https://mlearningcontent2.med.umich.edu/content/ct/icex/ICEX-10250_HighLevelDisinfection/media/ICEX10250HLDElearningResourceLinks.pdf";
     studentID =   typeof  qsParm['id']!="undefined"?qsParm['id']:SCORM_GetStudentID();
	 studentName = typeof qsParm["fn"]!="undefined"?qsParm["fn"]:SCORM_GetStudentName();
	 detailsArray = studentName.split(",");
     lastName = detailsArray[0];
	 
 
	 if( detailsArray[1].indexOf("%20")!= -1){
		firstName =(detailsArray[1]).split("%20")[1];
		}
	 else {firstName = detailsArray[1]}

	 if (studentID.indexOf("_")!= -1){  
		idArray   = studentID.split("_");
		uniqname  = idArray[1];	
	}
	
	else { uniqname = studentID; }
	params = {
		ct:coursetitle,
		bd:emailbody,
		un:uniqname,
		fn:firstName,
		ln:lastName
	}
	postEmail(params);
}

function postEmail(params){
	 var firstName = (typeof params.fn!="undefined")? params.fn:"";	 
	 var lastName = (typeof params.ln!="undefined")? params.ln:"";	 
	 var coursetitle = (typeof params.ct!="undefined")? params.ct:"";
	 var emailbody = (typeof params.bd!="undefined")? params.bd:"";
	     emailbody = "Hello " + firstName + ", \n\n"+emailbody;
	 var uniqname = (typeof params.un!="undefined")? params.un:null;
	
	 
	$.post("https://mlearningcontent2.med.umich.edu/content/ct/test/emeiselm/storyline/emailSenderPostErrorChecking.asp",
       {
       nm: firstName+" "+lastName,
       ct: coursetitle,
       bd: encodeURIComponent(emailbody),
       id: uniqname
      });
 
  //  function(data, status){alert("Data: " + data + "\nStatus: " + status);});
}//end function sendEmail()

console.log('cp.js loaded'); 
 

//debugger;
//# sourceURL=../assets-local/js/cp.js