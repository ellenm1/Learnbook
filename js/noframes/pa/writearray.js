//v. 1.5 02.07.12 emeiselm

//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = true;
var intformIsOpen=false;

function createArray(){
    var doctitle= document.titleform.doctitle.value;
    var headertitle=document.titleform.hdtitle.value;
	 	 
	var o="var PageArray = new Array(  \n";
	var arr = document.getElementById('arr');
		
	
	
	//for (var f=0; f<document.getElementById('container').forms.length; f++){ 
	//http://stackoverflow.com/questions/4443202/jquery-get-elements-by-tag-within-a-specific-div/4443207#4443207
	var qforms = $('#container form'); //using jquery to get all forms within div "container"
	var iforms = $('#interactionsFormContainer form');//all forms within div "interactionsFormContainer"
	var moduletype = moduletypeform.moduletype.value;
	var quizexists = 0;
	for (var f=0; f< qforms.length; f++){ 
	          if (testing){ console.log( 'qforms.length='+qforms.length);}
	          if (testing){ console.log('f.id= '+qforms[f].id);}
	     var a='isQuiz_1_'+(f);
	          if (testing){ console.log('a='+a +'typeof a'+typeof a);}	    
	     var isQuiz = document.getElementById(a).checked;
	         if (testing){  console.log('f= '+f+' isQuiz= '+isQuiz);}
		 var buttontitle = qforms[f].buttontitle.value;
		      if (testing){ console.log('buttontitle= '+buttontitle);}
		 var chapter = qforms[f].chapter.value;
		 var level = qforms[f].level.value;
		     if (testing){  console.log('chapter= '+chapter)}
		 var pagetitle = qforms[f].pagetitle.value;
		 var type = qforms[f].quiztype.value;
		     if (testing){  console.log('type= '+type);}
		  var countscore = qforms[f].countscore.value;
		 	if(testing){ console.log('countscore= '+countscore); }
		 var passingscore = qforms[f].passingscore.value;	
		     if(testing){ console.log('passingscore= '+passingscore); }
		 var quiz;
		  
		
		 //note had to change this to rmsg because rm was reading as radio buttons and thus returning '' for value - never really figured out why
	//if not a quiz, the url is simply the filename.	  
		  if (isQuiz==false){
		      	if (testing){ console.log('entry'+ f+'is not a quiz');}
		     	url=qforms[f].filename.value;
		     	}
	//if it IS a quiz, write the URL value according to what type of quiz it is.
		  else {
		      	quizexists = 1;
		      	if (testing){ console.log(f+' isQuiz='+isQuiz+ 'in the else branch');}
			  	switch(type)
			 	{
				  case("Q"):
				  if (testing){  console.log('case q');}
				  quiz=qforms[f].assessmentID.value;
			 
				  var rmsg= qforms[f].qrmsg.value?qforms[f].qrmsg.value:"";
				  url="quizWrap.htm?call=embed&session="+quiz+"&href=http://uhqmarkappspr1.med.umich.edu/perception5/session.php";
				  break;
				  //got rid of old captivate on 3-1-17
		          
		          case("C6"):
		          quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
		        
		          var width = qforms[f].c6width.value;
				  var height=qforms[f].c6height.value;
				  var pathtoswf=qforms[f].c6pathtoswf.value;
				  var rmsg= qforms[f].c6rmsg.value?qforms[f].c6rmsg.value:"";
				  url="captivate6Wrap.htm?swf="+pathtoswf+"&w="+width+"&h="+height;			 
				  break;
				  
				  case("H"):
		          quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
		          var pathtoHTML5wrap = qforms[f].pathtoHTML5wrap.value;
		          var rmsg= qforms[f].hrmsg.value?qforms[f].hrmsg.value:"";
				  url=pathtoHTML5wrap+"/capHTML5wrap.htm";			 
				  break;
				 
				  case ("I"):
				    quiz=qforms[f].iquizid.value;
				    var rmsg= qforms[f].irmsg.value?qforms[f].irmsg.value:"";
				    url=qforms[f].ifilename.value;
				  //add interactions array generator form
				  break;
				
				case ("U"):
				 quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
				 var surveyid = qforms[f].surveyid.value;
				 var rmsg= qforms[f].urmsg.value?qforms[f].urmsg.value:"";
				 var qmax=qforms[f].qmax.value;
				 url="qualtricsWrap.htm?href=https://umichumhs.qualtrics.com/SE/?SID="+surveyid;
				 break;
				 }
		  }
		               
		  var lastitm= (f==(qforms.length-1))?1:0;
		 
		   if (testing){ console.log("f="+f+" qforms.length-1= "+(qforms.length-1)+" lastitm= "+lastitm);}
		  o+=" {buttonTitle:'"+buttontitle+"', ";
		  o+="title:'"+pagetitle+"', ";
		  o+="url:'"+url+"', ";
		  o+="chapter:"+chapter+", level:"+level;
			if(isQuiz==1)
			{ 
			    switch(type)
			    {
			        case("Q"):
			                o+=", type:'"+type+"', quiz:'"+quiz+"', rm:'"+rmsg.replace("'","\\'")+"', countscore:'"+countscore+"'"; 
			               // alert('countscore='+countscore);
			                break;
			        case("C"):
			                o+=", type:'"+type+"', quiz:'"+quiz+"', rm:'"+rmsg.replace("'","\\'")+"', countscore:'"+countscore+"'"; 
			                break;
			        case("C6"):
			                o+=", type:'C', quiz:'"+quiz+"', rm:'"+rmsg.replace("'","\\'")+"', countscore:'"+countscore+"'"; 
			                break;
			        case("H"):
			                o+=", type:'H', quiz:'"+quiz+"', rm:'"+rmsg.replace("'","\\'")+"', countscore:'"+countscore+"'"; 
			                break;
			        case("U"):
			                o+=", type:'"+type+"', quiz:'"+quiz+"', qmax:"+qmax+", rm:'"+rmsg.replace("'","\\'")+"', countscore:'"+countscore+"'"; 
			                break;
			       case("I"):
			               o+=", type:'"+type+"', quiz:'"+quiz+"', rm:'"+rmsg.replace("'","\\'")+"', countscore:'"+countscore+"'"; 
			              // startInteractionsArrayForm(f,quiz);
			               break;
			       }//end switch
			   }//end if(isQuiz==1)
			if((countscore=="3")&&(typeof passingscore!=="undefined")){
								o+=", passingscore:'"+passingscore+"'";
					}//end  if
			if( lastitm==0){ 
			                    o+="},\n" 
			       }//end  if
			else if ((lastitm==1)&&(quizexists==0)){
				                o+="}\n);\n\n";
		        	} //end else if 
			else if ((lastitm==1)&&(quizexists==1)){
				                o+="},\n";
							   if (testing){	console.log('chapter='+chapter + 'level= '+level);}
								o+="{buttonTitle:'Score &amp; Status', title:'',url:'scorePage.htm',chapter:"+((chapter*1)+1)+",level:1 }\n);\n\n";
								 
			}
	
    }//end for 
     
        o+="var moduletype=";
        o+=moduletype;
        o+=";\n";
        o+="var contentExpertName =('";
        o+= contentExpName.value;
        o+="');\n"; 
        o+="var contentExpertEmail =('";
        o+= contentExpEmail.value;
        o+="');\n";
         
        o+="var docTitle=('";
	    o+= doctitle;
	    o+="');\n";
	    o+="var headerTitle=('";
	    o+= headertitle;
	    o+="');\n\n";
	 //o+=chapterArray;
	 //now do interactions array if it exists
	    
	 if(intformIsOpen==true){
	        var intlinks="<!--Please paste these links into your interactions quiz pages.\n";
	        	intlinks+="THE MOST COMMON CAUSES of errors are link ID not matching the id in the interaction array, or QUIZ numbers not matching between interaction array and pageArray.\n";
	        	intlinks+="\nChange the href, target and text of each link to correct values.\n";
	        	intlinks+="Even if you don't want to USE these links, please temporarily paste them next to the real ones so you can compare id number and onclick value.-->\n";
	        	
	        o+= "var recommendedMsg = \'Recommended\';\nvar requiredMsg = \'Must be completed to finish module\';\nvar completedMsg   = \'Completed\';\n\nvar IntArray = new Object();\n";
             //now do interactions array if it exists
         
         if (testing){ console.log('iforms.length'+iforms.length);}
	        for (var g=0; g < iforms.length; g++){ 
	      
	            if (testing){console.log("in writearray: interactionsForm"+g);}
	           	if (testing){ console.log('iforms.length'+iforms.length);}
	           	if (testing){ console.log('iforms[g].itmid.value'+iforms[g].itmid.value);}
	            var itemno=iforms[g].itmid.value;
	              if (testing){console.log('itemno'+itemno);}
	            var amax=iforms[g].amax.value;
	             if (testing){ console.log(' amax='+ amax);}
	            var ireq=iforms[g].ireq.value;
	            var ireqtext = (ireq==1?"Required":"Recommended");
	             if (testing){ console.log(' ireq='+ ireq);}
	            var imsg=iforms[g].imsg.value;
	             if (testing){ console.log(' imsg='+ imsg);}
	            var iquiz=iforms[g].iquiz.value;
	             if (testing){ console.log(' iquiz='+ iquiz);}
	            var iquizformnumber=iforms[g].iquizformnumber.value;
	             if (testing){ console.log(' iquizformnumber='+ iquizformnumber);}
	             if (testing){ console.log('g='+g+' iforms.length-1='+iforms.length-1);}
	            var lastinteractionItm= (g==(iforms.length-1))?1:0;
	              if (testing){ console.log('g='+g+' iforms.length='+iforms.length+' lastinteractionItm='+lastinteractionItm); }
	            o+="IntArray['"+itemno+"'] =  {id:'"+itemno+"', tries:0, ascore:0, amax:"+amax+", req:"+ireq+", msg:'"+imsg+"', status:0, quiz:'"+iquiz+"'";
	            //add a line to the string that will build the interactions links
	            intlinks+="\n<!--for "+url+" -->\n"
	            intlinks+="<div><a href='FILLTHISIN.htm' class='button' id='"+itemno+"' onclick='recordItem(this.id,\"1\");' target='_blank'>"+ireqtext+" Interaction"+"</a></div><div id='msg_"+itemno+"' class='interactionFdbck'></div>\n"
	            
	            if( lastinteractionItm==0){ 
	                                       o+="},\n" 
	                                      }//end  if
		   else if (lastinteractionItm==1){
				                           o+="}\n";
		        	                      } //end else if      
	       
	       }//end for (var g=0; g < qforms.length;
	 
	  }//end if intformIsOpen
	      arr.value=(o);
	    
	     interactionsLinks.value=(intlinks);
	    
}//end   function
 
 




//alert(document.getElementById('entryforms').children[0].nodeValue);