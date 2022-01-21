sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	'sap/ui/core/Fragment'
], function (Controller, ServiceCall, Fragment) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.BaseController", {

		constructor: function () {
			this.serviceCall = new ServiceCall();
		},

		handleChangeRequestStatistics: function () {
			// var that = sap.ui.controller("murphy.mdm.vendor.murphymdmvendor.controller.ChangeRequest");
			var objParam = {
				url: '/murphyCustom/mdm/change-request-service/changerequests/changerequest/statistics/get',
				type: 'GET',
				hasPayload: false
			};

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				if (this.getOwnerComponent().getModel("changeRequestStatisticsModel")) {
					this.getOwnerComponent().getModel("changeRequestStatisticsModel").setData(oData.result);
				} else {
					this.getView().getModel("changeRequestStatisticsModel").setData(oData.result);
				}

			}.bind(this));
		},

		handleGetAllChangeRequests: function (nPageNo) {
			if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
			} else {
				this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
				this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
			}
			if (!nPageNo) {
				nPageNo = 1;
			}
			var objParam = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/page",
				hasPayload: true,
				type: 'POST',
				data: {
					"crSearchType": "GET_ALL_CR",
					"currentPage": nPageNo
				}
			};

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
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

			}.bind(this));
		},
		handleErrorLogs: function () {
			var oButton = this.getView().byId('idCreateVendorSubmitErrors');
			var oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					name: "murphy.mdm.vendor.murphymdmvendor.fragments.ErrorPopover",
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

		formatCR_Entiry_ID: function (sCRId, sEntityID) {
			var sID = "";
			if (sCRId) {
				sID = sCRId;
			} else {
				sID = "T-" + sEntityID;
			}
			return sID;
		},

		formatCR_Org_Name: function (sOrgNo) {
			var sText = "";
			if (sOrgNo) {
				sText = "Organization: " + sOrgNo + ", (no description available)";
			} else {
				sText = "Organization: (no description available)";
			}
			return sText;
		}

	});
});