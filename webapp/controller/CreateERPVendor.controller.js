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
			this.getTelCountryNumber();
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
			var aConfigDD = [{
					"controlID": "generalDataTitleId",
					"controlTable": "TSAD3",
					"controlField": "title",
					"controlFieldName": "title_MEDI"
				}, {
					"controlID": "taxTypeId",
					"controlTable": "J_1AFITPV",
					"controlField": "j_1afitp",
					"controlFieldName": "text60"
				}, {
					"controlID": "taxInfoSocialInsuCodeId",
					"controlTable": "J_1AACT",
					"controlField": "actss",
					"controlFieldName": "actss"
				}, {
					"controlID": "compCodesMinorIndicatorId",
					"controlTable": "T059M",
					"controlField": "mindk",
					"controlFieldName": "mindk"
				}, {
					"controlID": "compCodesReleaseGroupId",
					"controlTable": "VBWF08",
					"controlField": "frgrp",
					"controlFieldName": "frgrt"
				}, {
					"controlID": "compCodesGroupKeyId",
					"controlTable": "TZGR",
					"controlField": "zgrup",
					"controlFieldName": "name1"
				}, {
					"controlID": "compCodesPayMethodSuppliementId",
					"controlTable": "T042F",
					"controlField": "uzawe",
					"controlFieldName": "txt30"
				}, {
					"controlID": "compCodesPaymentBlockId",
					"controlTable": "T008",
					"controlField": "zahls",
					"controlFieldName": "textl"
				}, {
					"controlID": "purOrgPurOrgId",
					"controlTable": "T024E",
					"controlField": "ekorg",
					"controlFieldName": "ekotx"
				}, {
					"controlID": "purOrgProactContrlProfileId",
					"controlTable": "TWVMO",
					"controlField": "paprf",
					"controlFieldName": "prtxt"
				}, {
					"controlID": "praDataAddrTabAddressTypeId",
					"controlTable": "OIUCM_ADDR_TYPE",
					"controlField": "addr_TYPE",
					"controlFieldName": "description"
				}

			];
			$.each(aConfigDD, function (index, item) {
				$.ajax({
					url: "/murphyCustom/config-service/configurations/configuration",
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						"configType": item.controlTable
					}),
					success: searchCallback
				});

				function searchCallback(data) {
					var oJsonModel = new JSONModel(data.result);
					var sControlID = item.controlID;
					that.getView().byId(sControlID).setModel(oJsonModel);
					if (item.controlID === 'generalDataTitleId') {
						that.getOwnerComponent().getModel('crERPTitleFilterModel').setData(data.result);
					} else {
						var oItemSelectTemplate1 = new sap.ui.core.Item({
							key: "{" + item.controlField + "}",
							text: "{" + item.controlFieldName + "}"
						});
						that.getView().byId(sControlID).bindAggregation("items", "/modelMap", oItemSelectTemplate1);
					}
				}
			});
			// });
		},

		onSaveClick: function (oEvent) {
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

							oData.parentDTO.customData.vnd_knvk.vnd_knvk_1.lifnr = sLifnr;
							// oData.parentDTO.customData.vnd_lfb1.vnd_lfb1_1.lifnr = sLifnr;
							var sKeylfb1 = Object.keys(oData.parentDTO.customData.vnd_lfb1);
							for (var i = 0; i < sKeylfb1.length; i++) {
								oData.parentDTO.customData.vnd_lfb1[sKeylfb1[i]]["lifnr"] = sLifnr;
							}

							var sKeylfbw = Object.keys(oData.parentDTO.customData.vnd_lfbw);
							for (var i = 0; i < sKeylfbw.length; i++) {
								oData.parentDTO.customData.vnd_lfbw[sKeylfbw[i]]["lifnr"] = sLifnr;
							}

							// oData.parentDTO.customData.vnd_lfbw.vnd_lfbw_1.lifnr = sLifnr;
							if (oData.parentDTO.customData.vnd_lfm1 && oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1) {
								oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.lifnr = sLifnr;
							}
							if (oData.parentDTO.customData.pra_bp_ad && oData.parentDTO.customData.pra_bp_ad.pra_bp_ad_1) {
								oData.parentDTO.customData.pra_bp_ad.pra_bp_ad_1.vendid = sLifnr;
							}
							if (oData.parentDTO.customData.pra_bp_vend_esc && oData.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1) {
								oData.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1.vendid = sLifnr;
							}
							if (oData.parentDTO.customData.pra_bp_vend_md && oData.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1) {
								oData.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1.vendid = sLifnr;
							}
							if (oData.parentDTO.customData.pra_bp_cust_md && oData.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1) {
								oData.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1.custid = sLifnr;
							}
							if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.gen_adrc_1) {
								oData.parentDTO.customData.gen_adrc.gen_adrc_1.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
							}
							if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.gen_adrc_2) {
								oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
								oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
							}

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
					var sLIFNR = oData.parentDTO.customData.vnd_lfa1.lifnr;
					if (oData.parentDTO.customData.vnd_lfbk && oData.parentDTO.customData.vnd_lfbk.hasOwnProperty('vnd_lfbk_1')) {
						oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.LIFNR = sLIFNR;
					}
					if (oData.parentDTO.customData.vnd_knvk && oData.parentDTO.customData.vnd_knvk.hasOwnProperty('vnd_knvk_1')) {
						oData.parentDTO.customData.vnd_knvk.vnd_knvk_1.lifnr = sLIFNR;
					}

					var sKeylfb1 = Object.keys(oData.parentDTO.customData.vnd_lfb1);
					for (var k = 0; k < sKeylfb1.length; k++) {
						oData.parentDTO.customData.vnd_lfb1[sKeylfb1[k]]["lifnr"] = sLIFNR;
					}
					var sKeylfbw = Object.keys(oData.parentDTO.customData.vnd_lfbw);
					for (var j = 0; j < sKeylfbw.length; j++) {
						oData.parentDTO.customData.vnd_lfbw[sKeylfbw[j]]["lifnr"] = sLIFNR;
					}
					if (oData.parentDTO.customData.vnd_lfm1 && oData.parentDTO.customData.vnd_lfm1.hasOwnProperty('vnd_lfm1_1')) {
						oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.lifnr = sLIFNR;
					}
					if (oData.parentDTO.customData.pra_bp_ad && oData.parentDTO.customData.pra_bp_ad.hasOwnProperty('pra_bp_ad_1')) {
						oData.parentDTO.customData.pra_bp_ad.pra_bp_ad_1.vendid = sLIFNR;
					}
					if (oData.parentDTO.customData.pra_bp_vend_esc && oData.parentDTO.customData.pra_bp_vend_esc.hasOwnProperty('pra_bp_vend_esc_1')) {
						oData.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1.vendid = sLIFNR;
					}
					if (oData.parentDTO.customData.pra_bp_vend_md && oData.parentDTO.customData.pra_bp_vend_md.hasOwnProperty('pra_bp_vend_md_1')) {
						oData.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1.vendid = sLIFNR;
					}
					if (oData.parentDTO.customData.pra_bp_cust_md && oData.parentDTO.customData.pra_bp_cust_md.hasOwnProperty('pra_bp_cust_md_1')) {
						oData.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1.custid = sLIFNR;
					}
					if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.hasOwnProperty('gen_adrc_1')) {
						oData.parentDTO.customData.gen_adrc.gen_adrc_1.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
					}
					if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.hasOwnProperty('gen_adrc_2')) {
						oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
						oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
					}

					this._handleSaveWithLifnr(oData);
				}

			}

		},

		_handleSaveWithLifnr: function (oData) {
			oData = Object.assign({}, oData);
			oData.parentDTO.customData.vnd_lfa1.SORTL = (oData.parentDTO.customData.vnd_lfa1.MCOD1 && oData.parentDTO.customData.vnd_lfa1.MCOD1
				.length > 10) ? oData.parentDTO.customData.vnd_lfa1.MCOD1.slice(0, 10) : oData.parentDTO.customData.vnd_lfa1.MCOD1;
			if (oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === undefined || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 ===
				"" || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === null) {
				oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oData.parentDTO.customData.vnd_lfa1.Name1;
			}
			if (oData.parentDTO.customData.vnd_lfa1.KTOKK !== "JVPR") {
				delete oData.parentDTO.customData.pra_bp_ad;
				delete oData.parentDTO.customData.pra_bp_vend_esc;
				delete oData.parentDTO.customData.pra_bp_cust_md;
				delete oData.parentDTO.customData.pra_bp_vend_md;
				delete oData.parentDTO.customData.gen_adrc.gen_adrc_2;

			} else if (oData.parentDTO.customData.gen_adrc.gen_adrc_2 && oData.parentDTO.customData.gen_adrc.gen_adrc_2.addr_type === null) {
				delete oData.parentDTO.customData.gen_adrc.gen_adrc_2;
			}
			if (oData.parentDTO.customData.vnd_lfa1.KTOKK === "MNFR") {
				if (Object.keys(oData.parentDTO.customData.vnd_lfb1).length === 0) {
					oData.parentDTO.customData.vnd_lfb1 = {
						"vnd_lfb1_1": {
							"entity_id": oData.parentDTO.customData.vnd_lfa1.entity_id,
							"lifnr": oData.parentDTO.customData.vnd_lfa1.lifnr,
							"bukrs": "",
							"AKONT": "",
							"LNRZE": null,
							"BEGRU": null,
							"MINDK": null,
							"ZUAWA": "",
							"FDGRV": null,
							"VZSKZ": null,
							"ZINRT": null,
							"ZINDT": null,
							"DATLZ": null,
							"ALTKN": null,
							"PERNR": null,
							"ZTERM": "",
							"KULTG": null,
							"REPRF": "",
							"ZWELS": "",
							"LNRZB": null,
							"WEBTR": null,
							"UZAWE": null,
							"ZAHLS": " ",
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
						}
					};
				}
				if (Object.keys(oData.parentDTO.customData.vnd_lfbw).length === 0) {
					oData.parentDTO.customData.vnd_lfbw = {
						"vnd_lfbw_1": {
							"entity_id": oData.parentDTO.customData.vnd_lfa1.entity_id,
							"lifnr": oData.parentDTO.customData.vnd_lfa1.lifnr,
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
							"bukrs": ""
						}
					};
				}
			}
			if (oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKL) {
				oData.parentDTO.customData.gen_bnka.gen_bnka_1.bankl = oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKL;
			}
			if (oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKS) {
				oData.parentDTO.customData.gen_bnka.gen_bnka_1.banks = oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKS;
			}
			/*oData.parentDTO.customData.gen_bnka.gen_bnka_1.banka = "";
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.ort01 = "";
			oData.parentDTO.customData.gen_bnka.gen_bnka_1.stras = "";*/
			oData.parentDTO.customData.gen_adrc.gen_adrc_1.region = oData.parentDTO.customData.vnd_lfa1.REGIO;
			var aLFB1Objs = Object.keys(oData.parentDTO.customData.vnd_lfb1);
			aLFB1Objs.forEach(function (key, index) {
				var sProerty = 'vnd_lfbw_' + (index + 1);
				oData.parentDTO.customData.vnd_lfbw[sProerty].bukrs = oData.parentDTO.customData.vnd_lfb1[key].bukrs;
			});

			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/update",
				hasPayload: true,
				data: oData,
				type: 'POST'
			};

			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				if (oDataResp.result) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRDDResp", oDataResp.result);
					// this.getView().byId("idCreateVendorSubmit").setVisible(true);
					this.getAllCommentsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));
					this.getAllDocumentsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));
					this.getAuditLogsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));

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
					/*case "Bank Key":
						aData = oModel.getProperty("/BankKeyData");
						break;*/
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
				} else if (oData.table === "VW_BNKA") {
					objParamCreate = {
						url: "/murphyCustom/config-service/configurations/configuration/filter",
						type: 'POST',
						hasPayload: true,
						data: {
							"configType": oData.table,
							"currentPage": 1
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
						var sProperty = this._oInput.getBindingInfo("value").parts[0].path.split("/").slice(-2).join("/");
						if (sProperty === "vnd_lfa1/REGIO") {
							var sCountry = this.getView().getModel("CreateVendorModel").getProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1");
							if (sCountry) {
								oDataResp.result.modelMap = oDataResp.result.modelMap.filter(function (e) {
									return e.land1 === sCountry;
								})
							}
						} else if (sProperty === "gen_adrc_2/region") {
							var sCountry = this.getView().getModel("CreateVendorModel").getProperty(
								"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_2/land1");
							if (sCountry) {
								oDataResp.result.modelMap = oDataResp.result.modelMap.filter(function (e) {
									return e.land1 === sCountry;
								})
							}
						}
						// var sCountryVndDetailAddress = this.byId("idERPVendorCountry").getValue();
						// if (this._oInput.getId().indexOf("idERPVendorRegion") > -1) {
						// 	if (sCountryVndDetailAddress) {
						// 		oDataResp.result.modelMap = oDataResp.result.modelMap.filter(function (e) {
						// 			return e.land1 === sCountryVndDetailAddress
						// 		})
						// 	}
						// }

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
						var obj = {};
						obj[oData["key"]] = "";
						obj[oData["text"]] = ""
						oDataResp.result.vendorDTOs.unshift(obj);
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
				oFilterBar.addCustomData(new sap.ui.core.CustomData({
					key: "table",
					value: oData.table
				}))
				oFilterBar.setFilterBarExpanded(true);
				oFilterBar.setBasicSearch(this._oBasicSearchField);
				oFilterBar.setModel(this.oColModel, "columns");

				this._oValueHelpDialog.getTableAsync().then(function (oTable) {
					oTable.setModel(this.oTableDataModel);
					oTable.setModel(this.oColModel, "columns");

					//Apply filters
					var aFilters = [];
					var sTaxCode = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData/lfbw/WT_WITHCD");
					var sTaxType = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData/lfbw/witht");
					var sLandTax = this.byId("idWithHoldTaxCtry").getValue();
					if (oData.table === "T059P") { //Tax type
						if (sLandTax) {
							aFilters.push(new Filter("land1", FilterOperator.EQ, sLandTax));
						}
					}

					if (oData.table === "T059Z") { //Tax code
						if (sLandTax) {
							aFilters.push(new Filter("land1", FilterOperator.EQ, sLandTax));
						}
						if (sTaxType) {
							aFilters.push(new Filter("witht", FilterOperator.EQ, sTaxType));
						}
					}

					if (oData.table === "T059C") { //Recipient type
						if (sTaxCode) {
							aFilters.push(new Filter("witht", FilterOperator.EQ, sTaxType));
						}
						if (sLandTax) {
							aFilters.push(new Filter("land1", FilterOperator.EQ, sLandTax));
						}
					}

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", {
							path: "/item",
							filters: aFilters
						});
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
				if (oVal.bankl && oVal.bankl.length > 0) {
					var sDiff = 9 - (oVal.bankl.length);
					for (var i = 0; i < sDiff; i++) {
						oVal.bankl = '0' + oVal.bankl;
					}
				}
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKL', oVal.bankl);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/banka', oVal.banka);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/stras', oVal.stras);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/ort01', oVal.ort01);
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKS', oVal.banks);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			} else if (oEvent.getSource().getModel("oViewModel").getProperty("/title") === "Language") {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/langu', oVal.laiso);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			} else if (oEvent.getSource().getModel("oViewModel").getProperty("/title") === "Country") {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/country', oVal.land1);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			}

			var sProperty = this._oInput.getBindingInfo("value").parts[0].path.split("/").slice(-2).join("/");
			if (sProperty === "vnd_lfa1/LAND1") {
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/REGIO", "");
			} else if (sProperty === "gen_adrc_2/land1") {
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_2/region", "");
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
				aSelectionSet = oEvent.getParameter("selectionSet"),
				sTableName = oEvent.getSource().getCustomData()[0].getValue();
			if (sTableName === "VW_BNKA") {
				var oParameters = {
					"configType": sTableName,
					"currentPage": 1,
					"configFilters": {

					}
				};
				aSelectionSet.forEach(function (oItem) {
					if (oItem.getValue()) {
						oParameters.configFilters[
							oItem.getModel("oViewModel").getProperty("/cols/" + oItem.getId().split("-")[oItem.getId().split("-").length -
								1] + "/template")
						] = oItem.getValue()
					}
				});
				this.getFilteredValues(oParameters);

			} else {
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
			}
		},

		getFilteredValues: function (oParameters) {
			var oObject = {
				url: "/murphyCustom/config-service/configurations/configuration/filter",
				type: 'POST',
				hasPayload: true,
				data: oParameters
			};
			this.serviceCall.handleServiceRequest(oObject).then(function (oDataResp) {
				this.oTableDataModel.setProperty("/item", oDataResp.result.modelMap);
				this.oTableDataModel.refresh();
				oValueHelpDialog.update();
			}.bind(this));
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
			var sValue = oEvent.getSource().getCustomData()[0].getValue();
			if (sValue && sValue !== "addComp") {
				if (oEvent.getParameter("selected")) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData" + sKey, "X");
				} else {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData" + sKey, "");
				}
			} else if (sValue && sValue === "addComp") {
				if (oEvent.getParameter("selected")) {
					this.getView().getModel("CreateVendorModel").setProperty(sKey, "X");
				} else {
					this.getView().getModel("CreateVendorModel").setProperty(sKey, "");
				}
			}
			this.getView().getModel("CreateVendorModel").refresh(true);
		},

		onCheckClick: function () {
			// updating the street/ house no.
			var sHouseNo = this.getOwnerComponent().getModel("CreateVendorModel").getProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/house_num1");
			var sStreet = this.getOwnerComponent().getModel("CreateVendorModel").getProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/street");
			sHouseNo = sHouseNo === null ? '' : sHouseNo;
			sStreet = sStreet === null ? '' : " " + sStreet;
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/STRAS", (sHouseNo + sStreet));

			var aMandFields = this.getView().getModel("CreateVendorModel").getProperty("/createMandtFields");
			var aEmptyFields = [];
			var oData = this.getView().getModel("CreateVendorModel");
			var oController = this;
			var sBankKey =	oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKL");
			var sBankNumber = oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKN");
			var oBankNumControl = oController.getView().byId("idBankNumber");
				
			if (!oData.getProperty("/addCompanyCodeRows").length) {
				this.onAddCompanyCode("onCheck");
			}
			aMandFields.forEach(function (oItem) {
				var oControl = oController.getView().byId(oItem.id);
				var sValueState = "None";
				if (!oItem.isPRAData && !oItem.isPurOrgData && (oData.getProperty(oItem.fieldMapping) === undefined || oData.getProperty(oItem.fieldMapping) ===
						"" ||
						oData.getProperty(oItem.fieldMapping) === null)) {
					aEmptyFields.push(oItem);
					sValueState = "Error";
				} else if ((oItem.isPRAData && !oItem.isPurOrgData && (oData.getProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") === "JVPR")) &&
					(oData.getProperty(oItem
							.fieldMapping) === undefined || oData.getProperty(oItem.fieldMapping) === "" ||
						oData.getProperty(oItem.fieldMapping) === null)) {
					aEmptyFields.push(oItem);
					sValueState = "Error";
				} else if (oItem.isPurOrgData &&
					((oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") === "VEND") || (oData.getProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") === "GENV")) &&
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
			if (!oData.getProperty("/addCompanyCodeRows").length && oData.getProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") !== "MNFR") {
				aEmptyFields.push({
					section: "Company Code"
				})
			}
			
			if(sBankKey && !sBankNumber){
				aEmptyFields.push({
					"id": "idBankNumber",
					"Name": "Bank Account Number",
					"Key": "BANKN",
					"fieldMapping": "/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKN",
					"panelMapping": "Bank Accounts",
					"isPRAData": false,
					"isPurOrgData" : false,
					"isMNFRData" : false
				});
				oBankNumControl.setValueState("Error");
			}else{
					oBankNumControl.setValueStart("None");
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
									title: {
										parts: ['CreateVendorModel>Name', 'CreateVendorModel>panelMapping', 'CreateVendorModel>section'],
										formatter: this.formatCheckErrorMessage
									}
									//title: "{= ${CreateVendorModel>section} ? 'No ${CreateVendorModel>section} is maintained in ${CreateVendorModel>section} Section.'  : '${CreateVendorModel>Name} field is missing in ${CreateVendorModel>panelMapping} Section.'}"

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
				sMsg = "No " + sSection + " is maintained in " + sSection + " table";
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

		onAddCompanyCode: function (sCheck, oParam) {
			var sPathForCompanyCodeMandatoryField = "/companyCodeMandateFields";
			if (this._checkValidationforFields(sPathForCompanyCodeMandatoryField)) {
				var aLFB1WFormData = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData");
				var aLFB1WTableData = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeRows");
				if (oParam && oParam.index) {
					this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeRows/" + oParam.index, aLFB1WFormData);
					this.getView().byId("companyCodeAddBtmID").setEnabled(true);
					sCheck.getSource().setVisible(false);
				} else {
					aLFB1WTableData.push(aLFB1WFormData);
				}
				this.getView().getModel("CreateVendorModel").setProperty(
					"/addCompanyCodeFormData", {
						"lfb1": {
							"entity_id": null,
							"bukrs": null,
							"AKONT": null,
							"LNRZE": null,
							"BEGRU": null,
							"MINDK": null,
							"ZUAWA": "001",
							"FDGRV": null,
							"VZSKZ": null,
							"ZINRT": null,
							"ZINDT": null,
							"DATLZ": null,
							"ALTKN": null,
							"PERNR": null,
							"ZTERM": null,
							"KULTG": null,
							"REPRF": "X",
							"ZWELS": null,
							"LNRZB": null,
							"WEBTR": null,
							"UZAWE": null,
							"ZAHLS": " ",
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
			} else if (typeof (sCheck) === "object") {
				MessageToast.show("Please Enter all Mandatory Fields for Company Code");
			}

		},

		onCompanyCodeEditPress: function (oEvent) {
			this.getView().byId("companyCodeAddBtmID").setEnabled(false);
			oEvent.getSource().getParent().getItems()[2].setVisible(true);
			var oData = Object.assign({}, oEvent.getSource().getBindingContext("CreateVendorModel").getObject());
			var oTableItemData = Object.assign({}, {
				lfb1: Object.assign({}, oData.lfb1),
				lfbw: Object.assign({}, oData.lfbw)
			});
			this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData", Object.assign({}, oTableItemData));
		},

		onCompanyCodeSavePress: function (oEvent) {
			var oFormData = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData");
			var nIndex = oEvent.getSource().getBindingContext("CreateVendorModel").getPath().split("/")[2];
			// this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeRows/" + nIndex, oFormData);
			this.onAddCompanyCode(oEvent, {
				index: nIndex
			});
		},

		onCompanYCodeDeletePress: function (oEvent) {
			var nIndex = oEvent.getSource().getBindingContext("CreateVendorModel").getPath().split("/")[2];
			this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeRows").splice(nIndex, 1)
			this.getView().getModel("CreateVendorModel").refresh();
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
		},

		handleERPPOBOXPostalCode: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/po_box", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/post_code1", oEvent.getSource().getValue());
		},

		onAddCommentCreateCR: function () {
			this.onAddComment({
				sEntityID: this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"),
				comment: this.getView().byId("createERPVendorCommentBoxId").getValue(),
				sControlID: "createERPVendorCommentBoxId"
			});
		},
		handleERPVendorName2: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/name2", oEvent.getSource().getValue());

		},
		onERPTitleChange: function (oEvent) {
			//	debugger;
			//var sSelectedKey = oEvent.getSource().getSelectedKey();
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/title", oEvent.getSource().getSelectedKey());

		},
		handleAddressSection: function (oEvent) {
			if (oEvent.getParameter('expand')) {
				var sHouseNo = this.getOwnerComponent().getModel("CreateVendorModel").getProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/house_num1");
				var sStreet = this.getOwnerComponent().getModel("CreateVendorModel").getProperty(
					"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/street");
				sHouseNo = sHouseNo === null ? '' : sHouseNo;
				sStreet = sStreet === null ? '' : " " + sStreet;
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/STRAS", (sHouseNo + sStreet));
			}
		},
		onHandleCityValue: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/city1", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_2/city1", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/ORT01", oEvent.getSource().getValue());
		},

		handleERPVendorPostalCodeFix: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PSTL2", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/po_box", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/post_code1", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PFACH", oEvent.getSource().getValue());
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