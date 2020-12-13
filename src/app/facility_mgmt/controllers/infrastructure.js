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
                // fetching services
                wrappers.services.filter({page_sizE: 100, ordering: "name"})
                .success(function(data) {
                    $scope.services = data.results;
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.service_error = errorMEssages.errors +
                        errorMessages.fetching_services;
                });

                wrappers.categories.filter({"fields": "id,name"})
                .success(function (data) {
                    $scope.categories = data.results;
                })
                .error(function (err) {
                    $scope.alert = err.error;
                });

                wrappers.options.list()
                .success(function (data) {
                    $scope.options = data.results;
                })
                .error(function (err) {
                    $scope.alert = err.error;
                });
            };

            var addServiceOption = function ($scope, so) {
                var payload = {
                    facility: $scope.facility_id,
                    selected_option: so
                };
                return wrappers.facility_services.create(payload)
                .success(function(data) {
                    $scope.facility.facility_services.push(data);
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.service_error = errorMessages.errors +
                    errorMessages.services;
                });
            };

            var removeServiceOption = function ($scope, fs) {
                return wrappers.facility_services.remove(fs.id)
                .success(function () {
                    $scope.facility.facility_services = _.without(
                        $scope.facility.facility_services, fs
                    );
                })
                .error(function(data){
                    $log.error(data);
                    $scope.service_error =  errorMessages.errors +
                        errorMessages.delete_services;
                });
            };

            this.bootstrap = function($scope) {
                loadData($scope);
                $scope.new_service = {
                    service: "",
                    count: "",
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
                $scope.optionNumber = function (services) {
                    _.each(services, function(serv_obj) {
                        serv_obj.serv_options = [];
                        serv_obj.serv_options = _.where(
                            $scope.options, {"group" : serv_obj.group});
                        serv_obj.option_no = serv_obj.serv_options.length;
                        if($scope.facility.facility_services.length > 0) {
                            _.each($scope.facility.facility_services,
                                function (fac_service) {
                                    if(fac_service.service_id === serv_obj.id)
                                    {
                                        serv_obj.fac_serv = fac_service.id;
                                        serv_obj.option = fac_service.option;
                                        serv_obj.option = serv_obj.option ?
                                        serv_obj.option :
                                        serv_obj.serv_options[1].id;
                                    }
                                });
                        }
                    });
                };
                $scope.showServices = function(cat) {
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
                    $scope.cat_services = _.where($scope.services,
                        { "category": cat.id});
                    $scope.optionNumber($scope.cat_services);
                }
                $scope.services = [];
                $scope.service_options = [];

                $scope.addServiceOption = function (a) {
                    addServiceOption($scope, a).then(function () {
                        $scope.new_service.service = "";
                        $scope.new_service.option = "";
                    });
                };
                $scope.removeChild = function (a) {
                    removeServiceOption($scope, a);
                };
                $scope.fac_serv = {
                    services : []
                };
                $scope.service_display = [];
                $scope.removeOption = function (serv_obj) {
                    if(_.isUndefined(serv_obj.fac_serv)){
                        serv_obj.option = "";
                        $scope.service_display = _.without($scope.service_display, serv_obj);
                    }else{
                        wrappers.facility_services.remove(serv_obj.fac_serv)
                        .success(function () {
                            toasty.success({
                                title: "Facility Services",
                                msg: "Service successfully deleted"
                            });
                            serv_obj.option = "";
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    }
                };
                $scope.servicesDisplay = function (obj) {
                    if(_.where($scope.service_display, obj).length > 0) {
                        if(_.isEmpty(obj.option) || _.isUndefined(obj.option)){
                            $scope.service_display = _.without($scope.service_display, obj);
                        }
                    }else{
                        if(!_.isEmpty(obj.option) || obj.option === true){
                            $scope.service_display.push(obj);
                        }
                    }
                };
                $scope.facilityServices = function () {
                    _.each($scope.services, function (service_obj) {
                        if(!_.isUndefined(service_obj.option) &&
                            !_.isEmpty(service_obj.option)) {
                            $scope.fac_serv.services.push({
                                service : service_obj.id,
                                option : service_obj.option
                            });
                        }
                        if(!_.isUndefined(service_obj.option) &&
                            service_obj.option === true){
                            $scope.fac_serv.services.push({
                                service : service_obj.id
                            });
                        }
                    });
                    _.each($scope.facility.facility_services,
                        function (facility_service) {
                            var obj = _.findWhere($scope.fac_serv.services,
                                {"service" : facility_service.service_id});
                            $scope.fac_serv.services =
                                _.without($scope.fac_serv.services, obj);
                        });
                    wrappers.facilities.update($scope.facility_id,
                        $scope.fac_serv)
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