jQuery(function($){
// Configrations
var remoteUrl = 'http://www.prepostseo.com/';

// SEO Scores
var titlePoints = 5;
var slugPoints = 5;
var desPoints = 10;
var keywordsPoints = 5;
var wordsPointsLow = 10;
var wordsPointsMed = 15;
var wordsPointsHigh = 20;
var ratioPoints = 5;
var h1Points = 10;
var h2Points = 5;
var h3Points = 3;
var h4Points = 2;
var intLinksPoints = 5
var extLinksPointsLow = 5;
var extLinksPointsHigh = 10;
var imgsPoints = 5;
var brokenLinksPoints = 10;

// Animation Bar Pointing 
var totalbarval = 0;
var totalYellowbarval = 0;
var totalRedbarval = 0;
var animationRunning = 0;
var activeActions = 0;
var actionsComplete = 0;
var improvements = new Array();

// Configations & Data
var postText = '';
var postContent = '';
var previewHTML = '';
var accKey = '';
var accountOK = 1;

function pps_start_checking_main()
{
	addAnalyzeBtn();
	accKey = $("#ppsMainAccKey").html();
	$("#AnalyzePost").click(function(){
		
		var plagBtn = $(this);
		if(plagBtn.hasClass("disable")){
			return false;
		}
		$("#sba_results").show();
		$("#statusImg").show();
		changeCstatus("Getting data from text editor...");
		
		$("#contentDetails").show();
		checkSEO(accKey);										
		
		
		
	});
	$("#ddImpBtn").click(function(){
		$(".improvements").slideToggle(700);
		$(this).toggleClass("up");
	});
	
	$("#tabs a").click(function(){
		$(".tabsContent").hide();
		$("#" + $(this).attr("name")).show();
		$("#tabs li").removeClass("tab-current");
		$(this).parent().addClass("tab-current");
	});
}
pps_start_checking_main();

function addAnalyzeBtn()
{
	// Start Analyze Button
	var htmlBtn = '<div class="sba_btnCheck_box">';
	htmlBtn += '<span class="button button-primary button-large sba_btnCheck" id="AnalyzePost">Analyze This Post</span>';
	htmlBtn += '</div>'; 
	$("#major-publishing-actions").append(htmlBtn);
	// End Analyze Button
}




function checkSEO(accountKey)
{
	postContent = get_tinymce_content();				
	postText = postContent.replace(/(<([^>]+)>)/ig,"").replace(/\s+/g, " ");
	
	accKey = accountKey;
	windowScrolling();
	initiateActions();
	doAction(checkStatus);
	doAction(getPreviewHtml);
	
	activeTab("contentStatus");
	doAction(checkSEO_step2);
	doAction(checkSEO_step3);
	doAction(checkSEO_step4);
	doAction(checkSEO_step5);
}

function checkStatus()
{
	activeActions  = 1;
	
	$("#pluginStatus").html("");
	var key = $("#ppsMainAccKey").html();
	var version = $("#ppsPluginVersion").html();
	var plugDir = $("#pluginDir").html();
	var adminURL = $("#ppsAdminURL").html();
	$.ajax({
		url : adminURL + "post.php",
		type: "post",
		data: {"key": key, "v":version, "pps_check_status": 1},
		dataType:"JSON",
		success: function(res){
			if(res.status != "ok")
			{
				var alertHTML = '<span class="alert alert_' + res.status + '">'
				+ res.msg
				+ '</span>';
				$("#pluginStatus").html(alertHTML)
				accountOK = 0;
			} else {
				accountOK = 1;
			}
			activeActions = 0;
		}
	});
	
}


function checkSEO_step2()
{
	
	if(accKey.length < 10)
	{
		$(".currentStatus").hide();
		return false;
	}
	changeCstatus("Checking Content...");
	checkPostTitle();
	checkPostUrl();
	checkMetaDescription(previewHTML);
	checkMetaKeywords(previewHTML);
	contentStatus(postText, postContent);
	
	checkHeadings(previewHTML);
	checkLinks(postContent);
	
	checkImgs(postContent);
	addPointsLoadBar(totalbarval);
	increaseGreenbar(totalbarval);
	increaseYellowbar(totalYellowbarval);
	increaseRedbar(totalRedbarval);
	
}

function checkSEO_step3()
{
	if(accKey.length < 10)
	{
		return false;
	}
	activeTab("linksStatus");
	changeCstatus("Checking Broken Links...");
	checkBrokenLinks(postContent);
}

function checkSEO_step4()
{
	if(accKey.length < 10)
	{
		return false;
	}
	activeTab("densityStatus");
	changeCstatus("Checking Keywords Density...");
	checkDensity(postText);
}



function checkSEO_step5()
{
	if(accKey.length < 10)
	{
		return false;
	}
	showImprovements();
	activeTab("plagResult");
	changeCstatus("Checking Post Plagiarism...");
	sendRequests(postText, accKey);
}


function activeTab(name){
	$("#tabs li").removeClass("tab-current");
	$(".tabsContent").hide();
	$("a[name='"+name+"']").parent().addClass("tab-current");
	$("#"+name).show();
}


function checkSEO_old(postText, postContent, accKey)
{
	
	windowScrolling();
	initiateActions();
	
	var interval1 = setInterval(function()
	{
		if(activeActions == 0)
		{
			clearInterval(interval1)
			
			var previewHTML = getPreviewHtml();
			
			
			
		
			
			if(checkDensity(postText)){}
			
			var ActionsInterval = setInterval(function()
			{
				if(activeActions == 0)
				{
					clearInterval(ActionsInterval)
					changeCstatus("Checking Broken Links...");
					checkBrokenLinks(postContent);
				}
			}, 100);
			
			
			var actionsCompleteInterval = setInterval(function()
			{
				if(actionsComplete == 1)
				{
					clearInterval(actionsCompleteInterval)
					showImprovements();
					changeCstatus("Checking Post Plagiarism...");
					sendRequests(postText, accKey);
				}
			}, 100);
			
			
		}
	}, 100);
}


function addStatus(type, title, content)
{
	var html = '<span class="notice ' + type + '"><p>'
               + '<b class="labelN">' + title + ' : </b><br>'
               +  content 
               +  '</p></span>';
	$("#contentStatus").append(html);
}




function convertToSlug(Text)
{
	return Text
		.toLowerCase()
		.replace(/[^\w ]+/g,'')
		.replace(/ +/g,'-')
		;
}

function get_tinymce_content(){
	if (jQuery("#wp-content-wrap").hasClass("tmce-active")){
		return tinyMCE.activeEditor.getContent();
	}else{
		return jQuery('#html_text_area_id').val();
	}
}

function getPreviewHtml()
{
	activeActions  = 1;
	changeCstatus("Getting data from Live Preview...");
	$.ajax({
		url: $("#post-preview").attr("href"),
		async:true,
		success: function(data)
		{
			previewHTML = data;
			activeActions  = 0;
		}
	});
}


function changeCstatus(val)
{
	$("#cStats").html(val);
}


function loadBar(start, end) {
    //var progressbar = $('#progress_bar');

    var value = start;
    var max = end;
    var diff = max - value;
    time = (1000 / diff) * 0.5;
    //alert(time);
    if (end < 1) {
        loading();
        return false;
    }

    var loading = function() {
        value += 1;

        //addValue = progressbar.val(value);

        $('.progress-value').html(value + '%');
        var $ppc = $('.progress-pie-chart'),
            deg = 360 * value / 100;
        if (value > 50) {
            $ppc.addClass('gt-50');
        }
        $('.ppc-progress-fill').css('transform', 'rotate(' + deg + 'deg)');
        $('.ppc-percents .score').html(value);

        if (value == max) {
			animationRunning = 0;
            clearInterval(animate);
        } else {
			animationRunning = 1;
		}
    };

    var animate = setInterval(function() {
        loading();
    }, time);
}


function startBar()
{
	$("#pbar").attr("data-percent", 0);
	totalbarval = 0;
}

function initiateActions()
{
	$("#contentStatus").html("");
	totalYellowbarval = 0;
	totalRedbarval = 0;
	improvements.splice(0,50);
	startBar();
	$("#greenBar").animate({"width" : 0 +"%"}, 100);
	$("#greenBar").attr("start", 0);
	$("#yellowBar").animate({"width" : 0 +"%"}, 100);
	$("#yellowBar").attr("start", 0);
	$("#redBar").animate({"width" : 0 +"%"}, 100);
	$("#redBar").attr("start", 0);
}

function addPointsLoadBar(add)
{
	var start = parseInt($("#pbar").attr("data-percent"));
	//alert(start);
	var end = start+add;
	
	loadBar(start,end);
	$("#pbar").attr("data-percent", end);
}

function increaseGreenbar(add)
{
	start = parseInt($("#greenBar").attr("start"));
	end = start + add;
	$("#greenBar").animate({"width" : end +"%"}, 500);
	$("#greenBar").attr("start", end);
}

function increaseYellowbar(add)
{
	start = parseInt($("#yellowBar").attr("start"));
	end = start + add;
	$("#yellowBar").animate({"width" : end +"%"}, 500);
	$("#yellowBar").attr("start", end);
}

function increaseRedbar(add)
{
	start = parseInt($("#redBar").attr("start"));
	end = start + add;
	$("#redBar").animate({"width" : end +"%"}, 500);
	$("#redBar").attr("start", end);
}
function plusGreenBar(points)
{
	totalbarval = totalbarval + parseInt(points);
}
function plusYellowBar(points)
{
	totalYellowbarval = totalYellowbarval + parseInt(points);
}
function plusRedBar(points)
{
	totalRedbarval = totalRedbarval + parseInt(points);
}

function showImprovements()
{
	var htmlImp = '<span class="label label_warning">SEO improvement Suggestions:</span>'
                   + '<p>According to our survery your post needs the following improvements, '
                   + 'Please do the following changes, so that google left no calue to rank down your post.</p>'
                   + '<ul>';
	for(i = 0; i < improvements.length ; i++)
	{
		htmlImp += '<li>' + improvements[i] + '</li>';
	}
	htmlImp += '</ul>';
	$(".improvements").html(htmlImp);
}


function showAlert(type, msg)
{
	html = '<span class="alert alert_' + type + '">'
            + msg
            + '</span>';
	$("#alerts").html(html);
}




function windowScrolling()
{
	var elemOff = $("#sba_results").offset().top;
	elemOff = elemOff-100;
	activeActions = 1;
	$("html, body").animate({ scrollTop: elemOff }, 1000, function(){
		activeActions = 0;
	});
	
}

function doAction(fn)
{
		var interval = setInterval(function()
		{
			if(activeActions == 0)
			{
				clearInterval(interval);
				fn();
			}
		},100);
}






function checkPostTitle()
{
	postTitle = $("#title").val();
	titleLabel = '<span class="label label_tick">Post Title</span>';
	var type = 'success';
	if(postTitle.length < 65 && postTitle.length > 1)
	{
		titleStatus = '<b>Title:</b> ' + postTitle + ' <span class="green">(Good)</span>'
					+ '<br><span class="f12"><b>Length:</b> ' + postTitle.length 
					+ ' character(s) <br> Thats Good to have title length less then 65 characters..</span>';
		plusGreenBar(titlePoints);
	} else if(postTitle.length < 10) {
		plusRedBar(titlePoints);
		type = 'error';
		titleStatus = '<b>Title:</b> ' + postTitle + ' (Not Found)'
					+ '<br><span class="f12"><b>Length:</b> ' + postTitle.length 
					+ ' character(s) <br> Post Title length is very short..</span>';
		improvements.push("Title Length is very short..");
	} else {
		plusRedBar(titlePoints);
		titleStatus = '<b>Title:</b> ' + postTitle + ' <span class="red">(Warning)</span>'
					+ '<br><span class="f12"><b>Length:</b> ' + postTitle.length 
					+ ' character(s) <br> Post title characters length is more than 65, try to short your post title </span>';
		improvements.push("Title Length is more than 65 characters, lower down it.");
		type = 'warning';
	}
	addStatus(type, "Post Title", titleStatus);
}


function checkPostUrl()
{
	postTitle = $("#title").val();
	postSlug = $("#editable-post-name-full").html();
	
	var totalKeyMatches = 0;
	newTitle = postTitle.removeStopWords();
	slug = convertToSlug(newTitle);
	parts = slug.split('-');
	for(i=0; i < parts.length; i++)
	{
		if(postSlug.indexOf(parts[i]) != -1)
		{
			totalKeyMatches++;
		}
	}
	percent = 100;
	if(parts.length > 0)
	{
		var percent = (totalKeyMatches/parts.length)*100;
		percent = percent.toFixed(0);
	}
	type = 'success';
	if(percent > 50)
	{
		plusGreenBar(slugPoints);
		slugMsg = '<b>Good</b> <br>'
			+ '<span>Looks like more than 50% of title keywords matched with tha post url</span>';
	}else{
		plusYellowBar(slugPoints);
		type = 'warning';
		slugMsg = '<b>Title Keys words not matched with url</b> <br>'
			+ '<span>Our automated system detect that, keywords in the title are less then 50% matched with you post url</span>';
		
		improvements.push("Try to add keywords in your post url.");
	}
	
	addStatus(type, "Post URL", slugMsg);
}

function checkMetaDescription(data)
{
	desFound = 0;
	$(data).find("meta").each(function()
	{
		if($(this).attr("name").toLowerCase() == "description")
		{
			desFound = 1;
			desContent = $(this).attr("content");
		}
	});
	
	type = 'error';
	desMsg = '<b class="red">Meta Description Not Found</b> <br>'
	+ '<span class="f12">(Meta Description have a very high impect on your page SEO, You must solve this issue)</span>';
	if(desFound == 1)
	{
		if(desContent.length > 160)
		{
			plusYellowBar(desPoints);
			type = 'warning';
			desMsg = 'Meta Description Found <br>'
			+ '<span class="f12 red">(Meta Description characters length is more than 160, '
			+ 'But most search eangines allow meta description less than 160, '
			+ 'try to reduce this length to improve you post SEO)</span>';			
		
			improvements.push("Meta Description length is more than 160 chars. But Google only allow you to add less than 160 chars.");
		} else {
			plusGreenBar(desPoints);
			type = 'success';
			desMsg = '<span class="green">Meta Description Found</span> <br>'
			+ '<span class="f12">(Meta Description have a very high impect on your page SEO)</span>';
		}
	}else {
		plusRedBar(desPoints);
		
		improvements.push("Add Meta Description for this post, because it highly effects you page SEO");
	}
	addStatus(type, "Meta Description", desMsg);
}

function checkMetaKeywords(data)
{
	found = 0;
	$(data).find("meta").each(function()
	{
		if($(this).attr("name").toLowerCase() == "keywords")
		{
			found = 1;
		}
	});
	
	var type = 'success';
	desMsg = '<span class="green">Meta Keywords Not Found</span> <br>'
	+ '<span class="f12">(According to new Google updates, keywords are no longer important for your website SEO)</span>';
	if(found == 1)
	{
		type = 'error';
		plusRedBar(keywordsPoints);
		desMsg = '<b class="red">Meta keywords Found !</b> <br>'
		+ '<span class="f12">(According to new Google updates, keywords are no longer important for your website SEO)</span>';			
		improvements.push("Meta Keywords tag is no longer accepted by google, remove it.");
	}else {
		plusGreenBar(keywordsPoints);
	}
	addStatus(type, "Meta Keywords", desMsg);
}

function contentStatus(){  
	var val   = $.trim(postText), // Remove spaces from b/e of string
		words = val.replace(/\s+/gi, ' ').split(' ').length, // Count word-splits
		chars = val.length;                                  // Count characters
		if(!chars) words=0;
		var ratio = postText.length / postContent.length;
		ratio = ratio.toFixed(2)*100;
	  	
		var wordMsg = '';
		if(words > 500) {
			plusGreenBar(wordsPointsHigh);			
			wordMsg = "Post length is "+words+" Words, No doubt its great.";
		} else if(words > 250) {
			plusGreenBar(15);
			plusYellowBar(5);
			wordMsg = "Post length is "+words+" Words , its good. but you can make it better by increasing it to 450+.";
			improvements.push(wordMsg);
		} else if (words > 50) {
			plusGreenBar(10);
			plusYellowBar(10);
			wordMsg = "Post total words are less than 250, increase post content.";
			improvements.push(wordMsg);
		} else {
			plusRedBar(20);
			wordMsg = "Post total words are less than 50, please improve your post content and try to increase words at least up to 250";
			improvements.push(wordMsg);
		}
		
		if(words > 150)
		{
			var type = 'success';
			wordStatus = '<b>' + words + '</b> Words <span class="green">(Good)</span>';
		} else {
			type = 'warning';
			wordStatus = '<b>' + words + ' Words</b> '
			+ '<br> <span class="f12"> (Content length is very short)</span>';
		}
		
		addStatus(type, "Post Total Words", wordStatus + "<br> " + wordMsg);
		
		
		var type = 'success';
		ratioMsg = ratio + '%';
		if(ratio < 30)
		{
			type = 'warning';
			ratioMsg += '<br><spab class="f12">text to HTML ratio is very low you can improve this ratio by using less html tags</span>';
			improvements.push("Text to html ratio is very low, try to remove some tags or increase content.");
		} else {
			
			totalbarval = totalbarval + parseInt(ratioPoints);
		}
		addStatus(type, "Text to HTML ratio", ratioMsg);
		
}

function checkHeadings(mixedHtml)
{
	var h1Status, h2Status ,h3Status, h4Status;
	var h1s = 0;
	var h2s = 0;
	var h3s = 0;
	var h4s = 0;
	
	$(mixedHtml).find("h1").each(function(){
		h1s++;
	});
	$(mixedHtml).find("h2").each(function(){
		h2s++;
	});
	$(mixedHtml).find("h3").each(function(){
		h3s++;
	});
	$(mixedHtml).find("h4").each(function(){
		h4s++;
	});
	
		var type = 'success';
	if(h1s == 1)
	{
		plusGreenBar(h1Points);
		h1Status = '<b class="green">' + h1s + ' Found</b> <br> <span class="f12"> You have one H1 heading in single page on front end.';
		h1Status += 'it is good, because you must have only 1 h1-heading on one page</span>'; 
	} else if(h1s > 1)
	{
		plusYellowBar(h1Points);
		type = 'warning';
		h1Status = '<b>' + h1s + ' Found</b> <br>  <span class="f12">(You have more than one H1 Headings in single Page)</span>';
	
		improvements.push("On Live Preview, This post page have more than H1 tags, keep only one H1 tag, remove all the rest.");
	} else {
		plusRedBar(h1Points);
		type = 'error';
		h1Status = '<b>Not Found</b> (Warning) <br>  <span class="f12">(H1 heading is very important to improve your ranking in the seacrh engines..)</span>';
	
		improvements.push("H1 tag not found, on live preview on this post, Add at least One H1 Tag.");
	}
	
	addStatus(type, "H1 Heading", h1Status);	
		
	if(h2s > 0)
	{
		plusGreenBar(h2Points);
		type = 'success';
		h2Status = '<b>' + h2s + ' Found</b>';
	} else {
		plusYellowBar(h2Points);
		type = 'warning';
		h2Status = '<b class="red">Not Found</b>';
		h2Status += '<br> <span class="f12">(H2 Headings can improve your ranking in the search engines. If you can add H2 headings in your articles then that is very good) </span>';
	
		improvements.push("H2 tags can help this post to boost in Search Engines");
	}
	
	addStatus(type, "H2 Headings", h2Status);
	
	if(h3s > 0)
	{
		plusGreenBar(h3Points);
		type = 'success';
		h3Status = '<b class="green">' + h3s + ' Found</b>';
	} else {
		plusYellowBar(h3Points);
		type = 'info';
		h3Status = '<b> Not Found</b>';
		h3Status += '<br> <span class="f12">(H3 Headings can improve your ranking in the search engines. If you can add H3 headings in your articles then that is very good)</span>';
	
		improvements.push("H3 tags can help this post to boost in Search Engines");
	}
	addStatus(type, "H3 Headings", h3Status);
	
	if(h4s > 0)
	{
		plusGreenBar(h4Points);
		type = 'success';
		h4Status = '<b>' + h4s + ' Found</b> <b class="green">(Good)</b>';
	} else {
		plusYellowBar(h4Points);
		type = 'info';
		h4Status = 'Not Found';
	
		improvements.push("H4 tags can help this post to boost in Search Engines");
	}
	
	addStatus(type, "H4 Headings", h4Status);
}
function checkLinks(mixedHtml)
{
	var internal_links = new Array();
		var external_links = new Array();
		var int_dofollow = 0;
		var ext_dofollow = 0;
		var totalLinks = 0;
		var url    = window.location.href;
		var hotname = get_hostname(url);
		
		
		$(mixedHtml).find('a').each(function()
		{
			totalLinks++;
			//var obj = $(this);
			var linkUrl = $(this).attr("href");
			if(linkUrl.length > 6)
			{
				var linkHost = get_hostname(linkUrl);
				if(linkHost.toLowerCase() == hotname.toLowerCase())
				{
					internal_links.push(linkUrl);
					if(!$(this).attr("rel") || $(this).attr("rel").toLowerCase() != "nofollow")
					{
						int_dofollow++;
					}
					
				} else {
					external_links.push(linkUrl);
					
					if(!$(this).attr("rel") || $(this).attr("rel").toLowerCase() != "nofollow")
					{
						ext_dofollow++;
					}
				}
			}
			
		});
		
		var int_nofollow = internal_links.length - int_dofollow;
		var ext_nofollow = external_links.length - ext_dofollow;
		
		
		
		if(int_dofollow > 0 && int_dofollow < 5)
		{
			plusGreenBar(intLinksPoints);
		}else {
			plusYellowBar(intLinksPoints);
			improvements.push("Try to linking your blog posts with each other.");
		}
		
		
		if(ext_dofollow < 1)
		{
			if(external_links.length > 0)
			{
				plusGreenBar(extLinksPointsLow);
				improvements.push("Remove External links..");
				
			} else {
				plusGreenBar(extLinksPointsHigh);
			}
		} else {
			plusRedBar(extLinksPointsHigh);
			improvements.push("Remove External Do-follow links, or atleast make them nofollow.");
		}
		
		
		if(totalLinks < 1)
		{
			plusGreenBar(brokenLinksPoints);
		}
		
		
		
		internal_links_label = '<span class="label">Internal Links</span>';
		internal_links_msg = 'Not Found';
		if(internal_links.length > 0)
		{
			internal_links_msg = '<b>'+ internal_links.length + ' links found</b>'
			+ '<br> <span class="f12">(doFollow: <b>'+ int_dofollow +'</b> , noFollow: <b>'+ int_nofollow +'</b> )</span>';
		}
		addStatus("info", "Internal Links", internal_links_msg);
		
		
		
		
		external_links_label = '<span class="label">External Links</span>';
		external_links_msg = 'Not Found';
		var type = 'success';
		if(external_links.length > 0)
		{
			external_links_msg = '<b>'+ external_links.length + ' links found</b>'
			+ '<br> <span class="f12">(doFollow: <b>'+ ext_dofollow +'</b> , noFollow: <b>'+ ext_nofollow +'</b> )</span>';
			type = 'warning';
			if(ext_dofollow > 2)
			{
				type = 'error';
				external_links_msg += '<br> <span class="f12">More dofollow external links can down your raning in the search engines.</span>';
			}
		}
		addStatus(type, "External Links", external_links_msg);
}
function checkImgs(mixedHtml)
{
	var imgLabel = '<span class="label">Images</span>';
	var imgStatus = 'No Image Found';
	var missingAlts = 0;
	var totalImgs = $(mixedHtml).find('img').length;
	
	if(totalImgs > 0)
	{
	
		imgStatus = '<b>' + totalImgs + ' Found</b>';
		$(mixedHtml).find('img').each(function()
		{
			if(!$(this).attr("alt") || $.trim($(this).attr("alt")).length < 1)
			{
				missingAlts++;
			}
		});
		var type = 'success';
		if(missingAlts > 0)
		{
			type = 'warning';
			imgStatus += '<br><span class="f12 red">(' + missingAlts + ' images missing <b>Alt</b> attribute)</span>';
		}else{
			imgStatus += '<br><span class="f12 green">(All image(s) have alt attribute)</span>';
		}
		
	}
	
	if(missingAlts < 1)
	{
		plusGreenBar(imgsPoints);
	} else {
		plusYellowBar(imgsPoints);
		improvements.push("Add Alt attributes to all images");
	}
	
	addStatus(type, "Images", imgStatus);
}

function checkDensity(text)
{
	plugDir = $("#pluginDir").html();
	var adminURL = $("#ppsAdminURL").html();
	var result = true;
	activeActions = 1;
	$.ajax({
		url : adminURL + "post.php",
		type: "post",
		data: {data:text, pps_check_density : 1},
		dataType:"json",
		async: true, 
		success: function(resp)
		{
			if(resp.error == "1")
			{
				var htmlIn = '<span class="sec_heading">Keywords Density</span>';
				$("#densityStatus").append(htmlIn);
				addStatus('none', "Keywords Density", "Keywords Density Not Found..");
			}else{
				
				
				var htmlIn = '<span class="sec_heading">Keywords Density</span>';
				
				
				htmlIn += '<table class="densityTabel">'
				+ '<tr class="tr_head1"><td width="33%">One Word</td>'
				+ '<td width="33%">Two Words</td>'
				+ '<td width="33%">Three Words</td></tr>';
				htmlIn += '<tr>';
		
				var d1 = '';
				for(i=0; i < resp.results_1.length; i++){	
					d1 += '<span class="keyword_box"><span class="text">' 
						+ resp.results_1[i]['term'] + '</span><span class="density">' 
						+ resp.results_1[i]['density'] + '%</span> </span>';
				};
				
				var d2 = '';
				for(i=0; i < resp.results_2.length; i++){	
					d2 += '<span class="keyword_box"><span class="text">' 
						+ resp.results_2[i]['term'] + '</span><span class="density">' 
						+ resp.results_2[i]['density'] + '%</span> </span>';
				};
				
				var d3 = '';
				for(i=0; i < resp.results_3.length; i++){	
					d3 += '<span class="keyword_box"><span class="text">' 
						+ resp.results_3[i]['term'] + '</span><span class="density">' 
						+ resp.results_3[i]['density'] + '%</span> </span>';
				};
				
				htmlIn += '<td valign="top">'+d1+'</td>';
				htmlIn += '<td valign="top">'+d2+'</td>';
				htmlIn += '<td valign="top">'+d3+'</td></tr>';
				htmlIn += '</tabel>';
				
			}
			$("#densityStatus").append(htmlIn);
			result = true;
			activeActions = 0;
		}
	});
	return result;
	
}

function checkBrokenLinks(html)
{
	plugDir = $("#pluginDir").html();
	var adminURL = $("#ppsAdminURL").html();
	var linksArray = new Array();
	$(html).find('a').each(function()
	{
		linksArray.push($(this).attr("href"));
	});
	var start = 0;
	var brokenLinks = 0;
	if(linksArray.length > 0)
	{		
		activeActions = 1;
		var htmlLinks = '<span class="sec_heading">Links Status</span>'
			+ '<table><tr><td width="1000" id="brokenLinks" align="center"><span class="label label_tick">Links Status</span>'
			+': <span id="br_st" class="green"><span id="br_no">0</span> Broken Link(s) Found</span></td></tr>'
			+ '<tr><td width="700"><table class="densityTabel linksTable" width="100%">'
			+ '<tr class="tr_head1"><td width="10%">Sr#</td><td width="80%">Link URL</td><td width="10%">Status</td></tr>';
		
		for(i=0; i < linksArray.length; i++)
		{
			var no = i+1;
			htmlLinks += '<tr><td>' + no 
				+ '</td><td id="linkno_' + no + '">' + linksArray[i] 
				+ '</td><td id="status_' + no + '">---</td></tr>'; 
		}
		
		htmlLinks += '</table></td></tr></table>';
		
		$("#linksStatus").html(htmlLinks);
		
		
		
		function sendLinksReq()
		{
				if(start < linksArray.length)
				{
					var imgLoad = '<img src="' + plugDir + 'imgs/loading3.gif" />';
					$("#status_" + no).html(imgLoad);
					$.ajax({
						url : adminURL + "post.php",
						data: {url:linksArray[start], "pps_check_broken" : 1},
						type: "post",
						success: function(response)
						{
							var no = start+1;
							if (response == "true")
							{
								var imgst = '<img src="' + plugDir + 'imgs/tick.png" />';
								$("#status_" + no).html(imgst);
							} else {
								brokenLinks++;
								var imgst = '<img src="' + plugDir + 'imgs/cross.png" />';
								$("#status_" + no).html(imgst);
								var linkH = '<span class="red">' + linksArray[start] + '</span>';
								$("#linkno_" + no).html(linkH);
								$("#brokenLinks .label").removeClass("label_tick").addClass("label_error");
								$("#br_no").html(brokenLinks);
							}
							
							if(brokenLinks > 0)
							{
								$("#br_st").addClass('red').removeClass('green');
								$("#br_st").show();
							}
							
							start++;
							sendLinksReq();
						}
					});
				} else {
					if(brokenLinks < 1) {
						
						increaseGreenbar(brokenLinksPoints);
						
						var animateNew = setInterval(function(){
						if(animationRunning == 0)
						{
							animationRunning = 1;
							clearInterval(animateNew)
							addPointsLoadBar(brokenLinksPoints);
						}
						}, 100);
					} else {
						increaseRedbar(brokenLinksPoints);
						improvements.push('<span class="red">Broken Links Found</span>, Remove broken links from your post, or its gonna ruined your post SEO.');
					}
					activeActions = 0;
					actionsComplete = 1;
				}
		}
		sendLinksReq();
	} else {
		actionsComplete = 1;
	}
}






	
function get_hostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
	if(m)
	{
		return m[0];
	}
    var n = url.match(/^https:\/\/[^/]+/);
	if(n)
	{
		return n[0];
	}
	return null;
}


/// Plagiarism 

function sendRequests(innerText, accKey)
{
	var mainSite = remoteUrl;
	var plagBtn = $("#AnalyzePost");
	$("#plagResult").show();
	
	function doneRequests()
	{
		$("#loadGif").hide();
		plagBtn.removeClass("disable");
		$("#checkStatus").html("COMPLETE");
		$(".currentStatus").hide();
	}
	
	
	
	
	
	
	plagBtn.addClass("disable");
		
		
		$("#howUnique").show();
		$("#uniqueCount").html(0);
		var totalU = 0;
		$(".resultsBars").html("");
		$("#result-main").show();
		$("#loadGif").show();
		$("#checkStatus").html("Checking Content...");
		$("#plagResultsT").show();
		var parts = innerText.split(" ");
		var values = [];
		var i = 0;
		var tmpVar = "";
		$.each(parts, function(index, value) {
			
			if(tmpVar.length < 55)
			{
				tmpVar += " " + value;
			}else{
				values[i] = tmpVar.replace(/\s+/g, " ");
				i++;
				tmpVar = value;
			}
		});
		if(values.length < 1 &&  parts.length > 0) values[0] = tmpVar;
		
		var roundUnique = 0;
		var isPlagOnce = 0;
		var uparts = 100/values.length;
		uparts = parseFloat(uparts.toFixed(2));
		$("#uniqueBar").animate({"width" : "0%"}, 500);
		function doRequest(index) {
			plugDir = $("#pluginDir").html();
			var adminURL  = $("#ppsAdminURL").html();
			$.ajax({
				type: 'POST',
				url : adminURL + "post.php",
				data : {"query" : values[index], "key" : accKey, "pps_check_plag" : 1},
				async:true,
				
				success: function(response){
					data = JSON.parse(response);
					if(data.error == "1")
					{
						errorHtml = '<span class="statBox plagSta">'
						+ '<span class="label label_warning">Account Authentication Error</span></span>';
						$(".resultsBars").append(errorHtml);
						doneRequests();
						return false;
					}
					if(data.error == "2")
					{
						errorHtml = data.display1;
						$(".resultsBars").append(errorHtml);
						doneRequests();
						htmlIn = data.display2;
						showAlert("error", htmlIn);
						return false;
					}
					if(data.unique == "1")
					{
						 alertHtml = '<span class="statBox uniqueSta">'
						+ '<span class="txt">' + values[index] + '</span>'
						+ '<b class="check">- Unique</b></span>';
		   
						
						totalU = totalU+uparts;
					}else {
						isPlagOnce = 1;
						 alertHtml = '<span class="statBox plagSta">'
						+ '<span class="txt">' + values[index] + '</span>'
						+ '<b class="check">- plagiarized</b></span>';
					}
					$(".resultsBars").append(alertHtml);
					
					roundUnique = totalU.toFixed(0);
					$("#uniqueCount").html(roundUnique);
					$("#uniqueBar").animate({"width" : roundUnique+"%"}, 500);
					/*
					if(roundUnique > 65)
					{
						$("#uniqueCount").parent().addClass("green");
						$("#uniqueCount").parent().removeClass("red");
					} else {
						$("#uniqueCount").parent().removeClass("green");
						$("#uniqueCount").parent().addClass("red");
					}
					*/
					if (index+1<values.length) {
						doRequest(index+1);
					}else{
						doneRequests();
						if(isPlagOnce != 1)
						{
							$("#uniqueCount").html(100);
							$("#uniqueBar").animate({"width" : "100%"}, 500);
						} else {
							if(roundUnique < 40)
							{
								htmlIn = '<b>Criticle Error Found: </b> Your Content is only <strong class="red">'+roundUnique+'% Unique</strong> this may hurt your page SEO, '
								+ 'Try to make it at least <strong class="green">65% Unique</strong>. You may acheive overall 100/100 SEO Score, but it will be useless '
								+ 'with out unique content. ';
								showAlert("error", htmlIn);
							} else if (roundUnique < 60) {
								htmlIn = '<b>Warning: </b> Your Content is only <strong class="red">'+roundUnique+'% Unique</strong> this may hurt your page SEO, '
								+ 'Try to make it at least <strong class="green">65% Unique</strong>. You may acheive overall 100/100 SEO Score, but it will be useless '
								+ 'with out unique content. ';
								showAlert("warning", htmlIn);
							}
						}
					}
				}
			}); 
		}
		if(values.length > 0){
			doRequest(0);
		}
}

});