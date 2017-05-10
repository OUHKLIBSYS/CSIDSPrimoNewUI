/*Global variables*/
var vid = "OUHK";
var libPrimoVid = "ouhk";
var pdsServer = "primo2.lib.ouhk.edu.hk";
var libPrimoServer = "www2.lib.ouhk.edu.hk";
var csidsPrimoServer = "primo2.csids.edu.hk";
var institute = "OUHK";

var xhttp = new XMLHttpRequest();
xhttp.open("GET", "/primo_library/libweb/action/search.do?vid=" + vid, true);
xhttp.send();


/*GA track code*/
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-98135600-1', 'auto');
ga('send', 'pageview');


(function () {
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);

/*Start - CSIDS OUHK LIB View Customization */

/*Start - Convert to Simp Chin on Simp-Chin-Interface*/
app.component('prmBriefResultContainerAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmBriefResultContainerAfterController'
});
app.controller('prmBriefResultContainerAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angular.element(document).ready(function () {
		angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/simpTradChinConversion.js')
			.then(function(){briefViewConvertToSimpChin(prmCtrl);});
	});
}]);
/*End - Convert to Simp Chin on Simp-Chin-Interface*/

/*Start - Change eshelf icon*/
app.component('prmIconAfter', {
	require: ['child', '^parent'],
	bindings: {parentCtrl: '<'},
	controller: 'prmIconAfterController'
});
app.controller('prmIconAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl=this;
	angular.element(document).ready(function () {
		angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){changeEshelfIcon(prmCtrl);});
	});
}]);
/*End - Change eshelf icon*/

/*Start - 1. Logout also to CSIDS Primo and 2. Change the guest wordings.*/
app.component('prmAuthenticationAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmAuthenticationAfterController'
});
app.controller('prmAuthenticationAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;

	//logout OU LIB Primo also
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/csids_ouhk.js').then(function(){logoutLIBPrimoAlso(prmCtrl);});

	//handle logout request from OU LIB Primo
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/csids_ouhk.js').then(function(){handleLogoutFromLIBPrimo(prmCtrl);});

	//Change the user area guest wording
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){changeGuestWordings(prmCtrl);});
}]);
/*End - 1. Logout also to CSIDS Primo and 2. Change the guest wordings.*/

/*Start - Fix Send Email Record Source ID Problem.*/
app.component('prmSendEmailAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmSendEmailAfterController'
});
app.controller('prmSendEmailAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){fixSendEmailRecord(prmCtrl);});
}]);
/*End - Fix Send Email Record Source ID Problem*/

/*Start - Add reminder for the citation users.*/
app.component('prmCitationAfter', {
	templateUrl: '/primo-explore/custom/' + vid + '/html/prmCitationAfter.html',
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
});
/*End - Add reminder for the citation users.*/
/*End - CSIDS OUHK View Customization */

/*Start -  CSIDS Union Search Customized Features*/
/*Start - Check if in Union Search and prepare for the customized Features*/
app.component('prmSearchBarAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmSearchBarAfterController'
});
app.controller('prmSearchBarAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/csids.js').then(function(){ prepareUnionSearchFeature(prmCtrl);});
}]);
/*End - Check if in Union Search and prepare for the customized Features*/

/*Start - CSIDS Customed Viewonline*/
app.component('prmFullViewAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmFullViewAfterController'
});
app.controller('prmFullViewAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/csids.js').then(function(){customizedViewonlineTab(prmCtrl);});
}]);
/*End - CSIDS Customed Viewonline*/

/*Start - CSIDS Customed Location Tab RTA*/
app.component('prmLocationsAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmLocationsAfter'
});
app.controller('prmLocationsAfter', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/csids.js').then(function(){customizedLocationTabRTA(prmCtrl);});
}]);
/*End - CSIDS Customed Location Tab RTA*/


/*Start - CSIDS Customed Summary Status and ILL Tab*/
app.component('prmSearchResultAvailabilityLineAfter', {
	bindings: { parentCtrl: '<' },
	controller: 'prmSearchResultAvailabilityLineAfterController',
	templateUrl: '/primo-explore/custom/' + vid + '/html/csids_summarystatus_and_ill.html',
	
});
app.controller('prmSearchResultAvailabilityLineAfterController', ['angularLoad', function(angularLoad){
	var prmCtrl = this;
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/csids.js').then(function(){
		customizedSummaryStatus(prmCtrl);
		customizedILLTab(prmCtrl);
	});
}]);
/*End - CSIDS Customed Summary Status and ILL Tab*/
/*End -  CSIDS Union Search Customized Features*/

})();
