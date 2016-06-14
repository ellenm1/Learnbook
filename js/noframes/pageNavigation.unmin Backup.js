 	if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} };  
 	var testing=false;
 	var busy=false;
	if($('div.nav-no-collapse.header-nav .breadcrumb').length>0){$('div.nav-no-collapse.header-nav .breadcrumb').empty();}
	var dialogCloseTrigger="";
	
//google analytics tracking code
/*	 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	 	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

 (function() {
    	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  	})();
	  ga('create', 'UA-11509774-1', 'auto');
	  ga('send', 'pageview');
*/	  
	var pItem = 		qsParm['itm']? qsParm['itm'] : null;
	var saveStorage = 	qsParm['ls']?true:false;
	var dl = 		qsParm['dl']? qsParm['dl'] : null;
	var pScore, pMax; 
	var isScorm = true;
	var sName  =((SCOGetValue("cmi.core.student_id"))+'');
	var sDetails = ((SCOGetValue("cmi.core.student_name"))+'');
	//if(testing){console.log('sName='+sName +'sDetails='+sDetails);}
	var quizStats = qsParm['zg'] ?qsParm['zg'] : null;
		if(quizStats) { 
			var g_objAPI = FindAPI(window.parent);
			if(testing){console.log('XET decode64(quizSt)= '+decode64(quizStats))}
			pScore = decode64(quizStats).split('&')[0];
			pScore = pScore.split('=')[1];
			pMax = 	typeof decode64(quizStats).split('&')[1] !="undefined" ? decode64(quizStats).split('&')[1]:null;//check this index in other versions
			if(pMax!=null){ pMax = pMax.split('=')[1] };
			if(testing){console.log('AAG pScore='+pScore+',pMax='+pMax);}
		}
		//znThisPage is a number, the index of a page in the Array
		//pageNo is the actual number that shows up as the page number - this should be znThisPage+1
		//currentPage is the page object containing all the data from the page array
	var pageNo,currentPage,znThisPage,znNextPage,znPrevPage,znPages; ;
	var thispage = (document.location.href); 
	var justpath = window.location.pathname;
	var lastslash = (window.location.pathname.lastIndexOf("/")+1);	
	var justpathnofilename = window.location.pathname.substring("/",lastslash-1);
	var thispathUnEnc =  window.location.protocol+"//"+window.location.hostname+window.location.pathname.substring("/",lastslash-1);
	var thispath = encodeURIComponent(window.location.pathname.substring("/",lastslash-1));//strips out final slash
		thispath = thispath.substring(3);//strips out initial slash from path: ct2%2Fcbtlib%2Fmodules%2Ftest%2Fbootstrap_metro 
 
	
	var ns = $.initNamespaceStorage(thispath);
	if((ns.localStorage)&&(!saveStorage)&&(!quizStats)){
		ns.localStorage.removeAll();
		if(testing){'saveStorage = '+saveStorage+ ', just removed existing storage'}
		}	
	 
	var cleanURL;
	var pcounter  = 0, pcounter2 = 0, pcounter3 = 0;
	var thePageArray = typeof PageArray!="undefined"?PageArray:'';//this is for the original page array 
	var znModuleType,znDocTitle,znHeaderTitle,znRecommendedMsg,znCompletedMsg,znRequiredMsg,znContentExpert,znContentExpertName,znContentExpertEmail,modulevars,showExpander;
	var znContentExpertHTML=""; 
	var ps, ms, ints;		//ps = page storage: page array as stored in local storage
						//ms= module storage: other variables that span the entire module stored in local storage
						//ints: interactions storage: interactions array in local storage ("is" appeared to be a reserved word or keyword, so it is inconsistent with other names)
	
	znQuizSetupDone	 =		(typeof quizSetupDone!= "undefined")		? quizSetupDone	: true;
	znVrsnDone	 	 =		(typeof	vrsnDone!= "undefined")				? vrsnDone	: true;
	znJustOpened 	 =		false;//once local storage is populated, we are no longer in a "just Opened state", so set this to false.
	znModuleType 	 = 		(typeof moduletype!= "undefined")	  		? moduletype	: 2; 	
	znRecommendedMsg = 		(typeof recommendedMsg!= "undefined") 		? recommendedMsg: 'Recommended'; 	
	znRequiredMsg 	 =  	(typeof requiredMsg!= "undefined")	 		? requiredMsg	: 'Required';
	znCompletedMsg   =  	(typeof completedMsg!= "undefined")	 		? completedMsg	: 'Completed';	 
	znDocTitle 		 = 	 	(typeof docTitle!= "undefined")	 	 		? docTitle		: '';
	znHeaderTitle 	 = 	 	(typeof headerTitle!= "undefined")	 		? headerTitle	: '';
	znContentExpert =		(typeof contentExpert!="undefined")			? contentExpert : '';
	znContentExpertEmail =  (typeof contentExpertEmail!="undefined")	? contentExpertEmail: '';
	znContentExpertName =  (typeof contentExpertName!="undefined")		? contentExpertName: '';
	znVersion		 = 		(typeof zVrsn!="undefined")					? zVrsn:'1';
 
	//if pageArray is in local storage, retrieve it, otherwise set pagearray into localstorage and retrieve
 	if(ns.localStorage.isSet('pageArray') ){ ps = ns.localStorage.get('pageArray');}
	else{
			ns.localStorage.set('pageArray',thePageArray);	//now that we've read in the pageArray file, load it into local storage. CHANGE need to add what to do if pagearray is not found
			ps=ns.localStorage.get('pageArray');
	}
	
	//if module vars are in local storage, retrieve it, otherwise set global module variables into localstorage
	if(ns.localStorage.isSet('moduleVars') ){ ms = ns.localStorage.get('moduleVars');}
	else{
		 modulevars = {
							quizSetupDone:znQuizSetupDone,
							vrsnDone:znVrsnDone,
							justOpened:znJustOpened,
							docTitle:znDocTitle, 
							headerTitle:znHeaderTitle, 
							moduletype:znModuleType,
							recommendedMsg:znRecommendedMsg,
							requiredMsg:znRequiredMsg,
							completedMsg:znCompletedMsg,
							contentExpert:znContentExpert,
							contentExpertEmail:znContentExpertEmail,
							contentExpertName:znContentExpertName,
							version:znVersion 
							};
		ns.localStorage.set('moduleVars',modulevars);
		ms = ns.localStorage.get('moduleVars');
		//now set justOpened to FALSE because we have run through all the vars once and saved them to local storage.
		justOpened=false;
	}//end else	
	
