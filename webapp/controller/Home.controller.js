sap.ui.define([
    "invictusbs/ui5/inventory/approve/collectivepr/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/HTML",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/PDFViewer",
    "sap/m/CheckBox",
    "sap/m/TextArea"
], function (
    BaseController,
    Filter,
    FilterOperator,
    MessageToast,
    HTML,
    JSONModel,
    MessageBox,
    Dialog,
    Button,
    PDFViewer,
    CheckBox,
    TextArea

) {
    "use strict";

    return BaseController.extend(
        "invictusbs.ui5.inventory.approve.collectivepr.controller.Home",
        {
            onInit: function () {

                this._pageSize = 50;
                this._currentPage = 0;
                this._totalCount = 0;
                this._currentFilters = [];
                this._bUseOData = false; // When false, operates directly on rich JSON data for testing all functionalities
                this.byId("idBtnApprove").setEnabled(false);
                this.byId("idBtnReject").setEnabled(false);

                // Default rich JSON data to guarantee immediate rendering of all tables and dropdowns
                var oDefaultData = {
                    purchaseGroups: [
                        { "Ekgrp": "S67", "Eknam": "Raw Materials & Supplies" },
                        { "Ekgrp": "S68", "Eknam": "Machinery & Equipment" },
                        { "Ekgrp": "S70", "Eknam": "Pumps, Valves & Piping" },
                        { "Ekgrp": "E01", "Eknam": "Electrical & Instruments" },
                        { "Ekgrp": "M02", "Eknam": "Maintenance & Operations" },
                        { "Ekgrp": "C05", "Eknam": "Chemicals & Catalysts" },
                        { "Ekgrp": "P10", "Eknam": "Packaging Materials" },
                        { "Ekgrp": "IT1", "Eknam": "IT & Office Supplies" }
                    ],
                    releaseGroups: [
                        { "Frggr": "RG", "Frggt": "Plant Approvers" },
                        { "Frggr": "R1", "Frggt": "Operations Group" },
                        { "Frggr": "R2", "Frggt": "Technical Group" },
                        { "Frggr": "R3", "Frggt": "Executive Approvers" },
                        { "Frggr": "CF", "Frggt": "Central Finance" }
                    ],
                    releaseCodes: [
                        { "Frgco": "C1", "Frgct": "Plant Maintenance Lead" },
                        { "Frgco": "C2", "Frgct": "Operations Lead" },
                        { "Frgco": "C3", "Frgct": "Technical Director" },
                        { "Frgco": "C4", "Frgct": "General Manager" },
                        { "Frgco": "C5", "Frgct": "VP Procurement" }
                    ],
                    plants: [
                        { "Werks": "0600", "Name1": "Johannesburg Central Plant" },
                        { "Werks": "1000", "Name1": "Durban Logistics Hub" },
                        { "Werks": "2000", "Name1": "Cape Town Manufacturing" },
                        { "Werks": "3000", "Name1": "Pretoria Processing Center" },
                        { "Werks": "4000", "Name1": "Port Elizabeth Assembly" }
                    ],
                    vendors: [
                        { "Lifnr": "1000234", "Name1": "Global Pumps Ltd" },
                        { "Lifnr": "1000567", "Name1": "Tech Supplies & Hardware" },
                        { "Lifnr": "1000890", "Name1": "Industrial Parts & Valves" },
                        { "Lifnr": "1001122", "Name1": "ElectroTech Solutions" },
                        { "Lifnr": "1001455", "Name1": "Apex Engineering Supplies" },
                        { "Lifnr": "1001890", "Name1": "Precision Hydraulics Co" },
                        { "Lifnr": "1002341", "Name1": "Southern Steel Corporation" },
                        { "Lifnr": "1003412", "Name1": "Omni Chemical Technologies" }
                    ],
                    requisitions: [
                        {
                            "AttaId": "ATT001,ATT002",
                            "Banfn": "10000510",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "RG",
                            "Frggt": "Plant Approvers",
                            "Frgco": "C1",
                            "Frgct": "Plant Maintenance Lead",
                            "Frgkz": "X",
                            "Ekgrp": "S70",
                            "Eknam": "Pumps, Valves & Piping",
                            "Werks": "0600",
                            "PlantName1": "Johannesburg Central Plant",
                            "Matnr": "M-01-A200",
                            "Txz01": "Centrifugal Pump Model X1 75kW",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "5.000",
                            "Meins": "EA",
                            "Netpr": "45000.00",
                            "Waers": "ZAR",
                            "Lifnr": "1000234",
                            "VendorName1": "Global Pumps Ltd",
                            "Badat": "/Date(1700870400000)/",
                            "Count": "2",
                            "Zfilename": "Pump_Specs.pdf,Vendor_Quote_Q982.pdf",
                            "WiId": "0000098120"
                        },
                        {
                            "AttaId": "ATT003",
                            "Banfn": "10000510",
                            "Bnfpo": "00020",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "RG",
                            "Frggt": "Plant Approvers",
                            "Frgco": "C1",
                            "Frgct": "Plant Maintenance Lead",
                            "Frgkz": "X",
                            "Ekgrp": "S70",
                            "Eknam": "Pumps, Valves & Piping",
                            "Werks": "0600",
                            "PlantName1": "Johannesburg Central Plant",
                            "Matnr": "M-05-D300",
                            "Txz01": "High Pressure Safety Relief Valve",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "10.000",
                            "Meins": "EA",
                            "Netpr": "15000.00",
                            "Waers": "ZAR",
                            "Lifnr": "1000890",
                            "VendorName1": "Industrial Parts & Valves",
                            "Badat": "/Date(1700956800000)/",
                            "Count": "1",
                            "Zfilename": "Valve_Compliance_Cert.pdf",
                            "WiId": "0000098121"
                        },
                        {
                            "AttaId": "ATT004",
                            "Banfn": "10000515",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "R1",
                            "Frggt": "Operations Group",
                            "Frgco": "C2",
                            "Frgct": "Operations Lead",
                            "Frgkz": "X",
                            "Ekgrp": "M02",
                            "Eknam": "Maintenance & Operations",
                            "Werks": "0600",
                            "PlantName1": "Johannesburg Central Plant",
                            "Matnr": "M-01-C500",
                            "Txz01": "Turbine Maintenance Spare Part Kit",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "2.000",
                            "Meins": "EA",
                            "Netpr": "12500.00",
                            "Waers": "ZAR",
                            "Lifnr": "1000234",
                            "VendorName1": "Global Pumps Ltd",
                            "Badat": "/Date(1701043200000)/",
                            "Count": "1",
                            "Zfilename": "Maintenance_Checklist.pdf",
                            "WiId": "0000098122"
                        },
                        {
                            "AttaId": "ATT005,ATT006",
                            "Banfn": "10000522",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "R2",
                            "Frggt": "Technical Group",
                            "Frgco": "C3",
                            "Frgct": "Technical Director",
                            "Frgkz": "X",
                            "Ekgrp": "E01",
                            "Eknam": "Electrical & Instruments",
                            "Werks": "1000",
                            "PlantName1": "Durban Logistics Hub",
                            "Matnr": "M-02-B100",
                            "Txz01": "Industrial Electric Motor 15kW IE3",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "1.000",
                            "Meins": "EA",
                            "Netpr": "67800.00",
                            "Waers": "ZAR",
                            "Lifnr": "1000567",
                            "VendorName1": "Tech Supplies & Hardware",
                            "Badat": "/Date(1701129600000)/",
                            "Count": "2",
                            "Zfilename": "Motor_Datasheet.pdf,Warranty_Terms.pdf",
                            "WiId": "0000098123"
                        },
                        {
                            "AttaId": "ATT007",
                            "Banfn": "10000522",
                            "Bnfpo": "00020",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "R2",
                            "Frggt": "Technical Group",
                            "Frgco": "C3",
                            "Frgct": "Technical Director",
                            "Frgkz": "X",
                            "Ekgrp": "E01",
                            "Eknam": "Electrical & Instruments",
                            "Werks": "1000",
                            "PlantName1": "Durban Logistics Hub",
                            "Matnr": "E-04-V330",
                            "Txz01": "Variable Speed Drive (VFD) 22kW",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "1.000",
                            "Meins": "EA",
                            "Netpr": "32400.00",
                            "Waers": "ZAR",
                            "Lifnr": "1001122",
                            "VendorName1": "ElectroTech Solutions",
                            "Badat": "/Date(1701129600000)/",
                            "Count": "1",
                            "Zfilename": "VFD_Wiring_Diagram.pdf",
                            "WiId": "0000098124"
                        },
                        {
                            "AttaId": "ATT008",
                            "Banfn": "10000530",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "R1",
                            "Frggt": "Operations Group",
                            "Frgco": "C2",
                            "Frgct": "Operations Lead",
                            "Frgkz": "X",
                            "Ekgrp": "S68",
                            "Eknam": "Machinery & Equipment",
                            "Werks": "2000",
                            "PlantName1": "Cape Town Manufacturing",
                            "Matnr": "H-09-P400",
                            "Txz01": "Heavy Duty Hydraulic Cylinder 200mm",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "4.000",
                            "Meins": "EA",
                            "Netpr": "52000.00",
                            "Waers": "ZAR",
                            "Lifnr": "1001890",
                            "VendorName1": "Precision Hydraulics Co",
                            "Badat": "/Date(1701216000000)/",
                            "Count": "1",
                            "Zfilename": "Hydraulic_Test_Report.pdf",
                            "WiId": "0000098125"
                        },
                        {
                            "AttaId": "ATT009,ATT010",
                            "Banfn": "10000535",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "RG",
                            "Frggt": "Plant Approvers",
                            "Frgco": "C1",
                            "Frgct": "Plant Maintenance Lead",
                            "Frgkz": "X",
                            "Ekgrp": "S67",
                            "Eknam": "Raw Materials & Supplies",
                            "Werks": "2000",
                            "PlantName1": "Cape Town Manufacturing",
                            "Matnr": "S-02-B880",
                            "Txz01": "Structural Stainless Steel Plates 10mm",
                            "Knttp": "P",
                            "Loekz": false,
                            "Menge": "25.000",
                            "Meins": "M2",
                            "Netpr": "78500.00",
                            "Waers": "ZAR",
                            "Lifnr": "1002341",
                            "VendorName1": "Southern Steel Corporation",
                            "Badat": "/Date(1701302400000)/",
                            "Count": "2",
                            "Zfilename": "Mill_Test_Certificate.pdf,PO_Schedule.pdf",
                            "WiId": "0000098126"
                        },
                        {
                            "AttaId": "ATT011",
                            "Banfn": "10000540",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "R3",
                            "Frggt": "Executive Approvers",
                            "Frgco": "C4",
                            "Frgct": "General Manager",
                            "Frgkz": "X",
                            "Ekgrp": "C05",
                            "Eknam": "Chemicals & Catalysts",
                            "Werks": "3000",
                            "PlantName1": "Pretoria Processing Center",
                            "Matnr": "C-11-F500",
                            "Txz01": "Water Treatment Corrosion Inhibitor 200L",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "8.000",
                            "Meins": "DR",
                            "Netpr": "96000.00",
                            "Waers": "ZAR",
                            "Lifnr": "1003412",
                            "VendorName1": "Omni Chemical Technologies",
                            "Badat": "/Date(1701388800000)/",
                            "Count": "1",
                            "Zfilename": "Safety_Data_Sheet_MSDS.pdf",
                            "WiId": "0000098127"
                        },
                        {
                            "AttaId": "ATT012",
                            "Banfn": "10000545",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "CF",
                            "Frggt": "Central Finance",
                            "Frgco": "C5",
                            "Frgct": "VP Procurement",
                            "Frgkz": "X",
                            "Ekgrp": "S68",
                            "Eknam": "Machinery & Equipment",
                            "Werks": "4000",
                            "PlantName1": "Port Elizabeth Assembly",
                            "Matnr": "P-09-K120",
                            "Txz01": "Pneumatic Actuator Assembly 10-bar",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "6.000",
                            "Meins": "EA",
                            "Netpr": "42000.00",
                            "Waers": "ZAR",
                            "Lifnr": "1001455",
                            "VendorName1": "Apex Engineering Supplies",
                            "Badat": "/Date(1701475200000)/",
                            "Count": "1",
                            "Zfilename": "Technical_Specifications.pdf",
                            "WiId": "0000098128"
                        },
                        {
                            "AttaId": "",
                            "Banfn": "10000550",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "RG",
                            "Frggt": "Plant Approvers",
                            "Frgco": "C1",
                            "Frgct": "Plant Maintenance Lead",
                            "Frgkz": "X",
                            "Ekgrp": "E01",
                            "Eknam": "Electrical & Instruments",
                            "Werks": "0600",
                            "PlantName1": "Johannesburg Central Plant",
                            "Matnr": "S-08-O990",
                            "Txz01": "Industrial Digital Temperature Sensors",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "15.000",
                            "Meins": "EA",
                            "Netpr": "18750.00",
                            "Waers": "ZAR",
                            "Lifnr": "1001122",
                            "VendorName1": "ElectroTech Solutions",
                            "Badat": "/Date(1701561600000)/",
                            "Count": "",
                            "Zfilename": "",
                            "WiId": "0000098129"
                        },
                        {
                            "AttaId": "ATT013",
                            "Banfn": "10000555",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "R1",
                            "Frggt": "Operations Group",
                            "Frgco": "C2",
                            "Frgct": "Operations Lead",
                            "Frgkz": "X",
                            "Ekgrp": "P10",
                            "Eknam": "Packaging Materials",
                            "Werks": "1000",
                            "PlantName1": "Durban Logistics Hub",
                            "Matnr": "PKG-04-CR7",
                            "Txz01": "Corrugated Heavy Duty Export Crates 500x500",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "500.000",
                            "Meins": "EA",
                            "Netpr": "24500.00",
                            "Waers": "ZAR",
                            "Lifnr": "1000567",
                            "VendorName1": "Tech Supplies & Hardware",
                            "Badat": "/Date(1701648000000)/",
                            "Count": "1",
                            "Zfilename": "Packaging_Compliance_Specs.pdf",
                            "WiId": "0000098130"
                        },
                        {
                            "AttaId": "ATT014",
                            "Banfn": "10000560",
                            "Bnfpo": "00010",
                            "Bsart": "NB",
                            "Batxt": "Standard PR",
                            "Frggr": "CF",
                            "Frggt": "Central Finance",
                            "Frgco": "C5",
                            "Frgct": "VP Procurement",
                            "Frgkz": "X",
                            "Ekgrp": "IT1",
                            "Eknam": "IT & Office Supplies",
                            "Werks": "0600",
                            "PlantName1": "Johannesburg Central Plant",
                            "Matnr": "IT-SERVER-R6",
                            "Txz01": "Enterprise Rackmount Server 64GB DDR5",
                            "Knttp": "K",
                            "Loekz": false,
                            "Menge": "2.000",
                            "Meins": "EA",
                            "Netpr": "84200.00",
                            "Waers": "ZAR",
                            "Lifnr": "1001122",
                            "VendorName1": "ElectroTech Solutions",
                            "Badat": "/Date(1701734400000)/",
                            "Count": "1",
                            "Zfilename": "Server_Architecture_Proposal.pdf",
                            "WiId": "0000098131"
                        }
                    ]
                };

                // Initialize immediately with full dataset
                this._applyData(oDefaultData);

                // Also asynchronously attempt to load from data.json to pick up external changes
                var sDataPath = sap.ui.require.toUrl("invictusbs/ui5/inventory/approve/collectivepr/model/data.json");
                var oLocalJsonModel = new sap.ui.model.json.JSONModel();

                oLocalJsonModel.attachRequestCompleted(function () {
                    var oData = oLocalJsonModel.getData();
                    if (oData && oData.requisitions && oData.requisitions.length > 0) {
                        this._applyData(oData);
                    }
                }.bind(this));

                oLocalJsonModel.loadData(sDataPath);
            },

            _applyData: function (oData) {
                if (!oData) return;

                var aRawRequisitions = oData.requisitions ? oData.requisitions.slice() : [];
                this._aAllRequisitions = aRawRequisitions.map(function (oItem) {
                    var oClone = Object.assign({}, oItem);
                    if (oClone.Badat && typeof oClone.Badat === "string" && oClone.Badat.indexOf("/Date(") !== -1) {
                        var match = oClone.Badat.match(/\/Date\((\d+)\)\//);
                        if (match) {
                            oClone.Badat = new Date(parseInt(match[1], 10));
                        }
                    }
                    return oClone;
                });

                // 1. Populate Purchase Requisition filter dropdown
                var oSeen = {};
                var aUniquePRs = [];
                this._aAllRequisitions.forEach(function (oItem) {
                    var sPR = oItem.Banfn;
                    if (sPR && !oSeen[sPR]) {
                        oSeen[sPR] = true;
                        aUniquePRs.push({ Banfn: sPR });
                    }
                });

                var oPRFilterModel = new sap.ui.model.json.JSONModel({
                    results: aUniquePRs
                });
                this.getView().setModel(oPRFilterModel, "PRFilter");

                // 2. Populate Dropdown collections in Z_PR_APPROVAL_SRV model
                var oDataModel = new sap.ui.model.json.JSONModel({
                    PurchaseGroupSet: oData.purchaseGroups || [],
                    ReleaseGroupSet: oData.releaseGroups || [],
                    ReleaseCodeSet: oData.releaseCodes || [],
                    PlantSet: oData.plants || [],
                    VendorSet: oData.vendors || [],
                    PRHeaderSet: this._aAllRequisitions
                });
                this.getView().setModel(oDataModel, "Z_PR_APPROVAL_SRV");

                // 3. Explicitly re-bind all 6 MultiComboBox filters to guarantee items and templates are populated
                var oPR = this.byId("idPrNumber");
                if (oPR) {
                    oPR.bindItems({
                        path: "PRFilter>/results",
                        template: new sap.ui.core.Item({
                            key: "{PRFilter>Banfn}",
                            text: "{PRFilter>Banfn}"
                        })
                    });
                }

                var oPG = this.byId("idPurchaseGroup");
                if (oPG) {
                    oPG.bindItems({
                        path: "Z_PR_APPROVAL_SRV>/PurchaseGroupSet",
                        template: new sap.ui.core.Item({
                            key: "{Z_PR_APPROVAL_SRV>Ekgrp}",
                            text: "{Z_PR_APPROVAL_SRV>Ekgrp} - {Z_PR_APPROVAL_SRV>Eknam}"
                        })
                    });
                }

                var oRG = this.byId("idReleaseGroup");
                if (oRG) {
                    oRG.bindItems({
                        path: "Z_PR_APPROVAL_SRV>/ReleaseGroupSet",
                        template: new sap.ui.core.Item({
                            key: "{Z_PR_APPROVAL_SRV>Frggr}",
                            text: "{Z_PR_APPROVAL_SRV>Frggr} - {Z_PR_APPROVAL_SRV>Frggt}"
                        })
                    });
                }

                var oRC = this.byId("idReleaseCode");
                if (oRC) {
                    oRC.bindItems({
                        path: "Z_PR_APPROVAL_SRV>/ReleaseCodeSet",
                        template: new sap.ui.core.Item({
                            key: "{Z_PR_APPROVAL_SRV>Frgco}",
                            text: "{Z_PR_APPROVAL_SRV>Frgco} - {Z_PR_APPROVAL_SRV>Frgct}"
                        })
                    });
                }

                var oPlant = this.byId("idPlant");
                if (oPlant) {
                    oPlant.bindItems({
                        path: "Z_PR_APPROVAL_SRV>/PlantSet",
                        template: new sap.ui.core.Item({
                            key: "{Z_PR_APPROVAL_SRV>Werks}",
                            text: "{Z_PR_APPROVAL_SRV>Werks} - {Z_PR_APPROVAL_SRV>Name1}"
                        })
                    });
                }

                var oVendor = this.byId("idVendor");
                if (oVendor) {
                    oVendor.bindItems({
                        path: "Z_PR_APPROVAL_SRV>/VendorSet",
                        template: new sap.ui.core.Item({
                            key: "{Z_PR_APPROVAL_SRV>Lifnr}",
                            text: "{Z_PR_APPROVAL_SRV>Lifnr} - {Z_PR_APPROVAL_SRV>Name1}"
                        })
                    });
                }

                // 4. Immediately render requisitions in the table
                this.onGoPress();
            },

            onGoPress: function () {

                var oTable = this.byId("idTblRequisitions");
                var oModel = this.getView().getModel("Z_PR_APPROVAL_SRV") || this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");

                var aFilters = []; //filterValues
                // var aPRNumbers = this.byId("idPrNumber").getTokens().map(function (oToken) {
                //     return oToken.getKey() || oToken.getText();
                // });
                var aPRNumbers = this.byId("idPrNumber").getSelectedKeys();
                var aPurchaseGroups = this.byId("idPurchaseGroup").getSelectedKeys();
                var aPlants = this.byId("idPlant").getSelectedKeys();
                var aVendors = this.byId("idVendor").getSelectedKeys();
                var aReleaseGroups = this.byId("idReleaseGroup").getSelectedKeys();
                var aReleaseCodes = this.byId("idReleaseCode").getSelectedKeys();
                if (aPRNumbers.length > 0) {

                    var aPRFilters = aPRNumbers.map(function (sPR) {
                        return new Filter(
                            "Banfn",
                            FilterOperator.EQ,
                            sPR
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aPRFilters,
                            and: false
                        })
                    );
                }

                if (aPurchaseGroups.length > 0) {
                    var aPurchaseGroupFilters = [];
                    aPurchaseGroups.forEach(function (sGroup) {
                        aPurchaseGroupFilters.push(
                            new Filter("Ekgrp", FilterOperator.EQ, sGroup)
                        );
                    });

                    aFilters.push(
                        new Filter({ filters: aPurchaseGroupFilters, and: false })
                    );
                }

                if (aReleaseGroups.length > 0) {

                    var aReleaseGroupFilters = aReleaseGroups.map(function (sReleaseGroup) {
                        return new Filter(
                            "Frggr",
                            FilterOperator.EQ,
                            sReleaseGroup
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aReleaseGroupFilters,
                            and: false
                        })
                    );
                }

                if (aReleaseCodes.length > 0) {

                    var aReleaseCodeFilters = aReleaseCodes.map(function (sReleaseCode) {
                        return new Filter(
                            "Frgco",
                            FilterOperator.EQ,
                            sReleaseCode
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aReleaseCodeFilters,
                            and: false
                        })
                    );
                }

                if (aPlants.length > 0) {
                    var aPlantFilters = aPlants.map(function (sPlant) {
                        return new Filter(
                            "Werks",
                            FilterOperator.EQ,
                            sPlant
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aPlantFilters,
                            and: false
                        })
                    );
                }

                if (aVendors.length > 0) {
                    var aVendorFilters = aVendors.map(function (sVendor) {
                        return new Filter(
                            "Lifnr",
                            FilterOperator.EQ,
                            sVendor
                        );
                    });
                    aFilters.push(
                        new Filter({
                            filters: aVendorFilters,
                            and: false
                        })
                    );
                }
                console.log("Filters:", aFilters);
                console.log("Purchase Groups:", aPurchaseGroups);

                // oModel.read("/PRHeaderSet", {
                //     filters: aFilters,
                //     success: function (oData) {
                //         console.log("PRHeaderSet GET SUCCESS:", oData);

                //         var aResults = oData.results || [];
                //         console.log("Count:", aResults.length);
                //         console.log("Number of PR records:", aResults.length);

                //         var oResultModel = new sap.ui.model.json.JSONModel({
                //             results: aResults,
                //             totalCount: aResults.length
                //         });
                //         // oTable.setModel(oResultModel, "PRResult");
                //         this.getView().setModel(oResultModel, "PRResult");
                //         var oTemplate = new sap.m.ColumnListItem({
                //             type: "Active",
                //             cells: [
                //                 // Requisition
                //                 new sap.m.Link({
                //                     text: "{PRResult>Banfn}",
                //                     press: this.onRequisitionLinkPress.bind(this)
                //                 }),

                //                 new sap.m.Text({ text: "{PRResult>Bsart}" }), // Doc Type

                //                 new sap.m.Text({ text: "{PRResult>Bnfpo}" }), // Item

                //                 new sap.m.Text({ text: "{PRResult>Matnr}" }), // Material

                //                 new sap.m.Text({ text: "{PRResult>Txz01}" }),   // Text Details

                //                 new sap.m.ObjectNumber({
                //                     number: {
                //                         path: "PRResult>Menge",     // Quantity
                //                         type: "sap.ui.model.type.Float",

                //                         formatOptions: {
                //                             minFractionDigits: 3,
                //                             maxFractionDigits: 3,
                //                             groupingEnabled: true
                //                         }
                //                     },

                //                     unit: "{PRResult>Meins}"
                //                 }),

                //                 new sap.m.ObjectNumber({
                //                     number: {
                //                         path: "PRResult>Netpr",              // Net Value
                //                         type: "sap.ui.model.type.Float",

                //                         formatOptions: {
                //                             minFractionDigits: 2,
                //                             maxFractionDigits: 2,
                //                             groupingEnabled: true
                //                         }
                //                     },
                //                     unit: "{PRResult>Waers}"

                //                 }),

                //                 new sap.m.Text({
                //                     text: {
                //                         parts: [                        // Vendor
                //                             "PRResult>Lifnr",
                //                             "PRResult>VendorName1"
                //                         ],
                //                         formatter:
                //                             this.formatVendor.bind(this)
                //                     }
                //                 }),


                //                 new sap.m.Text({ text: "{PRResult>Werks}" }),     // Plant     
                //                 new sap.m.Text({
                //                     text: {
                //                         path: "PRResult>Badat",
                //                         type: "sap.ui.model.type.Date",
                //                         formatOptions: {
                //                             pattern: "dd/MM/yyyy"
                //                         }
                //                     }
                //                 }),
                //                 new sap.m.HBox({
                //                     justifyContent: "Center",
                //                     alignItems: "Center",
                //                     width: "100%",
                //                     items: [

                //                         new sap.m.Button({
                //                             icon: "sap-icon://attachment",
                //                             type: "Transparent",
                //                             text: {
                //                                 path: "PRResult>Count"
                //                             },
                //                             visible: {
                //                                 path: "PRResult>AttaId",
                //                                 formatter: function (sAttaId) {
                //                                     return !!sAttaId && sAttaId.trim() !== "";
                //                                 }
                //                             },
                //                             press: this.onAttachmentPress.bind(this)
                //                         }),

                //                         new sap.m.Text({
                //                             text: "None",
                //                             visible: {
                //                                 path: "PRResult>AttaId",
                //                                 formatter: function (sAttaId) {
                //                                     return !sAttaId || sAttaId.trim() === "";
                //                                 }
                //                             }
                //                         })
                //                     ]
                //                 })
                //             ]
                //         });

                //         oTable.unbindItems();
                //         oTable.bindItems({ path: "PRResult>/results", template: oTemplate });
                //         console.log("Items binding:", oTable.getBinding("items"));
                //         this.calculateTotalNetValue();
                //     }.bind(this),

                //     error: function (oError) {
                //         console.error("PRHeaderSet GET ERROR:", oError);
                //         MessageBox.error("Error while fetching Purchase Requisitions.");
                //     }
                // });
                this._currentFilters = aFilters;
                this._currentPage = 0;

                this._loadPRPage();
            },

            _renderRequisitions: function (aSourceData) {
                var oTable = this.byId("idTblRequisitions");

                var aSelectedPRNumbers = this.byId("idPrNumber") ? this.byId("idPrNumber").getSelectedKeys() : [];
                var aSelectedPurchaseGroups = this.byId("idPurchaseGroup") ? this.byId("idPurchaseGroup").getSelectedKeys() : [];
                var aSelectedPlants = this.byId("idPlant") ? this.byId("idPlant").getSelectedKeys() : [];
                var aSelectedVendors = this.byId("idVendor") ? this.byId("idVendor").getSelectedKeys() : [];
                var aSelectedReleaseGroups = this.byId("idReleaseGroup") ? this.byId("idReleaseGroup").getSelectedKeys() : [];
                var aSelectedReleaseCodes = this.byId("idReleaseCode") ? this.byId("idReleaseCode").getSelectedKeys() : [];

                var aFiltered = (aSourceData || []).filter(function (oItem) {
                    if (aSelectedPRNumbers.length > 0 && aSelectedPRNumbers.indexOf(oItem.Banfn) === -1) {
                        return false;
                    }
                    if (aSelectedPurchaseGroups.length > 0 && aSelectedPurchaseGroups.indexOf(oItem.Ekgrp) === -1) {
                        return false;
                    }
                    if (aSelectedPlants.length > 0 && aSelectedPlants.indexOf(oItem.Werks) === -1) {
                        return false;
                    }
                    if (aSelectedVendors.length > 0 && aSelectedVendors.indexOf(oItem.Lifnr) === -1) {
                        return false;
                    }
                    if (aSelectedReleaseGroups.length > 0 && aSelectedReleaseGroups.indexOf(oItem.Frggr) === -1) {
                        return false;
                    }
                    if (aSelectedReleaseCodes.length > 0 && aSelectedReleaseCodes.indexOf(oItem.Frgco) === -1) {
                        return false;
                    }
                    return true;
                });

                this._totalCount = aFiltered.length;
                this._renderedRequisitions = aFiltered;

                var oResultModel = new sap.ui.model.json.JSONModel({
                    results: aFiltered,
                    totalCount: aFiltered.length
                });

                this.getView().setModel(oResultModel, "PRResult");

                if (oTable) {
                    if (oTable.clearSelection) {
                        oTable.clearSelection();
                    }
                    if (oTable.bindRows) {
                        oTable.unbindRows();
                        oTable.bindRows("PRResult>/results");
                    }
                }

                this.calculateTotalNetValue();
                this.onSelectionChange();
            },

            _loadPRPage: function () {
                var oModel = this.getOwnerComponent() ? this.getOwnerComponent().getModel("Z_PR_APPROVAL_SRV") : null;
                var that = this;

                // When in JSON mode, immediately filter and render the local requisitions
                if (!this._bUseOData) {
                    this._renderRequisitions(this._aAllRequisitions || []);
                    return;
                }

                // When OData mode is enabled:
                if (oModel && typeof oModel.read === "function") {
                    oModel.read("/PRHeaderSet", {
                        filters: this._currentFilters,
                        success: function (oData) {
                            var aAllResults = (oData && oData.results && oData.results.length) ? oData.results : (that._aAllRequisitions || []);
                            that._renderRequisitions(aAllResults);
                        },
                        error: function (oError) {
                            console.warn("PRHeaderSet GET fallback to local JSON data:", oError);
                            that._renderRequisitions(that._aAllRequisitions || []);
                        }
                    });
                } else {
                    this._renderRequisitions(this._aAllRequisitions || []);
                }
            },

            calculateTotalNetValue: function () {
                var oTotalObj = this.byId("idTotalNetValue");
                var aItems = this._renderedRequisitions || [];
                var fTotal = 0;

                aItems.forEach(function (oItem) {
                    var fNetValue = parseFloat(oItem.Netpr);
                    if (!isNaN(fNetValue)) {
                        fTotal += fNetValue;
                    }
                });

                if (oTotalObj) {
                    var sFormatted = fTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    oTotalObj.setNumber(sFormatted);
                    oTotalObj.setUnit("ZAR");
                }
            },


            onAttachmentPress: function (oEvent) {
                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext("PRResult");

                if (!oContext) {
                    MessageBox.error("Unable to get purchase requisition details.");
                    return;
                }

                var oData = oContext.getObject();
                var sBanfn = oData.Banfn;
                var sBnfpo = oData.Bnfpo;
                var sAttaId = oData.AttaId;
                var sZfilename = oData.Zfilename;

                console.log("Banfn:", sBanfn);
                console.log("Bnfpo:", sBnfpo);
                console.log("AttaId:", sAttaId);
                console.log("AttaId:", sZfilename);

                if (!sBanfn || !sBnfpo || !sAttaId) {
                    MessageBox.error(
                        "Attachment information is missing."
                    );
                    return;
                }
                this._loadAttachments(
                    sBanfn,
                    sBnfpo,
                    sAttaId,
                    sZfilename
                );
            },

            _loadAttachments: function (sBanfn, sBnfpo, sAttaId, sZfilename) {

                var aAttaIds = (sAttaId || "")
                    .split(",")
                    .map(function (sValue) {
                        return sValue.trim();
                    })
                    .filter(function (sValue) {
                        return sValue;
                    });

                var aFilenames = (sZfilename || "")
                    .split(",")
                    .map(function (sValue) {
                        return sValue.trim();
                    })
                    .filter(function (sValue) {
                        return sValue;
                    });

                console.log("Attachment IDs:", aAttaIds);
                console.log("Attachment filenames:", aFilenames);

                if (!aAttaIds.length) {
                    MessageToast.show("No attachments found.");
                    return;
                }

                var oList = new sap.m.List({
                    mode: "None"
                });

                aAttaIds.forEach(function (sCurrentAttaId, iIndex) {
                    var sCurrentFilename = aFilenames[iIndex] || sCurrentAttaId;
                    var oItem = new sap.m.StandardListItem({
                        title: sCurrentFilename,      // Filename is only displayed to the user
                        icon: "sap-icon://attachment",
                        type: "Active"
                    });

                    oItem.attachPress(function () {
                        this._openAttachment(
                            sBanfn,
                            sBnfpo,
                            sCurrentAttaId,
                            sCurrentFilename
                        );

                    }.bind(this));
                    oList.addItem(oItem);

                }.bind(this));

                if (this._oAttachmentDialog) {
                    this._oAttachmentDialog.destroy();
                    this._oAttachmentDialog = null;
                }

                this._oAttachmentDialog = new sap.m.Dialog({
                    title: "Attachments",
                    contentWidth: "600px",
                    contentHeight: "400px",
                    stretchOnPhone: true,

                    content: [
                        oList
                    ],

                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            this._oAttachmentDialog.close();
                        }.bind(this)
                    }),

                    afterClose: function () {

                        this._oAttachmentDialog.destroy();
                        this._oAttachmentDialog = null;

                    }.bind(this)
                });

                this.getView().addDependent(
                    this._oAttachmentDialog
                );

                this._oAttachmentDialog.open();
            },


            _openAttachment: function (sBanfn, sBnfpo, sAttaId, sZfilename) {
                var oModel = this.getOwnerComponent()
                    .getModel("Z_PR_APPROVAL_SRV");
                var sPath = oModel.createKey(
                    "/AttachmentSet",
                    {
                        Banfn: sBanfn,
                        Bnfpo: sBnfpo,
                        AttaId: sAttaId,
                        Zfilename: sZfilename
                    }
                );

                var sUrl = oModel.sServiceUrl + sPath + "/$value";
                console.log("Attachment URL:", sUrl);
                var sFileName = (sZfilename || "").toLowerCase();

                if (sFileName.endsWith(".txt")) {   // TXT PREVIEW

                    $.ajax({
                        url: sUrl,
                        method: "GET",

                        success: function (sData) {
                            if (this._oAttachmentViewer) {
                                this._oAttachmentViewer.destroy();
                                this._oAttachmentViewer = null;
                            }

                            this._oAttachmentViewer = new sap.m.Dialog({
                                title: sZfilename,
                                contentWidth: "900px",
                                contentHeight: "auto",
                                stretchOnPhone: true,

                                content: [
                                    new sap.m.TextArea({
                                        value: sData,
                                        editable: false,
                                        width: "100%",
                                        height: "100%",
                                        rows: 20
                                    })
                                ],

                                beginButton: new sap.m.Button({
                                    text: "Close",
                                    press: function () {
                                        this._oAttachmentViewer.close();
                                    }.bind(this)
                                }),

                                afterClose: function () {
                                    this._oAttachmentViewer.destroy();
                                    this._oAttachmentViewer = null;
                                }.bind(this)
                            });

                            this.getView().addDependent(
                                this._oAttachmentViewer
                            );

                            this._oAttachmentViewer.open();

                        }.bind(this),

                        error: function (oError) {

                            console.error("TXT Preview Error:", oError);
                            sap.m.MessageBox.error(
                                "Unable to preview attachment."
                            );
                        }
                    });

                    return;
                }

                else if (sFileName.endsWith(".pdf")) {
                    console.log("Requesting PDF:", sUrl);     // pdf //

                    fetch(sUrl, {
                        method: "GET",
                        credentials: "same-origin",
                        headers: {
                            "Accept": "application/pdf"
                        }
                    })
                        .then(function (oResponse) {

                            console.log("PDF Status:", oResponse.status);
                            console.log("PDF Content-Type:",
                                oResponse.headers.get("Content-Type"));
                            console.log("PDF Content-Disposition:",
                                oResponse.headers.get("Content-Disposition"));

                            if (!oResponse.ok) {
                                throw new Error(
                                    "PDF request failed: " + oResponse.status
                                );
                            }

                            return oResponse.blob();
                        })
                        .then(function (oBlob) {

                            console.log("PDF Blob size:", oBlob.size);
                            console.log("PDF Blob type:", oBlob.type);

                            if (!oBlob.size) {
                                throw new Error(
                                    "PDF response is empty (0 bytes)"
                                );
                            }

                            var oPDFBlob = new Blob(                    // Force correct MIME type
                                [oBlob],
                                {
                                    type: "application/pdf"
                                }
                            );

                            console.log("Final PDF size:", oPDFBlob.size);
                            var sPDFUrl = URL.createObjectURL(oPDFBlob);
                            console.log("PDF Blob URL:", sPDFUrl);

                            if (this._oAttachmentViewer) {
                                this._oAttachmentViewer.destroy();
                                this._oAttachmentViewer = null;
                            }

                            var oHTML = new sap.ui.core.HTML({
                                content:
                                    '<iframe ' +
                                    'src="' + sPDFUrl + '#zoom=100" ' +
                                    'style="width:850px;height:700px;border:none;display:block;margin:auto;" ' +
                                    'frameborder="0">' +
                                    '</iframe>'

                            });
                            this._oAttachmentViewer = new sap.m.Dialog({
                                title: sZfilename,
                                stretch: true,
                                contentWidth: "850px",
                                contentHeight: "700px",
                                draggable: true,
                                resizable: true,

                                content: [
                                    oHTML
                                ],

                                beginButton: new sap.m.Button({
                                    text: "Close",
                                    press: function () {
                                        this._oAttachmentViewer.close();
                                    }.bind(this)
                                }),

                                afterClose: function () {

                                    URL.revokeObjectURL(sPDFUrl);

                                    if (this._oAttachmentViewer) {
                                        this._oAttachmentViewer.destroy();
                                        this._oAttachmentViewer = null;
                                    }

                                }.bind(this)
                            });

                            this.getView().addDependent(
                                this._oAttachmentViewer
                            );

                            this._oAttachmentViewer.open();

                        }.bind(this))
                        .catch(function (oError) {

                            console.error("PDF Preview Error:", oError);

                            sap.m.MessageBox.error(
                                "Unable to preview PDF: " + oError.message
                            );
                        });

                    return;
                }

                if (
                    sFileName.endsWith(".png") ||
                    sFileName.endsWith(".jpg") ||                    // IMAGE PREVIEW
                    sFileName.endsWith(".jpeg")
                ) {

                    var oImage = new sap.m.Image({
                        src: sUrl,
                        width: "100%",
                        height: "100%",
                        densityAware: false
                    });

                    if (this._oAttachmentViewer) {
                        this._oAttachmentViewer.destroy();
                        this._oAttachmentViewer = null;
                    }

                    this._oAttachmentViewer = new sap.m.Dialog({
                        title: sZfilename,
                        contentWidth: "90%",
                        contentHeight: "90%",
                        stretch: true,

                        content: [
                            oImage
                        ],

                        beginButton: new sap.m.Button({
                            text: "Close",
                            press: function () {
                                this._oAttachmentViewer.close();
                            }.bind(this)
                        }),

                        afterClose: function () {

                            this._oAttachmentViewer.destroy();
                            this._oAttachmentViewer = null;

                        }.bind(this)
                    });

                    this.getView().addDependent(
                        this._oAttachmentViewer
                    );

                    this._oAttachmentViewer.open();

                    return;
                }

                var oHTML = new sap.ui.core.HTML({                      // OTHER FILE TYPES
                    content:
                        '<iframe ' +
                        'src="' + sUrl + '" ' +
                        'style="width:100%; height:100%; border:none;" ' +
                        'frameborder="0">' +
                        '</iframe>'
                });

                if (this._oAttachmentViewer) {
                    this._oAttachmentViewer.destroy();
                    this._oAttachmentViewer = null;
                }

                this._oAttachmentViewer = new sap.m.Dialog({
                    title: sZfilename,
                    contentWidth: "90%",
                    contentHeight: "90%",
                    stretch: true,

                    content: [
                        oHTML
                    ],

                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            this._oAttachmentViewer.close();
                        }.bind(this)
                    }),

                    afterClose: function () {

                        this._oAttachmentViewer.destroy();
                        this._oAttachmentViewer = null;

                    }.bind(this)
                });

                this.getView().addDependent(
                    this._oAttachmentViewer
                );

                this._oAttachmentViewer.open();
            },

            onAdaptFilters: function () {

                var that = this;
                if (this._oAdaptFilterDialog) {
                    this._oAdaptFilterDialog.destroy();      // Destroy existing dialog if already open
                    this._oAdaptFilterDialog = null;
                }
                var oCheckPR = new CheckBox({
                    text: "Purchase Requisition",                 // Create checkboxes
                    selected: this.byId("idFilterPR").getVisible()
                });

                var oCheckPurchaseGroup = new CheckBox({
                    text: "Purchase Group",
                    selected: this.byId("idFilterPurchaseGroup").getVisible()
                });

                var oCheckReleaseGroup = new CheckBox({
                    text: "Release Group",
                    selected: this.byId("idFilterReleaseGroup").getVisible()
                });

                var oCheckReleaseCode = new CheckBox({
                    text: "Release Code",
                    selected: this.byId("idFilterReleaseCode").getVisible()
                });

                var oCheckPlant = new CheckBox({
                    text: "Plant",
                    selected: this.byId("idFilterPlant").getVisible()
                });

                var oCheckVendor = new CheckBox({
                    text: "Vendor",
                    selected: this.byId("idFilterVendor").getVisible()
                });

                var oVBox = new sap.m.VBox({                             // Container
                    class: "sapUiSmallMargin",
                    items: [
                        oCheckPR,
                        oCheckPurchaseGroup,
                        oCheckReleaseGroup,
                        oCheckReleaseCode,
                        oCheckPlant,
                        oCheckVendor
                    ]
                });

                this._oAdaptFilterDialog = new Dialog({
                    title: "Adapt Filters",
                    contentWidth: "400px",
                    content: [
                        oVBox
                    ],

                    beginButton: new Button({
                        text: "Apply",
                        type: "Emphasized",
                        press: function () {

                            that.byId("idFilterPR")
                                .setVisible(oCheckPR.getSelected());

                            that.byId("idFilterPurchaseGroup")
                                .setVisible(oCheckPurchaseGroup.getSelected());

                            that.byId("idFilterReleaseGroup")
                                .setVisible(oCheckReleaseGroup.getSelected());

                            that.byId("idFilterReleaseCode")
                                .setVisible(oCheckReleaseCode.getSelected());

                            that.byId("idFilterPlant")
                                .setVisible(oCheckPlant.getSelected());

                            that.byId("idFilterVendor")
                                .setVisible(oCheckVendor.getSelected());

                            that._oAdaptFilterDialog.close();
                        }
                    }),

                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            that._oAdaptFilterDialog.close();
                        }
                    }),

                    afterClose: function () {
                        that._oAdaptFilterDialog.destroy();
                        that._oAdaptFilterDialog = null;
                    }
                });

                this.getView().addDependent(this._oAdaptFilterDialog);

                this._oAdaptFilterDialog.open();
            },

            onClearFilters: function () {
                var oPR = this.byId("idPrNumber");
                var oPG = this.byId("idPurchaseGroup");
                var oRG = this.byId("idReleaseGroup");
                var oRC = this.byId("idReleaseCode");
                var oPlant = this.byId("idPlant");
                var oVendor = this.byId("idVendor");

                if (oPR) oPR.removeAllSelectedItems();
                if (oPG) oPG.removeAllSelectedItems();
                if (oRG) oRG.removeAllSelectedItems();
                if (oRC) oRC.removeAllSelectedItems();
                if (oPlant) oPlant.removeAllSelectedItems();
                if (oVendor) oVendor.removeAllSelectedItems();

                this._currentPage = 0;
                this._currentFilters = [];
                this._loadPRPage();

                this.onSelectionChange();
                MessageToast.show("Filters cleared");
            },

            _getSelectedRequisitions: function () {
                var oTable = this.byId("idTblRequisitions");
                if (!oTable) return [];

                if (oTable.getSelectedIndices) {
                    var aIndices = oTable.getSelectedIndices();
                    return aIndices.map(function (iIdx) {
                        var oCtx = oTable.getContextByIndex(iIdx);
                        return oCtx ? oCtx.getObject() : null;
                    }).filter(Boolean);
                }

                if (oTable.getSelectedContexts) {
                    return oTable.getSelectedContexts("PRResult").map(function (oCtx) {
                        return oCtx ? oCtx.getObject() : null;
                    }).filter(Boolean);
                }

                return [];
            },

            onSelectionChange: function () {
                var aSelected = this._getSelectedRequisitions();
                var bHasSelection = aSelected.length > 0;

                var oBtnApprove = this.byId("idBtnApprove");
                var oBtnReject = this.byId("idBtnReject");
                var oBtnApproveHeader = this.byId("idBtnApproveHeader");
                var oBtnRejectHeader = this.byId("idBtnRejectHeader");

                if (oBtnApprove) oBtnApprove.setEnabled(bHasSelection);
                if (oBtnReject) oBtnReject.setEnabled(bHasSelection);
                if (oBtnApproveHeader) oBtnApproveHeader.setEnabled(bHasSelection);
                if (oBtnRejectHeader) oBtnRejectHeader.setEnabled(bHasSelection);
            },
            _getUniquePRCount: function (aPRData) {

                var oUniquePRs = {};

                aPRData.forEach(function (oPR) {

                    var sPR = String(
                        oPR.Banfn || ""
                    ).trim();

                    if (sPR) {
                        oUniquePRs[sPR] = true;
                    }
                });

                return Object.keys(oUniquePRs).length;
            },
            formatVendor: function (sLifnr, sName) {
                if (sName) {
                    return sLifnr + " - " + sName;
                }

                return sLifnr || "";
            },

            onFirstPage: function () {
                this._currentPage = 0;

                this._loadPRPage();
            },
            onPreviousPage: function () {
                if (this._currentPage > 0) {

                    this._currentPage--;

                    this._loadPRPage();
                }
            },
            onNextPage: function () {

                var iLastPage = Math.ceil(
                    this._totalCount / this._pageSize
                ) - 1;

                if (this._currentPage < iLastPage) {

                    this._currentPage++;

                    this._loadPRPage();
                }
            },
            onLastPage: function () {
                if (this._totalCount > 0) {

                    this._currentPage = Math.ceil(
                        this._totalCount / this._pageSize
                    ) - 1;

                    this._loadPRPage();
                }
            },
            _updatePaginationButtons: function () {

                var oPrevious = this.byId("idBtnPrevious");
                var oNext = this.byId("idBtnNext");
                var oFirst = this.byId("idBtnFirst");
                var oLast = this.byId("idBtnLast");

                var iLastPage = Math.ceil(
                    this._totalCount / this._pageSize
                ) - 1;

                oPrevious.setEnabled(
                    this._currentPage > 0
                );

                oFirst.setEnabled(
                    this._currentPage > 0
                );

                oNext.setEnabled(
                    this._currentPage < iLastPage
                );

                oLast.setEnabled(
                    this._currentPage < iLastPage
                );
            },
            _updatePageNumbers: function () {

                var oPageNumbers = this.byId("idPageNumbers");

                // Remove existing buttons
                oPageNumbers.removeAllItems();

                var iTotalPages = Math.ceil(
                    this._totalCount / this._pageSize
                );

                var iCurrentPage = this._currentPage;

                // Current page
                var oCurrentButton = new sap.m.Button({
                    text: String(iCurrentPage + 1),
                    type: "Emphasized",
                    press: this.onPageNumberPress.bind(this)
                });

                oCurrentButton.data("pageIndex", iCurrentPage);

                oPageNumbers.addItem(oCurrentButton);

                // Next page
                if (iCurrentPage + 1 < iTotalPages) {

                    var oNextButton = new sap.m.Button({
                        text: String(iCurrentPage + 2),
                        type: "Default",
                        press: this.onPageNumberPress.bind(this)
                    });

                    oNextButton.data("pageIndex", iCurrentPage + 1);

                    oPageNumbers.addItem(oNextButton);
                }
            },
            onPageNumberPress: function (oEvent) {

                var oButton = oEvent.getSource();

                var iPageIndex = oButton.data("pageIndex");

                this._currentPage = iPageIndex;

                this._loadPRPage();
            },
            onApprove: function () {
                var aSelectedData = this._getSelectedRequisitions();
                if (!aSelectedData.length) {
                    MessageToast.show(
                        "Select at least one requisition to approve"
                    );
                    return;
                }

                console.log("Selected PRs for approval:", aSelectedData);

                // SINGLE APPROVAL
                if (aSelectedData.length === 1) {
                    this._openApproveDialog(aSelectedData[0]);
                    return;
                }

                // BULK APPROVAL
                MessageBox.confirm("Approve " +
                    this._getUniquePRCount(aSelectedData) +
                    " selected purchase requisition(s)?",
                    {
                        title: "Confirm Approval",

                        onClose: function (sAction) {

                            if (sAction === MessageBox.Action.OK) {

                                this._openBulkApproveDialog(
                                    aSelectedData
                                );
                            }

                        }.bind(this)
                    }
                );
            },
            _openApproveDialog: function (oPRData) {
                var that = this;
                // Destroy previous dialog if any
                if (this._oApproveDialog) {
                    this._oApproveDialog.destroy();
                    this._oApproveDialog = null;
                }
                // var iUniquePRCount =
                //     this._getUniquePRCount(oPRData);
                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter notes (optional)"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Purchase Requisition: " +
                                (oPRData.Banfn || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Text({
                            text: "Item: " +
                                (oPRData.Bnfpo || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Notes"
                        }),

                        oNotesTextArea
                    ]
                });

                this._oApproveDialog = new Dialog({
                    title: "Approve Purchase Requisition",
                    contentWidth: "500px",
                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({
                        text: "Approve",
                        type: "Accept",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            console.log("Approval notes:", sNotes);

                            that._oApproveDialog.close();

                            that._submitApproval(
                                [oPRData],
                                "A",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({
                        text: "Cancel",

                        press: function () {
                            that._oApproveDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oApproveDialog.destroy();
                        that._oApproveDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oApproveDialog
                );

                this._oApproveDialog.open();
            },
            _openBulkApproveDialog: function (aPRData) {

                var that = this;

                if (this._oBulkApproveDialog) {
                    this._oBulkApproveDialog.destroy();
                    this._oBulkApproveDialog = null;
                }

                var iUniquePRCount = this._getUniquePRCount(aPRData);

                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter notes (optional)"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Selected Purchase Requisitions: " +
                                iUniquePRCount
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Notes"
                        }),

                        oNotesTextArea
                    ]
                });

                this._oBulkApproveDialog = new Dialog({

                    title: "Approve Purchase Requisitions",

                    contentWidth: "500px",

                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({

                        text: "Approve",

                        type: "Accept",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            console.log(
                                "Bulk approval notes:",
                                sNotes
                            );

                            that._oBulkApproveDialog.close();

                            that._submitApproval(
                                aPRData,
                                "A",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({

                        text: "Cancel",

                        press: function () {
                            that._oBulkApproveDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oBulkApproveDialog.destroy();
                        that._oBulkApproveDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oBulkApproveDialog
                );

                this._oBulkApproveDialog.open();
            },
            _submitApproval: function (aPRData, sRequestId, sMessage) {
                var oModel = this.getOwnerComponent() ? this.getOwnerComponent().getModel("Z_PR_APPROVAL_SRV") : null;
                var sActionText = sRequestId === "R" ? "rejected" : "approved";
                var aProcessedIds = aPRData.map(function (o) {
                    return String(o.Banfn) + "_" + String(o.Bnfpo);
                });

                var fnApplyLocalUpdate = function () {
                    if (this._aAllRequisitions) {
                        this._aAllRequisitions = this._aAllRequisitions.filter(function (oItem) {
                            return aProcessedIds.indexOf(String(oItem.Banfn) + "_" + String(oItem.Bnfpo)) === -1;
                        });
                    }
                    MessageToast.show(
                        "Requisition(s) successfully " + sActionText + (sMessage ? " (Note: " + sMessage + ")" : "")
                    );
                    var oTable = this.byId("idTblRequisitions");
                    if (oTable && oTable.clearSelection) {
                        oTable.clearSelection();
                    }
                    this.onSelectionChange();
                    this.onGoPress();
                }.bind(this);

                if (!this._bUseOData || !oModel || typeof oModel.create !== "function") {
                    fnApplyLocalUpdate();
                    return;
                }

                var aReqItems = [];

                aPRData.forEach(function (oPR) {

                    var oItem = {
                        RequestId: sRequestId,
                        Banfn: oPR.Banfn || "",
                        Bnfpo: oPR.Bnfpo || "",
                        Frggr: oPR.Frggr || "",
                        Frgco: oPR.Frgco || "",
                        WiId: oPR.WiId || "",
                        Message: sMessage
                    };

                    aReqItems.push(oItem);
                });

                var oPayload = {
                    RequestId: sRequestId,
                    Req_Items: aReqItems
                };

                console.log(
                    "Approve POST Payload:",
                    JSON.stringify(oPayload, null, 2)
                );

                oModel.create(
                    "/DecisionReqSet",
                    oPayload,
                    {

                        success: function (oData) {

                            console.log(
                                "Approve POST SUCCESS:",
                                oData
                            );
                            fnApplyLocalUpdate();

                        }.bind(this),

                        error: function (oError) {

                            console.warn("Backend decision error, applying local state update:", oError);
                            fnApplyLocalUpdate();
                        }.bind(this)
                    }
                );
            },
            _processApprovalResponse: function (oData, aPRData, sRequestId) {

                console.log(
                    "Backend approval response:",
                    oData
                );

                var aResults = [];

                if (
                    oData &&
                    oData.Req_Items &&
                    oData.Req_Items.results
                ) {

                    aResults = oData.Req_Items.results;

                } else if (
                    oData &&
                    oData.Req_Items
                ) {

                    aResults = oData.Req_Items;
                }

                console.log(
                    "Approval results:",
                    aResults
                );

                var aSuccess = [];
                var aErrors = [];

                aResults.forEach(function (oResult) {

                    if (
                        String(oResult.Status || "")
                            .toUpperCase() === "SUCCESS"
                    ) {

                        aSuccess.push(oResult);

                    } else {

                        aErrors.push(oResult);
                    }

                });
                var sActionText =
                    sRequestId === "R" ? "rejected" : "approved";
                console.log(
                    "Successfully approved:",
                    aSuccess
                );

                console.log(
                    "Approval errors:",
                    aErrors
                );

                /*
                 * REMOVE ONLY SUCCESSFULLY APPROVED PRs
                 */
                // if (aSuccess.length > 0) {

                //     this._removeApprovedPRsFromTable(
                //         aSuccess
                //     );
                // }

                if (
                    aSuccess.length > 0 &&
                    aErrors.length === 0
                ) {

                    // MessageBox.success(
                    //     aSuccess.length +
                    //     " purchase requisition(s) approved successfully."
                    // );
                    var sActionText =
                        sRequestId === "R" ? "rejected" : "approved";

                    // MessageBox.success(
                    //     aSuccess.length +
                    //     " purchase requisition(s) " +
                    //     sActionText +
                    //     " successfully."
                    // );

                    var iUniqueSuccessPRCount =
                        this._getUniquePRCount(aSuccess);

                    MessageBox.success(
                        iUniqueSuccessPRCount +
                        " purchase requisition(s) " +
                        sActionText +
                        " successfully."
                    );

                } else if (
                    aSuccess.length === 0 &&
                    aErrors.length > 0
                ) {

                    var sErrorMessage =
                        "The following purchase requisition(s) could not be " +
                        sActionText +
                        ":\n\n";
                    aErrors.forEach(function (oError) {

                        sErrorMessage +=
                            (oError.Banfn || "") +
                            "/" +
                            (oError.Bnfpo || "") +
                            ": " +
                            (oError.Message || "Approval failed") +
                            "\n";
                    });

                    MessageBox.error(
                        sErrorMessage
                    );

                } else if (
                    aSuccess.length > 0 &&
                    aErrors.length > 0
                ) {

                    // var sPartialMessage =
                    //     aSuccess.length +
                    //     " requisition(s) " +
                    //     sActionText +
                    //     " successfully.\n\n";

                    // sPartialMessage +=
                    //     aErrors.length +
                    //     " requisition(s) could not be " +
                    //     sActionText +
                    //     ":\n\n";
                    var iUniqueSuccessPRCount =
                        this._getUniquePRCount(aSuccess);

                    var iUniqueErrorPRCount =
                        this._getUniquePRCount(aErrors);

                    var sPartialMessage =
                        iUniqueSuccessPRCount +
                        " requisition(s) " +
                        sActionText +
                        " successfully.\n\n";

                    sPartialMessage +=
                        iUniqueErrorPRCount +
                        " requisition(s) could not be " +
                        sActionText +
                        ":\n\n";

                    aErrors.forEach(function (oError) {

                        sPartialMessage +=
                            (oError.Banfn || "") +
                            "/" +
                            (oError.Bnfpo || "") +
                            ": " +
                            (oError.Message || "Approval failed") +
                            "\n";
                    });

                    MessageBox.warning(
                        sPartialMessage
                    );
                }

            },
            // _removeApprovedPRsFromTable: function (aSuccessResults) {

            //     var oTable = this.byId("idTblRequisitions");
            //     var oPRResultModel = oTable.getModel("PRResult");

            //     if (!oPRResultModel) {
            //         return;
            //     }

            //     var aData = oPRResultModel.getProperty("/results") || [];

            //     // Create list of successfully approved PR + Item combinations
            //     var oApprovedMap = {};

            //     aSuccessResults.forEach(function (oResult) {

            //         var sKey =
            //             String(oResult.Banfn || "") +
            //             "_" +
            //             String(oResult.Bnfpo || "");

            //         oApprovedMap[sKey] = true;
            //     });

            //     // Keep only PRs which were NOT successfully approved
            //     var aRemainingData = aData.filter(function (oPR) {

            //         var sKey =
            //             String(oPR.Banfn || "") +
            //             "_" +
            //             String(oPR.Bnfpo || "");

            //         return !oApprovedMap[sKey];
            //     });

            //     // Update table model
            //     oPRResultModel.setProperty(
            //         "/results",
            //         aRemainingData
            //     );

            //     oPRResultModel.refresh(true);

            //     // Clear selection
            //     oTable.removeSelections(true);

            //     // Disable buttons
            //     this.byId("idBtnApprove").setEnabled(false);
            //     this.byId("idBtnReject").setEnabled(false);

            //     console.log(
            //         "Remaining PRs in table:",
            //         aRemainingData
            //     );
            // },

            onRequisitionLinkPress: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("PRResult") || oEvent.getSource().getBindingContext();

                if (!oContext) {
                    return;
                }

                var oData = oContext.getObject();
                var sReq = oData.Banfn || "";

                var oDialog = new Dialog({
                    title: "Purchase Requisition " + sReq + " (Item " + (oData.Bnfpo || "") + ")",
                    contentWidth: "480px",
                    stretchOnPhone: true,
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.ObjectHeader({
                                    title: oData.Txz01 || "Requisition Item",
                                    number: String(oData.Netpr || "0.00"),
                                    numberUnit: oData.Waers || "ZAR",
                                    attributes: [
                                        new sap.m.ObjectAttribute({ title: "Material", text: oData.Matnr || "-" }),
                                        new sap.m.ObjectAttribute({ title: "Quantity", text: (oData.Menge || "") + " " + (oData.Meins || "") }),
                                        new sap.m.ObjectAttribute({ title: "Plant", text: (oData.Werks || "") + " - " + (oData.PlantName1 || "") }),
                                        new sap.m.ObjectAttribute({ title: "Vendor", text: (oData.Lifnr || "") + " - " + (oData.VendorName1 || "") }),
                                        new sap.m.ObjectAttribute({ title: "Doc Type", text: oData.Bsart || "NB" }),
                                        new sap.m.ObjectAttribute({ title: "Purchase Group", text: (oData.Ekgrp || "") + " (" + (oData.Eknam || "") + ")" }),
                                        new sap.m.ObjectAttribute({ title: "Release Group", text: (oData.Frggr || "") + " (" + (oData.Frggt || "") + ")" }),
                                        new sap.m.ObjectAttribute({ title: "Release Code", text: (oData.Frgco || "") + " (" + (oData.Frgct || "") + ")" })
                                    ]
                                })
                            ]
                        }).addStyleClass("sapUiSmallMargin")
                    ],
                    beginButton: new Button({
                        text: "Close",
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });

                this.getView().addDependent(oDialog);
                oDialog.open();
            },

            onRequisitionPress: function (oEvent) {

                var oContext =
                    oEvent
                        .getSource()
                        .getBindingContext(
                            "Z_PR_APPROVAL_SRV"
                        );


                if (!oContext) {
                    return;
                }


                console.log(
                    "Selected PR:",
                    oContext.getObject()
                );
            },


            onReject: function () {
                var aSelectedData = this._getSelectedRequisitions();

                if (!aSelectedData.length) {
                    MessageToast.show(
                        "Select at least one requisition to reject"
                    );
                    return;
                }

                console.log(
                    "Selected PRs for rejection:",
                    aSelectedData
                );

                // SINGLE REJECTION
                if (aSelectedData.length === 1) {

                    this._openRejectDialog(
                        aSelectedData[0]
                    );

                    return;
                }

                // BULK REJECTION
                MessageBox.confirm(
                    "Reject " +
                    this._getUniquePRCount(aSelectedData) +
                    " selected purchase requisition(s)?",
                    {
                        title: "Confirm Rejection",

                        onClose: function (sAction) {

                            if (sAction === MessageBox.Action.OK) {

                                this._openBulkRejectDialog(
                                    aSelectedData
                                );
                            }

                        }.bind(this)
                    }
                );
            },
            _openRejectDialog: function (oPRData) {

                var that = this;

                if (this._oRejectDialog) {
                    this._oRejectDialog.destroy();
                    this._oRejectDialog = null;
                }

                // var iUniquePRCount =
                //     this._getUniquePRCount(aPRData);


                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter rejection reason",
                    valueState: "None"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Purchase Requisition: " +
                                (oPRData.Banfn || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Text({
                            text: "Item: " +
                                (oPRData.Bnfpo || "")
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Rejection Notes",
                            required: true
                        }),

                        oNotesTextArea
                    ]
                });

                this._oRejectDialog = new Dialog({

                    title: "Reject Purchase Requisition",

                    contentWidth: "500px",

                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({

                        text: "Reject",

                        type: "Reject",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            // Mandatory validation
                            if (!sNotes) {

                                oNotesTextArea.setValueState(
                                    "Error"
                                );
                                oNotesTextArea.setValueStateText(
                                    "Rejection notes are mandatory."
                                );

                                MessageToast.show(
                                    "Please enter rejection notes."
                                );

                                return;
                            }

                            console.log(
                                "Rejection notes:",
                                sNotes
                            );

                            that._oRejectDialog.close();

                            that._submitApproval(
                                [oPRData],
                                "R",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({

                        text: "Cancel",

                        press: function () {
                            that._oRejectDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oRejectDialog.destroy();
                        that._oRejectDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oRejectDialog
                );

                this._oRejectDialog.open();
            },
            _openBulkRejectDialog: function (aPRData) {

                var that = this;

                if (this._oBulkRejectDialog) {
                    this._oBulkRejectDialog.destroy();
                    this._oBulkRejectDialog = null;
                }

                var iUniquePRCount = this._getUniquePRCount(aPRData);

                var oNotesTextArea = new TextArea({
                    width: "100%",
                    rows: 6,
                    placeholder: "Enter rejection reason",
                    valueState: "None"
                });

                var oContent = new sap.m.VBox({
                    width: "100%",
                    items: [

                        new sap.m.Text({
                            text: "Selected Purchase Requisitions: " +
                                iUniquePRCount
                        }).addStyleClass("sapUiSmallMarginBottom"),

                        new sap.m.Label({
                            text: "Rejection Notes",
                            required: true
                        }),

                        oNotesTextArea
                    ]
                });

                this._oBulkRejectDialog = new Dialog({

                    title: "Reject Purchase Requisitions",

                    contentWidth: "500px",

                    stretchOnPhone: true,

                    content: [
                        oContent
                    ],

                    beginButton: new Button({

                        text: "Reject",

                        type: "Reject",

                        press: function () {

                            var sNotes =
                                oNotesTextArea.getValue().trim();

                            if (!sNotes) {

                                oNotesTextArea.setValueState(
                                    "Error"
                                );

                                oNotesTextArea.setValueStateText(
                                    "Rejection notes are mandatory."
                                );

                                MessageToast.show(
                                    "Please enter rejection notes."
                                );

                                return;
                            }

                            console.log(
                                "Bulk rejection notes:",
                                sNotes
                            );

                            that._oBulkRejectDialog.close();

                            that._submitApproval(
                                aPRData,
                                "R",
                                sNotes
                            );
                        }
                    }),

                    endButton: new Button({

                        text: "Cancel",

                        press: function () {
                            that._oBulkRejectDialog.close();
                        }
                    }),

                    afterClose: function () {

                        that._oBulkRejectDialog.destroy();
                        that._oBulkRejectDialog = null;
                    }
                });

                this.getView().addDependent(
                    this._oBulkRejectDialog
                );

                this._oBulkRejectDialog.open();
            },

        });
});