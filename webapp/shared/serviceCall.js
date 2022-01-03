sap.ui.define(["sap/ui/base/Object"],function(object){
	"use strict";
	return object.extend("murphy.mdm.vendor.murphymdmvendor.serviceCall",{
		handleServiceRequest : function(oParam){
			return new Promise(function(resolve,reject){
			//	var sUrl = "/murphyCustom/config-service/configurations/configuration";
				$.ajax({
					url : oParam.url,
					type: 'POST',
					contentType : 'application/json',
					data:JSON.stringify(oParam.data),
				/*	data : JSON.stringify({
						   "configType":sTableName  
						}) ,*/
					success : function(resposeData){
						resolve(resposeData);
					},
					error : function(oError){
						reject(oError);
					}
				});
			});
		}
	});
});