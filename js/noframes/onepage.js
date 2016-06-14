 
	//if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
	var testing = false;
function IE(v) {//use like this: if(IE()){}
  var r = RegExp('msie' + (!isNaN(v) ? ('\\s' + v) : ''), 'i');
  return r.test(navigator.userAgent);
}
 
$(document).ready(function() {
	//var cookieVrsn=ReadCookie('cVrsn'); 
	var pageHasBeenSet;
	zVrsn = 	qsParm['vrsn'] ? qsParm['vrsn'] : null;//is there a vrsn param set in the query string?
	$('div.nav-no-collapse.header-nav .breadcrumb').empty();
	initTracking(); //doesn't require document.ready
	$('body').append('<div id="dialog-modal" style="display:none; z-index: 1000;"></div>');
	$('body').append('<div id="footer"></div>');
   	$('body').unload(function(){SCOUnload()});	   		
  	var footerStr =  '<div class="navbar-inner">'
  					+'<div class="container-fluid">'	
						+'<div style="display:inline-block;position: absolute;right:0px;" class="footer-nav">'
							+'<ul class="nav pull-right">'
								+'<li><a class="btn prevbtn"><i class="icon-arrow-left  prevbtn"></i><span>Prev</span></a></li>'
								+'<li><a class="btn nextbtn"><span>Next</span><i class="icon-arrow-right"></i></a></li>'
							+'</ul>'
						+'</div>'
					+'</div>'
				+'</div>';
				
	$('#footer').append(footerStr);
 	 	
	/*module version stuff - this opens a "loading" dialog if there is a version param set*/

	checkForStoredVersion(lmsVrsn, znThisPage,dl, zVrsn);
	
	
	//assign getcontent to onclick of all the nav links
	$("#sidebar-left li a[id^='itm']").click(function() {
		var itmno = this.id.substring(3);
		//ga('send', 'event', 'button', 'click', 'left nav buttons', 'button id '+ itmno);//google analytics tracking
		var params = {
			itm:itmno
		}	
		getContent(params);
	});
	
//assign functions to previous/next buttons	 
	$(".prevbtn").click(function(){ 
		prevPage(znThisPage); 
		//ga('send', 'event', 'button', 'click', 'prevButton', 'on page# '+ znThisPage+1);//google analytics tracking
		});
	$(".nextbtn").click(function(){ 
		nextPage(znThisPage); 
		//ga('send', 'event', 'button', 'click', 'nextButton', 'on page#'+ znThisPage+1); //google analytics tracking 
		});
//assign functions to expander buttons	
	$(".expander").click(function(){ toggleByChapter(); 
		 //ga('send', 'event', 'button', 'click', 'expander', 'on page#'+ znThisPage+1); //google analytics tracking
		 });
//search button functionality	
	$('#headerSearch').click(function(e) {
		//ga('send', 'event', 'button', 'click', 'headerSearch', 'on page#'+ znThisPage+1);//google analytics tracking
	  	$('#myModal').html('<div id="searchDiv"></div><div id="searchResults"></div> <a class="close-reveal-modal"><span class="closeText">CLOSE</span> &#215;</a>');
		$('.close-reveal-modal').click(function(e) {
 			turnOffMsg();
 		}); 
     	$('#myModal>#searchDiv').load('includes/search/googleResults.htm');
     		turnOnMsg();
       		e.preventDefault();
     });//end $('#headerSearch')
 	
 
 	if($("#header").css('display')=='block'){	 
 		$(window).focus();
 		//we don't want this operating if there is any possibility of user input with keys
		$('input,textarea,button,canvas').focus(function(){busy=true;});
		$('input,textarea,button,canvas').blur(function(){busy=false;});	
		$(document).keydown(function(e){
			if(!busy){
				if(e.keyCode==37){
					prevPage(znThisPage);
				}
				if(e.keyCode==39){
					nextPage(znThisPage);
				}//if(e.keyCode
			}//$(document).focus
		});//$(document).keydown
	}//if($("#header")

	
  maximizeSabaPlayer();	
 // ga('send', 'pageview');//google analytics tracking
 // var _gaq = _gaq || [];//google analytics tracking
 });//end ready

//fix for https://thedesignspace.net/2015/06/13/jquery-dialog-missing-x-from-close-button/#.VZLnje1VhBc
 var bootstrapButton = $.fn.button.noConflict();
$.fn.bootstrapBtn = bootstrapButton;

function writePage(znthisp,deepLink){
	//printNavBar();	this is in getContent where needed
	var params = {
			itm:znthisp,
			dl:dl?dl:null
		}	
	getContent(params);
} 

