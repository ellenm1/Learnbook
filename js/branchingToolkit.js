//v.1.0 12/24/07
//**branching toolkit: these functions insert, add and swap out pages from the pageArray and navBar**//
//haven't testedd yet but you have to re-run determineParents in the dummyPage frame after modifying the array
function insertList(n){
	 for(var i=0; i< PageArray+n+.length; i++) { 
	parent.data.PageArray.splice((window.parent.data.znThisPage-1),0,PageArray+n+[i]);
	parent.data.determineParents();
	} 
	wipePageNo();
	wipeNavBar();
	printNavBar();
     }
	  function writeArray(){
	  for(var i=0; i< parent.data.PageArray.length; i++) { 
	  document.getElementById('writeItHere').innerHTML +=(parent.data.PageArray[i].url +" " + parent.data.PageArray[i].title +'<br>');
	   }	}

function addOnePagetoEnd() {
	mystring=({title:'I am new',url:'page303.htm',chapter:0,level:1});
	parent.data.PageArray.push(mystring);
	document.getElementById('NavBar').innerHTML = (''); 
	parent.data.determineParents();//haven't testedd yet but you have to run determineParents after modifying the array
	wipePageNo();
	wipeNavBar();
	printNavBar();}
 
function replaceAllPages() {
	parent.data.PageArray=parent.data.PageArray2;
	parent.data.determineParents();
	wipePageNo();
	wipeNavBar();
    printNavBar();
    NextPage(); }
 //**end branching toolkit**//
 
 