function printNavBar(){
	var urls='',urlStr='', str1; 	 
	ps = ns.localStorage.get('pageArray');//pulls current state of page array from local storage
	znPages = ps.length;
	str1= ('<div class="nav-collapse sidebar-nav">\n<ul class="nav nav-tabs nav-stacked main-menu">');	
	if(testing){console.log('in printNavBar APB ns.localStorage.isEmpty()='+ns.localStorage.isEmpty('pageArray') )}         
	getCurrentPage();	//this returns znThisPage integer and currentPage object	
 	str1+=printNavToggle();
 	str1+=printExpander(1);
	determineParents(); // processes parent child relationships for use with navbar

	 for(var i=0; i< ps.length; i++) {		 
		var x=znThisPage-1;		 	 
		var p = ps[i], j = (i+1), k = (i-1);
		var nextItem = ps[j], prevItem = ps[k];				
		var level =   		p.level;
		if(level > 1){showExpander ='block'}
		var isquiz = 	   (p.quiz)?'quiz':'notquiz';
		var isScorePage='';
		var chapter = 		p.chapter;
		var isParent= 		p.isParent!="undefined"?p.isParent:'';
		var branch=   		p.branch;
		var urlclean = 		p.url;
		var url =     		p.url+'&itm='+i;
		var buttonTitle = 	p.buttonTitle;
		var pageTitle =    	p.pageTitle;
		var expand = 'closed';
		var current = '';  
		if(urlclean=="scorePage.htm"){ isScorePage = 'isScorePage';buttonTitle='Submit Score & Complete'; }
		//if (i==x){ current = 'current';expand='open2'; }
		if(typeof znThisPage=="undefined"){znThisPage=ps[0]}
		if (i==znThisPage){ current = 'active';expand='open'; }
		if (level==1){expand='open';}
		else if (ps[znThisPage].level>level&&ps[znThisPage].chapter==chapter &&ps[znThisPage].branch==branch){expand='open';} 	  //if currentPage is a direct child of i
		else if (ps[znThisPage].branch==branch && (ps[znThisPage].level==level||level==parseFloat(ps[znThisPage].level+1))){expand='open';} 	  //current page on same level And in same branch
		else if (ps[znThisPage].chapter==chapter && level==2){expand='open';} 
		else {expand='closed';}
		//if(testing){console.log('<a href="#" id="itm'+i+'" class="navlevel' + level +' ' +current + '  chapter' + chapter + ' ' + expand  +' ' + isParent  + ' '+isquiz+' ' + isScorePage+'">' + buttonTitle + '</a>');  }			
		str1+=('<li>');
		str1+=('<a id="itm'+i+'" class="navlevel' + level +' ' +current + '  chapter' + chapter + ' ' + expand  +' ' + isParent  + ' '+isquiz+' ' + isScorePage+'" title="'+ url +'">');
		//if(isquiz=='quiz'){str1+= ('<i class="icon-edit"></i>');}
		str1+=('<span class="hidden-tablet">');
		str1+= buttonTitle; 
		str1+=('</span></a></li>');		 
	} //end of for(var i=0 loop	
	 
	str1+=printExpander(2);
	str1+=printScormButtons();
	str1+=printContentExpert();
	str1+=printFeedbackLink()
	str1+=printContactInfo();
 		str1+=('</ul></div>');     	
	 
  
	if ( (trackingmode == "scorm") && APIOK() && (ms['quizSetupDone']!=true) ){  setupQuizzes();  } 
	
	//urls +=( urlStr+'" />');//new 8-12-07
	//if(document.getElementById('pdfForm')){ document.getElementById('pdfForm').innerHTML+=urls;	 }
	//setHdrBtns();//new 8-8-07
	
	$('#sidebar-left').append(str1);//this is where sidebar buttons all get written to page
	 
	//assign getcontent to onclick of all the nav links
	$("#sidebar-left li a[id^='itm']").click(function() {
		var itmno = this.id.substring(3);
	//	ga('send', 'event', 'button', 'click', 'navbutton', 'navbutton id '+itmno+' |  page'+ '/'+justpathnofilename+'/'+ps[znThisPage].url);//google analytics tracking
		var params = {
			itm:itmno
		}	
		getContent(params);
	});
	
	//assign expander function to expand all links
	$(".expander").click(function(){ 
			toggleByChapter();
			//ga('send', 'event', 'button', 'click', 'expander button on itm '+znThisPage+' | page '+justpathnofilename+'/'+ ps[znThisPage].url ); //google analytics tracking
			});
	$(".expander").css('display',showExpander);//shows expander if any pageArray entry has level greater than 1
	//assign handlers to no-scorm-warning div
	if((trackingmode == "scorm") && !APIOK()&&pageNo==1){
  		$("#apiIndicator").mousedown(function(){$("#modeExplanationContainer").toggle();});		
		$("#apiIndicator").mouseout(function(){$("#modeExplanationContainer").hide();});  
		var connectionErr ="<div id='modal-header' style='color:red;width:300px;'>READ-ONLY MODE - NO DATA IS BEING RECORDED</div><div id='modal-body'>IMPORTANT! You are not connected to MLearning right now. ";
		connectionErr+="This means no data will be recorded: the learning module is in read-only mode. If this is not what you wanted, please close all browser windows and log back in to MLearning.</div>";
		$("#dialog-modal").html(connectionErr);   	
  		openModalDialog("#dialog-modal");	
  	}//end if((trackingmode == "scorm") && !APIOK()
	
	writeNewPageNo();  
	writeHeaderTitle();
	SCOBookmark(); 
	writeDocTitle();			 		    	  
} //end printNavBar()  

 
//figure out what page you are on now. 
function getCurrentPage(){ 	 
		//if pItem is not undefined, use it to determine which page number of the array to go to. 
		//It means you are using a deep link or perhaps coming back from a quiz. Ignore and remove any dl params. add ls to prevent existing local storage from being wiped.
		//if there is no existing local storage, it will be created, so if you are coming in from a deep link it will start up correctly.
		if ((typeof pItem != "undefined")&&(pItem != null)) {			
			ns.localStorage.set('znThisPage', pItem);
			document.location.href = "index.htm?ls=1";	 
		 }
		 //check for deep link to filename also
		else if ((typeof dl != "undefined")&&(dl!=null)){ 
		//there is no itm, so just show deep link
		//CHANGE: check for a match with the deep link to filename in the array if all else fails.
		}
 		znThisPage = ns.localStorage.isSet('znThisPage')? ns.localStorage.get('znThisPage'):0;
		//if there is no pItem parameter, so now check if znThisPage exists, if so, use it. if not, set it to 0.
		//else {znThisPage = typeof znThisPage!="undefined"? znThisPage:0;}
		
		//no matter what it is, set the previous and next page values now.
		znPrevPage =  parseFloat(znThisPage)-1;
		znNextPage =  parseFloat(znThisPage)+1;
		 
		//are we at the last page? hide the next button
		znThisPage == ps.length-1 ? $('.navbar .nextbtn').hide():$('.navbar .nextbtn').show();
		
		//are we at the first page? hide the previous button
		znThisPage == 0 ? $('.navbar .prevbtn ,.footer-nav .prevbtn').hide():$('.navbar .prevbtn ,.footer-nav .prevbtn').show();
		 		 		
		pageNo = parseFloat(znThisPage)+1; //page number 		
		currentPage =  thePageArray[znThisPage]; /// is there a local storage for this item or not? If so use it
		
	 if(testing){console.log('in getCurrentPage YYY I am finally done with getCurrent Page znThisPage ='+znThisPage)}
	return znThisPage, currentPage;  
}//end getCurrentPage
        	
 
function getIndexOfDeepLink(dl){
		var arr = ns.localStorage.get('pageArray');
		var result=null;
		for( var i = 0, len = arr.length; i < len; i++ ) {
			if(testing){console.log('deep link dl='+dl+' and i ='+i)}
				if( arr[i].url.toLowerCase() === dl.toLowerCase() ) {
					result = i;
					return result;
				}//end if
				
    	}//end for
    		if (result==null){
			 	alert('This filename is not part of the current module structure. Navigating to first page of module');
				result=0;
				//add in logic to make it display the page anyway but simply not put a page number or highlight the page in the navbar.
				}
    		return result;
}//end function getIndexOfDeepLink

//http://stackoverflow.com/questions/8809425/search-multi-dimensional-array-javascript
//http://stackoverflow.com/questions/5181493/how-to-find-a-value-in-a-multidimensional-object-array-in-javascript		

