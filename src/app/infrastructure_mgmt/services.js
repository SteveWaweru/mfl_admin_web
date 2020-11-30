(function (angular) {
    "use strict";

    angular.module("mfl.infrastructure_mgmt.services", [
        "api.wrapper"
    ])

    .service("mfl.infrastructure_mgmt.wrappers", ["api", function (api) {

        this.infrastructure = api.setBaseUrl("api/facilities/infrustructure/");

        this.categories = api.setBaseUrl("api/facilities/infrastructure_categories/");

        this.newCategory = function () {
            return {
                "name": "",
                "description": "",
            }
        }

        this.newInfrastructure = function () {
            return {
                "name": "",
                "description": "",
                "category": "",
            };
        }
    }])
})(window.angular);