(function(angular, _){
    "use strict";
    /**
     * @ngdoc module
     *
     * @name mfl.chul.controllers.edit
     *
     * @description
     * contains controllers used to manage CHUs
     */
    angular.module("mfl.chul.controllers.edit", [
        "mfl.common.forms",
        "angular-toasty",
        "mfl.common.filters"
    ])
    /**
     * @ngdoc controller
     *
     * @name mfl.chul.controllers.edit_chul
     *
     * @description
     * Parent controller used throughout the editing steps of a CHU
     */
    .controller("mfl.chul.controllers.edit_chul", ["$scope",
        "mfl.chul.services.wrappers", "$stateParams", "$filter",
        function ($scope, wrappers, $stateParams, $filter) {
            $scope.create = false;
            /*Declaring unit scope variable*/
            $scope.unit = {};
            $scope.unit_id = $stateParams.unit_id;
            wrappers.chuls.get($stateParams.unit_id)
            .success(function (data) {
                $scope.unit = data;
                $scope.unit.facility_county = $filter("titlecase")
                    ($scope.unit.facility_county);
                $scope.unit.facility_subcounty = $filter("titlecase")
                    ($scope.unit.facility_subcounty);
                $scope.unit.facility_ward = $filter("titlecase")
                    ($scope.unit.facility_ward);
                $scope.select_values = {
                    facility: {
                        "id": $scope.unit.facility,
                        "name": $scope.unit.facility_name
                    }
                };
                $scope.spinner = false;
            })
            .error(function (data) {
                $scope.spinner = false;
                $scope.error = data;
            });
            $scope.setNxt = function (arg) {
                $scope.nxtState = arg;
            };
        }]
    )
    /**
     * @ngdoc controller
     *
     * @name mfl.chul.controllers.edit_chul.basic
     *
     * @description
     * A helper Controller used to edit CHU basic details
     */
    .controller("mfl.chul.controllers.edit_chul.basic", ["$scope",
        "mfl.chul.services.wrappers", "mfl.common.forms.changes", "toasty",
        "$state", "$filter",
        function ($scope, wrappers, formChanges, toasty, $state, $filter) {
            if($scope.create) {
                $scope.nextState();
            }
            var value = new Date();
            $scope.maxDate = value.getFullYear() + "/" + (value.getMonth()+1) +
            "/" + value.getDate();
            wrappers.unit_status.filter({"fields":"id,name"})
            .success(function (data) {
                $scope.unit_status = data.results;
            })
            .error(function (data) {
                $scope.errors = data;
            });
            $scope.facility_no = {
                "page_size" : 20,
                "fields": "id,name,county,sub_county_name,constituency,ward_name"
            };
            if($scope.unit && !_.isUndefined($scope.unit.id)){
                $scope.facility_no.id = $scope.unit.id;
            }
            wrappers.facilities.filter($scope.facility_no)
            .success(function (data) {
                $scope.facilities = data.results;
            })
            .error(function (data) {
                $scope.errors = data;
            });

            $scope.refreshResults = function refreshFxn(select) {
                if(select.search.length>2) {
                    $scope.facselect = select;
                    $scope.facLoading = true;
                    var filt = {
                        "search": select.search,
                        "fields": "id,name,county,sub_county_name,constituency,ward_name"
                    };
                    wrappers.facilities.filter(filt)
                    .success(function (data) {
                        $scope.facLoading = false;
                        $scope.facilities = data.results;
                        $scope.facselect.activate();
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }
            };

            wrappers.contact_types.filter({"fields":"id,name"})
            .success(function (data) {
                $scope.contact_types = data.results;
            })
            .error(function (data) {
                $scope.errors = data;
            });
            $scope.unitContacts = function (u){
                if(u.contacts.length === 0) {
                    $scope.unit.contacts = [];
                }
            };
            $scope.addContact = function () {
                $scope.unit.contacts.push({contact_type: "", contact : ""});
            };
            $scope.removeContact = function (obj) {
                if(_.isUndefined(obj.id)){
                    $scope.unit.contacts = _.without($scope.unit.contacts,obj);
                }else{
                    wrappers.unit_contacts.remove(obj.id)
                    .success(function () {
                        wrappers.contacts.remove(obj.contact_id)
                        .success(function () {
                            $scope.unit.contacts = _.without(
                                $scope.unit.contacts,obj);
                            toasty.success({
                                title: "Unit Contact Deleted",
                                msg: "Contact successfully deleted"
                            });
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }
            };
            $scope.unitLocation = function (fac_id) {
                var fac = _.findWhere($scope.facilities, {"id" : fac_id});
                $scope.unit.facility_county = $filter("titlecase")(fac.county);
                $scope.unit.facility_subcounty = $filter("titlecase")
                    (fac.sub_county_name);
                $scope.unit.facility_constituency = $filter("titlecase")
                    (fac.constituency);
                $scope.unit.facility_ward = $filter("titlecase")
                    (fac.ward_name);
            };
            $scope.save = function (frm) {
                $scope.finish = ($scope.nxtState ? "community_units" :
                    "community_units.edit_unit.chews");
                var changes = formChanges.whatChanged(frm);
                $scope.unit.facility = $scope.select_values.facility;
                _.each($scope.unit.contacts, function (curr_obj) {
                    if(_.isEmpty(curr_obj.contact) ||
                        _.isEmpty(curr_obj.contact_type)) {
                        $scope.unit.contacts = _.without($scope.unit.contacts,
                            curr_obj);
                    }
                });
                if(!$scope.create) {
                    // if($scope.unit.contacts.length > 0){
                    //     changes.contacts = $scope.unit.contacts;
                    // }
                    changes.basic = {}
                    if(!_.isUndefined(changes.name) && !_.isNull(changes.name)){
                        console.log('changes.name == ', changes.name)
                        changes.basic.name = changes.name
                        // delete changes.name
                    }
                    if(!_.isUndefined(changes.households_monitored) && !_.isNull(changes.households_monitored)){
                        console.log('changes.households_monitored == ', changes.households_monitored)
                        changes.basic.households_monitored = changes.households_monitored
                        // delete changes.households_monitored
                    }
                    if(!_.isUndefined(changes.number_of_chvs) && !_.isNull(changes.number_of_chvs)){
                        console.log('changes.number_of_chvs == ', changes.number_of_chvs)
                        changes.basic.number_of_chvs = changes.number_of_chvs
                        // delete changes.number_of_chvs
                    }
                    if(!_.isUndefined(changes.date_operational) && !_.isNull(changes.date_operational)){
                        console.log('changes.date_operational == ', changes.date_operational)
                        changes.basic.date_operational = changes.date_operational
                        // delete changes.date_operational
                    }
                    if(!_.isUndefined(changes.date_established) && !_.isNull(changes.date_established)){
                        console.log('changes.date_established == ', changes.date_established)
                        changes.basic.date_established = changes.date_established
                        // delete changes.date_established
                    }
                    if(!_.isUndefined(changes.status) && !_.isNull(changes.status)){
                        console.log('changes.status == ', changes.status)
                        changes.basic.status = changes.status
                        // delete changes.status
                    }
                    if(!_.isUndefined(changes.location) && !_.isNull(changes.location)){
                        console.log('changes.location == ', changes.location)
                        changes.basic.location = changes.location
                        // delete changes.location
                    }
                    if(!_.isUndefined(changes.facility) && !_.isNull(changes.facility)){
                        changes.basic.facility = changes.facility
                        delete changes.facility
                    }
                    wrappers.chuls.update($scope.unit_id, changes)
                    .success(function () {
                        toasty.success({
                            title: "Community Unit Update",
                            msg: "Community Unit successfully updated"
                        });
                        $state.go($scope.finish, {reload : true});
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }else{
                    if(_.isEmpty($state.params.unit_id)){
                        wrappers.chuls.create($scope.unit)
                        .success(function (data) {
                            $state.go("community_units.create_unit.chews",
                                {unit_id : data.id, furthest : 2},{reload : true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    }else{
                        wrappers.chuls.update($state.params.unit_id, changes)
                        .success(function () {
                            $state.go("community_units.create_unit.chews",
                                {unit_id : $state.params.unit_id, furthest : 2},{reload : true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    }
                }
            };
            /*Wait for facility to be defined*/
            $scope.$watch("unit", function (u) {
                if (_.isUndefined(u)){
                    return;
                }
                if(u.hasOwnProperty("contacts")){
                    $scope.unitContacts(u);
                }
            });
        }]
    )
    /**
     * @ngdoc controller
     *
     * @name mfl.chul.controllers.edit_chul.basic
     *
     * @description
     * A helper Controller used to manage Community Health Workers of a CHU
     */
    .controller("mfl.chul.controllers.edit_chul.chews", ["$scope",
        "mfl.chul.services.wrappers", "toasty", "$state",
        function ($scope, wrappers, toasty, $state) {
            if($scope.create) {
                $scope.nextState();
            }
            $scope.unitWorkers = function (u){
                if(u.health_unit_workers.length === 0) {
                    $scope.unit.health_unit_workers.push({
                        "first_name" : "",
                        "last_name" : "",
                        "is_incharge" : false
                    });
                }
            };
            $scope.addChew = function () {
                $scope.unit.health_unit_workers.push({
                    "first_name" : "",
                    "last_name" : "",
                    "is_incharge" : false
                });
            };
            $scope.removeChew = function (obj) {
                if(_.isUndefined(obj.id)){
                    $scope.unit.health_unit_workers = _.without(
                        $scope.unit.health_unit_workers, obj);
                }else{
                    wrappers.workers.remove(obj.id)
                    .success(function (){
                        $scope.unit.health_unit_workers = _.without(
                            $scope.unit.health_unit_workers, obj);
                        toasty.success({
                            title: "Community Unit Worker Deleted",
                            msg: "Community Unit woker successfully deleted"
                        });
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }
            };
            /*Creating health workers*/
            $scope.saveChews = function () {
                $scope.workers = {health_unit_workers : []};
                $scope.workers.health_unit_workers =
                    $scope.unit.health_unit_workers;
                if($scope.workers.health_unit_workers.length > 0){
                    if($scope.create){
                        wrappers.chuls.update($scope.unit_id, $scope.workers)
                        .success(function () {
                            $state.go("community_units.create_unit.services",
                                {unit_id : $state.params.unit_id, furthest : 3},
                                {reload : true}
                            );
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    } else {
                        wrappers.chuls.update($scope.unit_id, $scope.workers)
                        .success(function () {
                            // $state.go("community_units.edit_unit.services",
                            //     {unit_id : $state.params.unit_id, furthest : 3},
                            //     {reload : true}
                            // );
                            toasty.success({
                                title: "Community Unit CHEWs Update",
                                msg: "Community Unit workers successfully updated"
                            });
                            $state.go($scope.finish, {reload : true});
                        })
                        .error(function (data) {
                            $scope.errors = data;
                        });
                    }
                }
            };
            /*Wait for unit to be defined*/
            $scope.$watch("unit", function (u) {
                if (_.isUndefined(u)){
                    return;
                }
                if(u.hasOwnProperty("health_unit_workers")){
                    $scope.unitWorkers(u);
                }
            });
        }]
    )
    .controller("mfl.chul.controllers.edit_chul.services", [
        "$scope", "mfl.chul.services.wrappers","$stateParams",
        "toasty", "$state",
        function($scope, wrapper, $stateParams, toasty, $state){
            wrapper.services.filter({page_size:1000, fields:"id,name"})
            .success(function(data){
                $scope.services = data.results;
            })
            .error(function(data){
                $scope.errors = data;
            });

            wrapper.chuls.get($stateParams.unit_id)
            .success(function(data){
                $scope.unit = data;
            })
            .error(function(data){
                $scope.errors = data;
            });
            $scope.select_values = {
                chu_services: {}
            };

            $scope.$watch("unit", function (u) {
                $scope.update_chu_services = [];
                if (_.isUndefined(u)){

                    return;
                }else{
                    $scope.update_chu_services = $scope.unit.services;
                }
            });
            $scope.filterChuServices = function(a){
                var service_ids = _.pluck($scope.update_chu_services, "service");
                return !_.contains(service_ids, a.id);
            };

            $scope.track_service_updates = function(){

                $scope.update_chu_services.push(
                    {
                        "service": $scope.select_values.chu_services.id,
                        "name": $scope.select_values.chu_services.name,
                        "health_unit": $scope.unit.id
                    }
                );
            };
            $scope.update_services = function(){
                console.log($scope.update_chu_services);
                $scope.unit.services =  _.map(
                    $scope.update_chu_services, function(obj){
                        return _.pick(obj, "service", "health_unit");
                    }
                );
                var changes = {
                    services: $scope.unit.services
                };
                wrapper.chuls.update($stateParams.unit_id, changes)
                .success(function(){
                    toasty.success({
                        title: "Community Unit",
                        msg: "Community Unit Updated successfully "
                    });
                    $state.go("community_units", {reload: true});
                })
                .error(function(data){
                    $scope.errors = data;
                });
            };

            $scope.remove_service = function(service_obj){
                $scope.update_chu_services = _.without(
                    $scope.update_chu_services, _.findWhere(
                    $scope.update_chu_services, service_obj)
                );
            };
        }
    ]);

})(window.angular, window._);