function getContent(params){	
	//set currentPage to the new page and store it in local storage
	window.scrollTo(0, 0);
	var itm = (typeof params.itm!="undefined")? params.itm:null;
	var dl	= (typeof params.dl!="undefined")?  params.dl:null;	      
 
	//if there's a deep link, but no item, set the itm number
	if((dl)&&(!itm)){
		if(typeof dl!="undefined" && dl!=null ){ 
			if(dl=="index.htm"){itm = 0}
			else{
				itm = getIndexOfDeepLink(dl);
				var theurl = document.location.href;
				//if there is already an itm param in the URL, and it does not match the "itm" number we just derived from the deeplink, we will need to do a page reload to wipe it out.
				if(qsParm['itm']&&qsParm['itm']!=itm){
					document.location = theurl.substring(0, theurl.lastIndexOf('/'))+'/index.htm?itm='+itm;
				}
			} //end else
		}//end if if(dl=="index.htm")
	}//end if(!itm)
	 
	//convert itm parameter to znThisPage 
	ns.localStorage.set('znThisPage', itm);//immediately store it in local storage
	znThisPage =ns.localStorage.get('znThisPage');
	
	var pi = ns.localStorage.get('pageArray')[znThisPage];	
	var itmurl 			= 	pi.url;
	var itmquiz 		=	pi.quiz; 
	var itmtype 		=	pi.type;
	var itmscore 		=	pi.score;
	var itmmax 			=	pi.max; 
	var itmcountscore 	=	pi.countscore;
	var objectiveID		=   itmtype+itmquiz;
	var itmserver		= 	pi.svr;
	
			if(testing){console.log("in getContent:BAA typeof itmquiz=="+typeof itmquiz+' '+itmquiz+ ' itmtype='+itmtype+', itmquiz= '+itmquiz)}
			customFunction01();
			//determine "is it a quiz" then is it a remote quiz or not and what to do with it. 
				if(typeof itmquiz!="undefined"){ 		  	
				   		  	
						
					//if it is a questionmark quiz that has not yet been taken
					if(APIOK()){ 
						var sScore  =   (typeof SCOGetObjectiveData(objectiveID, "score.raw")!="undefined")?(SCOGetObjectiveData(objectiveID, "score.raw")):itmscore;
						var sMax    =   (typeof SCOGetObjectiveData(objectiveID, "score.max")!="undefined")?(SCOGetObjectiveData(objectiveID, "score.max")):itmmax;  
						}
					else{ var sScore = (typeof itmscore!="undefined")?itmscore:null;  }
					
					
					if((itmtype=="Q")||(typeof itmtype=="undefined")){
						 
				 		
						params={	
								sMax:itmmax,
								sScore:parseFloat(sScore),
								quiz:itmquiz,
								quizserver:itmserver,
								type: (typeof itmtype=="undefined"? "Q": itmtype),
								qindex:itm
								}//end params={
						if (sScore == null || isNaN(parseFloat(sScore)) || typeof sScore =="undefined") {
							quizStart(params); 
							}//end if (sScore == null ||sScore 
						else showTryAgainMsg(params);
						}//end  if((itmtype=="Q")||(itmtype=="undefined")
					else if (itmtype=="U"){
							params={
								sMax:itmmax,
								sScore:parseFloat(sScore),
								qurl:itmurl,
								quiz:itmquiz,
								type: "U",
								qindex:itm
								}//end params=
								 
							if (sScore == null || isNaN(parseFloat(sScore)) || typeof sScore =="undefined") {
					
							quizStart(params); 	
						}//end if (sScore == nul
						else showTryAgainMsg(params);
					}	//end 	else if (itmtype=="U")										
					else if(itmtype=="I"){				
						var ts = Math.round(new Date().getTime() / 1000);
						 $('#content div#div6').load(itmurl+'?ts='+ts+' #content > *', function() {	
							 if(testing){console.log("in getContent:DDD")} 				 	
							 
							$("#sidebar-left li a[id^='itm']").css("background-color","");
							$("#sidebar-left li a#itm"+itm).css("background-color","orange");
							znNextPage = parseFloat(znThisPage)+1;
							znPrevPage = parseFloat(znThisPage)-1;	
							wipePageNo();
							wipeNavBar();
							printNavBar();
							changeLinks(setUpInteractions);//setUpInteractions is the callback function after changeLinks is finished
							scormDivToggle();
							checkDataAttr();
							writeFlash();
							//writeKalturaPlayer();
						});  //end anon function
					}//end else if(itmtype=="I")
					else if(itmtype=="C"){
						var captype = (itmurl.indexOf('captivate6Wrap')!=-1)?"C6":"C"
						params={
								//sMax:itmmax,
								sScore:parseFloat(sScore),
								qurl:itmurl,
								quiz:itmquiz,
								type: itmtype,
								qindex:itm
								}//end params	
							if (sScore == null || isNaN(parseFloat(sScore)) || typeof sScore =="undefined") {
								quizStart(params); 
								znNextPage = parseFloat(znThisPage)+1;
								znPrevPage = parseFloat(znThisPage)-1;	
								wipePageNo();
								wipeNavBar();
								printNavBar();
								changeLinks(setUpInteractions);//setUpInteractions is the callback function after changeLinks is finished
								scormDivToggle();
								checkDataAttr();
								writeFlash();
								//writeKalturaPlayer()	
							}//end if (sScore == nul
							else showTryAgainMsg(params);
					}//C or c6	
					
					else if (itmtype=="H"){ //html5 captivate quiz
					params={
								//sMax:itmmax,
								sScore:parseFloat(sScore),
								qurl:itmurl,//path to assets
								quiz:itmquiz,
								type: itmtype,
								qindex:itm
								}//end params	
							if (sScore == null || isNaN(parseFloat(sScore)) || typeof sScore =="undefined") {
								quizStart(params); 
								znNextPage = parseFloat(znThisPage)+1;
								znPrevPage = parseFloat(znThisPage)-1;	
								wipePageNo();
								wipeNavBar();
								printNavBar();
								changeLinks(setUpInteractions);//setUpInteractions is the callback function after changeLinks is finished
								scormDivToggle();
								checkDataAttr();
								writeFlash();
								//writeKalturaPlayer()	
							}//end if (sScore == nul
							else showTryAgainMsg(params);
					}				
				}//end if(typeof itmquiz!="undefined" 	
 	
 	
 		//OR its not a quiz, so load the content into this page 		
			else { 	
			 		var ts = Math.round(new Date().getTime() / 1000);//add timestamp to create a sort of random number to prevent caching	 
					$('#content div#div6').load(itmurl+'?ts='+ts+' #content > *', function() { //what follows is the callback after loading content					 				 	
							$("#sidebar-left li a[id^='itm']").css("background-color","");
							$("#sidebar-left li a#itm"+itm).css("background-color","orange");
							//znThisPage = parseFloat(itm);//defined above
							znNextPage = parseFloat(znThisPage)+1;
							znPrevPage = parseFloat(znThisPage)-1;	
							wipePageNo();					  							 
							if(itmurl == "scorePage.htm"){ 		
								scoreQuizzes();
								$(".gothereLink,.tryagainLink").click(function(){	//bind the correctly setup getContent to each of the go there now buttons
									var itmno = this.id.substring(4); 
									ns.localStorage.set('znThisPage',itmno)
									var p4 = {
										sScore:0,
										qurl:ps[itmno].url,
										quiz:ps[itmno].quiz,
										type: ps[itmno].type,
									 	qindex:itmno
									}//end var params
									znThisPage = p4.qindex;
									znNextPage = parseFloat(p4.qindex)+1;
									znPrevPage = parseFloat(p4.qindex)-1;	
									wipePageNo();
									wipeNavBar();
									printNavBar();
									quizStart(p4);
									//changeLinks(setUpInteractions);//setUpInteractions is the callback function after changeLinks is finished
									scormDivToggle();
									checkDataAttr();
									writeFlash();
								});//end $(".gothereLink
							}//if(itmurl == "scorePage.
							
							checkDataAttr();
							writeFlash();
							//writeKalturaPlayer();
							scormDivToggle();							
							customFunction03();	
							customFunction04();								 
							wipeNavBar();
							printNavBar();//note that this calls getCurrentPage a second time
							changeLinks(function(){ 
								if(testing){console.log('links changed')}
							
							});//note that this happens only after content is loaded: it is part of the callback
							 
				}); //$('#content div#div6').load(itmur
			customFunction02();
				//end $('#content').load
	 		}//end else	
	 		
	 		var gpathname =window.location.pathname;  	
 			//ga('send', 'pageview',{'page':justpathnofilename+'/'+itmurl});//google analytics: track the ajax loaded page //google analytics tracking
}	//end function getContent	


