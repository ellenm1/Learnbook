<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="WebSupergoo.ABCpdf9" %>
<%@ Import Namespace="WebSupergoo.ABCUpload6" %>
<%@ Assembly Name="ABCpdf" %>
<%@ Page Language="C#"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>MLearning PDF</title>
</head>
<body>
<%
    //Quick license/software check
    //bool abcPdfWarn = false;
	try {
		Doc theDoc = new Doc();
		string theLic = theDoc.License;
		if (theLic.StartsWith("No License")) {
			theLic = "license unavailable or expired";
			//abcPdfWarn = true;
		}
		Response.Write("<b>ABCpdf .NET " + theLic + "</b><br />");
	}
	catch (Exception ex) {
		Response.Write("<b>ABCpdf Not Installed.  " + ex.Message + "</b><br />");
	}

   
%>
    <form id="form1" runat="server">
    <div>
    <%
       
  
        string source = string.Empty;
        string href = string.Empty;

        //Check for post first, then queryString and allow posting either way
        if (string.IsNullOrEmpty(Request.QueryString["uUrl"]) && string.IsNullOrEmpty(Request.Form["uUrl"]))
        {
            Response.Write("Missing uUrl parameter.");
            Response.End();
        }
        else if (!string.IsNullOrEmpty(Request.Form["uUrl"]))
        {
            source = Request.Form["uUrl"];
        }
        else if (!string.IsNullOrEmpty(Request.QueryString["uUrl"]))
        {
            source = Request.QueryString["uUrl"];
        } 
        
        if (string.IsNullOrEmpty(Request.QueryString["uPath"]) && string.IsNullOrEmpty(Request.Form["uPath"]))
        {
            Response.Write("Missing uPath parameter.");
            Response.End();
        }
        else if (!string.IsNullOrEmpty(Request.Form["uPath"]))
        {
            href = Request.Form["uPath"];
        }
        else if (!string.IsNullOrEmpty(Request.QueryString["uPath"]))
        {
            href = Request.QueryString["uPath"];
        } 
           
        string[] stringSeparators = new string[] {";"};
        string [] pairs;
        int id;
        //Random number generator for help prevent browser caching        
        Random rand = new Random();
        bool testing = (string.IsNullOrEmpty(Request.QueryString["testing"]) ? false : true);
        bool showGrid = (string.IsNullOrEmpty(Request.QueryString["showGrid"]) ? false : true);

        
        if (!String.IsNullOrEmpty(source))
        {
            Doc theDoc = new Doc();
            theDoc.Rect.Inset(72, 92);

            theDoc.HtmlOptions.BrowserWidth = 1300;
            theDoc.HtmlOptions.Timeout = 300000;
            theDoc.HtmlOptions.HostWebBrowser = false;
            // apply a rotation transform
            //double w = theDoc.MediaBox.Width;
            //double h = theDoc.MediaBox.Height;
            //double l = theDoc.MediaBox.Left;
            //double b = theDoc.MediaBox.Bottom ;
            string url;

            //Split parameter with ";"
            pairs = source.Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
            if (pairs.Length < 1)
            {
                throw new Exception("Improper parameters passed.");
            }
            
            href = href.Substring(0, href.LastIndexOf("/"));  //look backwords..from end of string

            foreach (string uri in pairs)
            {
                try
                {
                    theDoc.Page = theDoc.AddPage();
                    //Now add href base plus the parameters plus a random number (to help prevent browser caching)
                    url = href + "/" + uri + "?lll=" + rand.Next().ToString();
                    if (testing)
                    {
                        if (showGrid)
                        {
                            //Keep only during development
                            theDoc.AddGrid();
                            theDoc.Color.String = "255 0 0";
                            theDoc.Width = 10;
                        }
                        //**** End development grid testing
                        Response.Write(url + "<br>");
                    }
                    else
                    {
                        id = theDoc.AddImageUrl(url);
                        while (true)
                        {
                            if (!theDoc.Chainable(id))
                                break;
                            theDoc.Page = theDoc.AddPage();
                            id = theDoc.AddImageToChain(id);
                        } //End while
                    } //End if testing
                }
                catch (Exception e)
                {
                    throw new Exception("There was an error creating the PDF. The error message was '" + e.Message + "'");
                }
            } //end for each

            //Flatten document
            //theDoc.SetInfo(theID, "/Rotate", "90");
            for (int i = 1; i <= theDoc.PageCount; i++) {
              theDoc.PageNumber = i;
              theDoc.Flatten();
            }


            //Now dislay the document to the user
            if (!testing)//Change to false to testing purposes
            {
                byte [] theData = theDoc.GetData();
                Response.Clear();
                Response.ContentType = "application/pdf";
                Response.AddHeader("content-length", theData.Length.ToString()); 
                Response.AddHeader("content-disposition", "attachment; filename=MLearning.PDF");
                Response.BinaryWrite(theData);
                Response.End();

                theDoc.Clear();
            }
        }
        else
        {
            Response.Write("Incorrect parameters passed.");
        }
         %>
    </div>
    </form>
</body>
</html>
