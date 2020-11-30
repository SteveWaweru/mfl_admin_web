(function (angular) {
    "use strict";

    angular.module("mfl.hr_mgmt.controllers.base", [])

    .controller("mfl.hr_mgmt.controllers.main", ["$scope", "$state",
        function($scope, $state) {
            $scope.tooltip = {
                "title": "tooltip",
                "checked": false,
            };
            $scope.edit_view = (($state.current_name).indexOf("edit") > -1);
        }])

        .controller("mfl.hr_mgmt.controllers.main.toc", [angular.noop]);
})(window.angular);