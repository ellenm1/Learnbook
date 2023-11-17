function IE(v) {//use like this: if(IE()){}
  var r = RegExp('msie' + (!isNaN(v) ? ('\\s' + v) : ''), 'i');
  return r.test(navigator.userAgent);
}
 
$(document).ready(function() {
	var gPageHasBeenSet;
	//this is already handled in pagearray.js CHECK AND FIX
	qsVrsn = 	qsParm['vrsn'] ? qsParm['vrsn'] : null;//is there a vrsn param set in the query string? zVrsn defined in trackingFunctions.js
	 
	$('div.nav-no-collapse.header-nav .breadcrumb').empty();
	initTracking(); //doesn't require document.ready
	appendDialogModalsToBody();
	
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
 	 	
	/*module version stuff - this opens a "loading" dialog if there is a version param set either in lms or query string*/
 if(testing){console.log('ERTY znThisPage='+znThisPage+' window.znThisPage='+window.znThisPage)}
	checkForStoredVersion(lmsVrsn, znThisPage, dl, qsVrsn);
	 
	
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
     assignPrevNextButtonFunctions()
     
//assign functions to expander buttons	
	assignExpanderButtonFunctions();
	
//search button functionality	
	$('#headerSearch').click(function(e) {
		//ga('send', 'event', 'button', 'click', 'headerSearch', 'on page'+ znThisPage+1);//google analytics tracking
	  	$('#myModal').html('<div id="searchDiv"></div><div id="searchResults"></div> <a class="close-reveal-modal"><span class="closeText">CLOSE</span> &#215;</a>');
		$('.close-reveal-modal').click(function(e) {
 			turnOffMsg();
 		}); 
     	$('#myModal>#searchDiv').load('includes/search/googleResults.htm');
     		turnOnMsg();
       		e.preventDefault();
     });//end $('#headerSearch')
 	
  //set focus on window and assign previous- and next-page functions to arrow keys
   assignArrowKeyFunctions();
	
   maximizeSabaPlayer();	// was written to get around issues with saba players being too small, but left in place when we stopped using that player (module now opens in new window from player) since it expands module when needed
 // ga('send', 'pageview');//google analytics tracking
 // var _gaq = _gaq || [];//google analytics tracking
 });//end $(document).ready
/* ********************************** */


//fix for https://thedesignspace.net/2015/06/13/jquery-dialog-missing-x-from-close-button/#.VZLnje1VhBc
 var bootstrapButton = $.fn.button.noConflict();
$.fn.bootstrapBtn = bootstrapButton;

function appendDialogModalsToBody(){
	$('body').append('<div id="dialog-modal" style="display:none; z-index: 1000;"></div>');
	$('body').append('<div id="warningModal"></div>');
}

function writePage(znthisp,deepLink){
	var params = {
			itm:znthisp,
			dl:dl?dl:null
		}	
	getContent(params);
} 

