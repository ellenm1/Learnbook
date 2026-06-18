//v. 1.5 02.07.12 emeiselm

//http://www.sitepoint.com/forums/showthread.php?t=575320
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
var testing = true;
var ismlearninglms="other";
var is2004quiz = false;	
     	
     	
$(function(){
   $("#ismodule").click(function(){
        $("#modulelaunchlink").show();
        $("#quizlaunchlink").hide(); 
        $("#launchurl").attr("placeholder","e.g. index.htm, index_lms.htm, index_scorm.html");
     	$("#launchurl").val = "index.htm";
     	is2004quiz = false;
	}); 
	$("#isquiz").click(function(){
     	$("#quizlaunchlink").show();
      	$("#modulelaunchlink").hide();
      	is2004quiz = false;
	});
	$("is2004quiz").click(function(){
     	$("#quizlaunchlink").show();
      	$("#modulelaunchlink").hide();
      	is2004quiz = true;
		});
	/*$("#ismlearning").click(function(){
     	ismlearninglms="mlearning";
     	$("#otherlmsinstructions").hide();
     	$("#launchurl").attr("placeholder","https://mlearningcontent2.med.umich.edu/content/ct/safety/firesafety2014/index.htm");
     	
	}); 
	$("#isanotherlms").click(function(){
     	ismlearninglms="other"; 
     	//$("#otherlmsinstructions").show();
     	$("#launchurl").attr("placeholder","e.g. index.htm, index_lms.htm, index_scorm.html");
     	$("#launchurl").val = "index.htm";
	});*/
    

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
    
	//launchurl = "https://mlearningcontent2.med.umich.edu/content/ct/quizwrap2013/index.htm?q%3D"+sessionid+"%26svr%3Dpr%26cs%3D1";
	launchurl = "index.htm?q%3D"+sessionid+"%26svr%3Dpr%26cs%3D1";
}
var arr = document.getElementById('arr');
if(testing){console.log("courseid= "+courseid+", coursetitle= "+coursetitle)}
if(!is2004quiz){
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
      // o+= '\r\n\t\t\t<file href=\"'+launchurl+'" \/>\r\n\t\t\t';
       o+= '\r\n\t\t\t<file href=\"'+launchurl+'" \/>';
       o+= '\r\n\t\t<\/resource>\r\n\t<\/resources>\r\n<\/manifest>\r\n';
     
     arr.value=(o);
    } 
     
 else if(is2004quiz){   
     var o = '<?xml version=\"1.0\" standalone=\"no\"?>\r\n<manifest identifier=\"SCORM2004QMQUIZ\" version=\"1.0\" \r\n';
         o+= '                  xmlns = \"http:\/\/www.imsglobal.org\/xsd\/imscp_v1p1\"\r\n';
         o+= '                  xmlns:adlcp = \"http:\/\/www.adlnet.org\/xsd\/adlcp_v1p3\"\r\n';
         o+= '                  xmlns:adlseq = \"http:\/\/www.adlnet.org\/xsd\/adlseq_v1p3\"\r\n';
         o+= '                  xmlns:adlnav = \"http:\/\/www.adlnet.org\/xsd\/adlnav_v1p3\"\r\n';
         o+= '                  xmlns:imsss = \"http:\/\/www.imsglobal.org\/xsd\/imsss\"\r\n';
         o+= '                  xmlns:xsi = \"http:\/\/www.w3.org\/2001\/XMLSchema-instance\"\r\n';
         o+= '                  xsi:schemaLocation = \"http:\/\/www.imsglobal.org\/xsd\/imscp_v1p1 imscp_v1p1.xsd\r\n';                                                    
         o+= '                                       http:\/\/www.adlnet.org\/xsd\/adlcp_v1p3 adlcp_v1p3.xsd\r\n';                                              
         o+= '                                       http:\/\/www.adlnet.org\/xsd\/adlseq_v1p3 adlseq_v1p3.xsd\r\n';                                        
         o+= '                                       http:\/\/www.adlnet.org\/xsd\/adlnav_v1p3 adlnav_v1p3.xsd\r\n';                                              
         o+= '                                       http:\/\/www.imsglobal.org\/xsd\/imsss imsss_v1p0.xsd\">\r\n\r\n\r\n\t';
         o+= '<metadata>';
         o+= '\r\n\t\t<schema>ADL SCORM<\/schema>\r\n\t\t';
         o+= '<schemaversion>2004 4th Edition<\/schemaversion>';
         o+= '\r\n\t\t<lom xmlns=\"http:\/\/ltsc.ieee.org\/xsd\/LOM\"\r\n';
         o+= '\t\t\txmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\"\r\n';
         o+= '\t\t\txsi:schemaLocation=\"http:\/\/ltsc.ieee.org\/xsd\/LOM lom.xsd\">\r\n';
         o+= '\t\t\t<general>';
         o+= '\r\n\t\t\t\t<title>';
         o+= '\r\n\t\t\t\t\t<string language=\"en\"><![CDATA['+coursetitle+']]><\/string>';
         o+= '\r\n\t\t\t\t';
         o+= '<\/title>\r\n\t\t\t\t<description>\r\n';
         o+= '         \t\t\t\t<string language=\"en\"><![CDATA['+coursetitle+']]><\/string>\r\n';        
         o+= '\t\t\t<\/description>\r\n\t\t\t\t\r\n\t\t\t<\/general>\r\n\t\t\t<metaMetadata>'
         o+= '\r\n\t\t\t\t<metadataSchema>LOMv1.0<\/metadataSchema>'
         o+= '\r\n\t\t\t\t<metadataSchema>SCORM_CAM_v1.3<\/metadataSchema>'
         o+= '\r\n\t\t\t<\/metaMetadata>'
         o+= '\r\n\t\t<\/lom>\r\n\t<\/metadata>'
         o+= '\r\n\r\n\r\n\t<organizations default=\"'+courseid+'\">'
         o+= '\r\n\t\t<organization identifier=\"'+courseid+'\" structure=\"hierarchical\">'
         o+= '\r\n\t\t\t<title><![CDATA['+coursetitle+']]><\/title>\r\n\t\t\t'
         o+= '<item identifier=\"Assessment1\" identifierref=\"RES-7132393\">';
         o+= '\r\n\t\t\t\t<title><![CDATA['+coursetitle+']]><\/title>';
         o+= '\r\n\t\t\t\t\r\n\t\t\t\t<imsss:sequencing> \r\n\t\t\t\t\t<imsss:objectives>';
         o+= '\r\n\t\t\t\t\t\t<imsss:primaryObjective satisfiedByMeasure=\"true\">';
         o+= '\r\n\t\t\t\t\t\t\t<imsss:minNormalizedMeasure>0.8<\/imsss:minNormalizedMeasure>';
         o+= '\r\n\t\t\t\t\t\t<\/imsss:primaryObjective>';
         o+= '\r\n\t\t\t\t\t<\/imsss:objectives>';
         o+= '\r\n\t\t\t\t<\/imsss:sequencing>';
         o+= '\r\n\t\t\t\t\r\n\t\t\t<\/item>';
         o+= '\r\n\t\t<\/organization>';
         o+= '\r\n\t<\/organizations>';
         o+= '\r\n\t<resources>';
         o+= '\r\n\t\t\r\n\t\t<resource identifier=\"RES-7132393\" type=\"webcontent\" adlcp:scormType=\"sco\" ';
         o+= 'href=\"index.htm?call=onepagewrap&amp;session='+sessionid+'&amp;href=https%3a%2f%2fmlearningquiz6.med.umich.edu%2fdelivery%2fsession.php&amp;customerid=reposprod6\">';
         o+= '\r\n\t\t\t<metadata>\r\n\t\t\t\t<lom xmlns=\"http:\/\/ltsc.ieee.org\/xsd\/LOM\"\r\n';
         o+= '  \t\t\t\t\txmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\"\r\n';
         o+= '  \t\t\t\t\txsi:schemaLocation=\"http:\/\/ltsc.ieee.org\/xsd\/LOM lom.xsd\">';
         o+= '\r\n\t\t\t\t\t<general>\r\n\t\t\t\t\t\t<title>\r\n\t\t\t\t\t\t\t<string language=\"en\">Test Out Prototype Quiz<\/string>\r\n\t\t\t\t\t\t<\/title>\r\n\t\t\t\t\t\t<description>';
         o+= '\r\n\t\t\t\t\t\t\t<string language=\"en\"><\/string>\r\n\t\t\t\t\t\t<\/description>';
         o+= '\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t<\/general>\r\n\t\t\t\t\t<metaMetadata>\r\n\t\t\t\t\t\t<identifier>';
         o+= '\r\n\t\t\t\t\t\t\t<catalog>URI<\/catalog>'
         o+= '\r\n\t\t\t\t\t\t\t<entry>index.htm?call=scorm&amp;session='+sessionid+'&amp;href=https%3a%2f%2fmlearningquiz6.med.umich.edu%2fdelivery%2fsession.php&amp;customerid=reposprod6<\/entry>';
         o+= '\r\n\t\t\t\t\t\t<\/identifier>';
         o+= '\r\n\t\t\t\t\t\t<metadataSchema>LOMv1.0<\/metadataSchema>';
         o+= '\r\n\t\t\t\t\t\t<metadataSchema>SCORM_CAM_v1.3<\/metadataSchema>';
         o+= '\r\n\t\t\t\t\t<\/metaMetadata>\r\n\t\t\t\t\t<technical>\r\n';
         o+= '\t\t\t\t\t\t<format>text\/html<\/format>\r\n\t\t\t\t\t<\/technical>\r\n';
         o+= '\t\t\t\t\t<educational>\r\n\t\t\t\t\t\t<interactivityType>\r\n\t\t\t\t\t\t\t<source>LOMv1.0<\/source>';
         o+= '\r\n\t\t\t\t\t\t\t<value>active<\/value>\r\n\t\t\t\t\t\t<\/interactivityType>';
         o+= '\r\n\t\t\t\t\t     \r\n\t\t\t\t\t     \r\n\t\t\t\t\t     \r\n\t\t\t\t\t<\/educational>';
         o+= '\t\r\n\t\t\t\t\t<rights>\r\n\t\t\t\t\t\t<cost>\r\n\t\t\t\t\t\t\t<source>LOMv1.0<\/source>';
         o+= '\r\n\t\t\t\t\t\t\t<value>yes<\/value>\r\n\t\t\t\t\t\t<\/cost>\r\n\t\t\t\t\t\t<copyrightAndOtherRestrictions>\r\n\t\t\t\t\t\t\t<source>LOMv1.0<\/source>';
         o+= '\r\n\t\t\t\t\t\t\t<value>yes<\/value>\r\n\t\t\t\t\t\t<\/copyrightAndOtherRestrictions>';
         o+= '\r\n\t\t\t\t\t<\/rights>\r\n\t\t\t\t\t<classification>\r\n\t\t\t\t\t\t<purpose>';
         o+= '\r\n\t\t\t\t\t\t\t<source>LOMv1.0<\/source>';
         o+= '\r\n\t\t\t\t\t\t\t<value>educational objective<\/value>\r\n\t\t\t\t\t\t<\/purpose>\r\n\t\t\t\t\t\t<keyword>\r\n\t\t\t\t\t\t\t<string language=\"en\">Critical Behavior 1<\/string>';
         o+= '\r\n\t\t\t\t\t\t<\/keyword><keyword>\r\n\t\t\t\t\t\t\t<string language=\"en\">Critical Behavior 2<\/string>\r\n\t\t\t\t\t\t<\/keyword><keyword>';
         o+= '\r\n\t\t\t\t\t\t\t<string language=\"en\">Critical Behavior 3<\/string>\r\n\t\t\t\t\t\t<\/keyword>\r\n\t\t\t\t\t<\/classification>\r\n\t\t\t\t<\/lom>\r\n\t\t\t<\/metadata>';
         o+= '\r\n\t\t\t<file href=\"index.htm\"\/>\r\n\t\t<\/resource>\r\n\t\t\r\n\t<\/resources>\r\n<\/manifest>';
     
     arr.value=(o);
     
     }
    
    
    
    
    
    
    
    
    
    
     
     
   
}//end   function
 





//alert(document.getElementById('entryforms').children[0].nodeValue);