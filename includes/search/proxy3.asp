<!--v.1.1 2.23.13 emeiselm-->
<style>
li.pagination{float:left;margin-right:12px;list-style: none;font:12px normal "Helvetica", Arial, sans-serif;   }
div.paginator ul{margin:0 auto 0 auto;text-align: center;}
</style>
<%
Response.Buffer = True
Dim xml, xsl, xml2, q, start, searchstr, sitesearch, str0, totalpath, intfind,protocol,intfind2,thisfolder,thisfolder2 

str0 = request.ServerVariables("url")

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


intfind=instr(GetPath(), "includes/search/proxy3.asp") 'find the folder before this
intfind2=instr(request.ServerVariables("URL"),"includes/search/proxy3.asp") 'to be used later

if intfind > 0 then ' if exists

  thisfolder=left(GetPath(),intfind-1)	'get folder path with final slash
  thisfolder2=left(request.ServerVariables("URL"),intfind2-1)
'response.write "<br/>thisfolder=" & thisfolder
'response.write "<br/>thisfolder2=" & thisfolder2
 end if 
  
q = Request.QueryString("q")
start = Request.QueryString("start")
searchstr = "http://10.30.15.145/search?q="&q&"&site=mlearning&as_sitesearch="&thisfolder&"&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&output=xml_no_dtd&num=10&start=0"
'Response.write("<br/>searchstr="&searchstr&"<br/>")
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

'check that the XML is being parsed correctly
If xml2.parseError.errorCode <> 0 Then
	Response.Write "<br/>Parsing error - " & xml2.parseError.reason
	Response.End
End If


' load stylesheet
set xsl = Server.CreateObject("MSXML2.DOMDocument")
xsl.async = false
'Response.Write xml.responseText
'Response.Write(thisfolder2&"searchresults4.xsl")
xsl.load(Server.MapPath( thisfolder2&"includes/search/searchresults.xsl")) 
Response.Write xml2.transformNode(xsl)
Set xml = Nothing
Set xml2 = Nothing
Set xsl = Nothing
'http://www.sitepoint.com/forums/showthread.php?434180-ASP-XML-HTTP-Request-amp-xml-transformNode(xsl)
%>