function setDialogCloseTrigger(type){
	window.dialogCloseTrigger=type;
}
 
function showTryAgainMsg(params1){	
			 /*we have several types of close events for the dialog modal dialog created here: 
			 1. user closes x  type='xBtn'
			 2. quiz is on second to last page, so next page is last page.
			 3. user clicks skip quiz  - type='skipQuizBtn'
			 4. close try again message just prior to start quiz
			 http://pdelco.wordpress.com/2013/03/14/passing-parameters-to-jquery-ui-dialog/
			 $('#someDialog').data('parameter name', parameter value).dialog('open');
			 */	
			var msg=('You already scored '+params1.sScore+' points for the quiz <h1>'+ps[params1.qindex].buttonTitle+'.</h1> ');
			msg+=('<p>If you wish to take this quiz again and lose the existing score, click the button below.</p>');			 
			msg+=('<button class="btn btn-large btn-success" id="gtryagainbtn" alt=\"Erase my score and let me try again\">Try Again</button>');
			msg+=('<button class="btn btn-large btn-danger" id="gskipquizbtn" style="display:inline-box;margin-left:10px;" alt=\"Keep existing score, go to next page\">Skip This Quiz</button>');
 			msg+=('<p style=\"clear:both;margin-top:10px;\">This module can not be marked "Complete" until all quizlets have been attempted at least once, AND the "Send Score to MLearning" button is clicked on the <a id=\"\">Score and Status page</a>. Quizzes may be taken multiple times.</p>');
 			$("#dialog-modal").html(msg);
 			//http://stackoverflow.com/questions/13520139/jquery-ui-dialog-cannot-call-methods-on-dialog-prior-to-initialization?rq=1
 			var tryagaindialog = $( "#dialog-modal" ).dialog({
    			dialogClass: "no-close tryagaindialog",
    			close: function(event, ui){ 
					 if(dialogCloseTrigger=="skipQuizBtn"){
					 	$('#content div#div6').html('Skipping quiz. Please choose another page from the menu at left, or <a onclick="nextPage('+params1.qindex+')" style="text-decoration:underline">click here to go to next page</a>');	 	 
					 		setDialogCloseTrigger("");	
					 	}
					 else if(dialogCloseTrigger=="xBtn"){
					 		$('#content div#div6').html('Closed using X Button. Please wait while your results are stored, then the next page will load.'); 
					 		setDialogCloseTrigger(""); 
					 	}
     			 	 else if(dialogCloseTrigger=="startQuizBtn"){
     			 	 	if((params1.type=="C")||(params1.type=="C6")){
     			 	 		$('#content div#div6').html('Launching Quiz');
     			 	 		setDialogCloseTrigger(""); 
     			 	 		}
     			 	 	}
     			 	// setTimeout('nextPage('+params1.qindex+')',1500);
     				},
            	height: 365,
            	width:330,
           		modal: true
       	 		});//$( "#dialog-modal" )     
 			
 		 	 openModalDialog(tryagaindialog);
 		 	 $(".tryagaindialog .ui-dialog-titlebar-close").click(function(){
 		 	 	setDialogCloseTrigger('xBtn');
 		 	 })
 		 	$("#gskipquizbtn").click(function(){
 		 		setDialogCloseTrigger('skipQuizBtn');
 		 		closeModalDialog('#dialog-modal');
 		 		nextPage(params1.qindex);
 		 	}); 
 		 	$("#gtryagainbtn").click(function(){
 		 		var itmno = params1.qindex;  
 		 		console.log('ps[params1.qindex].url='+ps[params1.qindex].url+', ps[params1.qindex].quiz='+ps[params1.qindex].quiz+', ps[params1.qindex].type='+ps[params1.qindex].type+', params1.qindex'+params1.qindex+'.');
 		 		var p2={	
							sScore:0,
							qurl:ps[itmno].url,
							quiz:ps[itmno].quiz,
							type: ps[itmno].type,
							qindex:itmno
						}//end params
				znThisPage = p2.qindex;
				console.log('AHZ znThisPage1='+znThisPage);
				znNextPage = parseFloat(p2.qindex)+1;
				znPrevPage = parseFloat(p2.qindex)-1;	
				wipePageNo();
				wipeNavBar();
				printNavBar();
 		 	 	setDialogCloseTrigger('startQuizBtn'); 				
 		 		closeModalDialog('#dialog-modal');
 		 		quizStart(p2); 
 		 	})
}
function checkDataAttr(){
	if( $('[data-script]').length>0 ){
		$.each($('[data-script]'), function() {
   			$.getScript( $(this).data('script') , function(){
			 	//console.log('data='+ data + ', textStatus='+textStatus+', jqxhr.status='+ jqxhr.status); // Data returned
			 	var checkcounter1 = 0;
			 	checkForObjects(checkcounter1);
			}); 
		});	//end each
	}//end if
}//end function

function makeObjectsOpaque() {
    var elementToAppend = document.createElement('param');
    elementToAppend.setAttribute('name', 'wmode');
    elementToAppend.setAttribute('value', 'opaque');
    var objects = document.getElementsByTagName('object');
    for(var i = 0; i < objects.length; i++) {
        var newObject = objects[i].cloneNode(true);
        elementToAppend = elementToAppend.cloneNode(true);
        newObject.appendChild(elementToAppend);
        objects[i].parentNode.replaceChild(newObject, objects[i]);
    }
}

function checkForObjects(cc){ //prevent flash from overlapping dialogs and other html elements
 	 var objects1 = document.getElementsByTagName('object');
	if(objects1.length > 0){
		//alert('objects1.length='+objects1.length);
		makeObjectsOpaque();	
	}
	else if (cc < 5){
		cc++
		//alert('checkcounter1='+checkcounter1);
		setTimeout('checkForObjects('+cc+')',500);	
	}
	else {}
}

function writeFlash(){
	if( $('#content div#div6 noscript').length ){ //check it for flash. 
		if(IE(8)){ $('#content div#div6 noscript').before( $('#content div#div6 noscript').html() );}
		else{
			//http://code.google.com/p/chromium/issues/detail?id=232410#makechanges
			//safari and chrome render contents of noscript as a string
			var html = $.parseHTML(  $('#content div#div6 noscript').text() );
			$('#content div#div6 noscript').before( html ); 
		}//end else
	}	//end  if							
}
function writeKalturaPlayer(){
	if($("div[id^='kaltura_player_']").length>0){
		$.each( $("div[id^='kaltura_player_']"), function(){							 		 
			var playernum =  this.id.substring(15);
			$(this).append('<h2>Please wait a moment while player loads</h2><img src="images/img/ajax-loader.gif"/>'); //loading image
			$(this).append('<script src="https://cdnapisec.kaltura.com/p/1038472/sp/103847200/embedIframeJs/uiconf_id/20100682/partner_id/1038472?autoembed=true&playerId=kaltura_player_'+playernum+'&cache_st='+playernum+'&width=400&height=680&flashvars[playlistAPI.kpl0Id]=1_hodzk5v2"></script>');
		});							 	
	} //end if
}//end function writeKalturaPlayer
function scormDivToggle(){
	if(trackingmode == "scorm" && APIOK()){
		if( $('#yesAPI').length ){$('#yesAPI').show();}
		if( $('#noAPI').length ){$('#noAPI').hide();}
	}
	
	if(trackingmode == "scorm" && !APIOK()){
		if( $('#yesAPI').length ){$('#yesAPI').hide();}
		if( $('#noAPI').length ){$('#noAPI').show();}
	}//function scormDivToggle()
}

