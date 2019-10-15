(function (angular) {
    "use strict";

    angular.module("mfl.facility_mgmt.directives", [])
    .directive("filterPanel", function() {
        return {
            restrict: "E",
            scope: false,
            templateUrl: "facility_mgmt/tpls/facility.filter_panel.tpl.html",
            controller: "mfl.reports.controllers.facilities"
        };
    });
   
})(window.angular);
