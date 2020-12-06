(function (angular, _) {
    "use strict";

    angular.module("mfl.infrastructure_mgmt.controllers.infrastructure", [
        "mfl.infrastructure_mgmt.services",
        "ui.router",
        "mfl.common.forms",
        "angular-toasty"
    ])

    .controller("mfl.infrastructure_mgmt.controllers.infrastructure_list", ["$scope", function($scope) {
        $scope.filters = {
            "fields": "id,name,category_name"
        };
    }])

    .controller("mfl.infrastructure_mgmt.controllers.infrastructure_edit",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.infrastructure_mgmt.wrappers", 
        "mfl.common.forms.changes", "toasty",
        function($scope, $state, $stateParams, $log, wrappers, forms, toasty) {
            $scope.infrastructure_id = $stateParams.infrastructure_id;
            $scope.wrappers = wrappers.infrastructure;
            $scope.edit_view = true;
            wrappers.categories.filter({page_size: 1000}).success(function(data) {
                $scope.categories = data.results;
            }).error(function(data) {
                $scope.errors = data;
            });

            wrappers.infrastructure.get($scope.infrastructure_id).success(function (data) {
                $scope.infrastructure = data;
                $scope.deleteText = $scope.infrastructure.name;
            }).error(function(data) {
                $scope.errors = data;
            });

            $scope.save = function(frm) {
                var changed = forms.whatChanged(frm);
                if (!_.isEmpty(changed)) {
                    wrappers.infrastructure.update($scope.infrastructure_id, changed)
                        .success(function () {
                            toasty.success({
                                title: "Infrastructure updated",
                                msg: "Infrastructure updated successfully"
                            });
                            $state.go("infrastructure_mgmt.infrastructure_list",
                                {reload: true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                }
                else {
                    $state.go("infrastructure_mgmt.infrastructure_list",
                    {reload: true});
                }
            }
            $scope.remove = function () {
                wrappers.infrastructure.remove($scope.infrastructure_id).success(function() {
                    toasty.success({
                        title: "Infrastructure Deletion",
                        msg: "Infrastructure successfully deleted"
                    });
                    $state.go("infrastructure_mgmt.infrastructure_list", {}, {reload: true});
                }).error(function(data) {
                    $scope.errors = data;
                });
            }
            $scope.cancel = function () {
                $state.go("infrastructure_mgmt.infrastructure_list.infrastructure_edit");
            }
        }
    ])

    .controller("mfl.infrastructure_mgmt.controllers.infrastructure_create",
        ["$scope", "$state", "$stateParams", "$log", "mfl.infrastructure_mgmt.wrappers",
        function ($scope, $state, $stateParams, $log, wrappers) {
            $scope.create = true;
            $scope.infrastructure = wrappers.newInfrastructure();
            wrappers.categories.filter({page_size: 1000}).success(function (data) {
                $scope.categories = data.results;
            }).error(function (data) {
                $log.warn(data);
                $scope.errors = data;
            });

            $scope.save = function() {
                wrappers.infrastructure.create($scope.infrastructure)
                .success(function (data) {
                    toasty.success({
                        title: "Infrastructure added",
                        msg: "Infrastructure has been added"
                    });
                    $state.go(
                        "infrastructure_mgmt.infrastructure_list",
                        {"infrastructure_id": data.id},
                        {reload: true}
                    );
                }).error(function(data) {
                    $scope.errors = data;
                });
            }
        }
    ])
})(window.angular, window._);