function assignExpanderButtonFunctions(){
	$(".expander").click(function(){ toggleByChapter(); 
		 ga('send', 'event', 'button', 'click', 'expander', 'on page'+ znThisPage+1); //google analytics tracking
		 });
}
function assignPrevNextButtonFunctions(){
		//assign functions to previous/next buttons	 
	$(".prevbtn").click(function(){ 
		prevPage(znThisPage); 
		ga('send', 'event', 'button', 'click', 'prevButton', 'on page '+ znThisPage+1);//google analytics tracking
		});
	$(".nextbtn").click(function(){ 
		nextPage(znThisPage); 
		ga('send', 'event', 'button', 'click', 'nextButton', 'on page'+ znThisPage+1); //google analytics tracking 
		});
}
function assignArrowKeyFunctions(){ //set focus on window and assign previous- and next-page functions to arrow keys
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

//pass any version stored in the LMS (lmsVrsn), znThisPage, any deepLink (dl) and any cookie-stored version. 
function checkForStoredVersion(lmsVrsn, lp, dl, qsVrsn){	

		//this runs once when index loads and when coming back from questionmark quiz/qualtrics quiz. not every time content loads
		// var znThisPage = (typeof znThisPage!="undefined")?znThisPage:0;
		//lp will be used for landing page
		
		if( (typeof lp ==="undefined") || (isNaN(lp) ) ){
		//if it's too early for znThisPage to have been calculated, lp will be undefined. 
		//look in local storage for a value or set lp to zero.
			//if(testing){console.log('GWE lp is undefined');}
			//if there is a bookmarked location do we want to use that? Only if not coming back from quiz
		//	9-17 not sure why but the below statement is no longer working. 
			//lp = (ns.localStorage.get('znThisPage')!="undefined") ? ns.localStorage.get('znThisPage'):0;
			var storedZnTP = ns.localStorage.get('znThisPage');
			
			if((storedZnTP)==="undefined"){
			  lp = 0;
			}
			else{
			  lp = storedZnTP;
			}
			
		}
		 
	 
//is there already a version set in the lms?		 
		 if(   (lmsVrsn!=null)&&!isNaN(lmsVrsn)   ){	
    		
    	/*	$( "#dialog-modal" ).dialog({//then open a dialog
    			close:true,
            	height: 140,
           		//autoOpen:false,
           		modal: true
       	 	});
       	 	
       	 	$("#dialog-modal").html("<div id='modal-header'></div><div id='modal-body'>Setting up page list, one moment!</div>"); */
       	 	 
//if so, is it a custom user-selected version?      	 	
       	 	if(lmsVrsn==99){//if the version is a user-selected custom version figure out what the page array should be...
       	 		var suspendDataFromLMS = SCOGetValue("cmi.suspend_data");
       	 		console.log('lmsVrsn==99 and suspendDataFromLMS= '+suspendDataFromLMS);
       	 		var start = suspendDataFromLMS.indexOf('CustVrsn_');
       	 		var end =  suspendDataFromLMS.indexOf('_CustVrsn');
       	 		if((start!=-1)&&(end!=-1)){
       	 			var selecteditems = suspendDataFromLMS.substring(start+9,end);
       	 			var selecteditemsArray  =( selecteditems.split(','));
       	 			var newpagelist = getNewPageList(selecteditemsArray);
       	 			if(dedup){
					startUpCustomVersion(newpagelist, selecteditems,0,true,true);	//and start that version up. 
					}
					else {
						startUpCustomVersion(newpagelist, selecteditems);
					} 
       	 		}
       	 		 else{ alert('custom version selections were not successfully stored in suspendDataFromLMS, so will have to be re-selected') }	
       	 	
       	 	} //end if it was a custom version
       	 	else{  	   //else there was a "classic" version stored in the LMS, not a custom version (99) so no need to check anything else, just restore it:       	 	
   	 	
       	 		//set the version of the pageArray to the version stored in the SCORM objective with ID of "vrsn"
       	 		//this fixed december 4 issue where current page was always set to 0 after coming back from captivate html5 quiz.
       	 		if(testing){console.log('AIDUEK about to setVrsn lmsVrsn='+lmsVrsn+' lp'+lp );}
       	 		setVrsn(lmsVrsn,lp,true);//set the version of the pageArray to the version stored in the SCORM objective with ID of "vrsn"
       	 	
       	 	   	writePage(lp,dl); //i moved this inside the else for classic version since startUpCustomVersion already has write page in it.
       	 	}//end else there WAS a "classic"  version stored in the LMS, not a custom version 
    	  	
    	 // 	closeModalDialog("#dialog-modal");	
    	  //	if(testing){console.log("TYEIEI in checkForStoredVersion about to writePage and lp= "+lp)}
    	  
    	} //end is there already a version set in the lms?	
    	
    	else if((qsVrsn!=null)&&!isNaN(qsVrsn)) { //check to see if a version was requested in the query string
    		$( "#dialog-modal" ).dialog({
    			close:true,
            	height: 140,
           		//autoOpen:false,
           		modal: true
       	 	}); 
       	 	$("#dialog-modal").html("<div id='modal-header'></div><div id='modal-body'>Setting up page list, one moment!</div>");
       	 	  if(testing){console.log("XOEIDK in checkForStoredVersion about to setVrsn() qsVrsn="+qsVrsn + ", page 0");}     	 	     	 	
       	 	setVrsn(qsVrsn,0,true);//set the version of the pageArray to the version requested in the query string 
    		closeModalDialog("dialog-captivate");
    		writePage(lp,dl);	
    	}//else
   				// }//if(!saveStorage	
     
 		else{ 
 			 if(testing){console.log('BBX have determined version and about to write page lp='+lp)}
 			writePage(lp,dl);
 		 
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
	
	 //znewpagelist is the full listing of the new pageArray (figured out by the calling function
	 //selected items is the full listing of the Name of each selected mini pagearray that the user selected: "pb", "tn", etc.
	 //landingpage is the itm number of the new pageArray to start up with. this could be problematic to figure out when using deduplication  
	 //dedup: remove duplicates or no?. //may remove this if it should always be done
	 //fixChapters: rewrite chapters to clean up mess from deduping
function startUpCustomVersion(znewpagelist,selecteditems, landingPage, dedup, fixChapters) {
		 
			 console.log('AAA newpagelist before anything changes = '+znewpagelist) 
			//if requested remove duplicate pages
			znewpagelist=dedup?removeDuplicatePages( znewpagelist ):znewpagelist;
			 console.log('BBB newpagelist after remove duplicates = '+znewpagelist) 
 	       //if requested rewrite the chapters and levels 
 		   znewpagelist = fixChapters?rewriteChapters(znewpagelist):znewpagelist;
			 console.log('CCC newpagelist after fix chapters   = '+znewpagelist) 
 			
 			ns.localStorage.set('pageArray',znewpagelist);	 //store new page array in local storage
			ps=ns.localStorage.get('pageArray');
			SCOSetObjectiveData("version","score.raw",'99');
			//need to check suspend data to see if new version needs to replace old.
			 window.lmsVrsn = 99;
			 ms.vrsn = 99;
			 ns.localStorage.set('moduleVars',ms);
			
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

function rewriteChapters(obj){
	var chaptercounter = 0;
	$.each( obj, function( key, value ) {
       console.log( key + ": url= " + value["url"] + "chapter= "+ value["chapter"]);
      value["chapter"]=chaptercounter;
    chaptercounter++;
  });
  return obj;
}
	 
function setupQuizzes(){
	interactionsQuizzes=false;//set it to false each time this runs. It will be set to true again if there are any in this version.
   		if(testing){console.log('in setupQuizzes GPB ps='+ps);}
   		for(var m=0; m< ps.length; m++){ 
  	 
        	var q =  ps[m];
	    	if (typeof q.quiz!="undefined"){ 
	        	quizCount++;
	        	//console.log('in setupQuizzes GPC quizCount='+quizCount);
		    	qType=(typeof q.type!="undefined")?q.type:"Q";
				if(qType=="I"){
					interactionsQuizzes=true;
					//if(testing){console.log('in setupQuizzes GPD interactionsQuizzes='+interactionsQuizzes)}		    
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
    
    ms.quizSetupDone = true
   	ns.localStorage.set("moduleVars",ms);
 } //end setupQuizzes function
 
function setVrsn(desiredVersion,p,doNotRewritePage){
//desiredVersion is desired version number, it should match the pageArray number desired.
//p is index of desired landing page of new version
	//if(testing){console.log('ETE n='+desiredVersion+', p='+p)}	
//need to check value of lmsVrsn again in case it changed since module was initialized.
//does it exist, and is it a number? if so, then set zLmsVrsn to that number. 
   // if doNotRewritePage is set as FALSE, it will run getContent() after setting the ArrayVrsn. 
   //  This is usually desirable when user takes an action to change the version like click a button or pass a quiz. It is not desirable when returning to a bookmarked location and on launch.
    g_doNotRewritePage = (typeof doNotRewritePage!="undefined")?doNotRewritePage:false;
	zLmsVrsn = 	(lmsVrsn && !isNaN(lmsVrsn) ) ? lmsVrsn : null;
	//zCookieVrsn = ReadCookie('cVrsn');
	var lp = p?p:0;//landing page error catch
	//if n is a valid number, use it to set the version
	 //refresh ms here 5-16-18
	//ms = ns.localStorage.get('moduleVars');
	 
	if(!isNaN(desiredVersion) ){ //if a valid version number was passed in to this function
		//zVrsn=n; //set zVrsn
		
			//if the version we are requesting now with this function is different than what is already in storage, change it.
			 //need to figure out how to keep track of quizzes across versions maybe? If a person takes a quiz in one version and then another in another, it will be tracked in the lms, but not in local storage yet.
			
			ms.version = desiredVersion; 
			var chosenPageArray; //active pageArray chosen by some process other than the default initial load of the PageArray.
			if(desiredVersion==1||desiredVersion==0){  chosenPageArray=window['PageArray']; }
			else {chosenPageArray=window['PageArray'+desiredVersion];}
 			ns.localStorage.set('pageArray',chosenPageArray);
 			ps = ns.localStorage.get('pageArray');	
 			ns.localStorage.set('moduleVars', ms);
			//if n is set this means we are explicitly requesting a version change via a click or other interaction.  
			SetCookie('cVrsn',desiredVersion,1);
			zCookieVrsn = ReadCookie('cVrsn');
			SCOSetObjectiveData("version","score.raw",desiredVersion);
			lmsVrsn = desiredVersion, zLmsVrsn = desiredVersion;
		 		
			setArrayVrsn(desiredVersion,lp,g_doNotRewritePage);
			
	}
	else{
	if(testing){console.log("EFGG about to setVrsn ms.version "+ms.version +"!=desiredVersion "+ desiredVersion);}
	setVrsn(0,lp,true);
	}//if no valid 'desiredVersion' argument was provided in the function call start over with version "0"
	// if(testing){console.log('EEE zVrsn='+desiredVersion+' zLmsVrsn='+zLmsVrsn+ ' zCookieVrsn='+zCookieVrsn)}		 
 	
}//end function setVrsn() 

function setArrayVrsn(vrsn,landingpage,b_doNotRewritePage){   
    //vrsn is the desired version 
	//landingpage is the page to open once version has changed.
	//it is the number of the item in the array, eg 0, 1, 2, 3, etc.
	//if a version number IS explicitly set. Set pagearray variable to that version, and set the cookie and save new pageArray to local storage.
   
	 if(typeof vrsn!="undefined" ){  			
 		
 		//if version  is 1 or 0 then default page array.
 		if(vrsn==1||vrsn==0){           
 			ns.localStorage.set('pageArray',window['PageArray']);	//set local storage PageArray to the default PageArray that was first loaded.
 			ps = ns.localStorage.get("pageArray"); //refresh ps with the new page array			
 			ms = ns.localStorage.get('moduleVars');//refresh just in case this changed recently
 			ms.version = vrsn; //add in the new version to the clean moduleVars
 			ns.localStorage.set('moduleVars', ms); //save it back to localStorage
 			justOpened=false;
 			vrsnDone=true;	
 			setupQuizzes();	 	 	
 		} //end if(vrsn==1||vrsn==0)  			
  		
  				
 		else{     //else version NOT 1 or 0: it is NOT same as original pagearray 	                
 			var chosenPageArray=window['PageArray'+vrsn];
 			ns.localStorage.set('pageArray',chosenPageArray);
 			ps = ns.localStorage.get('pageArray');	//refresh ps with the new page array
 			ms = ns.localStorage.get('moduleVars');//refresh ms just in case this changed recently
 			ms.version = vrsn; //add in the new version to the clean moduleVars
 			ns.localStorage.set('moduleVars', ms); //save it back to localStorage
 			justOpened=false; 
 			vrsnDone=true; 
 			setupQuizzes();			 
 		}//end else
 		
 	}//end if(typeof vrsn!="undefined" )
 	
 	//if there is a bookmark to resume to, set landingPage to that. 
 	//since this takes a long time to run it often comes in and changes things after we have already written the page
  if( (typeof resumeAtLocation!="undefined") && (resumeAtLocation!="")){ 
  		var lp = resumeAtLocation; resumeAtLocation=""; 
  		//don't redraw page unless it is explicitly requested by user action (b_doNotRewritePage==false)
  	    if((typeof b_doNotRewritePage!="undefined") && (b_doNotRewritePage==false)){
  	       var params = { itm:lp };
  	      getContent(params);
  	     } 
  	}	
  //if a landing page was specified, use that	

else if(typeof landingpage!="undefined" && !isNaN(landingpage)){ 
	var lp = landingpage;
	 var params = { itm:lp }
	 getContent(params);
	}

  //if none was specified, set it to 0
else {
		lp = 0;
		 var params = { itm:lp }
	     getContent(params); 
	 }
 	  

	//	 ms = ns.localStorage.get('moduleVars');
	//  var params = { itm:lp }
	//	getContent(params); do we need this?? it runs within checkForStoredVersion > writePage 
		 
	
}//end function setArrayVrsn
 	
function redirectToFirstPageOfNewVersion(){
 	if ((pageHasBeenSet!=1)&&(document.location.href!=PageArray[0].url)){  
 				if(testing){console.log('PGG zurl='+zurl+ PageArray[0].url);   }
 				document.location.href = zurl?zurl:PageArray[0].url;
 				pageHasBeenSet = 1; 			
 			}//end if (document.location.href!=PageArray[0].url)
 	} 	
 
 // https://ilikekillnerds.com/2016/05/removing-duplicate-objects-array-property-name-javascript/
function removeDuplicatePages(myArr) { 
//return myArr.filter((obj, pos, arr) => { return arr.map(mapObj => mapObj["url"]).indexOf(obj["url"]) === pos; });  //es6 version not compatible with IE 11
if(testing){console.log('myArr before dedup='+ myArr);}
//https://stackoverflow.com/a/16747855
//this works great but ES6 is Not compatible with IE11. Which is still in wide use as of 2020.
/* var tmp = [];
    for(var i = 0; i < myArr.length; i++){
    console.log('tmp='+tmp);
        if(tmp.indexOf(myArr[i]) == -1){
        	tmp.push(myArr[i]);
        }
    }
    return tmp; */
/*https://gist.github.com/telekosmos/3b62a31a5c43f40849bb    
    var uniqueArray = function(myArr) {
  return myArr.filter(function(elem, pos,arr) {
    return arr.indexOf(elem) == pos;
  });
};*/
/*https://gomakethings.com/removing-duplicates-from-an-array-with-vanilla-javascript/ */
//this will not work for arrays of objects
/*var arrayUnique = function (myArr) {
	return myArr.filter(function(item, index){
		return myArr.indexOf(item) >= index;
	});
};*/
var tmp = [];
$.each(myArr, function (i, e) {
    var matchingItems = $.grep(tmp, function (item) {
       return item.buttonTitle === e.buttonTitle && item.url === e.url;
    });
    if (matchingItems.length === 0){
        tmp.push(e);
    }
});
 return tmp;
} //end function removeDuplicatePages
	
//********* end version setting functions *****//
//add search result display functions from headcontent CHANGE
//if localstorage has been cleared, nav buttons should work, using either retrieved data from lms or original pagearray as fallback.