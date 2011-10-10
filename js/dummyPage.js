function determineParents(){ //determines what is a parent and what branch item is in
	 var branch;
	 for(var i=0; i< PageArray.length; i++) { 
	  if (!branch){ branch=0;}		
         var p = PageArray[i];
		 var j = (i+1);
		 var k = (i-1);
		 p.branch=branch; 
		 var nextItem = PageArray[j];
		 var prevItem = PageArray[k];
		 var level =   p.level;
	     var chapter =  p.chapter;
		 var isParent = p.isParent;
	     if (nextItem){  //is this a parent item? if there is a next item...
		       if (nextItem.chapter==chapter && nextItem.level>level){  p.branch=i;branch=i;  p.isParent='parent'; }	 //if next item in same chapter but greater level, this is a parent. set value of branch to i	
	           else {p.isParent='notParent'; 
			          if (prevItem&&level<prevItem.level){p.branch=i;branch=i;} //branches don't revert to the parent branch when level increases so this is needed
			   }//else
		     }//if(nextItem)...
         else{p.isParent='notParent'; break;}
     } //for(var...
 }  
 
 function writeDocTitle(){  parent.document.title=docTitle; } 