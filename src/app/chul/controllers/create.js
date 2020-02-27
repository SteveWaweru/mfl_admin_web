(function(angular, _){
    "use strict";

    angular.module("mfl.chul.controllers.create", [
        "mfl.common.forms",
        "mfl.common.services",
        "angular-toasty"
    ])

    .controller("mfl.chul.controllers.create_chul", ["$scope",
        "mfl.common.services.multistep", "$state", "$stateParams",
        "mfl.chul.services.wrappers",
        function ($scope, multistepService, $state, $stateParams, wrappers) {
            $scope.create = true;
            /*Declaring unit scope variable*/
            $scope.unit = {
                contacts : []
            };
            $scope.steps = [
                {
                    name : "basic",
                    prev : [],
                    count: "1"
                },
                {
                    name : "chews",
                    prev : ["basic"],
                    count: "2"
                },
                {
                    name : "services",
                    prev : ["chews"],
                    count: "3"
                }
            ];
            $scope.new_unit = $state.params.unit_id;
            $scope.furthest = $stateParams.furthest;
            if(_.isEmpty($state.params.unit_id)) {
                $scope.select_values = {};
            }else{
                $scope.unit_id = $state.params.unit_id;
                wrappers.chuls.get($state.params.unit_id)
                .success(function (data) {
                    $scope.unit = data;
                    $scope.select_values = {
                        facility: {
                            "id": $scope.unit.facility,
                            "name": $scope.unit.facility_name
                        }
                    };
                })
                .error(function (data) {
                    $scope.error = data;
                });
            }
            $scope.nextState = function () {
                var curr = $state.current.name;
                curr = curr.split(".", 3).pop();
                multistepService.nextState($scope, $stateParams ,
                    $scope.steps, curr);
            };

            $scope.autoSetKephLevel = function autoSet() {
                var facTyp = $scope.select_values.facility_type_details;
                var kephLevel2 = [
                    "8949eeb0-40b1-43d4-a38d-5d4933dc209f", // MEDICAL CLINIC
                    "5eb392ac-d10a-40c9-b525-53dac866ef6c", // Medical Clinic
                    "87626d3d-fd19-49d9-98da-daca4afe85bf", // Dispensary
                    "55d65dd6-5351-4cf4-a6d9-e05ce6d343ab", // DISPENSARY
                    "20b86171-0c16-47e1-9277-5e773d485c33", // Dermatology
                    "ccc1600e-9a24-499f-889f-bd9f0bdc4b95", // Rhab Drug and Substance Abuse
                    "d8d741b1-21c5-45c8-86d0-a2094bf9bda6", // Nutrition
                    "869118aa-0e97-4f47-b6b7-1f295d109c8f", // Dialysis
                    "a8af148f-b1b6-4eed-9d86-07d4f3135229", // Rhab Physiotherapy
                    "831a23c1-9124-4ce1-a0cf-60b59ef0fba5", // VCT
                    "336bf913-b42e-476a-bf47-11d3f769922f", // Farwll Hom
                    "35376bf5-2e83-4f70-8c4d-a7b80f782eb1", // Lab
                    "1571711c-4b80-493b-8109-faab2e4f43f0", // Radiology
                    "22c161ee-577f-41ef-bd4e-dd0a26327bbc", // Pharmacy
                    "85f2099b-a2f8-49f4-9798-0cb48c0875ff", // STAND ALON
                    "cd841f88-198a-4d8a-869c-3ab4a7091c11", // Rgional Blood Transfusion
                    "e5923a48-6b22-42c4-a4e6-6c5a5e8e0b0e", // Opthamology
                    "79158397-0d87-4d0e-8694-ad680a907a79", // Dntal Clinic
                    "031293d9-fd8a-4682-a91e-a4390d57b0cf" // Blood Bank
                ];
                var kephLevel3 = [
                    "188551b7-4f22-4fc4-b07b-f9c9aeeea872", // Medical Center
                    "df69577d-b90f-4b66-920a-d0f3ecd95191",  // MEDICAL CENTER
                    "479a9a16-219f-48f6-818d-b2c06ada2332", // Basic Hlth Cntr
                    "4d47a5dd-628a-4049-a240-3ab767415c49", // Comprhnsv Hlth Cntr
                    "9ad22615-48f2-47b3-8241-4355bb7db835" // HEALTH CENTRE
                ];
                var kephLevel4 = [
                    "0fa47f39-d58e-4a16-845c-82818719188d" // Primary car hospitals
                ];
                var kephLevel5 = [
                    "f222bab7-589c-4ba8-bd9a-fe6c96fcd085" // Secondary hospitals
                ];
                var kephLevel6 = [
                    "52ccbc58-2a71-4a66-be40-3cd72e67f798", // Specialized & Tertiary hospitals
                    "b9a51572-c931-4cc5-8e21-f17b22b0fd20" // Comprehensive & Tertiary Hospital"
                ];
                var kph6 = "ed23da85-4c92-45af-80fa-9b2123769f49";
                var kph5 = "7824068f-6533-4532-9775-f8ef200babd1";
                var kph4 = "c0bb24c2-1a96-47ce-b327-f855121f354f";
                var kph3 = "174f7d48-3b57-4997-a743-888d97c5ec31";
                var kph2 = "ceab4366-4538-4bcf-b7a7-a7e2ce3b50d5";

                if(kephLevel2.includes(facTyp)) {
                    $scope.select_values.keph_level = kph2;
                } else if(kephLevel3.includes(facTyp)) {
                    $scope.select_values.keph_level = kph3;
                } else if(kephLevel4.includes(facTyp)) {
                    $scope.select_values.keph_level = kph4;
                } else if(kephLevel5.includes(facTyp)) {
                    $scope.select_values.keph_level = kph5;
                } else if(kephLevel6.includes(facTyp)) {
                    $scope.select_values.keph_level = kph6;
                }
            };
            $scope.tabState = function (obj) {
                if(obj.active || obj.done || obj.furthest) {
                    $scope.nextState();
                    $state.go("community_units.create_unit."+ obj.name,
                    {furthest: $scope.furthest, unit_id : $scope.new_unit});
                }
            };
        }]
    );

})(window.angular, window._);
