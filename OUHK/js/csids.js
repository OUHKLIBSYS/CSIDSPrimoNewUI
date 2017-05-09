/*Check if in Union Search and prepare for the customized Features*/
function prepareUnionSearchFeature(prmCtrl){
	try{

		/*Hide / Remove default summary status*/
		var prepareUnionSearch = function(selectedTab){
			var translator = prmCtrl.parentCtrl.$translate.instant;
			var sessionToken = prmCtrl.parentCtrl.jwtUtilService.getDecodedToken();
			var unionSearchTabName = translator("getit.customized.union_search_code." + institute);
			var sheet = window.document.styleSheets[0];
			if(selectedTab==unionSearchTabName){
				sheet.insertRule("div[ng-repeat~='availability']{display:none;}",sheet.cssRules.length);
			} else {
				var rules = sheet.rules;
				for(var i=0; i<rules.length; i++){
					if(rules[i].selectorText=='div[ng-repeat~="availability"]')
						sheet.removeRule(i);
				} //end for
			} //end if
		} //end prepareUnionSearch()
		var onSubmit = prmCtrl.parentCtrl.onSubmit;
		var onSubmitStr = onSubmit.toString();
		onSubmitStr = onSubmitStr.replace("function (){", "");
		onSubmitStr = onSubmitStr.replace(/\}$/, "");
		onSubmit = function(){eval(onSubmitStr); prepareUnionSearch(prmCtrl.parentCtrl.selectedTab);};
		prmCtrl.parentCtrl.onSubmit = onSubmit;
		
		prepareUnionSearch(prmCtrl.parentCtrl.selectedTab);
	} //end try
	catch (err) {console.log("prepareUnionSearchFeature(): " + err);console.log(prmCtrl);}
} //end prepareUnionSearchFeature()


/*CSIDS Union Search Customized ILL tab*/
function customizedILLTab(prmCtrl){
	try{
		prmCtrl.recordid = prmCtrl.parentCtrl.result.pnx.control.recordid + "";

		var isInUnionSearch = false;
		for(var i=0; i<prmCtrl.parentCtrl.result.pnx.control.sourceid.length; i++){
			if(prmCtrl.parentCtrl.result.pnx.control.sourceid[i].includes("csids"))
			isInUnionSearch = true;
		} //end for

		if(isInUnionSearch){	
			var recids = prmCtrl.parentCtrl.result.pnx.display.lds47;
			var homeLib = prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.inst;
			var translator = prmCtrl.parentCtrl.primolyticsService.$translate.instant;

			if(isIllable(prmCtrl)){
				prepareILLHTMLForm(prmCtrl);

				var illMultiVolumeCallBack = function(result){
					try{
						prmCtrl.selectVolStr = translator("illrequest.customzied.select_volume");
						var illVolSelects = document.getElementsByName("ill_vol_select" + prmCtrl.recordid);
						var json = JSON.parse(result);

						for(var j=0; j<illVolSelects.length; j++){
							var loadbefore = false;
							var illVolSelect = illVolSelects[j];
							for(var i=0; i<illVolSelect.length; i++){
								if(illVolSelect.options[i].value == "? undefined:undefined ?")
									illVolSelect.remove(i);
								if(illVolSelect.options[i].value != "0"
									 && illVolSelect.options[i].value != "? undefined:undefined ?")
									loadbefore = true;
							} //end for
							if(!loadbefore){
							var option = document.createElement("option");
							for(var i=0; i<json.items.length; i++){
								option = document.createElement("option");
								var volTxt = json.items[i].item.split(",");
								if(volTxt[2]!=""){
									option.text = volTxt[2] + " " + volTxt[0] + " " + volTxt[1];
									option.value = volTxt[2];
									illVolSelect.add(option);
								} //end if
							} //end for
							} //end if
							illVolSelect.style.display = "inline";
						} //end for
		
					} //end try	
					catch (err) {console.log("customizedILLTab():illMultiVolumeCallBack()" + err);console.log(prmCtrl);}
				}; //end function()


				var illSummaryStatusCallBack = function(result, count){
					try{
					if(result.includes("AVAILABLE")){
						prmCtrl.ill = translator("nui.ill.header");

						if(prmCtrl.isMultiVol){
							serviceForCustomizedILLTabMultiVolume(recids, homeLib, illMultiVolumeCallBack, count);
						} //end if
					} //end if
					}//en try
					catch (err) {console.log("customizedILLTab():illSummaryStatusCallBack()" + err);console.log(prmCtrl);}				
				}; //end function

				
				var count = new Object();
				count.summaryStatusRetry = 0;
				count.multiVolumeRetry = 0;			
				serviceForCustomizedILLTabSummaryStatus(recids, homeLib, illSummaryStatusCallBack, count);
			} //end if
		} //end if
	} //end try

	catch (err) {console.log("customizedILLTab(): " + err);console.log(prmCtrl);}
} //end customizedILLTab(prmCtrl)

