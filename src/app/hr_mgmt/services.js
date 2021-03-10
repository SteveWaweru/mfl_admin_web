(function (angular) {
    "use strict";

    angular.module("mfl.hr_mgmt.services", [
        "api.wrapper"
    ])

    .service("mfl.hr_mgmt.wrappers", ["api", function (api) {

        this.specialists = api.setBaseUrl("api/facilities/specialities/");

        this.categories = api.setBaseUrl("api/facilities/speciality_categories/");

        this.newCategory = function () {
            return {
                "name": "",
                "abbreviation": "",
                "description": ""
            }
        };

        this.newSpecialist = function () {
            return {
                "name": "",
                "description": "",
                "category": "",
                "abbreviation": ""
            };
        };
    }]);
})(window.angular);