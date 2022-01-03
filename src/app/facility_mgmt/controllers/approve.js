(function(angular, _){
    "use strict";

    angular.module("mfl.facility_mgmt.controllers.approve", [
        "mfl.facility_mgmt.services",
        "mfl.auth.services",
        "angular-toasty"
    ])

    .controller("mfl.facility_mgmt.controllers.facilities_closed",
        ["$scope", function ($scope) {
            $scope.filters = {
                "closed": true,
                "fields": "id,code,official_name,closing_reason,closed_date,name"
            };
            $scope.title = {
                "name": "Closed Facilities",
                "icon": "fa-building"
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facilities_rejected",
        ["$scope", function ($scope) {
            $scope.filters = {
                "rejected": true,
                "fields": "id,code,official_name,facility_type_name,owner_name,county,"+
                          "operation_status_name,admission_status_name,sub_county,constituency,ward_name,updated,"+
                          "sub_county_name,name,rejected,approved"
            };
            $scope.title = {
                "name": "Rejected Facilities",
                "icon": "fa-building"
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facilities_national_rejected",
        ["$scope", function ($scope) {
            $scope.filters = {
                "rejected_national": true,
                "fields": "id,code,official_name,facility_type_name,owner_name,county,rejected,"+
                          "operation_status_name,admission_status_name,sub_county,constituency,ward_name,updated,"+
                          "sub_county_name,name,approved_national_level,approved,is_complete"
            };
            $scope.title = {
                "name": "Rejected Facilities",
                "icon": "fa-building"
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_rejected",
        ["$scope","mfl.facility_mgmt.services.wrappers","$stateParams","$state",
         function ($scope,wrappers,$stateParams,$state) {
            if(($state.current.name).indexOf("reject_list.view") <0){
                $scope.reject = false;
            } else {
                $scope.reject = true;
            }
            $scope.spinner = true;
            $scope.fac_id = $stateParams.facility_id;
            wrappers.facilities.get($stateParams.facility_id)
                .success(function (data) {
                    $scope.spinner = false;
                    $scope.facility = data;
                    $scope.getFacilityStatus = function getStatus(){
                        if(!$scope.facility.is_complete) {
                            return "INCOMPLETE";
                        } else{
                            if($scope.facility.approved === null &&
                                 $scope.facility.rejected === false){
                                return "PENDING VALIDATION";
                            } else if($scope.facility.rejected === true){
                                return "FAILED VALIDATION";
                            } else {
                                if($scope.facility.approved_national_level === null) {
                                    return "PENDING APPROVAL";
                                } else if($scope.facility.approved_national_level === false){
                                    return "NOT APPROVED";
                                } else {
                                    return "";
                                }
                            }
                        }
                    };
                })
                .error(function (err) {
                    $scope.spinner = false;
                    $scope.errors = err;
                });
            wrappers.facility_units.filter(
                {facility:$stateParams.facility_id})
                .success(function(data){
                    $scope.fac_units = data.results;
                })
                .error(function (e) {
                    $scope.alert = e.error;
                    $scope.errors = e;
                });
            wrappers.facility_approvals.filter(
                {facility:$stateParams.facility_id,is_cancelled:$scope.reject})
                .success(function(data){
                    $scope.rejections = data.results;
                })
                .error(function (e) {
                    $scope.alert = e.error;
                    $scope.errors = e;
                });
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facilities_approve",
        ["$scope",
        function ($scope) {
            $scope.filters = {
                "has_edits" : true,
                "pending_approval" : true,
                "is_complete" : true,
                "fields": "id,code,official_name,facility_type_name,owner_name,county," +
                          "sub_county,ward_name,updated,operation_status_name,admission_status_name,"+
                          "sub_county_name,name,is_complete,in_complete_details,"+
                          "approved_national_level,has_edits,approved,rejected"
            };

            $scope.title = {
                "name": "Validate Updated Facilities",
                "icon": "fa-building"
            };
        }]
    )
    .controller("mfl.facility_mgmt.controllers.facilities_approve_new",
        ["$scope",
        function ($scope) {
            $scope.filters = {
                "pending_approval" : true,
                "has_edits" : false,
                "fields": "id,code,official_name,facility_type_name,owner_name,county," +
                          "sub_county,ward_name,updated,operation_status_name,admission_status_name,"+
                          "sub_county_name,name,is_complete,in_complete_details,"+
                          "approved_national_level,has_edits,approved,rejected"
            };

            $scope.title = {
                "name": "Validate New Facilities",
                "icon": "fa-building"
            };
        }]
    )
    .controller("mfl.facility_mgmt.controllers.facilities_pending_publishing",
        ["$scope", "$stateParams", "mfl.facility_mgmt.services.wrappers","$state",
        "toasty", "$log",
        function ($scope, $stateParams, wrappers, $state, toasty, $log) {
            $scope.filters = {
                to_publish: true,
                fields: "id,code,name,official_name,regulatory_status_name,updated," +
                    "facility_type_name,owner_name,county,sub_county_name,approved"+
                    "ward_name,keph_level,keph_level_name,constituency_name,rejected,"+
                    "is_complete,in_complete_details,is_approved,approved_national_level"
            };

            $scope.title = {
                "name": "Approve Facilities",
                "icon": "fa-building"
            };
            $scope.facility_id = $stateParams.facility_id;
            if($scope.facility_id){
                wrappers.facilities.get($scope.facility_id)
                .success(function (data) {
                    $scope.facility = data;
                    $scope.getFacilityStatus = function getStatus(){
                        if(!$scope.facility.is_complete) {
                            return "INCOMPLETE";
                        } else{
                            if($scope.facility.is_approved === null){
                                return "PENDING VALIDATION";
                            } else if($scope.facility.is_approved === false){
                                return "FAILED VALIDATION";
                            } else {
                                if($scope.facility.approved_national_level === null) {
                                    return "PENDING APPROVAL";
                                } else if($scope.facility.approved_national_level === false){
                                    return "NOT APPROVED";
                                } else {
                                    return "";
                                }
                            }
                        }
                    };
                })
                .error(function (data) {
                    $scope.errors = data;
                });
            }
            $scope.facility_approval = {
                facility: $scope.facility_id
            };

            $scope.publishFacility = function (cancel) {
                $scope.facility_approval.is_national_approval = !cancel;
                $scope.facility_approval.approved_national_level = !cancel;
                wrappers.facility_approvals.create($scope.facility_approval)
                // .success(function () {
                // wrappers.facilities.update($scope.facility_id, $scope.facility_approval)
                .success(function () {
                    var msg_title = !cancel ? "Approval" : "Rejection";
                    var msg_detail = !cancel ? "approved" : "rejected";
                    toasty.success({
                        title:"Facility " + msg_title,
                        msg:"Facility successfully " + msg_detail
                    });
                    $state.go("facilities_pending_publishing");
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.errors = data;
                });
            };

            $scope.publsh_to_dhis = function(){
                var payload = {
                    approved_national_level: true
                };
                wrappers.facilities.update($scope.facility_id, payload)
                .success(function(){
                    $state.go("facilities_pending_publishing.", {reload : true});
                })
                .error(function(data){
                    $scope.errors = data;
                });
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_approve",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.facility_mgmt.services.wrappers","toasty", "$window",
        function ($scope, $state, $stateParams, $log, wrappers, toasty, $window) {
            if(($state.current.name).indexOf(".reject") > 0){
                $scope.reject = false;
            } else {
                $scope.reject = true;
            }
            $scope.spinner = true;
            $scope.facility_id = $stateParams.facility_id;
            $scope.fac_id = $scope.facility_id;
            wrappers.facility_units.filter({"facility" : $scope.facility_id})
            .success(function (data) {
                $scope.chus = data.results;
            })
            .error(function (data) {
                $scope.errors = data;
            });

            wrappers.facility_approvals.filter({"facility": $scope.facility_id,
                                                "is_cancelled":$scope.reject})
            .success(function (data) {
                $scope.facility_approvals = data.results;
            })
            .error(function (data) {
                $log.error(data);
                $scope.errors = data;
            });

            wrappers.facility_services.filter({
                "facility": $scope.facility_id,
                "is_cancelled": false,
                "is_confirmed": false,
                "fields": "id,service_name,option_display_value"
            })
            .success(function (data) {
                $scope.facility_service_updates = data.results;
            })
            .error(function (data) {
                $log.error(data);
                $scope.errors = data;
            });
            wrappers.facilities.get($scope.facility_id)
            .success(function(data) {
                $scope.spinner = false;
                $scope.facility = data;
                $scope.getFacilityStatus = function getStatus(){
                    if(!$scope.facility.is_complete) {
                        return "INCOMPLETE";
                    } else{
                        if($scope.facility.is_approved === null){
                            return "PENDING VALIDATION";
                        } else if($scope.facility.is_approved === false){
                            return "FAILED VALIDATION";
                        } else {
                            if($scope.facility.approved_national_level === null) {
                                return "PENDING APPROVAL";
                            } else if($scope.facility.approved_national_level === false){
                                return "NOT APPROVED";
                            } else {
                                return "";
                            }
                        }
                    }
                };
                if ($scope.facility.coordinates) {
                    wrappers.facility_coordinates.get($scope.facility.coordinates)
                    .success(function (data) {
                        $scope.gis = data;
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }
                if ($scope.facility.latest_update) {
                    wrappers.facility_updates.get($scope.facility.latest_update)
                    .success(function (data) {
                        $scope.facility_update = data;
                        $scope.facility_update.facility_updates = JSON.parse(
                            $scope.facility_update.facility_updates
                        );
                        $scope.facility_changes = data.facility_updated_json;
                    })
                    .error(function (data) {
                        $log.error(data);
                        $scope.errors = data;
                    });
                }
            })
            .error(function (data) {
                $log.error(data);
                $scope.errors = data;
            });

            $scope.facility_approval = {
                "facility": $scope.facility_id,
                "comment": "",
                "is_cancelled": false
            };
            $scope.check_logged_user_is_national = function (){
                return $window.JSON.parse(
                    $window.localStorage.getItem("auth.user")
                ).is_national === true;
            };
            $scope.approveFacility = function (cancel) {
                $scope.facility_approval.is_cancelled = !!cancel;
                wrappers.facility_approvals.create($scope.facility_approval)
                .success(function () {
                    var msg_title = cancel ? "Rejection" : "Approval";
                    var msg_detail = cancel ? "rejected" : "approved";
                    toasty.success({
                        title:"Facility " + msg_title,
                        msg:"Facility successfully " + msg_detail
                    });
                    $state.go("facilities_approve");
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.errors = data;
                });
            };

            $scope.approveUpdate = function (approved) {
                if (! $scope.facility.latest_update) {
                    return;
                }
                var payload = (approved) ? {"approved": true} : {"cancelled": true};
                wrappers.facility_updates.update($scope.facility.latest_update, payload)
                .success(function () {
                    toasty.success({
                        title:"Facility updates",
                        msg:"Facility's updates have been processed"
                    });
                    $state.go("facilities_approve");
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.errors = data;
                });
            };

            $scope.approveFacilityService = function (fsu, approved) {
                var payload = {
                    "is_cancelled": approved ? false : true,
                    "is_confirmed": approved ? true : false
                };
                wrappers.facility_services.update(fsu.id, payload)
                .success(function () {
                    toasty.success({
                        title:"Facility services edit",
                        msg:"Facility services has been edited"
                    });
                    $scope.facility_service_updates = _.without(
                        $scope.facility_service_updates, fsu
                    );
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.errors = data;
                });
            };
            $scope.printFacility = wrappers.printFacility;
            $scope.correctionTemplate = wrappers.getCorrectionTemplate;
            $scope.detailReport = wrappers.getDetailReport;
            $scope.facilityChecklistTemplate = wrappers.facilityChecklistTemplate;
            $scope.facilityLicense = wrappers.facilityLicense;
        }]
    )
    .controller("mfl.facility_mgmt.controllers.incomplete_facilities",
        ["$scope",
        function ($scope) {
            $scope.filters = {
                "incomplete" : true,
                "fields": "id,code,official_name,facility_type_name,owner_name,county," +
                          "constituency_name,ward_name,created,operation_status_name,admission_status_name,"+
                          "sub_county_name,name,is_complete,in_complete_details,approved"
            };

            $scope.title = {
                "name": "Incomplete Facilities",
                "icon": "fa-building"
            };
        }]
    );

})(window.angular, window._);
