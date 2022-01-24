sap.ui.define([
	"murphy/mdm/vendor/murphymdmvendor/controller/BaseController",
	"sap/ui/core/Fragment",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
], function (BaseController, Fragment, ServiceCall, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("murphy.mdm.vendor.murphymdmvendor.controller.searchvendor", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
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
			var oParameters = {
				sPageNo: 1
			};
			this.handleGo(oParameters);
			this.getOwnerComponent().getModel("SearchVendorModel").setSizeLimit(1000);
		},

		handleGo: function (oParameters) {
			if (this.getOwnerComponent().getModel("SearchVendorModel")) {
				this.getOwnerComponent().getModel("SearchVendorModel").setProperty("/leftEnabled", false);
				this.getOwnerComponent().getModel("SearchVendorModel").setProperty("/rightEnabled", false);
			} else {
				this.getView().getModel("SearchVendorModel").setProperty("/leftEnabled", false);
				this.getView().getModel("SearchVendorModel").setProperty("/rightEnabled", false);
			}
			var sPage;
			if (!oParameters.sPageNo) {
				sPage = 1;
			} else {
				sPage = oParameters.sPageNo
			}
			delete oParameters.sPageNo;
			var oSearchVendorModel = this.getOwnerComponent().getModel("SearchVendorModel");
			var oFilterParameters = {};
			if (Object.keys(oParameters).length === 0) {
				oFilterParameters = {
					"vnd_lfa1": {}
				};
			} else {
				oFilterParameters = oParameters;
			}
			var objParam = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {
					"entitySearchType": "GET_ALL_VENDOR",
					"entityType": "VENDOR",
					"currentPage": sPage,
					"parentDTO": {
						"customData": oFilterParameters
					}
				}
			};

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				var aResultDataArr = oData.result.vendorDTOs;
				oData.result.totalRecords = aResultDataArr[0].totalCount;

				if (aResultDataArr[0].currentPage === 1) {
					var aPageJson = [];
					for (var i = 0; i < aResultDataArr[0].totalPageCount; i++) {
						aPageJson.push({
							key: i + 1,
							text: i + 1
						});
					}
					oSearchVendorModel.setProperty("/PageData", aPageJson);
				}
				oSearchVendorModel.setProperty("/selectedPageKey", aResultDataArr[0].currentPage);

				if (aResultDataArr[0].totalPageCount > aResultDataArr[0].currentPage) {
					oSearchVendorModel.setProperty("/rightEnabled", true);
				} else {
					oSearchVendorModel.setProperty("/rightEnabled", false);
				}
				if (aResultDataArr[0].currentPage > 1) {
					oSearchVendorModel.setProperty("/leftEnabled", true);
				} else {
					oSearchVendorModel.setProperty("/leftEnabled", false);
				}
				// aResultDataArr.forEach(oItem => {
				// 	var sValue = (oItem.listOfCRs && oItem.listOfCRs.length > 0) ? oItem.listOfCRs[0]["change_request_due_date"] : oItem.listOfCRs;
				// 	var sResultDate = '';
				// 	var sDate = '';
				// 	var sPendingRequest = '';
				// 	if (sValue) {
				// 		sDate = sValue.split('T')[0];
				// 		sResultDate = new Date(sDate);
				// 		sResultDate = sResultDate.getDate() + '-' + (sResultDate.getMonth() + 1) + '-' + sResultDate.getFullYear();
				// 		if (new Date(sDate).getTime() > new Date().getTime()) {
				// 			sPendingRequest = "Pending";
				// 		} else {
				// 			sPendingRequest = "OverDue"
				// 		}
				// 	}
				// 	oItem.overDueDate = sResultDate;
				// 	oItem.pendingRequest = sPendingRequest;
				// })

				oSearchVendorModel.setProperty("/searchAllModelData", oData.result);
			});
		},

		onSearch: function () {
			var sVMSelectedKey = this.getView().byId('searchVendorVM').getSelectionKey();
			var sName1 = this.getView().byId('fbName1').getValue();
			var sName2 = this.getView().byId('fbName2').getValue();
			var sCity = this.getView().byId('fbCity').getValue();
			var sStreet = this.getView().byId('fbStreet').getValue();
			var sBPId = this.getView().byId('fbBPId').getValue();
			var sBankAcc = this.getView().byId('fbBankAcc').getValue();
			var sBankKey = this.getView().byId('fbBankKey').getValue();
			var sBankStreet = this.getView().byId('fbBankStreet').getValue();
			var oFilterBarParam = {
				sPageNo: 1
			};
			if (sVMSelectedKey === "*standard*") {
				oFilterBarParam.vnd_lfa1 = {};
				if (sName1) {
					oFilterBarParam['vnd_lfa1']['NAME1'] = sName1;
				}
				if (sName2) {
					oFilterBarParam['vnd_lfa1']['NAME2'] = sName2;
				}
				if (sCity) {
					oFilterBarParam['vnd_lfa1']['ORT01'] = sCity;
				}
				if (sStreet) {
					oFilterBarParam['vnd_lfa1']['STREET'] = sStreet;
				}
			} else if (sVMSelectedKey === "bankDetails") {
				oFilterBarParam.vnd_lfbk = {};
				if (sBPId) {
					oFilterBarParam['vnd_lfbk']['LIFNR'] = sBPId;
				}
				if (sBankAcc) {
					oFilterBarParam['vnd_lfbk']['BKONT'] = sBankAcc;
				}
				if (sBankKey) {
					oFilterBarParam['vnd_lfbk']['BANKL'] = sBankKey;
				}
				if (sBankStreet) {
					oFilterBarParam['vnd_lfbk']['STRAS'] = sBankStreet;
				}
			}
			this.handleGo(oFilterBarParam);
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
			if (sKey === "createERPVendorView") {
				this._createCREntityID();
			}
			if (sKey === "changeRequestId" || sKey === "changeRequestId-Mass") {
				this.nPageNo = 1;
				this.handleGetAllChangeRequests(this.nPageNo);
				this.handleChangeRequestStatistics();
			}
			if (sKey === "srchVnd") {
				var oParameters = {
					sPageNo: 1
				};
				this.handleGo(oParameters);
			}
			// if (sKey === "changeRequestMassId" || sKey === "changeRequestAllId") {
			// 	sap.ui.getCore().byId("changeRequestPage").setSelectedKey(sKey + "Icon");
			// }
		},

		// _createCREntityID: function () {
		// 	//sap.ui.getCore().byId("idCreateVendorSubmitErrors").setVisible(false);
		// 	var objParam = {
		// 		url: "/murphyCustom/mdm/entity-service/entities/entity/create",
		// 		hasPayload: true,
		// 		type: 'POST',
		// 		data: {
		// 			"entityType": "VENDOR",
		// 			"parentDTO": {
		// 				"customData": {
		// 					"business_entity": {
		// 						"entity_type_id": "1",
		// 						"created_by": "1",
		// 						"modified_by": "1",
		// 						"is_draft": "1"
		// 					}
		// 				}
		// 			}
		// 		}
		// 	};
		// 	this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
		// 		var oDate = new Date();
		// 		// var p2 = Object.assign({}, this.getView().getModel("CreateVendorModel").getData().createCRVendorData_Copy);
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData", Object.assign({}, p2));
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfb1/vnd_lfb1_1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfbw/vnd_lfbw_1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1", {});
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1", {});
		// 		// if (this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/formData/parentDTO/customData/pra_bp_ad") ===
		// 		// 	undefined) {
		// 		// var oPRAbpad = {
		// 		// 	"pra_bp_ad_1": {
		// 		// 		"entity_id": null,
		// 		// 		"addr_type": null,
		// 		// 		"adrnr": "",
		// 		// 		"custid": null,
		// 		// 		"vendid": null,
		// 		// 		"oiu_cruser": null,
		// 		// 		"oiu_timestamp": null
		// 		// 	}
		// 		// };
		// 		// var oPrabpvendesc = {
		// 		// 	"pra_bp_vend_esc_1": {
		// 		// 		"entity_id": null,
		// 		// 		"name_id": null,
		// 		// 		"owner_nm_last": null,
		// 		// 		"owner_nm_first": null,
		// 		// 		"owner_nm_middle": null,
		// 		// 		"owner_nm_prefix": null,
		// 		// 		"owner_nm_suffix": null,
		// 		// 		"owner_nm_title": null,
		// 		// 		"owner_address1": null,
		// 		// 		"owner_address2": null,
		// 		// 		"owner_address3": null,
		// 		// 		"owner_country": null,
		// 		// 		"owner_taxid": null,
		// 		// 		"owner_taxid_ext": null,
		// 		// 		"onwer_dob": null,
		// 		// 		"oiu_timestamp": null,
		// 		// 		"change_user": null,
		// 		// 		"change_timestamp": null,
		// 		// 		"vendid": null
		// 		// 	}
		// 		// };
		// 		// var oPrabpcustmd = {
		// 		// 	"pra_bp_cust_md_1": {
		// 		// 		"entity_id": null,
		// 		// 		"custid": "",
		// 		// 		"intercocd": null,
		// 		// 		"oiu_timestamp": null,
		// 		// 		"oiu_cruser": null,
		// 		// 		"change_user": null,
		// 		// 		"change_timestamp": null
		// 		// 	}
		// 		// };
		// 		// var oPrabpvendmd = {
		// 		// 	"pra_bp_vend_md_1": {
		// 		// 		"entity_id": null,
		// 		// 		"vendid": null,
		// 		// 		"intercocd": null,
		// 		// 		"enty_cd": "",
		// 		// 		"direct_pay_fl": null,
		// 		// 		"do_not_rpt_onrr": null,
		// 		// 		"owner_min_pay": "",
		// 		// 		"pay_frequency": "",
		// 		// 		"do_not_recoup": null,
		// 		// 		"b_notice": null,
		// 		// 		"payment_type": "",
		// 		// 		"no_check_stmt": null,
		// 		// 		"levy": null,
		// 		// 		"kglnd": "",
		// 		// 		"cdex_company": null,
		// 		// 		"tribe_no": null,
		// 		// 		"backup_withhold": null,
		// 		// 		"kgreg": "",
		// 		// 		"tax_id_type": null,
		// 		// 		"oiu_cruser": null,
		// 		// 		"oiu_timestamp": null,
		// 		// 		"change_user": null,
		// 		// 		"change_timestamp": null,
		// 		// 		"tin_match_date": null,
		// 		// 		"tin_resp_date": null,
		// 		// 		"tin_w8": null,
		// 		// 		"tin_w9": null,
		// 		// 		"tin_others": null,
		// 		// 		"bn1_date": null,
		// 		// 		"bn1_resp_date": null,
		// 		// 		"bn1_w8": null,
		// 		// 		"bn1_w9": null,
		// 		// 		"bn1_others": null,
		// 		// 		"bn2_date": null,
		// 		// 		"irs_resp_date": null,
		// 		// 		"flag_1099": null,
		// 		// 		"flag_nra": null,
		// 		// 		"rep_entity_type": null,
		// 		// 		"tin_comment_no": null,
		// 		// 		"b1n_comment_no": null,
		// 		// 		"b2n_comment_no": null,
		// 		// 		"recoup_pc": null,
		// 		// 		"recip_code_1042s": null
		// 		// 	}
		// 		// };
		// 		var oCustomData = {
		// 			"vnd_lfa1": {
		// 				"lifnr": null,
		// 				"entity_id": null,
		// 				"KTOKK": "",
		// 				"ANRED": null,
		// 				"NAME1": null,
		// 				"NAME2": null,
		// 				"NAME3": null,
		// 				"NAME4": null,
		// 				"STKZN": null,
		// 				"SORTL": null,
		// 				"TELF1": null,
		// 				"TELF2": null,
		// 				"TELFX": null,
		// 				"PFACH": null,
		// 				"PSTLZ": null,
		// 				"ORT01": null,
		// 				"LAND1": null,
		// 				"REGION": null,
		// 				"SPRAS": "E",
		// 				"PO_BOX": null,
		// 				"BEGRU": null,
		// 				"KONZS": null,
		// 				"VBUND": null,
		// 				"KUNNR": null,
		// 				"BAHNS": null,
		// 				"BRSCH": null,
		// 				"FISKN": null,
		// 				"STKZA": null,
		// 				"STKZU": null,
		// 				"DTAWS": null,
		// 				"ESRNR": null,
		// 				"XZEMP": null,
		// 				"LNRZA": null,
		// 				"ZZVAL_TO": null,
		// 				"SEXKZ": null,
		// 				"KRAUS": null,
		// 				"REVDB": null,
		// 				"QSSYS": null,
		// 				"KTOCK": null,
		// 				"PFORT": null,
		// 				"WERKS": null,
		// 				"LTSNA": null,
		// 				"WERKR": null,
		// 				"PLKAL": null,
		// 				"DUEFL": null,
		// 				"TXJCD": null,
		// 				"SPERZ": null,
		// 				"SCACD": null,
		// 				"SFRGR": null,
		// 				"LZONE": null,
		// 				"XLFZA": null,
		// 				"DLGRP": null,
		// 				"FITYP": null,
		// 				"STCDT": null,
		// 				"REGSS": null,
		// 				"ACTSS": null,
		// 				"STCD1": null,
		// 				"STCD2": null,
		// 				"STCD3": null,
		// 				"STCD4": null,
		// 				"STCD5": null,
		// 				"IPISP": null,
		// 				"TAXBS": null,
		// 				"PROFS": null,
		// 				"STGDL": null,
		// 				"EMNFR": null,
		// 				"LFURL": null,
		// 				"J_1KFREPRE": null,
		// 				"J_1KFTBUS": null,
		// 				"J_1KFTIND": null,
		// 				"CONFS": null,
		// 				"UPDAT": null,
		// 				"UPTIM": null,
		// 				"NODEL": null,
		// 				"QSSYSDAT": null,
		// 				"PODKZB": null,
		// 				"FISKU": null,
		// 				"STENR": null,
		// 				"CARRIER_CONF": null,
		// 				"MIN_COMP": null,
		// 				"TERM_LI": null,
		// 				"CRC_NUM": null,
		// 				"CVP_XBLCK": null,
		// 				"RG": null,
		// 				"EXP": null,
		// 				"UF": null,
		// 				"RGDATE": null,
		// 				"RIC": null,
		// 				"RNE": null,
		// 				"RNEDATE": null,
		// 				"CNAE": null,
		// 				"LEGALNAT": null,
		// 				"CRTN": null,
		// 				"ICMSTAXPAY": null,
		// 				"INDTYP": null,
		// 				"TDT": null,
		// 				"COMSIZE": null,
		// 				"J_SC_CAPITAL": null,
		// 				"J_SC_CURRENCY": null,
		// 				"ALC": null,
		// 				"PMT_OFFICE": null,
		// 				"PPA_RELEVANT": null,
		// 				"PSOFG": null,
		// 				"PSOIS": null,
		// 				"PSON1": null,
		// 				"PSON2": null,
		// 				"PSON3": null,
		// 				"PSOVN": null,
		// 				"PSOTL": null,
		// 				"PSOHS": null,
		// 				"PSOST": null,
		// 				"ENTY_CD": null,
		// 				"RES_CNTRY": null,
		// 				"RES_REGION": null,
		// 				"CCODE": null,
		// 				"TRANSPORT_CHAIN": null,
		// 				"STAGING_TIME": null,
		// 				"SCHEDULING_TYPE": null,
		// 				"SUBMI_RELEVANT": null,
		// 				"ZZARIBA_NET": null,
		// 				"ZZVAL_FM": null
		// 			},
		// 			"vnd_lfb1": {
		// 				"vnd_lfb1_1": {
		// 					"entity_id": null,
		// 					"bukrs": null,
		// 					"AKONT": null,
		// 					"LNRZE": null,
		// 					"BEGRU": null,
		// 					"MINDK": null,
		// 					"ZUAWA": null,
		// 					"FDGRV": null,
		// 					"VZSKZ": null,
		// 					"ZINRT": null,
		// 					"ZINDT": null,
		// 					"DATLZ": null,
		// 					"ALTKN": null,
		// 					"PERNR": null,
		// 					"ZTERM": null,
		// 					"KULTG": null,
		// 					"REPRF": null,
		// 					"ZWELS": null,
		// 					"LNRZB": null,
		// 					"WEBTR": null,
		// 					"UZAWE": null,
		// 					"ZAHLS": null,
		// 					"HBKID": null,
		// 					"XPORE": null,
		// 					"XVERR": null,
		// 					"TOGRU": null,
		// 					"ZSABE": null,
		// 					"EIKTO": null,
		// 					"XDEZV": null,
		// 					"KVERM": null,
		// 					"MGRUP": null,
		// 					"ZGRUP": null,
		// 					"QLAND": null,
		// 					"XEDIP": null,
		// 					"FRGRP": null,
		// 					"TOGRR": null,
		// 					"TLFXS": null,
		// 					"INTAD": null,
		// 					"XLFZB": null,
		// 					"GUZTE": null,
		// 					"GRICD": null,
		// 					"GRIDT": null,
		// 					"XAUSZ": null,
		// 					"CERDT": null,
		// 					"CONFS": null,
		// 					"UPDAT": null,
		// 					"UPTIM": null,
		// 					"NODEL": null,
		// 					"TLFNS": null,
		// 					"AVSND": null,
		// 					"AD_HASH": null,
		// 					"CVP_XBLCK_B": null,
		// 					"CIIUCODE": null,
		// 					"ZBOKD": null,
		// 					"ZQSSKZ": null,
		// 					"ZQSZDT": null,
		// 					"ZQSZNR": null,
		// 					"ZMINDAT": null,
		// 					"J_SC_SUBCONTYPE": null,
		// 					"J_SC_COMPDATE": null,
		// 					"J_SC_OFFSM": null,
		// 					"J_SC_OFFSR": null,
		// 					"BASIS_PNT": null,
		// 					"GMVKZK": null,
		// 					"INTERCOCD": null,
		// 					"RSTR_CHG_FL": null,
		// 					"CHECK_FLAG": null,
		// 					"OVRD_RCPMT": null,
		// 					"MIN_PAY": null,
		// 					"PAY_FRQ_CD": null,
		// 					"RECOUP_PC": null,
		// 					"ALLOT_MTH_CD": null,
		// 					"ESCH_CD": null,
		// 					"ESCHEAT_DT": null,
		// 					"PREPAY_RELEVANT": null,
		// 					"ASSIGN_TEST": null,
		// 					"ZZESTMA": null

		// 				}
		// 			},
		// 			"vnd_lfbk": {
		// 				"vnd_lfbk_1": {
		// 					"entity_id": null,
		// 					"BVTYP": null,
		// 					"BKONT": null,
		// 					"KOINH": null,
		// 					"TIBAN": null,
		// 					"BANKN": "",
		// 					"BKREF": null,
		// 					"XEZER": null,
		// 					"BANKS": "",
		// 					"BANKL": "",
		// 					"LIFNR": null,
		// 					"MANDT": null,
		// 					"EBPP_ACCNAME": null,
		// 					"EBPP_BVSTATUS": null,
		// 					"KOVON": null,
		// 					"KOBIS": null
		// 				}
		// 			},
		// 			"vnd_lfbw": {
		// 				"vnd_lfbw_1": {
		// 					"entity_id": null,
		// 					"WT_WITHCD": null,
		// 					"QSREC": null,
		// 					"witht": "",
		// 					"WT_WTSTCD": null,
		// 					"WT_EXRT": null,
		// 					"WT_EXDF": null,
		// 					"WT_SUBJCT": null,
		// 					"WT_EXNR": null,
		// 					"WT_WTEXRS": null,
		// 					"WT_EXDT": null,
		// 					"lifnr": null,
		// 					"bukrs": ""

		// 				}
		// 			},
		// 			"vnd_lfm1": {
		// 				"vnd_lfm1_1": {
		// 					"entity_id": null,
		// 					"ekorg": "",
		// 					"WAERS": null,
		// 					"MINBW": null,
		// 					"KALSK": null,
		// 					"ZTERM": null,
		// 					"INCO1": null,
		// 					"INCO2": null,
		// 					"MEPRF": null,
		// 					"VERKF": null,
		// 					"LFABC": null,
		// 					"EXPVZ": null,
		// 					"ZOLLA": null,
		// 					"SKRIT": null,
		// 					"NRGEW": null,
		// 					"PRFRE": null,
		// 					"WEBRE": null,
		// 					"KZABS": null,
		// 					"KZAUT": null,
		// 					"BOIND": null,
		// 					"BLIND": null,
		// 					"ZZQUA_FLAG": null,
		// 					"EKGRP": null,
		// 					"BSTAE": null,
		// 					"RDPRF": null,
		// 					"PLIFZ": null,
		// 					"MEGRU": null,
		// 					"VENSL": null,
		// 					"LISER": null,
		// 					"LIBES": null,
		// 					"BOPNR": null,
		// 					"XERSR": null,
		// 					"EIKTO": null,
		// 					"ABUEB": null,
		// 					"PAPRF": null,
		// 					"AGREL": null,
		// 					"XNBWY": null,
		// 					"VSBED": null,
		// 					"LEBRE": null,
		// 					"BOLRE": null,
		// 					"UMSAE": null,
		// 					"VENDOR_RMA_REQ": null,
		// 					"OIHANTYP": null,
		// 					"OIA_SPLTIV": null,
		// 					"OIHVGROUP": null,
		// 					"OIMATCYC": null,
		// 					"ACTIVITY_PROFIL": null,
		// 					"TRANSPORT_CHAIN": null,
		// 					"STAGING_TIME": null,
		// 					"INCOV": null,
		// 					"INCO2_I": null,
		// 					"INCO3_I": null,
		// 					"FSH_SC_CID": null,
		// 					"FSH_VAS_DETC": null
		// 				}
		// 			},
		// 			"gen_adrc": {
		// 				"gen_adrc_1": {
		// 					"entity_id": null,
		// 					"addrnumber": null,
		// 					"date_from": "",
		// 					"nation": "",
		// 					"date_to": null,
		// 					"title": null,
		// 					"name1": null,
		// 					"name2": null,
		// 					"name3": null,
		// 					"name4": null,
		// 					"name_text": null,
		// 					"name_co": null,
		// 					"city1": null,
		// 					"city2": null,
		// 					"city_code": null,
		// 					"cityp_code": null,
		// 					"home_city": null,
		// 					"cityh_code": null,
		// 					"chckstatus": null,
		// 					"regiogroup": null,
		// 					"post_code1": null,
		// 					"post_code2": null,
		// 					"post_code3": null,
		// 					"pcode1_ext": null,
		// 					"pcode2_ext": null,
		// 					"pcode3_ext": null,
		// 					"po_box": null,
		// 					"dont_use_p": null,
		// 					"po_box_num": null,
		// 					"po_box_loc": null,
		// 					"city_code2": null,
		// 					"po_box_reg": null,
		// 					"po_box_cty": null,
		// 					"postalarea": null,
		// 					"transpzone": null,
		// 					"street": null,
		// 					"dont_use_s": null,
		// 					"streetcode": null,
		// 					"streetabbr": null,
		// 					"house_num1": null,
		// 					"house_num2": null,
		// 					"house_num3": null,
		// 					"str_suppl1": null,
		// 					"str_suppl2": null,
		// 					"str_suppl3": null,
		// 					"location": null,
		// 					"building": null,
		// 					"floor": null,
		// 					"roomnumber": null,
		// 					"country": "",
		// 					"langu": "E",
		// 					"region": null,
		// 					"addr_group": null,
		// 					"flaggroups": null,
		// 					"pers_addr": null,
		// 					"sort1": null,
		// 					"sort2": null,
		// 					"sort_phn": null,
		// 					"deflt_comm": null,
		// 					"tel_number": null,
		// 					"tel_extens": null,
		// 					"fax_number": null,
		// 					"fax_extens": null,
		// 					"flagcomm2": null,
		// 					"flagcomm3": null,
		// 					"flagcomm4": null,
		// 					"flagcomm5": null,
		// 					"flagcomm6": null,
		// 					"flagcomm7": null,
		// 					"flagcomm8": null,
		// 					"flagcomm9": null,
		// 					"flagcomm10": null,
		// 					"flagcomm11": null,
		// 					"flagcomm12": null,
		// 					"flagcomm13": null,
		// 					"addrorigin": null,
		// 					"mc_name1": null,
		// 					"mc_city1": null,
		// 					"mc_street": null,
		// 					"extension1": null,
		// 					"extension2": null,
		// 					"time_zone": null,
		// 					"taxjurcode": null,
		// 					"address_id": null,
		// 					"langu_crea": null,
		// 					"adrc_uuid": null,
		// 					"uuid_belated": null,
		// 					"id_category": null,
		// 					"adrc_err_status": null,
		// 					"po_box_lobby": null,
		// 					"deli_serv_type": null,
		// 					"deli_serv_number": null,
		// 					"county_code": null,
		// 					"county": null,
		// 					"township_code": null,
		// 					"township": null,
		// 					"mc_county": null,
		// 					"mc_township": null,
		// 					"xpcpt": null
		// 				}
		// 			},
		// 			"gen_bnka": {
		// 				"gen_bnka_1": {
		// 					"entity_id": null,
		// 					"banks": "",
		// 					"bankl": "",
		// 					"erdat": null,
		// 					"ernam": null,
		// 					"banka": null,
		// 					"provz": null,
		// 					"stras": null,
		// 					"ort01": null,
		// 					"swift": null,
		// 					"bgrup": null,
		// 					"xpgro": null,
		// 					"loevm": null,
		// 					"bnklz": null,
		// 					"pskto": null,
		// 					"adrnr": null,
		// 					"brnch": null,
		// 					"chkme": null,
		// 					"vers": null,
		// 					"iban_rule": null,
		// 					"sdd_b2b": null,
		// 					"sdd_cor1": null,
		// 					"sdd_rtrans": null,
		// 					"bicky": null,
		// 					"rccode": null,
		// 					"znocheck": null,
		// 					"zacc_len": null,
		// 					"zres1": null,
		// 					"zres2": null,
		// 					"zres3": null,
		// 					"zres4": null,
		// 					"zres5": null,
		// 					"zres6": null,
		// 					"zres7": null,
		// 					"zres8": null,
		// 					"zres9": null,
		// 					"zres10": null
		// 				}
		// 			},
		// 			"vnd_knvk": {
		// 				"vnd_knvk_1": {
		// 					"entity_id": null,
		// 					"parnr": "",
		// 					"kunnr": null,
		// 					"namev": null,
		// 					"name1": null,
		// 					"ort01": null,
		// 					"adrnd": null,
		// 					"adrnp": null,
		// 					"abtpa": null,
		// 					"abtnr": null,
		// 					"uepar": null,
		// 					"telf1": null,
		// 					"anred": null,
		// 					"pafkt": null,
		// 					"parvo": null,
		// 					"pavip": null,
		// 					"parge": null,
		// 					"parla": null,
		// 					"gbdat": null,
		// 					"vrtnr": null,
		// 					"bryth": null,
		// 					"akver": null,
		// 					"nmail": null,
		// 					"parau": null,
		// 					"parh1": null,
		// 					"parh2": null,
		// 					"parh3": null,
		// 					"parh4": null,
		// 					"parh5": null,
		// 					"moab1": null,
		// 					"mobi1": null,
		// 					"moab2": null,
		// 					"mobi2": null,
		// 					"diab1": null,
		// 					"dibi1": null,
		// 					"diab2": null,
		// 					"dibi2": null,
		// 					"miab1": null,
		// 					"mibi1": null,
		// 					"miab2": null,
		// 					"mibi2": null,
		// 					"doab1": null,
		// 					"dobi1": null,
		// 					"doab2": null,
		// 					"dobi2": null,
		// 					"frab1": null,
		// 					"frbi1": null,
		// 					"frab2": null,
		// 					"frbi2": null,
		// 					"saab1": null,
		// 					"sabi1": null,
		// 					"saab2": null,
		// 					"sabi2": null,
		// 					"soab1": null,
		// 					"sobi1": null,
		// 					"soab2": null,
		// 					"sobi2": null,
		// 					"pakn1": null,
		// 					"pakn2": null,
		// 					"pakn3": null,
		// 					"pakn4": null,
		// 					"pakn5": null,
		// 					"sortl": null,
		// 					"famst": null,
		// 					"spnam": null,
		// 					"titel_ap": null,
		// 					"erdat": null,
		// 					"ernam": null,
		// 					"duefl": null,
		// 					"lifnr": null,
		// 					"loevm": null,
		// 					"kzherk": null,
		// 					"adrnp_2": null,
		// 					"prsnr": null,
		// 					"cvp_xblck_k": null
		// 				}
		// 			},
		// 			"pra_bp_ad": {
		// 				"pra_bp_ad_1": {
		// 					"entity_id": null,
		// 					"addr_type": null,
		// 					"adrnr": "",
		// 					"custid": null,
		// 					"vendid": null,
		// 					"oiu_cruser": null,
		// 					"oiu_timestamp": null
		// 				}
		// 			},
		// 			"pra_bp_vend_esc": {
		// 				"pra_bp_vend_esc_1": {
		// 					"entity_id": null,
		// 					"name_id": null,
		// 					"owner_nm_last": null,
		// 					"owner_nm_first": null,
		// 					"owner_nm_middle": null,
		// 					"owner_nm_prefix": null,
		// 					"owner_nm_suffix": null,
		// 					"owner_nm_title": null,
		// 					"owner_address1": null,
		// 					"owner_address2": null,
		// 					"owner_address3": null,
		// 					"owner_country": null,
		// 					"owner_taxid": null,
		// 					"owner_taxid_ext": null,
		// 					"onwer_dob": null,
		// 					"oiu_timestamp": null,
		// 					"change_user": null,
		// 					"change_timestamp": null,
		// 					"vendid": null
		// 				}
		// 			},
		// 			"pra_bp_cust_md": {
		// 				"pra_bp_cust_md_1": {
		// 					"entity_id": null,
		// 					"custid": "",
		// 					"intercocd": null,
		// 					"oiu_timestamp": null,
		// 					"oiu_cruser": null,
		// 					"change_user": null,
		// 					"change_timestamp": null
		// 				}
		// 			},
		// 			"pra_bp_vend_md": {
		// 				"pra_bp_vend_md_1": {
		// 					"entity_id": null,
		// 					"vendid": null,
		// 					"intercocd": null,
		// 					"enty_cd": "",
		// 					"direct_pay_fl": null,
		// 					"do_not_rpt_onrr": null,
		// 					"owner_min_pay": "",
		// 					"pay_frequency": "",
		// 					"do_not_recoup": null,
		// 					"b_notice": null,
		// 					"payment_type": "",
		// 					"no_check_stmt": null,
		// 					"levy": null,
		// 					"kglnd": "",
		// 					"cdex_company": null,
		// 					"tribe_no": null,
		// 					"backup_withhold": null,
		// 					"kgreg": "",
		// 					"tax_id_type": null,
		// 					"oiu_cruser": null,
		// 					"oiu_timestamp": null,
		// 					"change_user": null,
		// 					"change_timestamp": null,
		// 					"tin_match_date": null,
		// 					"tin_resp_date": null,
		// 					"tin_w8": null,
		// 					"tin_w9": null,
		// 					"tin_others": null,
		// 					"bn1_date": null,
		// 					"bn1_resp_date": null,
		// 					"bn1_w8": null,
		// 					"bn1_w9": null,
		// 					"bn1_others": null,
		// 					"bn2_date": null,
		// 					"irs_resp_date": null,
		// 					"flag_1099": null,
		// 					"flag_nra": null,
		// 					"rep_entity_type": null,
		// 					"tin_comment_no": null,
		// 					"b1n_comment_no": null,
		// 					"b2n_comment_no": null,
		// 					"recoup_pc": null,
		// 					"recip_code_1042s": null
		// 				}
		// 			}
		// 		}

		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/pra_bp_ad",
		// 		// 	oPRAbpad);
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc",
		// 		// 	oPrabpvendesc);
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md",
		// 		// 	oPrabpcustmd);
		// 		// this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md",
		// 		// 	oPrabpvendmd);

		// 		this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData",
		// 			oCustomData);

		// 		this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", oData.result.vendorDTOs[0].customVendorBusDTO
		// 			.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1/vnd_lfb1_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw/vnd_lfbw_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/adrnr",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/addrnumber",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/date_from",
		// 			oDate.getFullYear() + "-" + (oDate.getMonth() + 1 < 10 ? ("0" + (oDate.getMonth() + 1)) : oDate.getMonth() + 1) + "-" + oDate.getDate()
		// 		);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/crTime",
		// 			oDate.getHours() + ":" + oDate.getMinutes()
		// 		);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
		// 		this.getView().getModel("CreateVendorModel").setProperty(
		// 			"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1/entity_id",
		// 			oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

		// 		this.getView().getModel("CreateVendorModel").refresh();
		// 		// console.log(oData);
		// 	}.bind(this), function (oData) {
		// 		this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", "");
		// 		this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData", {});
		// 		MessageToast.show("Entity ID not created. Please try after some time");
		// 	}.bind(this));
		// },

		onSearchVendorTableUpdated: function (oEvent) {

		},

		onPressChngReqTile: function (oEvent) {

		},

		handlePendingRequest: function (sValue) {
			var sStatus = 'None';
			if (sValue) {
				switch (sValue.toLowerCase()) {
				case "pending":
					sStatus = "Warning";
					break;
				case "overdue":
					sStatus = "Error";
					break;
				default:
					sStatus = "None";
				}
			}
			return sStatus;
		},

		handleOverFlowButton: function (oEvent) {
			var oBindingObj = oEvent.getSource().getBindingContext('SearchVendorModel').getObject();
			this.getOwnerComponent().getModel('SearchVendorPopupModel').setData(oBindingObj);
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
			this._createCREntityID();
		},

		handleSelect: function (oEvent) {
			var sSelectedKey = oEvent.getSource().getSelectionKey();
			sSelectedKey = sSelectedKey === "*standard*" ? "addressData" : sSelectedKey;
			var aFilterGroupItems = this.getView().byId("filterBar").getFilterGroupItems();
			aFilterGroupItems.forEach(function (oItem) {
				oItem.setVisibleInFilterBar(oItem.getGroupName() === sSelectedKey ? true : false);
			});

		},

		handleDescription: function (value1, value2, value3, value4) {
			var sText = '';
			sText = value1 ? sText + value1 : sText;
			sText = value2 ? sText + ' ' + value2 : sText;
			sText = value3 ? sText + ' ' + value3 : sText;
			sText = value4 ? sText + ' ' + value4 : sText;
			return sText;
		},

		onSelectSearchAllVendorPage: function () {
			var oSelectedPage = this.getView().getModel("SearchVendorModel").getProperty("/selectedPageKey");
			var oParameters = {
				sPageNo: oSelectedPage
			};
			this.handleGo(oParameters);
		},

		onSelectSearchAllVendorPageLeft: function () {
			var oSelectedPage = this.getView().getModel("SearchVendorModel").getProperty("/selectedPageKey");
			var oParameters = {
				sPageNo: oSelectedPage - 1
			};
			this.handleGo(oParameters);
		},

		onSelectSearchAllVendorPageRight: function () {
			var oSelectedPage = this.getView().getModel("SearchVendorModel").getProperty("/selectedPageKey");
			var oParameters = {
				sPageNo: oSelectedPage + 1
			};
			this.handleGo(oParameters);
		},

		onClickVendor: function (oEvent) {
			this.getView().setBusy(true);
			var sVendorSelected = oEvent.getSource().getText();
			var objParamCreate = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/get",
				type: 'POST',
				hasPayload: true,
				data: {
					"entitySearchType": "GET_BY_VENDOR_ID",
					"entityType": "VENDOR",
					"parentDTO": {
						"customData": {
							"vnd_lfa1": {
								"lifnr": sVendorSelected
							}
						}
					}
				}

			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				this.getView().setBusy(false);
				if (oDataResp.result.parentDTO.customData) {
					var respPayload = Object.keys(oDataResp.result.parentDTO.customData);
					for (var i = 0; i < respPayload.length; i++) {
						switch (respPayload[i]) {
						case "business_entity":
							this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", oDataResp.result.parentDTO.customData
								.business_entity.entity_id);
							break;
						case "vnd_lfa1":
							this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1",
								oDataResp.result.parentDTO.customData.vnd_lfa1);
							break;
						case "vnd_lfb1":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1/vnd_lfb1_1",
								oDataResp.result.parentDTO.customData.vnd_lfb1.vnd_lfb1_1);
							break;
						case "vnd_lfbk":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1",
								oDataResp.result.parentDTO.customData.vnd_lfbk.vnd_lfbk_1);
							break;
						case "vnd_lfm1":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1",
								oDataResp.result.parentDTO.customData.vnd_lfm1.vnd_lfm1_1);
							break;
						case "vnd_lfbw":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw/vnd_lfbw_1",
								oDataResp.result.parentDTO.customData.vnd_lfbw.vnd_lfbw_1);
							break;
						case "vnd_knvk":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1",
								oDataResp.result.parentDTO.customData.vnd_knvk.vnd_knvk_1);
							break;
						case "gen_adrc":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1",
								oDataResp.result.parentDTO.customData.gen_adrc.gen_adrc_1);
							break;
						case "gen_bnka":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1",
								oDataResp.result.parentDTO.customData.gen_bnka.gen_bnka_1);
							break;
						case "pra_bp_ad":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1",
								oDataResp.result.parentDTO.customData.pra_bp_ad.pra_bp_ad_1);
							break;
						case "pra_bp_vend_esc":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1",
								oDataResp.result.parentDTO.customData.pra_bp_vend_esc.pra_bp_vend_esc_1);
							break;
						case "pra_bp_cust_md":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1",
								oDataResp.result.parentDTO.customData.pra_bp_cust_md.pra_bp_cust_md_1);
							break;
						case "pra_bp_vend_md":
							this.getView().getModel("CreateVendorModel").setProperty(
								"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1",
								oDataResp.result.parentDTO.customData.pra_bp_vend_md.pra_bp_vend_md_1);
							break;
						}
					}

					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/adrnr",
					// 	oDataResp.result.parentDTO.customData.entity_id);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/addrnumber",
					// 	oDataResp.result.parentDTO.customData.entity_id);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/date_from",
					// 	oDate.getFullYear() + "-" + (oDate.getMonth() + 1 < 10 ? ("0" + (oDate.getMonth() + 1)) : oDate.getMonth() + 1) + "-" + oDate.getDate()
					// );

					this.getView().byId("pageContainer").to(this.createId("erpVendorPreview"));
					this.getView().getModel("CreateVendorModel").setProperty("/preview", false);
					this.getView().getModel("CreateVendorModel").setProperty("/vndDetails", true);
					this.getView().getModel("CreateVendorModel").setProperty("/approvalView", false);
					this.byId("sideNavigation").setSelectedItem(this.byId("sideNavigation").getItem().getItems()[1]);
					var titleID = this.getView().byId("idTitle");
					titleID.setText(this.oBundle.getText("createERPVendorView-title"));
				}
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
				MessageToast.show("Not able to fetch the Vendor Details, Please try after some time");
			}.bind(this));

		},

		onDeleteVendorPress: function (oEvent) {
			var oSelctedObj = oEvent.getSource().getParent().getParent()._oOpenBy.getBindingContext("SearchVendorModel").getObject().customVendorLFA1DTO;
			var sEntityID = oSelctedObj.entity_id;
			sEntityID = 513
			MessageBox.confirm("Are you sure, you wan to delete Vendor " + oSelctedObj.lifnr + " - " + oSelctedObj.NAME1 + " ?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (oEvt) {
					if (oEvt === "OK") {
						this.getView().setBusy(true);
						var objParam = {
							url: "/murphyCustom/mdm/entity-service/entities/entity/delete",
							type: 'POST',
							hasPayload: true,
							data: {
								"entityType": "VENDOR",
								"parentDTO": {
									"customData": {
										"business_entity": {
											"entity_id": sEntityID
										}
									}
								}
							}
						};
						this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
							this.getView().setBusy(false);
							MessageToast.show("Vendor got deleted successfully");
						}.bind(this), function (oError) {
							this.getView().setBusy(false);
							MessageToast.show("Delete Action Failed, try after some time");
						}.bind(this))
					}
				}.bind(this)
			});

		}

		// onSaveClick : function(oEvent){
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