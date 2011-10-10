//v.1.0 10/16/2007
//this gets included in "index.htm"
//it checks the url for a parameter "vrsn" and sends the correct variable value to the page "dummypage.htm" where it is used by the function  detArrayVrsn()
 
var cookieVrsn;
    
function setVrsn(){//sets cookie and persistent variable to correct version
	     zVrsn=qsParm['vrsn'];//get the parameter vrsn from the url
	 //"vrsn" parameter WAS specified 
   if (qsParm['vrsn']!=null){	  
        if(cookieVrsn!=zVrsn){ // and, if the current variable cookievrsn1 doesn't equal the parameter 'vrsn'	        
            SetCookie('cVrsn',zVrsn,1);//set the cookie cVrsn to whatever the new version is supposed to be
            cookieVrsn=ReadCookie('cVrsn');//set cookieVrsn1 to that version also	  
			return cookieVrsn;
			
			}//end if cookieVrsn1!
	  
	  //"vrsn" parameter WAS NOT specified
	 else if (qsParm['vrsn']==null){ //but if there is no param vrsn we want to use the default array so set to 1
	   if ((cookieVrsn!=null)&&(cookieVrsn!="undefined")&&(cookieVrsn!="")&&(cookieVrsn>1)){//and if current var was not yet set to 1
			 cookieVrsn=null; //set the var to 1
			 SetCookie('cVrsn',"",-1);//and expire the cookie
						} //end if ((cookieVrsn1
 	 }//end else if(qsParm
   }//end if (qsParm[v
}//end function detrmnVrsn

setVrsn();

  


  
