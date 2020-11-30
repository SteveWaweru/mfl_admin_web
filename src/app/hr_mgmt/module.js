(function(angular) {
    "use strict";

    angular.module("mfl.hr_mgmt", [
        "angular-toasty",
        "mfl.hr_mgmt.states",
        "mfl.hr_mgmt.services",
        "mfl.hr_mgmt.controllers",
        "mfl.common.filters",
        "mfl.common.services"
    ]);

})(window.angular);