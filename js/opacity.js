/*v 1.0 5-10-2006*/
// from http://www.bigbold.com/snippets/posts/show/1843
 var myEffects = {
  fade: function(elid) {
        var opacs = ["0",".1",".2",".3",".4",".5",".6",".7",".8",".9","1"];
        if (document.getElementById(elid).style.display == 'none'){
                document.getElementById(elid).style.opacity = '0';
                document.getElementById(elid).style.display = 'block';
                for (var i = 0; i < 11; i++){
                setTimeout('document.getElementById(\''+elid+'\').style.opacity = "'+opacs[i]+'";', i * 40);
                }
        }else{
        opacs.reverse();
        for (var i = 0; i < 11; i++) {
            setTimeout('document.getElementById(\''+elid+'\').style.opacity = "'+opacs[i]+'";', i * 40);
        }
        setTimeout('document.getElementById(\''+elid+'\').style.display = "none";', i * 40);
        }
    }
}

/*Usage: <a href="#" onclick="myEffects.fade('element1')">Toggle fade</a>
 <div id="element1" style="display:none;background-color:red">Div one</div>*/




function opacity(id, opacStart, opacEnd, millisec) { 
    //speed for each frame 
    var speed = Math.round(millisec / 100); 
    var timer = 0; 

    //determine the direction for the blending, if start and end are the same nothing happens 
    if(opacStart > opacEnd) { 
        for(i = opacStart; i >= opacEnd; i--) { 
            setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed)); 
            timer++; 
        } 
    } else if(opacStart < opacEnd) { 
        for(i = opacStart; i <= opacEnd; i++) 
            { 
           setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed)); 
		   
            timer++; 
        } 
    } 
} 

//change the opacity for different browsers 
function changeOpac(opacity, id) { 
    var object = document.getElementById(id).style; 
    object.filter = "alpha(opacity=" + opacity + ")";
	object.opacity = (opacity / 100); 
    object.MozOpacity = (opacity / 100); 
   // object.KhtmlOpacity = (opacity / 100); 
}
function shiftOpacity(id, millisec) { 
    //if an element is invisible, make it visible, else make it ivisible 
    if(document.getElementById(id).style.opacity == 0) { 
        opacity(id, 0, 100, millisec); 
    } else { 
        opacity(id, 100, 0, millisec); 
    } 
}
function doNothing() {

}