function maximizeSabaPlayer(){
	top.window.moveTo(0,0);
	var  p=screen.availWidth>1280?1280:screen.availWidth;
	var  q=screen.availHeight>1024?1024:screen.availHeight;
	top.window.resizeTo(p,q);
	 
} 
function openModalDialog(id){  $(id).dialog(open); }
function closeModalDialog(id){ $(id).dialog('close');}
function checkSubmit(e){
	//http://www.mindfiresolutions.com/Using-jQuery-AJAX-Calls-to-send-parameters-securely-1235.php
	//http://stackoverflow.com/questions/29943/how-to-submit-a-form-when-the-return-key-is-pressed
	//http://stackoverflow.com/a/29966
	//var param = {q:('#q').val(),access: 'p', client: 'mlearning', proxystylesheet:'mlearning',sort:'date%253AD%253AL%253Ad1',oe:'UTF-8',ie:'UTF-8',filter:'0',proxyreload:'1',q:'criteria'}; 
	//$("#searchResults").load("http://10.30.15.145/search?client=mlearning&proxystylesheet=mlearning&sort=date%253AD%253AL%253Ad1&oe=UTF-8&ie=UTF-8&filter=0&proxyreload=1&q=criteria");
	var q = encodeURIComponent( $("#q").val() );
	$("#searchResults").load("includes/search/proxy3.asp?q="+q);
		//document.forms[0].submit();	
		//show styled xml results in #searchResults div (at bottom of header.htm)
	//$("#searchResults").load("search/proxy3.asp?q="+q);
	
}


function checkForStoredVersion(lmsVrsn, znThisPage,dl, zVrsn){	
		 var znThisPage = (typeof znThisPage!="undefined")?znThisPage:0;
		 if(testing){console.log('BBD znThisPage='+znThisPage)}
		 if(   (lmsVrsn!=null)&&!isNaN(lmsVrsn)   ){	//this catches if there is already a version set in the lms
    		$( "#dialog-modal" ).dialog({
    			close:true,
            	height: 140,
           		//autoOpen:false,
           		modal: true
       	 	});
       	 	if(lmsVrsn==99){//it is a custom version
       	 		console.log('lmsVrsn==99');
       	 		var suspendDataFromLMS = SCOGetValue("cmi.suspend_data");
       	 		console.log('suspendDataFromLMS= '+suspendDataFromLMS);
       	 		var start = suspendDataFromLMS.indexOf('CustVrsn_');
       	 		var end =  suspendDataFromLMS.indexOf('_CustVrsn');
       	 		if((start!=-1)&&(end!=-1)){
       	 			var selecteditems = suspendDataFromLMS.substring(start+9,end);
       	 			var selecteditemsArray  =( selecteditems.split(','));
       	 			var newpagelist = getNewPageList(selecteditemsArray);
					startUpCustomVersion(newpagelist, selecteditems);
       	 			  
       	 		}
       	 		 else{ alert('custom version was not stored in suspendDataFromLMS, so will have to be re-selected') }
       	 		 
       	 	//	SCOSetValue("cmi.suspend_data", 'CsVrsn_,'+selecteditems+',_CsVrsn');
       	 	
       	 	
       	 	}
       	 	else{  //it is a predefined version   	 	     	 	
       	 		setVrsn(lmsVrsn,0);//set the version of the pageArray to the version stored in the lmsVrsn objective 
       	 	}
    	  	$("#dialog-modal").html("<div id='modal-header'></div><div id='modal-body'>Setting up page list, one moment!</div>");  
    	  	closeModalDialog("#dialog-modal");	
    	  	writePage(znThisPage,dl);
    	}//if(lmsVrsn)
    	
    	else if((zVrsn!=null)&&!isNaN(zVrsn)) { 
    		$( "#dialog-modal" ).dialog({
    			close:true,
            	height: 140,
           		//autoOpen:false,
           		modal: true
       	 	}); 
       	 	$("#dialog-modal").html("<div id='modal-header'></div><div id='modal-body'>Setting up page list, one moment!</div>");      	 	     	 	
       	 	setVrsn(zVrsn,0);//set the version of the pageArray to the version set in the query string 
    		closeModalDialog("dialog-captivate");
    		writePage(znThisPage,dl);	
    	}//else
   				// }//if(!saveStorage	
     
 		else{  
 			writePage(znThisPage,dl);
 		 
 		}			  
	 }//end checkForStoredVersion
