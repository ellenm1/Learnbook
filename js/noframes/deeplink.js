 var url,filename;
	function getFileName() {
		//this gets the full url
			url = document.location.href;
		//this removes the anchor at the end, if there is one
			url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
		//this removes the query after the file name, if there is one
		url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
		//this removes everything before the last slash in the path
		filename = url.substring(url.lastIndexOf("/") + 1, url.length);
		return filename;
	}
	getFileName();
 
	if(filename!="index.htm"){ 
			//if (navigator.userAgent.indexOf("Googlebot")==-1){
		if (navigator.userAgent.indexOf("gsa-crawler")==-1){//this is not the gsa, so execute the deeplink function
				window.location = url.substring(0, url.lastIndexOf('/'))+'/index.htm?dl='+filename;
				}
		else{
			//do nothing because gsa can't handle the ajax.
			}
		}
 
