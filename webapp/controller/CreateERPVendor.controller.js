sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/core/Fragment',
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	"sap/m/StandardListItem",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/m/List",
	"sap/m/Button",
	"sap/m/ButtonType",
], function (BaseController, JSONModel, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, Fragment,
	ServiceCall,
	StandardListItem, Dialog, MessageToast, List, Button, ButtonType) {
	"use strict";

	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.CreateERPVendor", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.vendor.murphymdmvendor.view.CreateERPVendor
		 */
		onInit: function () {
			this._getTaxonomyData();
			this._getDropDownData();
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		_getTaxonomyData: function () {
			var objParamCreate = {
				url: "/murphyCustom/config-service/configurations/configuration",
				type: 'POST',
				hasPayload: true,
				//	contentType: 'application/json',
				data: {
					configType: "TAXONOMY"
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				if (oDataResp.result) {
					this.getOwnerComponent().getModel("CreateVendorModel").setProperty("/createCRDD", oDataResp.result.modelMap[0]);
				}
			}.bind(this));
		},

		_getDropDownData: function () {
			var that = this;
			var aConfigDD = this.getOwnerComponent().getModel("CreateVendorModel").getProperty("/createCRDDConfig");
			$.each(aConfigDD, function (index, item) {
				$.ajax({
					url: "/murphyCustom/config-service/configurations/configuration",
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						"configType": item.controlTable
					}),
					async: false,
					success: searchCallback
				});

				function searchCallback(data) {
					var oJsonModel = new JSONModel(data.result);
					// console.log(data.result);
					var sControlID = item.controlID;
					that.getView().byId(sControlID).setModel(oJsonModel);
					var oItemSelectTemplate1 = new sap.ui.core.Item({
						key: "{" + item.controlField + "}",
						text: "{" + item.controlFieldName + "}"
					});
					that.getView().byId(sControlID).bindAggregation("items", "/modelMap", oItemSelectTemplate1);
				}
			});
			// });
		},

		onSaveClick: function (oEvent) {
			debugger;
			if (this.onCheckClick()) {
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
							oData.parentDTO.customData.vnd_lfbw.vnd_lfbw_1.lifnr = sLifnr;
							oData.parentDTO.customData.vnd_knvk.vnd_knvk_1.lifnr = sLifnr;
							oData.parentDTO.customData.vnd_lfb1.vnd_lfb1_1.lifnr = sLifnr;
							var sKeylfb1 = Object.keys(oData.parentDTO.customData.vnd_lfb1);
							for (var i = 0; i < sKeylfb1.length; i++) {
								oData.parentDTO.customData.vnd_lfb1[sKeylfb1[i]]["lifnr"] = sLifnr;
							}

							oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.lifnr = sLifnr;
							oData.parentDTO.customData.pra_bp_ad.pra_bp_ad_1.vendid = sLifnr;
							oData.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1.vendid = sLifnr;
							oData.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1.vendid = sLifnr;
							oData.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1.custid = sLifnr;
							oData.parentDTO.customData.gen_adrc.gen_adrc_1.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
							oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
							oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
							this._handleSaveWithLifnr(oData);
							/*	var objParamCreate = {
									url: "/murphyCustom/mdm/entity-service/entities/entity/update",
									hasPayload: true,
									data: oData,
									type: 'POST'
								};
								this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
									this.getView().setBusy(false);
									if (oDataResp.result) {
										this.getView().getModel("CreateVendorModel").setProperty("/createCRDD", oDataResp.result);
										this.getView().byId("idCreateVendorSubmit").setVisible(true);
									}
								}.bind(this), function (oError) {
									this.getView().setBusy(false);
								}.bind(this));*/
						}
					}.bind(this), function (oError) {
						this.getView().setBusy(false);
						MessageToast.show("Error In Generating Lifnr");
					}.bind(this));
				} else {
					this._handleSaveWithLifnr(oData);
					/*var objParamCreate = {
						url: "/murphyCustom/mdm/entity-service/entities/entity/update",
						hasPayload: true,
						data: oData,
						type: 'POST'
					};
					this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
						if (oDataResp.result) {
							this.getView().setBusy(false);
							this.getView().getModel("CreateVendorModel").setProperty("/createCRDD", oDataResp.result);
							this.getView().byId("idCreateVendorSubmit").setVisible(true);
						}
					}.bind(this), function (oError) {
						this.getView().setBusy(false);
					}.bind(this));*/
				}

			}

		},

		_handleSaveWithLifnr: function (oData) {
			oData = Object.assign({}, oData);
			if (oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === undefined || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 ===
				"" || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === null) {
				oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oData.parentDTO.customData.vnd_lfa1.Name1;
			}
			if (oData.parentDTO.customData.vnd_lfa1.KTOKK !== "JVPR") {
				delete oData.parentDTO.customData.pra_bp_ad;
				delete oData.parentDTO.customData.pra_bp_vend_esc;
				delete oData.parentDTO.customData.pra_bp_cust_md;
				delete oData.parentDTO.customData.pra_bp_vend_md;
			}
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.banka = "";
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.ort01 = "";
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.stars = "";
			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/update",
				hasPayload: true,
				data: oData,
				type: 'POST'
			};

			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				if (oDataResp.result) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRDD", oDataResp.result);
					// this.getView().byId("idCreateVendorSubmit").setVisible(true);

					var sID = this.getView().getParent().getPages().find(function (e) {
						return e.getId().indexOf("erpVendorPreview") !== -1;
					}).getId();
					this.getView().getParent().to(sID);
					this.getView().getModel("CreateVendorModel").setProperty("/preview", true);
					this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
					this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error In Creating Draft Version");
			}.bind(this));
		},

		onValueHelpRequested: function (oEvent) {
			this._oInput = oEvent.getSource();
			var aCustomData = this._oInput.getCustomData();
			//	this.oTableDataModel       ValueHelpDatamodel
			var oData = {
				cols: []
			};
			for (var i = 0; i < aCustomData.length; i++) {
				if (aCustomData[i].getKey() !== "title" && aCustomData[i].getKey() !== "table" && aCustomData[i].getKey() !== "inputKey" &&
					aCustomData[i].getKey() !== "inputText") {
					var col = {
						"label": aCustomData[i].getValue(),
						"template": aCustomData[i].getKey()
					};
					oData.cols.push(col);
				} else if (aCustomData[i].getKey() === "title") {
					oData.title = aCustomData[i].getValue();
				} else if (aCustomData[i].getKey() === "table") {
					oData.table = aCustomData[i].getValue();
				} else if (aCustomData[i].getKey() === "inputKey") {
					this._sKey = aCustomData[i].getValue();
					oData.key = aCustomData[i].getValue();
				} else if (aCustomData[i].getKey() === "inputText") {
					oData.text = aCustomData[i].getValue();
				}
			}
			this.oColModel = new JSONModel(oData);
			this.oTableDataModel = new JSONModel({
				item: []
			});
			var aCols = oData.cols;
			this._oBasicSearchField = new SearchField();
			if (oData.table === "local") {
				var oModel = this.getOwnerComponent().getModel("CreateVendorModel");
				var aData;
				switch (oData.title) {
				case "Terms of Payment":
				case "Payment terms":
					aData = oModel.getProperty("/paymentTermsData");
					break;
				case "Bank Key":
					aData = oModel.getProperty("/BankKeyData");
					break;
				}
				if (aData.length > 0) {
					this.oTableDataModel.setProperty("/item", aData);
					this.oTableDataModel.refresh();
				}
			} else {
				var objParamCreate;
				if (oData.table === "LFA1") {
					objParamCreate = {
						url: "/murphyCustom/mdm/entity-service/entities/entity/get",
						type: 'POST',
						hasPayload: true,
						data: {
							"entitySearchType": "GET_ALL_VENDOR",
							"entityType": "VENDOR",
							"currentPage": 1,
							"parentDTO": {
								"customData": {
									"vnd_lfa1": {}
								}
							}
						}
					};
				} else {
					objParamCreate = {
						url: "/murphyCustom/config-service/configurations/configuration",
						type: 'POST',
						hasPayload: true,
						data: {
							"configType": oData.table
						}
					};
				}

				this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					if (oDataResp.result && oDataResp.result.modelMap) {
						var obj = {};
						obj[oData["key"]] = "";
						obj[oData["text"]] = ""
						oDataResp.result.modelMap.unshift(obj);
						this.oTableDataModel.setProperty("/item", oDataResp.result.modelMap);
						this.oTableDataModel.refresh();
					} else if (oData.table === 'SKA1') {
						var oLocalData = [{
							Key: "30000100",
							Name: "USOC	AP - TRADE"
						}, {
							Key: "30000110",
							Name: "USOC	AP - JOINT VENTURE"
						}, {
							Key: "30000111",
							Name: "USOC	CASH CALL DUE(NP)"
						}, {
							Key: "30000112",
							Name: "USOC	CASH CALL OFFSET(NP)"
						}, {
							Key: "30000113",
							Name: "USOC	Working Capital Cutback"
						}, {
							Key: "30000114",
							Name: "USOC	Vendor 1099 Reconciliation Account"
						}, {
							Key: "30000115",
							Name: "USOC	1099 Offset Account)"
						}, {
							Key: "30000120",
							Name: "USOC	AP - EMPLOYEES"
						}, {
							Key: "30000125",
							Name: "USOC	Employee Miscellaneous"
						}, {
							Key: "30000130",
							Name: "USOC	AP - LAND"
						}, {
							Key: "30000140",
							Name: "USOC	AP - GR/IR"
						}, {
							Key: "30000145",
							Name: "	USOC	AP - GR - NON PO"
						}, {
							Key: "30000149",
							Name: "USOC	AP - GR/IR Consignment"
						}, {
							Key: "30000150",
							Name: "USOC	Redetermination Liability"
						}, {
							Key: "30000160",
							Name: "USOC	AP - marketing"
						}];
						this.oTableDataModel.setProperty("/item", oLocalData);
						this.oTableDataModel.refresh();
					} else if (oData.table === 'LFA1') {
						this.oTableDataModel.setProperty("/item", oDataResp.result.vendorDTOs);
						this.oTableDataModel.refresh();
					}

				}.bind(this));
			}
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
										text: "{" + column.colKey + "}",
										wrapping: true
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
			if (this._sKey.split("/").length > 1) {
				this._oInput.setValue(oVal[this._sKey.split("/")[0]][this._sKey.split("/")[1]]);
			} else {
				this._oInput.setValue(oVal[this._sKey]);
			}
			if (oEvent.getSource().getModel("oViewModel").getProperty("/title") === "Company Code") {
				this.getView().getModel("CreateVendorModel").setProperty(
					"/addCompanyCodeFormData/vnd_lfbw/bukrs", oVal[this._sKey]);
				var sSelectedKey = oVal[this._sKey];
				var aPaymentMethodData = this.getOwnerComponent().getModel('CreateVendorModel').getProperty('/paymentMethodData');
				var obj = aPaymentMethodData.find(oItem => Number(oItem.compCode) === Number(sSelectedKey));
				if (obj && obj.payMethod) {
					this.getOwnerComponent().getModel('CreateVendorModel').setProperty('/paymentMehtodBinding', obj.payMethod);
					this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
				}
			} else if (oEvent.getSource().getModel("oViewModel").getProperty("/title") === "Bank Key") {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/banka', oVal.bankName);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/stars', oVal.street);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/ort01', oVal.city);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKS', oVal.country);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			} else if (oEvent.getSource().getModel("oViewModel").getProperty("/title") === "Language") {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/langu', oVal.spras);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			}
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
						// path: oControl.getName(),
						path: oControl.getModel("oViewModel").getProperty("/cols/" + oControl.getId().split("-")[oControl.getId().split("-").length -
							1] + "/template"),
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
		},

		onSelectCheckBox: function (oEvent) {
			var sKey = oEvent.getSource().getCustomData()[0].getKey();
			if (sKey && sKey.split("/")[1] === "createCRVendorData") {
				if (oEvent.getParameter("selected")) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData" + sKey, "X");
				} else {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData" + sKey, "");
				}
			} else if (sKey && sKey.split("/")[1] !== "createCRVendorData") {
				if (oEvent.getParameter("selected")) {
					this.getView().getModel("CreateVendorModel").setProperty(sKey, "X");
				} else {
					this.getView().getModel("CreateVendorModel").setProperty(sKey, "");
				}
			}
		},

		onAddComment: function () {
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/comments/add",
				type: 'POST',
				hasPayload: true,
				data: {
					"parentCrDTOs": [{
						"crCommentDTOs": [{
							"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
							"note_desc": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/newComment"),
							"note_by": 1
						}]
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().byId("createERPVendorCommentBoxId").setValue('');
				if (oDataResp.result) {
					var oModel = new JSONModel(oDataResp.result);
					this.getView().byId("createERPVendorAddedCommentListId").setModel(oModel, "createERPAddCommentedModel");
				}
			}.bind(this));

		},

		onCreateERPVendorUpload: function (oEvent) {
			var file = this.getView().byId('UploadCollection');
			/*	this.getBase64(file);
				var objParamCreate = {
					url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/comments/add",
					type: 'POST',
					hasPayload: true,
					data: {
						"parentCrDTOs": [{
							"crCommentDTOs": [{
								"entity_id": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
								"note_desc": this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/newComment"),
								"note_by": 1
							}]
						}]
					}
				};
				this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().byId("createERPVendorCommentBoxId").setValue('');
					if (oDataResp.result) {
						var oModel = new JSONModel(oDataResp.result);
						this.getView().byId("createERPVendorAddedCommentListId").setModel(oModel, "createERPAddCommentedModel");
					}
				}.bind(this));*/
		},

		getBase64: function (file) {
			return new Promise(function (resolve, reject) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function () {
					resolve(reader.result);
				};
				reader.onerror = function (error) {
					reject(error);
				};
			});
		},

		onCheckClick: function () {
			var aMandFields = this.getView().getModel("CreateVendorModel").getProperty("/createMandtFields");
			var aEmptyFields = [];
			var oData = this.getView().getModel("CreateVendorModel");
			var oController = this;
			aMandFields.forEach(function (oItem) {
				var oControl = oController.getView().byId(oItem.id);
				var sValueState = "None";
				if (!oItem.isPRAData && (oData.getProperty(oItem.fieldMapping) === undefined || oData.getProperty(oItem.fieldMapping) === "" ||
						oData.getProperty(oItem.fieldMapping) === null)) {
					aEmptyFields.push(oItem);
					sValueState = "Error";
				} else if ((oItem.isPRAData && (oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") === "JVPR")) &&
					(oData.getProperty(oItem
							.fieldMapping) === undefined || oData.getProperty(oItem.fieldMapping) === "" ||
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
			if (!oData.getProperty("/addCompanyCodeRows").length) {
				aEmptyFields.push({
					section: "Company Code"
				})
			}

			this.getView().getModel("CreateVendorModel").setProperty("/missingFields", aEmptyFields);
			if (aEmptyFields.length) {
				if (!this.oDefaultDialog) {
					this.oDefaultDialog = new Dialog({
						title: "Missing Fields",
						content: new List({
							items: {
								path: "CreateVendorModel>/missingFields",
								template: new StandardListItem({
									// title: "{ parts: [ 'CreateVendorModel>Name', 'CreateVendorModel>panelMapping', 'CreateVendorModel>section'], formatter: 'formatCheckErrorMessage' }"
									title: "{= ${CreateVendorModel>section} ? 'No ${CreateVendorModel>section} is maintained in ${CreateVendorModel>section} Section.'  : '${CreateVendorModel>Name} field is missing in ${CreateVendorModel>panelMapping} Section.'}"

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
				MessageToast.show("Validation Successful'");
				return true;
			}
		},

		formatCheckErrorMessage: function (sName, sPanel, sSection) {
			var sMsg = "";
			if (!sSection) {
				sMsg = sName + " field is missing in " + sPanel + " Section";
			} else {
				sMsg = "no " + sSection + " is maintained in " + sSection + " table"
			}
			return sMsg;
		},

		handleName1: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/name1", oEvent.getSource().getValue());

		},
		handleSearchTerms: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/sort1", oEvent.getSource().getValue());
		},

		onAddCompanyCode: function (oEvent) {
			var sPathForCompanyCodeMandatoryField = "/companyCodeMandateFields";
			if (this._checkValidationforFields(sPathForCompanyCodeMandatoryField)) {
				var aLFB1WFormData = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData");
				var aLFB1WTableData = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeRows");
				aLFB1WTableData.push(aLFB1WFormData);
				this.getView().getModel("CreateVendorModel").setProperty(
					"/addCompanyCodeFormData", {
						"lfb1": {
							"entity_id": null,
							"bukrs": null,
							"AKONT": null,
							"LNRZE": null,
							"BEGRU": null,
							"MINDK": null,
							"ZUAWA": null,
							"FDGRV": null,
							"VZSKZ": null,
							"ZINRT": null,
							"ZINDT": null,
							"DATLZ": null,
							"ALTKN": null,
							"PERNR": null,
							"ZTERM": null,
							"KULTG": null,
							"REPRF": null,
							"ZWELS": null,
							"LNRZB": null,
							"WEBTR": null,
							"UZAWE": null,
							"ZAHLS": null,
							"HBKID": null,
							"XPORE": null,
							"XVERR": null,
							"TOGRU": null,
							"ZSABE": null,
							"EIKTO": null,
							"XDEZV": null,
							"KVERM": null,
							"MGRUP": null,
							"ZGRUP": null,
							"QLAND": null,
							"XEDIP": null,
							"FRGRP": null,
							"TOGRR": null,
							"TLFXS": null,
							"INTAD": null,
							"XLFZB": null,
							"GUZTE": null,
							"GRICD": null,
							"GRIDT": null,
							"XAUSZ": null,
							"CERDT": null,
							"CONFS": null,
							"UPDAT": null,
							"UPTIM": null,
							"NODEL": null,
							"TLFNS": null,
							"AVSND": null,
							"AD_HASH": null,
							"CVP_XBLCK_B": null,
							"CIIUCODE": null,
							"ZBOKD": null,
							"ZQSSKZ": null,
							"ZQSZDT": null,
							"ZQSZNR": null,
							"ZMINDAT": null,
							"J_SC_SUBCONTYPE": null,
							"J_SC_COMPDATE": null,
							"J_SC_OFFSM": null,
							"J_SC_OFFSR": null,
							"BASIS_PNT": null,
							"GMVKZK": null,
							"INTERCOCD": null,
							"RSTR_CHG_FL": null,
							"CHECK_FLAG": null,
							"OVRD_RCPMT": null,
							"MIN_PAY": null,
							"PAY_FRQ_CD": null,
							"RECOUP_PC": null,
							"ALLOT_MTH_CD": null,
							"ESCH_CD": null,
							"ESCHEAT_DT": null,
							"PREPAY_RELEVANT": null,
							"ASSIGN_TEST": null,
							"ZZESTMA": null

						},
						"lfbw": {
							"entity_id": null,
							"WT_WITHCD": null,
							"QSREC": null,
							"witht": "",
							"WT_WTSTCD": null,
							"WT_EXRT": null,
							"WT_EXDF": null,
							"WT_SUBJCT": null,
							"WT_EXNR": null,
							"WT_WTEXRS": null,
							"WT_EXDT": null,
							"lifnr": null,
							"bukrs": ""

						}
					});
			} else {
				MessageToast.show("Please Enter all Mandatory Fields for Company Code");
			}

		},

		onCompanYCodeEditPress: function (oEvent) {

		},

		onCompanYCodeDeletePress: function (oEvent) {

		},

		_checkValidationforFields: function (sPath) {
			var bCheck = true;
			var aMandateFieldJson = this.getView().getModel("CreateVendorModel").getProperty(sPath);
			var oController = this;
			var oView = this.getView();
			var oModel = this.getView().getModel("CreateVendorModel");
			aMandateFieldJson.forEach(function (oItem) {
				var oControl = oView.byId(oItem.id);
				var sValueState = "None";
				if (!oItem.isPRAData && (oModel.getProperty(oItem.fieldMapping) === undefined || oModel.getProperty(oItem.fieldMapping) === "" ||
						oModel.getProperty(oItem.fieldMapping) === null)) {
					// aEmptyFields.push(oItem);
					sValueState = "Error";
					bCheck = false;
				} else if ((oItem.isPRAData && (oModel.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") ===
						"JVPR")) &&
					(oModel.getProperty(oItem
							.fieldMapping) === undefined || oModel.getProperty(oItem.fieldMapping) === "" ||
						oModel.getProperty(oItem.fieldMapping) === null)) {
					aEmptyFields.push(oItem);
					sValueState = "Error";
					bCheck = false;
				} else {
					if (oControl.getValueState() === sap.ui.core.ValueState.Error || oControl.getValueState() === "Error") {
						sValueState = "Success";
					}
				}
				oControl.setValueState(sValueState);
			});
			return bCheck;
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