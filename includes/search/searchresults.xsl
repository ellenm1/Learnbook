<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
<!-- *** navigation bars: '', 'google', 'link', or 'simple'.
         DO NOT use 'google' as the navigation bar type for secure search
         i.e. when access='a' or access='s'. Read documentation of
         "secure_bottom_navigation_type" variable below. *** -->
<xsl:variable name="show_top_navigation">1</xsl:variable>
<xsl:variable name="choose_bottom_navigation">google</xsl:variable>
<xsl:variable name="my_nav_align">right</xsl:variable>
<xsl:variable name="my_nav_size">-1</xsl:variable>
<xsl:variable name="my_nav_color">#6f6f6f</xsl:variable>
<xsl:variable name="show_res_snippet">1</xsl:variable>
<xsl:variable name="res_num" select="@N"/>
<xsl:variable name="only_apps">
  <xsl:value-of select="/GSP/PARAM[@name='only_apps']/@original_value"/>
</xsl:variable>
<!-- *** num_results: actual num_results per page *** -->
<xsl:variable name="num_results">
 <xsl:value-of select="5"/>
 <!-- <xsl:choose>
    <xsl:when test="/GSP/PARAM[(@name='num') and (@value!='')]">
      <xsl:value-of select="/GSP/PARAM[@name='num']/@value"/>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="10"/>
    </xsl:otherwise>
  </xsl:choose>-->
</xsl:variable>



<!-- *** keyword match (in title or snippet) *** -->
<xsl:variable name="res_keyword_color"></xsl:variable>
<xsl:variable name="res_keyword_size"></xsl:variable>
<xsl:variable name="res_keyword_format">b</xsl:variable> <!-- 'b' for bold -->
<!-- **********************************************************************
  Variables for reformatting keyword-match display (do not customize)
     ********************************************************************** -->
<xsl:variable name="keyword_orig_start" select="'&lt;b&gt;'"/>
<xsl:variable name="keyword_orig_end" select="'&lt;/b&gt;'"/>

<xsl:variable name="keyword_reformat_start">
  <xsl:if test="$res_keyword_format">
    <xsl:text>&lt;</xsl:text>
    <xsl:value-of select="$res_keyword_format"/>
    <xsl:text>&gt;</xsl:text>
  </xsl:if>
  <xsl:if test="($res_keyword_size) or ($res_keyword_color)">
  <xsl:text>&lt;font</xsl:text>
  <xsl:if test="$res_keyword_size">
    <xsl:text> size="</xsl:text>
    <xsl:value-of select="$res_keyword_size"/>
    <xsl:text>"</xsl:text>
  </xsl:if>
  <xsl:if test="$res_keyword_color">
    <xsl:text> color="</xsl:text>
    <xsl:value-of select="$res_keyword_color"/>
    <xsl:text>"</xsl:text>
  </xsl:if>
  <xsl:text>&gt;</xsl:text>
  </xsl:if>
</xsl:variable>
<xsl:variable name="keyword_reformat_end">
  <xsl:if test="($res_keyword_size) or ($res_keyword_color)">
    <xsl:text>&lt;/font&gt;</xsl:text>
  </xsl:if>
  <xsl:if test="$res_keyword_format">
    <xsl:text>&lt;/</xsl:text>
    <xsl:value-of select="$res_keyword_format"/>
    <xsl:text>&gt;</xsl:text>
  </xsl:if>
</xsl:variable>
 

