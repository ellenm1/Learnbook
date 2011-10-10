<% @Language="VBScript" %>
<% Option Explicit
Server.ScriptTimeout =50000

'Response.Expires = -1000
%>
<html> 
<body>

<%
Response.Write("Writing to PDF")
'function to randomize a number
Function RandomNumber(intHighestNumber)
	Randomize
	RandomNumber = Int(Rnd * intHighestNumber) + 1
End Function


Dim theDoc, i, theID, theData
Dim theURLs() 
Dim inti
Dim x, w, h, l, b
Dim strPath
Dim strValue
dim intFind
dim id
'dim newStyles
'newStyles = "<style>body {background:none;} #whiteArea{background-color:#FFF;background-image:none;} #header, #footer{display:none;} #rightColumn{ background:none;}</style>"
Set theDoc = Server.CreateObject("ABCpdf6.Doc")
   'theDoc.HtmlOptions.BrowserWidth = 2250
  ' theDoc.Rect.Inset -550, -60
     theDoc.HtmlOptions.BrowserWidth = 1300
     theDoc.HtmlOptions.Timeout = 50000
     On Error Resume Next
      
	 ' theDoc.HtmlOptions.BrowserWidth = 0
    ' theDoc.Rect.Inset -190, -60
   
 ' apply a rotation transform
w = theDoc.MediaBox.Width
h = theDoc.MediaBox.Height
l = theDoc.MediaBox.Left
b = theDoc.MediaBox.Bottom 
theDoc.Transform.Rotate 90, l, b
theDoc.Transform.Translate w, 0

' rotate our rectangle
theDoc.Rect.Width = h
theDoc.Rect.Height = w  

inti=0
i=1
'loop thru' the form elements and assign the url to the array elements and increment array each time
for each x in request.form
	'look for the field with the url in it concatenated
	if left(x, 4) = "uUrl" then
		strValue=request.form(x)
		'response.Write("strvalue is " & strValue & "<BR>")
		intfind = instr(strValue,";") 'each url is separated by a ; look for that
		 while intfind>0 'parse each item in the url
			redim preserve theURLs(i+1)'save the array
			theURLs(i) = strPath & left(strValue,intfind-1) & "?lll=" & RandomNumber(10)
			strValue=right(strValue,len(strValue)-intfind) 'new string is old string cut off
					'response.Write("strvalue is " & theURLs(i)  & "<BR>")
			intfind = instr(strValue,";")
			i=i+1 'increment array index
		 wend
	elseif x="uPath" then
	  strPath=request.form(x)
	  intFind = instrrev(strPath,"/") 'look backwords..from end of string
	  strPath=left(strpath,intFind)
	end if
next



'-----------------------------
'For i= 0 to UBound(theURLs)
 ' theDoc.Page = theDoc.AddPage()
'  theID = theDoc.AddImageUrl(theURLs(i)) 'add this page to the doc
  
  

'	Do
 '   	theDoc.FrameRect
 '     If Not theDoc.Chainable(theID) Then Exit Do
 '      theDoc.Page = theDoc.AddPage()
'	    theDoc.HtmlOptions.OnLoadScript="document.styleSheets[0].removeRule[4];"
'       theID = theDoc.AddImageToChain(theID) 
 '  Loop
	 
'Next
'____________
'Response.write("UBound(theURLs)" & UBound(theURLs))
For i = (LBound(theURLs)+1) To (UBound(theURLs)-1)
    theDoc.AddText i
    theDoc.Page = theDoc.AddPage()
   ' theDoc.HtmlOptions.UseScript = True
    ' theDoc.HtmlOptions.OnLoadScript = "document.getElementById('leftColumn').style.display='none';document.getElementById('whiteArea').style.background='#FFF'"
    id = theDoc.AddImageUrl(theURLs(i))
	'dim info
	'theDoc.GetInfo(id, "/MediaBox:Keys")
	'Response.Write "info" & info & "<br>"
    Do While theDoc.Chainable(id)
        theDoc.Page = theDoc.AddPage()
         
        id = theDoc.AddImageToChain(id)
		
    Loop
	'theDoc.AddHtml(newStyles)
Next
 
 
 
 theID = theDoc.GetInfo(theDoc.Root, "Pages")
theDoc.SetInfo theID, "/Rotate", "90"

For i = 1 To theDoc.PageCount
  theDoc.PageNumber = i
  theDoc.Flatten
Next

theData = theDoc.GetData()
Response.Clear
Response.ContentType = "application/pdf"
Response.AddHeader "content-length", UBound(theData) - LBound(theData) + 1
Response.AddHeader "content-disposition", "attachment; filename=MLearning.PDF"
Response.BinaryWrite theData
Response.Write("testing")
theDoc.Clear
%>

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-11509774-1");
pageTracker._trackPageview();
} catch(err) {}</script></body>


</html>



 