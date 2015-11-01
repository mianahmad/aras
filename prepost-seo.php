<?php
/*
  Plugin Name: PrePost SEO 
  Plugin URI: http://www.prepostseo.com/
  Description: Best plugin to check post seo before its published. it checks Plagiarized Content, Keyword Density, Links Count, Broken Links, Images Tages, etc.. <a href="http://www.prepostseo.com" target="_blank">View full features list Click Here</a>.
  Version: 1.0
  Author: Ahmad Sattar
  Author URI: https://twitter.com/prepostseo
  License: GPLv3+
*/

/*
Copyright (C) 2015 Ahmad Sattar, prepostseo.com (me AT prepostseo.com) 

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if ( ! defined( 'PPS_ACTION_SITE' ) )
	define("PPS_ACTION_SITE", "http://www.prepostseo.com/");

if ( ! defined( 'PPS_VERSION' ) )
	define("PPS_VERSION", "1.0");


class PPS_WP_AhmadSeo{
	
	function __construct() {
		 add_action( 'admin_menu', array( $this, 'pps_wpa_add_menus' ) );
	}
	
	function  pps_wpa_add_menus()
	{
		 add_menu_page( 'PrePost SEO', 'PrePost SEO', 'manage_options', 'prepost-seo', array(
                          __CLASS__,
                         'pps_wpa_files_path'
                        ), plugins_url('imgs/logo.png', __FILE__),'14.6');
		
	}
	
	
	
	function pps_wpa_files_path()
	{
		include('settingPage.php');
	}
	
	 /*
     * Actions perform on activation of plugin
     */
    function pps_wpa_install() {
	
    	
		
		if(strlen(@get_option('prepostseo_acckey')) < 10)
		{
			@add_option('prepostseo_acckey', "");
			@update_option('prepostseo_acckey', "");
		}
		
		@add_option('prepostseo_version', PPS_VERSION);
		@update_option('prepostseo_version', PPS_VERSION);
		
		@add_option('prepostseo_action_site', PPS_ACTION_SITE);
		@update_option('prepostseo_action_site', PPS_ACTION_SITE);
		
		
	}

	
}
new PPS_WP_AhmadSeo();








add_action( 'admin_menu', 'pps_create_metabox_seo' );
register_activation_hook( __FILE__, array( 'PPS_WP_AhmadSeo', 'pps_wpa_install' ) );

function pps_create_metabox_seo()
{
	$post_types = get_post_types();
	foreach($post_types as $type){
		add_meta_box( 'my-meta-box', '<b>Seo status of this post</b>', 'pps_seobox_design', $type, 'normal', 'high' );
	}
}

function pps_main_actions()
{
	include_once("actions.php");
}
add_action( 'admin_init', 'pps_main_actions' );

add_action('admin_head', 'pps_pre_post_seo_top');

function pps_wp_admin_style() {
		wp_register_style( 'pps_main_css', plugin_dir_url(__FILE__) . 'pps_style.css', false, '1.0.0' );
		wp_enqueue_style( 'pps_main_css' );
		wp_register_style( 'pps_tabs_css', plugin_dir_url(__FILE__) . 'css/tabstyles.css', false, '1.0.0' );
        wp_enqueue_style( 'pps_tabs_css' );
		wp_register_style( 'pps_setting_css', plugin_dir_url(__FILE__) . 'css/settings.css', false, '1.0.0' );
        wp_enqueue_style( 'pps_setting_css' );
		
	}
add_action( 'admin_enqueue_scripts', 'pps_wp_admin_style' );

function pps_pre_post_seo_top() {
		wp_enqueue_script('jquery');
		//wp_enqueue_script( 'pps_jquery_latest', plugin_dir_url(__FILE__) . 'js/jquery.js');
		wp_enqueue_script( 'pps_stopwords', plugin_dir_url(__FILE__) . 'js/stopwords.js', array('jquery'));
		wp_enqueue_script( 'pps_main_fn', plugin_dir_url(__FILE__) . 'js/fn.new.js', array('jquery'));
		wp_enqueue_script( 'pps_modernizr', plugin_dir_url(__FILE__) . 'js/modernizr.custom.js', array('jquery'));
		wp_enqueue_script( 'pps_cbpFWTabs', plugin_dir_url(__FILE__) . 'js/cbpFWTabs.js', array('jquery'));
}


