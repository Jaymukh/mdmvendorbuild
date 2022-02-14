sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/library"
], function (BaseController, ServiceCall, MessageToast, Fragment, CoreLibrary) {
	"use strict";
	var ValueState = CoreLibrary.ValueState;
	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.ChangeRequest", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
			this.oController = this;
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ChangeRequest
		 */
		onInit: function () {
			// this.handleGetAllChangeRequests();
			// this.handleChangeRequestStatistics();
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		handlePendingRequest: function (sValue) {
			var sStatus = "None";
			switch (sValue.toLowerCase()) {
			case 'changes to be executed':
				sStatus = "Warning";
				break;
			case 'overdue':
				sStatus = "Error";
				break;

			}
			return sStatus;
		},

		handleCRSideMenu: function (oEvent) {
			var bPressed = oEvent.getParameter('pressed');
			var oDynamicSideContent = this.getView().byId('changeReqSideContentId');
			oEvent.getSource().setIcon(bPressed ? "sap-icon://arrow-right" : "sap-icon://arrow-left");
			oDynamicSideContent.setShowSideContent(bPressed);

		},

		handleMassCRSideMenu: function (oEvent) {
			var bPressed = oEvent.getParameter('pressed');
			var oDynamicSideContent = this.getView().byId('changeReqSideContentId2');
			oEvent.getSource().setIcon(bPressed ? "sap-icon://arrow-right" : "sap-icon://arrow-left");
			oDynamicSideContent.setShowSideContent(bPressed);
		},

		onChangeReqLinkPress: function (oEvent) {
			this.getView().setBusy(true);
			var oChangeRequest = oEvent.getSource().getBindingContext("changeRequestGetAllModel").getObject(),
				sEntityID = oChangeRequest.crDTO.entity_id,
				sWorkflowTaskID = oChangeRequest.crDTO.workflow_task_id,
				sChangeRequestId = oChangeRequest.crDTO.change_request_id;

			this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/workflowID", sWorkflowTaskID);
			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {
					"entitySearchType": "GET_BY_ENTITY_ID",
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
			var oParamChangeReq = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/page",
				type: 'POST',
				hasPayload: true,
				data: {
					"crSearchType": "GET_BY_CR_ID",
					"parentCrDTOs": [{
						"crDTO": {
							"change_request_id": sChangeRequestId
						}
					}],
					"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
				}
			};

			this.serviceCall.handleServiceRequest(oParamChangeReq).then(function (oData) {
				var oChangeReq = oData.result.parentCrDTOs[0].crDTO;
				var oVendorModel = this.getView().getModel("CreateVendorModel");
				oVendorModel.setProperty("/changeReq/genData/priority", oChangeReq.change_request_priority_id);
				oVendorModel.setProperty("/changeReq/genData/change_request_id", oChangeReq.change_request_type_id);
				oVendorModel.setProperty("/changeReq/genData/reason", oChangeReq.change_request_reason_id);
				oVendorModel.setProperty("/changeReq/genData/change_request_by", oChangeReq.change_request_by);
				oVendorModel.setProperty("/changeReq/genData/modified_by", oChangeReq.modified_by);
				/*/changeReq/genData/status
				/changeReq/genData/currWrkItem*/
				oVendorModel.setProperty("/changeReq/genData/createdBy", oChangeReq.modified_by.created_by);
				if (oChangeReq.change_request_due_date) {
					var sDueDate = oChangeReq.change_request_due_date.substring(0, 10).replaceAll("-", "");
					oVendorModel.setProperty("/changeReq/genData/dueDate", sDueDate);
				}

				if (oChangeReq.change_request_date) {
					var sReqDate = oChangeReq.change_request_date.substring(0, 10).replaceAll("-", "");
					var sReqTime = oChangeReq.change_request_date.substring(11, 16);
					oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/date_from", sReqDate);
					oVendorModel.setProperty("/changeReq/genData/timeCreation", sReqTime);
				}
				oVendorModel.setProperty("/changeReq/genData/desc", oChangeReq.change_request_desc);
				oVendorModel.refresh(true);

			}.bind(this));

			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				var aPraAddress = [],
					oPraAddress = {};
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
								oDataResp.result.parentDTO.customData.vnd_lfa1.MCOD1 = sSearchTerm ? sSearchTerm : oDataResp.result.parentDTO.customData.vnd_lfa1
									.SORTL;

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
									if (addCompanyCodeRows[j]) {
										addCompanyCodeRows[j].lfb1 = oDataResp.result.parentDTO.customData.vnd_lfb1[sKey];
									} else {
										addCompanyCodeRows.push({
											"lfb1": oDataResp.result.parentDTO.customData.vnd_lfb1[sKey],
											"lfbw": {}
										});
									}

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
								Object.keys(oDataResp.result.parentDTO.customData.gen_adrc).forEach(function (sAddrKey) {
									if (sAddrKey === "gen_adrc_1") {
										this.getView().getModel("CreateVendorModel").setProperty(
											"/createCRVendorData/formData/parentDTO/customData/gen_adrc", {
												sAddrKey: oDataResp.result.parentDTO.customData.gen_adrc[sAddrKey]
											});
										oPraAddress = Object.assign({}, oDataResp.result.parentDTO.customData.gen_adrc[sAddrKey]);
										Object.keys(oPraAddress).forEach(function (sPraAddrKey) {
											oPraAddress[sPraAddrKey] = null;
										});
									} else {

										aPraAddress.push(oDataResp.result.parentDTO.customData.gen_adrc[sAddrKey]);
									}
								}, this);
							} else {
								oDataResp.result.parentDTO.customData.gen_adrc = {
									"gen_adrc_1": {}
								};
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oDataResp.result.parentDTO.customData.vnd_lfa1.NAME1;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.sort1 = oDataResp.result.parentDTO.customData.vnd_lfa1.SORTL;
								var sHouseNo = oDataResp.result.parentDTO.customData.vnd_lfa1.STRAS.split(' ')[0];
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.house_num1 = sHouseNo;
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1.street = oDataResp.result.parentDTO.customData.vnd_lfa1.STRAS.slice(
									sHouseNo.length);
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
					this.getView().getModel("praAddressModel").setData({
						address: oPraAddress,
						rows: aPraAddress
					});

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
					this.getAllDocumentsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));
					this.getAuditLogsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));

					this.getWorkFlowForCR(sChangeRequestId);

					if (!this.getView().getModel("crAuditLogModel").getProperty("/details")) {
						this.getView().getModel("crAuditLogModel").setProperty("/details", {});
					}
					this.getView().getModel("crAuditLogModel").setProperty("/details/desc", oChangeRequest.crDTO.change_request_desc);
					this.getView().getModel("crAuditLogModel").setProperty("/details/businessID", sEntityID);
					// this.getView().getModel("crAuditLogModel").setProperty("/details/desc", oChangeRequest.ccrDTO.change_request_desc);
					var sID = this.getView().getParent().getPages().find(function (e) {
						return e.getId().indexOf("erpVendorPreview") !== -1;
					}).getId();
					this.getView().getParent().to(sID);
					//	this.getView().getParent().to(sID);
					this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
					this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
					this.getView().getModel("CreateVendorModel").setProperty("/approvalView", true);
					this.getView().getParent().getParent().getSideContent().setSelectedItem(this.getView().getParent().getParent().getSideContent()
						.getItem()
						.getItems()[1]);
					var titleID = this.getView().getParent().getParent().getHeader().getContent()[2];
					titleID.setText(this.oBundle.getText("createERPVendorView-title"));
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Not able to fetch the data, Please try after some time");
			}.bind(this));

		},

		onPressAddComment: function () {
			this.getView().byId("commentVBoxID").setVisible(true);
		},

		onPressCancelComment: function () {
			this.getView().byId("commentVBoxID").setVisible(false);
		},

		handleChangeStatus: function (sValue) {
			var sText = "Unknown";
			if (sValue) {
				sText = "Closed";
			} else if (sValue === false) {
				sText = "Open";
			} else {
				sText = "Open";
			}
			return sText;
		},

		handleChangeReqDate: function (sDateText) {
			var sResultDate = "";
			if (sDateText) {
				sResultDate = new Date(sDateText.split('T')[0]);
				var sDate = (sResultDate.getDate()).toString();
				sDate = sDate.length === 2 ? sDate : ('0' + sDate);
				var sMonth = ((sResultDate.getMonth()) + 1).toString();
				sMonth = sMonth.length === 2 ? sMonth : ('0' + sMonth);
				sResultDate = sMonth + '-' + sDate + '-' + sResultDate.getFullYear();
			}
			return sResultDate;
		},

		// onChnageRequestUpdateStart: function (oEvent) {
		// 	this.nPageNo++;
		// 	this.handleGetAllChangeRequests(this.nPageNo);
		// },

		onSelectChnageReqPage: function () {
			var oSelectedPage = this.getView().getModel("changeRequestGetAllModel").getProperty("/selectedPageKey");
			if (this.getView().byId("SB1").getSelectedKey() === "02") {
				this.handleGetAllChangeRequests(oSelectedPage, "GET_ALL_BY_USER_ID");
			} else {
				this.handleGetAllChangeRequests(oSelectedPage);
			}
		},

		onSelectChnageReqPageLeft: function () {
			var oSelectedPage = this.getView().getModel("changeRequestGetAllModel").getProperty("/selectedPageKey");
			if (this.getView().byId("SB1").getSelectedKey() === "02") {
				this.handleGetAllChangeRequests(oSelectedPage - 1, "GET_ALL_BY_USER_ID");
			} else {
				this.handleGetAllChangeRequests(oSelectedPage - 1);
			}
			// this.handleGetAllChangeRequests(oSelectedPage - 1);
		},

		onSelectChnageReqPageRight: function () {
			var oSelectedPage = this.getView().getModel("changeRequestGetAllModel").getProperty("/selectedPageKey");
			if (this.getView().byId("SB1").getSelectedKey() === "02") {
				this.handleGetAllChangeRequests(oSelectedPage + 1, "GET_ALL_BY_USER_ID");
			} else {
				this.handleGetAllChangeRequests(oSelectedPage + 1);
			}
			// this.handleGetAllChangeRequests(oSelectedPage + 1);
		},

		onSelectChangeRequest: function (oEvent) {
			var sEntityID = oEvent.getParameter("listItem").getBindingContext("changeRequestGetAllModel").getObject().crDTO.entity_id;
			this.getAllCommentsForCR(sEntityID);
			this.getAllDocumentsForCR(sEntityID);
			this.getAuditLogsForCR(sEntityID);
			this.getWorkFlowForCR(oEvent.getParameter("listItem").getBindingContext("changeRequestGetAllModel").getObject().crDTO.change_request_id);
			if (!this.getView().getModel("crAuditLogModel").getProperty("/details")) {
				this.getView().getModel("crAuditLogModel").setProperty("/details", {});
			}
			this.getView().getModel("crAuditLogModel").setProperty("/details/desc", oEvent.getParameter("listItem").getBindingContext(
				"changeRequestGetAllModel").getObject().crDTO.change_request_desc);
			this.getView().getModel("crAuditLogModel").setProperty("/details/businessID", sEntityID);
			var oToggleBtn = this.getView().byId("slideToggleButtonID");
			oToggleBtn.firePress({
				pressed: true
			});
			oToggleBtn.setPressed(true);
		},

		onAddCommentCRList: function () {
			var oList = this.getView().byId("crList");
			this.onAddComment({
				sEntityID: oList.getSelectedItem().getBindingContext("changeRequestGetAllModel").getObject().crDTO.entity_id,
				comment: this.getView().byId("changeReruestListCommentBoxId").getValue(),
				sControlID: "changeReruestListCommentBoxId"
			});
			this.onPressCancelComment();
		},

		// handleMyRequest: function (oEvent) {
		// 	this.getView().setBusy(true);
		// 	var objParamSubmit = {
		// 		url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/page",
		// 		type: 'POST',
		// 		hasPayload: true,
		// 		data: {
		// 			"crSearchType": "GET_ALL_BY_USER_ID",
		// 			"currentPage": 1,
		// 			"userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
		// 		}
		// 	};
		// 	this.serviceCall.handleServiceRequest(objParamSubmit).then(function (oData) {
		// 		this.getView().setBusy(false);
		// 		if (oData.result.currentPage === 1) {
		// 			var aPageJson = [];
		// 			for (var i = 0; i < oData.result.totalPageCount; i++) {
		// 				aPageJson.push({
		// 					key: i + 1,
		// 					text: i + 1
		// 				});
		// 			}
		// 			if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
		// 				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/PageData", aPageJson);
		// 			} else {
		// 				this.getView().getModel("changeRequestGetAllModel").setProperty("/PageData", aPageJson);
		// 			}
		// 		}
		// 		if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
		// 			this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/oChangeReq", oData.result);
		// 			////Total count 
		// 			this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/totalCount", oData.result.parentCrDTOs.length);

		// 			this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/selectedPageKey", oData.result.currentPage);
		// 			if (oData.result.totalPageCount > oData.result.currentPage) {
		// 				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", true);
		// 			} else {
		// 				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
		// 			}
		// 			if (oData.result.currentPage > 1) {
		// 				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", true);
		// 			} else {
		// 				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
		// 			}

		// 		} else {
		// 			this.getView().getModel("changeRequestGetAllModel").setProperty("/oChangeReq", oData.result);
		// 			this.getView().getModel("changeRequestGetAllModel").setProperty("/selectedPageKey", oData.result.currentPage);
		// 			if (oData.result.totalPageCount > oData.result.currentPage) {
		// 				this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", true);
		// 			} else {
		// 				this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
		// 			}
		// 			if (oData.result.currentPage > 1) {
		// 				this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", true);
		// 			} else {
		// 				this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
		// 			}
		// 		}
		// 	}.bind(this), function (oError) {
		// 		this.getView().setBusy(false);
		// 		MessageToast.show("Error in getting my requests");
		// 	}.bind(this));
		// },

		onChnageLogSwitchChangeReq: function (oEvent) {
			var oList = this.getView().byId("idAuditLogListChangeRequest");
			oList.setVisible(oEvent.getParameter("state"));
		},

		onSortChnageReq: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.vendor.murphymdmvendor.fragments.SortAllChangeRequests",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}

			this._pPopover.then(function (oPopover) {
				oPopover.open(oButton);
			});
		},
		onConfirmSortChangeReq: function (oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("crList");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			var aSorters = [];
			// apply sorter 
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},
		onSelChangeRequestTyp: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey();
			if (sKey === "02") {
				this.handleGetAllChangeRequests(1, "GET_ALL_BY_USER_ID");
			} else {
				this.handleGetAllChangeRequests();
			}
		},

		handleDateRangeChange: function (oEvent) {
			var sFrom = oEvent.getParameter("from"),
				sTo = oEvent.getParameter("to"),
				bValid = oEvent.getParameter("valid"),
				oEventSource = oEvent.getSource();

			if (bValid) {
				oEventSource.setValueState(ValueState.None);
			} else {
				oEventSource.setValueState(ValueState.Error);
			}
		},

		onCRSearch: function (oEvent) {
			if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
			} else {
				this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
				this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
			}
			var oFromDate = oEvent.getParameter("selectionSet")[0].getFrom();
			var oToDate = oEvent.getParameter("selectionSet")[0].getTo();
			var sShow = oEvent.getParameter("selectionSet")[1].getSelectedKey();
			var sVendor = oEvent.getParameter("selectionSet")[2].getValue();
			var sCity = oEvent.getParameter("selectionSet")[3].getValue();
			var sCompanyCode = oEvent.getParameter("selectionSet")[4].getValue();
			var sFromDate, sToDate, sCreatedBy, bClaimed, bClosed;

			if (oFromDate) {
				sFromDate = oFromDate.getFullYear() + "-" + (((oFromDate.getMonth() + 1) + "").length > 1 ? (oFromDate.getMonth() + 1) : "0" +
					(oFromDate.getMonth() + 1)) + "-" + (((oFromDate.getDate()) + "").length > 1 ? (oFromDate.getDate()) : "0" + (oFromDate.getDate()));
			}
			if (oToDate) {
				sToDate = oToDate.getFullYear() + "-" + (((oToDate.getMonth() + 1) + "").length > 1 ? (oToDate.getMonth() + 1) : "0" + (oToDate
					.getMonth() + 1)) + "-" + (((oToDate.getDate()) + "").length > 1 ? (oToDate.getDate()) : "0" + (oToDate.getDate()));
			}
			if (sShow === "01") {
				sCreatedBy = "";
				bClaimed = "";
				bClosed = "";
			} else if (sShow === "02") {
				sCreatedBy = this.getView().getModel("userManagementModel").getProperty("/data/user_id");
				bClaimed = "";
				bClosed = "";
			} else if (sShow === "03") {
				sCreatedBy = this.getView().getModel("userManagementModel").getProperty("/data/user_id");
				bClaimed = true;
				bClosed = false;
			} else if (sShow === "04") {
				sCreatedBy = this.getView().getModel("userManagementModel").getProperty("/data/user_id");
				bClaimed = true;
				bClosed = true;
			}

			this.getView().setBusy(true);
			if (sCreatedBy || sToDate || sFromDate || sVendor || sCompanyCode || sCity || bClaimed || bClosed) {
				var objParamSubmit = {
					url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/filters/get",
					type: 'POST',
					hasPayload: true,
					data: {
						"crSearchType": "GET_CR_BY_VENDOR_FILTERS",
						"currentPage": 1,
						"changeRequestSearchDTO": {
							"createdBy": sCreatedBy,
							"dateRangeTo": sToDate,
							"dateRangeFrom": sFromDate,
							"approvedEntityId": sVendor,
							"companyCode": sCompanyCode,
							"countryCode": sCity,
							"isClaimed": bClaimed,
							"isCrClosed": bClosed,
							"entityType": "VENDOR",
							"listOfCRSearchCondition": [
								"GET_CR_BY_ADDRESS",
								"GET_CR_CREATED_BY_USER_ID",
								"GET_CR_BY_DATE_RANGE",
								"GET_CR_BY_ENTITY",
								"GET_CR_BY_COMPANY_CODE",
								"GET_CR_PROCESSED_BY_USER_ID"
							]
						}
					}
				};
				this.serviceCall.handleServiceRequest(objParamSubmit).then(function (oData) {
					if (oData.result.currentPage === 1) {
						var aPageJson = [];
						for (var i = 0; i < oData.result.totalPageCount; i++) {
							aPageJson.push({
								key: i + 1,
								text: i + 1
							});
						}
						if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
							this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/PageData", aPageJson);
						} else {
							this.getView().getModel("changeRequestGetAllModel").setProperty("/PageData", aPageJson);
						}
					}
					if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/oChangeReq", oData.result);
						////Total count 
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/totalCount", oData.result.parentCrDTOs.length);
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/selectedPageKey", oData.result.currentPage);
						if (oData.result.totalPageCount > oData.result.currentPage) {
							this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", true);
						} else {
							this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
						}
						if (oData.result.currentPage > 1) {
							this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", true);
						} else {
							this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
						}

					} else {
						this.getView().getModel("changeRequestGetAllModel").setProperty("/oChangeReq", oData.result);
						this.getView().getModel("changeRequestGetAllModel").setProperty("/selectedPageKey", oData.result.currentPage);
						if (oData.result.totalPageCount > oData.result.currentPage) {
							this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", true);
						} else {
							this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
						}
						if (oData.result.currentPage > 1) {
							this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", true);
						} else {
							this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
						}
					}
					this.getView().setBusy(false);

				}.bind(this), function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Error in getting Change Requests");
				}.bind(this));
			} else {
				this.handleGetAllChangeRequests();
				this.getView().setBusy(false);
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ChangeRequest
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ChangeRequest
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ChangeRequest
		 */
		//	onExit: function() {
		//
		//	}

	});

});