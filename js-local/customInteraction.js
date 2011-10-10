function createPlayer(videoPlaylist) {

      var s1 = new SWFObject('http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/embed2/swf/mediaplayer-3.14.swf', 'mpl1', '380', '280', '7', '#000000');
          s1.addVariable('width',            '380');
          s1.addVariable('height',           '280');
          s1.addVariable('displayheight',    '280');
          s1.addVariable('displaywidth',     '420');
          s1.addVariable('file',              videoPlaylist);
          s1.addVariable('overstretch',      'true'); // expands to fit h or v  "false" -will stretch them to fit
          s1.addVariable('showdigits',       'true');
          s1.addVariable('autostart',        'false');
          s1.addVariable('shuffle',          'false');
          s1.addVariable('repeat',           'false');
          s1.addVariable('showicons',        'false');
		  s1.addVariable('showstop',         'true');
          s1.addVariable('enablejs',         'true');
          s1.addVariable('javascriptid',     'mpl1');
          s1.addVariable('usecaptions',      'true');
          s1.addVariable('backcolor',        '0xFFFFFF'); // face of buttons
          s1.addVariable('frontcolor',       '0x404040'); // button symbols & playlist text
          s1.addVariable('lightcolor',       '0x808080'); // highlighted playlist item
          s1.addVariable('screencolor',      '0x000000'); // screen background color
          s1.write('player');
    };
 

    function createRotator(slidePlaylist) {
//this is set at 10px square for the time being 
      var s2 = new SWFObject('http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/embed2/swf/imagerotator-3.14.swf', 'rot1', '1', '1', '7', '#FFFFFF');

          s2.addVariable('width',            '1');
          s2.addVariable('height',           '1');
          s2.addVariable('file',              slidePlaylist);
          s2.addVariable('overstretch',      'true'); // expands to fit h or v  "false" -will stretch them to fit
          s2.addVariable('autostart',        'false');
          s2.addVariable('shuffle',          'false');
          s2.addVariable('repeat',           'false');
          s2.addVariable('rotatetime',       '999');
          s2.addVariable('showicons',        'false');
          s2.addVariable('shownavigation',   'false');
          s2.addVariable('transition',       'bgfade');
          s2.addVariable('enablejs',         'true');
          s2.addVariable('javascriptid',     'rot1');
          s2.addVariable('backcolor',        '0xCCEEFF'); // face of buttons
          s2.addVariable('frontcolor',       '0x404040'); // button symbols & playlist text
          s2.addVariable('lightcolor',       '0x808080'); // highlighted playlist item
          s2.addVariable('screencolor',      '0xFFFFFF'); // screen background color
          s2.write('rotator');

    };
	
//	createPlayer('http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/media/library/playlist.xml');
	//createRotator('http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/media/default/default_001_slideshow.xml');
/*	
	 var list01 ='http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/embed2/media/videoPlaylist1.xml';
	 var list02 ='http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/embed2/media/videoPlaylist2.xml';
	 var list03 ='http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/embed2/media/videoPlaylist3.xml';
	 var list04 ='http://mlearning.med.umich.edu/quiz/cbtlib/modules/test/flashvideo/designspace2/embed2/media/videoPlaylist4.xml';
	 */
	 
	var list01='media/videoPlaylist1.xml';
	var list02='media/videoPlaylist2.xml';
	var list03='media/videoPlaylist3.xml';
	var list04='media/videoPlaylist4.xml';
	 /*what functions can I use?
	 showDiv(mydiv); shows any element (not just divs) using display:block
	 showDivAndPlay(jsid,mydiv) shows any element using display block and play/pauses selected player .
	 hideIt(mydiv) simply invisifies (visibility:hidden) any element
	 
	 scrubTo(jsid,sec) moves the selected player to the selected number of seconds
	 
	 
	 */
  function doit(jsid,mydiv){ 
       window.document.getElementById('rotator').innerHTML+=('jsid='+jsid+'mydiv= '+mydiv);
	   document.getElementById(mydiv).style.display="block";
	   document.getElementById('player').style.visibility="hidden";
	   delayedPlayPause(jsid);
	 }
	 
     function doit2(mydiv){ 
	   document.getElementById(mydiv).style.display="block";
	   thisMovie(jsid).sendEvent('playpause');
	 }
	 function showDiv(mydiv){ 
	     document.getElementById(mydiv).style.visibility='visible';
		 }
	  function showDivAndPause(jsid,mydiv){ 
	     document.getElementById(mydiv).style.display="block";
		 thisMovie(jsid).sendEvent('playpause');
		 }
	 function showDivAndPlay(jsid,mydiv){
		 document.getElementById(mydiv).style.display="block";
		 thisMovie(jsid).sendEvent('playpause');
	 }
	 
	 function hideIt(mydiv){ 
	     document.getElementById(mydiv).style.visibility='hidden';  }
	
	 function closeIt(mydiv){ 
	     document.getElementById(mydiv).style.display='none'; }
	  
	  function closeItAndPlay(jsid,mydiv){
		 document.getElementById(mydiv).style.display="none";
		 delayedPlayPause(jsid); }
		 
	 function scrubTo(jsid,sec){
		 thisMovie(jsid).sendEvent('scrub',12);
		//document.getElementById('rotator').innerHTML+=(jsid);
		//playPause(jsid);
		}
	 