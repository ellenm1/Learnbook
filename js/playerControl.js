//  alert("I am here!!!");

    var currentFile;
    var currentItem;
    var currentSlide;
    var currentPosition;
    var currentSlideshowPlaylist;
    var currentVideoPlaylist;
    var newSlideshowPlaylist;
    var newSlide;	
 
	
    function thisMovie(movieName){
      if(navigator.appName.indexOf("Microsoft") != -1){ return window[movieName];  }
      else
      { return document[movieName];  }
    };

     // these functions are caught by the feeder object of the player.

  
  
  function loadFile(jsid, obj) {
		
		thisMovie(jsid).loadFile(obj);
        if (jsid == 'mpl1') {
        // position the playlist to the first item, with the mediaplayer stopped
        setTimeout("thisMovie('mpl1').sendEvent('playitem', 0)", 300);
        setTimeout("thisMovie('mpl1').sendEvent('stop')", 450);
      }
      // reset the slide counter when a new video playlist is loaded
       currentSlide = 0;
	   currentVideoPlaylist = obj['file'];
	   delayedShowItemList();																	 
    };
function loadAndStart(jsid, file){
	  loadFile(jsid,file);
	delayedPlayPause(jsid);
	delayedShowItemList(); 
}	  
function delayedLoadFile(jsid, obj){ setTimeout("loadFile('"+jsid+"', obj)", 1000);  }
function delayedShowItemList(){      setTimeout("showItemList(currentVideoPlaylist)",450);}
function delayedPlayPause(jsid){     setTimeout("thisMovie('"+jsid+"').sendEvent('playpause')", 450); }
function delayedStop(jsid){          setTimeout("thisMovie('"+jsid+"').sendEvent('stop')", 450);}
function delayedVolume(amt){         setTimeout("thisMovie('"+jsid+"').sendEvent('volume',"+amt+")", 450); }
function playPause(jsid){  thisMovie('"+jsid+"').sendEvent('playpause')}
   
   function getUpdate(typ, pr1, pr2, pid) { 
	  if((pid != "null") && (pid == 'mpl1')){
		  if(typ == 'time') {
          // advance the slideshow by going through the sync array,
          // until the position in the sync array is greater than
          // the currentPosition, then use that slide number - 1
          // newSlide = 0;
           currentPosition = pr1;
            for(var i in sync) { 
		      if(i = currentPosition){
				 newSlide = sync[i] - 1; 
				 newFunction = sync[i]+""; 
				 //for debug:
				// document.getElementById('ellen').innerHTML+=('<br>'+newFunction);
				 eval(newFunction);
				 break;
            } //end if(i = currentPosition)
          }//for(var i in sync) 
		  
           // if the currentSlide hasn't been updated, do it now
          // slide number has to be - 1 because the playlist array starts at 0

          if(newSlide != currentSlide) {
           // this is where the slide is actually changed
           thisMovie('rot1').sendEvent('playitem', (newSlide - 1));
           currentSlide = newSlide;
           } // end if(newSlide != currentSlide)
 
 // Purely for debug
          ti = document.getElementById('timee');
         ti.innerHTML = 'Time: ' + currentPosition;
        //  sl = document.getElementById('slide');
        //  sl.innerHTML = 'Slides => Current: ' + currentSlide + '  New: ' + newSlide;
        }//end  if(typ == 'time') 

        else if(typ == 'item')  {

          currentItem = pr1;
          setTimeout("getItemData(currentItem)", 100);
        }// end  else if(typ == 'item') 


        // output the player data for debug

      //  var id = document.getElementById(typ);
     //   id.innerHTML = typ + ": " + Math.round(pr1);
     //  pr2 == undefined ? null: id.innerHTML += ", " + Math.round(pr2);
     //  if(pid != "null") {
      //      document.getElementById('pid').innerHTML = "(received from the player with id <i>" + pid + "</i>)";
      //  }//end if(pid != "null") 
       }// if((pid != "null") && (pid == 'mpl1'))
    };//end function getUpdate



    function getItemData(idx) {

      var obj = thisMovie('mpl1').itemData(idx);

     // output the player data for debug
     var nodes = "";
     for(var i in obj) {  nodes += "<li>" + i + ": " + obj[i] + "</li>";  }

   //  document.getElementById("data").innerHTML = nodes;
      // typical filenames
      // ../media/E101/unit_001.flv
      // ../media/E101/unit_001_slideshow.xml
      // do we need to load a new slideshow file?
      currentFile = obj['file'];
      // change this: "../media/E101/unit_001.flv" to this: "../media/E101/unit_001_slideshow.xml"

      newSlideshowPlaylist = currentFile.substring(0, currentFile.indexOf('.flv')) + '_slideshow.xml';
	  
	  





      // Purely for debug

   //   fn = document.getElementById('filename');

   //   fn.innerHTML  = '&nbsp;&nbsp;Video File Name: ' + currentFile;

   //   nSP = document.getElementById('slideshowplaylist');

   //   nSP.innerHTML = 'Slideshow Playlist: ' + newSlideshowPlaylist;





      if(newSlideshowPlaylist != currentSlideshowPlaylist)

      {
        // this is where the new slideshow playlist is actually loaded
        loadFile('rot1', {file:newSlideshowPlaylist});
        setTimeout("thisMovie('rot1').sendEvent('playitem', 0)", 250);

        // this is so we know that the slideshow playlist was changed
        currentSlideshowPlaylist = newSlideshowPlaylist;



        // parse the playlist <annotation> element (flashvar 'description')

        // into Image Rotator time:slidenumber control points

        sync     = new Array();
        keypairs = new Object();
        numKP    = 1;
        anno     = obj['description'];

        while (anno.indexOf('|') > -1) {
          keypairs[numKP] = anno.substring(0, anno.indexOf('|'));
          anno            = anno.substring((anno.indexOf('|')) + 1);
          numKP++;
        }

        // Store the last keypairs[] data.
        keypairs[numKP] = anno;

       // Purely for debug

      //  des = document.getElementById('annotation');
      //   des.innerHTML = 'Annotation: ' + anno;
      // nkp = document.getElementById('numkeypairs');
      //  nkp.innerHTML = ' Key Pairs: ' + numKP;
      // dbg = document.getElementById('debug');
      //  dbg.innerHTML = '     Debug: ' + anno;
      // split into time:slidenumber pairs

        for (var i in keypairs){
          // Left of ':' is video time.
          keyTime = keypairs[i].substring(0, keypairs[i].indexOf(':'));
          // Right of ':' is slide number.
          keyAction = keypairs[i].substring((keypairs[i].indexOf(':')) + 1);
          // array of time:slidenumber pairs for syncing slides with video
		  //populate the array "sync" with the list of slides by time calledfor 
          sync[keyTime] = keyAction;
        }//end  for (var i in keypairs

      }

    };

    
    function loadPlayers(initVideoPlaylist, initSlidePlaylist){
      currentSlideshowPlaylist = initSlidePlaylist;
      createPlayer(initVideoPlaylist);
      createRotator(initSlidePlaylist);
    }
	
	function showItemList(file){
	document.getElementById('itemList').innerHTML=""; //blank slate
	    var plength=thisMovie('mpl1').getLength();
	for (var i=0; i < plength; i++){
	  	var theData=thisMovie('mpl1').itemData(i);
	    document.getElementById('itemList').innerHTML+=('<li><a href="#" onclick="thisMovie(\'mpl1\').sendEvent(\'playitem\','+i+')">'+theData['title']+'</a></li>')
	    }
	}