function pps_seobox_design()
{
?><span id="sba_results" style="display:none;">
    	<span id="pluginDir" style="display:none;"><?php echo plugin_dir_url(__FILE__); ?></span>
        <span id="ppsMainAccKey" style="display:none;"><?php echo @get_option("prepostseo_acckey"); ?></span>
        <span id="ppsPluginVersion" style="display:none;"><?php echo @get_option("prepostseo_version"); ?></span>
        <span id="ppsAdminURL" style="display:none;"><?php echo get_admin_url(); ?></span>
        
    	<span id="contentDetails" style="display:none;">
        	
            
            <span class="sec_heading">SEO Score</span>
            
            <span class="row">
            	<table>
                	<tr>
                    	<td width="800" valign="top">
                        	
                            <span style="margin-top:30px; float:left;">
                                <span class="bar_btn">Passed:</span>
                                <span class="outer_bar">
                                    <span class="inner_green" id="greenBar" start="0" style="width:0%;"></span>
                                </span>
                            </span>
                            <br><br>
                            <span style="margin-top:17px; float:left;">
                                <span class="bar_btn">To Improve:</span>
                                <span class="outer_bar">
                                    <span class="inner_yellow" id="yellowBar" start="0" style="width:0%;"></span>
                                </span>
                            </span>
                            <br><br>
                            <span style="margin-top:17px; float:left;">
                                <span class="bar_btn">Error:</span>
                                <span class="outer_bar">
                                    <span class="inner_red"  id="redBar" start="0" style="width:0%;"></span>
                                </span>
                            </span>
                        </td>
                        <td width="200">
                        	 <div id="pbar" class="progress-pie-chart" data-percent="0">
                                <div class="ppc-progress">
                                    <div class="ppc-progress-fill" style="transform: rotate(0deg);"></div>
                                </div>
                                <div class="ppc-percents">
                                    <div class="pcc-percents-wrapper">
                                        <span class="score">0</span>
                    
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </span>
            <span class="currentStatus">
            	<img src="<?php echo plugin_dir_url(__FILE__); ?>imgs/loading3.gif" id="statusImg" />
                <span id="cStats"></span>
            </span>
            <span id="suggestions">
            	<span class="improvements" style="display:none;">
                   
                </span>
                <span class="imp_dd">
                	<span class="show_btn down" id="ddImpBtn">SEO improvement suggestions</span>
                </span>
            </span>
            
            
            <span id="alerts">
            		
            </span>
            <span id="pluginStatus">
            		
            </span>
            
            <div class="container maintabsSec">
                
                <section>
                    <div class="tabs tabs-style-bar" id="tabs">
                        <nav>
                            <ul>
                                <li><a class="" name="contentStatus"><span>Status</span></a></li>
                                <li><a class="" name="linksStatus"><span>Links</span></a></li>
                                <li><a class="" name="densityStatus"><span>Density</span></a></li>
                                <li><a class="" name="plagResult"><span>Plagiarism</span></a></li>
                                <li><a class="" name="imgsStatus"><span>Images</span></a></li>
                            </ul>
                        </nav>
                       
                    </div><!-- /tabs -->
                </section>
            </div><!-- /container -->
            
            <span class="content_staus_box tabsContent" id="contentStatus" style="display:none; width:100%;"></span>
            <span class="content_staus_box tabsContent" id="linksStatus" style="display:none;  width:100%;"></span>
            <span class="content_staus_box tabsContent" id="densityStatus" style="display:none;  width:100%;"></span>  
            <span class="content_staus_box tabsContent" id="imgsStatus" style="display:none;  width:100%;">Images Compression comming soon....</span>  
        </span>
    	
        <span id="plagResult" class="tabsContent" style="display:none;">
            <span class="sec_heading">Plagiarism Checker</span>
            <table class="resultstable" id="plagResultsT" style="display:none;">
                <tr style="width:100%;">
                    <td style="width:400px;" align="center">
                        <img src="<?php echo plugin_dir_url(__FILE__); ?>imgs/loading3.gif" id="loadGif" class="loadImg" >
                        <strong id="checkStatus">Checking Content...</strong>
                    </td>
                    <td align="center"  style="width:600px;">
                        <span class="resultBar">
                            <span class="showBar" id="uniqueBar" style="width:0%;">
                            </span>
                            <span class="showText" id="howUnique"><span id="uniqueCount">0</span>% Unique</span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="resultsBars" style="float:left;">
                        </div>
                    </td>
                </tr>
            </table>
        </span>
        <span id="linksResult" style="display:none;">
        	<span class="sec_heading">Links Status</span>
        </span>
        
        
        
        
        
    </span>
	

    
<?php	
}