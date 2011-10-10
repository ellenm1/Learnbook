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

  function makeActive(selectedLayer){
   var div = getElementsByClass(document, 'tab', '*');
   for(var i=0; i<div.length; i++){ 
        div[i].style.backgroundColor = '#E3E3DE';
      }  
document.getElementById(selectedLayer).style.backgroundColor = '#FFFFFF';

  }
