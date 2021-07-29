(function (angular) {
    "use strict";

    /**
     * @ngdoc module
     * 
     * @name mfl.facility_mgmt.controllers.hr
     * 
     * @description
     * Module containing controllers for facility human resources
     */

    angular.module("mfl.facility_mgmt.controllers.hr", [
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
         * @name mfl.facility_mgmt.controllers.hr_helper
         * 
         * @description
         * The helper controller to manage hr in add/edit a facility
         */

        .controller("mfl.facility_mgmt.controllers.hr_helper",
            ["$log", "mfl.facility_mgmt.services.wrappers", "mfl.error.messages",
                "$state", "toasty", "$stateParams",
                function ($log, wrappers, errorMessages, $state, toasty, $stateParams) {
                    var loadData = function ($scope) {
                        // fetching hr
                        wrappers.hr.filter({ page_sizE: 100, ordering: "name" })
                            .success(function (data) {
                                $scope.hr = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMEssages.errors +
                                    errorMessages.fetching_services;
                            });
                        wrappers.facility_hr.filter({facility: $scope.facility_id, page_sizE: 100, ordering: "name" })
                            .success(function (data) {
                                $scope.facility_hr = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMEssages.errors +
                                    errorMessages.fetching_services;
                            });

                        wrappers.hr_categories.filter({ "fields": "id,name" })
                            .success(function (data) {
                                $scope.hr_categories = data.results;
                            })
                            .error(function (err) {
                                $scope.alert = err.error;
                            });
                    };

                    ////----s0
                    var addHR = function ($scope, hr, present) {
                        var payload = {
                            facility: $scope.facility_id,
                            hr: hr,
                            present: present
                        };
                        return wrappers.facility_hr.create(payload)
                            .success(function (data) {
                                $scope.facility.facility_hr.push(data);
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMessages.errors +
                                    errorMessages.services;
                                $scope.alert = data.error;
                            });
                    };

                    var removeHR = function ($scope, fi) {
                        return wrappers.facility_hr.remove(fi.id)
                            .success(function () {
                                $scope.facility.facility_hr = _.without(
                                    $scope.facility.facility_hr, fi
                                );
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMessages.errors +
                                    errorMessages.delete_services;
                                $scope.alert = data.error;
                            });
                    };
                    ////----e0

                    this.bootstrap = function ($scope) {
                        loadData($scope);
                        $scope.new_hr = {
                            hr: "",
                            count: "",
                        };
                        $scope.changeView = function (name) {
                            if ($scope.create) {
                                $state.go("facilities.facility_create.hr." + name,
                                    {
                                        furthest: $scope.furthest,
                                        facility_id: $scope.new_facility
                                    });
                            } else {
                                $state.go("facilities.facility_edit.hr." + name);
                            }
                        }
                        $scope.hrNumber = function (hr) {
                            _.each(hr, function (hr_obj) {
                                if ($scope.facility_hr.length > 0) {
                                    _.each($scope.facility_hr,
                                        function (fac_hr) {
                                            if (fac_hr.id === hr_obj.id) {
                                                hr_obj.fac_hr = fac_hr.id;
                                            }
                                        });
                                }
                            });
                        };
                        $scope.showHR = function (cat) {
                            if (cat.selected === false) {
                                cat.selected = true;
                            } else {
                                cat.selected = true;
                            }
                            _.each($scope.hr_categories, function (one_cat) {
                                if (one_cat.selected === true && one_cat.id !== cat.id) {
                                    one_cat.selected = !one_cat.selected;
                                }
                            });
                            $scope.cat_hr = _.where($scope.hr,
                                { "category": cat.id }
                            );
                            var facility_hr_ids = _.pluck($scope.facility_hr, "speciality");
                            _.each($scope.cat_hr, function (one_hr) {
                                if(_.contains(facility_hr_ids, one_hr.id)) {
                                    one_hr.present = true;
                                } else {
                                    one_hr.present = false;
                                }
                            });
                            $scope.hrNumber($scope.cat_hr);
                        }
                        $scope.hr = [];
                        $scope.fac_hr = {
                            specialities : []
                        };
                        $scope.hr_display =  []; //$scope.facility_hr
                        $scope.removeOption = function (hr_obj) {
                            if(_.isUndefined(hr_obj.id)){
                                hr_obj.option = "";
                                $scope.hr_display = _.without($scope.hr_display, hr_obj);
                            }else{
                                wrappers.facility_hr.remove(hr_obj.fac_hr)
                                .success(function () {
                                    toasty.success({
                                        title: "Facility Specialities",
                                        msg: "Speciality successfully deleted"
                                    });
                                    hr_obj.option = "";
                                })
                                .error(function (data) {
                                    $scope.errors = data;
                                });
                            }
                        };
                        ////-----s
                        $scope.addHR = function (a, present) {
                            addHR($scope, a, present).then(function () {
                                $scope.new_hr.hr = "";
                                $scope.new_hr.present = "";
                            });
                        };
                        $scope.removeChild = function (a) {
                            removeHR($scope, a);
                        };
                        $scope.fac_hr = {
                            hr: []
                        };
                        $scope.hr_display = [];
                        $scope.removeHR = function (hr_obj) {
                            // if (_.isUndefined(hr_obj.fac_hr)) {
                            if (_.isUndefined(hr_obj)) {
                                hr_obj.hr = "";
                                $scope.hr_display = _.without(
                                    $scope.hr_display, hr_obj);
                            } else {
                                // wrappers.facility_hr.remove(hr_obj.fac_hr)
                                wrappers.facility_hr.remove(hr_obj)
                                    .success(function () {
                                        toasty.success({
                                            title: "Facility hr",
                                            msg: "HR successfully removed"
                                        });
                                    })
                                    .error(function (data) {
                                        $scope.errors = data;
                                    });
                            }
                        };
                        ////-----e
                        $scope.hrDisplay = function (obj) {
                            if(_.where($scope.facility_hr, obj).length > 0) {
                                if(_.isEmpty(obj.option) || _.isUndefined(obj.option)){
                                    $scope.hr_display = _.without($scope.facility_hr, obj);
                                }
                            }else{
                                if(!_.isEmpty(obj.option) || obj.option === true){
                                    $scope.hr_display.push(obj);
                                }
                            }
                        };
                        $scope.facilityHR = function () {
                            _.each($scope.hr, function (hr_obj) {
                                if (!_.isUndefined(hr_obj.option) &&
                                    !_.isEmpty(hr_obj.option)) {
                                    $scope.fac_hr.specialities.push({
                                        speciality : hr_obj.id,
                                        option : hr_obj.option
                                    });
                                }
                                if (!_.isUndefined(hr_obj.option) &&
                                    hr_obj.option === true) {
                                    $scope.fac_hr.specialities.push({
                                        speciality : hr_obj.id
                                    });
                                }
                            });
                            _.each($scope.facility.hr,
                                function (facility_hr1) {
                                    var obj = _.findWhere($scope.fac_hr.specialities,
                                        { "speciality": facility_hr1.id });
                                    $scope.fac_hr.specialities =
                                        _.without($scope.fac_hr.specialities, obj);
                            });
                            let update_payload = {"specialities":[]}
                            _.each(_.filter($scope.hr, function (obj) {
                                return obj.present === true;
                            }), function (upd) {
                                update_payload.specialities.push({"speciality":upd.id});
                            })
                            wrappers.facilities.update($scope.facility_id,
                                update_payload
                                )
                                .success(function () {
                                    if (!$scope.create) {
                                        $scope.prompt_msg = true;
                                    } else {
                                        $state.go("facilities.facility_create." +
                                            "facility_cover_letter", {
                                                facility_id:
                                                    $scope.new_facility
                                        }, { reload: true });
                                    }
                                })
                                .error(function (err) {
                                    $scope.errors = err.error;
                                });
                        };
                        $scope.upgradePrompt = function () {
                            var update_msg = {
                                title : "Facility Updated",
                                msg : "Facility successfully updated"
                            };
                            toasty.success(update_msg);
                            if($scope.facility.approved){
                                $state.go("facilities.facility_view_changes",
                                    {facility_id: $stateParams.facility_id});
                            }
                            else{
                                $state.go("facilities");
                            }
        
                        };
                    }
                }]
        )

        /**
         * @ngdoc controller
         * 
         * @name mfl.facility_mgmt.controllers.hr
         * 
         * @description
         * Handles listing of facilities' human resources summary
         */
        .controller("mfl.facility_mgmt.controllers.facilities.hr", [
            "$scope", "$controller", function ($scope, $controller) {
                var helper = $controller("mfl.facility_mgmt.controllers.hr_helper");
                helper.bootstrap($scope);
                if ($scope.create) {
                    $scope.nextState();
                    $scope.$parent.print = false;
                }
                $scope.filters = { facility: $scope.facility_id };
            }]
        );

})(window.angular);