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
	"sap/m/MessageBox",
], function (BaseController, JSONModel, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, Fragment,
	ServiceCall, StandardListItem, Dialog, MessageToast, List, Button, ButtonType, MessageBox) {
	"use strict";

	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.CreateERPVendor", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
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
					this.getOwnerComponent().getModel("reasonDropdownfilterModel").setProperty("/VendorRasons", oDataResp.result.modelMap[0].VENDOR_CR_REASON);
					this._filteringReason();

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
					"controlField": "j_1AFITP",
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
				}, {
					"controlID": "Country",
					"controlTable": "T005",
					"controlField": "land1",
					"controlFieldName": "landx"
				}, {
					"controlID": "Region",
					"controlTable": "T005S",
					"controlField": "bland",
					"controlFieldName": "bezei"
				}, {
					"controlID": "industryDesID",
					"controlTable": "T016T",
					"controlField": "brsch",
					"controlFieldName": "brtxt"
				}, {
					"controlID": "idComCodesCompanyCode",
					"controlTable": "T001",
					"controlField": "bukrs",
					"controlFieldName": "butxt"
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
					var sControlID = item.controlID;
					if (sControlID === "Country" || sControlID === "Region") {
						that.getView().getModel("countryRegionModel").setProperty("/" + sControlID, data.result);
						if (sControlID === "Region") {
							that.getView().getModel("countryRegionModel").setProperty("/RegionFiltered", Object.assign({}, data.result));
							that.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAccounting", Object.assign({}, data.result));
							that.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAddress", Object.assign({}, data.result));
						}
					} else if (sControlID === "idComCodesCompanyCode") {
						that.getOwnerComponent().getModel("genDropdownModel").setProperty('/' + sControlID, data.result.modelMap);
					} else {
						if (item.controlID === 'industryDesID') {
							data.result.modelMap.unshift({});
							that.getOwnerComponent().getModel('crERPIndustryModel').setData(data.result);
						}
						var oJsonModel = new JSONModel(data.result);
						that.getView().byId(sControlID).setModel(oJsonModel);
						if (item.controlID === 'generalDataTitleId') {
							that.getOwnerComponent().getModel('crERPTitleFilterModel').setData(data.result);
						} else if (item.controlID === 'praDataAddrTabAddressTypeId') {
							that.getOwnerComponent().getModel('praAddrTypeModel').setData(data.result);
						} else if (item.controlID === 'purOrgPurOrgId') {
							that.getOwnerComponent().getModel('purOrgPurOrgModel').setData(data.result);
						} else {
							var oItemSelectTemplate1 = new sap.ui.core.Item({
								key: "{" + item.controlField + "}",
								text: "{" + item.controlFieldName + "}"
							});
							that.getView().byId(sControlID).bindAggregation("items", "/modelMap", oItemSelectTemplate1);
							that.getOwnerComponent().getModel("genDropdownModel").setProperty('/' + item.controlID, data.result.modelMap);
							that.getOwnerComponent().getModel("genDropdownModel").refresh();
						}
					}

				}
			});
			// });
		},

		onCountryChanged: function (oEvent) {
			var sValueSelected = oEvent.getParameter("value");
			var oItemSelected = this.getView().getModel("countryRegionModel").getProperty("/Country/modelMap").filter(function (e) {
				return e.land1 === sValueSelected;
			});
			this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/REGIO", "");
			if (oItemSelected[0]) {
				var aRegionSuggestion = this.getView().getModel("countryRegionModel").getProperty("/Region/modelMap").filter(function (e) {
					return e.land1 === sValueSelected;
				});
				this.getView().getModel("countryRegionModel").setProperty("/RegionFiltered/modelMap", aRegionSuggestion);
			} else {
				oEvent.getSource().setValue("");
				this.getView().getModel("countryRegionModel").setProperty("/RegionFiltered/modelMap", this.getView().getModel("countryRegionModel")
					.getProperty("/Region/modelMap"));

			}
		},

		onRegionChanged: function (oEvent) {
			var sValueSelected = oEvent.getParameter("value");
			var oItemSelected = this.getView().getModel("countryRegionModel").getProperty("/RegionFiltered/modelMap").filter(function (e) {
				return e.bland === sValueSelected;
			});
			if (!oItemSelected[0]) {
				oEvent.getSource().setValue("");
			}
		},

		onCountryChangedPRAAccounting: function (oEvent) {
			var sValueSelected = oEvent.getParameter("value");
			var oItemSelected = this.getView().getModel("countryRegionModel").getProperty("/Country/modelMap").filter(function (e) {
				return e.land1 === sValueSelected;
			});
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1/kgreg", "");
			if (oItemSelected[0]) {
				var aRegionSuggestion = this.getView().getModel("countryRegionModel").getProperty("/Region/modelMap").filter(function (e) {
					return e.land1 === sValueSelected;
				});
				this.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAccounting/modelMap", aRegionSuggestion);
			} else {
				oEvent.getSource().setValue("");
				this.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAccounting/modelMap", this.getView().getModel(
						"countryRegionModel")
					.getProperty("/Region/modelMap"));

			}
		},

		onRegionChangedPRAAccounting: function (oEvent) {
			var sValueSelected = oEvent.getParameter("value");
			var oItemSelected = this.getView().getModel("countryRegionModel").getProperty("/RegionFilteredPRAAccounting/modelMap").filter(
				function (e) {
					return e.bland === sValueSelected;
				});
			if (!oItemSelected[0]) {
				oEvent.getSource().setValue("");
			}
		},

		onCountryChangedPRAAddress: function (oEvent) {
			var sValueSelected = oEvent.getParameter("value");
			var oItemSelected = this.getView().getModel("countryRegionModel").getProperty("/Country/modelMap").filter(function (e) {
				return e.land1 === sValueSelected;
			});
			this.getView().getModel("praAddressModel").setProperty(
				"/address/region", "");
			if (oItemSelected[0]) {
				var aRegionSuggestion = this.getView().getModel("countryRegionModel").getProperty("/Region/modelMap").filter(function (e) {
					return e.land1 === sValueSelected;
				});
				this.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAddress/modelMap", aRegionSuggestion);
			} else {
				oEvent.getSource().setValue("");
				this.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAddress/modelMap", this.getView().getModel(
						"countryRegionModel")
					.getProperty("/Region/modelMap"));

			}
		},

		onRegionChangedPRAAddress: function (oEvent) {
			var sValueSelected = oEvent.getParameter("value");
			var oItemSelected = this.getView().getModel("countryRegionModel").getProperty("/RegionFilteredPRAAddress/modelMap").filter(
				function (e) {
					return e.bland === sValueSelected;
				});
			if (!oItemSelected[0]) {
				oEvent.getSource().setValue("");
			}
		},

		onSaveClick: function (oEvent) {
			if (this.onCheckClick()) {
				this.getView().setBusy(true);
				var oModel = this.getView().getModel("CreateVendorModel");
				var oData = oModel.getProperty("/createCRVendorData/formData"),
					oLfm1Model = this.getView().getModel("vndLfm1"),
					oLfm1Data = oLfm1Model.getData(),
					oDate = new Date(),
					sDate = `${oDate.getFullYear()}-${("0" + (oDate.getMonth() + 1) ).slice(-2)}-${("0" + oDate.getDate()).slice(-2)}`;

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

							if (oData.parentDTO.customData.vnd_lfm1) {
								var iLfm1 = 1;
								oLfm1Data.rows.forEach(oItem => {
									oItem.lifnr = sLifnr;
									oItem.entity_id = oData.parentDTO.customData.vnd_lfa1.entity_id;
									oData.parentDTO.customData.vnd_lfm1["vnd_lfm1_" + iLfm1] = oItem;
									iLfm1 = iLfm1 + 1;
								});
								if (!oData.parentDTO.customData.vnd_lfm1.hasOwnProperty('vnd_lfm1_1')) {
									oData.parentDTO.customData.vnd_lfm1 = {
										"vnd_lfm1_1": {
											"entity_id": oData.parentDTO.customData.vnd_lfa1.entity_id,
											"lifnr": sLifnr,
											"ekorg": "",
											"WAERS": null,
											"MINBW": null,
											"KALSK": null,
											"ZTERM": null,
											"INCO1": null,
											"INCO2": null,
											"MEPRF": null,
											"VERKF": null,
											"LFABC": null,
											"EXPVZ": null,
											"ZOLLA": null,
											"SKRIT": null,
											"NRGEW": null,
											"PRFRE": null,
											"WEBRE": null,
											"KZABS": null,
											"KZAUT": "X",
											"BOIND": null,
											"BLIND": null,
											"ZZQUA_FLAG": null,
											"EKGRP": null,
											"BSTAE": null,
											"RDPRF": null,
											"PLIFZ": null,
											"MEGRU": null,
											"VENSL": null,
											"LISER": null,
											"LIBES": null,
											"BOPNR": null,
											"XERSR": null,
											"EIKTO": null,
											"ABUEB": null,
											"PAPRF": null,
											"AGREL": null,
											"XNBWY": null,
											"VSBED": null,
											"LEBRE": "X",
											"BOLRE": null,
											"UMSAE": null,
											"VENDOR_RMA_REQ": null,
											"OIHANTYP": null,
											"OIA_SPLTIV": null,
											"OIHVGROUP": null,
											"OIMATCYC": null,
											"ACTIVITY_PROFIL": null,
											"TRANSPORT_CHAIN": null,
											"STAGING_TIME": null,
											"INCOV": null,
											"INCO2_I": null,
											"INCO3_I": null,
											"FSH_SC_CID": null,
											"FSH_VAS_DETC": null
										}
									};
								}
							}

							//Handling Comunication data
							var aCodes = this.getView().getModel("valueHelps").getProperty("/TelCountryCodes"),
								oTelCtryCode, oMobCtryCode, oFaxCtryCode;
							if (oData.parentDTO.customData.gen_adr2) {
								if (oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number && oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_extens) {
									oData.parentDTO.customData.vnd_lfa1.TELF1 = oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number + "-" +
										oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_extens;
								}
								if (oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number && oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_extens) {
									oData.parentDTO.customData.vnd_lfa1.TELF2 = oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number + "-" +
										oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_extens;
								} else if (oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number) {
									oData.parentDTO.customData.vnd_lfa1.TELF2 = oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number;
								}
								oTelCtryCode = oData.parentDTO.customData.gen_adr2.gen_adr2_1.country ? aCodes.find(oItem => oItem.land1 === oData.parentDTO
									.customData.gen_adr2.gen_adr2_1.country) : "";
								oMobCtryCode = oData.parentDTO.customData.gen_adr2.gen_adr2_2.country ? aCodes.find(oItem => oItem.land1 === oData.parentDTO
									.customData.gen_adr2.gen_adr2_2.country) : "";
								oData.parentDTO.customData.gen_adr2.gen_adr2_1.telnr_long = oTelCtryCode ? oTelCtryCode.telefto + "" + oData.parentDTO.customData
									.gen_adr2.gen_adr2_1.tel_number : oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number;
								oData.parentDTO.customData.gen_adr2.gen_adr2_2.telnr_long = oMobCtryCode ? oMobCtryCode.telefto + "" + oData.parentDTO.customData
									.gen_adr2.gen_adr2_2.tel_number : oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number;

								oData.parentDTO.customData.gen_adr2.gen_adr2_1.telnr_call = oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number;
								oData.parentDTO.customData.gen_adr2.gen_adr2_2.telnr_call = oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number;
								oData.parentDTO.customData.gen_adr2.gen_adr2_1.client = "";
								oData.parentDTO.customData.gen_adr2.gen_adr2_2.client = "";
								oData.parentDTO.customData.gen_adr2.gen_adr2_1.addrnumber = oData.parentDTO.customData.gen_adr2.gen_adr2_1.entity_id;
								oData.parentDTO.customData.gen_adr2.gen_adr2_2.addrnumber = oData.parentDTO.customData.gen_adr2.gen_adr2_2.entity_id;

							}

							if (oData.parentDTO.customData.gen_adr3) {
								if (oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number && oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_extens) {
									oData.parentDTO.customData.vnd_lfa1.TELFX = oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number + "-" +
										oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_extens;
								}
								oFaxCtryCode = oData.parentDTO.customData.gen_adr3.gen_adr3_1.country ? aCodes.find(oItem => oItem.land1 === oData.parentDTO
									.customData.gen_adr3.gen_adr3_1.country) : "";
								oData.parentDTO.customData.gen_adr3.gen_adr3_1.faxnr_call = oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number;
								oData.parentDTO.customData.gen_adr3.gen_adr3_1.addrnumber = oData.parentDTO.customData.gen_adr3.gen_adr3_1.entity_id;
								oData.parentDTO.customData.gen_adr3.gen_adr3_1.client = "";
								oData.parentDTO.customData.gen_adr3.gen_adr3_1.faxnr_long = oFaxCtryCode ? oFaxCtryCode.telefto + "" + oData.parentDTO.customData
									.gen_adr3.gen_adr3_1.fax_number : oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number;
							}
							//Add Emails
							var aEmails = this.getView().getModel("emails").getData();
							oData.parentDTO.customData.gen_adr6 = {};
							aEmails.forEach((oEmail, iIndex) => {
								oData.parentDTO.customData.gen_adr6["gen_adr6_" + (iIndex + 1)] = {
									"entity_id": oData.parentDTO.customData.gen_adr2.gen_adr2_1.entity_id,
									"addrnumber": oData.parentDTO.customData.gen_adr2.gen_adr2_1.entity_id,
									"persnumber": "",
									"date_from": sDate,
									"consnumber": iIndex + 1,
									"flgdefault": iIndex + 1 <= 1 ? "X" : "",
									"flg_nouse": null,
									"home_flag": iIndex + 1 <= 1 ? "X" : "",
									"smtp_addr": oEmail.mail,
									"smtp_srch": oEmail.mail.toUpperCase().slice(0, 20),
									"dft_receiv": null,
									"r3_user": null,
									"encode": null,
									"tnef": null,
									"valid_from": null,
									"valid_to": null,
									"client": "",
									"ttx_number": null
								};
							});

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
							/*if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.gen_adrc_2) {
								oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
								oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
							}*/

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
					if (oData.parentDTO.customData.vnd_lfm1 /*&& */ ) {
						var iLfm1 = 1;
						oLfm1Data.rows.forEach(oItem => {
							oItem.lifnr = sLIFNR;
							oItem.entity_id = oData.parentDTO.customData.vnd_lfa1.entity_id;
							oData.parentDTO.customData.vnd_lfm1["vnd_lfm1_" + iLfm1] = oItem;
						});
						if (!oData.parentDTO.customData.vnd_lfm1.hasOwnProperty('vnd_lfm1_1')) {
							oData.parentDTO.customData.vnd_lfm1 = {
								"vnd_lfm1_1": {
									"lifnr": sLIFNR,
									"entity_id": oData.parentDTO.customData.vnd_lfa1.entity_id,
									"ekorg": "",
									"WAERS": null,
									"MINBW": null,
									"KALSK": null,
									"ZTERM": null,
									"INCO1": null,
									"INCO2": null,
									"MEPRF": null,
									"VERKF": null,
									"LFABC": null,
									"EXPVZ": null,
									"ZOLLA": null,
									"SKRIT": null,
									"NRGEW": null,
									"PRFRE": null,
									"WEBRE": null,
									"KZABS": null,
									"KZAUT": "X",
									"BOIND": null,
									"BLIND": null,
									"ZZQUA_FLAG": null,
									"EKGRP": null,
									"BSTAE": null,
									"RDPRF": null,
									"PLIFZ": null,
									"MEGRU": null,
									"VENSL": null,
									"LISER": null,
									"LIBES": null,
									"BOPNR": null,
									"XERSR": null,
									"EIKTO": null,
									"ABUEB": null,
									"PAPRF": null,
									"AGREL": null,
									"XNBWY": null,
									"VSBED": null,
									"LEBRE": "X",
									"BOLRE": null,
									"UMSAE": null,
									"VENDOR_RMA_REQ": null,
									"OIHANTYP": null,
									"OIA_SPLTIV": null,
									"OIHVGROUP": null,
									"OIMATCYC": null,
									"ACTIVITY_PROFIL": null,
									"TRANSPORT_CHAIN": null,
									"STAGING_TIME": null,
									"INCOV": null,
									"INCO2_I": null,
									"INCO3_I": null,
									"FSH_SC_CID": null,
									"FSH_VAS_DETC": null
								}
							};
						}else{
							oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.entity_id =  oData.parentDTO.customData.vnd_lfa1.entity_id;
							oData.parentDTO.customData.vnd_lfm1.vnd_lfm1_1.lifnr = sLIFNR ;
						}
					}
					//Handling Comunication data
					var aCodes = this.getView().getModel("valueHelps").getProperty("/TelCountryCodes"),
					oTelCtryCode,oMobCtryCode,oFaxCtryCode;
						if (oData.parentDTO.customData.gen_adr2) {
							if (oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number && oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_extens) {
								oData.parentDTO.customData.vnd_lfa1.TELF1 = oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number + "-" +
									oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_extens;
							}
							if (oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number && oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_extens) {
								oData.parentDTO.customData.vnd_lfa1.TELF2 = oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number + "-" +
									oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_extens;
							} else if (oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number) {
								oData.parentDTO.customData.vnd_lfa1.TELF2 = oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number;
							}
							oTelCtryCode = oData.parentDTO.customData.gen_adr2.gen_adr2_1.country ? aCodes.find(oItem => oItem.land1 === oData.parentDTO
								.customData.gen_adr2.gen_adr2_1.country) : "";
							oMobCtryCode = oData.parentDTO.customData.gen_adr2.gen_adr2_2.country ? aCodes.find(oItem => oItem.land1 === oData.parentDTO
								.customData.gen_adr2.gen_adr2_2.country) : "";
							oData.parentDTO.customData.gen_adr2.gen_adr2_1.telnr_long = oTelCtryCode ? oTelCtryCode.telefto + "" + oData.parentDTO.customData
								.gen_adr2.gen_adr2_1.tel_number : oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number;
							oData.parentDTO.customData.gen_adr2.gen_adr2_2.telnr_long = oMobCtryCode ? oMobCtryCode.telefto + "" + oData.parentDTO.customData
								.gen_adr2.gen_adr2_2.tel_number : oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number;
							oData.parentDTO.customData.gen_adr2.gen_adr2_1.telnr_call = oData.parentDTO.customData.gen_adr2.gen_adr2_1.tel_number;
							oData.parentDTO.customData.gen_adr2.gen_adr2_2.telnr_call = oData.parentDTO.customData.gen_adr2.gen_adr2_2.tel_number;
							oData.parentDTO.customData.gen_adr2.gen_adr2_1.addrnumber = oData.parentDTO.customData.gen_adr2.gen_adr2_1.entity_id;
							oData.parentDTO.customData.gen_adr2.gen_adr2_2.addrnumber = oData.parentDTO.customData.gen_adr2.gen_adr2_2.entity_id;
							oData.parentDTO.customData.gen_adr2.gen_adr2_1.client = "";
							oData.parentDTO.customData.gen_adr2.gen_adr2_2.client = "";

						}
					if (oData.parentDTO.customData.gen_adr3) {
						if (oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number && oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_extens) {
							oData.parentDTO.customData.vnd_lfa1.TELFX = oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number + "-" +
								oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_extens;

						}
						oFaxCtryCode = oData.parentDTO.customData.gen_adr3.gen_adr3_1.country ? aCodes.find(oItem => oItem.land1 === oData.parentDTO
							.customData.gen_adr3.gen_adr3_1.country) : "";

						oData.parentDTO.customData.gen_adr3.gen_adr3_1.faxnr_call = oData.parentDTO.customData.gen_adr3.gen_adr3_1.fax_number;
						oData.parentDTO.customData.gen_adr3.gen_adr3_1.addrnumber = oData.parentDTO.customData.gen_adr3.gen_adr3_1.entity_id;
						oData.parentDTO.customData.gen_adr3.gen_adr3_1.client = "";
					}

					//Add Emails
					var aEmails = this.getView().getModel("emails").getData();
					oData.parentDTO.customData.gen_adr6 = {};
					aEmails.forEach((oEmail, iIndex) => {
						oData.parentDTO.customData.gen_adr6["gen_adr6_" + (iIndex + 1)] = {
							"entity_id": oData.parentDTO.customData.gen_adr2.gen_adr2_1.entity_id,
							"addrnumber": oData.parentDTO.customData.gen_adr2.gen_adr2_1.entity_id,
							"persnumber": "",
							"date_from": sDate,
							"consnumber": iIndex + 1,
							"flgdefault": iIndex + 1 <= 1 ? "X" : "",
							"flg_nouse": null,
							"home_flag": iIndex + 1 <= 1 ? "X" : "",
							"smtp_addr": oEmail.mail,
							"smtp_srch": oEmail.mail.toUpperCase().slice(0, 20),
							"dft_receiv": null,
							"r3_user": null,
							"encode": null,
							"tnef": null,
							"valid_from": null,
							"valid_to": null,
							"client": "",
							"ttx_number": null
						};
					});

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
					/*if (oData.parentDTO.customData.gen_adrc && oData.parentDTO.customData.gen_adrc.hasOwnProperty('gen_adrc_2')) {
						oData.parentDTO.customData.gen_adrc.gen_adrc_2.country = oData.parentDTO.customData.vnd_lfa1.LAND1;
						oData.parentDTO.customData.gen_adrc.gen_adrc_2.date_from = oData.parentDTO.customData.gen_adrc.gen_adrc_1.date_from;
					}*/

					this._handleSaveWithLifnr(oData);
				}

			}

		},

		_handleSaveWithLifnr: function (oData) {
			var oPraAddress = this.getView().getModel("praAddressModel").getData();
			oData = Object.assign({}, oData);
			oData.parentDTO.customData.vnd_lfa1.SORTL = (oData.parentDTO.customData.vnd_lfa1.MCOD1 && oData.parentDTO.customData.vnd_lfa1.MCOD1
				.length > 10) ? oData.parentDTO.customData.vnd_lfa1.MCOD1.slice(0, 10) : oData.parentDTO.customData.vnd_lfa1.MCOD1;
			if (oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === undefined || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 ===
				"" || oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 === null) {
				oData.parentDTO.customData.gen_adrc.gen_adrc_1.name1 = oData.parentDTO.customData.vnd_lfa1.Name1;
			}
			if (oData.parentDTO.customData.vnd_lfa1.KTOKK !== "JVPR" && oData.parentDTO.customData.vnd_lfa1.KTOKK !== "OGPR") {
				delete oData.parentDTO.customData.pra_bp_ad;
				delete oData.parentDTO.customData.pra_bp_vend_esc;
				delete oData.parentDTO.customData.pra_bp_cust_md;
				delete oData.parentDTO.customData.pra_bp_vend_md;
				delete oData.parentDTO.customData.gen_adrc.gen_adrc_2;

			} else {
				var oDate = new Date();
				var sResultDate = `${oDate.getFullYear()}-${("0" + (oDate.getMonth() + 1) ).slice(-2)}-${("0" + oDate.getDate()).slice(-2)}`;
				oPraAddress.rows.forEach(function (oItem, index) {
					oItem.entity_id = oData.parentDTO.customData.vnd_lfa1.entity_id;
					oItem.addrnumber = oData.parentDTO.customData.vnd_lfa1.entity_id + "_" + (index + 1);
					oItem.date_from = sResultDate;
					oItem.nation = '';
					oData.parentDTO.customData.gen_adrc["gen_adrc_" + (index + 2)] = oItem;
					oData.parentDTO.customData.pra_bp_ad["pra_bp_ad_" + (index + 1)] = {
						"entity_id": oData.parentDTO.customData.vnd_lfa1.entity_id,
						"addr_type": oItem.addr_type,
						"adrnr": oItem.addrnumber,
						"custid": null,
						"vendid": oData.parentDTO.customData.vnd_lfa1.lifnr,
						"oiu_cruser": null,
						"oiu_timestamp": null
					};
				});
			}
			/*else if (oData.parentDTO.customData.gen_adrc.gen_adrc_2 && oData.parentDTO.customData.gen_adrc.gen_adrc_2.addr_type === null) {
				delete oData.parentDTO.customData.gen_adrc.gen_adrc_2;
			}*/
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

			if (oData.parentDTO.customData.vnd_lfbk && oData.parentDTO.customData.vnd_lfbk.hasOwnProperty('vnd_lfbk_1') && oData.parentDTO.customData
				.vnd_lfbk.vnd_lfbk_1.BANKL) {
				oData.parentDTO.customData.gen_bnka.gen_bnka_1.bankl = oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKL;
				if (oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKS) {
					oData.parentDTO.customData.gen_bnka.gen_bnka_1.banks = oData.parentDTO.customData.vnd_lfbk.vnd_lfbk_1.BANKS;
				}
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
					this.getView().getModel("CreateVendorModel").setProperty("/vndEdit", false);
					this.getOwnerComponent().getModel("CreateVendorModel").setProperty('/changeReq/genData/isClaimable', true);
					var sID = this.getView().getParent().getPages().find(function (e) {
						return e.getId().indexOf("erpVendorPreview") !== -1;
					}).getId();
					this.getView().getParent().to(sID);
					this.getView().getModel("CreateVendorModel").setProperty("/preview", true);
					this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", false);
					this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
					this.getView().getModel("CreateVendorModel").setProperty("/vndEdit", false);

				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Error In Creating Draft Version");
			}.bind(this));
		},

		onValueHelpRequested: function (oEvent) {
			this.getView().setBusy(true);
			this._oInput = oEvent.getSource();
			var aCustomData = this._oInput.getCustomData();
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
				case "Account Clerk":
					aData = oModel.getProperty("/T001S");
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
						var sProperty = (this._oInput.getBindingInfo("value")) ? this._oInput.getBindingInfo("value").parts[0].path.split("/").slice(-
							2).join("/") : "";
						if (sProperty === "vnd_lfa1/REGIO") {
							var sCountry = this.getView().getModel("CreateVendorModel").getProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1");
							if (sCountry) {
								oDataResp.result.modelMap = oDataResp.result.modelMap.filter(function (e) {
									return e.land1 === sCountry;
								});
							}
						} else if (sProperty === "address/region") {
							var sCountry = this.getView().getModel("praAddressModel").getProperty(
								"/address/country");
							if (sCountry) {
								oDataResp.result.modelMap = oDataResp.result.modelMap.filter(function (e) {
									return e.land1 === sCountry;
								});
							}
						} else if (sProperty === "pra_bp_vend_md_1/kgreg") {
							var sCountry = this.getView().getModel("CreateVendorModel").getProperty(
								"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1/kglnd");
							if (sCountry) {
								oDataResp.result.modelMap = oDataResp.result.modelMap.filter(function (e) {
									return e.land1 === sCountry;
								});
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
						obj[oData["text"]] = "";
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
						obj[oData["text"]] = "";
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
				}));
				oFilterBar.setFilterBarExpanded(true);
				if (oData.table !== "VW_BNKA") {
					oFilterBar.setBasicSearch(this._oBasicSearchField);
				}
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
					this.getView().setBusy(false);
				}.bind(this));
				this._oValueHelpDialog.open();
				this.getView().setBusy(false);
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
			var sTitle = oEvent.getSource().getModel("oViewModel").getProperty("/title");
			if (sTitle === "Company Code") {
				this.getView().getModel("CreateVendorModel").setProperty(
					"/addCompanyCodeFormData/vnd_lfbw/bukrs", oVal[this._sKey]);
				var sSelectedKey = oVal[this._sKey];
				var aPaymentMethodData = this.getOwnerComponent().getModel('CreateVendorModel').getProperty('/paymentMethodData');
				var obj = aPaymentMethodData.find(oItem => Number(oItem.compCode) === Number(sSelectedKey));
				if (obj && obj.payMethod) {
					this.getOwnerComponent().getModel('CreateVendorModel').setProperty('/paymentMehtodBinding', obj.payMethod);
					this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
				}
			} else if (sTitle === "Bank Key") {
				/*if (oVal.bankl && oVal.bankl.length > 0) {
					var sDiff = 9 - (oVal.bankl.length);
					for (var i = 0; i < sDiff; i++) {
						oVal.bankl = '0' + oVal.bankl;
					}
				}*/
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
			} else if (sTitle === "Language") {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/langu', oVal.laiso);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			} else if (sTitle === "Country") {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/country', oVal.land1);
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			} else if (sTitle === "Withholding Tax Country" || sTitle === "Withholding Tax Type" || sTitle === "Withholding Tax Code" || sTitle ===
				"Recipient Type" || sTitle === "Exemption Reason") {
				this.onWithHoldDataChanged();
			}

			var sProperty = this._oInput.getBindingInfo("value").parts[0].path.split("/").slice(-2).join("/");
			if (sProperty === "vnd_lfa1/LAND1") {
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/REGIO", "");
				var aRegionSuggestion = this.getView().getModel("countryRegionModel").getProperty("/Region/modelMap").filter(function (e) {
					return e.land1 === oVal.land1;
				});
				this.getView().getModel("countryRegionModel").setProperty("/RegionFiltered/modelMap", aRegionSuggestion);
			} else if (sProperty === "address/country") {
				this.getView().getModel("praAddressModel").setProperty(
					"/address/region", "");
				var aRegionSuggestion = this.getView().getModel("countryRegionModel").getProperty("/Region/modelMap").filter(function (e) {
					return e.land1 === oVal.land1;
				});
				this.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAddress/modelMap", aRegionSuggestion);
			} else if (sProperty === "pra_bp_vend_md_1/kglnd") {
				this.getView().getModel("CreateVendorModel").setProperty(
					"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1/kgreg", "");
				var aRegionSuggestion = this.getView().getModel("countryRegionModel").getProperty("/Region/modelMap").filter(function (e) {
					return e.land1 === oVal.land1;
				});
				this.getView().getModel("countryRegionModel").setProperty("/RegionFilteredPRAAccounting/modelMap", aRegionSuggestion);
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
						] = oItem.getValue();
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
			if (sKey === "/addCompanyCodeFormData/lfbw/WT_SUBJCT") {
				this.onWithHoldDataChanged();
			}
		},

		onCheckClick: function (oEvent) {
			// updating the street/ house no.
			var sHouseNo = this.getOwnerComponent().getModel("CreateVendorModel").getProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/house_num1");
			var sStreet = this.getOwnerComponent().getModel("CreateVendorModel").getProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/street");
			sHouseNo = sHouseNo === null ? '' : sHouseNo;
			sStreet = sStreet === null ? '' : " " + sStreet;
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/STRAS", (sHouseNo + sStreet).slice(0, 34));

			var aMandFields = this.getView().getModel("CreateVendorModel").getProperty("/createMandtFields");
			var aEmptyFields = [];
			var oData = this.getView().getModel("CreateVendorModel");
			var oController = this;
			var sBankKey = oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKL");
			var sBankNumber = oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKN");
			var oBankNumControl = oController.getView().byId("idBankNumber");
			var sCountry = oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1");
			var sPostalCode = oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PSTLZ");
			if (!oData.getProperty("/addCompanyCodeRows").length) {
				this.onAddCompanyCode("onCheck");
			}
			aMandFields.forEach(function (oItem) {
				var oControl = oController.getView().byId(oItem.id);
				var sValueState = "None";
				if ((oItem.id === "idAddrStreetHouseNumber" || oItem.id === "ERPAddrHouseNoId" || oItem.id === "ERPAddrStreetId") && (oData.getProperty(
							"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") ===
						"MNFR") &&
					(oData.getProperty(oItem
							.fieldMapping) === undefined || oData.getProperty(oItem.fieldMapping) === "" ||
						oData.getProperty(oItem.fieldMapping) === null)) {
					// 		debugger;
					// aEmptyFields.push(oItem);
					// sValueState = "Error";
				} else if (!oItem.isPRAData && !oItem.isPurOrgData && (oData.getProperty(oItem.fieldMapping) === undefined || oData.getProperty(
							oItem.fieldMapping) ===
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
				} else if (oItem.isPurOrgData && (oData.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") ===
						"VEND") &&
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
				});
			}

			if (this.getView().getModel("vndLfm1").getProperty("/rows") && this.getView().getModel("vndLfm1").getProperty("/rows").length === 0 &&
				oData.getProperty(
					"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK") === "VEND") {
				aEmptyFields.push({
					section: "Purchasing Organization"
				});
			}

			if (sBankKey && !sBankNumber) {
				aEmptyFields.push({
					"id": "idBankNumber",
					"Name": "Bank Account Number",
					"Key": "BANKN",
					"fieldMapping": "/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/BANKN",
					"panelMapping": "Bank Accounts",
					"isPRAData": false,
					"isPurOrgData": false,
					"isMNFRData": false
				});
				oBankNumControl.setValueState("Error");
			} else {
				oBankNumControl.setValueState("None");
			}

			if (sCountry && sPostalCode) {
				var sPostalCodeLength = sPostalCode.length;
				var oPostalControl = oController.getView().byId("idERPVendorPostalCode");
				if (sCountry.toLowerCase() === "us" && (sPostalCodeLength !== 5 && sPostalCodeLength !== 10)) {
					aEmptyFields.push({
						section: "PostalCodeCheck",
						Name: "Postal Code should be 5 or 10 digits for USA."
					});
					oPostalControl.setValueState("Error");
				} else if (sCountry.toLowerCase() === "ca" && sPostalCodeLength !== 7) {
					aEmptyFields.push({
						section: "PostalCodeCheck",
						Name: "Postal Code should be 7 digits for Canada "
					});
					oPostalControl.setValueState("Error");
				} else if (sCountry.toLowerCase() === "us" && sPostalCodeLength == 10) {
					var oSplitValue = sPostalCode.split("");

					if (oSplitValue[5] !== "-") {
						aEmptyFields.push({
							section: "PostalCodeCheck",
							Name: "A '-' must be in the 6 place of the postal code"
						});
						oPostalControl.setValueState("Error");
					} else {
						oPostalControl.setValueState("None");
					}

				} else {
					oPostalControl.setValueState("None");
				}
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
				if (oEvent) {
					this._checkAddress();
				}
				return true;
			}
		},

		formatCheckErrorMessage: function (sName, sPanel, sSection) {
			var sMsg = "";
			if (!sSection) {
				sMsg = sName + " field is missing in " + sPanel + " Section";
			} else if (sSection === "PostalCodeCheck") {
				sMsg = sName;
			} else {
				sMsg = "No " + sSection + " is maintained in " + sSection + " table, check mandatory fields.";
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
			var oTableItemDataCurrent = Object.assign({}, {
				lfb1: Object.assign({}, oData.lfb1),
				lfbw: Object.assign({}, oData.lfbw)
			});
			this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormDataCurrent", Object.assign({}, oTableItemDataCurrent));
		},
		onCompanyCodeCopyPress: function (oEvent) {

			var oData = Object.assign({}, oEvent.getSource().getBindingContext("CreateVendorModel").getObject());
			// oData.lfb1.bukrs = "";
			// oData.lfb1.ZWELS = "";
			var oTableItemData = Object.assign({}, {
				lfb1: Object.assign({}, oData.lfb1),
				lfbw: Object.assign({}, oData.lfbw)
			});
			this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData", Object.assign({}, oTableItemData));
			this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData/lfb1/bukrs", "");
			this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData/lfb1/ZWELS", "");
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
			this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeRows").splice(nIndex, 1);
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
				var sAccountGroup = oModel.getProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/KTOKK");
				if (!oItem.isPRAData && (oModel.getProperty(oItem.fieldMapping) === undefined || oModel.getProperty(oItem.fieldMapping) === "" ||
						oModel.getProperty(oItem.fieldMapping) === null)) {
					// aEmptyFields.push(oItem);
					if (oItem.Key === 'AKONT' && sAccountGroup === "MNFR") {
						sValueState = "None";
						bCheck = true;
					} else {
						sValueState = "Error";
						bCheck = false;
					}

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
			//	this.getView().getModel("praAddressModel").setProperty("/address/city1", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/ORT01", oEvent.getSource().getValue());
		},

		handleERPVendorPostalCodeFix: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/post_code1", oEvent.getSource().getValue());
			/*this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PSTL2", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/po_box", oEvent.getSource().getValue());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PFACH", oEvent.getSource().getValue());*/
		},

		oAddPraAddress: function (oEvent) {
			var oForm = this.byId("idPraAddressForm"),
				bValid = true;
			oForm.getContent().forEach(function (oItem) {
				var sClass = oItem.getMetadata().getName();
				if (sClass !== "sap.m.Label" && sClass !== "sap.ui.core.Title") {
					var sValue = sClass === "sap.m.Input" ? oItem.getValue() : oItem.getSelectedKey();
					if (oItem.getRequired() && !sValue) {
						oItem.setValueState("Error");
						bValid = false;
					} else {
						oItem.setValueState("None");
					}
				}
			}, this);
			if (bValid) {
				var oPraAddressModel = this.getView().getModel("praAddressModel"),
					oAddressData = oPraAddressModel.getData(),
					oAddress = Object.assign({}, oAddressData.address),
					aAddress = oAddressData.rows;
				var oAddedAddress = aAddress.find(function (oItem) {
					return oItem.addr_type === oAddress.addr_type;
				});

				if (oAddedAddress) {
					MessageToast.show("Selected address type is already available in PRA Address table");
					return;
				}

				aAddress.push(oAddress);
				Object.keys(oAddressData.address).forEach(function (sKey) {
					oAddressData.address[sKey] = null;
				});
				oPraAddressModel.setData({
					rows: aAddress,
					address: oAddressData.address
				});
			} else {
				MessageToast.show("Please fill all Mandatory fields to add address");
			}
		},

		onEditPraAddress: function (oEvent) {
			var oAddrContext = oEvent.getSource().getBindingContext("praAddressModel"),
				oPraModel = this.getView().getModel("praAddressModel"),
				oAddressData = oPraModel.getData(),
				sIndex = oAddrContext.getPath().replace("/rows/", ""),
				oAddress = oAddressData.rows.splice(sIndex, 1),
				oPraBpAd = this.getView().getModel("CreateVendorModel").getProperty(
					"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad");
			var aKeys = Object.keys(oPraBpAd);
			aKeys.forEach((key, index) => {
				if (oPraBpAd[key].adrnr == oAddress[0].addrnumber) {
					// this code is auto populate the Address type in the PRA address section.
					oAddress[0].addr_type = oPraBpAd[key].addr_type;
				}
			});

			oPraModel.setData({
				rows: oAddressData.rows,
				address: oAddress[0]
			});
		},

		onDeletePraAddres: function (oEvent) {
			var oAddrContext = oEvent.getSource().getBindingContext("praAddressModel"),
				oPraModel = this.getView().getModel("praAddressModel"),
				oAddressData = oPraModel.getData(),
				sIndex = oAddrContext.getPath().replace("/rows/", "");
			oAddressData.rows.splice(sIndex, 1);
			oPraModel.setData({
				rows: oAddressData.rows,
				address: oAddressData.address
			});
		},

		handleAutoPopulatePurOrg: function (oEvent) {
			var sServiceBasedInvoice = this.getView().getModel("vndLfm1").getProperty("/lfm1/LEBRE");
			var sAutoPurOrder = this.getView().getModel("vndLfm1").getProperty("/lfm1/KZAUT");
			if (sServiceBasedInvoice !== "X") {
				this.byId("idServiceBasedInvoice").setValueState("Error");
			} else {
				this.byId("idServiceBasedInvoice").setValueState("None");
			}
			if (sAutoPurOrder !== "X") {
				this.byId("idAutoPurOrder").setValueState("Error");
			} else {
				this.byId("idAutoPurOrder").setValueState("None");
			}

		},

		onAddPurOrg: function (oEvent) {
			var oLfm1Model = this.getView().getModel("vndLfm1"),
				oLfm1Data = oLfm1Model.getData(),
				aControlIds = ["idPurOrgTermsOfPayment", "idPurOrgOrderCurrency", "purOrgPurOrgId"];
			//Check for Mandatory fields data
			if (oLfm1Data.lfm1.ekorg && oLfm1Data.lfm1.WAERS && oLfm1Data.lfm1.ZTERM) {
				aControlIds.forEach(sId => this.getView().byId(sId).setValueState("None"));
				var oLfm1 = oLfm1Data.lfm1,
					oAddedLfm1 = oLfm1Data.rows.find(oItem => oItem.ekorg === oLfm1.ekorg);
				if (oAddedLfm1) {
					MessageToast.show("Purchase Organization " + oLfm1.ekorg + " Was Added Already");
				} else {
					oLfm1Data.rows.push(Object.assign({}, oLfm1));
					Object.keys(oLfm1Data.lfm1).forEach(sKey => {
						oLfm1Data.lfm1[sKey] = null;
					});
					oLfm1Data.lfm1["LEBRE"] = "X";
					oLfm1Data.lfm1["KZAUT"] = "X";
					oLfm1Model.setData(oLfm1Data);
				}
			} else {
				aControlIds.forEach(sId => {
					this.getView().byId(sId).setValueState("Error");
				});
				MessageToast.show("Please Fill All Mandatory Fields To Add");
			}
		},

		onEditPurchaseOrg: function (oEvent) {
			var oLfm1 = oEvent.getSource().getBindingContext("vndLfm1").getObject(),
				oLfm1Model = this.getView().getModel("vndLfm1"),
				oLfm1Data = oLfm1Model.getData(),
				iIndex = oLfm1Data.rows.findIndex(oItem => oItem.ekorg === oLfm1.ekorg);
			if (iIndex > -1) {
				oLfm1Data.rows.splice(iIndex, 1);
				oLfm1Data.lfm1 = Object.assign({}, oLfm1);
				oLfm1Model.setData(oLfm1Data);
			}
		},

		onDeletePurchaseOrg: function (oEvent) {
			var oLfm1 = oEvent.getSource().getBindingContext("vndLfm1").getObject(),
				oLfm1Model = this.getView().getModel("vndLfm1"),
				oLfm1Data = oLfm1Model.getData(),
				iIndex = oLfm1Data.rows.findIndex(oItem => oItem.ekorg === oLfm1.ekorg);
			if (iIndex > -1) {
				oLfm1Data.rows.splice(iIndex, 1);
				oLfm1Model.setData(oLfm1Data);
			}
		},

		onCopyPurchaseOg: function (oEvent) {
			var oLfm1 = oEvent.getSource().getBindingContext("vndLfm1").getObject(),
				oLfm1Model = this.getView().getModel("vndLfm1"),
				oLfm1Data = oLfm1Model.getData();

			oLfm1Data.lfm1 = Object.assign({}, oLfm1);
			oLfm1Data.lfm1.ekorg = null;
			oLfm1Model.setData(oLfm1Data);
		},

		onAddEmail: function (oEvent) {
			var oEmailModel = this.getView().getModel("emails"),
				aEmails = oEmailModel.getData(),
				sText = oEvent.getParameter("value");
			if (sText) {
				aEmails.push({
					mail: sText
				});
				oEmailModel.setData(aEmails);
			}
			oEvent.getSource().setValue("");
			this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
				'/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/emailAddress', sText);
		},

		onDeleteEmail: function (oEvent) {
			var oEmail = oEvent.getSource().getBindingContext("emails").getObject(),
				oEmailModel = this.getView().getModel("emails"),
				oEmailData = oEmailModel.getData(),
				iIndex = oEmailData.findIndex(oItem => oItem.mail === oEmail.mail);
			if (iIndex > -1) {
				oEmailData.splice(iIndex, 1);
				oEmailModel.setData(oEmailData);
			}

			this.byId("idServiceBasedInvoice").setValueState("Error");
			this.byId("idAutoPurOrder").setValueState("Error");
		},

		onWithHoldDataChanged: function () {
			var sOperationKey = this.getOwnerComponent().getModel("CreateVendorModel").getProperty('/changeReq/genData/change_request_id');
			if (this.getView().getModel("CreateVendorModel").getProperty("/vndEdit") && sOperationKey && sOperationKey === 50002) {
				this.getView().setBusy(true);
				var sVendor = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData/lfb1/lifnr");
				// var sVendor = "0080050019";
				var sCompanyCode = this.getView().getModel("CreateVendorModel").getProperty("/addCompanyCodeFormData/lfbw/bukrs");
				// var sCompanyCode = "0329";
				var oDate = new Date();
				var sTime = (("" + oDate.getHours()).length > 1 ? oDate.getHours() : "0" + oDate.getHours()) + ":" + (("" + oDate.getMinutes()).length >
					1 ? oDate.getMinutes() :
					"0" + oDate.getMinutes()) + ":" + (("" + oDate.getSeconds()).length > 1 ? oDate.getSeconds() : "0" + oDate.getSeconds());
				var sDateTime = oDate.getFullYear() + "-" + (oDate.getMonth() + 1 < 10 ? ("0" + (oDate.getMonth() + 1)) : oDate.getMonth() + 1) +
					"-" + (oDate
						.getDate() < 10 ? ("0" + oDate.getDate()) : oDate.getDate()) + "T" + sTime;
				// var sDateTime = "2022-02-02T00:00:00"
				// var sSystem = (window.location.href.includes("y3vg532z8f")) ? 200 : 100;
				var sURL =
					"/sap/opu/odata/sap/ZVENDOR_WITHHOLDING_LOOKUP_SRV/VENDOR_WITHHOLDINGSet?$filter=Companycode eq '" +
					sCompanyCode + "' and Vendor eq '" + sVendor + "'and Keydate eq datetime'" + sDateTime + "'&$format=json";
				var objParamFirstCall = {
					url: "/MurphyECCOdataDest" + sURL,
					hasPayload: false,
					type: 'GET'
				};
				this.serviceCall.handleServiceRequest(objParamFirstCall).then(function (oDataResp) {
					var nBalance = 0;
					if (oDataResp.d && oDataResp.d.results && oDataResp.d.results[0] && oDataResp.d.results[0].Keybalance && oDataResp.d.results[0]
						.Keybalance.LcBal) {
						nBalance = Number(oDataResp.d.results[0].Keybalance.LcBal);
					}
					if (nBalance) {
						this._setPreviousWithHoldingData();
						this.getView().setBusy(false);
						var sMessage = oDataResp.d.results[0].Message;
						MessageBox.error(sMessage);
					} else {
						this.getView().setBusy(false);
					}
				}.bind(this), function (oError) {
					this._setPreviousWithHoldingData();
					this.getView().setBusy(false);
					MessageBox.error("Error In Getting Balace for Withholding, Changes in Withholding section are not allowed");
				}.bind(this));

			}
		},

		_setPreviousWithHoldingData: function () {
			var aWithHoldingDataField = ["lfbw/witht", "lfbw/WT_WITHCD", "lfbw/QSREC", "lfb1/CIIUCODE", "lfbw/WT_EXNR", "lfb1/QSBGR",
				"lfbw/witht", "lfbw/QSREC", "lfbw/WT_WTSTCD", "lfbw/WT_EXRT", "lfbw/WT_EXDF", "lfbw/WT_WITHCD", "lfbw/WT_SUBJCT", "lfbw/WT_EXNR",
				"lfbw/WT_WTEXRS", "lfbw/WT_EXDT"
			];
			for (var i = 0; i < aWithHoldingDataField.length; i++) {
				this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData/" + aWithHoldingDataField[i], this.getView().getModel(
					"CreateVendorModel").getProperty("/addCompanyCodeFormDataCurrent/" + aWithHoldingDataField[i]));
			}
		},
		handleCountrySuggestion: function (oEvent) {
			if (oEvent.getParameter('selectedItem') && oEvent.getParameter('selectedItem').getKey()) {
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1', oEvent.getParameter('selectedItem').getKey());
				this.getOwnerComponent().getModel('CreateVendorModel').setProperty(
					'/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/country', oEvent.getParameter('selectedItem').getKey());
				this.getOwnerComponent().getModel('CreateVendorModel').refresh(true);
			}
		},

		_checkAddress: function () {
			this.getView().setBusy(true);
			var oAddrDet = this.getView().getModel("CreateVendorModel").getProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1");
			var objParamCreate = {
				url: "/murphyCustom/mdm/proxy-service/dqm/address",
				type: 'POST',
				hasPayload: true,
				data: {
					"addressInput": {
						"country": this.getView().getModel("CreateVendorModel").getProperty(
							"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1"),
						"mixed": oAddrDet.house_num1 + " " + oAddrDet.street,
						"locality": oAddrDet.city2,
						"locality2": oAddrDet.str_suppl1,
						"locality3": oAddrDet.str_suppl2,
						"region": this.getView().getModel("CreateVendorModel").getProperty(
							"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/REGIO"),
						"region2": "",
						"postcode": this.getView().getModel("CreateVendorModel").getProperty(
							"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PSTLZ"),
						"firm": this.getView().getModel("CreateVendorModel").getProperty(
							"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/NAME1")
					},
					"outputFields": [
						"std_addr_prim_address",
						"std_addr_sec_address",
						"std_addr_locality_full",
						"std_addr_region_full",
						"std_addr_postcode_full",
						"std_addr_country_2char",
						"addr_asmt_info",
						"std_addr_address_delivery",
						"std_addr_locality_full",
						"std_addr_region_full",
						"std_addr_postcode_full",
						"std_addr_country_2char",
						"addr_latitude",
						"addr_longitude",
						"addr_asmt_level",
						"addr_info_code",
						"addr_info_code_msg",
						"geo_asmt_level",
						"geo_info_code",
						"geo_info_code_msg"
					],
					"addressSettings": {
						"casing": "mixed",
						"diacritics": "include",
						"streetFormat": "countryCommonStyle",
						"postalFormat": "countryCommonStyle",
						"regionFormat": "countryCommonStyle",
						"scriptConversion": "none"
					}
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result) {
						var oJsonModel = new sap.ui.model.json.JSONModel(oDataResp.result);
						this._getAddressCompareDialog(oJsonModel);
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Failed to get the Address");
				}.bind(this)
			);

		},

		_getAddressCompareDialog: function (oJsonModel) {
			Fragment.load({
				name: "murphy.mdm.vendor.murphymdmvendor.fragments.AddressCompare",
				controller: this
			}).then(function name(oFragment) {
				this._oDialogAddress = oFragment;
				this.getView().addDependent(this._oDialogAddress);
				this._oDialogAddress.setModel(oJsonModel);
				this._oDialogAddress.setModel(this.getView().getModel("CreateVendorModel"), "CreateVendorModel");
				this._oDialogAddress.open();
				this.getView().setBusy(false);
			}.bind(this));
		},

		onAcceptAddressPress: function (oEvent) {
			var oNewData = this._oDialogAddress.getModel().getData();
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/city2", oNewData.std_addr_locality_full);
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/PSTLZ", oNewData.std_addr_postcode_full);
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/str_suppl1", oNewData.std_addr_sec_address);
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/REGIO", oNewData.std_addr_region_full);
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/LAND1", oNewData.std_addr_country_2char);
			this._oDialogAddress.close();
		},

		onPressCancelAddress: function () {
			this._oDialogAddress.close();
		},

		/*onChangeWebSite: function (oEvent) {
			let sWbSite = oEvent.getSource().getValue();
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/gen_adr12/gen_adr12_1/uri_srch", sWbSite.toUpperCase());
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/website", sWbSite);
	
		},*/
		/*onChgTelCtry: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/teleCountry", oEvent.getParameter("selectedItem").getBindingContext(
					"valueHelps").getObject().telefto);
		},
		onChgTelNum: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/telephone", oEvent.getSource().getValue());
		},
		onChgTelExt: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/telExtension", oEvent.getSource().getValue());
		},
		onChgFaxCtry: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/faxCountry", oEvent.getParameter("selectedItem").getBindingContext(
					"valueHelps").getObject().telefto);
		},
		onChgFaxNum: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/faxTelephone", oEvent.getSource().getValue());
		},
		onChgFaxExt: function (oEvent) {
			this.getView().getModel("CreateVendorModel").setProperty(
				"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/faxExtention", oEvent.getSource().getValue());
		}*/
	});
});