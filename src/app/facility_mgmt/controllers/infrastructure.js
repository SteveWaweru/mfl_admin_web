(function(angular) {
    "use strict";

    /**
     * @ngdoc module
     * 
     * @name mfl.facility_mgmt.controllers.infrastructure
     * 
     * @description
     * Module containing controllers for facility human resources
     */

    angular.module("mfl.facility_mgmt.controllers.infrastructure", [
        "mfl.facility_mgmt.services",
        "mfl.common.forms",
        "720kb.datepicker",
        "mfl.common.constants",
        "nemLogging",
        "angular-toasty",
        "mfl.common.filters"
    ])

    /**
     * @ngdoc controller
     * 
     * @name mfl.facility_mgmt.controllers.infrastructure_helper
     * 
     * @description
     * The helper controller to manage services in add/edit a facility
     */

    .controller("mfl.facility_mgmt.controllers.infrastructure_helper", 
        ["$log", "mfl.facility_mgmt.services.wrappers", "mfl.error.messages",
        "$state", "toasty", "$stateParams",
        function($log, wrappers, errorMessages, $state, toasty, $stateParams) {
            var loadData = function ($scope) {
                // fetching infrastructure
                wrappers.infrastructure.filter({page_sizE: 100, ordering: "name"})
                .success(function(data) {
                    $scope.infrastructure = data.results;
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.infrastructure_error = errorMEssages.errors +
                        errorMessages.fetching_services;
                    $scope.alert = err.error;
                });

                wrappers.infrastructure_categories.filter({"fields": "id,name"})
                .success(function (data) {
                    $scope.categories = data.results;
                })
                .error(function (err) {
                    $scope.alert = err.error;
                });
                // TODO: Remove options from this implementation
                wrappers.options.list()
                .success(function (data) {
                    $scope.options = data.results;
                })
                .error(function (err) {
                    $scope.alert = err.error;
                });
            };
            // implemented as adding facility infrastructure
            var addInfrastructure = function ($scope, inf, present) {
                var payload = {
                    facility: $scope.facility_id,
                    infrastructure: inf,
                    present: present
                };
                return wrappers.facility_infrastructure.create(payload)
                .success(function(data) {
                    $scope.facility.facility_infrastructure.push(data);
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.infrastructure_error = errorMessages.errors +
                    errorMessages.services;
                    $scope.alert = data.error;
                });
            };

            var removeInfrastructure = function ($scope, fi) {
                return wrappers.facility_infrastructure.remove(fi.id)
                .success(function () {
                    $scope.facility.facility_infrastructure = _.without(
                        $scope.facility.facility_infrastructure, fi
                    );
                })
                .error(function(data){
                    $log.error(data);
                    $scope.service_error =  errorMessages.errors +
                        errorMessages.delete_services;
                    $scope.alert = data.error;
                });
            };

            this.bootstrap = function($scope) {
                loadData($scope);
                $scope.new_infrastructure = {
                    infrastructure: "",
                    present: "",
                };
                $scope.changeView = function (name) {
                    if ($scope.create) {
                        $state.go("facilities.facility_create.infrastructure."+name,
                            {
                                furthest: $scope.furthest, 
                                facility_id: $scope.new_facility
                            });
                    } else {
                        $state.go("facilities.facility_edit.infrastructure."+name);
                    }
                }
                $scope.infrastructureNumber = function (infrastructure) {
                    _.each(infrastructure, function(infra_obj) {
                        if($scope.facility.facility_infrastructure.length > 0) {
                            _.each($scope.facility.facility_infrastructure,
                            function (fac_infra) {
                                if(fac_infra.service_id === serv_obj.id) {
                                    infra_obj.fac_infra = fac_infra.id;
                                }
                            });
                        }
                    });
                };
                $scope.showInfrastructure = function(cat) {
                    if(cat.selected === false) {
                        cat.selected = true;
                    } else {
                        cat.selected = true;
                    }
                    _.each($scope.categories, function (one_cat) {
                        if (one_cat.selected === true &&
                            one_cat.id !== cat.id) {
                            one_cat.selected = !one_cat.selected;
                        }
                    });
                    $scope.cat_infrastructure = _.where($scope.infrastructure,
                        { "category": cat.id});
                    $scope.infrastructureNumber($scope.cat_infrastructure);
                }
                $scope.infrastructure = [];

                $scope.addInfrastructure = function (a, present) {
                    addInfrastructure($scope, a, present).then(function () {
                        $scope.new_infrastructure.infrastructure = "";
                        $scope.new_infrastructure.present = "";
                    });
                };
                $scope.removeChild = function (a) {
                    removeInfrastructure($scope, a);
                };
                $scope.fac_infra = {
                    infrastructure : []
                };
                $scope.infrastructure_display = [];
                $scope.removeInfrastructure = function (infra_obj) {
                    if(_.isUndefined(infra_obj.fac_infra)){
                        infra_obj.infra = "";
                        $scope.infrastructure_display = _.without(
                            $scope.infrastructure_display, infra_obj);
                    }else{
                        wrappers.facility_infrastructure.remove(infra_obj.fac_infra)
                        .success(function () {
                            toasty.success({
                                title: "Facility infrastructure",
                                msg: "Infrastructure successfully removed"
                            });
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    }
                };
                $scope.infrastructureDisplay = function (obj) {
                    if(_.where($scope.infrastructure_display, obj).length > 0) {
                        if(_.isEmpty(obj.present) || _.isUndefined(obj.present)){
                            $scope.infrastructure_display = _.without($scope.infrastructure_display, obj);
                        }
                    }else{
                        if(!_.isEmpty(obj.present) || obj.present === true){
                            $scope.service_display.push(obj);
                        }
                    }
                };
                $scope.facilityInfrastructure = function () {
                    _.each($scope.infrastructure, function (infra_obj) {
                        if(!_.isUndefined(infra_obj.present) &&
                            !_.isEmpty(infra_obj.present)) {
                            $scope.fac_infra.infrastructure.push({
                                infrastructure : infra_obj.id,
                                present : service_obj.present
                            });
                        }
                        if(!_.isUndefined(infra_obj.present) &&
                            infra_obj.present === true){
                            $scope.fac_infra.infrastructure.push({
                                infrastructure : infra_obj.id
                            });
                        }
                    });
                    _.each($scope.facility.facility_infrastructure,
                        function (facility_infrastructure) {
                            var obj = _.findWhere($scope.fac_infra.infrastructure,
                                {"infrastructure" : facility_infrastructure.infra_id});
                            $scope.fac_infra.infrastructure =
                                _.without($scope.fac_infra.infrastructure, obj);
                        });
                    wrappers.facilities.update($scope.facility_id,
                        $scope.fac_infra)
                        .success(function () {
                            if(!$scope.create){
                                $scope.prompt_msg = true;
                            }else{
                                $state.go("facilities.facility_create."+
                                    "facility_cover_letter", {facility_id :
                                    $scope.new_facility}, {reload : true});
                            }
                        })
                        .error(function (err) {
                            $scope.errors = err.error;
                        });
                };
            }
        }]
    )

    /**
     * @ngdoc controller
     * 
     * @name mfl.facility_mgmt.controllers.infrastructure
     * 
     * @description
     * Handles listing of facilities' human resources summary
     */
    .controller("mfl.facility_mgmt.controllers.facilities.infrastructure", [
        "$scope", "$controller", function($scope, $controller) {
            var helper = $controller("mfl.facility_mgmt.controllers.infrastructure_helper");
            helper.bootstrap($scope);
            if($scope.create) {
                $scope.nextState();
                $scope.$parent.print = false;
            }
            $scope.filters = {facility: $scope.facility_id};
        }]
    );

})(window.angular);