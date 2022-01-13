sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall"
], function (Controller,ServiceCall) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.ChangeRequest", {
		 constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ChangeRequest
		 */
		onInit: function () {

			this.handleGetAllChangeRequests();
			this.handleChangeRequestStatistics();
			
		},
		
		handleChangeRequestStatistics : function(){
				var objParam= {
					url:'/murphyCustom/mdm/change-request-service/changerequests/changerequest/statistics/get',
					type:'GET',
					hasPayload: false
				};
			
			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				this.getOwnerComponent().getModel('changeRequestStatisticsModel').setData(oData.result);
			}.bind(this)); 
		},
		
		handleGetAllChangeRequests : function(){
				var objParam= {
					url:'/murphyCustom/mdm/change-request-service/changerequests/changerequest/get',
					type:'GET',
					hasPayload: false
				};
			
			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				this.getOwnerComponent().getModel('changeRequestGetAllModel').setData(oData.result);
			}.bind(this));                         
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

		onChangeReqLinkPress: function () {
			var sID = this.getView().getParent().getPages().find(function (e) {
				return e.getId().indexOf("createERPVendorView") !== -1;
			}).getId();
			this.getView().getParent().to(sID);
		//	this.getView().getParent().to(sID);
			this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
			this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
			this.getView().getModel("CreateVendorModel").setProperty("/approvalView", true);
			// debugger;
			// sap.ui.getCore().byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
			// var titleID = sap.ui.getCore().byId("idTitle");
			// titleID.setText(this.oBundle.getText("createERPVendorView-title"));
		},
		
		onPressAddComment: function(){
			this.getView().byId("commentVBoxID").setVisible(true);
		},
		
		onPressCancelComment: function(){
			this.getView().byId("commentVBoxID").setVisible(false);
		},
		
		handleChangeStatus : function(sValue){
			var sText = "Unknown";
			if(sValue){
				sText = "Closed";	
			}else if(sValue === false){
				sText = "Open";
			}
			return sText;
		},
		
		handleChangeReqDate : function(sDateText){
			var sResultDate ="" ;
			if (sDateText) {
						sResultDate = new Date(sDateText.split('T')[0]);
						var sDate = (sResultDate.getDate()).toString();
						sDate = sDate.length === 2 ? sDate : ('0'+ sDate);
						var sMonth =((sResultDate.getMonth()) + 1).toString();
						sMonth = sMonth.length  === 2 ? sMonth: ('0'+sMonth);
						sResultDate =  sDate+ '-' + sMonth+ '-' + sResultDate.getFullYear();
			}
			return sResultDate;
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