//*********	 		
function getNewPageList(selitms){ //creates a user-selected version from a set of comma delimited short string identifiers, such as comma delimited values from a set of checkboxes or comma delimited values from suspend_data retrieved from the LMS
//each identifier is associated with a set of pages listed in pagesets in pageArray.js
 		var thelist=new Array();
 		var intro = $(pagesets.intro).toArray();
 		 $.each(intro, function(j, val){
 		 	thelist.push(intro[j]);//intro
 		 });
 		
 		
 		$.each(selitms, function( i, val){
 				console.log('i='+i+', val='+val+', pagesets[val]= '+pagesets[val]);
 				 
 				///var gg = $.makeArray(pagesets[0][val]);
 				var gg = $(pagesets[val]).toArray();
 				$.each(gg, function(k,val){
 		 			thelist.push(gg[k]);//add page by page
 		 		});
  						
  			}); //end each
  		var ending = $(pagesets.ending).toArray();
  		
  		$.each(ending, function(m, val){
 		 	thelist.push(ending[m]);//intro
 		 });
  		 
  		//$.makeArray(thelist);
  		return thelist;
	}//end getNewPageList
	
	 
function startUpCustomVersion(znewpagelist,selecteditems, landingPage) {
 			ns.localStorage.set('pageArray',znewpagelist);	 //store new page array in local storage
 			 
			ps=ns.localStorage.get('pageArray');
			//SCOSetObjectiveData('adhocVersion', 'score.raw', '1');
			SCOSetObjectiveData("version","score.raw",'99');
			//need to check suspend data to see if new version needs to replace old.
			 
			
			//if selected items is not null, that means there is a NEW selection which should replace whatever might be in the suspend_data. 
			//otherwise, leave suspend_data alone - you are just starting up again after storing the version previously 
			//http://stackoverflow.com/questions/18388799/replace-text-between-two-words
			var newstr;
			if((selecteditems!=null)&&(typeof selecteditems!="undefined")){
				var suspendDataFromLMS = SCOGetValue("cmi.suspend_data");
				if(suspendDataFromLMS.indexOf('CustVrsn_')!=-1){
					//custom version number was saved previously in suspendData. Replace with new version.
					 newstr = suspendDataFromLMS.replace(/(CustVrsn_)(.+?)(?= _CustVrsn)/, "$1 "+selecteditems);
					console.log('KLE newstr='+newstr);
				}
				
				else{ newstr=suspendDataFromLMS+";CustVrsn_"+selecteditems+"_CustVrsn"}
				
				SCOSetValue("cmi.suspend_data", newstr);
				if(testing){console.log('VBN after saving new custom version, suspendData = '+ SCOGetValue("cmi.suspend_data") )}
			 }
			 
			znThisPage = (typeof landingPage!="undefined"&&landingPage>0)?landingPage:0;
			 
			setupQuizzes();
			wipePageNo();
			wipeNavBar();
			writePage(0,null);	

}//end startUpCustomVersion
	
	 
function setupQuizzes(){
	interactionsQuizzes=false;//set it to false each time this runs. It will be set to true again if there are any in this version.
   		console.log('in setupQuizzes GPB ps='+ps);
   		for(var m=0; m< ps.length; m++){ 
  	 
        	var q =  ps[m];
	    	if (typeof q.quiz!="undefined"){ 
	        	quizCount++;
	        	//console.log('in setupQuizzes GPC quizCount='+quizCount);
		    	qType=(typeof q.type!="undefined")?q.type:"Q";
				if(qType=="I"){
					interactionsQuizzes=true;
					if(testing){console.log('in setupQuizzes GPD interactionsQuizzes='+interactionsQuizzes)}		    
				}
				var objectiveID= (qType+q.quiz);
				if (testing){ console.log('in setupQuizzes GPE objectiveID='+objectiveID) }
				var obj_count = parseInt(SCOGetValue('cmi.objectives._count'), 10);
			 
				 if( SCOGetObjectiveData(objectiveID, "status") ){ 
				 if(testing){console.log('there was an objective for id '+objectiveID) }
				  }
    		else{	SCOSetObjectiveData(objectiveID, 'status', '')}
 			//sets up the maximum score for each objective
           	var objStatus =  (SCOGetObjectiveData(objectiveID, "status"   ))?(SCOGetObjectiveData( objectiveID, "status"   )):'';
	      	var objMax =     (SCOGetObjectiveData(objectiveID, "score.max"))?(SCOGetObjectiveData( objectiveID, "score.max")):q.qMax;
		   	var objScore =   (SCOGetObjectiveData(objectiveID, "score.raw"))?(SCOGetObjectiveData( objectiveID, "score.raw")):q.qScore;
		  	
		  	//if there's a score in mlearning, use it, otherwise leave it
		   	if (typeof objScore!="undefined"){ q.qScore=parseInt(objScore,10);}
		   	qScore=q.qScore; 
		 	
		if ((objMax!="")&&(typeof objMax!="undefined")&&!isNaN(objMax) ){q.qMax=parseInt(objMax,10);}
		                                     
			qMax=q.qMax;
 			 
			if (testing){
				console.log('from quizFunctions.js: setupQuizzes');
				console.log(('itm'+m)+': '+objectiveID+', objMax= '+objMax+', objScore= '+objScore);
				console.log('qMax='+qMax+', qScore='+qScore+'qType'+qType);	
			}//end  if (testing 
		}// end if (typeof q.quiz!="undefined"){
      } //end for (var...
    if(interactionsQuizzes){loadInteractions();}
    //quizSetupDone = true;
   ms["quizSetupDone"] = true
   	ns.localStorage.set("moduleVars",ms);
 } //end setupQuizzes function
 
 
