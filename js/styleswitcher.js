/*v 1.1 8-7-2007*/
/***********************************************
* Different CSS depending on OS (mac/pc)- © Dynamic Drive (www.dynamicdrive.com)
* This notice must stay intact for use
* Visit http://www.dynamicdrive.com/ for full source code
***********************************************/

///var csstype="external" //Specify type of CSS to use. "Inline" or "external"

//var mac_css='body{font-size: 14pt; }' //if "inline", specify mac css here
//var pc_css='body{font-size: 12pt; }' //if "inline", specify PC/default css here
var detect = navigator.userAgent.toLowerCase();
var screen_height = screen.height;
if(document.all && !document.getElementById) {
    document.getElementById = function(id) {
         return document.all[id];
    }
}

function checkIt(string) {
	place = detect.indexOf(string) + 1;
	thestring = string;
	return place;
  }
  //first check if the screen resolution is very low - we will assume that is an old pc and style accordingly).
// alert(screen_height);
 if (screen.height < 600) {
//document.write('<link rel="stylesheet" type="text/css" href="css/styles800x600.css">');
//do nothing! commenting this out for now - it is causing problems - emeiselm 08-07-07
} 
//then check if the machine is a Mac - most mac users will be using safari or netscape and a reasonably high resolution.
else if (checkIt('mac')) { 
	OS = "Mac";
	document.write('<link rel="stylesheet" type="text/css" href="css/stylesMac.css"' + '">');
}
//11.6.05 - removing this style sheet, will put the IE styles into allbrowsers.css and modify them for safari and Firefox and small screens.  
//if not, is the browser IE? IE understands various styles differently than other browser.
else if (checkIt('msie')) {
browser = "Internet Explorer";
	//document.write('<link rel="stylesheet" type="text/css" href="css/styles.css">')

}
//OK, if not any of those, it's probably NS or Firefox on a PC or Konqueror or Mozilla or Firefox on linux. The mac styles should work pretty well.
else {
	document.write('<link rel="stylesheet" type="text/css" href="css/stylesMac.css"' + '">');
}



