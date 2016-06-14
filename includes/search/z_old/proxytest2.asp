<% 
   url = "http://10.30.15.145/search?q=training&site=mlearning_portal&client=test&proxyreload=1&sort=date%3AD%3AL%3Ad1&oe=UTF-8&ie=UTF-8&filter=1" 
   ' url="http://classicasp.aspfaq.com/general/how-do-i-read-the-contents-of-a-remote-web-page.html"
    set xmlhttp = CreateObject("MSXML2.ServerXMLHTTP") 
    xmlhttp.open "GET", url, false 
    xmlhttp.send "" 
    Response.write xmlhttp.responseText 
    set xmlhttp = nothing 
%>