function setVrsn(n,p){//p is landingpage: //it is the number of the item in the array, eg 0, 1, 2, 3, etc.
   	
   	//set some variables
	//zVrsn = 	qsParm['vrsn'] ? qsParm['vrsn'] : null;
	
	zLmsVrsn = 	(lmsVrsn && !isNaN(lmsVrsn) ) ? lmsVrsn : null;
	zCookieVrsn = ReadCookie('cVrsn');
	
	if(n &&!isNaN(n)){
		zVrsn=n; 
		if(ms.version!=zVrsn){ //if the version we are setting now with this function is different than what is already in storage, change it.
			 //need to figure out how to keep track of quizzes across versions maybe? If a person takes a quiz in one version and then another in another, it will be tracked in the lms, but not in local storage yet.
			ms.version = zVrsn;
			versionSelectedPageArray=window['PageArray'+zVrsn];
 			ns.localStorage.set('pageArray',versionSelectedPageArray);
 			ps = ns.localStorage.get('pageArray');	
 			ns.localStorage.set('moduleVars', ms);
			//if n is set this means we are explicitly requesting a version change via a click or other interaction.  
			SetCookie('cVrsn',n,1);
			zCookieVrsn = ReadCookie('cVrsn');
			SCOSetObjectiveData("version","score.raw",zVrsn);
			lmsVrsn, zLmsVrsn = n;
			 var lp = p?p:0;
			setTimeout('detArrayVrsn('+n+','+lp+')',1000);
			}
	}
	if(testing){console.log('EEE zVrsn='+zVrsn+' zLmsVrsn='+zLmsVrsn+ ' zCookieVrsn='+zCookieVrsn)}		 
 	
}//end function setVrsn() 

function detArrayVrsn(vrsn,landingpage){ //landing page is the page to open once version has changed.
//it is the number of the item in the array, eg 0, 1, 2, 3, etc.
	//if  a version number IS explicitly set. Set pagearray to that version, and set the cookie and save new pageArray to local storage.

	if(typeof vrsn!="undefined" ){  			
 		
 		//if version  is 1 or 0 then default page array.
 		if(vrsn==1||vrsn==0){           
 			versionSelectedPageArray=window['PageArray']; 
 			ns.localStorage.set('pageArray',versionSelectedPageArray);	
 			ps = ns.localStorage.get('pageArray');
 			ms.version = vrsn;
 			ms.localStorage.set('version', vrsn);
 			justOpened=false;
 			vrsnDone=true;	
 			setupQuizzes();	 	 	
 		} //end if(vrsn==1||vrsn==0)  			
  		
  		//else version NOT 1 or 0: it is NOT same as original pagearray 			
 		else{                    
 			versionSelectedPageArray=window['PageArray'+vrsn];
 			ns.localStorage.set('pageArray',versionSelectedPageArray);
 			ps = ns.localStorage.get('pageArray');	
 			ms.version = vrsn;
 			ns.localStorage.set('version', vrsn);
 			justOpened=false; 
 			vrsnDone=true; 
 			setupQuizzes();			 
 		}//end else
 	}//end if(typeof vrsn!="undefined" )
 	
  if(landingpage){ var lp = landingpage }else lp = 0;
 	  
	var params = {
			itm:lp
		}	
	getContent(params); 
 
	
}//end function detArrayVrsn
 	
function redirectToFirstPageOfNewVersion(){
 	if ((pageHasBeenSet!=1)&&(document.location.href!=PageArray[0].url)){  
 				if(testing){console.log('PGG zurl='+zurl+ PageArray[0].url);   }
 				document.location.href = zurl?zurl:PageArray[0].url;
 				pageHasBeenSet = 1; 			
 			}//end if (document.location.href!=PageArray[0].url)
 	
 	} 	
 	
 //********* end version setting functions *****//

//add search result display functions from headcontent CHANGE

//if localstorage has been cleared, nav buttons should work, using either retrieved data from lms or original pagearray as fallback.