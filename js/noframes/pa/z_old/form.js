//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 


//http://stackoverflow.com/questions/1462119/how-do-you-use-javascript-to-duplicate-form-fields
//example:
/*(function($){
          $countForms = 1;
          $.fn.addForms = function(){
                        var myform = "<table>"+
                         "  <tr>"+
                         "     <td>Field A ("+$countForms+"):</td>"+
                         "     <td><input type='text' name='fielda["+$countForms+"]'></td>"+
                         "     <td>Field B ("+$countForms+"):</td>"+
                         "     <td><textarea name='fieldb["+$countForms+"]'></textarea></td>"+
                         "     <td><button>remove</button></td>"+
                         "  </tr>"+
                         "</table>";

                         myform = $("<div>"+myform+"</div>");
                         $("button", $(myform)).click(function(){ $(this).parent().parent().remove(); });

                         $(this).append(myform);
                         $countForms++;
          };
    })(jQuery);         

    $(function(){
        $("#addentry").bind("click", function(){
                $("#container").addForms();
        });
    });*/

(function($){
          $countForms = 0;
          $.fn.addForms = function(){
         // alert('addForms');
			              var myform = "<form id='form"+$countForms+"' name='form"+$countForms+"' method='post' action='' >"+
                                       "   <table style='border-top:1px solid #999;width:800px'><tr valign='top' class='ab'><td><div id='btntitle' class='item' ><b>Button Title</b><br/>"+
                                       "   <input type='text' name='buttontitle' id='buttontitle' onclick='/*alert(this.parentNode.parentNode.id)*/'/>"+
                                       "   </div><!--btntitle--></td>"+
                                       "   <td><div id='titles'>"+
                                       "   <div id='pgtitleoption'> Page title?<br/>"+
                                       "   <input type='checkbox' name='showPageTitle' id='showPageTitle' onclick='toggle(\"pgtitle"+$countForms+"\",\"pgtitle"+$countForms+"\")'/>&nbsp;Yes"+      
                                       "   </div><!--pgtitleoption-->"+   
                                       "   <div id='pgtitle"+$countForms+"' class='pgtitle"+$countForms+"' style='display:none;'>"+
                                       "   Page Title:<br/><input type='text' name='pagetitle' id='pagetitle'  size='10'/>"+
                                       "   </div><!--pgtitle-->"+
                                       "   </div><!--titles--></td>"+
                                       "   <td width='350'><div id='quizblock'> "+ 
                                       "   <label><input type='radio' name='isQuiz' value='0' id='isQuiz_0_"+$countForms+"' checked onclick='toggle(\"nonquizsettings"+$countForms+"\",\"togglequizsettings"+$countForms+"\")'/>"+
                                       "   This is <b><u>not</u></b> a Quiz</label><br />"+
                                       "    <label>"+
                                       "   <input type='radio' name='isQuiz' value='1' id='isQuiz_1_"+$countForms+"' onclick='toggle(\"quizsettings"+$countForms+"\",\"togglequizsettings"+$countForms+"\")'/>"+
                                       "   This is a Quiz</label><br />"+
                                      


                                       "   <div id='quizsettings"+$countForms+"' class='togglequizsettings"+$countForms+"' style='display:none'>"+
                                       "   <p>What type of quiz is it?</p>"+
                                       "   <select name='quiztype' id='quiztype"+$countForms+"' onchange='val=this.value;quiztypefn("+$countForms+",val);toggle(val+\"options"+$countForms+"\",\"togglequiz"+$countForms+"\")'>"+
                                       "   <option selected='selected'>Select type of quiz...</option>"+
                                       "   <option value='Q'  id='qmarksel'>Questionmark</option>"+
                                       "   <option value='C'  id='captsel'>Captivate</option>"+
                                       "   <option value='U'  id='qualsel'>Qualtrics</option>"+
                                       "   <option value='I'  id='intsel' '>Interactions</option>"+
                                       "   </select>"+
                                       
                                       "   <div id='countscoreblock'>"+
                                       "   I want this quiz to:<br/>"+
                                       "   <select name='countscore' id='countscore'>"+
                                       "   <option>Choose a scoring option...</option>"+
                                       "   <option value='0'  id='countscore0'>0: No display, doesn't count.</option>"+
                                       "   <option value='1'  id='countscore1' selected>1: Displays & counts.</option>"+
                                       "   <option value='2'  id='countscore2'>2: Displays but doesn\'t count.</option>"+
                                       "   </select>"+
                                       "   <div id='key'>"+
                                       "   <ul style='font-size:10px;padding-left:6px;'>"+
                                       "   <li><b>countscore 0</b> Does NOT show any quiz score on Score & Status page and does NOT count toward total module score."+ 
                                       "   (Quiz is NOT required to complete module: use for most surveys and practice quizzes)</li>"+
                                       "   <li><b>countscore 1</b> Shows a quiz score on score and status page and counts toward total module score. "+
                                       "   (Quiz is required to complete module: use for most quizzes)</li>"+
                                       "   <li><b>countscore 2</b> Shows a quiz score on score and status page but DOES NOT count toward total module score. "+
                                       "   (Quiz is NOT required to complete module: use for pre-tests)</li>"+
                                       "   </ul>"+
                                       "   </div><!--end key-->"+
                                       "   </div><!--end countscoreblock-->"+
  
                                       "   <div id='Qoptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   <label for='assessmentID'>What is the assessment ID (session ID)?</label><input name='assessmentID' type='text' value=''/>"+
                                       "   </div><!--end qoptions-->"+
                                       
                                      
                                      
                                      "   <div id='Coptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Relative path to the Captivate SWF?(<i>captivate/myfile.swf</i>)<br/>"+
                                       "   path:&nbsp;&nbsp; <input name='pathtoswf' type='text' value='' size='30' /><br/>"+
                                       "   width:&nbsp; <input name='cwidth' type='text' value=''  size='4' maxlength='4'/> &nbsp;"+
                                       "   height: <input name='cheight' type='text' value=''  size='4' maxlength='4' />"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='rm' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='cquizid' id='cquizid"+$countForms+"' readonly='readonly' value=' ' "+
                                       "   </div></div><!--end Coptions-->"+
                                      
                                       "   <div id='Uoptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   Qualtrics survey ID:&nbsp;&nbsp; <input name='surveyid' type='text' value='' size='30' /><br/>"+                                      
                                       "   Maximum score:&nbsp; <input name='qmax' type='text' value=''  size='4' maxlength='5'/> &nbsp;"+  
                                       "   Custom message to show on status page (optional):&nbsp; <input name='rm' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+
                                       "   Quiz ID (readonly) <input type='text' size='12'  name='uquizid' w  id='uquizid"+$countForms+"' readonly='readonly' value=''"+
                                       "   </div><!--end Uoptions-->"+
                                        "   <div id='Ioptions"+$countForms+"'  class='togglequiz"+$countForms+"' style='display:none;padding:6px 12px 6px 12px;'>"+
                                       "   <label for ifilename'>Filename: <input type='text' name='ifilename' id='ifilename"+$countForms+"' value='page00.htm'/></label><br/>"+
                                       "   Custom message to show on status page (optional):&nbsp; <input name='rm' type='text' value='Required Quiz' size='30' maxlength='50'/><br/>"+                                       
                                      "    Quiz ID (readonly) <input type='text' size='12' name='iquizid' id='iquizid"+$countForms+"' value=''"+
                                       "   </div><!--end Ioptions-->"+
                                       "   </div></div>"+
 
                                       "   <td width='110px'><div id='nonquizsettings"+$countForms+"' class='togglequizsettings"+$countForms+"' style='display:block;'>"+
                                       "   <div id='nonquizURL'>"+
                                       "   <b>Filename</b>: (<i>eg. page02.htm</i>)<br/>"+
         
                                       "   <input type='text' name='filename' id='filename' />"+
                                       "   </div><!--nonquizURL-->"+
                                       "   </div><!--nonquizsettings--></td>"+
                                       "   <td><div id='chaptersettings"+$countForms+"'>"+
                                       "   <b>Chapter:</b><br/>"+
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
                                       "   <div id='levelsettings["+$countForms+"]'>"+
                                       "   <b>Level:</b><br/>"+
 
                                       "   <select name='level'>"+
                                       "   <option value='1'>1</option>"+
                                       "   <option value='2'>2</option>"+
                                       "   <option value='3'>3</option>"+
                                       "   </select>"+
                                       "   </div></td><td><div id='addIntBtn"+$countForms+"' style='display:none;'><a href='javascript:void(0);' id='addAnotherInteraction"+$countForms+"' style='display:block;'>add another Interaction for this Quiz</a></div></td></tr></table>"+
                                       "   </form>";
                                      
                                      // document.getElementById('debug').innerHTML+=myform;
                                       myform = $("<div>"+myform+"</div>");
                                       $("button", $(myform)).click(function(){ 
                                                    $(this).parent().parent().remove(); 
                                                    $countIntForms--;
                                                   // console.log('after --$countIntForms= '+$countIntForms);
                                       });
	
                                       $(this).append(myform);
                                       $countForms++;


                                       };
                                        })(jQuery);         

                                          $(function(){ $("#addQuiz").bind("click", function(){ $("#container").addForms()});
                                         
                                          
                                          
                                         
                            });
                                          