<!-- **********************************************************************-->
<!-- **********************************************************************-->
<!--this is the part that actually prints the results-->
<!--   ********************************************************************** -->
<xsl:template match="/"> 
  <b style="margin-top:20px;">Search Results</b>
  <table border="0" style="1px solid #CCC">
     <xsl:for-each select="GSP/RES/R">
    <tr valign="top">
      <td>
      <!--<p><a href='{U}' style='font:medium normal Arial, sans-serif;color:blue;'><xsl:value-of select="T" /></a></p>-->
      <h3 id="title_{$res_num}" style='font:large bold  arial, sans-serif;color:blue;margin:18px 0 0 0;' transId="title_{$res_num}">
            <a href='{U}' style='font:large bold arial, sans-serif;color:blue;'>
            <xsl:call-template name="reformat_keyword">
              <xsl:with-param name="orig_string" select="T"/>
            </xsl:call-template>
            </a>
      </h3>
      <!--<p>...<xsl:value-of select="S" /></p>-->
       <div style="color:green;font:small bold Helvetica, Arial, sans-serif;"><xsl:value-of select="U" /> | <xsl:value-of select="HAS/C/@SZ" /> </div>
      
       <xsl:if test="$show_res_snippet != '0' and string-length(S) and
                      $only_apps != '1'">
          <span id="snippet_{$res_num}" class= "goog-trans-section" transId="gadget_{$res_num}" style="font:small normal Arial, sans-serif;" >
            <xsl:call-template name="reformat_keyword">
              <xsl:with-param name="orig_string" select="S"/>
            </xsl:call-template>
          </span>
        </xsl:if>
     
      
      </td>
    </tr>
    </xsl:for-each>
  </table>
  <xsl:call-template name="gen_bottom_navigation"></xsl:call-template>
<!-- **********************************************************************-->
<!--Debugging area-->
<!--<xsl:for-each select="GSP/RES">
-$prev = NB/PU=<xsl:value-of select="NB/PU" /><br/>
-$next = NB/NU= <xsl:value-of select="NB/NU" /><br/>
</xsl:for-each>-->
<!--   ********************************************************************** -->
</xsl:template>
<!-- **********************************************************************-->
<!-- Generates search results navigation bar to be placed at the bottom. -->
<!--   ********************************************************************** -->
<xsl:template name="gen_bottom_navigation">
<!--$test2 =  <xsl:text>Line 52</xsl:text><br/>-->
  <xsl:if test="GSP/RES">
<!--$test3 =  <xsl:text>Line 54</xsl:text><br/>-->
    <xsl:variable name="nav_style"> 
          <xsl:value-of select="$choose_bottom_navigation"/>
    </xsl:variable>

    <xsl:call-template name="google_navigation">
      <xsl:with-param name="prev" select="GSP/RES/NB/PU"/>
      <xsl:with-param name="next" select="GSP/RES/NB/NU"/>
      <xsl:with-param name="view_begin" select="GSP/RES/@SN"/>
      <xsl:with-param name="view_end" select="GSP/RES/@EN"/>
      <xsl:with-param name="guess" select="GSP/RES/M"/>
      <xsl:with-param name="navigation_style" select="$nav_style"/>
    </xsl:call-template>
  </xsl:if>
</xsl:template>

<!-- **********************************************************************
 Google navigation bar in result page (do not customize)
     ********************************************************************** -->
