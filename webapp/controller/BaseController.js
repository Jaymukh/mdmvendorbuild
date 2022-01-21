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
			// var that = this;
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
				if (nPageNo === 1) {
					if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setData(oData.result);
					} else {
						this.getView().getModel("changeRequestGetAllModel").setData(oData.result);
					}
				} else {
					var oPrevData;
					if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
						 oPrevData = this.getOwnerComponent().getModel("changeRequestGetAllModel").getData();
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setData(oPrevData.concat(oData.result));
					} else {
						 oPrevData = this.getView().getModel("changeRequestGetAllModel").getData();
						this.getView().getModel("changeRequestGetAllModel").setData(oPrevData.concat(oData.result));
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
		}

	});
});