//*****************navigation functions*************//
function customFunction01(){}
function customFunction02(){}//functions that can be redefined in userScripts.js
function customFunction03(){}
function customFunction04(){}
function changeLinks(callback){
	//change all local links to "itm=" ajax links
	 
	var nodes = $("a").not( $("#sidebar-left .main-menu a") ).not($("navbar-inner ul.nav .pull-right a.btn")).not($("#sidebar-left a.expander")).not($("a[target$='blank']")).not($("a[href^='mailto:']")).not($("a[href^='#']")).not($("a[data-link-change='no']")), i = nodes.length;
	//.not($("a[target='_blank']")) hold out resources that open in a new window
	//var regExp = new RegExp("//" + location.host + "($|/)");
	//var regExp = new RegExp("//" + thispathUnEnc + "($|/)");
	//var regExp = new RegExp(thispathUnEnc);
	
	while(i--){
    	var oldhref = nodes[i].href;
    	var isLocal = new RegExp(thispathUnEnc).test(oldhref); 
    	 
    	
    	if(isLocal==true){
    	// nodes[i].style.background = "#FFCC00"; //use this for debugging: local links are colored bright yellow
    		 
    	 
    		$(nodes[i]).click(function(event){
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
	 if(callback) {callback();}
}//end changeLinks()
function determineParents(){ //determines what pages are parents and children for use with the the navbar styles
	 var branch;
	 for(var w=0; w< ps.length; w++) { 
	  if (!branch){ branch=0;}		
         var p = ps[w];
		 var j = (w+1);
		 var k = (w-1);
		 p.branch=branch; 
		 var nextItem = ps[j];
		 var prevItem = ps[k];
		 var level =   p.level;
	     var chapter =  p.chapter;
		 var isParent = p.isParent;
	     if (nextItem){  //if there is a next item...
		       if (nextItem.chapter==chapter && nextItem.level>level){  p.branch=w;branch=w;  p.isParent='parent'; }	 //if next item in same chapter but greater level, this is a parent. set value of branch to i	
	           else {p.isParent='notParent'; 
			          if (prevItem&&level<prevItem.level){p.branch=w;branch=w;} //branches don't revert to the parent branch when level increases so this is needed
			   }//else
		     }//if(nextItem)...
         else{p.isParent='notParent'; break;}
     } //for(var...
     
 
	ns.localStorage.set('pageArray', ps); 
 }  
function writeDocTitle(){  parent.document.title=ms['docTitle']; } 
function writeBreadCrumbs(){
	var bc = '<li class="crumb1"><i class="icon-home"></i><a href="index.htm?itm=0">Home</a><i class="icon-angle-right"></i></li><li class="crumb2"><a class="itm2">'+ps[znThisPage].title+'</a></li>';
	return bc;
}
function printNavToggle(){
	//var nt = ("<li class='navtoggle'><a><img src='images/menu.png'/></a></li>");
	var nt = "";
	 return nt;
}
function printFeedbackLink(){ 
   // document.getElementById('sidebar-left').innerHTML+=("<a href='http://umichumhs.qualtrics.com/SE?SID=SV_1KUWIOAlDJwhgGw&SVID=Prod&URL="+encodeURI(window.location.href)+"&TITLE="+encodeURI(ms['headerTitle'])+"&EMAIL="+encodeURI(ms['contentAuthEmail'])+"' target='_blank' class='feedbackBtn'>Submit Comments or Questions</a>");
	var fl=("<li><a href='http://umichumhs.qualtrics.com/SE?SID=SV_1KUWIOAlDJwhgGw&SVID=Prod&URL="+encodeURI(window.location.href)+"&TITLE="+encodeURI(ms['headerTitle'])+"&EMAIL="+encodeURI(ms['contentAuthEmail'])+"' target='_blank' class='feedbackBtn'>Submit Comments or Questions</a></li>");
	return fl;
}//end printFeedbackLink 

function printContentExpert(){
	if((typeof ms.contentExpert!="undefined")&&(ms.contentExpert!="")){
			var co ="<li><div class=\"navContentExpert\"><ul class='expertlist'>";
		if (ms.contentExpert.length>1){  co+="Content Experts:<br/> ";  }
			$.each(ms.contentExpert,function(k,v){
				if(testing){console.log('k='+k+'ms.contentExpert.length='+ms.contentExpert.length);}
				co += "<a href='mailto:"+ms.contentExpert[k].email+"'>"+ms.contentExpert[k].name+"</a>";
				if(k<ms.contentExpert.length){co+="<br/> ";}
			});//end each
				co += "</ul></div></li>";
	}
	else{//the new contentExpert object doesn't exist, so look for these 2 legacy vars:
		if((ms.contentExpertEmail=="")||(typeof ms.contentExpertEmail=="undefined")){var co="";}
		else{
			var expertName = (typeof ms.contentExpertName!="undefined")?ms.contentExpertName:"Email Content Expert";
			var co=("<li><div class=\"navContentExpert\">Content Expert: <a href='mailto:"+ms.contentExpertEmail+"'>"+expertName+"</a></div></li>");
		}
	}	
	return co;
}

function printContactInfo(){
   // document.getElementById('sidebar-left').innerHTML+=("<div class=\"navContact\" title=\"mlearning@umich.edu 734-615-5146\"><b>Contact Us</b><br>mlearninginfo@umich.edu<br>734-615-5146<br>Fax: 734-615-6021<br>North Campus Research Complex<br>2800 Plymouth Road, Building 200<br>Ann Arbor, MI 48109-2800</div>");
	var ci=("<li><div class=\"navContact\" title=\"mlearning@umich.edu 734-615-5146\"><b>Contact Us</b><br>mlearninginfo@umich.edu<br>734-615-5146<br>Fax: 734-615-6021<br>North Campus Research Complex<br>2800 Plymouth Road, Building 200<br>Ann Arbor, MI 48109-2800</div></li>");
	return ci;
}

function printHelpBtn(){
   // document.getElementById('sidebar-left').innerHTML+=('<a href=\"#\"  onClick=\"MM_openBrWindow(\'includes/help.htm\',\'\',\'scrollbars=yes,resizable=yes,width=908,height=625\')"  id=\"helpButton\" alt=\"How to use this module\"  title=\"How to use this module\">INSTRUCTIONS<\/a>');
    var hb=('<a href=\"#\"  onClick=\"MM_openBrWindow(\'includes/help.htm\',\'\',\'scrollbars=yes,resizable=yes,width=908,height=625\')"  id=\"helpButton\" alt=\"How to use this module\"  title=\"How to use this module\">INSTRUCTIONS<\/a>');
  	return hb;
    }

function printExpander(n){
  if(testing){console.log('in print expander')}
  var exp=('<li><a href=\"#\"  id=\"expander'+n+'\" class=\"expander btn-navbar\" style="display:none">expand all<\/a></li>');
  return exp;
   // document.getElementById('sidebar-left').innerHTML+=('<a href=\"#\" onmousedown=\"toggleByChapter();\" id=\"expander'+n+'\" class=\"expander\">expand all<\/a>');	
    }

function nextPage(pageIndex){
	if(testing){console.log('JJK znThisPage='+pageIndex+', znNextPage'+znNextPage)}
	//pageIndex = (parseFloat(pageIndex) +1);
	var newPage = (parseFloat(pageIndex) +1);
	if(newPage==ps.length){ 
		if(ps[pageIndex].url =="scorePage.htm"){
			var params5 = {
    					itm:pageIndex  	
    				}//end params    					 
    				getContent(params5)
		}
		else {alert('You are on the last page! Use the navigation buttons on the left to complete the module.');}
		
		return;  }
	//note - we are going to hide the unneeded button in the top nav, but in case someone uses these functions elsewhere, the message is still needed.
	if(testing){console.log('GFF  itm= newPage='+newPage)}
	var params ={ itm:newPage  }
 	//ga('send', 'event', 'button', 'click', 'nextPageBtn', justpathnofilename+'/'+ps[newPage].url);//google analytics tracking
 	//ga('send', 'pageview',{'page':justpathnofilename+'/'+ ps[newPage].url});//google analytics: track the ajax loaded page//google analytics tracking
	getContent(params);
}

function prevPage(pageIndex){	
	var pageIndex = (parseFloat(pageIndex) -1);
	if(pageIndex<0){ alert('You are on the first page!');return;  }
	if(testing){console.log('GDD pageIndex='+pageIndex+', znThisPage='+znThisPage)}
	var params ={ itm:pageIndex  }
//ga('send', 'event', 'button', 'click', 'prevPageBtn | on '+justpathnofilename+'/'+ps[pageIndex].url); //google analytics tracking
	//ga('send', 'pageview', {'page':justpathnofilename+'/'+ ps[pageIndex].url,'title': ps[pageIndex].btnTitle}) //google analytics tracking
	getContent(params);
}

function findPageArray(){                           
	if(typeof PageArray!='undefined'){ 
		thePageArray=PageArray;
        if(testing){console.log('CCF thePageArray='+thePageArray+', thePageArray.length='+ thePageArray.length)}
        return thePageArray;   	 
	}
                                                                 
	else if (pcounter<10){ //try again 9 times
		pcounter++;
		if(testing){console.log('CDC pcounter='+pcounter)}
		setTimeout("findPageArray()",250)  
	} //end else if(counter<10)
	
	else{ 
		alert(counter+ ": I couldn't find the list of pages. (\"pageArray\"). Please reload the window. If you continue to see this message, please let the MLearning team know: mlearning@umich.edu");
	}//end else
	
	return;
} //end findPageArray
//*********	 
function writeNewPageNo(){
	var percentOfPagesBrowsed = (parseFloat(znThisPage)+1) / znPages;
	var zWidth = Math.round(percentOfPagesBrowsed * 92);
	if(testing){console.log('percentOfPagesBrowsed='+percentOfPagesBrowsed+' znThisPage='+znThisPage+', znPages'+znPages+', zWidth='+zWidth)}
	var lastPageNo = parseFloat(znPages);
	var pbarhtml = 	'<div id="spaceHolder">'+
						'<div id="utilitiesBar">'+
							'<div id="printBtn" class="icn-print" style="inline-block;margin-right:6px;" onclick="window.print();" title="Print this page">'+
								'&nbsp;'+
							'</div>'+
							'<div id="progressBarContainer">'+
								'<div align=\"left\" id="progressBarHolder">'+
									'<img src=\"images/img/progressBarBG.jpg\" width=\"' + zWidth + '\" height=\"13\" />'+
								'</div>'+
								'<div id="pageNumHolder">'+
									'PAGE ' + (parseFloat(znThisPage) +1) + ' of ' + lastPageNo +
								'</div>'+
							'</div>'+
						'</div>'+
					'<div>';
	if( ($('#banner').length==0) && ($('.dontPrintPageNo').length==0) ){
		$(pbarhtml).prependTo('#content div#div5');
		} 
  }	
  
function wipePageNo(){
	if($('#spaceHolder').length > 0){
		$('#spaceHolder').remove();
	} 
}

function wipeNavBar(){
	$('#sidebar-left').children().remove();//wipenavbar
}

function chooseButtonSet(){  
var	ms = ns.localStorage.get('moduleVars');
var moduletype = ms.moduletype;
if(testing){console.log('in chooseButtonSet moduletype=' + moduletype);}
    if  ( typeof customBtnArray=="undefined"){
        switch (moduletype){
            case 0: //show NO buttons at all
            	btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-", showNxtBtn:false, nxtTxt:"-", hideEndBtn:true, endTxt:"-" }); break;     
            case 1: //1-sco module, unscored: Show Finish Later and End Lesson buttons
           		btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"Next Section", hideEndBtn:false, endTxt:"Mark Complete" }); break;                                                
            case 2: //1-sco module, Scored (contains embedded quiz)
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"-", hideEndBtn:true, endTxt:"-"  }); break;
			case 3: //multi-sco module intermediate (not final sco) Unscored SCO, not just before standalone quiz
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:true, nxtTxt:"Next Section", hideEndBtn:true, endTxt:"-"  }); break;
			case 4: //multi-sco module intermediate (not final sco) Unscored SCO, just before Quiz 
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:true, nxtTxt:"Go to Quiz", hideEndBtn:true, endTxt:"-"  }); break;
			case 5: //multi-sco module final sco, Scored, contains embedded quiz
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"-", hideEndBtn:true, endTxt:"-"  }); break;                       
			case 6: //multi-sco module final sco, Unscored, does NOT contain any quiz
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-", showNxtBtn:false, nxtTxt:"-", hideEndBtn:false, endTxt:"Mark Section Complete"  }); break;
			case 7: //show only end this lesson button with mark complete label
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-",  showNxtBtn:false,  nxtTxt:"-",  hideEndBtn:false, endTxt:"Mark Complete"  }); break; 
			case 8: //all 3 buttons just in case 
				btnArray = new Array( { hideSuspendBtn:false, suspendTxt:"Finish Later", showNxtBtn:true, nxtTxt:"Next Section", hideEndBtn:false, endTxt:"Mark Complete" }); break; 
			case 9: //just show next section button, just in case
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"-", showNxtBtn:true, nxtTxt:"Next Section", hideEndBtn:true, endTxt:"-"  }); break;
			default : //assuming it is a 1-sco, scored with embedded quiz
				btnArray = new Array( { hideSuspendBtn:true, suspendTxt:"Finish Later", showNxtBtn:false, nxtTxt:"Next Section", hideEndBtn:true, endTxt:"Mark Complete"  }); break;
		}//end switch
		
	}//end if((customBtnArray...
    else{ 
        var customBtns = customBtnArray;
        for(var b=0; b< customBtns.length; b++){
        	var bhr= customBtns[b].href, bttl= customBtns[b].title, btxt=customBtns[b].txt, bclk=customBtns[b].clk, bcls=customBtns[b].cls, bid=customBtns[b].id;
        	//document.getElementById('NavBar').innerHTML+=('<a href=\"'+bhr+' \" onclick=\"'+bclk+'\" id=\"'+bid+'\" class=\"'+bcls+'\" title=\"'+bttl+'\">'+btxt+'<\/a>');
        	//NEED TO FIX THIS SECTION
        	}//end for
        
    }//end else
    return btnArray;
 }//end chooseButtonSet()                               