<xsl:template name="google_navigation">
    <xsl:param name="prev"/>
    <xsl:param name="next"/>
    <xsl:param name="view_begin"/>
    <xsl:param name="view_end"/>
    <xsl:param name="guess"/>
    <xsl:param name="navigation_style"/>
    <xsl:param name="dynamic_nav_bar"/>

  <!-- *** Override the navigation style to 'simple' type if result estimation
           is not available and the navigation type has been specified
           as 'google'. *** -->
  <xsl:variable name="navigation_style_to_use">
    <xsl:choose>
      <xsl:when test="$navigation_style = 'google' and $guess = ''">simple</xsl:when>
      <xsl:otherwise><xsl:value-of select="$navigation_style"/></xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <xsl:variable name="fontclass">
    <xsl:choose>
      <xsl:when test="$navigation_style_to_use = 'top'
          and $dynamic_nav_bar = '1'">dn-bar-nav</xsl:when>
      <xsl:when test="$navigation_style_to_use = 'top'">s</xsl:when>
      <xsl:otherwise>b</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <!-- *** Test to see if we should even show navigation *** -->
  
  <xsl:if test="($prev) or ($next)">

  <!-- *** Start Google result navigation bar *** -->

    <xsl:if test="$navigation_style_to_use != 'top'">
      <xsl:text disable-output-escaping="yes">&lt;center&gt;
        &lt;div class=&quot;n&quot;&gt;</xsl:text>
    </xsl:if>

    <table border="0" cellpadding="0" width="1%" cellspacing="0">
      <tr align="center" valign="top">
        <xsl:if test="$navigation_style_to_use != 'top'">
        <td valign="bottom" nowrap="1">
          <font size="-1">
            Result Page<xsl:call-template name="nbsp"/>
          </font>
        </td>
        </xsl:if>


  <!-- *** Show previous navigation, if available *** -->
        <xsl:choose>
          <xsl:when test="$prev">
            <td nowrap="1">

              <span class="{$fontclass}">
                <a ctype="nav.prev"
                   href="http://10.30.15.145/search?start={$view_begin - $num_results - 1}">
                <xsl:if test="$navigation_style_to_use = 'google'">

                  <img src="/home/images/nav_previous.gif" width="68" height="26"
                    alt="Previous" border="0"/>
                  <br/>
                 </xsl:if>
                <xsl:if test="$navigation_style_to_use = 'top'">
                  <xsl:text>&lt;</xsl:text><xsl:call-template name="nbsp"/>
                </xsl:if>
                <xsl:text>Previous</xsl:text>
              </a>
              </span>
              <xsl:if test="$navigation_style_to_use != 'google'">
                  <xsl:call-template name="nbsp"/>
              </xsl:if>
            </td>
          </xsl:when>
          <xsl:otherwise>
            <td nowrap="1">
              <xsl:if test="$navigation_style_to_use = 'google'">
                <img src="/home/images/nav_first.png" width="18" height="26"
                  alt="First" border="0"/>
                <br/>
              </xsl:if>
            </td>
          </xsl:otherwise>
        </xsl:choose>

        <xsl:if test="($navigation_style_to_use = 'google') or
                      ($navigation_style_to_use = 'link')">
  <!-- *** Google result set navigation *** -->
        <xsl:variable name="mod_end">
          <xsl:choose>
            <xsl:when test="$next"><xsl:value-of select="$guess"/></xsl:when>
            <xsl:otherwise><xsl:value-of select="$view_end"/></xsl:otherwise>
          </xsl:choose>
        </xsl:variable>

        <xsl:call-template name="result_nav">
          <xsl:with-param name="start" select="0"/>
          <xsl:with-param name="end" select="$mod_end"/>
          <xsl:with-param name="current_view" select="($view_begin)-1"/>
          <xsl:with-param name="navigation_style" select="$navigation_style_to_use"/>
        </xsl:call-template>
        </xsl:if>

  <!-- *** Show next navigation, if available *** -->
        <xsl:choose>
          <xsl:when test="$next">
            <td nowrap="1">
              <xsl:if test="$navigation_style_to_use != 'google'">
                  <xsl:call-template name="nbsp"/>
              </xsl:if>
              <span class="{$fontclass}">
              <a ctype="nav.next" href="http://10.30.15.145/search?start={$view_begin +
                $num_results - 1}">
                <xsl:if test="$navigation_style_to_use = 'google'">

                  <img src="/home/images/nav_next.png" width="100" height="26"

                    alt="Next" border="0"/>
                  <br/>
                </xsl:if>
                <xsl:text>Next</xsl:text>
                <xsl:if test="$navigation_style_to_use = 'top'">
                  <xsl:call-template name="nbsp"/><xsl:text>&gt;</xsl:text>
                </xsl:if>
              </a>
              </span>
            </td>
          </xsl:when>
          <xsl:otherwise>
            <td nowrap="1">
              <xsl:if test="$navigation_style_to_use != 'google'">
                <xsl:call-template name="nbsp"/>
              </xsl:if>
              <xsl:if test="$navigation_style_to_use = 'google'">
                <img src="/home/images/nav_last.png" width="46" height="26"

                  alt="Last" border="0"/>
                <br/>
              </xsl:if>
            </td>
          </xsl:otherwise>
        </xsl:choose>

  <!-- *** End Google result bar *** -->
      </tr>
    </table>

    <xsl:if test="$navigation_style_to_use != 'top'">
      <xsl:text disable-output-escaping="yes">&lt;/div&gt;
        &lt;/center&gt;</xsl:text>
    </xsl:if>
  </xsl:if>
