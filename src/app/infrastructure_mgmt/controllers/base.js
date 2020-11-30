(function (angular) {
    "use strict";

    angular.module("mfl.infrastructure_mgmt.controllers.base", [])

    .controller("mfl.infrastructure_mgmt.controllers.main", ["$scope", "$state",
        function($scope, $state) {
            $scope.tooltip = {
                "title": "tooltip",
                "checked": false,
            };
            $scope.edit_view = (($state.current_name).indexOf("edit") > -1);
        }])

        .controller("mfl.infrastructure_mgmt.controllers.main.toc", [angular.noop]);
})(window.angular);