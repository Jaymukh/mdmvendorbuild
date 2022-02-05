sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.View1", {
		onInit: function () {
				//Please dont delete this  below line, and whenever new build you are doing please update the version as well eq : 1.0.2
			console.log('Version : 1.0.4');
		}
	});
});