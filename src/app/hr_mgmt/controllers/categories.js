(function (angular, _) {
    "use strict";

    angular.module("mfl.hr_mgmt.controllers.categories", [
        "ui.router",
        "mfl.common.forms",
        "mfl.hr_mgmt.services",
        "angular-toasty"
    ])

    .controller("mfl.hr_mgmt.controllers.categories_list", ["$scope", function($scope) {
        $scope.filters = {
            "fields": "id,name,description,"
        };
    }])

    .controller("mfl.hr_mgmt.controllers.categories_edit", 
        ["$scope", "$state", "$stateParams", "$log", "mfl.hr_mgmt.wrappers",
        "mfl.common.forms.changes", "toasty", 
        function ($scope, $sstate, $stateParams,
            $log, wrappers, forms, toasty) {
                $scope.category_id = $stateParams.category_id;
                $scope.wrapper = wrappers.categories;

                $scope.filters = {category:$scope.category_id};
                $scope.edit_view = true;

                wrappers.categories.get($scope.category_id).success(function (data) {
                    $scope.category = data;
                    $scope.deleteText = $scope.category.name;
                }).error(function (data) {
                    $scope.errors = data;
                });

                wrappers.categories.filter({"fields": "id,name", "page_size": 100})
                    .success(function (data) {
                        $scope.parents = _.without(
                            data.results, _.findWhere(data.results, { "id": $scope.category_id})
                        );
                    }).error(function (data) {
                        $scope.errors = data;
                    });

                $scope.save = function (frm) {
                    var changed = forms.whatChanged(frm);

                    if (!_.isEmpty(changed)) {
                        wrappers.categories.update($scope.category_id, changed)
                            .success(function () {
                                toasty.success({
                                    title: "Category updated",
                                    msg: "Category has been updated"
                                });
                                $state.go(
                                    "hr_mgmt.categories_list",
                                    {"category_id": $scope.category_id},
                                    {reload: true}
                                );
                            }).error(function (data) {
                                $scope.errors = data;
                            })
                    }
                };
                $scope.remove = function () {
                    wrappers.categories.remove($scope.category_id).success(function() {
                        toasty.success({
                            title: "Category deleted",
                            msg: "Category has been deleted"
                        });
                        $state.go("hr_mgmt.category_list", {}, {reload: true});
                    }).error(function(data) {
                        $scope.errors = data;
                    });
                };
                $scope.cancel = function () {
                    $state.go("hr_mgmt.categories_list.category_edit");
                }
            }])

        .controller("mfl.hr_mgmt.controllers.categories_create",
            ["$scope", "$state", "$log", "mfl.hr_mgmt.wrappers", "toasty",
            function ($scope, $state, $log, wrappers, toasty) {
                $scope.category = wrappers.newCategory();
                wrappers.categories.filter({"fields": "id,name", "page_size": 100})
                    .success(function (data) {
                        $scope.parents = data.results;
                    })
                    .error(function(data) {
                        $scope.errors = data;
                    });

                $scope.save = function() {
                    wrappers.categories.create($scope.category)
                        .success(function (data) {
                            toasty.success({
                                title: "Categories Added",
                                msg: "Category has been added"
                            });
                            $state.go(
                                "hr_mgmt.categories_list",
                                {"category_id": data.id},
                                {reload: true}
                            )
                        })
                        .error(function(data) {
                            $scope.errors = data;
                        });
                };
            }
        ])
})(window.angular, window._);