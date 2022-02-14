sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController",
	"sap/ui/core/Fragment",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
], function (BaseController, Fragment, ServiceCall, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.searchvendor", {
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
			var oParameters = {
				sPageNo: 1
			};
			this.handleGo(oParameters);
			this.getOwnerComponent().getModel("SearchVendorModel").setSizeLimit(1000);
			this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[0]);
		},
		//	visible="{= ${userManagementModel>/role}.indexOf('req')!== -1 ? 'true' : 'false' }"

		handleERPVendorVisible: function (aValue) {
			if (aValue.indexOf('req') !== -1) {
				return true;
			} else {
				return false;
			}
		},
		handleGo: function (oParameters) {
			if (this.getOwnerComponent().getModel("SearchVendorModel")) {
				this.getOwnerComponent().getModel("SearchVendorModel").setProperty("/leftEnabled", false);
				this.getOwnerComponent().getModel("SearchVendorModel").setProperty("/rightEnabled", false);
			} else {
				this.getView().getModel("SearchVendorModel").setProperty("/leftEnabled", false);
				this.getView().getModel("SearchVendorModel").setProperty("/rightEnabled", false);
			}
			var sPage;
			if (!oParameters.sPageNo) {
				sPage = 1;
			} else {
				sPage = oParameters.sPageNo
			}
			// delete oParameters.sPageNo;
			var oSearchVendorModel = this.getOwnerComponent().getModel("SearchVendorModel");
			// var oFilterParameters = {};
			// if (Object.keys(oParameters).length === 0) {
			// 	oFilterParameters = {
			// 		"vnd_lfa1": {}
			// 	};
			// } else {
			// 	oFilterParameters = oParameters;
			// }
			var objParam = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {}
			};
			if (oParameters.entitySearchType && oParameters.entitySearchType === "GET_BY_VENDOR_FILTERS") {
				objParam.data = oParameters;
			} else {
				objParam.data = {
					"entitySearchType": "GET_ALL_VENDOR",
					"entityType": "VENDOR",
					"currentPage": sPage,
					"parentDTO": {
						"customData": {
							"vnd_lfa1": {}
						}
					}
				};
			}

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				var aResultDataArr = oData.result.vendorDTOs;
				oData.result.totalRecords = aResultDataArr[0].totalCount;

				if (aResultDataArr[0].currentPage === 1) {
					var aPageJson = [];
					for (var i = 0; i < aResultDataArr[0].totalPageCount; i++) {
						aPageJson.push({
							key: i + 1,
							text: i + 1
						});
					}
					oSearchVendorModel.setProperty("/PageData", aPageJson);
				}
				oSearchVendorModel.setProperty("/selectedPageKey", aResultDataArr[0].currentPage);

				if (aResultDataArr[0].totalPageCount > aResultDataArr[0].currentPage) {
					oSearchVendorModel.setProperty("/rightEnabled", true);
				} else {
					oSearchVendorModel.setProperty("/rightEnabled", false);
				}
				if (aResultDataArr[0].currentPage > 1) {
					oSearchVendorModel.setProperty("/leftEnabled", true);
				} else {
					oSearchVendorModel.setProperty("/leftEnabled", false);
				}
				// aResultDataArr.forEach(oItem => {
				// 	var sValue = (oItem.listOfCRs && oItem.listOfCRs.length > 0) ? oItem.listOfCRs[0]["change_request_due_date"] : oItem.listOfCRs;
				// 	var sResultDate = '';
				// 	var sDate = '';
				// 	var sPendingRequest = '';
				// 	if (sValue) {
				// 		sDate = sValue.split('T')[0];
				// 		sResultDate = new Date(sDate);
				// 		sResultDate = sResultDate.getDate() + '-' + (sResultDate.getMonth() + 1) + '-' + sResultDate.getFullYear();
				// 		if (new Date(sDate).getTime() > new Date().getTime()) {
				// 			sPendingRequest = "Pending";
				// 		} else {
				// 			sPendingRequest = "OverDue"
				// 		}
				// 	}
				// 	oItem.overDueDate = sResultDate;
				// 	oItem.pendingRequest = sPendingRequest;
				// })

				oSearchVendorModel.setProperty("/searchAllModelData", oData.result);
			});
		},

		onSearchVendor: function () {
			var sVMSelectedKey = this.getView().byId('searchVendorVM').getSelectionKey();
			var sName1 = this.getView().byId('fbName1').getValue();
			var sName2 = this.getView().byId('fbName2').getValue();
			var sCity = this.getView().byId('fbCity').getValue();
			var sStreet = this.getView().byId('fbStreet').getValue();
			var sBPId = this.getView().byId('fbBPId').getValue();
			var sBankAcc = this.getView().byId('fbBankAcc').getValue();
			var sBankKey = this.getView().byId('fbBankKey').getValue();
			var sBankStreet = this.getView().byId('fbBankStreet').getValue();
			var oFilterBarParam = {
				"entitySearchType": "GET_BY_VENDOR_FILTERS",
				"entityType": "VENDOR",
				"vendorSearchDTO": {},
				"currentPage": 1
			};
			if (sVMSelectedKey === "*standard*") {
				oFilterBarParam.vendorSearchDTO = {
					"vendorSearchType": "SEARCH_BY_ADDRESS",
					"name1": sName1,
					"name2": sName2,
					"city": sCity,
					"street": sStreet
				};
			} else if (sVMSelectedKey === "bankDetails") {
				oFilterBarParam.vendorSearchDTO = {
					"vendorSearchType": "SEARCH_BY_BANK_DETAILS",
					"lifnr": sBPId,
					"bankAccount": sBankAcc,
					"bankKey": sBankKey,
					"bankStreet": sBankStreet
				};

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
				var oChangeReq = {
					"genData": {
						"desc": "",
						"priority": "",
						"dueDate": "",
						"reason": "30001",
						"status": "",
						"createdBy": "",
						"currWrkItem": "",
						"timeCreation": "",
						"dateCreation": "",
						"change_request_id": "50001"
					}
				};
				this.getOwnerComponent().getModel("CreateVendorModel").setProperty('/changeReq', oChangeReq);
				this._createCREntityID();
			}
			if (sKey === "changeRequestId" || sKey === "changeRequestId-Mass") {
				this.nPageNo = 1;
				this.handleGetAllChangeRequests(this.nPageNo);
				this.handleChangeRequestStatistics();
			}
			if (sKey === "srchVnd") {
				var oParameters = {
					sPageNo: 1
				};
				this.handleGo(oParameters);
			}
			// if (sKey === "changeRequestMassId" || sKey === "changeRequestAllId") {
			// 	sap.ui.getCore().byId("changeRequestPage").setSelectedKey(sKey + "Icon");
			// }
		},

		onSearchVendorTableUpdated: function (oEvent) {

		},

		onPressChngReqTile: function (oEvent) {

		},

		handlePendingRequest: function (sValue) {
			var sStatus = 'None';
			if (sValue) {
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
			var oChangeReq = {
				"genData": {
					"desc": "",
					"priority": "",
					"dueDate": "",
					"reason": "30001",
					"status": "",
					"createdBy": "",
					"currWrkItem": "",
					"timeCreation": "",
					"dateCreation": "",
					"change_request_id": "50001"
				}
			};
			this.getOwnerComponent().getModel("CreateVendorModel").setProperty('/changeReq', oChangeReq);

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

		handleDescription: function (value1, value2, value3, value4) {
			var sText = '';
			sText = value1 ? sText + value1 : sText;
			sText = value2 ? sText + ' ' + value2 : sText;
			sText = value3 ? sText + ' ' + value3 : sText;
			sText = value4 ? sText + ' ' + value4 : sText;
			return sText;
		},

		onSelectSearchAllVendorPage: function () {
			var oSelectedPage = this.getView().getModel("SearchVendorModel").getProperty("/selectedPageKey");
			var oParameters = {
				sPageNo: oSelectedPage
			};
			this.handleGo(oParameters);
		},

		onSelectSearchAllVendorPageLeft: function () {
			var oSelectedPage = this.getView().getModel("SearchVendorModel").getProperty("/selectedPageKey");
			var oParameters = {
				sPageNo: oSelectedPage - 1
			};
			this.handleGo(oParameters);
		},

		onSelectSearchAllVendorPageRight: function () {
			var oSelectedPage = this.getView().getModel("SearchVendorModel").getProperty("/selectedPageKey");
			var oParameters = {
				sPageNo: oSelectedPage + 1
			};
			this.handleGo(oParameters);
		},

		onClickVendor: function (oEvent) {
			this.getView().setBusy(true);
			var sVendorSelected = oEvent.getSource().getText();
			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {
					"entitySearchType": "GET_BY_VENDOR_ID",
					"entityType": "VENDOR",
					"parentDTO": {
						"customData": {
							"vnd_lfa1": {
								"lifnr": sVendorSelected
							}
						}
					}
				}

			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				if (oDataResp.result.parentDTO.customData) {
					var respPayload = Object.keys(oDataResp.result.parentDTO.customData);
					var addCompanyCodeRows = [];
					for (var i = 0; i < respPayload.length; i++) {
						switch (respPayload[i]) {
						case "business_entity":
							if (oDataResp.result.parentDTO.customData.business_entity) {
								this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", oDataResp.result.parentDTO.customData
									.business_entity.entity_id);
							}
							break;
						case "vnd_lfa1":
							if (oDataResp.result.parentDTO.customData.vnd_lfa1) {
								this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1",
									oDataResp.result.parentDTO.customData.vnd_lfa1);
								var sDTAMS = oDataResp.result.parentDTO.customData.vnd_lfa1.DTAMS;
								oDataResp.result.parentDTO.customData.vnd_lfa1.DTAMS = sDTAMS ? sDTAMS : " ";
								var sSearchTerm = oDataResp.result.parentDTO.customData.vnd_lfa1.MCOD1;
								oDataResp.result.parentDTO.customData.vnd_lfa1.MCOD1 = sSearchTerm ? sSearchTerm : oDataResp.result.parentDTO.customData.vnd_lfa1.SORTL;
							}
							break;
						case "vnd_lfb1":
							if (oDataResp.result.parentDTO.customData.vnd_lfb1) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1",
									oDataResp.result.parentDTO.customData.vnd_lfb1);

								var lfb1ObjKey = Object.keys(oDataResp.result.parentDTO.customData.vnd_lfb1);
								for (var j = 0; j < lfb1ObjKey.length; j++) {
									var sKey = lfb1ObjKey[j];
									oDataResp.result.parentDTO.customData.vnd_lfb1[sKey].ZAHLS = oDataResp.result.parentDTO.customData.vnd_lfb1[sKey].ZAHLS ===
										'' ?
										" " : oDataResp.result.parentDTO.customData.vnd_lfb1[sKey].ZAHLS;
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfb1 = oDataResp.result.parentDTO.customData.vnd_lfb1[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfb1": oDataResp.result.parentDTO.customData.vnd_lfb1[sKey],
											"lfbw": {}
										});
									}

								}

								var sSelectedKey = oDataResp.result.parentDTO.customData.vnd_lfb1.vnd_lfb1_1.bukrs;
								var aPaymentMethodData = this.getOwnerComponent().getModel('CreateVendorModel').getProperty('/paymentMethodData');
								var obj = aPaymentMethodData.find(oItem => Number(oItem.compCode) === Number(sSelectedKey));
								if (obj && obj.payMethod) {
									this.getOwnerComponent().getModel('CreateVendorModel').setProperty('/paymentMehtodBinding', obj.payMethod);
									this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
								}
							}
							break;
						case "vnd_lfbk":
							if (oDataResp.result.parentDTO.customData.vnd_lfbk) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1",
									oDataResp.result.parentDTO.customData.vnd_lfbk.vnd_lfbk_1);
							}

							break;
						case "vnd_lfm1":
							if (oDataResp.result.parentDTO.customData.vnd_lfm1) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1",
									oDataResp.result.parentDTO.customData.vnd_lfm1.vnd_lfm1_1);
							}

							break;
						case "vnd_lfbw":
							if (oDataResp.result.parentDTO.customData.vnd_lfbw) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw",
									oDataResp.result.parentDTO.customData.vnd_lfbw);

								var lfbwObjKey = Object.keys(oDataResp.result.parentDTO.customData.vnd_lfbw);
								for (var j = 0; j < lfbwObjKey.length; j++) {
									var sKey = lfbwObjKey[j];
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfbw = oDataResp.result.parentDTO.customData.vnd_lfbw[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfbw": oDataResp.result.parentDTO.customData.vnd_lfbw[sKey],
											"lfb1": {}
										});
									}

								}
							}

							break;
						case "vnd_knvk":
							if (oDataResp.result.parentDTO.customData.vnd_knvk) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1",
									oDataResp.result.parentDTO.customData.vnd_knvk.vnd_knvk_1);
							}

							break;
						case "gen_adrc":
							if (oDataResp.result.parentDTO.customData.gen_adrc) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1",
									oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1);
							}else{
								oDataResp.result.parentDTO.customData.gen_adrc = {"gen_adrc_1":{}};
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oDataResp.result.parentDTO.customData.vnd_lfa1.NAME1;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.sort1 = oDataResp.result.parentDTO.customData.vnd_lfa1.SORTL;
								var sHouseNo = oDataResp.result.parentDTO.customData.vnd_lfa1.STRAS.split(' ')[0];
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.house_num1 = sHouseNo;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.street = oDataResp.result.parentDTO.customData.vnd_lfa1.STRAS.slice(sHouseNo.length);
								oDataResp.parentDTO.customData.gen_adrc.gen_adrc_1.region = oDataResp.parentDTO.customData.vnd_lfa1.REGIO;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.langu = 'E';
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.po_box = oDataResp.result.parentDTO.customData.vnd_lfa1.PSTLZ;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.post_code1 = oDataResp.result.parentDTO.customData.vnd_lfa1.PSTLZ;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.city1 = oDataResp.result.parentDTO.customData.vnd_lfa1.ORT01;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.country = oDataResp.result.parentDTO.customData.vnd_lfa1.LAND1;
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_adrc",
									oDataResp.result.parentDTO.customData.gen_adrc);
							}
							break;
						case "gen_bnka":
							if (oDataResp.result.parentDTO.customData.gen_bnka) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1",
									oDataResp.result.parentDTO.customData.gen_bnka.gen_bnka_1);
							}

							break;
						case "pra_bp_ad":
							if (oDataResp.result.parentDTO.customData.pra_bp_ad) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1",
									oDataResp.result.parentDTO.customData.pra_bp_ad.pra_bp_ad_1);
							}

							break;
						case "pra_bp_vend_esc":
							if (oDataResp.result.parentDTO.customData.pra_bp_vend_esc) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1",
									oDataResp.result.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1);
							}

							break;
						case "pra_bp_cust_md":
							if (oDataResp.result.parentDTO.customData.pra_bp_cust_md) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1",
									oDataResp.result.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1);
							}

							break;
						case "pra_bp_vend_md":
							if (oDataResp.result.parentDTO.customData.pra_bp_vend_md) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1",
									oDataResp.result.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1);

							}
							break;
						}
					}
					this.getView().getModel("CreateVendorModel").setProperty(
						"/addCompanyCodeRows", addCompanyCodeRows);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/adrnr",
					// 	oDataResp.result.parentDTO.customData.entity_id);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/addrnumber",
					// 	oDataResp.result.parentDTO.customData.entity_id);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/date_from",
					// 	oDate.getFullYear() + "-" + (oDate.getMonth() + 1 < 10 ? ("0" + (oDate.getMonth() + 1)) : oDate.getMonth() + 1) + "-" + oDate.getDate()
					// );
					this.getAllCommentsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));
					this.getView().byId("pageContainer").to(this.createId("erpVendorPreview"));
					this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
					this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", true);
					this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
					this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
					var titleID = this.getView().byId("idTitle");
					titleID.setText(this.oBundle.getText("createERPVendorView-title"));
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Not able to fetch the Vendor Details, Please try after some time");
			}.bind(this));

		},

		onDeleteVendorPress: function (oEvent) {

			var oSelctedObj = oEvent.getSource().getParent().getParent()._oOpenBy.getBindingContext("SearchVendorModel").getObject().customVendorLFA1DTO;
			var sEntityID = oSelctedObj.entity_id;
			var sVendorNo = oSelctedObj.lifnr;
			sEntityID = 513
			MessageBox.confirm("Are you sure, you wan to delete Vendor " + oSelctedObj.lifnr + " - " + oSelctedObj.name1 + " ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oEvt) {
					if (oEvt === "OK") {
						this.getView().setBusy(true);
						this.navigateTOVendorPages(sVendorNo, 'DELETE');
						/*var objParam = {
							url: "/murphyCustom/mdm/entity-service/entities/entity/delete",
							type: 'POST',
							hasPayload: true,
							data: {
								"entityType": "VENDOR",
								"parentDTO": {
									"customData": {
										"business_entity": {
											"entity_id": sEntityID
										}
									}
								}
							}
						};
						this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
							this.getView().setBusy(false);
							MessageToast.show("Vendor got deleted successfully");
						}.bind(this), function (oError) {
							this.getView().setBusy(false);
							MessageToast.show("Delete Action Failed, try after some time");
						}.bind(this))*/
					}
				}.bind(this)
			});

		},

		onBlockVendorPress: function (oEvent) {
			var oSelctedObj = oEvent.getSource().getParent().getParent()._oOpenBy.getBindingContext("SearchVendorModel").getObject().customVendorLFA1DTO;
			var sEntityID = oSelctedObj.entity_id;
			var sVendorNo = oSelctedObj.lifnr;
			sEntityID = 513
			MessageBox.confirm("Are you sure, you wan to block Vendor " + oSelctedObj.lifnr + " - " + oSelctedObj.name1 + " ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oEvt) {
					if (oEvt === "OK") {
						this.getView().setBusy(true);
						this.navigateTOVendorPages(sVendorNo, 'BLOCK');
						/*var objParam = {
							url: "/murphyCustom/mdm/entity-service/entities/entity/block",
							type: 'POST',
							hasPayload: true,
							data: {
								"entityType": "VENDOR",
								"parentDTO": {
									"customData": {
										"business_entity": {
											"entity_id": sEntityID
										}
									}
								}
							}
						};
						this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
							this.getView().setBusy(false);
							MessageToast.show("Vendor got blocked successfully");
						}.bind(this), function (oError) {
							this.getView().setBusy(false);
							MessageToast.show("Block Action Failed, try after some time");
						}.bind(this))*/
					}
				}.bind(this)
			});
		},

		onEditVendorPress: function (oEvent) {
			this.getView().setBusy(true);
			var oSelctedObj = oEvent.getSource().getParent().getParent()._oOpenBy.getBindingContext("SearchVendorModel").getObject().customVendorLFA1DTO;
			var sVendorNo = oSelctedObj.lifnr;
			this.navigateTOVendorPages(sVendorNo, 'EDIT');
			/*	var objParamCreate = {
					url: "/murphyCustom/mdm/entity-service/entities/entity/get",
					type: 'POST',
					hasPayload: true,
					data: {
						"entitySearchType": "GET_BY_VENDOR_ID",
						"entityType": "VENDOR",
						"parentDTO": {
							"customData": {
								"vnd_lfa1": {
									"lifnr": sVendorNo
								}
							}
						}
					}

				};
				this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result.parentDTO.customData) {
						var respPayload = Object.keys(oDataResp.result.parentDTO.customData);
						var addCompanyCodeRows = [];
						for (var i = 0; i < respPayload.length; i++) {
							switch (respPayload[i]) {
								// case "business_entity":
								// 	this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", oDataResp.result.parentDTO.customData
								// 		.business_entity.entity_id);
								// 	break;
							case "vnd_lfa1":
								this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1",
									oDataResp.result.parentDTO.customData.vnd_lfa1);
								break;
							case "vnd_lfb1":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1",
									oDataResp.result.parentDTO.customData.vnd_lfb1);

								var lfb1ObjKey = Object.keys(oDataResp.result.parentDTO.customData.vnd_lfb1);
								for (var j = 0; j < lfb1ObjKey.length; j++) {
									var sKey = lfb1ObjKey[j];
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfb1 = oDataResp.result.parentDTO.customData.vnd_lfb1[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfb1": oDataResp.result.parentDTO.customData.vnd_lfb1[sKey],
											"lfbw": {}
										});
									}

								}

								var sSelectedKey = oDataResp.result.parentDTO.customData.vnd_lfb1.vnd_lfb1_1.bukrs;
								var aPaymentMethodData = this.getOwnerComponent().getModel('CreateVendorModel').getProperty('/paymentMethodData');
								var obj = aPaymentMethodData.find(oItem => Number(oItem.compCode) === Number(sSelectedKey));
								if (obj && obj.payMethod) {
									this.getOwnerComponent().getModel('CreateVendorModel').setProperty('/paymentMehtodBinding', obj.payMethod);
									this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
								}
								break;
							case "vnd_lfbk":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1",
									oDataResp.result.parentDTO.customData.vnd_lfbk.vnd_lfbk_1);
								break;
							case "vnd_lfm1":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1",
									oDataResp.result.parentDTO.customData.vnd_lfm1.vnd_lfm1_1);
								break;
							case "vnd_lfbw":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw",
									oDataResp.result.parentDTO.customData.vnd_lfbw);

								var lfbwObjKey = Object.keys(oDataResp.result.parentDTO.customData.vnd_lfbw);
								for (var j = 0; j < lfbwObjKey.length; j++) {
									var sKey = lfbwObjKey[j];
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfbw = oDataResp.result.parentDTO.customData.vnd_lfbw[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfbw": oDataResp.result.parentDTO.customData.vnd_lfbw[sKey],
											"lfb1": {}
										});
									}

								}
								break;
							case "vnd_knvk":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1",
									oDataResp.result.parentDTO.customData.vnd_knvk.vnd_knvk_1);
								break;
							case "gen_adrc":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1",
									oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1);
								break;
							case "gen_bnka":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1",
									oDataResp.result.parentDTO.customData.gen_bnka.gen_bnka_1);
								break;
							case "pra_bp_ad":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1",
									oDataResp.result.parentDTO.customData.pra_bp_ad.pra_bp_ad_1);
								break;
							case "pra_bp_vend_esc":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1",
									oDataResp.result.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1);
								break;
							case "pra_bp_cust_md":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1",
									oDataResp.result.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1);
								break;
							case "pra_bp_vend_md":
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1",
									oDataResp.result.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1);
								break;
							}
						}

						this._createCREntityID({
							"vndDetails": true
						});

						this.getView().byId("pageContainer").to(this.createId("createERPVendorView"));
						this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
						this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
						this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
						this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
						var titleID = this.getView().byId("idTitle");
						titleID.setText(this.oBundle.getText("createERPVendorView-title"));
					}
				}.bind(this), function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Not able to fetch the Vendor Details, Please try after some time");
				}.bind(this));*/
		},

		navigateTOVendorPages: function (sVendorNo, operation) {
			var sOperationKey = "";
			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {
					"entitySearchType": "GET_BY_VENDOR_ID",
					"entityType": "VENDOR",
					"parentDTO": {
						"customData": {
							"vnd_lfa1": {
								"lifnr": sVendorNo
							}
						}
					}
				}

			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				if (oDataResp.result.parentDTO.customData) {
					var respPayload = Object.keys(oDataResp.result.parentDTO.customData);
					var addCompanyCodeRows = [];
					for (var i = 0; i < respPayload.length; i++) {
						switch (respPayload[i]) {
							// case "business_entity":
							// 	this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", oDataResp.result.parentDTO.customData
							// 		.business_entity.entity_id);
							// 	break;
						case "vnd_lfa1":
							if (oDataResp.result.parentDTO.customData.vnd_lfa1) {
								this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1",
									oDataResp.result.parentDTO.customData.vnd_lfa1);
								var sDTAMS = oDataResp.result.parentDTO.customData.vnd_lfa1.DTAMS;
								oDataResp.result.parentDTO.customData.vnd_lfa1.DTAMS = sDTAMS ? sDTAMS : " ";
								var sSearchTerm = oDataResp.result.parentDTO.customData.vnd_lfa1.MCOD1;
								oDataResp.result.parentDTO.customData.vnd_lfa1.MCOD1 = sSearchTerm ? sSearchTerm : oDataResp.result.parentDTO.customData.vnd_lfa1.SORTL;
								// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/lifnr", "");
							}
							break;
						case "vnd_lfb1":
							if (oDataResp.result.parentDTO.customData.vnd_lfb1) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1",
									oDataResp.result.parentDTO.customData.vnd_lfb1);

								var lfb1ObjKey = Object.keys(oDataResp.result.parentDTO.customData.vnd_lfb1);
								for (var j = 0; j < lfb1ObjKey.length; j++) {
									var sKey = lfb1ObjKey[j];
									oDataResp.result.parentDTO.customData.vnd_lfb1[sKey].ZAHLS = oDataResp.result.parentDTO.customData.vnd_lfb1[sKey].ZAHLS ===
										'' ?
										" " : oDataResp.result.parentDTO.customData.vnd_lfb1[sKey].ZAHLS;
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfb1 = oDataResp.result.parentDTO.customData.vnd_lfb1[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfb1": oDataResp.result.parentDTO.customData.vnd_lfb1[sKey],
											"lfbw": {}
										});
									}

								}

								var sSelectedKey = oDataResp.result.parentDTO.customData.vnd_lfb1.vnd_lfb1_1.bukrs;
								var aPaymentMethodData = this.getOwnerComponent().getModel('CreateVendorModel').getProperty('/paymentMethodData');
								var obj = aPaymentMethodData.find(oItem => Number(oItem.compCode) === Number(sSelectedKey));
								if (obj && obj.payMethod) {
									this.getOwnerComponent().getModel('CreateVendorModel').setProperty('/paymentMehtodBinding', obj.payMethod);
									this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
								}
							}
							break;
						case "vnd_lfbk":
							if (oDataResp.result.parentDTO.customData.vnd_lfbk) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk",
									oDataResp.result.parentDTO.customData.vnd_lfbk);
							}
							break;
						case "vnd_lfm1":
							if (oDataResp.result.parentDTO.customData.vnd_lfm1) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1",
									oDataResp.result.parentDTO.customData.vnd_lfm1);
							}
							break;
						case "vnd_lfbw":
							if (oDataResp.result.parentDTO.customData.vnd_lfbw) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw",
									oDataResp.result.parentDTO.customData.vnd_lfbw);

								var lfbwObjKey = Object.keys(oDataResp.result.parentDTO.customData.vnd_lfbw);
								for (var j = 0; j < lfbwObjKey.length; j++) {
									var sKey = lfbwObjKey[j];
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfbw = oDataResp.result.parentDTO.customData.vnd_lfbw[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfbw": oDataResp.result.parentDTO.customData.vnd_lfbw[sKey],
											"lfb1": {}
										});
									}

								}
							}
							break;
						case "vnd_knvk":
							if (oDataResp.result.parentDTO.customData.vnd_knvk) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_knvk",
									oDataResp.result.parentDTO.customData.vnd_knvk);
							}
							break;
						case "gen_adrc":
							if (oDataResp.result.parentDTO.customData.gen_adrc) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_adrc",
									oDataResp.result.parentDTO.customData.gen_adrc);
							}else{
								oDataResp.result.parentDTO.customData.gen_adrc = {"gen_adrc_1":{}};
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oDataResp.result.parentDTO.customData.vnd_lfa1.NAME1;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.sort1 = oDataResp.result.parentDTO.customData.vnd_lfa1.SORTL;
								var sHouseNo = oDataResp.result.parentDTO.customData.vnd_lfa1.STRAS.split(' ')[0];
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.house_num1 = sHouseNo;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.street = oDataResp.result.parentDTO.customData.vnd_lfa1.STRAS.slice(sHouseNo.length);
								oDataResp.parentDTO.customData.gen_adrc.gen_adrc_1.region = oDataResp.parentDTO.customData.vnd_lfa1.REGIO;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.langu = 'E';
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.po_box = oDataResp.result.parentDTO.customData.vnd_lfa1.PSTLZ;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.post_code1 = oDataResp.result.parentDTO.customData.vnd_lfa1.PSTLZ;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.city1 = oDataResp.result.parentDTO.customData.vnd_lfa1.ORT01;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.country = oDataResp.result.parentDTO.customData.vnd_lfa1.LAND1;
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_adrc",
									oDataResp.result.parentDTO.customData.gen_adrc);
							}
							break;
						case "gen_bnka":
							if (oDataResp.result.parentDTO.customData.gen_bnka) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/gen_bnka",
									oDataResp.result.parentDTO.customData.gen_bnka);
							}
							break;
						case "pra_bp_ad":
							if (oDataResp.result.parentDTO.customData.pra_bp_ad) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad",
									oDataResp.result.parentDTO.customData.pra_bp_ad);
							}
							break;
						case "pra_bp_vend_esc":
							if (oDataResp.result.parentDTO.customData.pra_bp_vend_esc) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc",
									oDataResp.result.parentDTO.customData.pra_bp_vend_esc);
							}
							break;
						case "pra_bp_cust_md":
							if (oDataResp.result.parentDTO.customData.pra_bp_cust_md) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md",
									oDataResp.result.parentDTO.customData.pra_bp_cust_md);
							}
							break;
						case "pra_bp_vend_md":
							if (oDataResp.result.parentDTO.customData.pra_bp_vend_md) {
								this.getView().getModel("CreateVendorModel").setProperty(
									"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md",
									oDataResp.result.parentDTO.customData.pra_bp_vend_md);
							}
							break;
						}
					}
					this.getView().getModel("CreateVendorModel").setProperty(
						"/addCompanyCodeRows", addCompanyCodeRows);
					this._createCREntityID({
						"vndDetails": true
					});
					switch (operation) {
					case 'EDIT':
						sOperationKey = '50002';
						break;
					case 'BLOCK':
						sOperationKey = '50004';
						break;
					case 'DELETE':
						sOperationKey = '50005';
						break;
					case 'COPY':
						this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/lifnr",
							"");
						break;
					}

					this.getOwnerComponent().getModel("CreateVendorModel").setProperty('/changeReq/genData/change_request_id', sOperationKey);
					if (operation === "DELETE" || operation === "BLOCK") {
						this.getView().byId("pageContainer").to(this.createId("erpVendorPreview"));
						/*var sID = this.getView().getParent().getPages().find(function (e) {
						return e.getId().indexOf("erpVendorPreview") !== -1;
					}).getId();
					this.getView().getParent().to(sID);*/
						this.getView().getModel("CreateVendorModel").setProperty("/preview", true);
						this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
						this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
					} else if (operation === "EDIT" || operation === "COPY") {
						this.getView().byId("pageContainer").to(this.createId("createERPVendorView"));
						this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
						this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
						this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
					}

					this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
					var titleID = this.getView().byId("idTitle");
					titleID.setText(this.oBundle.getText("createERPVendorView-title"));
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Not able to fetch the Vendor Details, Please try after some time");
			}.bind(this));
		},

		onPressCopyVendor: function () {
				var oTable = this.getView().byId("searchVendorTable");
				if (!oTable.getSelectedItem()) {
					MessageToast.show("Please Select a vendor.");
				} else {
					this.getView().setBusy(true);
					var oVendorData = oTable.getSelectedItem().getBindingContext("SearchVendorModel").getObject();
					var sVendorNo = oVendorData.customVendorLFA1DTO.lifnr;
					this.navigateTOVendorPages(sVendorNo, 'COPY');
				}
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