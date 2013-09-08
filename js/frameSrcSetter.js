//v 1.0 11.27.12 emeiselm
function setFrameSrc() {	//this gets called on the index page
   	var zurl=(qsParm['zurl']); 
   	if(zurl){	//if a new url is specified (zurl parameter in query string)... 
		document.writeln('<frameset rows=\"100%,*\" id=\"moduleFrameset\" onunload=\"completeIfLastPage()\" onbeforeunload=\"completeIfLastPage()\"  >');
		document.writeln('<frame name=\"myStage\" id=\"myStage\" src=\"'+zurl+'\" \/>');
		document.writeln('<frame name=\"data\" id=\"data\" src=\"includes/dummypage.htm\" \/>');
		document.writeln('<noframes>');
		document.writeln('<body>');
		document.writeln('<p>Note that this site requires a browser that supports frames.<\/p>');
		document.writeln('<\/body>');
		document.writeln('<\/noframes>');
		document.writeln('<\/frameset>'); 
	}//end if(zurl)
}//end setFrameSrc


