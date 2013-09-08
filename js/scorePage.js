//v 1.1 emeiselm 12-5-12  
//functions for scorePage.htm
function checkAPI(){
	if (!parent.APIOK()){
		var msgWin= document.getElementById('quizMessages');
		msgWin.innerHTML=('Quizzes only run when you access this module through MLearning.');
		msgWin.innerHTML+=('<a href="top.window.close();">Close module</a>')
		return; 
	}
}


function scoreQuizzes(){  
	parent.data.scoreQuizzes(); 
}
