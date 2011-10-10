// JavaScript Document
//this is a workaround for the fact that there is no "stop" flashvar in the JW Player. This script uses the Javascript API to force the player to play ONLY a specified clip out of the video, and do a hard stop. 


      var player1         =  null;
	  var player2         =  null;
      var playlist1       =  null;
	  var playlist2       =  null;
      var currentItem1     =   0;
	  var currentItem2     =   0;
      var previousItem1    =  -1;
	  var previousItem2   =   -1;
	  var currentFile1     =  null;
	  var currentFile2     =  null;
      var previousFile1    =  null;
	  var previousFile2    =  null;
      var currentPosition1 =     0;
	  var currentPosition2 =     0;
      var currentStart1    =  null;
	  var currentStart2    =  null;
      var currentEnd1      =  null;
	  var currentEnd2      =  null;
      var currentDur1      =  null;
	  var currentDur2      =  null;
      var stopPos1        =     0;
	  var stopPos2         =    0;
      var advance1         = 'dur';
	  var advance2         = 'dur';
	  var testing         =  false;
	  var thegetPlayers    = false; //used to prevent calling the getPlayers function twice


     /* function playerReady(obj)
      {
        player = document.getElementsByName(obj.id)[0];
		alert(player.id);
        player.addModelListener('TIME', 'timeMonitor');
        player.addControllerListener('ITEM', 'itemMonitor');

       setTimeout("playlist = player.getPlaylist()", 100);
       player.addControllerListener("PLAYLIST", "playlistHandler");
      //setTimeout("dumpPlaylist()", 200);
      };*/
	  
	  
	  
	  
      function playerReady(obj)
      {
		  getPlayers();
         if (testing){ gid('generalMsg').innerHTML += "<br/>playerReady being called now";}
         		 // getPlayers();
      };

