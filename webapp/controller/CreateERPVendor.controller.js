sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/core/Fragment',
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall"
], function (Controller, JSONModel, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, Fragment, ServiceCall) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.CreateERPVendor", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.CreateERPVendor
		 */
		onInit: function () {
			this._getDropDownData();
		},
		
		_getDropDownData: function(){
			var objParamCreate = {
				url: "/murphyCustom/config-service/configurations/configuration",
				data: {
					"configType": "TAXONOMY"
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				if (oDataResp.result) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRDD", oDataResp.result.modelMap[0]);
				}
			}.bind(this));
		},

		onSaveClick: function (oEvent) {
			var sID = this.getView().getParent().getPages().find(function (e) {
				return e.getId().indexOf("erpVendorPreview") !== -1;
			}).getId();
			this.getView().getParent().to(sID);
			this.getView().getModel("CreateVendorModel").setProperty("/preview", true);
			this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
			this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
		},

		onValueHelpRequested: function (oEvent) {
			this._oInput = oEvent.getSource();
			var aCustomData = this._oInput.getCustomData();
			//	this.oTableDataModel       ValueHelpDatamodel
			var oData = {
				cols: []
			};
			for (var i = 0; i < aCustomData.length; i++) {
				if (aCustomData[i].getKey() !== "title" && aCustomData[i].getKey() !== "table") {
					var col = {
						"label": aCustomData[i].getValue(),
						"template": aCustomData[i].getKey()
					};
					oData.cols.push(col);
				} else if (aCustomData[i].getKey() === "title") {
					oData.title = aCustomData[i].getValue();
				} else {
					oData.table = aCustomData[i].getValue();
				}
			}
			this.oColModel = new JSONModel(oData);
			this.oTableDataModel = new JSONModel({
				item: []
			});
			var aCols = oData.cols;
			this._oBasicSearchField = new SearchField();
			// debugger;
			var objParamCreate = {
				url: "/murphyCustom/config-service/configurations/configuration",
				data: {
					"configType": oData.table
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				if (oDataResp.result) {
					this.oTableDataModel.setProperty("/item", oDataResp.result.modelMap);
					this.oTableDataModel.refresh();
				}
			}.bind(this));

			Fragment.load({
				name: "murphy.mdm.vendor.murphymdmvendor.fragments.valueHelpSuggest",
				controller: this
			}).then(function name(oFragment) {
				this._oValueHelpDialog = oFragment;
				this.getView().addDependent(this._oValueHelpDialog);
				this._oValueHelpDialog.setModel(this.oColModel, "oViewModel");

				var oFilterBar = this._oValueHelpDialog.getFilterBar();
				oFilterBar.setFilterBarExpanded(true);
				oFilterBar.setBasicSearch(this._oBasicSearchField);
				oFilterBar.setModel(this.oColModel, "columns");

				this._oValueHelpDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oTableDataModel);
					oTable.setModel(this.oColModel, "columns");

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/item");
					}

					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/item", function () {
							return new ColumnListItem({
								cells: aCols.map(function (column) {
									return new Label({
										text: "{" + column.colKey + "}"
									});
								})
							});
						});
					}

					this._oValueHelpDialog.update();
				}.bind(this));
				this._oValueHelpDialog.open();
			}.bind(this));

		},

		onValueHelpOkPress: function (oEvent) {
			var aToken = oEvent.getParameter("tokens");
			var oVal = aToken[0].getCustomData()[0].getValue();
			this._oInput.setValue("(" + oVal.land1 + ") " + oVal.lkvrz);
			this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		},

		onFilterBarSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);
			var customFilter = [];
			for (var i = 0; i < this.oColModel.getData().cols.length; i++) {
				customFilter.push(new Filter({
					path: this.oColModel.getData().cols[i].template,
					operator: FilterOperator.Contains,
					value1: sSearchQuery ? sSearchQuery : ""
				}));

			}

			aFilters.push(new Filter({
				filters: customFilter,
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},

		_filterTable: function (oFilter) {
			var oValueHelpDialog = this._oValueHelpDialog;

			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				oValueHelpDialog.update();
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.CreateERPVendor
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.CreateERPVendor
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.CreateERPVendor
		 */
		//	onExit: function() {
		//
		//	}

	});

});