function printScormButtons(){
	var scormbuttonStr ='';
	var nnb, ssb, eeb;
    if(APIOK()){		 											
		chooseButtonSet();
		if(testing){ console.log('pageNavigation AAA writing buttons, btnArray[0].suspendTxt='+btnArray[0].suspendTxt) }
		if(btnArray[0].showNxtBtn) { 	 scormbuttonStr+= writeNextButton(btnArray[0].nxtTxt)}
		if(!btnArray[0].hideSuspendBtn){ scormbuttonStr+= writeSuspendButton(btnArray[0].suspendTxt) }										
		if(!btnArray[0].hideEndBtn) {	 scormbuttonStr+=	 writeEndButton(btnArray[0].endTxt)}	
		return scormbuttonStr;
	}//end if(APIOK()
	else{
		var indicatorString='<div id="apiIndicator">';
	    indicatorString+='<div id="modeExplanationContainer" style="display:none;">You are in Unscored Mode because you did not enroll in this module through MLearning.</br>No score will be recorded in your MLearning Transcript but you may use these materials for reference. <\/div><\/div>';
	    indicatorString+='<li><a href="images/img/searchToEnrollInstructions.pdf" target="_blank" id="showUnscoredExample"  onMouseDown="event.cancelBubble=true;">see Example</a></li>';
		return indicatorString;
	}
	
}//end printScormButtons			  

function bookmarkAlert() {
	//if this is the first page, and there is a stored bookmark show alert if module is long
 if(testing){console.log('XDEin bookmarkAlert') }
		if ((typeof thePageArray[0].askedbookmark=="undefined")&&(znPages>15)){ 	
			if( ((znThisPage) == 1 ) && (SCOGetValue('cmi.core.lesson_location')!='')){
				thePageArray[0].askedbookmark = true;
				var answer = confirm('You have a saved bookmark. Would you like to return to that location now?')
				if (answer){ getContent(SCOGetValue('cmi.core.lesson_location'));  }
				else{}
			}//  if( ((window.parent.data.znT
		}//end iftypeof thePageArray[0].askedbookmark)
}//end bookmarkAlert

