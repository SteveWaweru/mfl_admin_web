(function (angular) {
    "use strict";

    /**
     * @ngdoc module
     * 
     * @name mfl.facility_mgmt.controllers.infrastructure
     * 
     * @description
     * Module containing controllers for facility infrastructure
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
         * The helper controller to manage infrastructure in add/edit a facility
         */

        .controller("mfl.facility_mgmt.controllers.infrastructure_helper",
            ["$log", "mfl.facility_mgmt.services.wrappers", "mfl.error.messages",
                "$state", "toasty", "$stateParams",
                function ($log, wrappers, errorMessages, $state, toasty, $stateParams) {
                    var loadData = function ($scope) {
                        // fetching infrastructure
                        wrappers.infrastructure.filter({ page_size: 2000, ordering: "name" })
                            .success(function (data) {
                                $scope.infrastructure = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMEssages.errors +
                                    errorMessages.fetching_services;
                                $scope.alert = err.error;
                            });

                        wrappers.facility_infrastructure.filter({ facility: $scope.facility_id, page_size: 2000, ordering: "name" })
                            .success(function (data) {
                                $scope.facility_infrastructure = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMEssages.errors +
                                    errorMessages.fetching_services;
                            });

                        if ($scope.facility_id) {
                            wrappers.facilities.get($scope.facility_id)
                                .success(function (data) {
                                    $scope.facility = data;
                                })
                                .error(function (data) {
                                    $scope.errors = data;
                                });
                        }

                        wrappers.infrastructure_categories.filter({ "fields": "id,name" })
                            .success(function (data) {
                                $scope.categories = data.results;
                            })
                            .error(function (err) {
                                $scope.alert = err.error || {
                                    "msg": "Error while updating facility infrastructure categories"
                                };
                            });
                        // TODO: Remove options from this implementation
                        wrappers.options.list()
                            .success(function (data) {
                                $scope.options = data.results;
                            })
                            .error(function (err) {
                                $scope.alert = err.error || {
                                    "msg": "Error while updating facility options"
                                };
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
                            .success(function (data) {
                                $scope.facility.facility_infrastructure.push(data);
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMessages.errors +
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
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMessages.errors +
                                    errorMessages.delete_services;
                                $scope.alert = data.error;
                            });
                    };

                    this.bootstrap = function ($scope) {
                        loadData($scope);
                        $scope.new_infrastructure = {
                            infrastructure: "",
                            present: false,
                            count: 0,
                        };
                        $scope.changeView = function (name) {
                            if ($scope.create) {
                                $state.go("facilities.facility_create.infrastructure." + name,
                                    {
                                        furthest: $scope.furthest,
                                        facility_id: $scope.new_facility
                                    });
                            } else {
                                $state.go("facilities.facility_edit.infrastructure." + name);
                            }
                        }
                        $scope.infrastructureNumber = function (infrastructure) {
                            _.each(infrastructure, function (infra_obj) {
                                if ($scope.facility_infrastructure.length > 0) {
                                    _.each($scope.facility_infrastructure,
                                        function (fac_infra) {
                                            if (fac_infra.id === infra_obj.id) {
                                                infra_obj.fac_infra = fac_infra.id;
                                            }
                                        });
                                }
                            });
                        };
                        $scope.showInfrastructure = function (cat) {
                            if (cat.selected === false) {
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
                                { "category": cat.id });
                            var facility_infra_ids = _.pluck($scope.facility_infrastructure, "infrastructure");
                            _.each($scope.cat_infrastructure, function (one_ifr) {
                                var cont = _.where($scope.facility_infrastructure, { "infrastructure": one_ifr.id })[0];
                                if(!one_ifr.numbers && one_ifr.present){cont.count = 1}
                                if (cont) {
                                    one_ifr.count = cont.count || 0;
                                } else {
                                    one_ifr.count = 0;
                                }
                                if (_.contains(facility_infra_ids, one_ifr.id)) {
                                    one_ifr.present = true;
                                } else {
                                    one_ifr.present = false;
                                }
                            });
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
                            infrastructure: []
                        };
                        $scope.infra_display = [];
                        $scope.removeInfrastructure = function (infra_obj) {
                            // if (_.isUndefined(infra_obj.fac_infra)) {
                            if (_.isUndefined(infra_obj)) {
                                infra_obj.infra = "";
                                $scope.infra_display = _.without(
                                    $scope.infra_display, infra_obj);
                            } else {
                                // wrappers.facility_infrastructure.remove(infra_obj.fac_infra)
                                var to_upd = _.find($scope.infrastructure, function(oj){
                                    return oj.id === infra_obj.id;
                                })
                                if(
                                    (to_upd) &&
                                    ( (to_upd.present = false) ||
                                    (to_upd.count = 0) )
                                ){

                                    toasty.success({
                                        title: "Facility infrastructure",
                                        msg: "Infrastructure successfully removed"
                                    });
                                }
                                // wrappers.facility_infrastructure.remove(infra_obj)
                                //     .success(function () {
                                //         toasty.success({
                                //             title: "Facility infrastructure",
                                //             msg: "Infrastructure successfully removed"
                                //         });
                                //     })
                                //     .error(function (data) {
                                //         $scope.errors = data;
                                //     });
                            }
                        };
                        
                        $scope.infrastructureDisplay = function (obj) {
                            if (_.where($scope.facility_infrastructure, obj).length > 0) {
                                if (_.isEmpty(obj.option) || _.isUndefined(obj.option)) {
                                    $scope.infra_display = _.without($scope.facility_infrastructure, obj);
                                }
                            } else {
                                if(obj.present===true && obj.numbers===false){obj.count = 1}else if(obj.present === false && obj.numbers === false){obj.count = 0}
                                if (!_.isEmpty(obj.option) || obj.option === true) {
                                    $scope.infra_display.push(obj);
                                }
                            }
                        };

                        $scope.sumCat = function (cat) {
                            var filtered = _.filter($scope.infrastructure, function(oj){
                                return oj.category == cat.id
                            })
                            let sum = 0
                            _.each(filtered, function(ft){
                                sum += parseInt(ft.count || 0)
                            })
                            return sum
                        }
                        $scope.facilityInfrastructure = function () {
                            _.each($scope.infrastructure, function (infra_obj) {
                                var count = infra_obj?.count || 0
                                if (!_.isUndefined(infra_obj.present) &&
                                    !_.isEmpty(infra_obj.present)) {
                                    $scope.fac_infra.infrastructure.push({
                                        infrastructure: infra_obj.id,
                                        present: infra_obj.present,
                                        count: count
                                    });
                                }
                                if (!_.isUndefined(infra_obj.present) &&
                                    infra_obj.present === true) {
                                    $scope.fac_infra.infrastructure.push({
                                        infrastructure: infra_obj.id,
                                        count: count
                                    });
                                }
                            });
                            _.each($scope.facility.facility_infrastructure,
                                function (facility_infrastructure) {
                                    var obj = _.findWhere($scope.fac_infra.infrastructure,
                                        { "infrastructure": facility_infrastructure.infra_id });
                                    $scope.fac_infra.infrastructure =
                                        _.without($scope.fac_infra.infrastructure, obj);
                                });
                            let update_payload = { "infrastructure": [] }
                            _.each(_.filter($scope.infrastructure, function (obj) {
                                return (obj.present === true && obj['$$hashKey']);
                            }), function (upd) {
                                var c_ount = upd.count || 0
                                update_payload.infrastructure.push({ "infrastructure": upd.id, "count": c_ount });
                            })
                            wrappers.facilities.update($scope.facility_id,
                                $scope.fac_infra)
                                .success(function () {
                                    if (!$scope.create) {
                                        $scope.prompt_msg = true;
                                    } else {
                                        $state.go("facilities.facility_create." +
                                            "humanresources", {
                                            facility_id:
                                                $scope.new_facility,
                                            furthest: '7'
                                        }, { reload: true });
                                    }
                                })
                                .error(function (err) {
                                    $scope.errors = err || {
                                        "msg": "Error while updating facility infrastructure"
                                    };
                                });
                        };
                        $scope.upgradePrompt = function () {
                            var update_msg = {
                                title: "Facility Updated",
                                msg: "Facility successfully updated"
                            };
                            toasty.success(update_msg);
                            if ($scope.facility.approved) {
                                $state.go("facilities.facility_view_changes",
                                    { facility_id: $stateParams.facility_id });
                            }
                            else {
                                $state.go("facilities");
                            }

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
         * Handles listing of facilities' infrastructure summary
         */
        .controller("mfl.facility_mgmt.controllers.facilities.infrastructure", [
            "$scope", "$controller", function ($scope, $controller) {
                var helper = $controller("mfl.facility_mgmt.controllers.infrastructure_helper");
                helper.bootstrap($scope);
                if ($scope.create) {
                    $scope.nextState();
                    $scope.$parent.print = false;
                }
                $scope.filters = { facility: $scope.facility_id };
            }]
        );

})(window.angular);