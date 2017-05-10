function briefViewConvertToSimpChin (prmCtrl){
	try{
		if(prmCtrl.parentCtrl.$state.params.lang == "zh_CN"
		 || prmCtrl.parentCtrl.userSessionManagerService.i18nService.getLanguage() == "zh_CN"){

			var elements = document.querySelectorAll("prm-brief-result");
			if(elements[prmCtrl.parentCtrl.index-1]!=null)
				convInnerHTMLtoSimpChin(elements[prmCtrl.parentCtrl.index-1]);

			if(prmCtrl.parentCtrl.isFullView){
				convInnerHTMLtoSimpChin(elements[0]);
				if(elements[elements.length-1]!=null)
					convInnerHTMLtoSimpChin(elements[elements.length-1]);
			} //end if

			var element = document.querySelector("prm-service-details");
			if(element!=null)
					convInnerHTMLtoSimpChin(element);

		} //end if
	} //end  try
	catch(err){console.log("briefViewConvertToSimpChin(): " + err);}
} //end briefViewConvertToSimpChin()

function facetConvertToSimpChin(prmCtrl){
	try{
		if(prmCtrl.parentCtrl.$stateParams.lang == "zh_CN"
		 || prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.i18nService.getLanguage() == "zh_CN"){
			var facetService = prmCtrl.parentCtrl.facetService;

			for(var i=0; i<facetService.results.length; i++){
				facetService.results[i].facetGroupCollapsed = true;
			} //for

			var element = document.querySelector("prm-facet");
			if(element!=null)
					convInnerHTMLtoSimpChin(element);

			for(var i=0; i<facetService.results.length; i++){
				facetService.results[i].facetGroupCollapsed = false;
			} //for

		} //end if
	} //end try
	catch(err){console.log("facetConvertToSimpChin(): " + err);}
} //end facetConvertToSimpChin()

function convInnerHTMLtoSimpChin(obj){
	try{
		if(obj.tagName != "SPAN" && obj.tagName != "STRONG" && obj != null){
			var childern = obj.children;
			for(var i=0; i<childern.length; i++)
				convInnerHTMLtoSimpChin(childern[i]);
		} else {
			if(obj.innerHTML!=null && obj.innerHTML!="")
				//The function toSimpChin() needs your further development;
				obj.innerHTML = toSimpChin(obj.innerHTML);
		}
	} //end try
	catch(err){"end convInnerHTMLtoSimpChin(): "  + console.log(err);}
} //end convInnerHTMLtoSimpChin()

function toSimpChin(str){
	//Implement your codes to translated a string from Traditional Chinese to Simplified Chinese here.
	//You may consider to use the free version (under GNU) of the function here https://github.com/stevendaniels/New-Tongwen-Tang
}

