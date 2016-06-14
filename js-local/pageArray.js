/***IMPORTANT***
	The page array generator (http://mlearning.med.umich.edu/quiz/cbtlib/modules/common/js/pa/) should be used to 
	create your page array. */

var PageArray = new Array(
{buttonTitle:'Tell us what you do', title:' ', url:'page01.htm', chapter:0,level:1 }
);


var moduletype=2;

var docTitle=('Infection Prevention');
var headerTitle=('Infection Prevention');
var contentExpert=new Array( {email:"test@med.umich.edu",name:"Test"});
 

var pagesets = new Object(

//ICEX-20111
{intro:new Array(
 		{buttonTitle:'Competency Criteria', title:' ', url:'page01a.htm', chapter:0,level:1 },
	   {buttonTitle:'Standard Precautions', title:' ', url:'page05.htm', chapter:0,level:1 },
	   {buttonTitle:'Content Area', title:' ', url:'page02c.htm', chapter:1,level:1, type:'I', quiz:'346324853486', rm:'', countscore:1}
	   ), 

//ICEX-20112  
fn:new Array(
     {buttonTitle:'TB Overview', title:' ', url:'page07.htm', chapter:0,level:1 },
     {buttonTitle:'TB Quiz', title:'', url:'quizWrap.htm?call=embed&session=1439189001886585&', chapter:4, level:1, type:'Q', quiz:'1439189001886585', rm:'',  countscore:'1'}
    ),


//ICEX-20113
sp:new Array(
    {buttonTitle:'Transmission Based Precautions', title:' ', url:'page08.htm', chapter:0,level:1 },
     {buttonTitle:'Transmission Based Precautions Quiz', title:'', url:'quizWrap.htm?call=embed&session=7624582319645298&', chapter:6, level:1, type:'Q', quiz:'7624582319645298', rm:'',  countscore:'1'}
     ),
 
 
 //ICEX-20114
sc:new Array(
    {buttonTitle:'', title:'Central Line-Associated Bloodstream Infection Prevention', url:'page09.htm', chapter:0,level:1 },
    {buttonTitle:'Central Line-Associated Bloodstream Infection Prevention Quiz', title:'', url:'quizWrap.htm?call=embed&session=8680161365277987&', chapter:0, level:1, type:'Q', quiz:'8680161365277987', rm:'',  countscore:'1'}
     ),
 
 //ICEX-52628
wp:new Array(
    {buttonTitle:'Central Venous Catheters-Maintenance to Prevent Bloodstream Infections', title:' ', url:'page10.htm', chapter:0,level:1 },
	{buttonTitle:'Fire Triangle Exercise', title:'', url:'captivate6Wrap.htm?swf=captivate/FireTriangle.swf&w=900&h=630', chapter:1, level:1, type:'C', quiz:'453034089440', rm:'', countscore:'1'},
	{buttonTitle:'Central Venous Catheters-Required Link ', title:' ', url:'page10a.htm', chapter:3,level:1,  type:'I', quiz:'963112100900', rm:'', countscore:1 },
    {buttonTitle:'Central Venous Catheters-Maintenance to Prevent Bloodstream Infections Mark Complete', title:'', url:'page21.htm', chapter:4, level:1, type:'I', quiz:'963112100902', rm:'', countscore:'1'}
     ),



ending:new Array({buttonTitle:'Score &amp; Status Page', title:'',url:'scorePage.htm',chapter:0,level:1 })

});

  


var recommendedMsg = 'Recommended';
var requiredMsg = 'Must be completed to finish module';
var completedMsg   = 'Completed';

var IntArray = new Object();
IntArray['p02c_001'] =  {id:'p02c_001', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'346324853486'},
//IntArray['p18_000'] =  {id:'p18_000', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'963112100902'},
IntArray['p10a_000'] =  {id:'p10a_000', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'963112100900'},
IntArray['p10a_001'] =  {id:'p10a_001', tries:0, ascore:0, amax:1, req:1, msg:'', status:0, quiz:'963112100900'}

