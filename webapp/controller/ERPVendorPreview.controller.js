sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController",
	"sap/m/MessageToast",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	"sap/m/StandardListItem",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/TextArea",
	"sap/m/Text",
	"sap/m/VBox"
], function (BaseController, MessageToast, ServiceCall, StandardListItem, Dialog, List, Button, ButtonType, TextArea, Text, VBox) {
	"use strict";

	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.ERPVendorPreview", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ERPVendorPreview
		 */
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onEditClick: function () {
			if (this.getView().getModel("CreateVendorModel").getData().vndDetails) {
				this._createCREntityID({
					"vndDetails": true
				});
				this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
				this.getView().getModel("CreateVendorModel").setProperty("/vndEdit", true);
			}

			this.getOwnerComponent().getModel("CreateVendorModel").setProperty('/changeReq/genData/change_request_id', 50002);
			this.getOwnerComponent().getModel("CreateVendorModel").refresh(true);
			var sID = this.getView().getParent().getPages().find(function (e) {
				return e.getId().indexOf("createERPVendorView") !== -1;
			}).getId();
			this.getView().getParent().to(sID);
		},

		onSubmitClick: function (oEvent) {
			// var objParamSubmit = {
			// 	url: "/murphyCustom/mdm/workflow-service/workflows/tasks/task/action",
			// 	type: 'POST',
			// 	hasPayload: true,
			// 	data: {
			// 		"operationType": "CREATE",
			// 		"changeRequestDTO": {
			// 			"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId")
			// 		}
			// 	}
			// };
			// this.serviceCall.handleServiceRequest(objParamSubmit).then(function (oDataResp) {
			// 	// this.getView().setBusy(false);
			// 	// MessageToast.show("Submission Successful");
			// 	this._CreateCRID();
			// 	this.getView().getModel("CreateVendorModel").setProperty("/missingFields", []);
			// 	this.getView().getModel("CreateVendorModel").refresh(true);
			// 	this.getView().byId("idCreateVendorSubmitErrors").setVisible(false);
			// }.bind(this), function (oError) {
			// 	this.getView().setBusy(false);
			// 	//	var sError = "";
			// 	var aError = [];
			// 	if (oError.responseJSON.result&& oError.responseJSON.result.workboxCreateTaskResponseDTO && oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item &&
			// 		oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item.length > 0) {
			// 		oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item.forEach(function (oItem) {
			// 			//	sError = sError + oItem.MESSAGE + "\n" ;
			// 			aError.push({
			// 				ErrorMessage: oItem.MESSAGE
			// 			});
			// 		});
			// 	} else if (!oError.responseJSON.result) {
			// 		aError.push({
			// 			ErrorMessage: oError.responseJSON.error
			// 		});
			// 	}
			// 	this.getView().getModel("CreateVendorModel").setProperty("/missingFields", aError);
			// 	this.getView().getModel("CreateVendorModel").refresh(true);
			// 	this.getView().byId("idCreateVendorSubmitErrors").setVisible(true);
			// 	this.handleErrorLogs();
			// 	//oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item
			// 	//	MessageToast.show(sError,{ duration: 6000,width: "100%"});
			// }.bind(this));
			if (this.onERPCheckClick()) {
				this.getView().setBusy(true);
				this._createTask();
			}
		},

		_CreateCRID: function () {
			var objParamSubmit = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/create",
				type: 'POST',
				hasPayload: true,
				data: {
					"parentCrDTOs": [{
						"crDTO": {
							"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
							"change_request_by": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
							"entity_type_id": "41001",
							"change_request_type_id": 1,
							"change_request_priority_id": 1,
							"change_request_due_date": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/dueDate"),
							"change_request_desc": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/desc"),
							"change_request_reason_id": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/reason")
						}
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamSubmit).then(function (oDataResp) {
				// this.getView().setBusy(false);
				MessageToast.show("Change Request ID - " + oDataResp.result.parentCrDTOs[0].crDTO.change_request_id + " Generated.");
				this._EntityIDDraftFalse();
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error in CR Create Call");
			}.bind(this));
		},

		_EntityIDDraftFalse: function () {
			var objParamSubmit = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/create",
				type: 'POST',
				hasPayload: true,
				data: {
					"entityType": "VENDOR",
					"parentDTO": {
						"customData": {
							"business_entity": {
								"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
								"is_draft": "false"
							}
						}
					}
				}

			};
			this.serviceCall.handleServiceRequest(objParamSubmit).then(function (oDataResp) {
				this.getView().setBusy(false);
				//	MessageToast.show("Draft - false Successful");
				this.onAllChangeReqClick();
				// this.nPageNo = 1;
				// this.handleGetAllChangeRequests(this.nPageNo);
				// this.handleChangeRequestStatistics();
				// var sID = this.getView().getParent().getPages().find(function (e) {
				// 	return e.getId().indexOf("changeRequestId") !== -1;
				// }).getId();
				// this.getView().getParent().to(sID);

				// this.getView().getParent().getParent().getSideContent().setSelectedItem(this.getView().getParent().getParent().getSideContent().getItem()
				// 	.getItems()[2]);
				// var titleID = this.getView().getParent().getParent().getHeader().getContent()[2];
				// titleID.setText(this.oBundle.getText("changeRequestId-title"));

				// this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
				// this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
				// this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error in Make draft false Call");
			}.bind(this));
		},

		onErrorLog: function (oEvent) {
			this.handleErrorLogs();
		},

		onAllChangeReqClick: function () {
			// this.nPageNo = 1;
			// this.handleGetAllChangeRequests(this.nPageNo);
			// this.handleChangeRequestStatistics();
			if (!this.getOwnerComponent().getModel("changeRequestGetAllModel").getProperty("/oChangeReq")) {
				this.nPageNo = 1;
				this.handleGetAllChangeRequests(this.nPageNo);
				this.handleChangeRequestStatistics();
			}
			var sID = this.getView().getParent().getPages().find(function (e) {
				return e.getId().indexOf("changeRequestId") !== -1;
			}).getId();
			this.getView().getParent().to(sID);

			this.getView().getParent().getParent().getSideContent().setSelectedItem(this.getView().getParent().getParent().getSideContent().getItem()
				.getItems()[2]);
			var titleID = this.getView().getParent().getParent().getHeader().getContent()[2];
			titleID.setText(this.oBundle.getText("changeRequestId-title"));

			this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
			this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndEdit", false);
		},

		onBackToVendorListClick: function () {
			var sID = this.getView().getParent().getPages().find(function (e) {
				return e.getId().indexOf("srchVnd") !== -1;
			}).getId();
			this.getView().getParent().to(sID);

			this.getView().getParent().getParent().getSideContent().setSelectedItem(this.getView().getParent().getParent().getSideContent().getItem()
				.getItems()[0]);
			var titleID = this.getView().getParent().getParent().getHeader().getContent()[0];
			titleID.setText(this.oBundle.getText("srchVnd-title"));

			this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
			this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndEdit", false);
		},

		onSelectCompanyCodeItem: function (oEvent) {
			var oData = oEvent.getParameter("listItem").getBindingContext("CreateVendorModel").getObject();
			this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData", oData);

		},
		onSelectERPCheckBox: function (oEvent) {
			var sKey = oEvent.getSource().getCustomData()[0].getKey();
			var sValue = oEvent.getSource().getCustomData()[0].getValue();
			if (sValue && sValue !== "addComp") {
				if (oEvent.getParameter("selected")) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData" + sKey, "X");
				} else {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData" + sKey, "");
				}
			} else if (sValue && sValue === "addComp") {
				if (oEvent.getParameter("selected")) {
					this.getView().getModel("CreateVendorModel").setProperty(sKey, "X");
				} else {
					this.getView().getModel("CreateVendorModel").setProperty(sKey, "");
				}
			}
		},
		onERPSaveClick1: function (oEvent) {
			var oModel = this.getView().getModel("CreateVendorModel");
			var oData = oModel.getProperty("/createCRVendorData/formData");

		},
		onERPSaveClick: function (oEvent) {
			this.getView().setBusy(true);
			var oModel = this.getView().getModel("CreateVendorModel");
			var oData = oModel.getProperty("/createCRVendorData/formData");

			var objFormationLfb1 = {};
			var objFormationLfbw = {};
			for (var i = 1; i <= oModel.getProperty("/addCompanyCodeRows").length; i++) {
				oModel.setProperty("/addCompanyCodeRows/" + (i - 1) + "/lfb1/entity_id", oData.parentDTO.customData.vnd_lfa1.entity_id);
				oModel.setProperty("/addCompanyCodeRows/" + (i - 1) + "/lfbw/entity_id", oData.parentDTO.customData.vnd_lfa1.entity_id);
				objFormationLfb1["vnd_lfb1_" + i] = oModel.getProperty("/addCompanyCodeRows")[i - 1]["lfb1"];
				objFormationLfbw["vnd_lfbw_" + i] = oModel.getProperty("/addCompanyCodeRows")[i - 1]["lfbw"];
			}
			oData.parentDTO.customData.vnd_lfb1 = objFormationLfb1;
			oData.parentDTO.customData.vnd_lfbw = objFormationLfbw;

			var sEntityId = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId");
			if (!oData.parentDTO.customData.vnd_lfa1.lifnr) {
				var objParamFirstCall = {
					url: "/murphyCustom/mdm/entity-service/entities/entity/update",
					hasPayload: true,
					type: 'POST',
					data: {
						"entityType": "VENDOR",
						"parentDTO": {
							"customData": {
								"vnd_lfa1": {
									"entity_id": sEntityId,
									"KTOKK": oData.parentDTO.customData.vnd_lfa1.KTOKK
								}
							}
						}
					}

				};
				this.serviceCall.handleServiceRequest(objParamFirstCall).then(function (oDataResp) {
					if (oDataResp.result) {
						var sLifnr = oDataResp.result.vendorDTOs[0].customVendorLFA1DTO.lifnr;
						oData.parentDTO.customData.vnd_lfa1.lifnr = sLifnr;
						oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.LIFNR = sLifnr;

						oData.parentDTO.customData.vnd_knvk.vnd_knvk_1.lifnr = sLifnr;
						// oData.parentDTO.customData.vnd_lfb1.vnd_lfb1_1.lifnr = sLifnr;
						var sKeylfb1 = Object.keys(oData.parentDTO.customData.vnd_lfb1);
						for (var i = 0; i < sKeylfb1.length; i++) {
							oData.parentDTO.customData.vnd_lfb1[sKeylfb1[i]]["lifnr"] = sLifnr;
						}

						var sKeylfbw = Object.keys(oData.parentDTO.customData.vnd_lfbw);
						for (var i = 0; i < sKeylfbw.length; i++) {
							oData.parentDTO.customData.vnd_lfbw[sKeylfbw[i]]["lifnr"] = sLifnr;
						}

						// oData.parentDTO.customData.vnd_lfbw.vnd_lfbw_1.lifnr = sLifnr;

						oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.lifnr = sLifnr;
						oData.parentDTO.customData.pra_bp_ad.pra_bp_ad_1.vendid = sLifnr;
						oData.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1.vendid = sLifnr;
						oData.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1.vendid = sLifnr;
						oData.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1.custid = sLifnr;
						oData.parentDTO.customData.gen_adrc.gen_adrc_1.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
						oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
						oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
						this._handleSaveWithLifnr(oData);

					}
				}.bind(this), function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Error In Generating Lifnr");
				}.bind(this));
			} else {
				var sLIFNR = oData.parentDTO.customData.vnd_lfa1.lifnr;
				if (oData.parentDTO.customData.vnd_lfbk && oData.parentDTO.customData.vnd_lfbk.hasOwnProperty('vnd_lfbk_1')) {
					oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.LIFNR = sLIFNR;
				}
				if (oData.parentDTO.customData.vnd_knvk && oData.parentDTO.customData.vnd_knvk.hasOwnProperty('vnd_knvk_1')) {
					oData.parentDTO.customData.vnd_knvk.vnd_knvk_1.lifnr = sLIFNR;
				}

				var sKeylfb1 = Object.keys(oData.parentDTO.customData.vnd_lfb1);
				for (var k = 0; k < sKeylfb1.length; k++) {
					oData.parentDTO.customData.vnd_lfb1[sKeylfb1[k]]["lifnr"] = sLIFNR;
				}
				var sKeylfbw = Object.keys(oData.parentDTO.customData.vnd_lfbw);
				for (var j = 0; j < sKeylfbw.length; j++) {
					oData.parentDTO.customData.vnd_lfbw[sKeylfbw[j]]["lifnr"] = sLIFNR;
				}
				if (oData.parentDTO.customData.vnd_lfm1 && oData.parentDTO.customData.vnd_lfm1.hasOwnProperty('vnd_lfm1_1')) {
					oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.lifnr = sLIFNR;
				}
				if (oData.parentDTO.customData.pra_bp_ad && oData.parentDTO.customData.pra_bp_ad.hasOwnProperty('pra_bp_ad_1')) {
					oData.parentDTO.customData.pra_bp_ad.pra_bp_ad_1.vendid = sLIFNR;
				}
				if (oData.parentDTO.customData.pra_bp_vend_esc && oData.parentDTO.customData.pra_bp_vend_esc.hasOwnProperty('pra_bp_vend_esc_1')) {
					oData.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1.vendid = sLIFNR;
				}
				if (oData.parentDTO.customData.pra_bp_vend_md && oData.parentDTO.customData.pra_bp_vend_md.hasOwnProperty('pra_bp_vend_md_1')) {
					oData.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1.vendid = sLIFNR;
				}
				if (oData.parentDTO.customData.pra_bp_cust_md && oData.parentDTO.customData.pra_bp_cust_md.hasOwnProperty('pra_bp_cust_md_1')) {
					oData.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1.custid = sLIFNR;
				}
				if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.hasOwnProperty('gen_adrc_1')) {
					oData.parentDTO.customData.gen_adrc.gen_adrc_1.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
				}
				if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.hasOwnProperty('gen_adrc_2')) {
					oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
					oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
				}

				this._handleSaveWithLifnr(oData);

			}

		},

		_handleSaveWithLifnr: function (oData) {
			//	var sResoanId = this.getOwnerComponent().getModel("CreateVendorModel").getProperty('/changeReq/genData/change_request_id');
			oData = Object.assign({}, oData);
			/*	if (sResoanId === "50005" || sResoanId === "50004") {
					delete oData.parentDTO.customData.pra_bp_ad;
					delete oData.parentDTO.customData.pra_bp_vend_esc;
					delete oData.parentDTO.customData.pra_bp_cust_md;
					delete oData.parentDTO.customData.pra_bp_vend_md;
					delete oData.parentDTO.customData.gen_adrc;
					delete oData.parentDTO.customData.vnd_knvk;
					delete oData.parentDTO.customData.vnd_lfb1;
					delete oData.parentDTO.customData.vnd_lfbk;
					delete oData.parentDTO.customData.vnd_lfbw;
					delete oData.parentDTO.customData.vnd_lfm1;
					delete oData.parentDTO.customData.gen_bnka;

				} else {*/
			if (oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === undefined || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 ===
				"" || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === null) {
				oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oData.parentDTO.customData.vnd_lfa1.Name1;
			}
			if (oData.parentDTO.customData.vnd_lfa1.KTOKK !== "JVPR" && oData.parentDTO.customData.vnd_lfa1.KTOKK !== "OGPR") {
				delete oData.parentDTO.customData.pra_bp_ad;
				delete oData.parentDTO.customData.pra_bp_vend_esc;
				delete oData.parentDTO.customData.pra_bp_cust_md;
				delete oData.parentDTO.customData.pra_bp_vend_md;
				delete oData.parentDTO.customData.gen_adrc.gen_adrc_2;

			}

			oData.parentDTO.customData.gen_bnka.gen_bnka_1.banka = "";
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.ort01 = "";
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.stars = "";
			oData.parentDTO.customData.gen_adrc.gen_adrc_1.region = oData.parentDTO.customData.vnd_lfa1.REGIO;
			var aLFB1Objs = Object.keys(oData.parentDTO.customData.vnd_lfb1);
			aLFB1Objs.forEach(function (key, index) {
				var sProerty = 'vnd_lfbw_' + (index + 1);
				oData.parentDTO.customData.vnd_lfbw[sProerty].bukrs = oData.parentDTO.customData.vnd_lfb1[key].bukrs;
			});
			//}

			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/update",
				hasPayload: true,
				data: oData,
				type: 'POST'
			};

			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				this.getView().byId('idERPSAVECLICK').setVisible(false);
				if (oDataResp.result) {
					MessageToast.show("Successfuly Saved");
					this.getView().getModel("CreateVendorModel").setProperty("/createCRDDResp", oDataResp.result);
					this.getView().byId("idCreateVendorSubmit").setVisible(true);

					var sID = this.getView().getParent().getPages().find(function (e) {
						return e.getId().indexOf("erpVendorPreview") !== -1;
					}).getId();
					this.getView().getParent().to(sID);
					this.getView().getModel("CreateVendorModel").setProperty("/preview", true);
					this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
					this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
					this.getView().getModel("CreateVendorModel").setProperty("/vndEdit", false);
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error In Creating Draft Version");
			}.bind(this));
		},

		_createTask: function () {
			var oData = {
				"workboxCreateTaskRequestDTO": {
					"listOfProcesssAttributes": [{
						"customAttributeTemplateDto": [{
							"processName": "STANDARD",
							"key": "description",
							"label": "Description",
							"processType": "",
							"isEditable": true,
							"isActive": true,
							"isMandatory": true,
							"isEdited": 2,
							"attrDes": "",
							"value": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/desc"),
							"dataType": null,
							"valueList": null,
							"attachmentType": null,
							"attachmentSize": null,
							"attachmentName": null,
							"attachmentId": null,
							"dataTypeKey": 0,
							"dropDownType": null,
							"url": null,
							"taskId": null,
							"origin": null,
							"attributePath": null,
							"dependantOn": null,
							"rowNumber": 0,
							"tableAttributes": null,
							"tableContents": null,
							"isDeleted": false,
							"isRunTime": null,
							"isVisible": null
						}, {
							"processName": "MDGVendorWorkflow",
							"key": "6b70i8618f269",
							"label": "CountryCode",
							"processType": null,
							"isEditable": true,
							"isActive": true,
							"isMandatory": true,
							"isEdited": 2,
							"attrDes": "Country Code",
							"value": this.getView().getModel("CreateVendorModel").getProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1"),
							"dataType": "INPUT",
							"valueList": [],
							"attachmentType": null,
							"attachmentSize": null,
							"attachmentName": null,
							"attachmentId": null,
							"dataTypeKey": 0,
							"dropDownType": null,
							"url": null,
							"taskId": null,
							"origin": "Process",
							"attributePath": null,
							"dependantOn": null,
							"rowNumber": 0,
							"tableAttributes": null,
							"tableContents": null,
							"isDeleted": false,
							"isRunTime": null,
							"isVisible": null
						}, {
							"processName": "MDGVendorWorkflow",
							"key": "4b64h3j5jjij",
							"label": "AccountGroup",
							"processType": null,
							"isEditable": true,
							"isActive": true,
							"isMandatory": true,
							"isEdited": 2,
							"attrDes": "Account Group",
							"value": this.getView().getModel("CreateVendorModel").getProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK"),
							"dataType": "INPUT",
							"valueList": [],
							"attachmentType": null,
							"attachmentSize": null,
							"attachmentName": null,
							"attachmentId": null,
							"dataTypeKey": 0,
							"dropDownType": null,
							"url": null,
							"taskId": null,
							"origin": "Process",
							"attributePath": null,
							"dependantOn": null,
							"rowNumber": 0,
							"tableAttributes": null,
							"tableContents": null,
							"isDeleted": false,
							"isRunTime": false,
							"isVisible": null
						}, {
							"processName": "MDGVendorWorkflow",
							"key": "a8a1154f4ggda",
							"label": "Data Domain",
							"processType": null,
							"isEditable": true,
							"isActive": true,
							"isMandatory": true,
							"isEdited": 2,
							"attrDes": "Data Domain",
							"value": "VENDOR",
							"dataType": "INPUT",
							"valueList": [],
							"attachmentType": null,
							"attachmentSize": null,
							"attachmentName": null,
							"attachmentId": null,
							"dataTypeKey": 0,
							"dropDownType": null,
							"url": null,
							"taskId": null,
							"origin": "Process",
							"attributePath": null,
							"dependantOn": null,
							"rowNumber": 0,
							"tableAttributes": null,
							"tableContents": null,
							"isDeleted": false,
							"isRunTime": false,
							"isVisible": null
						}, {
							"processName": "MDGVendorWorkflow",
							"key": "6f83h9g3fe04h",
							"label": "CountryCodeAccountGroup",
							"processType": null,
							"isEditable": true,
							"isActive": true,
							"isMandatory": true,
							"isEdited": 2,
							"attrDes": "CountryCodeAccountGroup",
							"value": this.getView().getModel("CreateVendorModel").getProperty(
									"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1") + "+" + this.getView().getModel("CreateVendorModel")
								.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK"),
							"dataType": "INPUT",
							"valueList": [],
							"attachmentType": null,
							"attachmentSize": null,
							"attachmentName": null,
							"attachmentId": null,
							"dataTypeKey": 0,
							"dropDownType": null,
							"url": null,
							"taskId": null,
							"origin": "Process",
							"attributePath": null,
							"dependantOn": null,
							"rowNumber": 0,
							"tableAttributes": null,
							"tableContents": null,
							"isDeleted": false,
							"isRunTime": false,
							"isVisible": null
						}],
						"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
					}],
					"type": "Multiple Instance",
					"resourceid": null,
					"actionType": "Submit",
					"processName": "MDGVendorWorkflow",
					"processId": null,
					"isEdited": 2,
					"requestId": null,
					"responseMessage": null,
					"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
					"emailId": this.getView().getModel("userManagementModel").getProperty("/data/email_id"),
					"userName": this.getView().getModel("userManagementModel").getProperty("/data/firstname") + " " + this.getView().getModel(
						"userManagementModel").getProperty(
						"/data/lastname")
				},
				"changeRequestDTO": {
					"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
					"change_request_by": {
						"user_id": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
					},
					"modified_by": {
						"user_id": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
					},
					"entity_type_id": "41001",
					"change_request_type_id": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/change_request_id"),
					"change_request_priority_id": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/priority"),
					"change_request_due_date": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/dueDate"),
					"change_request_desc": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/desc"),
					"change_request_reason_id": this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/reason")
				}
			};
			var objParamCreate = {
				url: "/murphyCustom/mdm/workflow-service/workflows/tasks/task/create",
				hasPayload: true,
				data: oData,
				type: 'POST'
			};

			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				if (oDataResp.result && oDataResp.result.changeRequestDTO) {
					MessageToast.show("Change Request ID - " + oDataResp.result.changeRequestDTO.change_request_id + " Generated.");
					this._EntityIDDraftFalse();
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error In Creating Workflow Task");
			}.bind(this));
		},

		_claimTask: function (sTaskID, sAction, sReason) {
			this.getView().setBusy(true);
			var oData = {
				"workboxTaskActionRequestDTO": {
					"isChatBot": true,
					// "userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
					"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
					"userDisplay": this.getView().getModel("userManagementModel").getProperty("/data/firstname"),
					"task": [{
						"instanceId": sTaskID,
						"origin": "Ad-hoc",
						"actionType": "Claim",
						"isAdmin": false,
						"platform": "Web",
						"signatureVerified": "NO",
						"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
							// "userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
					}]
				}
			};
			var objParamCreate = {
				url: "/murphyCustom/mdm/workflow-service/workflows/tasks/task/claim",
				hasPayload: true,
				data: oData,
				type: 'POST'
			};

			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				// this.getView().setBusy(false);
				if (oDataResp.result) {
					this._ApproveRejectTask(sTaskID, sAction, sReason);
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error In Claiming Workflow Task");
			}.bind(this));
		},

		_ApproveRejectTask: function (sTaskID, sAction, sReason) {
			var sUrl = "";

			var oData = {
				"workboxTaskActionRequestDTO": {
					"isChatBot": true,
					// "userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
					"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
					"userDisplay": this.getView().getModel("userManagementModel").getProperty("/data/firstname"),
					"task": [{
						"instanceId": sTaskID,
						"origin": "Ad-hoc",
						"actionType": sAction,
						"isAdmin": false,
						"platform": "Web",
						"signatureVerified": "NO",
						"comment": sAction + " task",
						"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
							// "userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
					}]
				}
			};
			if (sAction === "Approve") {
				sUrl = "approve";
				oData.changeRequestDTO = {
					"entity_id": this.getView().getModel("CreateVendorModel").getProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/entity_id")
				};
			} else {
				sUrl = "reject";
			}
			var objParamCreate = {
				url: "/murphyCustom/mdm/workflow-service/workflows/tasks/task/" + sUrl,
				hasPayload: true,
				data: oData,
				type: 'POST'
			};

			this.serviceCall.handleServiceRequest(objParamCreate).then(
				function (oDataResp) {
					if (oDataResp.result) {
						this.nPageNo = 1;
						this.handleGetAllChangeRequests(this.nPageNo);
						this.handleChangeRequestStatistics();
						this.onAllChangeReqClick();
					}

					//Adding rejection reason to comment section
					if (sAction.toLowerCase() === "reject") {
						this.onAddComment({
							sEntityID: this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
							comment: sReason,
							sControlID: "previewCRCommentBoxId"
						});
					}

					this.getView().setBusy(false);
					var sMessage = sAction.toLowerCase() === "approve" ? "Approved" : "Rejected";
					MessageToast.show(sMessage);
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					var aError = [];
					if (oError.responseJSON.result && oError.responseJSON.result.workboxCreateTaskResponseDTO && oError.responseJSON.result.workboxCreateTaskResponseDTO
						.response.EXT_MESSAGES.MESSAGES.item &&
						oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item.length > 0) {
						oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item.forEach(function (oItem) {
							//	sError = sError + oItem.MESSAGE + "\n" ;
							aError.push({
								ErrorMessage: oItem.MESSAGE
							});
						});
					} else if (!oError.responseJSON.result) {
						aError.push({
							ErrorMessage: oError.responseJSON.error
						});
					}
					this.getView().getModel("CreateVendorModel").setProperty("/missingFields", aError);
					this.getView().getModel("CreateVendorModel").refresh(true);
					this.getView().byId("idCreateVendorSubmitErrors").setVisible(true);
					this.handleErrorLogs();
					MessageToast.show("Error In " + sAction + " Workflow Task");
				}.bind(this));
		},

		onApproveClick: function () {
			var sWorkFlowID = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/workflowID");
			this._claimTask(sWorkFlowID, "Approve", "");
		},

		onRejectClick: function () {
			if (!this.oRejectDailog) {
				this.oRejectDailog = new Dialog({
					title: "Confirmation",
					width: "40%",
					type: "Message",
					state: "Warning",
					content: [
						new sap.m.VBox({
							items: [
								new Text({
									text: "Please enter reject reason and click 'Ok' to reject:"
								}),
								new TextArea({
									id: "idRejectReason",
									width: "100%"
								})
							]
						})
					],
					beginButton: new Button({
						text: "Ok",
						press: function () {
							var sRejectReason = sap.ui.getCore().byId("idRejectReason").getValue();
							if (sRejectReason) {
								var sWorkFlowID = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/workflowID");
								this._claimTask(sWorkFlowID, "Reject", sRejectReason);
								this.oRejectDailog.close();
							} else {
								MessageToast.show("Please provide reject reason to continoue");
							}
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oRejectDailog.close();
						}.bind(this)
					}),
					afterClose: function () {
						sap.ui.getCore().byId("idRejectReason").setValue("");
					}
				});
			}

			this.getView().addDependent(this.oRejectDailog);
			this.oRejectDailog.open();
		},

		onERPCheckClick: function () {
			var aMandFields = [{
					"id": "idERPPriority",
					"Name": "Priority",
					"fieldMapping": "/changeReq/genData/priority",
					"key": "priority",
					"panelMapping": "Change Requests"
				}, {
					"id": "idERPVendorPreviewReason",
					"Name": "Reason",
					"fieldMapping": "/changeReq/genData/reason",
					"key": "reason",
					"panelMapping": "Change Requests"
				}

			];
			var aEmptyFields = [];
			var oData = this.getView().getModel("CreateVendorModel");
			var oController = this;
			aMandFields.forEach(function (oItem) {
				var oControl = oController.getView().byId(oItem.id);
				var sValueState = "None";
				if ((oData.getProperty(oItem.fieldMapping) === undefined || oData.getProperty(oItem.fieldMapping) === "" ||
						oData.getProperty(oItem.fieldMapping) === null)) {
					aEmptyFields.push(oItem);
					sValueState = "Error";
				} else {
					if (oControl.getValueState() === sap.ui.core.ValueState.Error || oControl.getValueState() === "Error") {
						sValueState = "Success";
					}
				}
				oControl.setValueState(sValueState);
			});

			this.getView().getModel("CreateVendorModel").setProperty("/missingFields", aEmptyFields);
			if (aEmptyFields.length) {
				if (!this.oDefaultDialog) {
					this.oDefaultDialog = new Dialog({
						title: "Missing Fields",
						content: new List({
							items: {
								path: "CreateVendorModel>/missingFields",
								template: new StandardListItem({
									title: {
										parts: ['CreateVendorModel>Name', 'CreateVendorModel>panelMapping', 'CreateVendorModel>section'],
										formatter: this.formatCheckErrorMessage
									}
									//title: "{= ${CreateVendorModel>section} ? 'No ${CreateVendorModel>section} is maintained in ${CreateVendorModel>section} Section.'  : '${CreateVendorModel>Name} field is missing in ${CreateVendorModel>panelMapping} Section.'}"

								})
							}
						}),
						// title: "{CreateVendorModel>Name}" + " field is missing in " + "{CreateVendorModel>panelMapping}" + " Section"

						endButton: new Button({
							text: "Close",
							press: function () {
								this.oDefaultDialog.close();
							}.bind(this)
						})
					});
					// to get access to the controller's model
					this.getView().addDependent(this.oDefaultDialog);
				}
				this.oDefaultDialog.open();
				return false;
			} else {
				MessageToast.show("Validation Successful");
				return true;
			}
		},
		formatCheckErrorMessage: function (sName, sPanel, sSection) {
			var sMsg = "";
			if (!sSection) {
				sMsg = sName + " field is missing in " + sPanel + " Section";
			} else {
				sMsg = "No " + sSection + " is maintained in " + sSection + " table";
			}
			return sMsg;
		},

		onAddCommentCRPreview: function () {
			this.onAddComment({
				sEntityID: this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
				comment: this.getView().byId("previewCRCommentBoxId").getValue(),
				sControlID: "previewCRCommentBoxId"
			});
		},

		onChnageLogSwitchERPPreview: function (oEvent) {
			var oList = this.getView().byId("idAuditLogListERPPreview");
			oList.setVisible(oEvent.getParameter("state"));
		},

		onDetailsPurOrg: function (oEvent) {
			var oLfm1 = oEvent.getSource().getBindingContext("vndLfm1").getObject(),
				oLfm1Model = this.getView().getModel("vndLfm1"),
				oLfm1Data = oLfm1Model.getData();

			oLfm1Data.lfm1 = Object.assign({}, oLfm1);
			oLfm1Model.setData(oLfm1Data);
		},

		onSelectPraAddress: function (oEvent) {
			var oAddress = Object.assign({}, oEvent.getParameter("listItem").getBindingContext("praAddressModel").getObject());
			this.getView().getModel("praAddressModel").setProperty("/address", oAddress);
		}

	});

});