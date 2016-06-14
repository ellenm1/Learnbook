<style>
li.pagination{float:left;margin-right:12px;list-style: none;font:12px normal "Helvetica", Arial, sans-serif;   }
div.paginator ul{margin:0 auto 0 auto;text-align: center;}
</style>
<%
Response.Buffer = True
Dim xml, xsl, xml2, q, start, searchstr, sitesearch, str0, totalpath, intfind,protocol 

str0 = request.ServerVariables("url")
'response.write "<br/>str0 is " & str0  & "<br>"
'response.write "all_http is" & request.ServerVariables("all_http")
'response.write "<br/>HTTP_REFERER is" & request.ServerVariables("HTTP_REFERER")
'response.write "<br/>url is" & request.ServerVariables("url")
'response.write "<br/>servername is" & request.ServerVariables("SERVER_NAME")
'response.write "https="& request.ServerVariables("HTTPS")
function GetPath()
	query_string = request.ServerVariables("QUERY_STRING")
	if query_string <> "" then
		query_string = "?" & query_string
	end if
	if request.ServerVariables("HTTPS") = "on" then
		protocol="https://"
	else
		protocol="http://"
	end if
	GetPath = "http://" & request.ServerVariables("SERVER_NAME") & request.ServerVariables("URL") & query_string
	'http://www.nealgrosskopf.com/tech/thread.php?pid=13
end function


'totalpath=protocol & request.ServerVariables("SERVER_NAME") & request.ServerVariables("URL") & query_string
'response.write "<br/>"& protocol & request.ServerVariables("SERVER_NAME") & request.ServerVariables("URL") & query_string
'response.write "getpath()="& GetPath()

'intfind=instr(str0, "/search/proxy3.asp") 'find the folder before this
intfind=instr(GetPath(), "/search/proxy3.asp") 'find the folder before this
response.write "<br/>intfind=" & intfind
if intfind > 0 then ' if exists
  'thisfolder=left(GetPath(),intfind-1)	'get folder path without final slash
  thisfolder=left(GetPath(),intfind)	'get folder path with final slash
response.write "<br/>thisfolder=" & thisfolder
 ' intfind2=instrrev(thisfolder,"/modules/") 'find the beginning of the folder from the end
 ' intfind3=instr(thisfolder,"/modules/") 'find the beginning of the folder
 ' thisfolder=mid(thisfolder,intfind3+9,len(thisfolder)-intfind2+1) '+9 is for /modules/
'  response.Write("<br/>thisfolder is " & thisfolder) & "<BR>"
'  response.write("<br/>Server.MapPath="& Server.MapPath("/quiz/cbtlib/modules/"& thisfolder))
 end if 
  
q = Request.QueryString("q")
start = Request.QueryString("start")
searchstr = "http://10.30.15.145/search?q="&q&"&site=mlearning&client=mlearning_module&sitesearch="&thisfolder&"proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&output=xml_no_dtd"
'Response.write(searchstr)
'If q<>"" Then	  
'     q = q
'End If
' create a ServerXMLHTTP object:
Set xml = Server.CreateObject("MSXML2.ServerXMLHTTP")

' Opens the connection to the remote server.
xml.Open "GET",searchstr,false 
xml.Send
 
'Response.Write xml.responseText


Set xml2 = Server.CreateObject("MSXML2.DOMDocument")
xml2.async = false

xml2.loadXML xml.responseText
'response.write("**********<br/>"&xml2.xml)
'check that the XML is being parsed correctly
If xml2.parseError.errorCode <> 0 Then
	Response.Write "<br/>Parsing error - " & xml2.parseError.reason
	Response.End
End If


' load stylesheet
set xsl = Server.CreateObject("MSXML2.DOMDocument")
xsl.async = false
'xsl.load(Server.MapPath("/quiz/cbtlib/modules/searchdemo/search/searchresults4.xsl"))
xsl.load(Server.MapPath("/home/pages/searchresults4.xsl"))
 
Response.Write xml2.transformNode(xsl)
Set xml = Nothing
Set xml2 = Nothing
Set xsl = Nothing
'http://www.sitepoint.com/forums/showthread.php?434180-ASP-XML-HTTP-Request-amp-xml-transformNode(xsl)
%>

