//v. 1.1 9/09/09
function modeDisplay(){
	var indicatorString='<div id="apiIndicator"  onMouseDown="turnOn();" onMouseOut="setTimeout(turnOff,7000)" >';
indicatorString+='<div id="modeExplanationContainer" style="display:none;" onClick="turnOn();">You are in Unscored Mode because you did not enroll in this module through MLearning.</br>No score will be recorded in your MLearning Transcript but you may use these materials for reference. <\/div>';
indicatorString+='<a href="images/searchToEnrollInstructions.pdf" target="_blank" id="showUnscoredExample" style="position:absolute;bottom:0px;left:0px;width:140px;display:block;height:20px;background-color:#FFCC00;color:#000;" onMouseDown="event.cancelBubble=true;">see Example</a></div>';

   if (parent.APIOK()){

	 // document.getElementById('apiIndicator').style.display='none';
	 // document.getElementById('mlearningControls').style.display='block';
   }
   else {
	 	 document.getElementById('mlearningControls').innerHTML=('');
         document.getElementById('mlearningControls').innerHTML+=(indicatorString);
   }
}

function turnOn() {
    if ( document.getElementById('modeExplanationContainer').style.display == 'block'){
         document.getElementById('modeExplanationContainer').style.display = 'none';
         }
 else {
         document.getElementById('modeExplanationContainer').style.visibility = 'visible';
		 document.getElementById('modeExplanationContainer').style.display = 'block';
                      }
}			  


function turnOff() { document.getElementById('modeExplanationContainer').style.display = 'none';
document.getElementById('modeExplanationContainer').style.visibility = 'hidden';
}
 	 