//http://www.longtailvideo.com/support/forum/Setup-Problems/13910/Two-Players-in-parallel-
      function  getPlayers()
      {
		 // if(thegetPlayers ==false){
       //alert("getPlayers being called now");
		player1 = gid('player1');
		player2 = gid('player2');
		 if (testing){gid('generalMsg').innerHTML += '<br/><b>Im in getPlayers</b><br/> player1='+player1.id+'<br>player2='+player2.id;}
		 
            player1.addModelListener("TIME",  "timeMonitor1");
			player2.addModelListener("TIME",  "timeMonitor2");
		    player1.addViewListener("ITEM",   "itemMonitor1");
		    player2.addViewListener("ITEM",   "itemMonitor2");
            player1.addControllerListener("PLAYLIST", "playlistHandler1");
			player2.addControllerListener("PLAYLIST", "playlistHandler2");
			 if (testing){gid('generalMsg').innerHTML += "<br/>Player1 Ready(): " + player1.id+"<br/>Player2 Ready(): " + player2.id;}
	        thegetPlayers=true;
		 // }//end if the getplayers == false
		};




	 function playlistHandler1(){ 
	    playlist1 = player1.getPlaylist();
	   if (testing){  gid('generalMsg').innerHTML += "<br/>inPlaylistHandler1:";
		gid('generalMsg').innerHTML += "<br/>playlist1[currentItem1].file= "+playlist1[currentItem1]['file'];
		gid('generalMsg').innerHTML += "<br>playlist1[currentItem1].start= "+playlist1[currentItem1]['dur'];
	    dumpPlaylist1();}
		currentStart1 = 1 * playlist1[currentItem1]['start'];
	       if (testing){  gid('currentStart1').innerHTML += "<br/>" +currentStart1;}
        currentEnd1   = 1 * playlist1[currentItem1]['end'];
        currentDur1   = 1 * playlist1[currentItem1]['dur'];
		   if (testing){  gid('currentDur1').innerHTML += "<br/>" +currentDur2;}
	    playlist1[currentItem1].duration      = currentDur1;
        stopPos1      = currentStart1 + currentDur1;
      if (testing){  gid("stopPosition1").innerHTML += "<br/>" +stopPos1;}
       currentFile1  = playlist1[currentItem1]['file'];
	 }
	 
	 
     function playlistHandler2(){ 
	    playlist2 = player2.getPlaylist(); 
	   if (testing){  gid('generalMsg').innerHTML += "<br/><b>inPlaylistHandler2:</b> playlist[currentItem2].start= "+playlist2[currentItem2].start;
	    dumpPlaylist2();}
		 currentStart2 = 1 * playlist2[currentItem2]['start'];
	    if (testing){     gid('currentStart2').innerHTML += "<br/>currentStart2= " +currentStart2;}
          currentEnd2   = 1 * playlist2[currentItem2]['end'];
          currentDur2   = 1 * playlist2[currentItem2]['dur'];
		  if (testing){   gid('currentDur2').innerHTML += "currentDur2=" +currentDur2;}
		  duration      = currentDur2;
          stopPos2      = currentStart2 + currentDur2;
		  if (testing){   gid('stopPosition2').innerHTML += "stopPos2 =" +stopPos2 ; }
          currentFile2  = playlist2[currentItem2]['file'];
	 }
	 
	 function timeMonitor1(obj) {
          currentPosition1 = obj.position;
		if (testing){   gid('timeMonitor').innerHTML += "<br>obj.id="+obj.id+" currentPosition1: " + currentPosition1 + "<br/>currentDur1: '" + currentDur1 + "<br/>currentStart: " + currentStart1 + "<br/>Stop Position1: " + stopPos1;}
		 if(currentPosition1 >= stopPos1){
                  if(playlist1[currentItem1+1]) {   
		          player1.sendEvent('NEXT');
				  if (testing){   gid('timeMonitor').innerHTML += '<br>AAA sendEvent NEXT';}
				   }
		          else {   player1.sendEvent('STOP');
				if (testing){     gid('timeMonitor').innerHTML += '<br>AAA sendEvent STOP';}
				   }
		           }
      };
	  
	  function timeMonitor2(obj)
      {
        currentPosition2 = obj.position;
           if (testing){   gid('timeMonitor').innerHTML += "<br>obj.id="+obj.id+" currentPosition2: " + currentPosition2 + "<br/>currentDur2: '" + currentDur2 + "<br/>currentStart: " + currentStart2 + "<br/>Stop Position2: " + stopPos2;}
		 if(currentPosition2 >= stopPos2)
        {
		if (testing){  gid('timeMonitor').innerHTML += '<br>YES!';
          gid('timeMonitor').innerHTML += '<br>currentPosition2: ' + currentPosition2 + '<br/>currentDur2: ' + currentDur2 + '<br/>currentStart: ' + currentStart2 + '<br/>Stop Position2: ' + stopPos2; }
		   if(playlist2[currentItem2+1])
		        { 
		         player2.sendEvent('NEXT'); 
				if (testing){    gid('timeMonitor').innerHTML += '<br>sendEvent NEXT';}
				 } //end if(playlist2[currentItem2+1])
		   else  {  
		          player2.sendEvent('STOP'); 
		       if (testing){     gid('timeMonitor').innerHTML += '<br>sendEvent STOP';}
		         } //end else
		}//end  if(currentPosition2 >= stopPos2)
		else if(currentPosition2 <=currentStart2){
		   	 player2.sendEvent('PLAY'); 
			if (testing){   gid('timeMonitor').innerHTML += '<br>BBBBsendEvent PLAY';}
			
		}
      };  




   function itemMonitor1(obj)
      {
		alert(obj.index);
        currentItem1 = obj.index;
	   if (testing){   gid('itemMonitor').innerHTML += '<br/>currentItem1.title='+currentItem1.title;	 
        gid('itemMonitor').innerHTML += '<br/>ItemMonitor1 says:<br/>currentItem1: ' + currentItem1 + '<br>previousItem1: ' + previousItem1 + '<br>currentItem Start1: ' + playlist1[currentItem1]['start'];}
       
	   if(currentItem1==previousItem1){
		setTimeout("player1.sendEvent('SEEK', currentStart1); gid('itemMonitor').innerHTML += '<br>sendEvent SEEK1';", 500);	
		setTimeout("player1.sendEvent('NEXT'); gid('itemMonitor').innerHTML += '<br>sendEvent NEXT1';",200);
		}
	
          currentStart1 = 1 * playlist1[currentItem1]['start'];
	        if (testing){    gid('currentStart1').innerHTML += "<br/>b" +currentStart1;}
          currentEnd1   = 1 * playlist1[currentItem1]['end'];
          currentDur1   = 1 * playlist1[currentItem1]['dur'];
		  if (testing){       gid('currentDur1').innerHTML += "<br/>b" +currentDur2;}
		  playlist1[currentItem1].duration      = currentDur1;
          stopPos1      = currentStart1 + currentDur1;
             if (testing){gid('stopPosition1').innerHTML += "<br/>b" +stopPos1;}
          currentFile1  = playlist1[currentItem1]['file'];
	    };


 function itemMonitor2(obj)
      {
		  alert(obj.index);
         currentItem2 = obj.index;
	     if (testing){gid('itemMonitor').innerHTML +=  '<br>currentStart2=' + currentStart2 +'<br>currentItem2= ' + currentItem2 + '<br>previousItem2: ' + previousItem2 + '<br>CurrentItemStart2: ' + playlist2[currentItem2]['start']; }
       
	   if(currentItem2==previousItem2){
		setTimeout("player2.sendEvent('SEEK', currentStart2); gid('itemMonitor').innerHTML += '<br>sendEvent SEEK2';", 500);	
		setTimeout("player2.sendEvent('NEXT'); gid('itemMonitor').innerHTML += '<br>sendEvent NEXT2';",200);
		}
		if(currentItem2 != previousItem2)
        {
          previousItem2 = currentItem2;
          currentStart2 = 1 * playlist2[currentItem2]['start'];
		 if (testing){ gid('currentDur2').innerHTML +=  "playlist2[currentItem2]['start']; " + playlist2[currentItem2]['start']+ " currentDur2="+currentDur2;
		  gid('currentStart2').innerHTML += "currentStart2" +currentStart2; }
          currentEnd2   = 1 * playlist2[currentItem2]['end'];
          currentDur2   = 1 * playlist2[currentItem2]['dur'];
		  if (testing){gid('currentDur2').innerHTML +=  " currentDur2" + currentDur2;}
		  
          stopPos2      = currentStart2 + currentDur2;
          //upDate2 = true;
		//  alert('currentItem='+currentItem);
		   // extra seek if the file has changed
          currentFile2  = playlist2[currentItem2]['file'];
		/*  if(currentFile2 != previousFile2)
          {
			// alert('currentFile != previousFile');
            previousFile2 = currentFile2;
            setTimeout("player2.sendEvent('SEEK', currentStart2)", 500);
			setTimeout("player2.sendEvent('PLAY')",200);
		alert('currentStart2 after Seek='+currentStart2);
			
          } */
		        
        }
      };

      function dumpPlaylist1()
      {
		  //alert('attempting to dumpPlaylist1');
        for(var j in playlist1)
        {
          var nodes = '<br />';
          for(var k in playlist1[j])
          { nodes += '<li>' + k + ': ' + playlist1[j][k] + '</li>'; }
          gid('dump1').innerHTML = '<br><b>playlist1</b>'+nodes;
        }
      };
	  
	  
	    function dumpPlaylist2() {
		//	alert('attempting to dumpPlaylist2');
        for(var a in playlist2)
        {
          var nodes = '<br />';
          for(var b in playlist2[a])
          { nodes += '<li>' + b + ': ' + playlist2[a][b] + '</li>'; }
          gid('dump2').innerHTML = '<br><b>playlist2</b>'+nodes;
        }
      };

      function gid(name)
      {
        return document.getElementById(name);
      };
    