(function (angular, _) {

    "use strict";

    angular.module("mfl.service_mgmt.controllers.services", [
        "mfl.service_mgmt.services",
        "ui.router",
        "angular-toasty"
    ])

    .controller("mfl.service_mgmt.controllers.service_list", ["$scope", function ($scope) {
        $scope.filters = {
            "fields": "id,code,name,abbreviation,category_name"
        };
    }])

    .controller("mfl.service_mgmt.controllers.service_edit",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.service_mgmt.wrappers", "toasty",
        function ($scope, $state, $stateParams, $log, wrappers, toasty) {
            $scope.create = false;
            $scope.steps = [
                {
                    name : "basic",
                    prev : [],
                    count: "1"
                },
                {
                    name : "options",
                    prev : ["basic"],
                    count: "2"
                }
            ];
            $scope.edit_view = true;
            $scope.service_id = $stateParams.service_id;
            $scope.wrapper = wrappers.services;
            $scope.tabState = function(obj) {
                _.each($scope.steps, function (step) {
                    if(step.name === obj.name) {
                        step.active = true;
                    }
                    else {
                        step.active = false;
                    }
                });
                $state.go(
                        "service_mgmt.service_list.service_edit."+ obj.name,
                        {service_id : $scope.service_id});
            };
            wrappers.services.get($scope.service_id).success(function (data) {
                $scope.service = data;
                $scope.deleteText = $scope.service.name;
            }).error(function (data) {
                $log.warn(data);
                $scope.errors = data;
            });
            $scope.remove = function () {
                wrappers.services.remove($scope.service_id).success(function(){
                    toasty.success({
                        title : "Service Deletion",
                        msg : "Service successfully deleted"
                    });
                    $state.go("service_mgmt.service_list",{},{reload:true});
                }).error(function(error){
                    $scope.errors = error;
                });
            };
            $scope.cancel = function () {
                $state.go("service_mgmt.service_list.service_edit");
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.service_edit.basic",
        ["$scope", "$state", "$log", "mfl.service_mgmt.wrappers",
        "mfl.common.forms.changes", "toasty",
        function ($scope, $state, $log, wrappers, forms, toasty) {
            $scope.steps[0].active = true;
            $scope.steps[1].active = false;
            wrappers.categories.filter({page_size: 2000}).success(function (data) {
                $scope.categories = data.results;
            }).error(function (data) {
                $log.warn(data);
                $scope.errors = data;
            });
            wrappers.option_groups.filter({page_size: 2000}).success(function (data) {
                $scope.option_groups = data.results;
            }).error(function (data) {
                $scope.errors = data;
            });
            $scope.save = function (frm) {
                var changed = forms.whatChanged(frm);

                if (! _.isEmpty(changed)) {
                    wrappers.services.update($scope.service_id, changed)
                        .success(function () {
                            toasty.success({
                                title: "Services Updated",
                                msg: "Servuce updated successfully"
                            });
                            $state.go( "service_mgmt.service_list",
                                {reload: true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                }
                else {
                    $state.go( "service_mgmt.service_list",
                                {reload: true});
                }
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.service_edit.options",
        ["$scope", "$state", "$log", "mfl.service_mgmt.wrappers",
        function ($scope, $state, $log, wrappers) {
            $scope.service_options = [];
            if($scope.create) {
                $scope.nextState();
            }
            if(!$scope.create) {
                $scope.steps[0].active = false;
                $scope.steps[1].active = true;
            }
            $scope.options = [];
            $scope.new_option_id = "";
            $scope.service_id = $scope.service_id || $state.params.service_id;
            wrappers.options.filter({page_size: 10000}).success(function (data) {
                $scope.options = data.results;
            }).error(function (data) {
                $log.warn(data);
            });
            wrappers.service_options.filter({page_size: 10000, service: $scope.service_id})
            .success(function (data) {
                $scope.service_options = data.results;
            })
            .error(function (data) {
                $log.warn(data);
            });
            $scope.addOption = function () {
                $scope.spinner = true;
                var data = {
                    "service": $scope.service_id,
                    "option": $scope.new_option_id
                };
                wrappers.service_options.create(data)
                .success(function (data) {
                    $scope.spinner = false;
                    $scope.service_options.push(data);
                    $scope.new_option_id = "";
                })
                .error(function (data) {
                    $scope.spinner = false;
                    $log.warn(data);
                });
            };
            $scope.removeChild = function (service_opt) {
                wrappers.service_options.remove(service_opt.id)
                .success(function () {
                    $scope.service_options = _.without($scope.service_options, service_opt);
                })
                .error(function (data) {
                    $log.warn(data);
                });
            };
            $scope.cancel= function(){
                $state.go("service_mgmt.service_list.service_edit.options");
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.service_create",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.service_mgmt.wrappers", "mfl.common.services.multistep",
        function ($scope, $state, $stateParams, $log, wrappers, multistepService) {
            $scope.create = true;
            $scope.tab = 0;
            $scope.furthest = $stateParams.furthest;
            $scope.service = wrappers.newService();
            wrappers.categories.filter({page_size: 10000}).success(function (data) {
                $scope.categories = data.results;
            }).error(function (data) {
                $log.warn(data);
                $scope.errors = data;
            });

            $scope.new_service = $state.params.service_id;
            $scope.steps = [
                {
                    name : "basic",
                    prev : [],
                    count: "1"
                },
                {
                    name : "options",
                    prev : ["basic"],
                    count: "2"
                }
            ];
            $scope.nextState = function () {
                var curr = $state.current.name;
                curr = curr.split(".", 4).pop();
                multistepService.nextState($scope, $stateParams ,
                    $scope.steps, curr);
            };
            $scope.tabState = function (obj) {
                if(obj.active || obj.done || obj.furthest) {
                    $scope.nextState();
                    $state.go(
                        "service_mgmt.service_list.service_create."+ obj.name,
                    {furthest: $scope.furthest, service_id : $scope.new_service});
                }
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.service_create.basic",[
        "$scope", "$state", "$log", "mfl.service_mgmt.wrappers",
        "mfl.common.forms.changes", "toasty",
        function ($scope, $state, $log, wrappers, formChanges, toasty) {
            $scope.$parent.tab = 1;
            $scope.nextState();
            wrappers.option_groups.filter({page_size: 10000}).success(function (data) {
                $scope.option_groups = data.results;
            }).error(function (data) {
                $scope.errors = data;
            });
            if(!_.isEmpty($state.params.service_id)) {
                wrappers.services.get($state.params.service_id)
                .success(function (data) {
                    $scope.service = data;
                })
                .error(function (data) {
                    $log.warn(data);
                    $scope.errors = data;
                });
            }
            $scope.save = function (frm) {
                if(!_.isEmpty($state.params.service_id)) {
                    var changes = formChanges.whatChanged(frm);

                    if (! _.isEmpty(changes)) {
                        wrappers.services.update(
                            $state.params.service_id, changes)
                        .success(function () {
                            $state.go("service_mgmt.service_list.service_create.options",
                                {service_id : $state.params.service_id, furthest : 2});
                        })
                        .error (function (err) {
                            $scope.errors = err.error;
                        });
                    }
                    else {
                        $state.go("service_mgmt.service_list.service_create.options",
                                {service_id : $state.params.service_id, furthest : 2});
                    }
                }
                else {
                    wrappers.services.create($scope.service)
                    .success(function () {
                        toasty.success({
                            title: "Service Added",
                            msg: "Service added successfully"
                        });
                        $state.go("service_mgmt.service_list", {reload: true});
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }
            };
        }
    ]);

})(window.angular, window._);
