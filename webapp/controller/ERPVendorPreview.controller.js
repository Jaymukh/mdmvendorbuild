sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController",
	"sap/m/MessageToast",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall"
], function (BaseController, MessageToast, ServiceCall) {
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
			var sID = this.getView().getParent().getPages().find(function (e) {
				return e.getId().indexOf("createERPVendorView") !== -1;
			}).getId();
			this.getView().getParent().to(sID);
		},

		onSubmitClick: function (oEvent) {
			this.getView().setBusy(true);
			var objParamSubmit = {
				url: "/murphyCustom/mdm/workflow-service/workflows/tasks/task/action",
				type: 'POST',
				hasPayload: true,
				data: {
					"changeRequestDTO": {
						"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId")
					}
				}
			};
			this.serviceCall.handleServiceRequest(objParamSubmit).then(function (oDataResp) {
				// this.getView().setBusy(false);
				// MessageToast.show("Submission Successful");
				this._CreateCRID();
				this.getView().getModel("CreateVendorModel").setProperty("/missingFields", []);
				this.getView().getModel("CreateVendorModel").refresh(true);
				this.getView().byId("idCreateVendorSubmitErrors").setVisible(false);
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				//	var sError = "";
				var aError = [];
				if (oError.responseJSON.result && oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item &&
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
				//oError.responseJSON.result.workboxCreateTaskResponseDTO.response.EXT_MESSAGES.MESSAGES.item
				//	MessageToast.show(sError,{ duration: 6000,width: "100%"});
			}.bind(this));

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
							"change_request_by": 1,
							"entity_type_id": 1,
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
			this.nPageNo = 1;
			this.handleGetAllChangeRequests(this.nPageNo);
			this.handleChangeRequestStatistics();
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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ERPVendorPreview
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ERPVendorPreview
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ERPVendorPreview
		 */
		//	onExit: function() {
		//
		//	}

	});

});