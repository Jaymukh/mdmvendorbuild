/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"murphy/mdm/vendor/murphymdmvendor/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});