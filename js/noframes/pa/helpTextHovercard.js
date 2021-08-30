    var helpTextIsLoaded = true;
 
 	var whatIsAdvancedSettings = '<p>Advanced settings are items that rarely need to be used, such as changing or shutting off the blue timeout warnings, turning on and customizing auto-emails, etc. <p>';
        var hidebookmarkalertslabel = '<p>\"Do you want to resume?\" alerts are shown on launch if a module has more than 5 pages. If there are Captivate or Storyline quizzes, this checkbox is automatically checked. This is because you may want to mute these alerts since Captivate and Storyline have their own Resume functions.</p>';
    $("#advanced-settings").hovercard({
        detailsHTML: whatIsAdvancedSettings,
        width: 400,
        openOnTop:true
    });  
    
     $("#hidebookmarkalertslabel").hovercard({
        detailsHTML: hidebookmarkalertslabel,
        width: 400,
        openOnTop:true
    });  