//http://www.electrictoolbox.com/pad-number-two-digits-javascript/

function zeropad2(number) {  return (number < 10 ? '0' : '') + number }
function zeropad3(number) {return (number < 100) ? ( (number >= 10) ? ("0" + number) : ("00" + number) ) : number;}


(function($){
          $countIntForms = 0;
          
          $.fn.addInteractionsForm = function(){
          
              console.log('inaddInteractionsForm');
 
		   var intform=  "<form name='interactionsForm"+$countIntForms+"'>"+
		                 "       <table style='border-top:1px solid #999;width:800px'><tr valign='top' class='ab'><td>"+
						 "       <label for='itmid'>ID: <input name='itmid' type='text' size='7' maxlength='7' value='p"+zeropad2($countForms)+"_"+ zeropad3($countIntForms)+"'\/><\/label>"+
						 "       <label for='amax'>Max score: <input name='amax' type='text' size='4' maxlength='4' value='1'\/><\/label>"+
						 "       <label for='ireq'>Required? <select name='ireq' size='2'>"+
						 "             <option value='1' id='ireqY' selected>Yes<\/option>"+
						 "             <option value='2' id='ireqN'>No<\/option>"+
						 "              <\/select><\/label>"+
						 "        <label for='imsg'>Custom Message? (opt.)<input name='imsg' type='text' id='imsg' value=''  size='12' \/><\/label>"+
						 "       <label for='iquiz'>Quiz ID<input name='iquiz' type='text' id='iquiz"+$countIntForms+"' value='"+document.getElementById(quizidentifier).value+"'  size='12' \/><\/label>"+
                         "       <input name='iquizformnumber' type='hidden' id='iquizformnumber"+$countIntForms+"' value='"+$countForms+"'  size='12' \/><\/label>"+
						 "       </td></tr></table>"+
						 "<\/form>";
              


                        intform = $("<div id='interactionDiv"+$countIntForms+"' name='interactionDiv"+$countIntForms+"'>"+intform+"</div>");
                        // $("button", $(intform)).click(function(){ $(this).parent().parent().remove(); $countIntForms--;  console.log('3 after --$countIntForms= '+$countIntForms);});

                         $(this).append(intform);
                         $countIntForms++;
                         console.log('1 after ++$countIntForms= '+$countIntForms);
          };
    })(jQuery);         

