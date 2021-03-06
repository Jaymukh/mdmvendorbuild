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
		init: function () {var that = this;

			this.serviceCall = new ServiceCall();

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createUserModel(), "userModel");
			this.getModel("valueHelps").setSizeLimit(100000);
			this.getModel("countryRegionModel").setSizeLimit(20000);
			this.getModel("userModel").attachRequestCompleted(function (oData) {
				var sMailID = oData.getSource().getProperty("/email");
				this.setModel(models.createUserInfoModel(sMailID), "userRoleModel");
				// creating the user request
				this.getModel("userRoleModel").attachRequestCompleted(function (oDataReq) {
					var oUserModelResources = this.getModel("userRoleModel").getData().Resources[0];
					var aAccountGroup = this.getModel("CreateVendorModel").getProperty("/accountGroupsData");
					var aRoles = [];
					var aTempAccountGrps = [];
					var aAccountGrps = [];
					var aTotalRoles = [];
					// oUserModelResources.groups.push({display:'DA_MDM_VEND_REQ_VEND', value:'DA_MDM_VEND_REQ_VEND'});
					// oUserModelResources.groups.push({display:'DA_MDM_VEND_REQ_JVPR', value:'DA_MDM_VEND_REQ_JVPR'});
					// oUserModelResources.groups.push({display:'DA_MDM_ADMIN', value:'DA_MDM_ADMIN'});
					oUserModelResources.groups.forEach(function (oItem) {
						if(oItem.display.indexOf("DA_MDM") !== -1){
							aTotalRoles.push({"role_code_btp" : oItem.value});
						}
						if (oItem.value.split("DA_MDM_VEND_")[1]) {
							var aResultArr = oItem.value.split("DA_MDM_VEND_")[1].split('_');
							if (aRoles.indexOf(aResultArr[0].toLowerCase()) === -1) {
								aRoles.push(aResultArr[0].toLowerCase());
							}
							if (aTempAccountGrps.indexOf(aResultArr[1]) === -1) {
								aTempAccountGrps.push(aResultArr[1]);
								var obj = aAccountGroup.find(function (objItem) {
									return objItem.key === aResultArr[1];
								});
								aAccountGrps.push(obj);
							}
							
						}
						if(oItem.value === "DA_MDM_ADMIN"){
							aRoles.push("admin");
							that._getAllUsers(1);
						}
					});
					this.getModel("userManagementModel").setProperty('/role', aRoles);
					this.getModel("userManagementModel").setProperty('/accountGroups', aAccountGrps);
					this.getModel("userManagementModel").refresh(true);
					var oObjParam = {
						url: "/murphyCustom/mdm/usermgmt-service/users/user/update",
						hasPayload: true,
						type: 'POST',
						data: {
							"userDetails": [{
								"email_id": oUserModelResources.emails[0].value,
								"firstname": oUserModelResources.name.givenName,
								"lastname": oUserModelResources.name.familyName,
								"display_name": oUserModelResources.name.givenName + " " + oUserModelResources.name.familyName,
								"external_id": oUserModelResources.id,
								"created_by": 1,
								"modified_by": 1,
								"roles": aTotalRoles,
								"is_active": true,
								"additional_param1" : oUserModelResources.userName
							}]
						}

					};
					this.serviceCall.handleServiceRequest(oObjParam).then(function (oDataResp) {
						this.getModel("userManagementModel").setProperty('/data', oDataResp.result.userDetails[0]);
					}.bind(this));
				}.bind(this));
			}.bind(this));
			this.getModel("reasonDropdownfilterModel").setProperty("/reasonFlag", "");
		},
		
		_getAllUsers: function(sStartIndex){
		var objParamFirstCall = {
					url: "/MurphyCloudIdPDest/service/scim/Users?startIndex=" + sStartIndex,
					hasPayload: false,
					type: 'GET'
				};
				this.serviceCall.handleServiceRequest(objParamFirstCall).then(function (oDataResp) {
					var aUsers = this.getModel("userManagementModel").getProperty('/users');
					this.getModel("userManagementModel").setProperty('/users', aUsers.concat(oDataResp.Resources));
					var nRemainingUser = oDataResp.totalResults - (sStartIndex + 100);
					if(nRemainingUser > 0) {
						this._getAllUsers(sStartIndex + 100);
					}
				}.bind(this), function (oError) {
					this.setBusy(false);
					// MessageToast.show("Error In Getting All Users");
				}.bind(this));
		},

		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});