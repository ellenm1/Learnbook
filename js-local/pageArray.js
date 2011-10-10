
/*var chapterArray=new Array(
	 {chapter:0,chapterTitle:''},
{chapter:1,chapterTitle:''},
{chapter:2,chapterTitle:''},
{chapter:3,chapterTitle:''},
{chapter:4,chapterTitle:''},
{chapter:4,chapterTitle:''},
{chapter:5,chapterTitle:''},
{chapter:6,chapterTitle:''},
{chapter:7,chapterTitle:''},
{chapter:8,chapterTitle:''},
{chapter:9,chapterTitle:''}
);*/


var docTitle=('MLearning SCORM-compatible HTML template');
var headerTitle=('MLearning SCORM-compatible HTML template');


var PageArray = new Array(  
{buttonTitle:'Competency Criteria', title:' ', url:'page01.htm', chapter:0,level:1 },
{buttonTitle:'Standard Embedded quiz - scores normally', title:'',url:'quizWrap.htm?call=embed&session=7526673413881281&href=http://ummcqmark01.mcit.med.umich.edu/q/session.dll',chapter:1,level:1, quiz:'7526673413881281' },
{buttonTitle:'Non-Scoring Embedded Quizzes', title:'',url:'page05.htm',chapter:1,level:2},
{buttonTitle:'Non-scoring but required Pre Test', title:'',url:'quizWrap.htm?call=embed&session=1033635988248861&href=http://ummcqmark01.mcit.med.umich.edu/q/session.dll',chapter:1,level:2, quiz:'1033635988248861', countscore:0},
{buttonTitle:'Score &amp; Status Page', title:'',url:'scorePage.htm',chapter:3,level:1 }


//IMPORTANT!!! the last item does NOT get a comma at the end.
); //do NOT delete this final punctuation       
 
//customizable msg displayed next to each non-scored quiz on the score and summary page
var noScoreQuizMsg=('Note: this pretest does not count toward your final score for this lesson.');

/*customizable message shown after each quiz after submitting your score. The original non-escaped HTML is on buttontest.htm. Alter that, then run through accessify.com's HTML2javascript converter
http://www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/default.php. Change str to afterQuizMsg and replace text shown below.*/
//var iScore;
//var iPercentScore;
//var afterQuizMsg='';
 
var PageArray2 = new Array(  
{buttonTitle:'Competency Criteria', title:' ', url:'page01.htm', chapter:0,level:1 },
{buttonTitle:'Switching module versions', title:'',url:'page06.htm',chapter:4,level:1 },
{buttonTitle:'Score &amp; Status Page', title:'',url:'scorePage.htm',chapter:6,level:1 }

//IMPORTANT!!! the last item does NOT get a comma at the end.
); //do NOT delete this final punctuation       
 
 
//if there are no interactions in this module, leave this area commented out!!
/*  var recommendedMsg = 'Recommended';
  var requiredMsg    = 'Must be completed to finish module';
  var completedMsg   = 'Completed';
  
   var IntArray = new Object(); //interactions object
   
      IntArray['p03_000'] = {id:'p03_000', tries:0, ascore:0, req:1, msg:'', quiz:100100000003},
      IntArray['p03_001'] = {id:'p03_001', tries:0, ascore:0, req:1, msg:'', quiz:100100000003},
      IntArray['p03_002'] = {id:'p03_002', tries:0, ascore:0, req:1, msg:'', quiz:100100000003},
      IntArray['p03_003'] = {id:'p03_003', tries:0, ascore:0, req:1, msg:'', quiz:100100000003},
      IntArray['p03_004'] = {id:'p03_004', tries:0, ascore:0, req:1, msg:'', quiz:100100000003},
      IntArray['p03_005'] = {id:'p03_005', tries:0, ascore:0, req:1, msg:'', quiz:100100000003},
      IntArray['p06_000'] = {id:'p06_000', tries:0, ascore:0, req:1, msg:'', quiz:100200000006}, 
      IntArray['p06_001'] = {id:'p06_001', tries:0, ascore:0, req:1, msg:'', quiz:100200000006},   
      IntArray['p06_002'] = {id:'p06_002', tries:0, ascore:0, req:1, msg:'', quiz:100200000006},  
      IntArray['p06_003'] = {id:'p06_003', tries:0, ascore:0, req:1, msg:'', quiz:100200000006}, 
      IntArray['p06_004'] = {id:'p06_004', tries:0, ascore:0, req:1, msg:'', quiz:100200000006},   
      IntArray['p07_001'] = {id:'p07_001', tries:0, ascore:0, req:0, msg:'', quiz:100200000007},  
      IntArray['p07_002'] = {id:'p07_002', tries:0, ascore:0, req:0, msg:'', quiz:100200000007}, 
      IntArray['p07_003'] = {id:'p07_003', tries:0, ascore:0, req:0, msg:'', quiz:100200000007}, 
      IntArray['p07_004'] = {id:'p07_004', tries:0, ascore:0, req:0, msg:'', quiz:100200000007}, 
      IntArray['p07_005'] = {id:'p07_005', tries:0, ascore:0, req:0, msg:'', quiz:100200000007},
      IntArray['p10_001'] = {id:'p10_001', tries:0, ascore:0, req:1, msg:'', quiz:100300000010},  
      IntArray['p10_002'] = {id:'p10_002', tries:0, ascore:0, req:1, msg:'', quiz:100300000010},  
      IntArray['p10_003'] = {id:'p10_003', tries:0, ascore:0, req:1, msg:'', quiz:100300000010},  
      IntArray['p11_001'] = {id:'p11_001', tries:0, ascore:0, req:1, msg:'', quiz:100100000011},
      IntArray['p12_001'] = {id:'p12_001', tries:0, ascore:0, req:1, msg:'', quiz:100200000012},
      IntArray['p13_001'] = {id:'p13_001', tries:0, ascore:0, req:1, msg:'', quiz:100300000013}
 
 */
						