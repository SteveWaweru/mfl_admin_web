(function(angular){
    "use strict";
    angular.module("mfl.setup.town.controllers",[
        "mfl.setup.api"
    ])
    .controller("mfl.setup.controller.town.list", ["$scope",
        function ($scope) {
            $scope.test = "View administrative area";
            $scope.path = [
                {
                    name: "Adminstrative area",
                    route: "admin_units"
                },
                {
                    name: "Wards",
                    route: "admin_unit.wards"
                }
            ];
            $scope.title = [
                {
                    icon: "fa-map-marker",
                    name: "View Wards"
                }
            ];
            $scope.action = [
                {
                    func : "onclick=window.history.back()",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go back",
                    icon: "fa-arrow-left"
                }
            ];
        }]
    );
})(angular);