/*For CSIDS Union Search Customized ILL tab - Check a title if able to do inter-library loan.*/
function isIllable(prmCtrl){
	try{
	var illable = false;
	var isMultiVol = false
	var homeLib = prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.inst;
	var translator = prmCtrl.parentCtrl.primolyticsService.$translate.instant;
	var lds48 = prmCtrl.parentCtrl.result.pnx.display.lds48;
	var lds47 = prmCtrl.parentCtrl.result.pnx.display.lds47;
	var illGroup = translator("illrequest.customized.illform.privilege." + homeLib);
	var illGroups = illGroup.split(",");
	var currentUserGroup = prmCtrl.parentCtrl.primolyticsService.
	userSessionManagerService.jwtUtilService.getDecodedToken().userGroup;
	currentUserGroup = currentUserGroup.trim();
	prmCtrl.ill = "";
	for(var i=0; i<illGroups.length; i++){
		if(currentUserGroup==illGroups[i]){
			if(lds48 != null){
				for(var j=0; j<lds48.length; j++){
					if(lds48[j].includes(homeLib)){
						illable = false;
					} //end if
					if(lds48[j].includes("ILL") && !lds48[j].includes(homeLib))
						illable = true;
				} //end for
				for(var j=0; j<lds47.length; j++){
					if(lds47[j].includes(homeLib)){
						illable = false;
					} //end if	
				} //end for
			} //end if
		} //end if
	} //end for
	return illable;
	} //end try
	catch(err){console.log("iLLTabCheckIllable(): " + err);console.log(prmCtrl);}
	return false;
} //end iLLTabCheckILLable()

/*For CSIDS Union Search Customized ILL tab - Feed in the HTML forms the requested title for ILL*/
function prepareILLHTMLForm(prmCtrl){
	try{
	var lds46 = prmCtrl.parentCtrl.result.pnx.display.lds46;
	var homeLib = prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.inst;
	var translator = prmCtrl.parentCtrl.primolyticsService.$translate.instant;
	var illformURL = translator("illrequest.customized.illform.baseurl." + homeLib);
	if(lds46!=null){
		prmCtrl.isMultiVol = false;
		for(var i=0; i<lds46.length; i++){
			var key = lds46[i].split("=")[0];
			var value = lds46[i].split("=")[1];
			if(key=="VOLUME")
				prmCtrl.isMultiVol = true;
			if(key=="BTITLE")
				prmCtrl.title = value;
			if(key=="AU")
				prmCtrl.author = value;
			if(key=="PUBLISHER")
				prmCtrl.publisher = value;
			if(key=="COP")
				prmCtrl.publish_place = value;
			if(key=="DATE")
				prmCtrl.year = value;
			if(key=="ISBN")
				prmCtrl.isbn = value;
			if(key=="EDITION")
				prmCtrl.edition = value;
			if(key=="SERIESTITLE")
				prmCtrl.series = value;
		} //end for
	
		var aulast = "";
		var aufirst = "";
		if(prmCtrl.author==null || prmCtrl.author==""){
			for(var i=0; i<lds46.length; i++){
				var key = lds46[i].split("=")[0];
				var value = lds46[i].split("=")[1];
				if(key=="AUFIRST")
					aufirst = value;
				if(key=="AULAST")
					aulast = value;
			} //end for
			prmCtrl.author = aufirst + " " + aulast;
			if(prmCtrl.author==" ")
				prmCtrl.author = "."
		} //end if
	} //end if

	prmCtrl.submitILL = function(id){
		try{
			var forms = document.getElementsByName("illform" + id);
			var illVolSelects = document.getElementsByName("ill_vol_select" + prmCtrl.recordid);
			var i = illVolSelects.length - 1;
			if((prmCtrl.isMultiVol && !illVolSelects[i][0].selected)
				|| !prmCtrl.isMultiVol){
				forms[i].action=illformURL;
				forms[i].submit();
			}//end if
		} //end try
		catch(err){console.log("prepareILLHTMLForm():prmCtrl.submitILL()" + err);}
	} //end function()

	prmCtrl.changeVol = function(id){
		try{
			var illVolSelects = document.getElementsByName("ill_vol_select" + prmCtrl.recordid);
			var i = illVolSelects.length - 1;
			var illVolSelect = illVolSelects[i];
			prmCtrl.vol = illVolSelect.options[illVolSelect.selectedIndex].value;
			prmCtrl.isbn = "";
		} //end try
		catch(err){console.log("prepareILLHTMLForm():prmCtrl.changeVol" + err);}
		} //end function()
	} //end try
	catch(err){console.log("prepareILLHTMLForm(): " + err);}
} //end prepareILLHTMLForm()

