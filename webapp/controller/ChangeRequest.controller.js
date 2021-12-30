sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.ChangeRequest", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.ChangeRequest
		 */
		onInit: function () {
			var oData = {
				columns: [{
					header: "Change Request",
					key: 'changeRequest'
				}, {
					header: "Change Status",
					key: 'changeStatus'
				}, {
					header: "Last Update",
					key: 'lastUpdate'
				}, {
					header: "Changed By",
					key: 'changedBy'
				}, {
					header: "Business Partner ID",
					key: 'bpID'
				}, {
					header: "Category",
					key: 'category'
				}, {
					header: " ",
					key: 'overflowIcon'
				}],
				rows: [{
						changeRequest: "31900",
						changeStatus: "Changes to Be Executed",
						lastUpdate: "20-04-2020",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "31907",
						changeStatus: "Changes to Be Executed",
						lastUpdate: "23-11-2020",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "09084",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39083",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39082",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39081",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39080",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39079",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39078",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39077",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39076",
						changeStatus: "To Revise: Perform Changes",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}, {
						changeRequest: "39075",
						changeStatus: "Final Check Be Performed",
						lastUpdate: "dd-mm-yyyy",
						changedBy: "Klaus Cole",
						bpID: "3190099",
						category: "28A"
					}

				]

			};
			var oJSONModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().setModel(oJSONModel);

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
				return e.getId().indexOf("erpVendorPreview") !== -1;
			}).getId();
			this.getView().getParent().to(sID);
			this.getView().getParent().to(sID);
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