sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.App", {
		
		onInit: function () {
			//Please dont delete this  below line, and whenever new build you are doing please update the version as well eq : 1.0.2
			jQuery.sap.log.info("Version : 1.12.0");
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.getCountryList();
		}
	});
});