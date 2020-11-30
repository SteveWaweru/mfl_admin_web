(function(angular) {
    "use strict";

    angular.module("mfl.infrastructure_mgmt", [
        "angular-toasty",
        "mfl.infrastructure_mgmt.states",
        "mfl.infrastructure_mgmt.services",
        "mfl.infrastructure_mgmt.controllers",
        "mfl.common.filters",
        "mfl.common.services"
    ]);

})(window.angular);