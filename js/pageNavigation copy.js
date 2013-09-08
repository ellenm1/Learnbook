/*v 1.21 1/16/13 emeiselm */
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
 
var testing = parent.testing;

  //turn to true to show debugging information for this script
 
var pageNo;  
var currentPage;
var znThisPageLocal;
var znPages;
var thispage = (document.location.href); 
var cleanURL;
var thePageArray;
var moduletype = (window.parent.data.moduletype?window.parent.data.moduletype:2);
var currentPage;
if(testing){console.log('moduletype is '+moduletype);}
var pcounter  = 0; 
var pcounter2 = 0;
var pcounter3 = 0;

function chooseButtonSet(){  
    if  ((!window.parent.data.customBtnArray) || (typeof window.parent.data.customBtnArray=="undefined")){
        switch (moduletype ){
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
        var customButtons = window.parent.data.customBtnArray;
        for(var b=0; b< customBtns.length; i++){
        	var bhr= customBtns[b].href, bttl= customBtns[b].title, btxt=customBtns[b].txt, bclk=customBtns[b].clk, bcls=customBtns[b].cls, bid=customBtns[b].id;
        	document.getElementById('NavBar').innerHTML+=('<a href=\"'+bhr+' \" onclick=\"'+bclk+'\" id=\"'+bid+'\" class=\"'+bcls+'\" title=\"'+bttl+'\">'+btxt+'<\/a>');
        }
    }
 }//end chooseButtonSet()                               

function printScormButtons(){
    if(parent.APIOK()){
		if(typeof document.getElementById('mlearningControls')!="undefined"){ 
			document.getElementById('mlearningControls').innerHTML=(''); 
		}											
		chooseButtonSet();
		if(testing){ console.log('pageNavigation AAA writing buttons, btnArray[0].suspendTxt='+btnArray[0].suspendTxt) }
		if(btnArray[0].showNxtBtn) {writeNextButton(btnArray[0].nxtTxt);}
		if(!btnArray[0].hideSuspendBtn){ writeSuspendButton(btnArray[0].suspendTxt); }										
		if(!btnArray[0].hideEndBtn) {writeEndButton(btnArray[0].endTxt);}
	}//end if(parent.APIOK()
}//end printScormButtons			  

function findPageArray(){                           
    //this is to accomodate whether viewing module direct, or within the scorm adaptor frameset                           
   
	//if( window.parent.data.PageArray&&(typeof window.parent.data.PageArray!='undefined') ){ 
	if(typeof window.parent.data.PageArray!='undefined'){ 
		thePageArray=window.parent.data.PageArray;
		if(testing){console.log('CCD thePageArray='+thePageArray)}
		znPages = thePageArray.length;
        if(testing){console.log('CCF znPages='+ znPages)}
        return thePageArray;   
	 
	}
	else if(typeof parent.data.PageArray!='undefined'){
		thePageArray=parent.data.PageArray;
		if(testing){console.log('DCE thePageArray='+thePageArray)}
		znPages = thePageArray.length;
        if(testing){console.log('DCG znPages='+ znPages)}
        return thePageArray;   	 
	}
       
                                                           
	else if (pcounter<10){ //try again 9 times
		pcounter++;
		setTimeout("findPageArray()",250)  
	} //end else if(counter<10)
	
	else{ 
		alert(counter+ ": I couldn't find the list of pages. (\"pageArray\"). Please reload the window. If you continue to see this message, please let the MLearning team know: mlearning@umich.edu");
	}//end else
	
	return;
} //end findPageArray

  
function getCurrentPage(){ 
//matches current url to item# in pageArray and sets persistent var znThisPage to that #
    for(var p=0; p< znPages; p++) {                        
		cleanURL =  (thePageArray[p].url).split('&',1)                    
   		if ((thispage).indexOf( thePageArray[p].url) !=-1 ) {                       
            window.parent.data.znThisPage = (p+1); //sets persistent var znThisPage
            if(testing){console.log('VVD window.parent.data.znThisPage='+ window.parent.data.znThisPage+', parent.data.znThisPage='+ parent.data.znThisPage)}                 
	        currentPage= thePageArray[p];
	        if(pcounter2<10){
	   			pcounter2++;
				if(typeof currentPage=="undefined"){ setTimeout("getCurrentPage()",250); }	
				if(testing){console.log('GGE pcounter2= '+pcounter2)} 
			}
        }
    }
    return {};  
}//end getCurrentPage

function printFeedbackLink(){ 
    var contentAuthor=parent.data.contentAuthorEmail?parent.data.contentAuthorEmail:''; 
    var headerTitle=parent.data.headerTitle?parent.data.headerTitle:'';
    document.getElementById('navbarBottom').innerHTML+=("<a href='http://umichumhs.qualtrics.com/SE?SID=SV_1KUWIOAlDJwhgGw&SVID=Prod&URL="+encodeURI(window.location.href)+"&TITLE="+encodeURI(headerTitle)+"&EMAIL="+encodeURI(contentAuthor)+"' target='_blank' class='feedbackBtn'>Submit Comments or Questions</a>");
}//end printFeedbackLink 

function printContactInfo(){
    document.getElementById('navbarBottom').innerHTML+=("<div class=\"navContact\" title=\"mlearning@umich.edu 734-615-5146\"><b>Contact Us</b><br>mlearninginfo@umich.edu<br>734-615-5146<br>Fax: 734-615-6021<br>North Campus Research Complex<br>2800 Plymouth Road, Building 200<br>Ann Arbor, MI 48109-2800</div>");
}
function printHelpBtn(){
    document.getElementById('NavBar').innerHTML+=('<a href=\"#\"  onClick=\"MM_openBrWindow(\'includes/help.htm\',\'\',\'scrollbars=yes,resizable=yes,width=908,height=625\')"  id=\"helpButton\" alt=\"How to use this module\"  title=\"How to use this module\">INSTRUCTIONS<\/a>');
    }
function printExpander(){
    document.getElementById('NavBar').innerHTML+=('<a href=\"#\" onmousedown=\"toggleByChapter();\" id=\"expander\">expand all<\/a>');	
    }
function printNavBar(){
 // if(parent.justOpened){
     //	if(testing){console.log('waiting for just opened to be false');}
     	//setTimeout('findPageArray()',1000);
     //findPageArray();
     //	}
	var urls='';
	var urlStr='';
	var pa = findPageArray();
	
	if((typeof pa=="undefined")||(pa.length==0)){ 
	   	if(pcounter2<10){
	   		pcounter2++;
	    	if(testing){console.log('AAE pcounter2= '+pcounter2)}
	    	document.getElementById('NavBar').innerHTML=("");
			setTimeout("findPageArray();",550);
			return; 
			}
		else{console.log('I tried to find pa more than 10 times');}
	}
	getCurrentPage();
	
	if(testing){console.log('GGF currentPage= '+currentPage)} 
	pageNo=window.parent.data.znThisPage;//just storing this in the myStage frame in case needed
	printExpander();
	if(document.getElementById('pdfForm')){
		urls = ('<input name="uPath" type="hidden" value="'+document.location.href+'" />');
		urls+=('<input name="uUrl" type="hidden" value="'); 	  
	}
	                
for(var i=0; i< pa.length; i++) {	
		var x=window.parent.data.znThisPage-1;	
		if((typeof thePageArray=="undefined")||(thePageArray=="null")||(!thePageArray)){ 
			findPageArray();
			if(testing){console.log('BZZ typeof thePageArray= '+typeof thePageArray)}
		}
		 
		var p = thePageArray[i];						 
		var j = (i+1);
		var k = (i-1);
		var nextItem = thePageArray[j];
		var prevItem = thePageArray[k];
		var level =   p.level;
		var isquiz = (p.quiz)?'quiz':'notquiz';
		var isScorePage;
		var chapter = p.chapter;
		var isParent= p.isParent;
		var branch=   p.branch; 
		var url =     p.url;
		var buttonTitle =   p.buttonTitle;
		var pageTitle =     p.pageTitle;
		var expand = 'closed';
		var current = ' ';  
		if(url=="scorePage.htm"){ isScorePage = 'isScorePage';buttonTitle='Submit Score & Complete'; }
		if (i==x){ current = 'current';expand='open'; }
		if (level==1){expand='open';}
		else if (currentPage.level>level&&currentPage.chapter==chapter &&currentPage.branch==branch){expand='open'} 	  //if currentPage is a direct child of i
		else if (currentPage.branch==branch && (currentPage.level==level||level==currentPage.level+1)){expand='open'} 	  //current page on same level And in same branch
		else if (currentPage.chapter==chapter && level==2){expand='open'} 
		else {expand='closed';}
					
		document.getElementById('NavBar').innerHTML+=('<a href="' + url +  '" class= "' +current + ' ' + 'navlevel' + level +   ' chapter' + chapter + ' ' + expand  +' ' + isParent  + ' '+isquiz+' ' + isScorePage+'">' + buttonTitle + '</a>');
		if(!p.quiz){ urlStr += (url+ ';'); }
	} //end of for(var i=0 loop
					
	urls +=( urlStr+'" />');//new 8-12-07
	if(document.getElementById('pdfForm')){ document.getElementById('pdfForm').innerHTML+=urls;	 }
	setHdrBtns();//new 8-8-07
	printExpander();
	//add buttons if under scorm engine control
	printScormButtons();
	printFeedbackLink()
	printContactInfo();
	writeNewPageNo();  
	writeHeaderTitle();
	parent.SCOBookmark(); 
 } //end printNavBar()                    

function setHdrBtns(){
	if (window.parent.data.znThisPage==1){
	   document.getElementById('prevBtn').src = 'images/header/hdr_Middle.jpg';
	   document.getElementById('ftrPrevBtn').src = 'images/footer/footer_Middle.jpg';
	   document.getElementById('headerPrev').onmouseover= function(){ };
	   document.getElementById('footerPrev').onmouseover=function(){ };
	}
	else if (window.parent.data.znThisPage==znPages){
		document.getElementById('nextBtn').src = 'images/header/up/Next_btnBlank.jpg';
		document.getElementById('ftrNextBtn').src = 'images/footer/up/footer_Next_btnBlank.jpg';
	   document.getElementById('headerNext').onmouseover= function(){ };
	   document.getElementById('footerNext').onmouseover=function(){ };
	} 
} //end setHdrBtns  
 
function wipeNavBar(){ document.getElementById('NavBar').innerHTML = ('');  }

function NavigateObject(){
  	this.NextPage = NextPage
  	this.PreviousPage = PreviousPage
  	this.FirstPage = FirstPage 
}

function NextPage(){
	if(!window.parent.data.znThisPage){window.parent.data.znThisPage=pageNo;}
   	if((window.parent.data.znThisPage + 1)<= znPages){
     	window.parent.data.znThisPage++;
        document.location.href =  parent.data.PageArray[window.parent.data.znThisPage-1].url;
  	}
	else alert('End of Module');
}  

function PreviousPage(){
	if(!window.parent.data.znThisPage){window.parent.data.znThisPage=pageNo;}
    if((window.parent.data.znThisPage) > 1 ){
    	window.parent.data.znThisPage--;
    	document.location.href =  parent.data.PageArray[window.parent.data.znThisPage-1].url;
    }
	else{alert("This is the first page of the module"); }    
} 

function writeNewPageNo(){
	if(testing){console.log('BEG thePageArray.length= '+thePageArray.length+' thePageArray[0].url=' +thePageArray[0].url)}
	//var chapter =  thePageArray[window.parent.data.znThisPage-1].chapter;
	//var realChapterNo = (chapter + 1);
	var percentOfPagesBrowsed =  window.parent.data.znThisPage / znPages;
	var zWidth = Math.round(percentOfPagesBrowsed * 75);
	if (document.getElementById('pageNumberHolder')){
		document.getElementById('pageNumberHolder').innerHTML += ('<table width="75" ><tr><td align=\"left\" id="progressBarCell"><img src=\"images/progressBarBG.jpg\" width=\"' + zWidth + '\" height=\"13\" /> </td></tr><tr><td class="pageNoHolder">PAGE ' +  window.parent.data.znThisPage + ' of ' + znPages +'</td></tr></table>');											
	} 
	else { };
  }	
  
function wipePageNo(){
	if(document.getElementById('pageNumberHolder')){
		document.getElementById('pageNumberHolder').innerHTML=("");
	} 
}

function writePageTitle(){
   //ellen removed this for now - 09.29.11
	/*	var chapter =  parent.data.PageArray[window.parent.data.znThisPage-1].chapter;
		var realChapterNo = (chapter + 1);
		var   percentOfPagesBrowsed =  window.parent.data.znThisPage / znPages;
		var zWidth = (percentOfPagesBrowsed * 75);
		if (document.getElementById('pageTitle')){
			document.getElementById('pageTitle').innerHTML = ('<span class="chapterTitle">' +parent.data.chapterArray[chapter].chapterTitle + '</span> ' + window.parent.data.PageArray[window.parent.data.znThisPage-1].title);
		}
		else { };*/
}	
function writeHeaderTitle(){
	var headerTitle=parent.data.headerTitle;
    document.getElementById('title').innerHTML = headerTitle;	
}	

function bookmarkAlert() {
	//if this is the first page, and there is a stored bookmark show alert if module is long
//	if(testing){console.log('XDE typeof thePageArray='+typeof thePageArray) }
		if ((typeof thePageArray[0].askedbookmark=="undefined")&&(znPages>15)){ 	
			if( ((window.parent.data.znThisPage) == 1 ) && (parent.SCOGetValue('cmi.core.lesson_location')!='')){
				thePageArray[0].askedbookmark = true;
				var answer = confirm('You have a saved bookmark. Would you like to return to that location now?')
				if (answer){ document.location.href=parent.SCOGetValue('cmi.core.lesson_location');  }
				else{}
			}//  if( ((window.parent.data.znT
		}//end iftypeof thePageArray[0].askedbookmark)
}//end bookmarkAlert

function writeEndButton(txt){
    var endText = (parent.data.endText?parent.data.endText:txt);
    document.getElementById('NavBar').innerHTML+=("<a href='#'  class='endLesson' id='endLesson' title='Mark this lesson complete' onclick='closingActions();return false;'>"+endText+"</a>");   
}//end writeEndButton

function writeNextButton(txt){
    var nextText = (parent.data.nextText?parent.data.nextText:txt);
    document.getElementById('NavBar').innerHTML+=("<a href='#'  class='nextLesson'  id='nextLesson' title='Mark this lesson complete' onclick='nextActions();return false;'>"+nextText+"</a>");    
}//end writeNextButton

function writeSuspendButton(txt){
    var suspendText = (parent.data.suspendText?parent.data.suspendText:txt);
    if(testing){ console.log('parent.data.suspendText='+parent.data.suspendText+', txt='+txt); }
    document.getElementById('NavBar').innerHTML+=("<a href='#' class='suspendLesson' id='suspendLesson'  title='Stop for now and come back later to finish' onclick='suspendActions();return false;'>"+suspendText+"</a>");                       
}//end writeSuspendButton

function nextActions(){   
    parent.g_gbGoingToNextSco = true;
    parent.SCOSetValue("cmi.core.lesson_status","completed");
    parent.SCOSetValue("cmi.core.exit","");
    parent.SCOSaveData();                      
    parent.SCOFinish();//sets gbfinishdone                      
}

function closingActions(){
    if (parent.APIOK()){	   		
	   	parent.SCOSetValue("cmi.core.lesson_status","completed");
		parent.SCOSetValue("cmi.core.exit","");
		parent.SCOSaveData();
		if(parent.data.cookieVrsn){parent.SetCookie('cVrsn',"",-1);}
		parent.SCOFinish();//sets gbfinishdone			
	}//end  if (parent.APIOK())
}//end closingActions

function suspendActions(){
 	if (parent.APIOK()){
		parent.SCOSetValue("cmi.core.lesson_status","incomplete");
		parent.SCOSetValue("cmi.core.exit","suspend");
		parent.g_bIsSuspended = true;
		parent.SCOCommit(); 
        parent.SCOFinish();	    
	}//if (parent.APIOK(
}//end suspendActions

 