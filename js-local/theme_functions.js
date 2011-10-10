 

 function setHdrBtns(){//new 8-8-07
	if (window.parent.data.znThisPage==1){
     //  document.getElementById('prevBtn').src = 'images/header/up/Prev_btnBlank.jpg';
	    document.getElementById('prevBtn').src = 'images/gray/hdr_Middle.jpg';
	   //document.getElementById('ftrPrevBtn').src = 'images/footer/up/footer_Prev_btnBlank.jpg';
	    document.getElementById('ftrPrevBtn').src = 'images/gray/footer_Middle.jpg';
	   document.getElementById('headerPrev').onmouseover= function(){ };
	   document.getElementById('footerPrev').onmouseover=function(){ };
	 }
	 else if (window.parent.data.znThisPage==znPages){
	 document.getElementById('nextBtn').src = 'images/grayNext_btnBlank.jpg';
	   document.getElementById('ftrNextBtn').src = 'images/gray/footer_Next_btnBlank.jpg';
	   	   document.getElementById('headerNext').onmouseover= function(){ };
	   document.getElementById('footerNext').onmouseover=function(){ };
	 } 
  } 
  
   function writeNewPageNo(){
	  	var chapter =  parent.data.PageArray[window.parent.data.znThisPage-1].chapter;
		var realChapterNo = (chapter + 1);
		var   percentOfPagesBrowsed =  window.parent.data.znThisPage / znPages;
		var zWidth = Math.round(percentOfPagesBrowsed * 75);
		if (document.getElementById('pageNumberHolder')){
	document.getElementById('pageNumberHolder').innerHTML += ('<table width="75" ><tr><td align=\"left\" id="progressBarCell"><img src=\"images/gray/progressBarBG.jpg\" width=\"' + zWidth + '\" height=\"13\" /> </td></tr><tr><td class="pageNoHolder">PAGE ' +  window.parent.data.znThisPage + ' of ' + znPages +'</td></tr></table>');											
	} 
	else { };
  }