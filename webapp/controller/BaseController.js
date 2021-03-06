sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"murphy/mdm/vendor/murphymdmvendor/shared/serviceCall",
	'sap/ui/core/Fragment',
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet"
], function (Controller, ServiceCall, Fragment, MessageToast, Filter, FilterOperator, Spreadsheet) {
	"use strict";

	return Controller.extend("murphy.mdm.vendor.murphymdmvendor.controller.BaseController", {

		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		_filteringReason: function () {
			var oreasonFlag = this.getOwnerComponent().getModel("reasonDropdownfilterModel").getProperty('/reasonFlag');
			var oVendor_cr_reason = this.getOwnerComponent().getModel("reasonDropdownfilterModel").getProperty("/VendorRasons");
			if (oreasonFlag !== "") {
				var newArray = oVendor_cr_reason.filter(function (el) {
					return el.group_name === oreasonFlag;

				});
				this.getOwnerComponent().getModel("CreateVendorModel").setProperty("/createCRDD/VENDOR_CR_REASON", newArray);
			}
		},

		_createCREntityID: function (oParam) {
			this.getView().getModel("emails").setData([]);
			var objParam = {
				url: "/murphyCustom/mdm/entity-service/entities/entity/create",
				hasPayload: true,
				type: 'POST',
				data: {
					"entityType": "VENDOR",
					"parentDTO": {
						"customData": {
							"business_entity": {
								"entity_type_id": "41001",
								"created_by": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
								"modified_by": this.getView().getModel("userManagementModel").getProperty("/data/user_id"),
								"is_draft": true
							}
						}
					}
				}
			};

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
					var oDate = new Date(),
						sDate = `${oDate.getFullYear()}-${("0" + (oDate.getMonth() + 1) ).slice(-2)}-${("0" + oDate.getDate()).slice(-2)}`;
					var oVendorModel = this.getView().getModel("CreateVendorModel");

					if (!oParam || (oParam && !oParam.vndDetails)) {
						var oCustomData = {
							"vnd_lfa1": {
								"lifnr": null,
								"entity_id": null,
								"KTOKK": "",
								"ANRED": null,
								"NAME1": null,
								"NAME2": null,
								"NAME3": null,
								"NAME4": null,
								"STKZN": null,
								"SORTL": null,
								"MCOD1": null,
								"TELF1": null,
								"TELF2": null,
								"TELFX": null,
								"PFACH": null,
								"PSTLZ": null,
								"ORT01": null,
								"LAND1": null,
								"REGION": null,
								"SPRAS": "EN",
								"PO_BOX": null,
								"BEGRU": null,
								"KONZS": null,
								"VBUND": null,
								"KUNNR": null,
								"BAHNS": null,
								"BRSCH": null,
								"FISKN": null,
								"STKZA": null,
								"STKZU": null,
								"DTAMS": " ",
								"DTAWS": null,
								"ESRNR": null,
								"XZEMP": null,
								"LNRZA": null,
								"ZZVAL_TO": null,
								"SEXKZ": null,
								"KRAUS": null,
								"REVDB": null,
								"QSSYS": null,
								"KTOCK": null,
								"PFORT": null,
								"WERKS": null,
								"LTSNA": null,
								"WERKR": null,
								"PLKAL": null,
								"DUEFL": null,
								"TXJCD": null,
								"SPERZ": null,
								"SCACD": null,
								"SFRGR": null,
								"LZONE": null,
								"XLFZA": null,
								"DLGRP": null,
								"FITYP": null,
								"STCDT": null,
								"REGSS": null,
								"ACTSS": null,
								"STCD3": null,
								"STCD4": null,
								"STCD5": null,
								"IPISP": null,
								"TAXBS": null,
								"PROFS": null,
								"STGDL": null,
								"EMNFR": null,
								"LFURL": null,
								"J_1KFREPRE": null,
								"J_1KFTBUS": null,
								"J_1KFTIND": null,
								"CONFS": null,
								"UPDAT": null,
								"UPTIM": null,
								"NODEL": null,
								"QSSYSDAT": null,
								"PODKZB": null,
								"FISKU": null,
								"STENR": null,
								"CARRIER_CONF": null,
								"MIN_COMP": null,
								"TERM_LI": null,
								"CRC_NUM": null,
								"CVP_XBLCK": null,
								"RG": null,
								"EXP": null,
								"UF": null,
								"RGDATE": null,
								"RIC": null,
								"RNE": null,
								"RNEDATE": null,
								"CNAE": null,
								"LEGALNAT": null,
								"CRTN": null,
								"ICMSTAXPAY": null,
								"INDTYP": null,
								"TDT": null,
								"COMSIZE": null,
								"J_SC_CAPITAL": null,
								"J_SC_CURRENCY": null,
								"ALC": null,
								"PMT_OFFICE": null,
								"PPA_RELEVANT": null,
								"PSOFG": null,
								"PSOIS": null,
								"PSON1": null,
								"PSON2": null,
								"PSON3": null,
								"PSOVN": null,
								"PSOTL": null,
								"PSOHS": null,
								"PSOST": null,
								"ENTY_CD": null,
								"RES_CNTRY": null,
								"RES_REGION": null,
								"CCODE": null,
								"TRANSPORT_CHAIN": null,
								"STAGING_TIME": null,
								"SCHEDULING_TYPE": null,
								"SUBMI_RELEVANT": null,
								"ZZARIBA_NET": null,
								"ZZVAL_FM": null
							},
							"vnd_lfb1": {},
							"vnd_lfbk": {
								"vnd_lfbk_1": {
									"entity_id": null,
									"BVTYP": null,
									"BKONT": null,
									"KOINH": null,
									"TIBAN": null,
									"BANKN": "",
									"BKREF": null,
									"XEZER": null,
									"BANKS": "",
									"BANKL": "",
									"LIFNR": null,
									"MANDT": null,
									"EBPP_ACCNAME": null,
									"EBPP_BVSTATUS": null,
									"KOVON": null,
									"KOBIS": null
								}
							},
							"vnd_lfbw": {},
							"vnd_lfm1": {},
							"gen_adrc": {
								"gen_adrc_1": {
									"entity_id": null,
									"addrnumber": null,
									"date_from": "",
									"nation": "",
									"date_to": null,
									"title": null,
									"name1": null,
									"name2": null,
									"name3": null,
									"name4": null,
									"name_text": null,
									"name_co": null,
									"city1": null,
									"city2": null,
									"city_code": null,
									"cityp_code": null,
									"home_city": null,
									"cityh_code": null,
									"chckstatus": null,
									"regiogroup": null,
									"post_code1": null,
									"post_code2": null,
									"post_code3": null,
									"pcode1_ext": null,
									"pcode2_ext": null,
									"pcode3_ext": null,
									"po_box": null,
									"dont_use_p": null,
									"po_box_num": null,
									"po_box_loc": null,
									"city_code2": null,
									"po_box_reg": null,
									"po_box_cty": null,
									"postalarea": null,
									"transpzone": null,
									"street": null,
									"dont_use_s": null,
									"streetcode": null,
									"streetabbr": null,
									"house_num1": null,
									"house_num2": null,
									"house_num3": null,
									"str_suppl1": null,
									"str_suppl2": null,
									"str_suppl3": null,
									"location": null,
									"building": null,
									"floor": null,
									"roomnumber": null,
									"country": "",
									"langu": 'EN',
									"region": null,
									"addr_group": null,
									"flaggroups": null,
									"pers_addr": null,
									"sort1": null,
									"sort2": null,
									"sort_phn": null,
									"deflt_comm": null,
									"tel_number": null,
									"tel_extens": null,
									"fax_number": null,
									"fax_extens": null,
									"flagcomm2": null,
									"flagcomm3": null,
									"flagcomm4": null,
									"flagcomm5": null,
									"flagcomm6": null,
									"flagcomm7": null,
									"flagcomm8": null,
									"flagcomm9": null,
									"flagcomm10": null,
									"flagcomm11": null,
									"flagcomm12": null,
									"flagcomm13": null,
									"addrorigin": null,
									"mc_name1": null,
									"mc_city1": null,
									"mc_street": null,
									"extension1": null,
									"extension2": null,
									"time_zone": null,
									"taxjurcode": null,
									"address_id": null,
									"langu_crea": null,
									"adrc_uuid": null,
									"uuid_belated": null,
									"id_category": null,
									"adrc_err_status": null,
									"po_box_lobby": null,
									"deli_serv_type": null,
									"deli_serv_number": null,
									"county_code": null,
									"county": null,
									"township_code": null,
									"township": null,
									"mc_county": null,
									"mc_township": null,
									"xpcpt": null
								}
								/*"gen_adrc_2": {
									"entity_id": null,
									"addrnumber": null,
									"date_from": "",
									"nation": "",
									"date_to": null,
									"title": null,
									"name1": null,
									"name2": null,
									"name3": null,
									"name4": null,
									"name_text": null,
									"name_co": null,
									"city1": null,
									"city2": null,
									"city_code": null,
									"cityp_code": null,
									"home_city": null,
									"cityh_code": null,
									"chckstatus": null,
									"regiogroup": null,
									"post_code1": null,
									"post_code2": null,
									"post_code3": null,
									"pcode1_ext": null,
									"pcode2_ext": null,
									"pcode3_ext": null,
									"po_box": null,
									"dont_use_p": null,
									"po_box_num": null,
									"po_box_loc": null,
									"city_code2": null,
									"po_box_reg": null,
									"po_box_cty": null,
									"postalarea": null,
									"transpzone": null,
									"street": null,
									"dont_use_s": null,
									"streetcode": null,
									"streetabbr": null,
									"house_num1": null,
									"house_num2": null,
									"house_num3": null,
									"str_suppl1": null,
									"str_suppl2": null,
									"str_suppl3": null,
									"location": null,
									"building": null,
									"floor": null,
									"roomnumber": null,
									"country": "",
									"langu": "EN",
									"region": null,
									"addr_group": null,
									"flaggroups": null,
									"pers_addr": null,
									"sort1": null,
									"sort2": null,
									"sort_phn": null,
									"deflt_comm": null,
									"tel_number": null,
									"tel_extens": null,
									"fax_number": null,
									"fax_extens": null,
									"flagcomm2": null,
									"flagcomm3": null,
									"flagcomm4": null,
									"flagcomm5": null,
									"flagcomm6": null,
									"flagcomm7": null,
									"flagcomm8": null,
									"flagcomm9": null,
									"flagcomm10": null,
									"flagcomm11": null,
									"flagcomm12": null,
									"flagcomm13": null,
									"addrorigin": null,
									"mc_name1": null,
									"mc_city1": null,
									"mc_street": null,
									"extension1": null,
									"extension2": null,
									"time_zone": null,
									"taxjurcode": null,
									"address_id": null,
									"langu_crea": null,
									"adrc_uuid": null,
									"uuid_belated": null,
									"id_category": null,
									"adrc_err_status": null,
									"po_box_lobby": null,
									"deli_serv_type": null,
									"deli_serv_number": null,
									"county_code": null,
									"county": null,
									"township_code": null,
									"township": null,
									"mc_county": null,
									"mc_township": null,
									"xpcpt": null
								}*/
							},
							"gen_bnka": {
								"gen_bnka_1": {
									"entity_id": null,
									"banks": "",
									"bankl": "",
									"erdat": null,
									"ernam": null,
									"banka": "",
									"provz": null,
									"stras": "",
									"ort01": "",
									"swift": null,
									"bgrup": null,
									"xpgro": null,
									"loevm": null,
									"bnklz": null,
									"pskto": null,
									"adrnr": null,
									"brnch": null,
									"chkme": null,
									"vers": null,
									"iban_rule": null,
									"sdd_b2b": null,
									"sdd_cor1": null,
									"sdd_rtrans": null,
									"bicky": null,
									"rccode": null,
									"znocheck": null,
									"zacc_len": null,
									"zres1": null,
									"zres2": null,
									"zres3": null,
									"zres4": null,
									"zres5": null,
									"zres6": null,
									"zres7": null,
									"zres8": null,
									"zres9": null,
									"zres10": null
								}
							},
							"vnd_knvk": {
								"vnd_knvk_1": {
									"entity_id": null,
									"parnr": "",
									"kunnr": null,
									"namev": null,
									"name1": null,
									"ort01": null,
									"adrnd": null,
									"adrnp": null,
									"abtpa": null,
									"abtnr": null,
									"uepar": null,
									"telf1": null,
									"anred": null,
									"pafkt": null,
									"parvo": null,
									"pavip": null,
									"parge": null,
									"parla": null,
									"gbdat": null,
									"vrtnr": null,
									"bryth": null,
									"akver": null,
									"nmail": null,
									"parau": null,
									"parh1": null,
									"parh2": null,
									"parh3": null,
									"parh4": null,
									"parh5": null,
									"moab1": null,
									"mobi1": null,
									"moab2": null,
									"mobi2": null,
									"diab1": null,
									"dibi1": null,
									"diab2": null,
									"dibi2": null,
									"miab1": null,
									"mibi1": null,
									"miab2": null,
									"mibi2": null,
									"doab1": null,
									"dobi1": null,
									"doab2": null,
									"dobi2": null,
									"frab1": null,
									"frbi1": null,
									"frab2": null,
									"frbi2": null,
									"saab1": null,
									"sabi1": null,
									"saab2": null,
									"sabi2": null,
									"soab1": null,
									"sobi1": null,
									"soab2": null,
									"sobi2": null,
									"pakn1": null,
									"pakn2": null,
									"pakn3": null,
									"pakn4": null,
									"pakn5": null,
									"sortl": null,
									"famst": null,
									"spnam": null,
									"titel_ap": null,
									"erdat": null,
									"ernam": null,
									"duefl": null,
									"lifnr": null,
									"loevm": null,
									"kzherk": null,
									"adrnp_2": null,
									"prsnr": null,
									"cvp_xblck_k": null
								}
							},
							"pra_bp_ad": {
								"pra_bp_ad_1": {
									"entity_id": null,
									"addr_type": null,
									"adrnr": "",
									"custid": null,
									"vendid": null,
									"oiu_cruser": null,
									"oiu_timestamp": null
								}
							},
							"pra_bp_vend_esc": {
								"pra_bp_vend_esc_1": {
									"entity_id": null,
									"name_id": null,
									"owner_nm_last": null,
									"owner_nm_first": null,
									"owner_nm_middle": null,
									"owner_nm_prefix": null,
									"owner_nm_suffix": null,
									"owner_nm_title": null,
									"owner_address1": null,
									"owner_address2": null,
									"owner_address3": null,
									"owner_country": null,
									"owner_taxid": null,
									"owner_taxid_ext": null,
									"onwer_dob": null,
									"oiu_timestamp": null,
									"change_user": null,
									"change_timestamp": null,
									"vendid": null
								}
							},
							"pra_bp_cust_md": {
								"pra_bp_cust_md_1": {
									"entity_id": null,
									"custid": "",
									"intercocd": null,
									"oiu_timestamp": null,
									"oiu_cruser": null,
									"change_user": null,
									"change_timestamp": null
								}
							},
							"pra_bp_vend_md": {
								"pra_bp_vend_md_1": {
									"entity_id": null,
									"vendid": null,
									"intercocd": null,
									"enty_cd": "",
									"direct_pay_fl": null,
									"do_not_rpt_onrr": null,
									"owner_min_pay": "1",
									"pay_frequency": "1",
									"do_not_recoup": null,
									"b_notice": null,
									"payment_type": "",
									"no_check_stmt": null,
									"levy": null,
									"kglnd": "",
									"cdex_company": null,
									"tribe_no": null,
									"backup_withhold": null,
									"kgreg": "",
									"tax_id_type": null,
									"oiu_cruser": null,
									"oiu_timestamp": null,
									"change_user": null,
									"change_timestamp": null,
									"tin_match_date": null,
									"tin_resp_date": null,
									"tin_w8": null,
									"tin_w9": null,
									"tin_others": null,
									"bn1_date": null,
									"bn1_resp_date": null,
									"bn1_w8": null,
									"bn1_w9": null,
									"bn1_others": null,
									"bn2_date": null,
									"irs_resp_date": null,
									"flag_1099": null,
									"flag_nra": null,
									"rep_entity_type": null,
									"tin_comment_no": null,
									"b1n_comment_no": null,
									"b2n_comment_no": null,
									"recoup_pc": null,
									"recip_code_1042s": null
								}
							},
							"gen_adr2": {
								"gen_adr2_1": {
									"entity_id": null,
									"addrnumber": null,
									"persnumber": " ",
									"date_from": sDate,
									"consnumber": "1",
									"country": " ",
									"flgdefault": "X",
									"flg_nouse": null,
									"home_flag": "X",
									"tel_number": null,
									"tel_extens": null,
									"telnr_long": null,
									"telnr_call": null,
									"dft_receiv": null,
									"r3_user": "1",
									"valid_from": null,
									"valid_to": null,
									"client": " "
								},
								"gen_adr2_2": {
									"entity_id": null,
									"addrnumber": null,
									"persnumber": " ",
									"date_from": sDate,
									"consnumber": "2",
									"country": " ",
									"flgdefault": "X",
									"flg_nouse": null,
									"home_flag": "X",
									"tel_number": null,
									"tel_extens": null,
									"telnr_long": null,
									"telnr_call": null,
									"dft_receiv": null,
									"r3_user": "3",
									"valid_from": null,
									"valid_to": null,
									"client": " "
								}
							},
							"gen_adr3": {
								"gen_adr3_1": {
									"entity_id": null,
									"addrnumber": null,
									"persnumber": " ",
									"date_from": sDate,
									"consnumber": "1",
									"country": " ",
									"flgdefault": "X",
									"flg_nouse": null,
									"home_flag": "X",
									"fax_number": null,
									"fax_extens": null,
									"faxnr_long": null,
									"faxnr_call": null,
									"fax_group": null,
									"dft_receiv": null,
									"r3_user": null,
									"valid_from": null,
									"valid_to": null,
									"client": " "
								}
							},
							"gen_adr12": {
								"gen_adr12_1": {
									"entity_id": oData.result.vendorDTOs[0].customVendorBusDTO.entity_id,
									"addrnumber": oData.result.vendorDTOs[0].customVendorBusDTO.entity_id,
									"persnumber": "",
									"date_from": sDate,
									"consnumber": "1",
									"flgdefault": "X",
									"flg_nouse": "",
									"home_flag": "X",
									"uri_type": "HPG",
									"uri_srch": "",
									"dft_receiv": "",
									"uri_length": 0,
									"uri_addr": ""
								}
							}
						};
						this.getView().getModel("vndLfm1").setData({
							rows: [],
							lfm1: {
								"entity_id": null,
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
						});
						this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData/parentDTO/customData",
							oCustomData);
						this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeRows", []);
						this.getView().getModel("praAddressModel").setProperty("/rows", []);

						this.getView().getModel("praAddressModel").setProperty("/address", Object.assign({}, oCustomData.gen_adrc.gen_adrc_1));
						this.getView().getModel("CreateVendorModel").setProperty("/addCompanyCodeFormData", {
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
					} else {
						oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adr2/gen_adr2_1/date_from", sDate);
						oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adr2/gen_adr2_2/date_from", sDate);
						oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adr3/gen_adr3_1/date_from", sDate);
						oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adr12/gen_adr12_1/entity_id", oData.result.vendorDTOs[
							0].customVendorBusDTO.entity_id);
						oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adr12/gen_adr12_1/addrnumber", oData.result.vendorDTOs[
							0].customVendorBusDTO.entity_id);
						oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/gen_adr12/gen_adr12_1/date_from", sDate);

					}
					var oChangeReqData = oData.result.vendorDTOs[0].customVendorBusDTO;
					oVendorModel.setProperty("/createCRVendorData/crID", oChangeReqData.change_request_id);
					oVendorModel.setProperty("/changeReq/genData/change_request_by", oChangeReqData.created_by);
					oVendorModel.setProperty("/changeReq/genData/modified_by", oChangeReqData.modified_by);
					this.getView().getModel("crERPCommentedModel").setData({});
					oVendorModel.setProperty("/createCRVendorData/entityId", oData.result.vendorDTOs[0].customVendorBusDTO
						.entity_id);
					oVendorModel.setProperty("/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/vnd_lfb1/0/entity_id",
					// 	oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_lfbk/vnd_lfbk_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					// this.getView().getModel("CreateVendorModel").setProperty(
					// 	"/createCRVendorData/formData/parentDTO/customData/vnd_lfbw/vnd_lfbw_1/entity_id",
					// 	oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					/*oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_lfm1/vnd_lfm1_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);*/
					this.getView().getModel("vndLfm1").setProperty("/lfm1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/adrnr",
						(oData.result.vendorDTOs[0].customVendorBusDTO.entity_id) + "_1");
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/addrnumber",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_lfa1/addrnumber",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					//PRA Addresses are storing as table
					/*this.getView().getModel("CreateVendorModel").setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_2/addrnumber",
						(oData.result.vendorDTOs[0].customVendorBusDTO.entity_id) + "_1");*/
					this.getView().getModel("CreateVendorModel").setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_2/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_bnka/gen_bnka_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/vnd_knvk/vnd_knvk_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_cust_md/pra_bp_cust_md_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_ad/pra_bp_ad_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_esc/pra_bp_vend_esc_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);
					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/pra_bp_vend_md/pra_bp_vend_md_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adr2/gen_adr2_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adr2/gen_adr2_2/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adr3/gen_adr3_1/entity_id",
						oData.result.vendorDTOs[0].customVendorBusDTO.entity_id);

					oVendorModel.setProperty(
						"/createCRVendorData/formData/parentDTO/customData/gen_adrc/gen_adrc_1/date_from",
						oDate.getFullYear() + "-" + (oDate.getMonth() + 1 < 10 ? ("0" + (oDate.getMonth() + 1)) : oDate.getMonth() + 1) + "-" + (
							oDate
							.getDate() < 10 ? ("0" + oDate.getDate()) : oDate.getDate())
					);
					oVendorModel.setProperty(
						"/createCRVendorData/crTime",
						oDate.getHours() + ":" + oDate.getMinutes()
					);
					this.getView().getModel("crERPCommentedModel").setData(null);
					this.getView().getModel("crERPAttachmentModel").setData(null);
					this.getView().getModel("crAuditLogModel").setData({
						"items": [],
						"details": {}
					});
					oVendorModel.refresh();
				}.bind(this),
				function (oData) {
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/entityId", "");
					this.getView().getModel("CreateVendorModel").setProperty("/createCRVendorData/formData", {});
					MessageToast.show("Entity ID not created. Please try after some time");
				}.bind(this));
		},

		handleChangeRequestStatistics: function () {
			var oDataResources = this.getView().getModel("userManagementModel").getData();
			// var that = sap.ui.controller("murphy.mdm.vendor.murphymdmvendor.controller.ChangeRequest");
			var objParam = {
				url: '/murphyCustom/mdm/change-request-service/changerequests/changerequest/statistics/get',
				type: 'POST',
				hasPayload: true,
				data: {
					"userId": oDataResources.data.user_id
				}

			};
			// "userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				if (this.getOwnerComponent().getModel("changeRequestStatisticsModel")) {
					this.getOwnerComponent().getModel("changeRequestStatisticsModel").setData(oData.result);
				} else {
					this.getView().getModel("changeRequestStatisticsModel").setData(oData.result);
				}

			}.bind(this));
		},

		handleGetAllChangeRequests: function (nPageNo, sSearchType, oTaxonomy_id) {
			this.getView().setBusy(true);
			var oDataResources = this.getView().getModel("userManagementModel").getData();

			if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
				this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
			} else {
				this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
				this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
			}
			if (!nPageNo) {
				nPageNo = 1;
			}
			if (!sSearchType) {
				sSearchType = "GET_ALL_CR";
			}

			var objParam = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/page",
				hasPayload: true,
				type: 'POST',
				data: {
					"crSearchType": sSearchType,
					"currentPage": nPageNo,
					"userId": oDataResources.data.user_id,
					"entityTypeId": 41001
				}
			};
			// "userId": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
			// "userId": oDataResources.data.user_id

			if (oTaxonomy_id) {
				objParam.data.parentCrDTOs = [{
					"crDTO": {
						"workflow_type_id": oTaxonomy_id
					}
				}];
			}

			this.serviceCall.handleServiceRequest(objParam).then(function (oData) {
				if (oData.result.currentPage === 1) {
					var aPageJson = [];
					for (var i = 0; i < oData.result.totalPageCount; i++) {
						aPageJson.push({
							key: i + 1,
							text: i + 1
						});
					}
					if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/PageData", aPageJson);
					} else {
						this.getView().getModel("changeRequestGetAllModel").setProperty("/PageData", aPageJson);
					}
				}
				if (this.getOwnerComponent().getModel("changeRequestGetAllModel")) {
					this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/oChangeReq", oData.result);
					//Total count 
					this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/totalCount", oData.result.parentCrDTOs.length);
					this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/selectedPageKey", oData.result.currentPage);
					if (oData.result.totalPageCount > oData.result.currentPage) {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", true);
					} else {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
					}
					if (oData.result.currentPage > 1) {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", true);
					} else {
						this.getOwnerComponent().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
					}

				} else {
					this.getView().getModel("changeRequestGetAllModel").setProperty("/oChangeReq", oData.result);
					this.getView().getModel("changeRequestGetAllModel").setProperty("/selectedPageKey", oData.result.currentPage);
					if (oData.result.totalPageCount > oData.result.currentPage) {
						this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", true);
					} else {
						this.getView().getModel("changeRequestGetAllModel").setProperty("/rightEnabled", false);
					}
					if (oData.result.currentPage > 1) {
						this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", true);
					} else {
						this.getView().getModel("changeRequestGetAllModel").setProperty("/leftEnabled", false);
					}
				}
				this.getView().setBusy(false);
			}.bind(this), function (oError) {
				this.getView().setBusy(false);
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
		},

		formatCR_Entiry_ID: function (sCRId, sEntityID) {
			var sID = "";
			if (sCRId) {
				sID = sCRId;
			} else {
				sID = "T-" + sEntityID;
			}
			return sID;
		},

		formatCR_Org_Name: function (sOrgNo, name, city, reg, postcode) {
			var sText = "";
			if (sOrgNo) {
				// sText = "Organization: " + sOrgNo + ", (no description available)";
				sText = "Organization: " + sOrgNo + " / " + name + " / " + city + " / " + reg + " / " + postcode;
			} else {
				sText = "Organization: (no description available)";
			}
			return sText;
		},

		oReasonDataFilter: function (oItem) {
			var sVendOperation = this.getOwnerComponent().getModel("CreateVendorModel").getProperty("/changeReq/genData/change_request_id");
			/*	var oItem ;*/
			/*	if(sVendOperation === "50001" || sVendOperation === "50002"){
					oItem = this.getView().byId("idCreateERPVendorReason");
				}else if(sVendOperation === "50005" || sVendOperation === "50004"){
					oItem =  this.getView().byId("idERPVendorPreviewReason");
				}*/
			var aFilter = [];
			if (sVendOperation) {
				aFilter.push(new Filter("group_name", FilterOperator.Contains, sVendOperation));
			}

			// filter binding
			var oBinding = oItem.getBinding("items");
			oBinding.filter(aFilter);
		},

		onAddComment: function (oParam) {
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/comments/add",
				type: 'POST',
				hasPayload: true,
				data: {
					"parentCrDTOs": [{
						"crCommentDTOs": [{
							"entity_id": oParam.sEntityID,
							"note_desc": oParam.comment,
							"note_by_user": {
								"user_id": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
							}
						}]
					}]
				}
			};
			var sControlID = oParam.sControlID;
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					// var sControlID = oParam.sControlID;
					this.getView().byId(sControlID).setValue('');
					this.getView().setBusy(false);
					if (oDataResp.result) {
						this.getAllCommentsForCR(this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId"));
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Failed to add Comment, Please Try after some time.");

				}.bind(this)
			);

		},

		getAllCommentsForCR: function (sEntityID) {
			//get comments if sEntityId is available. 
			if (sEntityID) {
				this.getView().setBusy(true);
				var sCRID, sIsclaimable;
				// if (this.getView().getId().indexOf("changeRequestId") > -1) {
				// 	sCRID = this.getView().byId("crList").getSelectedItem().getBindingContext("changeRequestGetAllModel").getObject().crDTO.change_request_id;
				// 	sIsclaimable = this.getView().byId("crList").getSelectedItem().getBindingContext("changeRequestGetAllModel").getObject().crDTO.isClaimable;
				// } else {
				sCRID = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/crID");
				sIsclaimable = this.getView().getModel("CreateVendorModel").getProperty("/changeReq/genData/isClaimable");
				// }
				var objParamCreate = {
					url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/comments/get",
					type: 'POST',
					hasPayload: true,
					data: {
						"parentCrDTOs": [{
							"crDTO": {
								"entity_id": sEntityID
							}
						}]
					}
				};
				this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
						this.getView().setBusy(false);
						if (oDataResp.result && oDataResp.result.parentCrDTOs && oDataResp.result.parentCrDTOs[0] && oDataResp.result.parentCrDTOs[0].crCommentDTOs) {
							oDataResp.result.parentCrDTOs[0].crCommentDTOs.forEach(function (currentValue, index) {
								if (currentValue.note_by_user.user_id === this.getView().getModel("userManagementModel").getProperty("/data/user_id")) {
									var aRole = this.getView().getModel("userManagementModel").getProperty("/role");
									if ((aRole.indexOf('stew') !== -1 || aRole.indexOf('approv') !== -1) && sIsclaimable) {
										currentValue.actions = [{
											"Text": "Edit",
											"Icon": "sap-icon://edit",
											"Key": "edit"
										}, {
											"Text": "Delete",
											"Icon": "sap-icon://delete",
											"Key": "delete"
										}];
									} else if (aRole.indexOf('req') !== -1 && !sCRID) {
										currentValue.actions = [{
											"Text": "Edit",
											"Icon": "sap-icon://edit",
											"Key": "edit"
										}, {
											"Text": "Delete",
											"Icon": "sap-icon://delete",
											"Key": "delete"
										}];

									}

								}
							}.bind(this));
							this.getView().getModel("crERPCommentedModel").setData(oDataResp.result);
							this.getView().getModel("crERPCommentedModel").refresh(true);
							if (!this.getView().getModel("crAuditLogModel").getProperty("/details")) {
								this.getView().getModel("crAuditLogModel").setProperty("/details", {});
							}
							var nCommentCount = oDataResp.result.parentCrDTOs[0].crCommentDTOs ? oDataResp.result.parentCrDTOs[0].crCommentDTOs.length :
								0;
							this.getView().getModel("crAuditLogModel").setProperty("/details/commentCount", nCommentCount);

						} else {
							this.getView().getModel("crERPCommentedModel").setData(null);
							this.getView().getModel("crAuditLogModel").setProperty("/details/commentCount", 0);
						}
					}.bind(this),
					function (oError) {
						this.getView().setBusy(false);
						this.getView().getModel("crERPCommentedModel").setData([]);
						this.getView().getModel("crAuditLogModel").setProperty("/details/commentCount", 0);
						MessageToast.show("Failed to get all Comment, Please Try after some time.");

					}.bind(this)
				);
			}
		},

		getAllDocumentsForCR: function (sEntityID) {
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/documents/all",
				type: 'POST',
				hasPayload: true,
				data: {
					"parentCrDTOs": [{
						"crDTO": {
							"entity_id": sEntityID
						}
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result) {
						this.getView().getModel("crERPAttachmentModel").setData(oDataResp.result);
						this.getView().getModel("crERPAttachmentModel").refresh(true);
						if (!this.getView().getModel("crAuditLogModel").getProperty("/details")) {
							this.getView().getModel("crAuditLogModel").setProperty("/details", {});
						}
						var nAttachmentCount = oDataResp.result.documentInteractionDtos ? oDataResp.result.documentInteractionDtos.length : 0;
						this.getView().getModel("crAuditLogModel").setProperty("/details/attachmentCount", nAttachmentCount);
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					this.getView().getModel("crERPAttachmentModel").setData([]);
					this.getView().getModel("crAuditLogModel").setProperty("/details/attachmentCount", 0);
					MessageToast.show("Failed to get all Documents, Please Try after some time.");

				}.bind(this)
			);
		},

		getAuditLogsForCR: function (sCrID) {
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/audit-service/audits/audit/entity/all",
				type: 'POST',
				hasPayload: true,
				data: {
					"changeRequestLogs": [{
						"changeRequestId": sCrID
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result) {
						// this.getView().getModel("crAuditLogModel").setData(oDataResp.result);
						// this.getView().getModel("crAuditLogModel").refresh(true);
						var nNewCount = oDataResp.result.changeRequestLogs.filter(function (e) {
							return e.changeLogType === "New";
						}).length;

						var nChangedCount = oDataResp.result.changeRequestLogs.filter(function (e) {
							return e.changeLogType === "Changed";
						}).length;

						var nDeleteCount = oDataResp.result.changeRequestLogs.filter(function (e) {
							return e.changeLogType === "Deleted";
						}).length;

						if (!this.getView().getModel("crAuditLogModel").getProperty("/details")) {
							this.getView().getModel("crAuditLogModel").setProperty("/details", {});
						}
						if (!this.getView().getModel("crAuditLogModel").getProperty("/allLogs")) {
							this.getView().getModel("crAuditLogModel").setProperty("/allLogs", []);
						}
						this.getView().getModel("crAuditLogModel").setProperty("/allLogs", oDataResp.result.changeRequestLogs);
						this.getView().getModel("crAuditLogModel").setProperty("/details/newCount", nNewCount);
						this.getView().getModel("crAuditLogModel").setProperty("/details/changedCount", nChangedCount);
						this.getView().getModel("crAuditLogModel").setProperty("/details/deleteCount", nDeleteCount);

						var result = {};

						for (var {
								attributeCategoryId,
								attributeName,
								changeLogTypeId,
								changeRequestId,
								change_request_log_id,
								logBy,
								logDate,
								newValue,
								oldValue,
								changeLogType
							}
							of oDataResp.result.changeRequestLogs) {
							if (!result[logBy]) result[logBy] = [];
							result[logBy].push({
								attributeCategoryId,
								attributeName,
								changeLogTypeId,
								changeRequestId,
								change_request_log_id,
								logDate,
								newValue,
								oldValue,
								changeLogType
							});
						}

						var changeLog = [];

						for (var i = 0; i < Object.keys(result).length; i++) {
							var obj = {
								logBy: Object.keys(result)[i],
								logs: result[Object.keys(result)[i]]
							};
							changeLog.push(obj);

						}
						this.getView().getModel("crAuditLogModel").setProperty("/items", changeLog);
						this.getView().getModel("crAuditLogModel").refresh(true);

					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					this.getView().getModel("crAuditLogModel").setProperty("/items", []);
					MessageToast.show("Failed to get Audit Logs, Please Try after some time.");

				}.bind(this)
			);
		},

		onChangeFileUpload: function (evt) {
			this.getView().setBusy(true);
			var sEntityID;
			if (this.getView().getId().indexOf("changeRequestId") > -1) {
				sEntityID = this.getView().byId("crList").getSelectedItem().getBindingContext("changeRequestGetAllModel").getObject().crDTO.entity_id;
			} else {
				sEntityID = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId");
			}
			var files = evt.getParameter("files");
			var file = files[0];
			if (files && file) {
				// var sIndex = evt.getSource().getItems().length;
				var reader = new FileReader();

				reader.onload = function (readerEvt) {
					var sResult = `data:${file.type};base64,${btoa(event.target.result)}`;
					var aSupportedMimeType = this.getView().getModel("CreateVendorModel").getProperty("/SupportedMimeType");
					var aMimeType = aSupportedMimeType.filter(function (e) {
						return e.exten === file.name.split(".")[1];
					})[0];
					if (!aMimeType) {
						aMimeType = file.name.split(".")[1];
					} else {
						aMimeType = aMimeType.mimeType;
					}
					var objParamCreate = {
						url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/documents/upload",
						type: 'POST',
						hasPayload: true,
						data: {
							"documentInteractionDtos": [{
								"attachmentEntity": {
									"attachment_name": file.name,
									"attachment_description": file.name,
									"attachment_link": "",
									"mime_type": aMimeType,
									"file_name": file.name,
									"attachment_type_id": "11001",
									"created_by": {
										"user_id": this.getView().getModel("userManagementModel").getProperty("/data/user_id")
									},
									"file_name_with_extension": file.name
								},
								"entityType": "VENDOR",
								"businessEntity": {
									"entity_id": sEntityID
								},
								"fileContent": sResult
							}]
						}
					};
					this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
							this.getView().setBusy(false);
							if (oDataResp.result) {
								var sFileName = oDataResp.result.documentInteractionDtos[0].attachmentEntity.attachment_name;
								// var sEntityID = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId");
								this.getAllDocumentsForCR(sEntityID);
								MessageToast.show(sFileName + " Uploaded Successfully for " + sEntityID + " Entity ID");
							}
						}.bind(this),
						function (oError) {
							this.getView().setBusy(false);
							MessageToast.show("Error in File Uploading");

						}.bind(this)
					);
				}.bind(this);
				reader.readAsBinaryString(file);
			}

		},

		onDocumentDownload: function (oEvent) {
			var oBusyIndicator = new sap.m.BusyDialog();
			oBusyIndicator.open();
			var sDocID = oEvent.getSource().getProperty("documentId");
			var sDocName = oEvent.getSource().getProperty("fileName");
			var sMimeType = sDocName.split(".")[1];
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/documents/download",
				type: 'POST',
				hasPayload: true,
				data: {
					"documentInteractionDtos": [{
						"attachmentEntity": {
							"dms_ref_id": sDocID
						}
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					oBusyIndicator.close();
					if (oDataResp) {
						var a = document.createElement("a");
						a.href = oDataResp;
						a.download = sDocName;
						a.click();
					}
				}.bind(this),
				function (oError) {
					oBusyIndicator.close();
					this.getView().setBusy(false);
					MessageToast.show("Error in File Downloading");
				}.bind(this)
			);
		},

		onTypeMissmatch: function () {
			MessageToast.show("This File Type is not Supported");
		},

		dateFormater: function (sDateTime) {
			var sDate = sDateTime.split("T")[0] ? sDateTime.split("T")[0] : "";
			var sTime = sDateTime.split("T")[1] ? sDateTime.split("T")[1].split(".")[0] : "";
			return sDate + " at " + sTime;
		},

		auditLogOldDateFormat: function (sValue, attrName) {
			if (attrName === "created_on" || attrName === "modified_on") {
				sValue = (sValue && sValue !== "null") ? this.getDateFromTime(sValue) : "";
			}
			return "Old : " + ((sValue && sValue !== "null") ? sValue : "");
		},

		auditLogNewDateFormat: function (sValue, attrName) {
			if (attrName === "created_on" || attrName === "modified_on") {
				sValue = (sValue && sValue !== "null") ? this.getDateFromTime(sValue) : "";
			}
			return "New : " + ((sValue && sValue !== "null") ? sValue : "");
		},

		// changeTypeFormatter: function (nChangeType) {
		// 	var sChnageType = "";
		// 	if (nChangeType && nChangeType === 40001) {
		// 		sChnageType = "New";
		// 	} else if (nChangeType && nChangeType === 40002) {
		// 		sChnageType = "Changed";
		// 	} else if (nChangeType && nChangeType === 40003) {
		// 		sChnageType = "Deleted";
		// 	}
		// 	return sChnageType;
		// },

		getDateFromTime: function (sValue) {
			var date = new Date(1970, 0, 1);
			date.setSeconds(sValue.slice(0, 10));
			var sDate = ("" + date.getDate()).length === 1 ? "0" + date.getDate() : date.getDate();
			var sMonth = ("" + (date.getMonth() + 1)).length === 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
			var sYear = date.getFullYear();
			var sHour = ("" + date.getHours()).length === 1 ? "0" + date.getHours() : date.getHours();
			var sMinute = ("" + date.getMinutes()).length === 1 ? "0" + date.getMinutes() : date.getMinutes();
			date.getMinutes();
			var sSeconds = ("" + date.getSeconds()).length === 1 ? "0" + date.getSeconds() : date.getSeconds();
			date.getSeconds();
			return sMonth + "-" + sDate + "-" + sYear + " at " + sHour + ":" + sMinute + ":" + sSeconds;
		},

		getTelCountryNumber: function () {
			var objParamCreate = {
				url: "/murphyCustom/config-service/configurations/configuration",
				type: "POST",
				hasPayload: true,
				data: {
					configType: "T005K"
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				if (oDataResp.result) {
					var obj = {};
					obj["land1"] = " ";
					obj["telefto"] = "";
					oDataResp.result.modelMap.unshift(obj);
					this.getOwnerComponent().getModel("valueHelps").setProperty("/TelCountryCodes", oDataResp.result.modelMap);
				}
			}.bind(this));
		},

		getCountryList: function () {
			var objParamCreate = {
				url: "/murphyCustom/config-service/configurations/configuration",
				type: "POST",
				hasPayload: true,
				data: {
					configType: "T005"
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
				if (oDataResp.result) {
					this.getOwnerComponent().getModel("valueHelps").setProperty("/Country", oDataResp.result.modelMap);
				}
			}.bind(this));
		},

		getWorkFlowForCR: function (sCRID) {
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/workflow-service/workflows/tasks/workbox/changerequest/logs",
				type: 'POST',
				hasPayload: true,
				data: {
					"changeRequestDTO": {
						"change_request_id": sCRID
					}
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result && oDataResp.result.workflowAuditLogDTO) {
						this.getView().getModel("crWorkflowLogModel").setData(oDataResp.result.workflowAuditLogDTO);
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					this.getView().getModel("crWorkflowLogModel").setData([]);
					MessageToast.show("Failed to get Workflow Status, Please Try after some time.");

				}.bind(this)
			);
		},

		changeWorkflowDate: function (sDate) {
			var sDateTime = "";
			if (sDate) {
				var dateTime = sDate.split("T");
				var date = dateTime[0];
				date = date.split("-");
				var time = dateTime[1].split(".")[0];
				sDateTime = date[1] + "-" + date[2] + "-" + date[0] + " at " + time;
			}
			return sDateTime;
		},

		changeWorkflowStatus: function (sStatus) {
			if (sStatus === "UNCLAIMED") {
				sStatus = "ASSIGNED";
			}
			return sStatus;
		},

		onDeleteAttachment: function (oEvent) {
			var oFileData = oEvent.getSource().getBindingContext("crERPAttachmentModel").getObject();
			var sEntityID;
			if (this.getView().getId().indexOf("changeRequestId") > -1) {
				sEntityID = this.getView().byId("crList").getSelectedItem().getBindingContext("changeRequestGetAllModel").getObject().crDTO.entity_id;
			} else {
				sEntityID = this.getView().getModel("CreateVendorModel").getProperty("/createCRVendorData/entityId");
			}
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/documents/delete",
				type: 'POST',
				hasPayload: true,
				data: {
					"documentInteractionDtos": [{
						"attachmentEntity": {
							"attachment_id": oFileData.attachmentEntity.attachment_id,
							"dms_ref_id": oFileData.attachmentEntity.dms_ref_id
						},
						"entityType": "VENDOR",
						"businessEntity": {
							"entity_id": sEntityID
						},
						"fileContent": ""
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result) {
						this.getAllDocumentsForCR(sEntityID);
						MessageToast.show("Attachment Deleted Successfully.");
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Failed to delete the attachment");
				}.bind(this)
			);
		},

		onCommentActionPressed: function (oEvent) {
			var sAction = oEvent.getSource().getKey();
			var OItem = oEvent.getParameter("item");
			if (sAction === "delete") {
				this._deleteComment(OItem.getBindingContext("crERPCommentedModel").getObject());
			} else {
				this._updateComment(OItem.getBindingContext("crERPCommentedModel").getObject());
			}
		},

		_deleteComment: function (oParam) {
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/comments/delete",
				type: 'POST',
				hasPayload: true,
				data: {
					"parentCrDTOs": [{
						"crCommentDTOs": [{
							"note_id": oParam.note_id,
							"note_by_user": {
								"user_id": oParam.note_by_user.user_id
							}
						}]
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result) {
						this.getAllCommentsForCR(oParam.entity_id);
						MessageToast.show("Comment Deleted Successfully.");
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Failed to delete the Comment");
				}.bind(this)
			);
		},

		_updateComment: function (oParam) {
			this.oUpdateCommentDailog = new sap.m.Dialog({
				title: "Update Comment",
				type: "Message",
				state: "None",
				content: [
					new sap.m.VBox({
						items: [
							new sap.m.TextArea({
								width: "100%",
								value: oParam.note_desc
							})
						]
					})
				],
				beginButton: new sap.m.Button({
					text: "Ok",
					press: function (oEvent) {
						var sNewComment = oEvent.getSource().getParent().getContent()[0].getItems()[0].getValue();
						if (sNewComment) {
							this._UpdateCommentCall(oParam, sNewComment);
						} else {
							MessageToast.show("Please update the comment to continoue");
						}
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function () {
						this.oUpdateCommentDailog.close();
					}.bind(this)
				})
			});

			this.getView().addDependent(this.oUpdateCommentDailog);
			this.oUpdateCommentDailog.open();
		},

		_UpdateCommentCall: function (oParam, sNewComment) {
			this.getView().setBusy(true);
			var objParamCreate = {
				url: "/murphyCustom/mdm/change-request-service/changerequests/changerequest/comments/update",
				type: 'POST',
				hasPayload: true,
				data: {
					"parentCrDTOs": [{
						"crCommentDTOs": [{
							"entity_id": oParam.entity_id,
							"note_id": oParam.note_id,
							"note_desc": sNewComment,
							"note_by_user": {
								"user_id": oParam.note_by_user.user_id
							}
						}]
					}]
				}
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oDataResp) {
					this.getView().setBusy(false);
					if (oDataResp.result) {
						this.oUpdateCommentDailog.close();
						this.getAllCommentsForCR(oParam.entity_id);
						MessageToast.show("Comment Updated Successfully.");
					}
				}.bind(this),
				function (oError) {
					this.getView().setBusy(false);
					MessageToast.show("Failed to update the Comment");
				}.bind(this)
			);
		},

		createColumnConfig: function () {
			return [{
					label: 'Change Request ID',
					property: 'changeRequestId'
				}, {
					label: 'Attribute ID',
					property: 'attributeCategoryId',
				}, {
					label: 'Attribute Name',
					property: 'attributeName',
				}, {
					label: 'Change Log Type',
					property: 'changeLogType',
				}, {
					label: 'CR Log ID',
					property: 'change_request_log_id',
				}, {
					label: 'Log By',
					property: 'logBy',
				},
				// {
				// 	label: 'Log Date',
				// 	property: 'logDate',
				// 	type: 'date'
				// },
				{
					label: 'Old Value',
					property: 'oldValue',
				}, {
					label: 'New Value',
					property: 'newValue',
				}
			];
		},

		onExportAttributes: function () {
			var aCols, aProducts, oSettings;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel("crAuditLogModel").getProperty("/allLogs");

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts,
				fileName: "Attributes.xlsx"
			};

			new Spreadsheet(oSettings)
				.build()
				.then(function () {
					MessageToast.show("Spreadsheet export has finished");
				});
		},

		changeRequestTableAdmitColumn: function (sColumnName, aRole) {
			if (sColumnName === "") {
				if (aRole.indexOf('admin') !== -1) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		}
	});
});