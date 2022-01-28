sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"murphy/mdm/vendor/murphymdmvendor/model/models",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall"
], function (UIComponent, Device, models, ServiceCall) {
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
			this.serviceCall = new ServiceCall();
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createUserModel(), "userModel");
			this.getModel("userModel").attachRequestCompleted(function (oData) {
				var sMailID = oData.getSource().getProperty("/email");
				this.setModel(models.createUserInfoModel(sMailID), "userRoleModel");
				// creating the user request
			this.getModel("userRoleModel").attachRequestCompleted(function (oDataReq) {
				debugger;
				var oUserModelResources = this.getModel('userRoleModel').getData().Resources[0];
				
				var oObjParam = {
					url: "/murphyCustom/mdm/usermgmt-service/users/user/create",
					hasPayload: true,
					type: 'POST',
					data: {
						"userDetails": [{
							"email_id": oUserModelResources.emails[0].value,
							"firstname": oUserModelResources.name.givenName,
							"lastname": oUserModelResources.name.familyName,
							"display_name": oUserModelResources.displayName,
							"external_id": "92",
							"created_by": 1,
							"modified_by": 1,
							"roles": [{
								"role_code_btp": "DA_MDM_ADMIN"
							}],
							"_active": true
						}]
					}

				};
				this.serviceCall.handleServiceRequest(oObjParam).then(function (oDataResp) {
					this.getModel("userManagementModel").setData(oDataResp.result.userDetails[0]);
				}.bind(this));
			}.bind(this));
			}.bind(this));
			

		}
	});
});