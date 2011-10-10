/*v 1.0 5-10-2006*/
function fixPNG(myImage) // correctly handle PNG transparency in Win IE 5.5 or higher.
   {
   
         {
         var imgID = (myImage.id) ? "id='" + img.id + "' " : ""
         var imgClass = (myImage.className) ? "class='" + myImage.className + "' " : ""
         var imgTitle = (myImage.title) ? "title='" + myImage.title + "' " : "title='" + myImage.alt + "' "
         var imgStyle = "display:inline-block;" + myImage.style.cssText 
         var strNewHTML = "<span " + imgID + imgClass + imgTitle
         strNewHTML += " style=\"" + "width:" + myImage.width + "px; height:" + myImage.height + "px;" + imgStyle + ";"
         strNewHTML += "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
         strNewHTML += "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>" 
         myImage.outerHTML = strNewHTML
         }
   }

function correctPNG() // correctly handle PNG transparency in Win IE 5.5 or higher.
   {
   for(var i=0; i<document.images.length; i++)
      {
	  var img = document.images[i]
	  var imgName = img.src.toUpperCase()
	  if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
	     {
		 var imgID = (img.id) ? "id='" + img.id + "' " : ""
		 var imgClass = (img.className) ? "class='" + img.className + "' " : ""
		 var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
		 var imgStyle = "display:inline-block;" + img.style.cssText 
		 if (img.align == "left") imgStyle = "float:left;" + imgStyle
		 if (img.align == "right") imgStyle = "float:right;" + imgStyle
		 if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle		
		 var strNewHTML = "<span " + imgID + imgClass + imgTitle
		 + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
	     + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
		 + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
		 img.outerHTML = strNewHTML
		 i = i-1
	     }
      }
   }
window.attachEvent("onload", correctPNG);
