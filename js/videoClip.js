// JavaScript Document
//this is a workaround for the fact that there is no "stop" flashvar in the JW Player. This script uses the Javascript API to force the player to play ONLY a specified clip out of the video, and do a hard stop. 


      var player          =  null;
      var playList        =  null;
      var currentItem     =     0;
      var previousItem    =    -1;
      var currentPosition =     0;
      var currentStart    =  null;
      var currentEnd      =  null;
      var currentDur      =  null;
      var stopPos         =     0;
    //var advance         = 'end';
      var advance         = 'dur';
      var upDate          = false;
	  var testing         = false;


      function playerReady(obj)
      {
        player = document.getElementsByName(obj.id)[0];
        player.addModelListener('TIME', 'timeMonitor');
        player.addControllerListener('ITEM', 'itemMonitor');

       setTimeout("playList = player.getPlaylist()", 100);
       player.addControllerListener("PLAYLIST", "playlistHandler");
      //setTimeout("dumpPlaylist()", 200);
      };
	  
	  function playlistHandler()
		{
		  playList = player.getPlaylist();
		}
     
	 function timeMonitor(obj)
      {
        currentPosition = obj.position;
      //for debugging
	  //gid('time').innerHTML = 'Time: ' + currentPosition;

        if((currentPosition >= currentEnd) && (advance == 'end') && (upDate == true))
        {
//alert('upDate: ' + upDate + '\nCurrent Position: ' + currentPosition + '\nCurrent End: ' + currentEnd + '\nCurrent Start: ' + currentStart + '\nStop Position: ' + currentEnd);
          upDate = false;
          player.sendEvent('NEXT');
        }

        if((currentPosition >= stopPos) && (advance == 'dur') && (upDate == true))
        {
 //alert('upDate: ' + upDate + '\nCurrent Position: ' + currentPosition + '\nCurrent Dur: ' + currentDur + '\nCurrent Start: ' + currentStart + '\nStop Position: ' + stopPos);
          upDate = false;
		  if(playList[currentItem+1])
		    {
             player.sendEvent('NEXT');   
             }
		   else 
		    { 
		    player.sendEvent('STOP');
		    }
		}
      };

      function itemMonitor(obj)
      {
        currentItem = obj.index;
		 
//alert('currentItem: ' + currentItem + '\npreviousItem: ' + previousItem + '\nCurrent Item Start: ' + playList[currentItem]['start']);
        if(currentItem != previousItem)
        {
          previousItem = currentItem;
          // get start, end & dur for the current item
          currentStart = 1 * playList[currentItem]['start'];
          currentEnd   = 1 * playList[currentItem]['end'];
          currentDur   = 1 * playList[currentItem]['dur'];
          stopPos      = currentStart + currentDur;
        
		if (testing)
          { 
		  gid('item').innerHTML  = 'Item: '  + currentItem;
          gid('start').innerHTML = 'Start: ' + currentStart;
          gid('end').innerHTML   = 'End: '   + currentEnd;
          gid('dur').innerHTML   = 'Dur: '   + currentDur;
          gid('stop').innerHTML  = 'Stop: '  + stopPos;
		  } 
		  
          upDate = true;
        }
      };

      function dumpPlaylist()
      {
        for(var j in playList)
        {
          var nodes = '<br />';

          for(var k in playList[j])
          {
            nodes += '<li>' + k + ': ' + playList[j][k] + '</li>';
          }
          gid('dump' + j).innerHTML = nodes;
        }
      };

      function gid(name)
      {
        return document.getElementById(name);
      };
    