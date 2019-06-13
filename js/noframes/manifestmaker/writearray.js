//v. 1.5 02.07.12 emeiselm

//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = true;
var ismlearninglms="mlearning";

$(function(){
   $("#ismodule").click(function(){
        $("#modulelaunchlink").show();
        $("#quizlaunchlink").hide(); 
	}); 
	$("#isquiz").click(function(){
     	$("#quizlaunchlink").show();
      	$("#modulelaunchlink").hide();
	}); 
	
	$("#ismlearning").click(function(){
     	ismlearninglms=mlearning;
     	$("#launchurl").attr("placeholder","https://mlearningcontent2.med.umich.edu/content/ct/safety/firesafety2014/index.htm");
     	$("#otherlmsinstructions").hide();
	}); 
	$("#isanotherlms").click(function(){
     	ismlearninglms="other"; 
     	$("#otherlmsinstructions").show();
     	$("#launchurl").attr("placeholder","index.htm");
     	$("#launchurl").val = "index.htm";
	});
    

}); 
function createArray(){
    var courseid, coursetitle, lessontype, masteryscore;
	courseid = $('#courseid').val();
	coursetitle=$('#coursetitle').val();
	coursetitle=coursetitle.replace("'","\\'");//escape apostrophes
	lessontype=$('#lessontype').val();
	lessontype=lessontype.replace("'","\\'");//escape apostrophes
	masteryscore=$('#masteryscore').val();
	launchurl=$('#launchurl').val();
	sessionid=$('#sessionid').val();
	//alert('sessionid='+sessionid);
if(sessionid !=""){
    
	launchurl = "https://mlearningcontent2.med.umich.edu/content/ct/quizwrap2013/index.htm?q%3D"+sessionid+"%26svr%3Dpr%26cs%3D1";
}
var arr = document.getElementById('arr');
if(testing){console.log("courseid= "+courseid+", coursetitle= "+coursetitle)}
   
   var o = '<?xml version=\"1.0\" standalone=\"no\" ?>\r\n';
       o+= '<!-- created with MLearning\'s custom SCORMManifestMaker, on Thursday, July 10, 2014 8:30:59 AM -->';
       o+= '\r\n<manifest identifier=\"MAN-4520535-8242114\" version=\"1.0\" xmlns=\"http:\/\/www.imsproject.org\/xsd\/imscp_rootv1p1p2\"';
       o+= ' xmlns:adlcp=\"http:\/\/www.adlnet.org\/xsd\/adlcp_rootv1p2\" xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\"';
       o+= ' xsi:schemaLocation=\"http:\/\/www.imsproject.org\/xsd\/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd ';
       o+= 'http:\/\/www.imsglobal.org\/xsd\/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http:\/\/www.adlnet.org\/xsd\/adlcp_rootv1p2 adlcp_rootv1p2.xsd\"';
       o+= ' >\r\n<metadata>\r\n\t\t<schema>ADL SCORM<\/schema>\r\n\t\t<schemaversion>1.2<\/schemaversion>\r\n<\/metadata>\r\n<organizations ';
       o+= 'default=\"'+courseid+'\">\r\n\t<organization identifier=\"'+courseid+'\" structure=\"hierarchical\">\r\n\t\t';
       o+= '<title><![CDATA['+coursetitle+']]><\/title>\r\n\t\t<item identifier=\"item01\"';
       o+= ' identifierref=\"RES-7132393\"  isvisible=\"true\">\r\n\t\t\t<title><![CDATA['+lessontype+']]><\/title>\r\n\t\t\t';
       o+= '<adlcp:masteryscore>'+masteryscore+'<\/adlcp:masteryscore>\r\n\t\t<\/item>\r\n\t<\/organization>\r\n<\/organizations>\r\n<resources>\r\n';
       o+= '<resource identifier=\"RES-7132393\" type=\"text\/html\" adlcp:scormtype=\"sco\" ';
       o+= 'href=\"'+launchurl+'">';
       o+= '\r\n\t\t\t<file href=\"'+launchurl+'" \/>\r\n\t\t\t';
       o+= '<file href=\"page01.htm\" \/>\r\n\t\t<\/resource>\r\n\t<\/resources>\r\n<\/manifest>\r\n';
     
     arr.value=(o);
   
}//end   function
 





//alert(document.getElementById('entryforms').children[0].nodeValue);