</xsl:template>

<!-- **********************************************************************
 Helper templates for generating Google result navigation (do not customize)
   only shows 10 sets up or down from current view
     ********************************************************************** -->

	<xsl:template name="nbsp">
		<xsl:text>nbsp;</xsl:text>
	</xsl:template>

<xsl:template name="result_nav">
  <xsl:param name="start" select="'0'"/>
  <xsl:param name="end"/>
  <xsl:param name="current_view"/>
  <xsl:param name="navigation_style"/>

  <!-- *** Choose how to show this result set *** -->
  <xsl:choose>
    <xsl:when test="($start)&lt;(($current_view)-(10*($num_results)))">
    </xsl:when>
    <xsl:when test="(($current_view)&gt;=($start)) and
                    (($current_view)&lt;(($start)+($num_results)))">
      <td>
        <xsl:if test="$navigation_style = 'google'">
          <img src="/home/images/nav_current.gif" width="16" height="26" alt="Current"/>
          <br/>
        </xsl:if>
        <xsl:if test="$navigation_style = 'link'">
          <xsl:call-template name="nbsp"/>
        </xsl:if>
        <span class="i"><xsl:value-of
          select="(($start)div($num_results))+1"/></span>
        <xsl:if test="$navigation_style = 'link'">
          <xsl:call-template name="nbsp"/>
        </xsl:if>
      </td>
    </xsl:when>
    <xsl:otherwise>
      <td>
        <xsl:if test="$navigation_style = 'link'">
            <xsl:call-template name="nbsp"/>
        </xsl:if>
        <a ctype="nav.page" href="http://10.30.15.145/search?start={$start}">
        <xsl:if test="$navigation_style = 'google'">
          <img src="/home/images/nav_page.gif" width="16" height="26" alt="Navigation"
               border="0"/>
          <br/>
        </xsl:if>
        <xsl:value-of select="(($start)div($num_results))+1"/>
        </a>
        <xsl:if test="$navigation_style = 'link'">
           <xsl:call-template name="nbsp"/>
        </xsl:if>
      </td>
    </xsl:otherwise>
  </xsl:choose>

  <!-- *** Recursively iterate through result sets to display *** -->
  <xsl:if test="((($start)+($num_results))&lt;($end)) and
                ((($start)+($num_results))&lt;(($current_view)+
                (10*($num_results))))">
    <xsl:call-template name="result_nav">
      <xsl:with-param name="start" select="$start+$num_results"/>
      <xsl:with-param name="end" select="$end"/>
      <xsl:with-param name="current_view" select="$current_view"/>
      <xsl:with-param name="navigation_style" select="$navigation_style"/>
    </xsl:call-template>
  </xsl:if>

</xsl:template>
<!-- **********************************************************************
  Reformat the keyword match display in a title/snippet string
     (do not customize)
     ********************************************************************** -->

<xsl:template name="reformat_keyword">
  <xsl:param name="orig_string"/>

  <xsl:variable name="reformatted_1">
    <xsl:call-template name="replace_string">
      <xsl:with-param name="find" select="$keyword_orig_start"/>
      <xsl:with-param name="replace" select="$keyword_reformat_start"/>
      <xsl:with-param name="string" select="$orig_string"/>
    </xsl:call-template>
  </xsl:variable>

  <xsl:variable name="reformatted_2">
    <xsl:call-template name="replace_string">
      <xsl:with-param name="find" select="$keyword_orig_end"/>
      <xsl:with-param name="replace" select="$keyword_reformat_end"/>
      <xsl:with-param name="string" select="$reformatted_1"/>
    </xsl:call-template>
  </xsl:variable>

  <xsl:value-of disable-output-escaping='yes' select="$reformatted_2"/>