//http://stackoverflow.com/questions/224820/how-can-i-pass-arguments-to-anonymous-functions-in-javascript

    $(function(){  $("#addInteraction").bind("click", function(){  $("#interactionsFormContainer").addInteractionsForm();  });
   
   
   }); 



  function addAnotherInteractionForm(formnumber,quizidentifier ){
                    
				   console.log('in addAnotherInteractionForm: formnumber= '+formnumber+' quizidentifier'+quizidentifier)
				   var theIntform=  "<form name='interactionsForm"+$countIntForms+"'>"+
								 "       <table style='border-top:1px solid #999;width:800px' name='intformtable'><tr valign='top' class='ab' name='intformrow'><td>"+
								 "       <label for='itmid'>ID: <input name='itmid' type='text' size='7' maxlength='7' value='p"+zeropad2(formnumber)+"_"+ zeropad3($countIntForms)+"'\/><\/label>"+
								 "       <label for='amax'>Max score: <input name='amax' type='text' size='4' maxlength='4' value='1'\/><\/label>"+
								 "       <label for='ireq'>Required? <select name='ireq' size='2'>"+
								 "             <option value='1' id='ireqY' selected>Yes<\/option>"+
								 "             <option value='2' id='ireqN'>No<\/option>"+
								 "              <\/select><\/label>"+
								 "        <label for='imsg'>Custom Message? (opt.)<input name='imsg' type='text' id='imsg' value=''  size='12' \/><\/label>"+
								 "       <label for='iquiz'>Quiz ID<input name='iquiz' type='text' id='iquiz"+$countIntForms+"' value='"+quizidentifier+"'  size='12' \/><\/label>"+
								 "       <input name='iquizformnumber' type='hidden' id='iquizformnumber"+$countIntForms+"' value='"+$countForms+"'  size='12' \/><\/label>"+
								 "       </td><td name='intformtd2'><button type='button' id='remover'>remove</button></td></tr></table>"+
								 "<\/form>";
					  
		                       var intformRowid= "#interactionDiv"+$countIntForms;
							   theIntform = $("<div id='interactionDiv"+$countIntForms+"' name='interactionDiv"+$countIntForms+"'>"+theIntform+"</div>");
								 $("button", $(theIntform)).click(function(){$(intformRowid).remove(); $countIntForms--;console.log('4 after --$countIntForms= '+$countIntForms); });
		                     
							   $("#interactionsFormContainer").append(theIntform);
							   $countIntForms++;
							  // document.getElementById("interactionsFormContainer").append(gintform);
                               console.log('2 after ++$countIntForms= '+$countIntForms);
                        }
                        
//http://api.jquery.com/bind/                        
//var message = 'Spoon!';
//$('#foo').bind('click', {msg: message}, function(event) {
//  alert(event.data.msg);
//});

var currentformnumber;
var theform;
var quizidentifier;//the name of the quizidentifier input for the current quiz entry that is generating this set of interactions.
var int_quizid_input_name;//name of the quizidentifier input for the current interaction entry

function quiztypefn(formnumber,type){
                               currentformnumber=formnumber;
                            if (type=="C"){
                               quizidentifier=['cquizid'+formnumber];
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
  
  
 
 