function writeEndButton(txt){
    var endText = (endText?endText:txt);      
	var eb=("<li><a href='#'  class='endLesson' id='endLesson' title='Mark this lesson complete' onclick='closingActions(this.id);return false;'>"+endText+"</a></li>");   
	return eb;
}//end writeEndButton

function writeNextButton(txt){
    var nextText = (nextText?nextText:txt);     
    var nb=("<li><a href='#'  class='nextLesson'  id='nextLesson' title='Mark this lesson complete' onclick='nextActions(this.id);return false;'>"+nextText+"</a></li>");    
	return nb;
}//end writeNextButton

function writeSuspendButton(txt){
	var suspendText = (suspendText?suspendText:txt);                   
   	var sb=("<li><a href='#' class='suspendLesson' id='suspendLesson'  title='Stop for now and come back later to finish' onclick='suspendActions(this.id);return false;'>"+suspendText+"</a></li>");                       
	return sb;
}//end writeSuspendButton

function nextActions(id){   
   if(typeof id !="undefined"){showSpinner(id)}  
   	g_gbGoingToNextSco = true;
   	ns.localStorage.removeAll(); 
  	SCOSetValue("cmi.core.lesson_status","completed");
   	SCOSetValue("cmi.core.exit","");
    SCOSaveData();                      
    SCOFinish();//sets gbfinishdone                      
}

function closingActions(id){
    if (APIOK()){	    	
    	if(typeof id !="undefined"){showSpinner(id)}  		
	   	SCOSetValue("cmi.core.lesson_status","completed");
		SCOSetValue("cmi.core.exit","");
		SCOSaveData();
		if(cookieVrsn){SetCookie('cVrsn',"",-1);}
		ns.localStorage.removeAll(); 
		SCOFinish();//sets gbfinishdone			
	}//end  if (parent.APIOK())
}//end closingActions

function suspendActions(id){
 	if (APIOK()){
 		if(typeof id !="undefined"){showSpinner(id)} 
 		//ga('send', 'event', 'button', 'click', 'suspendbutton', 'suspend button  |  page ' +justpathnofilename+'/'+ps[znThisPage].url);//google analytics tracking
 		ns.localStorage.removeAll();
		SCOSetValue("cmi.core.lesson_status","incomplete");
		SCOSetValue("cmi.core.exit","suspend");
		g_bIsSuspended = true;
		SCOCommit(); 
        SCOFinish();	    
	}//if (parent.APIOK(
}//end suspendActions

function showSpinner(id){
	$('#'+id).html('<img src="images/img/ajax-loader-1.gif" class="spinnerImg">');
}
function quizStart(p3){		
		var quiztype =typeof p3.type!="undefined" ? p3.type : "Q";	
		var quiz = p3.quiz;
		var qindex = p3.qindex;
		var qurl = p3.qurl;//not really needed!
		
		var qserver = (typeof p3.quizserver!="undefined")&&(p3.quizserver!="")?p3.quizserver:null; //if a quiz server is specified in the params, then use it.
		var qmarkServer;//this will store the real full URL of the questionmark server once we've figured it out.
		
		dialogCloseTrigger="";
		if(quiztype=="C"){
			 quiztype = (qurl.indexOf('captivate6Wrap')!=-1)?"C6":"C"
			}
		//console.log('AAAP p3.type='+p3.type+', p3.quiz='+p3.quiz+', p3.qindex='+', p3.qurl='+p3.qurl);
		switch(quiztype)
			{
			case "Q":
			  if(testing){console.log('ABA quiztype='+quiztype+' quiz='+quiz+' qindex='+ qindex+', document.location.href='+document.location.href)}
				if( trackingmode=="scorm" && APIOK() ){
					currentloc = document.location.href;
					//if(testing){console.log('ABA currentloc= '+currentloc)}
					
					//if there is a quiz server specified using svr property in the pagearray, then use it.
					//if there is not a svr property in page array, then figure it out based on what the current domain is

					if (qserver!=null){ 
						switch (qserver) {
						case 'pr': 
						qmarkServer = 'https://mlearningquiz5.med.umich.edu';
						console.log('case pr');
						break;
						
						case 'au': //author
						qmarkServer = 'http://uhqmkappsts1.umhs.med.umich.edu';
						break;
						 
						case 'dv': //test quiz server was specified explicitly in page array 
						qmarkServer = 'http://uhqmkappsdv1.umhs.med.umich.edu';
						break;
						 
						default:
							qmarkServer = 'https://mlearningquiz5.med.umich.edu';
						}//end switch(qserver)					
					}//if (qserver!=null)
					
					else { 
						console.log('FTR window.location.hostname'+window.location.hostname);
						
						switch(window.location.hostname) {
								case 'mlearningcontent2.med.umich.edu':
								qmarkServer = 'https://mlearningquiz5.med.umich.edu';
								console.log('aa');
								break;
								case 'mlearningqa.med.umich.edu':
								qmarkServer = 'https://mlearningquiz5.med.umich.edu';
								console.log('bb');
								break;
								case 'trainingportal.med.umich.edu':
								qmarkServer = 'https://mlearningquiz5.med.umich.edu';
								console.log('cc');
								break;
							default:
								qmarkServer = 'https://mlearningquiz5.med.umich.edu';
									console.log('ff');
							}	//switch(window.location.hostname)
					 } //else
					
					
					var n = currentloc.lastIndexOf("/");
					currentloc = currentloc.slice(0,n);
					currentloc = currentloc+"/perceptionQuizWrap.htm";
					var underscore = sName.lastIndexOf("_"); //test for scorm engine style student name
					var participantID;
					if(underscore != -1){ //if underscore, remove everything to left and including underscore.
						participantID= sName.slice(underscore+1);
						if(testing){console.log("underscore="+underscore+" sName="+sName+" participantID= "+participantID);}
						}
					else{participantID=sName;}
					
					if(testing){
						console.log('GPE currentloc= '+currentloc+ 'p3.qurl'+p3.qurl);
						console.log("GPF documentlocation= "+  qmarkServer+"/perception5/session.php?session="+quiz+"&call=onepagewrap&name="+participantID+"&details="+sDetails+"&home="+currentloc+"&itm="+qindex);
					}
				 document.location = qmarkServer+"/perception5/session.php?session="+quiz+"&call=onepagewrap&name="+participantID+"&details="+sDetails+"&home="+currentloc+"&itm="+qindex;		
			 		}
			 		
			 		else {
			 			alert('You need to launch the module from your Learning Plan in order to complete the quiz. Redirecting to the next page ');
			 			nextPage(qindex);
			 			}
			 break;
			case "U":
			 	if(testing){console.log('ggg quiztype='+quiztype+' quiz='+quiz+' qindex='+ qindex+', document.location.href='+document.location.href)}
				if(testing){console.log('ggg qurl='+qurl);}
				//currentloc = document.location.href.slice(0,-1); //this slices off the /# from the end of the url
				if( trackingmode=="scorm" && APIOK() ){
					currentloc = document.location.href;
					var qualtricsURL;
					if(qurl.lastIndexOf('qualtricsWrap.htm?href=')!=-1){
						qualtricsURL = qurl.slice(23);//number of chars in the string 'qualtricsWrap.htm?href='
					}
					else{  qualtricsURL = qurl }//in future, we will specify qualtrics href's without the qualtricsWrap piece in the pageArray
					var n = currentloc.lastIndexOf("/");
					currentloc = currentloc.slice(0,n);
					currentloc = currentloc+"/qualtricsQuizWrap.htm"
					//console.log('ggg currentloc= '+currentloc);
					var pr = currentloc +'&itm='+qindex;//need to add itm to the end of the return URL without having to alter a jillion existing quizzes.
					var encpr = encodeURIComponent(pr);
					//console.log('pr='+pr+', encpr='+encpr);
					qualtricsURL += '&id=' + sName + '&url=' + encpr + '&fn=' + sDetails + '&obj='+ quiz;
    				 						
					document.location = qualtricsURL;	
			 		}
			 		
			 		else {
			 			 //var aznthispage = parseInt(qindex,10)
			 			alert('You need to launch the module from your Learning Plan in order to complete the quiz. Redirecting to the next page');
			 			nextPage(qindex);
			 			}
			  break;
			case "I":
			var p6 = { itm:qindex}			
			 getContent(p6);
			  break;
			case "C":
			// console.log('C');
			  break;
			case "C6":
				
			 
			 	var captivateHTML = '<div id="CaptivateContent" style="height:100%;width:100%;"></div>'+
					'<div id="messageDiv" style="display:none;padding:24px;width:659px;margin:auto;font:18px Arial, Helvetica, sans-serif;"></div>'+
	 				'<div id="finishedDiv" style="display:none;padding:24px;width:659px;margin:auto;font:18px Arial, Helvetica, sans-serif;">'+
      				'This quizlet has been completed.<br />'+
      				'<a href="javascript:nextPage();">Continue to next page of module</a></div><div id="output"></div>';
     				 $('#content div#div6').html('loading...'); 
     				
     				if( trackingmode=="scorm" && APIOK() ){
						var attr = {'wmode':'transparent','scale':'showall'}
						var iSwf = qurl.split("=")[1].split("&")[0];
						var iWidth = qurl.split("w=")[1].split("&")[0];
						var iHeight = qurl.split("h=")[1].split("&")[0];;
					
						if($( "#dialog-captivate" ).length==0){
							$('body').append('<div id="dialog-captivate" style="display:none; z-index: 999;"></div>');
							}
						
						/*testing fullscreen captivate quiz*/
						
						openSwf(iSwf);
						
						/*$( "#dialog-captivate" ).dialog({
							close:true,
							height: parseFloat(iHeight)+40,
							width: parseFloat(iWidth)+40,
							modal: true 
						}); 
						$( "#dialog-captivate" ).html(captivateHTML);
						swfobject.embedSWF(iSwf, "CaptivateContent", iWidth, iHeight, "9", "expressInstall.swf", attr, null, null );
							 $("#dialog-captivate").dialog("option", "position", {//this is the callback function
									my: "center",
									at: "center",
									of: window
								});   	
						 openModalDialog("#dialog-captivate");
						 
						 */
						 
						 
						 $('#content div#div6').html('If you are not redirected after completing or closing quiz, choose another page from menu at left or <a onclick="nextPage('+p3.qindex+')" style="text-decoration:underline">click here to go to next page</a>.'); 
			 		}//end if( trackingmode=="scorm" && APIOK() ){
			 		else {
			 			alert('You need to launch the module from your Learning Plan in order to complete the quiz. Redirecting to the next page');
			 		nextPage(qindex);
			 		}
			 
			  break;
			  
			  case "H":
			  
			  //document.location = 'captivate/Cap8-1questionQuiz/index.html?p='+qurl+'&itm='+qindex+'&obj='+quiz;
		  	  document.location = qurl+'?p='+qurl+'&itm='+qindex+'&obj='+quiz+'&h='+thispath;
	 
			  break;
			default:
			 // code to be executed if n is different from case 1 and 2
			}//end switch quiztype
		
}//end quizStart

