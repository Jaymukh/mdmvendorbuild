sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	"sap/m/MessageToast"
], function (Controller, Fragment, ServiceCall, MessageToast) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.searchvendor", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.searchvendor
		 */
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oToolPage = this.byId("toolPage");
			this._setToggleButtonTooltip(true);
			oToolPage.setSideExpanded(false);
			this.handleGo();
		},

		handleGo: function (oParameters = {}) {
			var oSearchVendorModel = this.getOwnerComponent().getModel("SearchVendorModel");
			var oFilterParameters = {};
			if (Object.keys(oParameters).length === 0) {
				oFilterParameters = {
					"vnd_lfa1": {}
				};
			} else {
				oFilterParameters = oParameters;
			}
			var objParam = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {
					"entitySearchType": "GET_ALL_VENDOR",
					"entityType": "VENDOR",
					"currentPage": 1,
					"parentDTO": {
						"customData": oFilterParameters
					}
				}
			};

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				var aResultDataArr = oData.result.vendorDTOs;
				oData.result.totalRecords = aResultDataArr.length;
				aResultDataArr.forEach(oItem => {
					var sValue = (oItem.listOfCRs && oItem.listOfCRs.length > 0) ? oItem.listOfCRs[0]["change_request_due_date"] : oItem.listOfCRs;
					var sResultDate = '';
					var sDate = '';
					var sPendingRequest = '';
					if (sValue) {
						sDate = sValue.split('T')[0];
						sResultDate = new Date(sDate);
						sResultDate = sResultDate.getDate() + '-' + (sResultDate.getMonth() + 1) + '-' + sResultDate.getFullYear();
						if (new Date(sDate).getTime() > new Date().getTime()) {
							sPendingRequest = "Pending";
						} else {
							sPendingRequest = "OverDue"
						}
					}
					oItem.overDueDate = sResultDate;
					oItem.pendingRequest = sPendingRequest;
				})

				oSearchVendorModel.setData(oData.result);
			});
		},

		onSearch: function () {
			var sVMSelectedKey = this.getView().byId('searchVendorVM').getSelectionKey();
			var sName1 = this.getView().byId('fbName1').getValue();
			var sName2 = this.getView().byId('fbName2').getValue();
			var sCity = this.getView().byId('fbCity').getValue();
			var sStreet = this.getView().byId('fbStreet').getValue();
			var sBPId = this.getView().byId('fbBPId').getValue();
			var sBankAcc = this.getView().byId('fbBankAcc').getValue();
			var sBankKey = this.getView().byId('fbBankKey').getValue();
			var sBankStreet = this.getView().byId('fbBankStreet').getValue();
			var oFilterBarParam = {};
			if (sVMSelectedKey === "*standard*") {
				oFilterBarParam.vnd_lfa1 = {};
				if (sName1) {
					oFilterBarParam['vnd_lfa1']['NAME1'] = sName1;
				}
				if (sName2) {
					oFilterBarParam['vnd_lfa1']['NAME2'] = sName2;
				}
				if (sCity) {
					oFilterBarParam['vnd_lfa1']['ORT01'] = sCity;
				}
				if (sStreet) {
					oFilterBarParam['vnd_lfa1']['STREET'] = sStreet;
				}
			} else if (sVMSelectedKey === "bankDetails") {
				oFilterBarParam.vnd_lfbk = {};
				if (sBPId) {
					oFilterBarParam['vnd_lfbk']['LIFNR'] = sBPId;
				}
				if (sBankAcc) {
					oFilterBarParam['vnd_lfbk']['BKONT'] = sBankAcc;
				}
				if (sBankKey) {
					oFilterBarParam['vnd_lfbk']['BANKL'] = sBankKey;
				}
				if (sBankStreet) {
					oFilterBarParam['vnd_lfbk']['STRAS'] = sBankStreet;
				}
			}
			this.handleGo(oFilterBarParam);
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId("sideNavigationToggleButton");
			if (bLarge) {
				oToggleButton.setTooltip("Large Size Navigation");
			} else {
				oToggleButton.setTooltip("Small Size Navigation");
			}
		},

		onSideItemSelect: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey();
			var titleID = this.getView().byId("idTitle");
			titleID.setText(this.oBundle.getText(sKey + "-title"));
			this.byId("pageContainer").to(this.getView().createId(sKey));
			if (sKey === "createERPVendorView") {
				this._createCREntityID();
			}
			// if (sKey === "changeRequestMassId" || sKey === "changeRequestAllId") {
			// 	sap.ui.getCore().byId("changeRequestPage").setSelectedKey(sKey + "Icon");
			// }
		},

		_createCREntityID: function () {
			var objParam = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/create",
				hasPayload: true,
				type: 'POST',
				data: {
					"entityType": "VENDOR",
					"parentDTO": {
						"customData": {
							"business_entity": {
								"entity_type_id": "1",
								"created_by": "1",
								"modified_by": "1",
								"is_draft": "1"
							}
						}
					}
				}
			};
			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				var oDate = new Date();
				// var p2 = Object.assign({}, this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData_Copy"));
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData", Object.assign({}, p2));
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfb1/vnd_lfb1_1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbw/vnd_lfbw_1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1", {});
				// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1", {});

				this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", oData.result.vendorDTOs[0].customVendorBusDTO
					.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1/vnd_lfb1_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw/vnd_lfbw_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/addrnumber",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/date_from",
					oDate.getFullYear() + "-" + (oDate.getMonth() + 1 < 10 ? ("0" + (oDate.getMonth() + 1)) : oDate.getMonth() + 1) + "-" + oDate.getDate()
				);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1/entity_id",
					oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

				// this.getView().getModel("CreateVendorModel").setProperty(
				// 	"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1/entity_id",
				// 	oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				// this.getView().getModel("CreateVendorModel").setProperty(
				// 	"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/entity_id",
				// 	oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				// this.getView().getModel("CreateVendorModel").setProperty(
				// 	"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1/entity_id",
				// 	oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
				this.getView().getModel("CreateVendorModel").refresh();
				// console.log(oData);
			}.bind(this), function (oData) {
				this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", "");
				this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData", {});
				MessageToast.show("Entity ID not created. Please try after some time");
			}.bind(this));
		},

		onSearchVendorTableUpdated: function (oEvent) {

		},

		onPressChngReqTile: function (oEvent) {

		},

		handlePendingRequest: function (sValue) {
			var sStatus = '';
			switch (sValue.toLowerCase()) {
			case "pending":
				sStatus = "Warning";
				break;
			case "overdue":
				sStatus = "Error";
				break;
			default:
				sStatus = "None";
			}
			return sStatus;
		},

		handleOverFlowButton: function (oEvent) {
			var oBindingObj = oEvent.getSource().getBindingContext('SearchVendorModel').getObject();
			this.getOwnerComponent().getModel('SearchVendorPopupModel').setData(oBindingObj);
			var oButton = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.vendor.murphymdmvendor.fragments.OverflowPopUp",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}

			this._pPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},

		handleCreateERPVendor: function (oEvent) {
			this.getView().byId("pageContainer").to(this.createId("createERPVendorView"));
			this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
			var titleID = this.getView().byId("idTitle");
			titleID.setText(this.oBundle.getText("createERPVendorView-title"));
			this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
			this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
			this._createCREntityID();
		},

		handleSelect: function (oEvent) {
			var sSelectedKey = oEvent.getSource().getSelectionKey();
			sSelectedKey = sSelectedKey === "*standard*" ? "addressData" : sSelectedKey;
			var aFilterGroupItems = this.getView().byId("filterBar").getFilterGroupItems();
			aFilterGroupItems.forEach(function (oItem) {
				oItem.setVisibleInFilterBar(oItem.getGroupName() === sSelectedKey ? true : false);
			});

		},

		onSearchVnderLinkPress: function (oEvent) {
			// var sID = this.getView().getParent().getPages().find(function (e) {
			// 	return e.getId().indexOf("erpVendorPreview") !== -1;
			// }).getId();
			// this.getView().getParent().to(sID);
			this.getView().byId("pageContainer").to(this.createId("erpVendorPreview"));
			this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
			var titleID = this.getView().byId("idTitle");
			titleID.setText(this.oBundle.getText("createERPVendorView-title"));
			this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", true);
			this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
		},

		handleDescription: function (value1, value2, value3, value4) {
			var sText = '';
			sText = value1 ? sText + value1 : sText;
			sText = value2 ? sText + ' ' + value2 : sText;
			sText = value3 ? sText + ' ' + value3 : sText;
			sText = value4 ? sText + ' ' + value4 : sText;
			return sText;
		}

		// onSaveClick : function(oEvent){
		// 	this.getView().byId("pageContainer").to(this.createId("erpVendorPreview"));
		// },
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.searchvendor
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.searchvendor
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.searchvendor
		 */
		//	onExit: function() {
		//
		//	}

	});

});