sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall"
], function (Controller, ServiceCall) {
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

			handleGetAllChangeRequests: function () {
			// var that = this;
			var objParam = {
				url: '/murphyCustom/mdm/change-request-service/changerequests/changerequest/page',
				hasPayload: true,
				type: 'POST',
				data: {
					"crSearchType": "GET_ALL_CR",
					"currentPage": 1
				}
			};

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				if (this.getOwnerComponent().getModel("changeRequestStatisticsModel")) {
					this.getOwnerComponent().getModel("changeRequestGetAllModel").setData(oData.result);
				} else {
					this.getView().getModel("changeRequestGetAllModel").setData(oData.result);
				}
			}.bind(this));
		}

	});
});