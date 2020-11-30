(function (angular) {
    "use strict";

    /**
     * @ngdoc module
     * @name mflAdminApp
     *
     * @description
     * The main application module.
     * It combines the various components to make the application.
     *
     */
    angular.module("mflAdminApp", [
        "templates-app",
        "templates-common",
        "common.logging",
        "api.wrapper",
        "mflAdminAppConfig",
        "mfl.common",
        "mfl.auth",
        "mfl.users",
        "mfl.service_mgmt",
        "mfl.infrastructure_mgmt",
        "mfl.hr_mgmt",
        "mfl.setup",
        "mfl.dashboard",
        "mfl.reports",
        "mfl.facility_mgmt",
        "mfl.chul",
        "mfl.admin_offices",
        "mfl.downloads",
        "mfl.notifications",
        "jcs-autoValidate"
    ]);

})(window.angular);
