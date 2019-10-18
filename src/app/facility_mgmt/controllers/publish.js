(function(angular) {
    "use strict";

    angular.module("mfl.facility_mgmt.controllers.publish", [
        "mfl.facility_mgmt.services",
        "mfl.auth.services",
        "angular-toasty"
    ])

    .controller("mfl.facility_mgmt.controllers.facilities_publish",
        ["$scope", function ($scope) {
            $scope.filters = {
                "is_published": false,
                "approved": true,
                "rejected": false,
                "fields": "id,code,official_name,facility_type_name,owner_name,county,"+
                          "sub_county,constituency,ward_name,updated,name"
            };
            $scope.title = {
                "name": "Publish Facilities",
                "icon": "fa-building"
            };
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_publish",
        ["$scope", "$log", "$state", "$stateParams",
        "mfl.facility_mgmt.services.wrappers", "toasty",
        function ($scope, $log, $state, $stateParams, wrappers, toasty) {
            $scope.facility_id = $stateParams.facility_id;

            $scope.title = {
                "name": "Publish Facility"
            };

            wrappers.facilities.get($scope.facility_id)
            .success(function(data) {
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
                $log.error(data);
                $scope.errors = data;
            });

            $scope.publish = function (publish) {
                var pub = publish ? true : false;
                wrappers.facilities.update($scope.facility_id, {"is_published": pub})
                .success(function () {
                    toasty.success({
                        title: "Publish Facility",
                        msg : "Facility published successfully"
                    });
                    $state.go("facilities_publish");
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.errors = data;
                });
            };
        }]
    );

})(window.angular);
