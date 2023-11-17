/* uncomment the script below by removing the marked lines to cause an email to be sent upon clicking the final green button in the module. */



/* REMOVE this line to enable script AND remove the ending comment mark also.




$("#content").on('mousedown', '.finalCompleteButton', function(){
    // what you want to happen when mouseover and mouseout 
    // occurs on elements that match '.dosomething'
    //$(staticAncestors).on(eventName, dynamicChild, function() {});
    sendEmail();
});


function sendEmail(){
//debugger;
	 var uniqname, studentID, studentName, lastName, firstName, coursetitle, emailbody, detailsArray, idArray, params;
 	 //make your changes to the course title and email text here:
 	 coursetitle = "ICEX-10250 High Level Disinfection"; 
	 emailbody = "Here is a link to a PDF document containing links to all of the resources you viewed in the HLD course as well as a link you can use to review the course in a review, non-assessed mode:\n\n https://mlearningcontent2.med.umich.edu/content/ct/icex/ICEX-10250_HighLevelDisinfection/media/ICEX10250HLDElearningResourceLinks.pdf";
     studentID =   sName;
	 studentName = sDetails;
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

REMOVE this line */