/*v 1.1 9-28-2007*/


var chapterArray=new Array(
{chapter:0,chapterTitle:' '},
{chapter:1,chapterTitle:' '},
{chapter:2,chapterTitle:' '},
{chapter:3,chapterTitle:' '},
{chapter:4,chapterTitle:' '},
{chapter:5,chapterTitle:' '},
{chapter:6,chapterTitle:' '},
{chapter:7,chapterTitle:' '},
{chapter:8,chapterTitle:' '},
{chapter:9,chapterTitle:' '},
{chapter:10,chapterTitle:' '},
{chapter:11,chapterTitle:' '},
{chapter:12,chapterTitle:' '},
{chapter:13,chapterTitle:' '},
{chapter:14,chapterTitle:' '}
);

var docTitle=('Cardiac Surgery Critical Care Training: Unit 9');
var headerTitle=('Cardiac Surgery Critical Care Training: Unit 9');
var checkBookmark=0;
 
var PageArray = new Array( 
{buttonTitle:'Competency Criteria', title:' ', url:'page01.htm', chapter:0,level:1 },
{buttonTitle:'Critical Care Issues', title:'', url:'page02.htm',chapter:1,level:1 },
{buttonTitle:'Recommended', title:'', url:'page04.htm',chapter:1,level:2, type:'I', quiz:'900100000004', countscore:0  },
{buttonTitle:'Attestation', title:'', url:'page11.htm',chapter:1,level:2,  type:'I', quiz:'900100000011', countscore:1 },
{buttonTitle:'Cardiac', title:'', url:'page05.htm',chapter:2,level:1 },
{buttonTitle:'Required', title:'', url:'page06.htm',chapter:2,level:2, type:'I', quiz:'900200000006', countscore:1  },
{buttonTitle:'Chapter 13 Quiz', title:'',url:'quizWrap.htm?call=embed&session=8746508067843786&href=http://ummcqmark01.mcit.med.umich.edu/q/session.dll',chapter:2,level:3, type:'Q', quiz:'8746508067843786' },
{buttonTitle:'Attestation', title:'', url:'page12.htm',chapter:2,level:2, type:'I', quiz:'900200000012', countscore:1 },
{buttonTitle:'References', title:'', url:'page18.htm',chapter:3,level:1 },
{buttonTitle:'Quiz', title:'',url:'quizWrap.htm?call=embed&session=8576835045657849&href=http://ummcqmark01.mcit.med.umich.edu/q/session.dll',chapter:4,level:1, type:'Q', quiz:'8576835045657849' },
{buttonTitle:'Score &amp; Status Page: Complete this Module', title:'',url:'scorePage.htm',chapter:5,level:1 }

//IMPORTANT!!! the last item does NOT get a comma at the end
); //do NOT delete this final punctuation       
 
 
  var recommendedMsg = 'Recommended';
  var requiredMsg    = 'Must be completed to finish module';
  var completedMsg   = 'Completed';
  
   var IntArray = new Object(); //interactions object
   
      IntArray['p04_001'] = {id:'p04_001', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_002'] = {id:'p04_002', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_003'] = {id:'p04_003', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_004'] = {id:'p04_004', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_005'] = {id:'p04_005', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_006'] = {id:'p04_006', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_007'] = {id:'p04_007', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p04_008'] = {id:'p04_008', tries:0, ascore:0, amax:0, req:0, msg:'', status:0, quiz:900100000004},
	  IntArray['p11_001'] = {id:'p11_001', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:900100000011},
      IntArray['p06_000'] = {id:'p06_000', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:900200000006},
      IntArray['p06_001'] = {id:'p06_001', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:900200000006},
      IntArray['p12_001'] = {id:'p12_001', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:900200000012}							