/*For CSIDS Union Search Customized ILL tab - Real Time query for the title's volume information*/
function serviceForCustomizedILLTabMultiVolume(recordIds, homeLib, callback, count){
	try{	
		count.multiVolumeRetry++;
		if(count.multiVolumeRetry<3){
			var xhttp = new XMLHttpRequest();
			var ajax_url = "/primo_library/libweb/csids/tiles/ill_get_volumes_new_ui.jsp?recordIds=" + recordIds + "&homeLib=" + homeLib;
			
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					var result = xhttp.responseText;
					result = result.replace("<!-- taglibsIncludeAll.jspf begin -->", "");
					result = result.replace("<!-- taglibsIncludeAll.jspf end -->", "");
					result = result.trim();
					if(result!=null && result!=""){
						callback(result);
					} else {
						serviceForCustomizedILLTabMultiVolume(recordIds, homeLib, callback, count);
					} // end if
				} //end if
			} //end function()

			xhttp.open("GET", ajax_url, true);
			setTimeout(xhttp.send(), 500);
		} //end if
	} //end try
	
	catch (err) {console.log("serviceForCustomizedILLTabMultiVolume(): " + err);}
} //serviceForCustomizedILLTabMultiVolume()

/*For CSIDS Union Search Customized ILL tab - query real time the title's availbility for ILL.*/
function serviceForCustomizedILLTabSummaryStatus(recids, homeLib, callback, count){
	try{
		count.summaryStatusRetry++;
		if(count.summaryStatusRetry<3){
			var ajax_url = "/primo_library/libweb/csids/tiles/ava_illsummarystatus_for_ajax.jsp?recordIds=" + recids + "&homeLib=" + homeLib;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					var result = xhttp.responseText;
					result = result.replace("<!-- taglibsIncludeAll.jspf begin -->", "");
					result = result.replace("<!-- taglibsIncludeAll.jspf end -->", "");
					result = result.trim();
					if(result!=null && result!=""){
						callback(result, count);
					} else {
						serviceForCustomizedILLTabSummaryStatus(recids, homeLib, callback, count);
					} //end if
				} //end if
			}; //end function()
		        xhttp.open("GET", ajax_url, true);
	        	setTimeout(xhttp.send(), 800);
		} //end if
	} //end try
	catch (err) {console.log("serviceForcustomizedILLTabSummaryStatus: " + err);}
} //end serviceForcustomizedILLTabSummaryStatus()


