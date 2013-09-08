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
	          if (testing){ console.log('a='+a);}
	     if (testing){  console.log(typeof a);}
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
		 var quiz;
		 var surveyid = qforms[f].surveyid.value;
		 var pathtoswf=qforms[f].pathtoswf.value;//change this!!
		 if(testing){ console.log('pathtoswf= '+pathtoswf); }
		 var path6toswf=qforms[f].path6toswf.value;//change this!!
		 if(testing){ console.log('path6toswf= '+path6toswf); }
		 var width = qforms[f].cwidth.value;
		 var height=qforms[f].cheight.value;
		 var width6 = qforms[f].c6width.value;
		 var height6=qforms[f].c6height.value;
		 var rm= qforms[f].rm.value?qforms[f].rm.value:"";
		  
		  if (isQuiz==false){
		      	if (testing){ console.log('entry'+ f+'is not a quiz');}
		     	url=qforms[f].filename.value;
		     	}
		  else {
		      	quizexists = 1;
		      	if (testing){ console.log(f+' isQuiz='+isQuiz+ 'in the else branch');}
			  	switch(type)
			 	{
				  case("Q"):
				  if (testing){  console.log('case q');}
				  quiz=qforms[f].assessmentID.value;
				  url="quizWrap.htm?call=embed&session="+quiz+"&href=http://uhqmarkappspr1.med.umich.edu/perception5/session.php";
				  break;
		          case("C"):
		          quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
				  url="captivateWrap.htm?swf="+pathtoswf+"&w="+width+"&h="+height;
				  //http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
				  break;
		          case("C6"):
		          quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
				  url="captivate6Wrap.htm?swf="+path6toswf+"&w="+width6+"&h="+height6;			 
				  break;
				  case ("I"):
				  // quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
				    quiz=qforms[f].iquizid.value;
				    url=qforms[f].ifilename.value;
				  //add interactions array generator form
				  break;
				
				case ("U"):
				 quiz= 100000000000+parseInt(Math.random()*(899999999999),10);
				 url="qualtricsWrap.htm?href=https://umichumhs.qualtrics.com/SE/?SID="+surveyid;
				 var qmax=qforms[f].qmax.value;
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
			                o+=", type:'"+type+"', quiz:'"+quiz+"', rm:'"+rm+"', countscore:'"+countscore+"'"; 
			               // alert('countscore='+countscore);
			                break;
			        case("C"):
			                o+=", type:'"+type+"', quiz:'"+quiz+"', rm:'"+rm+"', countscore:'"+countscore+"'"; 
			                break;
			        case("C6"):
			                o+=", type:'C', quiz:'"+quiz+"', rm:'"+rm+"', countscore:'"+countscore+"'"; 
			                break;
			        case("U"):
			                o+=", type:'"+type+"', quiz:'"+quiz+"', qmax:"+qmax+", rm:'"+rm+"', countscore:'"+countscore+"'"; 
			                break;
			       case("I"):
			               o+=", type:'"+type+"', quiz:'"+quiz+"', rm:'"+rm+"', countscore:'"+countscore+"'"; 
			              // startInteractionsArrayForm(f,quiz);
			               break;
			       }//end switch
			   }//end if(isQuiz==1)
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
         o+=moduletype
         o+=";\n";
         o+="var docTitle=('";
	     o+= doctitle
	     o+="');\n";
	     o+="var headerTitle=('";
	     o+= headertitle;
	     o+="');\n\n";
	 //o+=chapterArray;
	 //now do interactions array if it exists
	    
	 if(intformIsOpen==true){
	        
	        o+= 'var recommendedMsg = \'Recommended\';\nvar requiredMsg = \'Must be completed to finish module\';\nvar completedMsg   = \'Completed\';\n\nvar IntArray = new Object();\n'
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
	            
	            if( lastinteractionItm==0){ 
	                                       o+="},\n" 
	                                      }//end  if
		   else if (lastinteractionItm==1){
				                           o+="}\n";
		        	                      } //end else if      
	       
	       }//end for (var g=0; g < qforms.length;
	 
	  }//end if intformIsOpen
	      arr.value=(o);
	    
	     
	    
}//end   function
 
 




//alert(document.getElementById('entryforms').children[0].nodeValue);