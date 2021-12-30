sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.searchvendor", {

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
			var oData = {
				columns: [{
					header: "Business Partner ID",
					key: "bpID"
				}, {
					header: "Pending Request",
					key: "pendingRequest"
				}, {
					header: "Description",
					key: "description"
				}, {
					header: "Customer Contact",
					key: "customerContact"
				}, {
					header: "Category",
					key: "category"
				}, {
					header: "Rank",
					key: "rank"
				}, {
					header: " ",
					key: "overflowIcon"
				}],
				rows: [{
						businessPartnerId: "500009086",
						pendigRequest: "Pending",
						description: "Danish Fishing Trading Company(100000043)",
						customerContact: "Danish",
						category: "12 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009085",
						pendigRequest: " ",
						description: "Sorali(100000044)",
						customerContact: "Klaus ",
						category: "6 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009084",
						pendigRequest: " ",
						description: "Sorali(100000044)",
						customerContact: "Dinesh",
						category: "12 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009083",
						pendigRequest: "Overdue",
						description: "Anav Ideon(100000054)",
						customerContact: "John Miller",
						category: "2 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009082",
						pendigRequest: "Pending",
						description: "Anav Ideon(100000054)",
						customerContact: "John Miller",
						category: "8 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009081",
						pendigRequest: " ",
						description: "PicoBit(100000037)",
						customerContact: "Will Shi",
						category: "7 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009080",
						pendigRequest: " ",
						description: "PicoBit(100000037)",
						customerContact: "Will Shi",
						category: "12 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009079",
						pendigRequest: "Pending",
						description: "PicoBit(100000037)",
						customerContact: "Will Shi",
						category: "9 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009078",
						pendigRequest: "Overdue",
						description: "Anav Ideon(100000054)",
						customerContact: "John Miller",
						category: "12 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009077",
						pendigRequest: "Pending",
						description: "PicoBit(100000037)",
						customerContact: "Will Shi",
						category: "6 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009076",
						pendigRequest: "Pending",
						description: "Sorali(100000044)",
						customerContact: "Dinesh",
						category: "2 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009075",
						pendigRequest: "Overdue",
						description: "PicoBit(100000037)",
						customerContact: "Will Shi",
						category: "1 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009074",
						pendigRequest: " ",
						description: "Anav Ideon(100000054)",
						customerContact: "John Miller",
						category: "12 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009073",
						pendigRequest: " ",
						description: "Anav Ideon(100000054)",
						customerContact: "John Miller",
						category: "5 EA",
						rank: "100,00"
					}, {
						businessPartnerId: "500009072",
						pendigRequest: "Pending",
						description: "PicoBit(100000037)",
						customerContact: "Will Shi",
						category: "8 EA",
						rank: "100,00"
					}

				]

			};
			var oJSONModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().setModel(oJSONModel);

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
			// if (sKey === "changeRequestMassId" || sKey === "changeRequestAllId") {
			// 	sap.ui.getCore().byId("changeRequestPage").setSelectedKey(sKey + "Icon");
			// }
		},

		onPressChngReqTile: function (oEvent) {

		},

		handlePendingRequest: function (sValue) {
			var sStatus = "None";
			switch (sValue.toLowerCase()) {
			case "pending":
				sStatus = "Warning";
				break;
			case "overdue":
				sStatus = "Error";
				break;

			}
			return sStatus;
		},

		handleOverFlowButton: function (oEvent) {
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
		}

		// onSaveClick : function(oEvent){
		// 	debugger;
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