function turnOnMsg(){   $('#myModal').modal('show');} 
function turnOffMsg(){ $('#myModal').modal('hide');}
function writeHeaderTitle(){ $("#hdrTitle>h1").html( ms.headerTitle );}
//https://github.com/julien-maurel/jQuery-Storage-API

/*Captivate Functions move to another file or dynamically load*/
function getMyData(){
	cp = document.CaptivateContent;
    bMax = cp.cpEIGetValue('m_VarHandle.cpQuizInfoTotalQuizPoints');
    bScore = cp.cpEIGetValue('m_VarHandle.cpQuizInfoPointsscored');
    aPercentScore = bMax!=0?bScore/bMax:1;//if max points are zero, then user got 100 no matter what.
	bPercentScore = aPercentScore*100;         
    if(testing){console.log('bMax='+bMax+', bScore'+bScore+', bPercentScore= '+ bPercentScore );}
    //use for printing out all values from the captivate quiz          
   // $.each(cp.cpEIGetValue('m_VarHandle'), function(name, value){
   // 	if(testing){console.log(name + ": " + value);} //logs value of every single property of the current captivate object (long!)
   //  }); 		 
	if (APIOK()){	
		qPage = ps[znThisPage];//fixed 5-26-16
		var objectiveID = "C"+qPage.quiz;						 
		var fin=1;
		$('#content div#div6').html('Storing your score. If you are not redirected after completing or closing quiz, choose another page from menu at left.'); 
		 
		closeModalDialog("#dialog-captivate");				
		MarkCap6ObjectiveDone(bScore,bMax,objectiveID);//these quizzes are considered done once you take them, no matter the score.
		ps[znThisPage].qScore = bScore;
		ps[znThisPage].qMax = bMax;
		ns.localStorage.set('pageArray', ps); //store "ps" data into local storage.
		nextPage(znThisPage);   	 
	 }//end if (parent.APIOK())
}

//send quiz score data to the LMS for a captivate 6 quiz
function MarkCap6ObjectiveDone(score,max,objectiveID){
 	 if (testing){console.log("In MarkObjectiveDone: score = "+score+", max="+max+", objectiveID= "+objectiveID)}
  	SCOSetObjectiveData(objectiveID, "status", "completed");
	SCOSetObjectiveData(objectiveID, "score.raw", bScore);
	SCOSetObjectiveData(objectiveID, "score.max", bMax);
	SCOCommit();
	} //end MarkCap6ObjectiveDone
	 	 
function openSwf(swf){	//call a full window captivate like this: onclick="openSwf('captivate/captivate6.swf');"
	if ($( "#dialog-captivate" ).length==0){$('body').append('<div id="dialog-captivate" style="display:none; z-index: 999;"></div>')	}
   var attr = {'wmode':'transparent','scale':'showall'}
   var wheight =  $(window).height();   // returns height of browser viewport
   var wwidth = $(window).width(); 
   var capHTML = '<div id="CaptivateContent" style="" class="span10"></div>';
   
   $( "#dialog-captivate" ).dialog({
   							close:true,
   							closeText: "CLOSE",
							height: wheight,
							width:  wwidth,
							modal: true }); 

//http://stackoverflow.com/questions/1790724/jquery-ui-dialog-cannot-see-the-closetext
//get the automagically created div which represents the dialog
//var closeSpan = $("#dialog-captivate2 span.ui-icon-closethick");
//var closeSpan = $("div[role='dialog'] span.ui-icon-closethick");
var closeSpan = $("div[aria-describedby='dialog-captivate'] span.ui-icon-closethick");

//then get the span which has `ui-icon-closethick` class set (== contains closeText)
//prepend a span with closeText to the closing-image
if ($('#closeTitle').length==0){
	closeSpan.parent().before(
	'<span style="float:right;margin-right:18px;font-weight:normal;font-size:small;" id="closeTitle" onmousedown=" $( \'#dialog-captivate\' ).dialog(\'close\')">'+
	  $( "#dialog-captivate" ).dialog("option","closeText")+ '</span>' );
	}
   
    $( "#dialog-captivate" ).html(capHTML); 
        
    openModalDialog("#dialog-captivate");	
     						
     						
    swfobject.embedSWF(swf, "CaptivateContent",  "95%",  "99%", "9", "expressInstall.swf", attr, null, null );
						
	$("#dialog-captivate").dialog("option", "position", {//this is the callback function
				my: "center",
				at: "center",
				of: window
			});  // $("#dialog-captivate").dialog	
  }
  
    