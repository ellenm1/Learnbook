//v 1.3 1-8-08 emeiselm
//if we aren't in SCORM mode, and this page is not in a frame, open the frameset, and add the current location to the query string.
 function wrapMe(){ //this gets called by each content page to check if it is wrapped or not.
            //alert('running wrapMe()');
			//if (!parent.APIOK()&&(self.location.href == top.location.href)) { 
			 if (self.location.href == top.location.href){
			   top.location.href = 'index.htm?zurl=' + self.location.href;			   
			}
 }
 
 
function setFrameSrc() {	//this gets called on the index page
justOpened=0;
   var zurl=(qsParm['zurl']); 
   if(zurl){	//if a new url is specified (zurl parameter in query string)...

//add something to check that the page is indeed part of the page array of the current version.
				
				//self.html.innerHTML=(''); //wipe out the html on index.htm and replace with...
					document.writeln('<frameset rows=\"100%,*\" id=\"moduleFrameset\" onunload=\"completeIfLastPage()\" onbeforeunload=\"completeIfLastPage()\"  >');
					document.writeln('<frame name=\"myStage\" id=\"myStage\" src=\"'+zurl+'\" \/>');
					document.writeln('<frame name=\"data\" id=\"data\" src=\"includes/dummypage.htm\" \/>');
					document.writeln('<noframes>');
					document.writeln('<body>');
					document.writeln('<p>Note that this site requires a browser that supports frames.<\/p>');
					document.writeln('<\/body>');
					document.writeln('<\/noframes>');
					document.writeln('<\/frameset>'); 
				  }//end if(!parent.APIOK())
}//end setFrameSrc




