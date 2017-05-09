/*Handle double logout issue between CSIDS & OU LIB Primos*/
function logoutLIBPrimoAlso(prmCtrl){
	var customizedLogout = function(){
		var form4out = document.createElement("form");
		form4out.id = "customizedLogout";
		form4out.name = "customizedLogout";
		form4out.method = "GET";
		form4out.action = "https://" + pdsServer + "/pds";
		document.body.appendChild(form4out);
		var input1 = document.createElement("input");
		input1.type = "hidden";
		input1.name = "func";
		input1.value = "logout";
		form4out.appendChild(input1);
		var input2 = document.createElement("input");
		input2.type = "hidden";
		input2.name = "calling_system";
		input2.value = "primo";
		form4out.appendChild(input2);
		var input3 = document.createElement("input");
		input3.type = "hidden";
		input3.name = "institute";
		input3.value = "OUHK";
		form4out.appendChild(input3);
		var input4 = document.createElement("input");
		input3.type = "hidden";
		input3.name = "url";
		input3.value = "http://" + libPrimoServer + "/primo-explore/search?vid=" + libPrimoVid + "&fromCSIDSPrimo=yes";
		form4out.appendChild(input4);
		form4out.submit();
	}; //end function
	prmCtrl.parentCtrl.authenticationService.handleLogout = customizedLogout;
} //end logoutLIBPrimoAlso()

function handleLogoutFromLIBPrimo(prmCtrl){
	try{
		/*Test if logout request is from CSIDS Primo, redirect to the CSIDS Primo if this is the case*/
		var locationSearch = location.search;
		if(locationSearch.includes("fromOUHKLIBPrimo=yes")){
			prmCtrl.parentCtrl.loginService.userSessionManagerService.local_logout();
			window.location.href="http://" + libPrimoServer + "/primo-explore/search?vid=" + libPrimoVid + "&performLogout=true";
		} //end if
	} //end try

	catch(err){console.log("handleLogoutFromCSIDS(): " + err); console.log(prmCtrl);}
} //end handleLogoutFromCSIDS();