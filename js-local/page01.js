
//alert('ps='+ps);
//http://stackoverflow.com/questions/874256/dynamically-loaded-js-function-does-not-appear-in-firebug-js-debugger
//console.log(PageArrayAll);
//console.log(pagesets);

	$( "#resetbtn" ).click(function() {
 			$('.checkbox').prop('checked', false);
 	}); 
  
	$( "#submitbtn" ).click(function() { 
		//http://stackoverflow.com/questions/11723297/using-jquery-to-get-multiple-checkboxs-value-and-output-as-comma-separated-stri
  		 //http://stackoverflow.com/questions/2858121/convert-comma-separated-string-to-array
  		 //http://stackoverflow.com/questions/2279760/how-to-reset-all-checkboxes-using-jquery-or-javascript
  		var selecteditems=( $('.checkbox:checked').map( function() {  return this.value; } ).get().join(',') );
  		 
  	var selecteditemsArray =( selecteditems.split(','));		 
 	console.log('WWR page01.js - user selected these items: selecteditems='+selecteditems);
 	
 	var newpagelist = getNewPageList(selecteditemsArray);
	 startUpCustomVersion(newpagelist, selecteditems);
 
 /*
 function getNewPageList(selitms){
 
 		var thelist=new Array();
 		 var intro = $(pagesets.intro).toArray();
 		 $.each(intro, function(j, val){
 		 	debugger;
 		 	thelist.push(intro[j]);//intro
 		 });
 		
 			debugger;
 		
 		$.each(selitms, function( i, val){
 				console.log('i='+i+', val='+val+', pagesets[val]= '+pagesets[val]);
 				 
 				///var gg = $.makeArray(pagesets[0][val]);
 				var gg = $(pagesets[val]).toArray();
 				$.each(gg, function(k,val){
 					debugger;
 		 			thelist.push(gg[k]);//add page by page
 		 		});
 		 	
  				debugger;
  						
  			}); //end each
  		var ending = $(pagesets.ending).toArray();
  		
  		$.each(ending, function(m, val){
 		 	thelist.push(ending[m]);//intro
 		 });
  		 
  		//$.makeArray(thelist);
  		return thelist;
	}
	
	console.log('newpagelist='+newpagelist);
	debugger;
	
	ns.localStorage.set('pageArray',newpagelist);	 //store new page array in local storage
			var ps=ns.localStorage.get('pageArray');
			//SCOSetObjectiveData('adhocVersion', 'score.raw', '1');
			SCOSetObjectiveData("version","score.raw",'999');
			console.log('selecteditems='+selecteditems);
			SCOSetValue("cmi.suspend_data", 'CsVrsn_,'+selecteditems+',_CsVrsn');
			//need to save selecteditems to suspend data
			wipePageNo();
			wipeNavBar();
			writePage(0,null);	
	});//end $("#btn1").click(function

 	
*/

//console.log('newpagelist='+newpagelist);
	//debugger;
	
	

 	});//end $("#btn1").click(function