/*CSIDS Union Search Customized Viewonline tab.*/
function customizedViewonlineTab(prmCtrl){
	try{
	var pnx = prmCtrl.parentCtrl.item.pnx;
	var translator = prmCtrl.parentCtrl.primolyticsService.$translate.instant;
	var isInUnionSearch = false;
	
	for(var i=0; i<pnx.control.sourceid.length; i++){
		if(pnx.control.sourceid[i].includes("csids"))
			isInUnionSearch = true;
	} //end for

	var hasEVersion = false;
	if(pnx.links.linktorsrc!=null)
		hasEVersion = true;

	if(isInUnionSearch && hasEVersion){
	
		var temp = prmCtrl.parentCtrl.primolyticsService.$translate;
		temp.onReady().then(function(){

			var servicesArray = prmCtrl.parentCtrl.fullViewService.servicesArray;

			//Remove "Services" tab
			var ser_index_del = -1;
			for(var i=0; i<servicesArray.length; i++){

				if(servicesArray[i].scrollId.includes("getit_link1_0")){
				
					if ( servicesArray[i].serviceName == "display" )
					{
						ser_index_del = i;
					}
					
					
				} //end if
			} //end for
			if (ser_index_del != -1){
				servicesArray.splice(ser_index_del, 1);
			}
			
			var links = new Array(pnx.links.linktorsrc.length);
			var linktorsrc = pnx.links.linktorsrc;
			
			var homeLib = prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.inst;
			
			var institutions = translator("delivery.customized.consortial_members").split(",");
			var homeInstIndexes = new Array(pnx.links.linktorsrc.length);
			var homeLinkNumber = 0;
			var otherInstHeld = false;
			var printedOtherInstHeld = false;

			for(i=0; i<homeInstIndexes.length; i++){
				homeInstIndexes[i] = -1;
			} //end for

			for(i=0; i<linktorsrc.length; i++){
				if(linktorsrc[i].includes(homeLib)){
					homeInstIndexes[homeLinkNumber]=i;
					homeLinkNumber++;
				} //end if
			} //end for

			for(i=0; i<homeInstIndexes.length; i++){

				if(homeInstIndexes[i]>0){

					var reqmovelink = linktorsrc[homeInstIndexes[i]];

					for(var j=homeInstIndexes[i]; j>0; j--){
						linktorsrc[j] = linktorsrc[j-1];
					}
					
					linktorsrc[0] = reqmovelink;			
					
				} //end if
			} //end for
			
			for(i=0; i<links.length; i++){
				var link = linktorsrc[i];				
				var linkComponents = link.split("$$");

				var url = "";
				var des = "";
				for(j=0; j<linkComponents.length; j++){
					if(linkComponents[j].match(/^U/))
						url = linkComponents[j].replace(/^U/, "");
					if(linkComponents[j].match(/^D/))
						des = linkComponents[j].replace(/^D/, "");
				} //end for

				var removalWords = translator("getit.customized.viewonline_wording_removal").split(",");

				var wordsConvertion = translator("getit.customized.viewonline_wording_convertion").split(",");


				var viewOnlineVia = translator("ovl.customized.viewOnlineVia");

				des = des.replace(/&nbsp;/g, " ");

				for(j=0; j<removalWords.length; j++){
					if(removalWords[j]!=null && removalWords[j]!=""){
						var regexp = new RegExp(removalWords[j],"g");
						des = des.replace(regexp, " ");							
					} //end if
				} //end for

				for(j=0; j<wordsConvertion.length; j++){
					if(wordsConvertion[j]!=null && wordsConvertion[j]!=""){
						regexp = new RegExp(wordsConvertion[j],"g");
						des = des.replace(regexp, viewOnlineVia);	
					}//end if				
				} //end for


				for(j=0; j<institutions.length; j++){
					if(des.includes(institutions[j])){
						des = des.replace(institutions[j], "(" + institutions[j] + ")");
					}//if
				} //end for
				
				des = des.replace("  ", " ");
				
				var prefix = "";
				if(link.includes(homeLib)){
					prefix = translator("ovl.customized.homeAvailableRSC");			

	
				} else {
					prefix = translator("ovl.customized.otherAvailableRSC");
					otherInstHeld = true;
				} //end if
				if(i==0){
					des = prefix + "<br>" + des + "";
					if (otherInstHeld) {printedOtherInstHeld = true;}
				}else{					
						if(otherInstHeld && !printedOtherInstHeld){
							printedOtherInstHeld = true;
							des = "<br>" + prefix + "<br>" + des + "";
						}
				}

				links[i] =
					{
						displayText: des,
						getItTabText: "tab1_onl_norestrict",
						hyperlinkText: des,
						isLinktoOnline: true,
						link: url,
						openInNewWindow:true
					};
				
			} //end for


			servicesArray.push(
				{
					scrollId: "getit_link1_1", serviceName: "display", title: "nui.getit.tab1_onl_norestrict",
					linkElement:
						{links: links,
						category:"Online Resources"
					}
				}
			);

			var viewonline = servicesArray[(servicesArray.length)-1];
			for(i=servicesArray.length-1; i>1; i--){
				servicesArray[i] = servicesArray[i-1];
			} //end for
			servicesArray[1] = viewonline;

		});		
		
	} //end if
	} //end try
	catch(err){console.log("customizedViewonlineTab(): " + err);console.log(prmCtrl);}
} //end customizedViewonlineTab()

