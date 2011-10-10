//v.1.3 07-10-08
// this uses the module version set by "setVersn()" to choose a PageArray, redraw the navbar and go to the appropriate page

var cookieVrsn=parent.ReadCookie('cVrsn');
var zVrsn1=parent.zVrsn;
 
 function detArrayVrsn(){//this is included in dummypage.htm and uses cookieVrsn to set the correct PageArray.
//if a cookie exists and it does not equal 1
  if ((cookieVrsn!=null)&&(cookieVrsn!="undefined")&&(cookieVrsn!="")&&(cookieVrsn>1)){//if cookieVrsn exists and is > 1
 	 //set PageArray to whichever PageArray matches that number
	 window.PageArray=window['PageArray'+cookieVrsn];//use square bracket notation to generate Page array name from string + variable  
	 }//end if
	 else { //else use the default one
	  window.PageArray=window['PageArray'];
	   parent.SetCookie('cVrsn',"",-1);//expire the cookie
	
	  }//end else
	
 	
 if ((parent.justOpened==1)&&(parent.myStage.location.href!=PageArray[0].url)){ //if module was just opened
	parent.myStage.location.href = parent.zurl?parent.zurl:('../'+PageArray[0].url); //change this page to the first page of the correct pageArray
	 parent.justOpened=0;//so it won't keep switching pages to page[0].	 
  }//end if
}//end function detArrayVrsn

	detArrayVrsn();