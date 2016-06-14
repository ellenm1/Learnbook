//v. 1.0 11/24/12
//this provides a function to parse the query string for various parameters. 
var qsParm = new Array();
function qs() {
		var query = document.location.search.substring(1);
		var parms = query.split('&');
		//alert('parms='+parms);
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			//alert('pos= '+pos);
		    if (pos > 0) {
				var key = parms[i].substring(0,pos);
				//alert('key= '+key);
				var val = parms[i].substring(pos+1);
				//alert('val= '+val);
				qsParm[key] = val;				 
			}//end if
        }//end for			
}//end function

qsParm['vrsn'] = null;
qsParm['curl'] = null;
qsParm['pdf']= null; 
qs();
//alert('qsParm[vrsn]'+qsParm['vrsn']);