/*CSIDS Union Search Customized Location RTA tab.*/
function customizedLocationTabRTA(prmCtrl){
	try{
		var results = prmCtrl.parentCtrl.locationsService.results;
		for(var i=0; i<results.length; i++){
			if(results[i]!=null && results[i]!=""){
				var resultItem = results[i][0];
				var ilsApiId = resultItem.location.ilsApiId;
				var lib = resultItem.location.libraryCode;
				var subLib = resultItem.location.mainLocation;
				resultItem.location.availabilityStatus = "";
				var callback = function(result){
					if(result != null && result != "" && (result.indexOf("exception")==-1) )
						resultItem.location.availabilityStatus = result;
				}; //end function
			} //end if
		} //end for

		var count = new Object();
		count.retry = 0;
		serviceForCustomizedLocationTabRTA(ilsApiId, lib, subLib, callback, count);
	} //end try
	catch(e){console.log("customizedLocationTabRTA(): " + e);console.log(prmCtrl);}
} //end customizedLocationTabRTA()

function serviceForCustomizedLocationTabRTA(ilsApiId, lib, subLib, callback, count){
	try{
		count.retry++;
		if(count.retry<3){
			var ajax_url = "/primo_library/libweb/csids/tiles/loctab_avastatus_for_ajax_new_ui.jsp?recid="
				 +ilsApiId+ "&lib=" +lib+ "&subLib=" +subLib;
		        var xhttp = new XMLHttpRequest();
        		xhttp.onreadystatechange = function() {
				try{
					var result = xhttp.responseText;

					result = result.replace("<!-- taglibsIncludeAll.jspf begin -->", "");
					result = result.replace("<!-- taglibsIncludeAll.jspf end -->", "");
	
					result = result.trim();
					if(result != null && result != ""){
						callback(result);
					} else {
						serviceForCustomizedLocationTabRTA(ilsApiId, lib, subLib, callback, count);
					} //end if	
				} //end try
				catch(err){console.log("serviceForCustomizedLocationTabRTA():xhttp: " + err);}
			}; //end function

		        xhttp.open("GET", ajax_url, true);
			setTimeout(xhttp.send(), 800);
		} //end if
	} //end try

	catch(err){console.log("serviceForCustomizedLocationTabRTA(): " + err);console.log(prmCtrl);}
} //end serviceForCustomizedLocationTabRTA();

