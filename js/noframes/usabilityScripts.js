function changeLinks(callback){
	//change all local links to "itm=" ajax links
	 
	var gnodes = $("a").not( $("#sidebar-left .main-menu a") ).not($("navbar-inner ul.nav .pull-right a.btn")).not($("#sidebar-left a.expander")).not($("a[target$='blank']")).not($("a[target$='new']")).not($("a[href^='mailto:']")).not($("a[href^='#']")).not($("a[data-link-change='no']")), i = gnodes.length;	
	var filename = $("a[href^='#']");

	
	while(i--){
    	var oldhref = gnodes[i].href;
    	var linktext = gnodes[i].text;
    	var linktitle = gnodes[i].title;
    	var isLocal = new RegExp(thispathUnEnc).test(oldhref); 
    	var filename = oldhref.split('/').pop();
    	var extension = (filename != "") ? filename.split('.').pop():null;
    	
    	if( (isLocal==true)&&( extension!= '.pdf')&& ( extension!='.doc') ) {
    	  
    	// nodes[i].style.background = "#FFCC00"; //use this for debugging: local links are colored bright yellow
    		// console.log('oldhref'+i + 'isLocal=true  | '+ $( this ).attr("href") );
    	  
    		$(gnodes[i]).click(function(event){
    			//alert('oldhref='+oldhref);
    			 	event.preventDefault();
    				var params = {
    					itm:null,
    					dl:  $( this ).attr("href")	   	
    				}//end params    					 
    				getContent(params) 
    			});//end $(nodes[i  	 
		}//end if
		       
	}//end while
	/*add download attribute to pdf and document links to keep the window from being lost in a sea of tabs*/
	var downloadLinks = $("a[href$='pdf'],a[href$='docx']"), j = downloadLinks.length;
	 
	while (j--){
	//add something to change http to https since mixed security rules prevent downloads from http
	   $(downloadLinks[j]).attr('download',downloadLinks[j].href);
	}
	
	/*add popup window click handler for non-module-page links. Non-docs, non-navbar links only*/
	var externalLinks = $("a[target$='blank']").not( $("#sidebar-left .main-menu a") ).not( $("a[href$='pdf']") ).not( $("a[href$='docx']") ), k = externalLinks.length;
 
	while (k--){
	var externalLink = externalLinks[k];	
		 $(externalLinks[k]).click(function(){
		 var theURL = $(this).prop('href');
		 var theTitle = $(this).prop('text');
		     popup(theURL,theTitle, 800, 600);return false;
		 })
	}
	
	 if(callback) {callback();}
}//end changeLinks()
