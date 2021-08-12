(function (angular, _) {
    "use strict";

    angular.module("mfl.hr_mgmt.controllers.specialists", [
        "mfl.hr_mgmt.services",
        "ui.router",
        "angular-toasty"
    ])

    .controller("mfl.hr_mgmt.controllers.specialists_list", ["$scope", function($scope) {
        $scope.filters = {
            "fields": "id,name,category_name"
        };
    }])

    .controller("mfl.hr_mgmt.controllers.specialists_edit",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.hr_mgt.wrappers", 
        "mfl.common.forms.changes", "toasty",
        function($scope, $state, $stateParams, $log, wrappers, forms, toasty) {
            $scope.specialist_id = $stateParams.specialist_id;
            $scope.wrappers = wrappers.specialists;
            $scope.edit_view = true;
            wrappers.categories.filter({page_size: 10000}).success(function(data) {
                $scope.categories = data.results;
            }).error(function(data) {
                $scope.errors = data;
            });

            wrappers.specialists.get($scope.specialist_id).success(function (data) {
                $scope.specialists = data;
                $scope.deleteText = $scope.specialists.name;
            }).error(function(data) {
                $scope.errors = data;
            });

            $scope.save = function(frm) {
                var changed = forms.whatChanged(frm);
                if (!_.isEmpty(changed)) {
                    wrappers.specialists.update($scope.specialist_id, changed)
                        .success(function () {
                            toasty.success({
                                title: "HR updated",
                                msg: "HR updated successfully"
                            });
                            $state.go("hr_mgmt.specialists_list",
                                {reload: true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                }
                else {
                    $state.go("hr_mgmt.specialists_list",
                    {reload: true});
                }
            }
        }
    ])
    .controller("mfl.hr_mgmt.controllers.specialists_edit",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.hr_mgmt.wrappers", "toasty",
        function($scope, $state, $stateParams, $log, wrappers, toasty) {
            $scope.specialist_id = $stateParams.specialist_id;
            $scope.wrappers = wrappers.specialists;
            $scope.edit_view = true;
            wrappers.categories.filter({page_size: 10000}).success(function(data) {
                $scope.categories = data.results;
            }).error(function(data) {
                $scope.errors = data;
            });

            wrappers.specialists.get($scope.specialist_id).success(function (data) {
                $scope.specialist = data;
                $scope.deleteText = $scope.specialist.name;
            }).error(function(data) {
                $scope.errors = data;
            });

            $scope.save = function(frm) {
                var changed = forms.whatChanged(frm);
                if (!_.isEmpty(changed)) {
                    wrappers.specialists.update($scope.specialist_id, changed)
                        .success(function () {
                            toasty.success({
                                title: "Speciality updated",
                                msg: "Speciality updated successfully"
                            });
                            $state.go("hr_mgmt.specialists_list",
                                {reload: true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                }
                else {
                    $state.go("hr_mgmt.specialists_list",
                    {reload: true});
                }
            }
            $scope.remove = function () {
                wrappers.specialists.remove($scope.specialist_id).success(function() {
                    toasty.success({
                        title: "Speciality Deletion",
                        msg: "Speciality successfully deleted"
                    });
                    $state.go("hr_mgmt.specialists_list", {}, {reload: true});
                }).error(function(data) {
                    $scope.errors = data;
                });
            }
        }
    ])

    .controller("mfl.hr_mgmt.controllers.specialists_create",
        ["$scope", "$state", "$stateParams", "$log", "mfl.hr_mgmt.wrappers",
        "toasty",
        function ($scope, $state, $stateParams, $log, wrappers, toasty) {
            $scope.create = true;
            $scope.specialist = wrappers.newSpecialist();
            wrappers.categories.filter({page_size: 10000}).success(function (data) {
                $scope.categories = data.results;
            }).error(function (data) {
                $log.warn(data);
                $scope.errors = data;
            });

            $scope.save = function() {
                wrappers.specialists.create($scope.specialist)
                .success(function (data) {
                    toasty.success({
                        title: "Speciality added",
                        msg: "Speciality has been added"
                    });
                    $state.go(
                        "hr_mgmt.specialists_list",
                        {"specialist_id": data.id},
                        {reload: true}
                    );
                }).error(function(data) {
                    $scope.errors = data;
                });
            }
        }
    ]);
})(window.angular, window._);