</xsl:template>
<!-- *** Template to sanitize UAR i18n messages *** -->
<xsl:template name="sanitize_uar_i18n_message">
  <xsl:param name="uar_message_to_be_sanitized"/>
  <xsl:variable name="uar_message_without_apos">
         <xsl:call-template name="replace_string">
           <xsl:with-param name="find" select='"&apos;"'/>
           <xsl:with-param name="replace" select='"\&apos;"'/>
           <xsl:with-param name="string" select="$uar_message_to_be_sanitized"/>
         </xsl:call-template>
  </xsl:variable>
  <xsl:variable name="uar_message_without_apos_double_quotes">
      <xsl:call-template name="escape_quot">
        <xsl:with-param name="string" select="$uar_message_without_apos"/>
      </xsl:call-template>
  </xsl:variable>
  <xsl:variable name="uar_message_without_apos_double_quotes_lt">
         <xsl:call-template name="replace_string">
           <xsl:with-param name="find" select='"&lt;"'/>
           <xsl:with-param name="replace" select='"&amp;lt;"'/>
           <xsl:with-param name="string"
             select="$uar_message_without_apos_double_quotes"/>
         </xsl:call-template>
  </xsl:variable>
  <xsl:variable name="uar_message_without_apos_double_quotes_lt_gt">
         <xsl:call-template name="replace_string">
           <xsl:with-param name="find" select='"&gt;"'/>
           <xsl:with-param name="replace" select='"&amp;gt;"'/>
           <xsl:with-param name="string"
             select="$uar_message_without_apos_double_quotes_lt"/>
         </xsl:call-template>
  </xsl:variable>
  <xsl:value-of select="$uar_message_without_apos_double_quotes_lt_gt"/>
</xsl:template>

<xsl:template name="escape_quot">
  <xsl:param name="string"/>
  <xsl:call-template name="replace_string">
    <xsl:with-param name="find" select="'&quot;'"/>
    <xsl:with-param name="replace" select="'&amp;quot;'"/>
    <xsl:with-param name="string" select="$string"/>
  </xsl:call-template>
</xsl:template>

<!-- *** Find and replace *** -->
<xsl:template name="replace_string">
  <xsl:param name="find"/>
  <xsl:param name="replace"/>
  <xsl:param name="string"/>
  <xsl:choose>
    <xsl:when test="contains($string, $find)">
      <xsl:value-of select="substring-before($string, $find)"/>
      <xsl:value-of select="$replace"/>
      <xsl:call-template name="replace_string">
        <xsl:with-param name="find" select="$find"/>
        <xsl:with-param name="replace" select="$replace"/>
        <xsl:with-param name="string"
          select="substring-after($string, $find)"/>
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="$string"/>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

</xsl:stylesheet>
<!--gs.com/shailaja/paging-for-search-results-xslt-alternative-of-search-paging-webpart/-->
<!--sitesearch	 Limits search results to documents in the specified domain, host, or web directory. Has no effect if the q parameter is empty. This parameter has the same effect as the site special query term.

Unlike the as_sitesearch parameter, the sitesearch parameter is not affected by the as_dt parameter. The sitesearch and as_sitesearch parameters are handled differently in the XML results. The sitesearch parameter's value is not appended to the search query in the results. The original query term is not modified when you use the sitesearch parameter. The specified value for this parameter must contain fewer than 125 characters.-->
<!--http://sourceforge.net/projects/gsapagination/-->
<!--start	 Specifies the index number of the first entry in the result set that is to be returned. Use this parameter, along with num, to implement page navigation for search results. The index number of the results is 0-based. 

Examples:
start=0, num=10, returns the first 10 results (these are returned by default if no start or num are specified.)
start=10, num=10, returns the next 10 results. 

The maximum number of results available for a query is 1,000, i.e., the value of the start parameter added to the value of the num parameter cannot exceed 1,000. -->
<!--cache link example-->
<!--http://googlesearch.med.umich.edu/search?q=cache:SX4z9knet28J:www.med.umich.edu/u/compliance/area/privacy/training.htm+training&client=default_frontend&output=xml_no_dtd&proxystylesheet=default_frontend&ie=UTF-8&site=default_collection&access=p&oe=ISO-8859-1-->