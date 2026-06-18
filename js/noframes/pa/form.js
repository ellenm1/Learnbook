//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
 
 
       

                                          $(function(){ //this is the callback to addForms function
                                          		$("#addQuiz").bind("click", function(){ 
                                          			$("#container").addForms();
                                          		});//$("#addQuiz").bind
                    
                            });// end  $(function(){ //this is the callback to addForms function
                                          		 
                                          

//http://www.electrictoolbox.com/pad-number-two-digits-javascript/

function zeropad2(number) {  return (number < 10 ? '0' : '') + number }
function zeropad3(number) {return (number < 100) ? ( (number >= 10) ? ("0" + number) : ("00" + number) ) : number;}

function quiztypefn(formnumber,quiztype){  //actions that occur when you select a quiztype from the dropdown menu
     //formnumber is the index of the current page settings form (0, 1, 2 etc) 
                             
                            var quizIdField=(quiztype.toLowerCase()+'quizid'+formnumber);  
                             var assessmentID =  100000000000+parseInt(Math.random()*(899999999999),10);              
                              
                             if (quiztype=="H"){//old captivate HTML quiz
                                	$('#'+quizIdField).val( assessmentID );//generate a random id number for this quiz.
                                    $('#interactionDiv'+formnumber).hide();
                            }//end if (quiztype=="H")
                             if (quiztype=="H2"){ //captivate after 9 html quiz
                           		 	$('#'+quizIdField).val(assessmentID );//generate a random id number for this quiz.
                                if(!$("#hidebookmarkalerts").prop("checked")){//turn off bookmark alerts if there is a captivate quiz
                                 	$("#hidebookmarkalerts").prop("checked",true);
                                	$("#quizblockmessages").append("<p>Bookmark Alerts have been turned OFF because a Storyline or Captivate quiz was added.</p>")
                                }//end if(!$("#hidebookmarkalerts"
                                         
                                    $('div.singleInteractionsQuizContainer[data-quizItmId="'+formnumber+'"]').remove();   // removes any interactions forms that were assigned to this quiz number - so if you changed your mind and selected another type of quiz, these will all go away.
                            }//end if (quiztype=="H2"
                            
				             if (quiztype=="S"){//storyline quiz
                                $('#'+quizIdField).val(assessmentID );          //generate a random id number for this quiz.                   
                                 if( !$("#hidebookmarkalerts").prop("checked")){ //turn off bookmark alerts if there is a storyline quiz
                                 		$("#hidebookmarkalerts").prop("checked",true);
                                	$("#quizblockmessages").append("<p>Bookmark Alerts have been turned OFF because a Storyline or Captivate quiz was added.</p>")
                                }
                                        $('div.singleInteractionsQuizContainer[data-quizItmId="'+formnumber+'"]').remove();  
                            }
				            if (quiztype=="I"){ //if type I is selected add these things to the entry form'
				              	$('#'+quizIdField).val(  assessmentID );  //set the value of the form input to the assessmentID   
				               	setUpInteractionQuizItems(formnumber, assessmentID); //e.g. 0929292828
				               	var divid=('Ioptions'+formnumber);
				               
				              $("#"+divid).css("display", "block");
				               	intformIsOpen=true; 
				               	$('#'+quizIdField).css( 'backgroundColor', '#FFCC00');
                              //
                         		$('#arr').attr('rows',20);//set the height of the output field the pageArray will be written to
                         		$('#arr').css('width',900);
                         		if( $('#output2').css('display','none')) { //if the interactions text area has not yet been opened, open it.
                         		   	$('#output2').show();//show the output field that any interaction items will be written to
                         		   	$('#output2').css('width',900)
                         		   }

			                 }//end if(quiztype=="I")
			                 			                 
			                 if (quiztype=="U"){ //qualtrics  
			                  	var divid=('Uoptions'+formnumber);
				              	$('#'+divid).css("display", "block");
				       			$('#'+quizIdField).val( assessmentID  );
				            	//delete any interactions div that belongs to this form number
				             	$('div.singleInteractionsQuizContainer[data-quizItmId="'+formnumber+'"]').remove();  
			                 }//end if (quiztype=="U")
 
}//end function

 
          $.fn.addForms = function(){
          var countForms = $('.singlepageform').length;
                          //var val;
                          //each .singlepageform represents one page in the module or one item in the pageArray
			              var myform = "<form class='singlepageform' id='form"+countForms+"' name='form"+countForms+"' method='post' action='' >"+
                                       "   <table style='width:100%'><tr valign='top' class='ab'><td style='text-align:left;width:20%'><div id='btntitle' class='item' ><b>Button Title</b>&nbsp;<span class=\"trg\" onclick=\"openNav(this.id)\" id=\"btntitle_trg_"+countForms+"\">[?]</span><br/>"+
                                       "   <input type='text' name='buttontitle' id='buttontitle' onclick='/*alert(this.parentNode.parentNode.id)*/'/>"+
                                       "   </div><!--btntitle--></td>"+
                                        
                                       "   <div id='pgtitle"+countForms+"' class='pgtitle"+countForms+"' style='display:none;'>"+
                                       "   Page Title:<br/><input type='text' name='pagetitle' id='pagetitle'  size='10'/>"+
                                       "   </div><!--pgtitle-->"+
                                       "   </div><!--titles--></td>"+
                                       "   <td  style='text-align:left;width:40%'><div id='quizblock'><div id='quizblockmessages'></div> "+ 
                                       "   <label><input type='radio' name='isQuiz' value='0' id='isQuiz_0_"+countForms+"' checked onclick='toggle(\"nonquizsettings"+countForms+"\",\"togglequizsettings"+countForms+"\")'/>"+
                                       "   This is <b><u>not</u></b> a Quiz</label><br />"+
                                       "    <label>"+
                                       "   <input type='radio' name='isQuiz' value='1' id='isQuiz_1_"+countForms+"' onclick='toggle(\"quizsettings"+countForms+"\",\"togglequizsettings"+countForms+"\")'/>"+
                                       "   This is a Quiz</label><br />"+ 

<<<<<<< HEAD
                                "   <div id='quizsettings"+countForms+"' class='togglequizsettings"+countForms+"' style='display:none'>"+
                                       "   <p>What type of quiz is it? &nbsp;<span class=\"trg\" onclick=\"openNav(this.id)\" id=\"quiztype_trg_"+countForms+"\">[?]&nbsp;</span></p>"+
                                       "   <select name='quiztype' id='quiztype"+countForms+"' onchange='val=this.value; quiztypefn("+countForms+",val);toggle(val+\"options"+countForms+"\",\"togglequiz"+countForms+"\")'>"+
                                       "   <option selected='selected'>Select type of quiz...</option>"+                                                               
                                      // "   <option value='H' id='captHsel'>Captivate 8 HTML5 or greater</option>"+
                                       "   <option value='H2' id='captH2sel'>Captivate HTML5 2017 or greater</option>"+
=======

                                "   <div id='quizsettings"+$countForms+"' class='togglequizsettings"+$countForms+"' style='display:none'>"+
                                       "   <p>What type of quiz is it?</p>"+
                                       "   <select name='quiztype' id='quiztype"+$countForms+"' onchange='val=this.value;quiztypefn("+$countForms+",val);toggle(val+\"options"+$countForms+"\",\"togglequiz"+$countForms+"\")'>"+
                                       "   <option selected='selected'>Select type of quiz...</option>"+
                                       "   <option value='Q'  id='qmarksel'>Questionmark</option>"+                                    
                                       "   <option value='C6' id='capt6sel'>Captivate 6 or greater</option>"+
                                        "   <option value='H' id='captHsel'>Captivate 8 HTML5 or greater</option>"+
                                       "   <option value='U'  id='qualsel'>Qualtrics</option>"+
>>>>>>> dc6222ec23281ddc438ce2e0f615fb3554823573
                                       "   <option value='I'  id='intsel'>Interactions</option>"+
                                       "   <option value='U'  id='qualsel'>Qualtrics</option>"+
                                       "   <option value='Q'  id='qmarksel'>Questionmark</option>"+   
                                       "   <option value='S' id='storyHsel'>Storyline HTML5</option>"+  
                                       "   <option value='SR' id='storyRsel'>Storyline Remote</option>"+                                     
                                       "   </select>"+
                                       
                                       "   <div id='countscoreblock'>"+
<<<<<<< HEAD
                                       "   I want this quiz to: &nbsp;<span class=\"trg\" onclick=\"openNav(this.id)\" id=\"countscore_trg_"+countForms+"\">[?]</span><br/>"+
                                       "   <select name='countscore' id='countscore' onchange='this.value==3?$(\"#passingscoreOptions"+countForms+"\").show():$(\"#passingscoreOptions"+countForms+"\").hide();'>"+
=======
                                       "   I want this quiz to:<br/>"+
                                       "   <select name='countscore' id='countscore' onchange='this.value==3?toggle(\"passingscoreOptions"+$countForms+"\"):toggle(\"\");'>"+
>>>>>>> dc6222ec23281ddc438ce2e0f615fb3554823573
                                       "   <option>Choose a scoring option...</option>"+
                                       "   <option value='0'  id='countscore0'>0: No display, doesn't count.</option>"+
                                       "   <option value='1'  id='countscore1' selected>1: Displays & counts.</option>"+
                                       "   <option value='2'  id='countscore2'>2: Displays but doesn\'t count.</option>"+
                                       "   <option value='3'  id='countscore3'>3: Displays, counts, MUST be passed.</option>"+
                                       "   </select>"+
                                       "   <div id='key'>"+
                                       "   <ul style='font-size:10px;padding-left:6px;'>"+
                                       "   <li><b>countscore 0</b> Does NOT show any quiz score on Score & Status page and does NOT count toward total module score."+ 
                                       "   (Quiz is NOT required to complete module: use for most surveys and practice quizzes)</li>"+
                                       "   <li><b>countscore 1</b> Shows a quiz score on score and status page and counts toward total module score. "+
                                       "   (Quiz is required to complete module: use for most quizzes)</li>"+
                                       "   <li><b>countscore 2</b> Shows a quiz score on score and status page but DOES NOT count toward total module score. "+
                                       "   (Quiz is NOT required to complete module: use for pre-tests)</li>"+
                                       "   <li><b>countscore 3</b> Shows a quiz score on score and status page, counts toward total module score and MUST be passed to finish module. "+
                                       "   (Quiz is required to be passed to complete module: use for critical quizzes)</li>"+
                                       "   </ul>"+
                                       "   </div><!--end key-->"+
                                       "   <label for='hidetryagainmsg'>Do you want to show the Try Again Message for this quiz? &nbsp;<span class=\"trg\"  onclick=\"openNav(this.id)\" id=\"hidetryagainmsg_trg_"+countForms+"\">[?]</span></label>"+
  									   "   <select name='hidetryagainmsg' id='hidetryagainmsg'>"+
                                       "   <option value='1'  id='hidetryagainmsgtrue' selected>No, do not show Try Again message.</option>"+
                                       "   <option value='0'  id='hidetryagainmsgfalse'>Yes, show the Try Again message (default).</option>"+
                                       "   </select>"+
                                       "   </div><!--end countscoreblock-->"+
  									   
<<<<<<< HEAD
  									   "   <div id='passingscoreOptions"+countForms+"' class='togglepassingscore"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
  									   "   <label for='passingscore'>What is the passing % score for this quiz? &nbsp;<span class=\"trg\"   onclick=\"openNav(this.id)\" id=\"passingscore_trg_"+countForms+"\">[?]</span</label><input name='passingscore' type='text' value=''/>"+
                                       "   </div><!--end passingscoreOptions-->"+
  									                           
                                       
                                       "   <div id='Qoptions"+countForms+"'  class='togglequiz"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='qrmsg' type='text' value='Required Quiz'  maxlength='50'/><br/>"+
                                       "   <label for='assessmentID'>What is the assessment ID (session ID)?</label><input name='assessmentID' type='text' value=''/>"+ 
                                       "   </div><!--end qoptions-->"+
                                       
                                    
                                       "   <div id='H2options"+countForms+"'  class='togglequiz"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Relative path to index.html?(<i>captivate/myCaptivateQuiz</i>)<br/>"+
                                       "   <div style='margin-top:4px;margin-bottom:3px;'>Path:&nbsp;&nbsp; <input name='pathtoC9HTML5wrap' type='text' value='' size='20' />&nbsp;&nbsp;\/index.html</div>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='h2rmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='h2quizid"+countForms+"' id='h2quizid"+countForms+"' readonly='readonly' value=' ' />"+
                                       "   </div><!--endH2options-->"+
                                       
                                       "   <div id='Soptions"+countForms+"'  class='togglequiz"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Relative path to story.html?(<i>storyline/myStorylineQuiz</i>)<br/>"+
                                       "   <div style='margin-top:4px;margin-bottom:3px;'>Path:&nbsp;&nbsp; <input name='pathtoSLHTML5wrap' type='text' value='' size='20' />&nbsp;&nbsp;\/story.html</div>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='srmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='squizid"+countForms+"' id='squizid"+countForms+"' readonly='readonly' value=' ' />"+
                                       "   </div><!--endSoptions-->"+
                                       
                                        "   <div id='SRoptions"+countForms+"'  class='togglequiz"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Absolute path to story.html?(<i>https://mlearningcontent2.med.umich.edu/content/manifests/external/.../story.html</i>)<br/>"+
                                       "   <div style='margin-top:4px;margin-bottom:3px;'>Path:&nbsp;&nbsp; <input name='pathtoSLHTML5wrap' type='text' value='' size='20' />&nbsp;&nbsp;\/story.html</div>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='sRrmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='sRquizid"+countForms+"' id='sRquizid"+countForms+"' readonly='readonly' value=' ' />"+
                                       "   </div><!--endSoptions-->"+
=======
  									   "   <div id='passingscoreOptions"+$countForms+"' class='togglepassingscore"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
  									   "   <label for='passingscore'>What is the passing % score for this quiz?</label><input name='passingscore' type='text' value=''/>"+
                                       "   </div><!--end passingscoreOptions-->"+
  									   
                                       
                                       "   <div id='Qoptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='qrmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   <label for='assessmentID'>What is the assessment ID (session ID)?</label><input name='assessmentID' type='text' value=''/>"+ 
                                       "   </div><!--end qoptions-->"+
                                       
                                      
                                      
                                     
                                       
                                       "   <div id='C6options"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Relative path to the Captivate 6 SWF?(<i>captivate/myfile.swf</i>)<br/>"+
                                       "   path:&nbsp;&nbsp; <input name='c6pathtoswf' type='text' value='' size='30' /><br/>"+
                                       "   width:&nbsp; <input name='c6width' type='text' value=''  size='4' maxlength='4'/> &nbsp;"+
                                       "   height: <input name='c6height' type='text' value=''  size='4' maxlength='4' />"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='c6rmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='c6quizid' id='c6quizid"+$countForms+"' readonly='readonly' value=' ' />"+
                                       "   </div><!--end C6options-->"+
                                       
                                       "   <div id='Hoptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Relative path to captivateHTML5wrap.htm?(<i>captivate/myCaptivateQuiz</i>)<br/>"+
                                       "   <div style='margin-top:4px;margin-bottom:3px;'>Path:&nbsp;&nbsp; <input name='pathtoHTML5wrap' type='text' value='' size='20' />&nbsp;&nbsp;\/capHTML5wrap.htm</div>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='hrmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='hquizid' id='hquizid"+$countForms+"' readonly='readonly' value=' ' />"+
                                       "   </div><!--endHoptions-->"+
>>>>>>> dc6222ec23281ddc438ce2e0f615fb3554823573
                                       
                                       "   <div id='Uoptions"+countForms+"'  class='togglequiz"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Qualtrics survey ID:&nbsp;&nbsp; <input name='surveyid' type='text' value='' size='30' /><br/>"+                                      
                                       "   Maximum score:&nbsp; <input name='qmax' type='text' value=''  size='4' maxlength='5'/><br/>"+  
                                       "   <label for 'rmsg'>Custom message to show on status page (optional):<br/> <input name='urmsg' type='text' value='Required Quiz' size='30' maxlength='50'/></label><br/>"+
<<<<<<< HEAD
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='uquizid' w  id='uquizid"+countForms+"' readonly='readonly' value=''/>"+
                                       "   </div><!--end Uoptions-->"+
                                       
                                       "   <div id='Ioptions"+countForms+"'  class='togglequiz"+countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   <label for 'ifilename'>Filename: <input type='text' name='ifilename' id='ifilename"+countForms+"' value='page"+zeropad2(countForms+1)+".htm'/></label><br/>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='irmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "    Quiz ID (readonly) <input type='text' size='12' name='iquizid"+countForms+"' id='iquizid"+countForms+"' value=''/>"+
=======
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='uquizid' w  id='uquizid"+$countForms+"' readonly='readonly' value=''/>"+
                                       "   </div><!--end Uoptions-->"+
                                       
                                       "   <div id='Ioptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   <label for 'ifilename'>Filename: <input type='text' name='ifilename' id='ifilename"+$countForms+"' value='page00.htm'/></label><br/>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='irmsg' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "    Quiz ID (readonly) <input type='text' size='12' name='iquizid' id='iquizid"+$countForms+"' value=''/>"+
>>>>>>> dc6222ec23281ddc438ce2e0f615fb3554823573
                                       "   </div><!--end Ioptions-->"+
                                       
                                       "    </div><!--end quizsettings-->"+
                                       "    </div><!--end quizblock-->"+
                                       "    </td>"+ 
                                       "   <td style='text-align:left;width:auto'><div id='nonquizsettings"+countForms+"' class='togglequizsettings"+countForms+"' style='display:block;'>"+
                                       "   <div id='nonquizURL'>"+
                                       "   <b>Filename</b>: (<i>eg. page02.htm</i>)<br/>"+
         
                                       "   <input type='text' name='filename' id='filename' />"+
                                       "   </div><!--nonquizURL-->"+
                                       "   </div><!--nonquizsettings--></td>"+
                                       "   <td style='text-align:left;width:20%'><div id='chaptersettings"+countForms+"'>"+
                                       "   <b>Chapter:</b>&nbsp;<span class=\"trg\"  onclick=\"openNav(this.id)\" id=\"chaptersettings_trg_"+countForms+"\">[?]</span><br/>"+
                                       "   <select name='chapter' id='chapter'>"+
                                       "   <option value='1'>1</option>"+
                                       "   <option value='2'>2</option>"+
                                       "   <option value='3'>3</option>"+
                                       "   <option value='4'>4</option>"+
                                       "   <option value='5'>5</option>"+
                                       "   <option value='6'>6</option>"+
                                       "   <option value='7'>7</option>"+
                                       "   <option value='8'>8</option>"+
                                       "   <option value='9'>9</option>"+
                                       "   <option value='10'>10</option>"+
                                       "   <option value='11'>11</option>"+
                                       "   <option value='12'>12</option>"+
                                       "   <option value='13'>13</option>"+
                                       "   <option value='14'>14</option>"+
                                       "   <option value='15'>15</option>"+
                                       "   </select>"+
                                       "   </div>"+
                                       "   <div id='levelsettings["+countForms+"]'>"+
                                       "   <b>Level:</b>&nbsp;<span class=\"trg\" onclick=\"openNav(this.id)\" id=\"levelsettings_trg_"+countForms+"\">[?]</span><br/>"+
 
                                       "   <select name='level'>"+
                                       "   <option value='1'>1</option>"+
                                       "   <option value='2'>2</option>"+
                                       "   <option value='3'>3</option>"+
                                       "   </select>"+
                                       "   </div></td><td><div id='addIntBtn"+countForms+"' style='display:none;'><a href='javascript:void(0);' id='addAnotherInteraction"+countForms+"' style='display:block;'>add another Interaction for this Quiz</a></div></td></tr></table>"+
                                       "   </form>";
                                      
                                      // document.getElementById('debug').innerHTML+=myform;
                                       myform = $("<div>"+myform+"</div>");
                                       $("button", $(myform)).click(function(){ 
                                                    $(this).parent().parent().remove(); 
                                                    $countIntForms--;
                                                   // console.log('after --$countIntForms= '+$countIntForms);
                                       });
                                       
                                    
	
                                       $(this).append(myform);                                       
                                        


                                       };
       
 
   
	function   setUpInteractionQuizItems(formnum, quizidentifier){ //index number of the quiz this belongs to, and quiz identifier (assessment id) long number
	           //this creates the interactionsquiz container for this quiz and the addanother interactions button that goes with 
 			   var countIntForms = $('.interactionItem').length ++;
 			   //selecting elements by data - $('*[data-customerID]')//https://stackoverflow.com/questions/2487747/selecting-element-by-data-attribute-with-jquery?rq=1
 			  
 			 //if thereis no interactionsquizcontainer div for this quiz, then add one. 
 			 //add the interaction form for the first interaction to the interactionsquiz container for this quiz 
 			 //if there is no add another interaction button for this quiz, then add it right after this the interactionsquizcontainer div for this quiz
 
 			 
		    //if(interactionsQuizContainer div FOR THIS QUIZ does not exist, add it here. this is the container div that will hold the divs for each interaction Item belonging to a specific quiz.
		  if ($('#interactionsQuiz'+quizidentifier).length==0){
		  			var interactionQuizContainerDiv = "<div id='interactionsQuiz"+quizidentifier+"' class='singleInteractionsQuizContainer' data-quizItmId='"+formnum+"'></div>"; 
		  			 $("#interactionQuizzesContainer").append( interactionQuizContainerDiv  ); //this adds this quiz's container to the hard-coded interactionQuizzesContainer div which holds ALL interactions quizzes' items.
		  			 addInteractionForm(false, quizidentifier) //it should check which interactionform this is, append to <div id='interactionsQuiz"+quizidentifier+"'></div>
		  			 //if there is no add Another Interaction button FOR THIS QUIZ, then add it right after the div.
		  		 
		  			
		  			 
		  			 
		  			  
		  			  /*  move inside addInteractionForm()
		  			  	$(document).ready(function () { //https://stackoverflow.com/a/37342639 waits till the button you just added shows up
 									$("#addInteraction"+countIntForms).bind("click", function(){  addInteractionForm(true, quizidentifier);   }); //end $(function()// Action after append is completly done
						});
		  			 */
		  }
		  
		  
		  
 
			 var int_quizid_input_id =['belongsToQuiz'+(countIntForms-1)]; //set id of current iquiz input
			$('#belongsToQuiz'+(countIntForms-1)).val($('#'+quizidentifier).val() ); 
	      }//end  setUpInteractionQuizItems

 
 
        
        
   //called only by getInteractions() which is called by setUpInteractionQuizItems() and by clicking the add another interaction button   
    function addInteractionForm(fromButton,  quizidentifier){ //if this function is triggered by an "Add Another interaction" button, then we have to add 1 to current number of Interaction Forms, otherwise that value does not get incremented 
       var  thisQuizNumItms = $('.interactionItem[data-quizid="'+quizidentifier+'"]').length;
         //if they are using the add interaction button there is already at least one item in this particular quiz
        var countForms = fromButton  ? $ ('.interactionItem[data-quizid="'+quizidentifier+'"]').length : $('.singlepageform').length;//needed only to match the itmid with the page number
        //var countIntForms = fromButton ? $('.interactionItem[data-quizid="'+quizidentifier+'"]').length++:$('.interactionItem[data-quizid="'+quizidentifier+'"]').length; //since all ids must be unique these should count across quizzes
     	var countIntForms = fromButton ? $('.interactionItem').length++:$('.interactionItem[data-quizid="'+quizidentifier+'"]').length++; 
     	var newIntFormNo = countIntForms++;
     	var thisIntDivName = "interactionForm_"+quizidentifier+"_"+newIntFormNo;
     	    thisIntDivName = thisIntDivName.toString();
     	var thisIntForm =  $('form[name="'+thisIntDivName+'"]');
     	var interactionQuizContainerDiv = "<div id='interactionsQuiz"+quizidentifier+"'></div>"; 
		var interactionItmFrm=  "<form name='interactionForm_"+quizidentifier+"_"+newIntFormNo+"' id='interactionForm_"+quizidentifier+"_"+newIntFormNo+"' data-quizid='"+quizidentifier+"'>"+
				 "       <table style='width:100%;'><tr valign='top' class='ab'><td style='width:70%;'>"+
				 "       <div><label for='itmid' style='width:200px;margin-right:20px;'>ID: <input name='itmid' type='text' size='7' maxlength='7' value='p"+zeropad2(countForms)+"_"+ zeropad3(newIntFormNo)+"'\/><\/label>"+
				 "       <label for='amax'  style='width:200px;margin-right:20px;'>Max score: <input name='amax' type='text' size='4' maxlength='4' value='1'\/><\/label>"+
				 "       <label for='ireq'  style='width:150px;'>Required? <select name='ireq' size='2'>"+
				 "             <option value='1' id='ireqY' selected>Yes<\/option>"+
				 "             <option value='2' id='ireqN'>No<\/option>"+
				 "              <\/select><\/label></div>"+
				 "        <div><label for='imsg' style='margin-right:20px;'>Custom Message? (opt.)<input name='imsg' type='text' id='imsg' value=''  size='40' style='width:350px;' \/><\/label>"+
				 "       <label for='belongsToQuiz_"+quizidentifier+"_"+newIntFormNo+"'  style='width:200px;margin-right:20px;'>Quiz ID<input name='belongsToQuiz_"+newIntFormNo+"' type='text' id='belongsToQuiz_"+quizidentifier+"_"+newIntFormNo+"' value='"+quizidentifier+"'  size='12' \/><\/label></div>"+
				// "       <input name='iquizformnumber' type='hidden' id='iquizformnumber"+countIntForms+"' value='"+countForms+"'  size='12' \/><\/label>"+
				 "       </td><td name='intformtd2'><div class='interactionItmButton' style='width:200px;margin-bottom:80px;'><button type='button' id='remover' onclick='removeInteractionForm("+thisIntDivName+");'>Remove</button></div>"+
				 " 		<div class='interactionItmButton' style='width:200px;'><button type='button' id='addInteraction_"+quizidentifier+"_"+newIntFormNo+"' class='addAnotherInteractionBtn' data-quizid='"+quizidentifier+"' onclick='addInteractionForm(true, "+ quizidentifier+")' >Add Another Interaction to this Quiz</button></div></td></tr></table>"+
				 "<\/form>";
	   
				 interactionItmFrm = $("<div class='interactionItem' id='interactionDiv"+newIntFormNo+"' name='interactionDiv"+newIntFormNo+"' data-quizid='"+quizidentifier+"'>"+interactionItmFrm+"</div>");
				// if (add interaction button for this quiz does not exist then add it
				// $("button", $(intform)).click(function(){ $(this).parent().parent().remove(); $countIntForms--;  console.log('3 after --$countIntForms= '+$countIntForms);});

				 $("#interactionsQuiz"+quizidentifier).append(interactionItmFrm); //add this form to the interactions quiz container for this quiz
				 $("button[id^='addInteraction_"+quizidentifier+"']").each(function () {
							if( $(this).attr("id") != "addInteraction_"+quizidentifier+"_" + newIntFormNo ){
							   $(this).hide();
							}//end if
				  });
				 
				 
				 
 
 } //end function addInteractionForm(countIntForms,quizidentifier)

    //http://stackoverflow.com/questions/224820/how-can-i-pass-arguments-to-anonymous-functions-in-javascript

   
function removeInteractionForm(arg){
		//$(formname).remove();
		 $(arg).remove();

} 



 
                                          

//http://api.jquery.com/bind/                        
//var message = 'Spoon!';
//$('#foo').bind('click', {msg: message}, function(event) {
//  alert(event.data.msg);
//});
<<<<<<< HEAD
=======

var currentformnumber;
var theform;
var quizidentifier;//the name of the quizidentifier input for the current quiz entry that is generating this set of interactions.
var int_quizid_input_name;//name of the quizidentifier input for the current interaction entry

function quiztypefn(formnumber,type){
                            currentformnumber=formnumber;                      
                            if (type=="C6"){
                               quizidentifier=['c6quizid'+formnumber];
                                document.getElementById(quizidentifier).value= 100000000000+parseInt(Math.random()*(899999999999),10);
                            }
                            
                             if (type=="H"){
                               quizidentifier=['hquizid'+formnumber];
                                document.getElementById(quizidentifier).value= 100000000000+parseInt(Math.random()*(899999999999),10);
                            }
				            
				            if (type=="I"){ //if type I is selected add these things to the entry form'
				               quizidentifier=['iquizid'+formnumber];
				               getInteractions(formnumber);
				               var divid=('Ioptions'+formnumber);
				               theform=['form'+formnumber];
				               
				               document.getElementById(divid).style.display="block";
				               intformIsOpen=true;
				               document.getElementById("addIntBtn"+formnumber).style.display="block"; 
				               document.getElementById(quizidentifier).value= 100000000000+parseInt(Math.random()*(899999999999),10);
				               document.getElementById('form'+formnumber).iquizid.value=document.getElementById(quizidentifier).value;
				               //console.log('addAnotherInteraction'+formnumber);
				               document.getElementById('addAnotherInteraction'+formnumber).onclick=function(){addAnotherInteractionForm(formnumber,document.getElementById(quizidentifier).value)};
				               var j=($countIntForms-1);
				             
				               int_quizid_input_name=['iquiz'+j];
				               document.getElementById(quizidentifier).style.backgroundColor="#FFCC00";
                               document.getElementById(int_quizid_input_name).value=document.getElementById(quizidentifier).value
                         		
                         		$('#arr').attr('rows',20);
                         		$('#output2').show();
                         		
                               console.log('in quiztypfn(), form.js: $countForms='+$countForms);           
			                   console.log('document.getElementById(quizidentifier).value= '+document.getElementById(quizidentifier).value);
			                   console.log('document.getElementById(int_quizid_input_name).value= '+document.getElementById(int_quizid_input_name).value);
			                 }//end if(type=="I")
			                 
			                 
			                 if (type=="U"){ //qualtrics
			                  quizidentifier=['uquizid'+formnumber];
			                  document.getElementById(quizidentifier).value= 100000000000+parseInt(Math.random()*(899999999999),10);
				              document.getElementById('form'+formnumber).iquizid.value=document.getElementById(quizidentifier).value;
			                 }
			                
			                
			
//placeholder for additional functions for each type of quiz if needed

}



                                          
 function  getInteractions(n){
 
		  if ($countIntForms==0)
			 {
				 document.getElementById('interactionsButtons').style.display="block";
				 $("#interactionsFormContainer").addInteractionsForm();
				 
			 }  
			 else { $("#interactionsFormContainer").addInteractionsForm();  }
			 
			 int_quizid_element=['iquiz'+($countIntForms-1)]; //set id of current iquiz element
			 console.log('int_quizid_element='+int_quizid_element);
			 document.getElementById(int_quizid_element).value=document.getElementById(quizidentifier).value;
	      }//end getInteractions(n)

>>>>>>> dc6222ec23281ddc438ce2e0f615fb3554823573
                                        
                                          
function getElementsByClass(node,searchClass,tag) {
         var classElements = new Array();
         var els = node.getElementsByTagName(tag); // use "*" for all elements
         var elsLen = els.length;
         var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
for (i = 0, j = 0; i < elsLen; i++) {
if ( pattern.test(els[i].className) ) {
         classElements[j] = els[i];
         j++;
         }
    }
return classElements;
}

function toggle(selectedLayer, searchclass){
        // Written By: WillyDuitt@hotmail.com || 03-22-2005 \\;
         var div = getElementsByClass(document, searchclass, '*');
         for(var i=0; i<div.length; i++){ 
         div[i].style.visibility = 'hidden';
		 div[i].style.display = 'none';
         }  

         document.getElementById(selectedLayer).style.visibility = 'visible';
		 document.getElementById(selectedLayer).style.display = "block";

         }
         
         function jqToggle(elementID){
         	 $('#'+elementID).toggle();
         }
  
 
 var escapeIt = function(string) {
        return ('' + string).replace(/["'\\\n\r\/\u2028\u2029\u000B]/g, function(character) {
            // Escape all characters not included in SingleStringCharacters and
            // DoubleStringCharacters on
            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
            switch (character) {
                case '"':
                case "'":
                case '\\':
                case '\/':
                    return '\\' + character
                        // Four possible LineTerminator characters need to be escaped:
                case '\n':
                    return '\\n'
                case '\r':
                    return '\\r'
                case '\u2028':
                    return '\\u2028'
                case '\u2029':
                    return '\\u2029'
                case '\u000B':
                    return '\\u000B'
            }
        })
    };
    $(document).ready(function() {
        $("#escapeEmailBody").click(function() {
            var inputTextArea1 = $("#emailBody");
            inputTextArea1.val(escapeIt(inputTextArea1.val()));
             var inputTextArea2 = $("#emailSubject");
            inputTextArea2.val(escapeIt(inputTextArea2.val()));
            var inputTextArea3 = $("#emailCourseTitle");
             inputTextArea3.val(escapeIt(inputTextArea3.val()));
        });
        
         $("#escapeStartupMessage").click(function() {
            var inputTextArea3 = $("#customStartupMsgTitle");
            inputTextArea3.val(escapeIt(inputTextArea3.val()));
             var inputTextArea4 = $("#customStartupMsg");
            inputTextArea4.val(escapeIt(inputTextArea4.val()));
        });
        
       $("#advancedToggleIcon").mousedown(function(){
       	 $('#advancedcontainer').toggle();
       	 $("#advancedToggleIcon").toggleClass("chevron-down chevron-right");
       	  });
       	  
       $("#customstartupwarning").mousedown(function() {
       			if ($('#startupWarningContainer').is(':visible')){
       				 $('#startupWarningContainer').hide();        
   						 } else {
       				$('#startupWarningContainer').show();   
    				}
       });
       
       $("#enablecompletionemail").mousedown(function() {
       		 if ($('#completionEmailContainer').is(':visible')){
       				 $('#completionEmailContainer').hide();        
   						 } else {
       				$('#completionEmailContainer').show();   
    				}
        });
       	
       	
 
 
    });  //end document ready function
 

 
 
 