/*CSIDS Union Search Customized Summary Status.*/
function customizedSummaryStatus(prmCtrl){
	try{
		var isInUnionSearch = false;

		for(var i=0; i<prmCtrl.parentCtrl.result.pnx.control.sourceid.length; i++){
			if(prmCtrl.parentCtrl.result.pnx.control.sourceid[i].includes("csids"))
				isInUnionSearch = true;
		} // end for
		if(isInUnionSearch){
			var translator = prmCtrl.parentCtrl.primolyticsService.$translate.instant;
			prmCtrl.class = "dummy";
			prmCtrl.onlineaccess_display = "none";
			prmCtrl.recordid = prmCtrl.parentCtrl.result.pnx.control.recordid + "";
			prmCtrl.summaryStatus = translator("ovl.customized.loading");
			var homeLib = prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.inst;			
			var crtl = prmCtrl.parentCtrl;
			var recordIds = prmCtrl.parentCtrl.result.pnx.display.lds47;
			var linkstosrc = prmCtrl.parentCtrl.result.pnx.links.linktorsrc;
			if(linkstosrc!=null){
				for(var i=0; i<linkstosrc.length; i++){
					if(linkstosrc[i].includes(institute)){
						var link = linkstosrc[i];
						link = link.replace(/\$\$D.*$/, "");
						link = link.replace(/\$\$O.*$/, "");
						link = link.replace(/^.*\$\$U/, "");
						prmCtrl.onlineaccess_link = link;
						prmCtrl.onlineaccess_display = "inline";
						prmCtrl.onlineaccess_text = translator("delivery.code.not_restricted");
					} //end if
				} //end for
			} //end if

			var callback = function(result){
				try{
					var statuses = result.split(",");
					prmCtrl.summaryStatus = "";
					for(var i=0; i<statuses.length; i++){
						if(statuses[i]!=""){
							prmCtrl.summaryStatus +=
								translator("delivery.customized.code." + statuses[i])
								+ " ";
								if(statuses[i].includes("availableHome")  || statuses[i].includes("AccessHome" ) 
								|| statuses[i].includes("AvailableHome") )
									prmCtrl.class = "csidsAvailable";					
				
						} //end if
					} //end for
					for(var i=0; i<statuses.length; i++){
						if((statuses[i].includes("available") || statuses[i].includes("Available")) && prmCtrl.class=="dummy")		
							prmCtrl.class 	= "csidsMayBeAvailable";		
					} //end for

					if(prmCtrl.class == "dummy")
						prmCtrl.class = "csidsUnAvailable";

				} //end try
				catch(e) {console.log("customizedSummaryStatus():callback:" + e);console.log(prmCtrl);}
			}; //end function
			var count = new Object();
			count.retry = 0;
			serviceForCustomizedSummaryStatus(recordIds, homeLib, callback, count);
		} // end if

	} //end try

	catch(e) {console.log("customizedSummaryStatus():" + e);console.log(prmCtrl);}	
} // end customizedSummaryStatus()

/*For CSIDS Union Search Customized Summary Status - query the title's summary status.*/
function serviceForCustomizedSummaryStatus(recordIds, homeLib, callback, count) {
	try {
		count.retry++;
		if(count.retry < 10){
		var summaryStatusServiceURL = "/primo_library/libweb/csids/tiles/ava_summarystatus_for_ajax_new_ui.jsp?recordIds="
				+ recordIds + "&homeLib=" + homeLib;

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			try{
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					var result = xhttp.responseText;
					result = result.replace("<!-- taglibsIncludeAll.jspf begin -->", "");
					result = result.replace("<!-- taglibsIncludeAll.jspf end -->","");
					result = result.trim();
					if (result != null && result != "") {
						callback(result);
					} else {
						serviceForCustomizedSummaryStatus(recordIds, homeLib, callback, count);
						if(count.retry==5){
							var xhttp2 = new XMLHttpRequest();
							xhttp2.open("GET", "/primo_library/libweb/action/search.do?vid=" + vid, true);
							xhttp2.send();
						} //end if
					} // end if
				} // end if
			} //end try
			catch (err) {console.log("serviceForCustomizedSummaryStatus():xhttp: " + err);} // end catch
		}; // end function()
	
		xhttp.open("GET", summaryStatusServiceURL, true);
		setTimeout(xhttp.send(), 800);
		} else {
			callback("noSummaryStatus");
		} //end if
	} // end try

	catch (err) {console.log("serviceForCustomizedSummaryStatus(): " + err);} // end catch
} // end serviceForCustomizedSummaryStatus()