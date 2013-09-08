//v 1.4 11-24-012 emeiselm
//if we aren't in SCORM mode, and this page is not in a frame, open the frameset, and add the current location to the query string.
 function wrapMe(){ //this gets called by each content page to check if it is wrapped or not.
			if (self.location.href == top.location.href){
			   top.location.href = 'index.htm?zurl=' + self.location.href;			   
			}
 }
 
