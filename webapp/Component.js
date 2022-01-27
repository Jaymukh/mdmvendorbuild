sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"murphy/mdm/vendor/murphymdmvendor/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("murphy.mdm.vendor.murphymdmvendor.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
			// this.setModel(models.createUserModel(), "userModel");
			// this.getModel("userModel").attachRequestCompleted(function (oData) {
			// 	var sMailID = oData.getSource().getProperty("/email");
			// 	this.setModel(models.createUserInfoModel(sMailID), "userModel");
			// }.bind(this));
		}
	});
});