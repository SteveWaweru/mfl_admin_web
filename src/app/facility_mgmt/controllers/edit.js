(function (angular, _) {
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.facility_mgmt.controllers.edit
     *
     * @description
     * Contains all the controllers used to manage the users
     */
    angular.module("mfl.facility_mgmt.controllers.edit", [
        "mfl.facility_mgmt.services",
        "mfl.auth.services",
        "720kb.datepicker",
        "angular-toasty",
        "ui.bootstrap.tpls",
        "mfl.common.forms",
        "leaflet-directive",
        "nemLogging",
        "mfl.common.constants",
        "mfl.common.filters"
    ])


        /**
         * @ngdoc controller
         *
         * @name mfl.facility_mgmt.controllers.service_helper
         *
         * @description
         * The helper controller to manage services in add/edit a facility
         */
        .controller("mfl.facility_mgmt.controllers.services_helper",
            ["$log", "mfl.facility_mgmt.services.wrappers", "mfl.error.messages",
                "$state", "toasty", "$stateParams",
                function ($log, wrappers, errorMessages, $state, toasty, $stateParams) {
                    var loadData = function ($scope) {
                        wrappers.services.filter({ page_size: 100, ordering: "name" })
                            .success(function (data) {
                                $scope.services = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMessages.errors +
                                    errorMessages.fetching_services;
                            });

                        wrappers.categories.filter({ "fields": "id,name" })
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
                            .success(function (data) {
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
                            .error(function (data) {
                                $log.error(data);
                                $scope.service_error = errorMessages.errors +
                                    errorMessages.delete_services;
                            });
                    };

                    this.bootstrap = function ($scope) {
                        loadData($scope);
                        $scope.new_service = {
                            service: "",
                            option: ""
                        };
                        $scope.changeView = function (name) {
                            if ($scope.create) {
                                $state.go("facilities.facility_create.services." +
                                    name, {
                                        furthest: $scope.furthest,
                                    facility_id: $scope.new_facility
                                });
                            } else {
                                $state.go("facilities.facility_edit.services." + name);
                            }
                        };
                        $scope.optionNumber = function (services) {
                            _.each(services, function (serv_obj) {
                                serv_obj.serv_options = [];
                                serv_obj.serv_options = _.where(
                                    $scope.options, { "group": serv_obj.group });
                                serv_obj.option_no = serv_obj.serv_options.length;
                                if ($scope.facility.facility_services.length > 0) {
                                    _.each($scope.facility.facility_services,
                                        function (fac_service) {
                                            if (fac_service.service_id === serv_obj.id) {
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
                        $scope.showServices = function (cat) {
                            if (cat.selected === false) {
                                cat.selected = true;
                            }
                            else {
                                cat.selected = true;
                            }
                            _.each($scope.categories, function (one_cat) {
                                if (one_cat.selected === true &&
                                    one_cat.id !== cat.id) {
                                    one_cat.selected = !one_cat.selected;
                                }
                            });
                            $scope.cat_services = _.where(
                                $scope.services, { "category": cat.id });
                            $scope.optionNumber($scope.cat_services);
                        };
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
                            services: []
                        };
                        $scope.service_display = [];
                        $scope.removeOption = function (serv_obj) {
                            if (_.isUndefined(serv_obj.fac_serv)) {
                                serv_obj.option = "";
                                $scope.service_display = _.without($scope.service_display, serv_obj);
                            } else {
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
                            if (_.where($scope.service_display, obj).length > 0) {
                                if (_.isEmpty(obj.option) || _.isUndefined(obj.option)) {
                                    $scope.service_display = _.without($scope.service_display, obj);
                                }
                            } else {
                                if (!_.isEmpty(obj.option) || obj.option === true) {
                                    $scope.service_display.push(obj);
                                }
                            }
                        };
                        $scope.facilityServices = function () {
                            _.each($scope.services, function (service_obj) {
                                if (!_.isUndefined(service_obj.option) &&
                                    !_.isEmpty(service_obj.option)) {
                                    $scope.fac_serv.services.push({
                                        service: service_obj.id,
                                        option: service_obj.option
                                    });
                                }
                                if (!_.isUndefined(service_obj.option) &&
                                    service_obj.option === true) {
                                    $scope.fac_serv.services.push({
                                        service: service_obj.id
                                    });
                                }
                            });
                            _.each($scope.facility.facility_services,
                                function (facility_service) {
                                    var obj = _.findWhere($scope.fac_serv.services,
                                        { "service": facility_service.service_id });
                                    $scope.fac_serv.services =
                                        _.without($scope.fac_serv.services, obj);
                                });
                            wrappers.facilities.update($scope.facility_id,
                                $scope.fac_serv)
                                .success(function () {
                                    if (!$scope.create) {
                                        $scope.prompt_msg = true;
                                    } else {
                                        $state.go("facilities.facility_create." +
                                            "infrastructure", {
                                                facility_id:
                                                    $scope.new_facility,
                                                    furthest: '6'
                                        }, { reload: true });
                                    }
                                })
                                .error(function (err) {
                                    $scope.errors = err.error;
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
                        $scope.$watch("new_service.service", function (newVal) {
                            var s = _.findWhere($scope.services, { "id": newVal });
                            if (angular.isDefined(s) && _.isArray(s.service_options)) {
                                $scope.service_options = s.service_options;
                            } else {
                                $scope.service_options = [];
                            }
                        });
                    };
                }]
        )

        /**
         * @ngdoc controller
         *
         * @name mfl.facility_mgmt.controllers.facility_edit
         *
         * @description
         * Parent controller used throughout the editing steps of a facility
         */
        .controller("mfl.facility_mgmt.controllers.facility_edit",
            ["$scope", "$q", "$log", "$stateParams", "mfl.facility_mgmt.services.wrappers",
                "mfl.facility.multistep.service", "$state", "mfl.error.messages",
                function ($scope, $q, $log, $stateParams, wrappers,
                    facilityMultistepService, $state, errorMessages) {
                    $scope.facility_id = $stateParams.facility_id;
                    $scope.create = false;
                    $scope.spinner = true;
                    $scope.updown = false;
                    $scope.steps = facilityMultistepService.facilityObject();
                    $scope.tabState = function (obj) {
                        _.each($scope.steps, function (step) {
                            if (step.name === obj.name) {
                                step.active = true;
                            }
                            else {
                                step.active = false;
                            }
                        });
                        $state.go(
                            "facilities.facility_edit." + obj.name,
                            { facility_id: $scope.facility_id }, { reload: true });
                    };
                    wrappers.facilities.get($scope.facility_id)
                        .success(function (data) {
                            $scope.spinner = false;
                            $scope.facility = data;
                            if ($scope.facility.facility_checklist_document != null) {
                                wrappers.documents
                                    .get($scope.facility.facility_checklist_document.id)
                                    .success(function (file) {
                                        $scope.checklist_document = file;
                                    });
                            }
                            $scope.getFacilityStatus = function getStatus() {
                                if (!$scope.facility.is_complete) {
                                    return "INCOMPLETE";
                                } else {
                                    if ($scope.facility.is_approved === null) {
                                        return "PENDING VALIDATION";
                                    } else if ($scope.facility.is_approved === false) {
                                        return "FAILED VALIDATION";
                                    } else {
                                        if ($scope.facility.approved_national_level === null) {
                                            return "PENDING APPROVAL";
                                        } else if ($scope.facility.approved_national_level === false) {
                                            return "NOT APPROVED";
                                        } else {
                                            return "";
                                        }
                                    }
                                }
                            };
                            $scope.owner_typeid = $scope.facility.owner_type;
                            $scope.select_values = {
                                ward: {
                                    "id": $scope.facility.ward,
                                    "name": $scope.facility.ward_name
                                },
                                facility_type: {
                                    "id": $scope.facility.facility_type,
                                    "name": $scope.facility.facility_type_parent
                                },
                                facility_type_details: {
                                    "id": $scope.facility.facility_type,
                                    "name": $scope.facility.facility_type_name
                                },
                                owner: {
                                    "id": $scope.facility.owner,
                                    "name": $scope.facility.owner_name
                                },
                                owner_type: {
                                    "id": $scope.facility.owner_type,
                                    "name": $scope.facility.owner_type_name
                                },
                                operation_status: {
                                    "id": $scope.facility.operation_status,
                                    "name": $scope.facility.operation_status_name
                                },
                                admission_status: {
                                    "id": $scope.facility.admission_status,
                                    "name": $scope.facility.admission_status_name
                                },
                                regulatory_body: {
                                    "id": $scope.facility.regulatory_body,
                                    "name": $scope.facility.regulatory_body_name
                                },
                                keph_level: {
                                    "id": $scope.facility.keph_level,
                                    "name": $scope.facility.keph_level_name
                                },
                                town: {
                                    "id": $scope.facility.town,
                                    "name": $scope.facility.town_name
                                },
                                county: {
                                    "id": $scope.facility.county_id,
                                    "name": $scope.facility.county_name
                                },
                                sub_county: {
                                    "id": $scope.facility.sub_county_id,
                                    "name": $scope.facility.sub_county_name,
                                    "county": $scope.facility.county_id
                                },
                                constituency: {
                                    "id": $scope.facility.constituency_id,
                                    "name": $scope.facility.constituency,
                                    "county": $scope.facility.county_id
                                },
                                regulation_status: {
                                    "id": $scope.facility.regulation_status,
                                    "name": $scope.facility.regulatory_status_name
                                }
                            };

                            if ($scope.facility.hasOwnProperty
                                ("officer_in_charge") && !_.isNull($scope.facility.officer_in_charge)) {
                                $scope.off_contacts =
                                    $scope.facility.officer_in_charge.contacts;
                            }

                        })
                        .error(function (data) {
                            $log.error(data);
                            $scope.spinner = false;
                            $scope.error = errorMessages.errors +
                                errorMessages.facility_details;
                        });



                    $scope.selectReload = function (wrapper, search_term, scope_var, extra_filters) {
                        if (!_.isString(search_term)) {
                            return $q.reject();
                        }
                        var filters = _.isEmpty(search_term) ? {} : { "search_auto": search_term };
                        return wrapper.filter(_.extend(filters, extra_filters))
                            .success(function (data) {

                                $scope[scope_var] = data.results;
                            })
                            .error(function (data) {
                                $log.error(data);
                            });
                    };
                    $scope.remove = function () {
                        wrappers.facilities.update($scope.facility_id, { "is_active": false })
                            .success(function () {
                                $state.go("facilities");
                            })
                            .error(function (error) {
                                $log.error(error);
                                $scope.error = errorMessages.errors +
                                    errorMessages.facility_details;
                            });
                    };
                    $scope.cancel = function () {
                        $state.go("facilities.facility_edit", { facility_id: $scope.facility_id });
                    };
                    $scope.printFacility = wrappers.printFacility;
                    $scope.nxtState = true;

                    $scope.setNxt = function (arg) {
                        $scope.nxtState = arg;
                    };
                }]
        )

        /**
         * @ngdoc controller
         *
         * @name mfl.facility_mgmt.controllers.facility_edit.close
         *
         * @description
         * Controller used to close a facility
         */
        .controller("mfl.facility_mgmt.controllers.facility_edit.close",
            ["$scope", "mfl.facility_mgmt.services.wrappers", "$stateParams",
                "mfl.common.forms.changes", "$state", "toasty",
                function ($scope, wrappers, $stateParams, formChanges, $state, toasty) {
                    var value = new Date();
                    $scope.maxDate = value.getFullYear() + "/" + (value.getMonth() + 1) +
                        "/" + value.getDate();
                    $scope.close = function (frm) {
                        var changes = formChanges.whatChanged(frm);
                        changes.closed = true;
                        wrappers.facilities.update($stateParams.facility_id, changes)
                            .success(function (data) {
                                $scope.facility = data;
                                $scope.getFacilityStatus = function getStatus() {
                                    if (!$scope.facility.is_complete) {
                                        return "INCOMPLETE";
                                    } else {
                                        if ($scope.facility.is_approved === null) {
                                            return "PENDING VALIDATION";
                                        } else if ($scope.facility.is_approved === false) {
                                            return "FAILED VALIDATION";
                                        } else {
                                            if ($scope.facility.approved_national_level === null) {
                                                return "PENDING APPROVAL";
                                            } else if ($scope.facility.approved_national_level === false) {
                                                return "NOT APPROVED";
                                            } else {
                                                return "";
                                            }
                                        }
                                    }
                                };
                                toasty.success({
                                    title: "Facility",
                                    msg: "Facility successfully closed"
                                });
                                $state.go("facilities");
                            })
                            .error(function (err) {
                                $scope.errors = err;
                            });
                    };
                    $scope.open = function (frm) {
                        var changes = formChanges.whatChanged(frm);
                        changes.closed = false;
                        wrappers.facilities.update($stateParams.facility_id, changes)
                            .success(function (data) {
                                $scope.facility = data;
                                toasty.success({
                                    title: "Facility",
                                    msg: "Facility successfully Opened"
                                });
                                $state.go("facilities");
                            })
                            .error(function (err) {
                                $scope.errors = err;
                            });
                    };
                }])

        .controller("mfl.facility_mgmt.controllers.facility_edit.basic",
            ["$scope", "$log", "$state", "$stateParams",
                "mfl.facility_mgmt.services.wrappers", "mfl.common.forms.changes",
                "mfl.common.services.multistep", "mfl.auth.services.login",
                "mfl.error.messages", "toasty", "MFL_GUIDE_URL", "$window", "adminApi",
                function ($scope, $log, $state, $stateParams, wrappers, formChanges,
                    multistepService, loginService, errorMessages, toasty, MFL_GUIDE_URL,
                    $window, adminApi) {
                    /*Set up facility officer*/
                    $scope.facilityOfficers = function (f) {
                        if (_.isUndefined(f.officer_in_charge) || _.isNull(f.officer_in_charge)) {
                            $scope.facility.officer_in_charge = {
                                name: "",
                                reg_no: "",
                                contacts: [
                                    {
                                        type: "",
                                        contact: ""
                                    }
                                ]
                            };
                        }
                    };
                    $scope.MFL_GUIDE_URL = MFL_GUIDE_URL;
                    if (!$scope.create) {
                        multistepService.filterActive(
                            $scope, $scope.steps, $scope.steps[0]);
                    } else {
                        $scope.$parent.print = false;
                        $scope.nextState();
                        $scope.facilityOfficers($scope.facility);
                    }

                    $scope.FilterForFacilityTypeParents = function (obj) {
                        return obj.parent === null;
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

                        if (kephLevel2.includes(facTyp)) {
                            $scope.select_values.keph_level = kph2;
                        } else if (kephLevel3.includes(facTyp)) {
                            $scope.select_values.keph_level = kph3;
                        } else if (kephLevel4.includes(facTyp)) {
                            $scope.select_values.keph_level = kph4;
                        } else if (kephLevel5.includes(facTyp)) {
                            $scope.select_values.keph_level = kph5;
                        } else if (kephLevel6.includes(facTyp)) {
                            $scope.select_values.keph_level = kph6;
                        }
                    };

                    $scope.initUniqueName = function (frm) {
                        if (_.isUndefined($scope.facility.name)) {
                            $scope.facility.name = $scope.facility.official_name;
                            frm.name.$setViewValue($scope.facility.name);
                            frm.name.$render();
                        }
                    };
                    $scope.populate_operational_hours = function () {
                        if ($scope.facility.open_whole_day) {
                            $scope.facility.open_late_night = true;
                            $scope.facility.open_public_holidays = true;
                            $scope.facility.open_weekends = true;
                            $scope.facility.open_normal_day = true;
                        }
                        else {
                            $scope.facility.open_late_night = false;
                            $scope.facility.open_public_holidays = false;
                            $scope.facility.open_weekends = false;
                            $scope.facility.open_normal_day = false;
                        }
                    };
                    var ward_filters = {
                        fields: "id,name,sub_county,constituency",
                        page_size: 10000
                    };
                    var county_filters = {
                        fields: "id,name",
                        page_size: 10000
                    };
                    var const_filters = {
                        fields: "id,name,county",
                        page_size: 10000
                    };
                    var sub_county_filters = {
                        fields: "id,name,county",
                        page_size: 10000
                    };

                    $scope.operationStatusFilter = function (a) {
                        return a.name !== "Closed";
                    };

                    $scope.filterFxns = {
                        subFilter: function (a) {
                            if (!_.isUndefined($scope.select_values)) {
                                return a.county === $scope.select_values.county;
                            }
                            else {
                                return false;
                            }
                        },
                        constFilter: function (a) {
                            if (!_.isUndefined($scope.select_values)) {
                                return a.county === $scope.select_values.county;
                            }
                            else {
                                return false;
                            }
                        },
                        wardConstFilter: function (a) {
                            if (!_.isUndefined($scope.select_values)) {
                                return a.constituency === $scope.select_values.constituency;
                            }
                            else {
                                return false;
                            }
                        },
                        wardSubFilter: function (a) {
                            if (!_.isUndefined($scope.select_values)) {
                                return a.sub_county === $scope.select_values.sub_county;
                            }
                            else {
                                return false;
                            }
                        }
                    };

                    var active_filter = { is_active: true, page_size: 10000 };
                    $scope.contacts = [{ type: "", contact: "" }];
                    $scope.login_user = loginService.getUser();
                    $scope.selectReload(wrappers.facility_owners, "", "owners", active_filter);
                    $scope.selectReload(wrappers.facility_owner_types, "",
                        "owner_types", active_filter);
                    $scope.selectReload(
                        wrappers.operation_status, "", "operation_status", active_filter);
                    $scope.selectReload(wrappers.keph_levels, "", "keph_levels", active_filter);

                    $scope.selectReload(
                        wrappers.regulating_bodies, "", "regulating_bodies", active_filter);
                    $scope.selectReload(
                        wrappers.admission_status, "", "admission_status", active_filter);
                    $scope.selectReload(
                        wrappers.regulation_status, "", "regulation_statuses", active_filter);
                    $scope.selectReload(wrappers.facility_types, "", "facility_types", active_filter);
                    $scope.selectReload(wrappers.towns, "", "towns", active_filter);
                    $scope.selectReload(wrappers.wards, "", "wards", ward_filters);
                    $scope.selectReload(wrappers.sub_counties, "", "sub_counties", sub_county_filters);
                    $scope.selectReload(wrappers.constituencies, "", "constituencies", const_filters);
                    $scope.selectReload(wrappers.counties, "", "counties", county_filters);

                    var upload_success_function = function () {
                        console.log("FIle Uploaded");
                        toasty.success({
                            title: "Facility Checklist",
                            msg: "Checklist uploaded successfully"
                        });
                    };

                    var upload_error_function = function (data) {
                        $log.error(data);
                        $scope.errors = data;
                    };

                    $scope.upload_checklist_file = function (checklist_file) {
                        var is_update = false;
                        var url = adminApi.documents.makeUrl(adminApi.documents.apiBaseUrl);
                        var payload = {
                            "name": $scope.facility.name + " Facility Checklist File",
                            "description": "Facilities checklist file",
                            "document_type": "Facility_ChecKList",
                            "facility_name": $scope.facility.name
                        };

                        if ($scope.facility.facility_checklist_document.id) {
                            url += $scope.facility.facility_checklist_document.id + "/";
                            is_update = true;

                        }
                        adminApi.uploadFile(url, checklist_file, "fyl", payload, is_update)
                            .then(upload_success_function, upload_error_function);
                    };

                    $scope.save = function (frm) {

                        $scope.finish = ($scope.nxtState ? "facilities" :
                            "facilities.facility_edit.geolocation");
                        var changes = formChanges.whatChanged(frm);
                        $scope.facility.ward = $scope.select_values.ward;
                        $scope.facility.keph_level = $scope.select_values.keph_level;
                        $scope.facility.facility_type = $scope.select_values.facility_type_details;
                        $scope.facility.owner = $scope.select_values.owner;
                        $scope.facility.operation_status = $scope.select_values.operation_status;
                        $scope.facility.admission_status = $scope.select_values.admission_status;
                        $scope.facility.regulatory_body = $scope.select_values.regulatory_body;
                        $scope.facility.town = $scope.select_values.town;
                        $scope.facility.sub_county = $scope.select_values.sub_county.id;
                        $scope.facility.regulation_status = $scope.select_values.regulation_status;

                        if ($scope.create) {
                            $scope.setFurthest(2);

                            /*Check if the checklist file has been provided*/
                            var doc = $scope.facility.facility_checklist_document;
                            if (doc) {
                                $scope.upload_checklist_file(doc);
                            }
                            if (_.isEmpty($state.params.facility_id)) {
                                wrappers.facilities.create($scope.facility)
                                    .success(function (data) {
                                        if ($scope.facility.facility_checklist_document) {
                                            $scope.upload_checklist_file(
                                                $scope.facility.facility_checklist_document,
                                                true);
                                        }
                                        $state.go("facilities.facility_create.geolocation",
                                            {
                                                facility_id: data.id,
                                                furthest: $scope.furthest
                                            }, { reload: true });
                                    })
                                    .error(function (data) {
                                        $log.error(data);
                                        $scope.errors = data;
                                        $scope.basic_error = errorMessages.errors + errorMessages.data;
                                    });
                            }
                            else {
                                changes.sub_county = $scope.facility.sub_county;
                                wrappers.facilities.update($state.params.facility_id, changes)
                                    .success(function () {
                                        /*Check if the checklist file has been provided during updating*/
                                        if ($scope.facility.facility_checklist_document) {
                                            $scope.upload_checklist_file(
                                                $scope.facility.facility_checklist_document,
                                                true);
                                        }

                                        $state.go(
                                            "facilities.facility_create.geolocation",
                                            {
                                                facility_id: $state.params.facility_id,
                                                furthest: $scope.furthest
                                            },
                                            { reload: true });
                                    })
                                    .error(function (data) {
                                        $log.error(data);
                                        $scope.errors = data;
                                        $scope.basic_error = errorMessages.errors + errorMessages.data;
                                    });
                            }
                        } else {
                            if ($scope.facility.facility_checklist_document) {
                                $scope.upload_checklist_file(
                                    $scope.facility.facility_checklist_document,
                                    true);
                            }
                            changes.officer_in_charge = $scope.facility.officer_in_charge;
                            changes.sub_county = $scope.facility.sub_county;
                            wrappers.facilities.update($scope.facility_id, changes)
                                .success(function () {
                                    if ($scope.nxtState) {
                                        toasty.success({
                                            title: "Facility",
                                            msg: "Facility successfully updated"
                                        });
                                    }

                                    if ($scope.facility.approved) {
                                        $state.go("facilities.facility_view_changes",
                                            { facility_id: $stateParams.facility_id });
                                    }
                                    else {
                                        $state.go($scope.finish);
                                    }
                                })
                                .error(function (data) {
                                    $log.error(data);
                                    $scope.errors = data;
                                    $scope.basic_error = errorMessages.errors + errorMessages.data;
                                });
                        }
                    };
                    /*Job Titles*/
                    wrappers.job_titles.filter({ "fields": "id,name" })
                        .success(function (data) {
                            $scope.job_titles = data.results;
                        })
                        .error(function (error) {
                            $log.error(error);
                        });
                    /*contact types*/
                    wrappers.contact_types.filter({ "fields": "id,name" })
                        .success(function (data) {
                            $scope.contact_types = data.results;
                        })
                        .error(function (error) {
                            $log.error(error);
                        });
                    $scope.addOfficerContact = function () {
                        $scope.facility.officer_in_charge.contacts.push({
                            type: "",
                            contact: ""
                        });
                    };
                    $scope.addContact = function () {
                        $scope.facility.contacts.push({ contact_type: "", contact: "" });
                    };

                    $scope.removeOfficerContact = function (obj) {
                        if (_.isUndefined(obj.officer_contact_id)) {
                            $scope.facility.officer_in_charge.contacts =
                                _.without($scope.facility.officer_in_charge.contacts, obj);
                        } else {
                            wrappers.officer_contacts.remove(obj.officer_contact_id)
                                .success(function () {
                                    wrappers.contacts.remove(obj.contact_id)
                                        .success(function () {
                                            $scope.facility.officer_in_charge.contacts =
                                                _.without(
                                                    $scope.facility.officer_in_charge.contacts, obj);
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
                    $scope.$watch("facility", function (f) {
                        if (_.isUndefined(f)) {
                            return;
                        }
                        $scope.facilityOfficers(f);
                    });
                }]
        )

        /**
         * @ngdoc controller
         *
         * @name mfl.facility_mgmt.controllers.facility_edit.contacts
         *
         * @description
         * Controller used to add/edit contacts of a facility
         */
        .controller("mfl.facility_mgmt.controllers.facility_edit.contacts",
            ["$scope", "$log", "$stateParams",
                "mfl.facility_mgmt.services.wrappers", "mfl.error.messages", "$state",
                "toasty", "$window",
                function ($scope, $log, $stateParams, wrappers, errorMessages, $state, toasty, $window) {
                    if ($scope.create) {
                        $scope.nextState();
                        $scope.$parent.print = false;
                    }
                    $scope.contacts = [];
                    $scope.contact = {
                        contact_type: "",
                        contact: ""
                    };

                    /*Job Titles*/
                    wrappers.job_titles.filter({ "fields": "id,name" })
                        .success(function (data) {
                            $scope.job_titles = data.results;
                        })
                        .error(function (error) {
                            $log.error(error);
                        });


                    $scope.detailed_contacts = [];
                    /*Set up facility contacts*/
                    $scope.facilityContacts = function (f) {
                        if (f.contacts.length < 1) {
                            $scope.detailed_contacts.push({
                                contact_type: "",
                                contact: ""
                            });
                        }
                    };
                    $scope.removeContact = function (obj) {
                        if (_.isUndefined(obj.id)) {
                            $scope.detailed_contacts =
                                _.without($scope.detailed_contacts, obj);
                        }
                        else {
                            var fac_delcont = _.findWhere($scope.fac_contacts, { "contact": obj.id });
                            $scope.removeChild(fac_delcont);
                        }
                    };
                    $scope.createContact = function () {
                        $scope.finish = ($scope.nxtState ? "facilities" :
                            "facilities.facility_edit.units");
                        $scope.fac_contobj.officer_in_charge = $scope.facility.officer_in_charge;
                        if (!_.isEmpty($scope.fac_contobj.contacts) || $scope.fac_contobj.officer_in_charge) {
                            wrappers.facilities.update($scope.facility_id, $scope.fac_contobj)
                                .success(function () {
                                    wrappers.facilities.update($scope.facility_id, $scope.fac_contobj)
                                        .success(function () { });
                                    if (!$scope.create) {
                                        toasty.success({
                                            title: "Facility",
                                            msg: "Facility contacts successfully updated"
                                        });

                                        if ($scope.facility.approved) {
                                            $state.go("facilities.facility_view_changes",
                                                { facility_id: $stateParams.facility_id });
                                        }
                                        else {
                                            $state.go($scope.finish);
                                        }
                                    } else {
                                        $scope.goToNext(4, "units");
                                    }
                                })
                                .error(function (err) {
                                    $scope.errors = err;
                                });
                        } else {
                            if (!$scope.create) {
                                $state.go($scope.finish, { reload: true });
                            } else {
                                $scope.goToNext(4, "units");
                            }
                        }
                    };
                    $scope.saveContacts = function () {
                        $scope.fac_contobj = { contacts: [] };
                        _.each($scope.detailed_contacts, function (a_contact) {
                            if (_.isUndefined(a_contact.id)) {
                                $scope.fac_contobj.contacts.push(a_contact);
                            }
                        });
                        $scope.createContact();
                    };
                    $scope.facilityOfficers = function (f) {
                        if (_.isUndefined(f.officer_in_charge) || _.isNull(f.officer_in_charge)) {
                            $scope.facility.officer_in_charge = {
                                name: "",
                                reg_no: "",
                            };
                        }
                    };
                    $scope.addOfficerContact = function () {
                        $scope.facility.officer_in_charge.contacts.push({
                            type: "",
                            contact: ""
                        });
                    };
                    $scope.removeOfficerContact = function (obj) {
                        if (_.isUndefined(obj.officer_contact_id)) {
                            $scope.facility.officer_in_charge.contacts =
                                _.without($scope.facility.officer_in_charge.contacts, obj);
                        } else {
                            wrappers.officer_contacts.remove(obj.officer_contact_id)
                                .success(function () {
                                    wrappers.contacts.remove(obj.contact_id)
                                        .success(function () {
                                            $scope.facility.officer_in_charge.contacts =
                                                _.without(
                                                    $scope.facility.officer_in_charge.contacts, obj);
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

                    $scope.$watch("facility", function (f) {
                        if (_.isUndefined(f) || _.isEmpty(f)) {
                            return;
                        }
                        $scope.facilityOfficers(f);
                        if (f.hasOwnProperty("contacts")) {
                            $scope.facilityContacts(f);
                        }
                    });
                    /*contact types*/
                    wrappers.contact_types.filter({ "fields": "id,name" })
                        .success(function (data) {
                            $scope.contact_types = data.results;
                        })
                        .error(function (error) {
                            $scope.errors = error;
                        });

                    /*facility contacts*/
                    wrappers.facility_contacts.filter({ facility: $stateParams.facility_id })
                        .success(function (data) {
                            $scope.fac_contacts = data.results;
                            _.each($scope.fac_contacts, function (cont) {
                                wrappers.contacts.get(cont.contact)
                                    .success(function (data) {
                                        $scope.detailed_contacts.push(data);
                                    })
                                    .error(function (err) {
                                        $scope.errors = err;
                                    });
                            });
                        })
                        .error(function (error) {
                            $scope.errors = error;
                            $scope.cont_error = errorMessages.errors +
                                errorMessages.fetch_contacts;
                        });

                    /*remove contact*/
                    $scope.removeChild = function (obj) {
                        obj.delete_spinner = true;
                        wrappers.facility_contacts.remove(obj.id)
                            .success(function () {
                                wrappers.contacts.remove(obj.contact)
                                    .success(function () {
                                        var delcont = _.findWhere($scope.detailed_contacts,
                                            { "id": obj.contact });
                                        $scope.detailed_contacts =
                                            _.without($scope.detailed_contacts, delcont);
                                        $scope.fac_contacts =
                                            _.without($scope.fac_contacts, obj);
                                        toasty.success({
                                            title: "Facility Contacts",
                                            msg: "Contact successfully deleted"
                                        });
                                        obj.delete_spinner = false;
                                    })
                                    .error(function (data) {
                                        $scope.errors = data;
                                        obj.delete_spinner = false;
                                        $scope.cont_error = errorMessages.errors +
                                            errorMessages.contacts;
                                    });
                            })
                            .error(function (data) {
                                $scope.errors = data;
                                obj.delete_spinner = false;
                                $scope.cont_error = errorMessages.errors +
                                    errorMessages.contacts;
                            });
                    };

                    /*add contact*/
                    $scope.add = function () {
                        $scope.spinner = true;
                        wrappers.contacts.create({
                            "contact_type": $scope.contact.contact_type,
                            "contact": $scope.contact.contact
                        })
                            .success(function (data) {
                                wrappers.facility_contacts.create({
                                    "facility": $stateParams.facility_id,
                                    "contact": data.id
                                })
                                    .success(function (data) {
                                        $scope.fac_contacts.push(data);
                                        $scope.contact = {
                                            contact_type: "",
                                            contact: ""
                                        };
                                        $scope.spinner = false;
                                    })
                                    .error(function (data) {
                                        $log.error(data);
                                        $scope.spinner = false;
                                        $scope.errors = data;
                                        $scope.cont_error = errorMessages.errors +
                                            errorMessages.contacts;
                                    });
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.spinner = false;
                                $scope.errors = data;
                                $scope.cont_error = errorMessages.errors +
                                    errorMessages.contacts;
                            });
                    };
                }]
        )

        .controller("mfl.facility_mgmt.controllers.facility_edit.services",
            ["$scope", "$controller",
                function ($scope, $controller) {
                    var helper = $controller("mfl.facility_mgmt.controllers.services_helper");
                    helper.bootstrap($scope);
                    if ($scope.create) {
                        $scope.nextState();
                        $scope.$parent.print = false;
                    }
                    $scope.filters = { facility: $scope.facility_id };
                }]
        )

        /**
         * @ngdoc controller
         *
         * @name mfl.facility_mgmt.controllers.facility_edit.units
         *
         * @description
         * Controller used to add/edit departments/units of a facility
    */
        .controller("mfl.facility_mgmt.controllers.facility_edit.units",
            ["$scope", "$log", "$stateParams",
                "mfl.facility_mgmt.services.wrappers", "mfl.common.services.multistep",
                "mfl.error.messages", "$state", "toasty", "adminApi", "$window",
                function ($scope, $log, $stateParams, wrappers, multistepService,
                    errorMessages, $state, toasty, adminApi, $window) {
                    if (!$scope.create) {
                        multistepService.filterActive(
                            $scope, $scope.steps, $scope.steps[4]);
                    } else {
                        $scope.nextState();
                        $scope.$parent.print = false;
                    }
                    $scope.fac_depts = [];
                    $scope.fac_units = [];
                    wrappers.facility_depts.filter({
                        fields: "id,name,regulatory_body,regulatory_body_name"
                    }).success(function (data) {
                        $scope.facility_depts = data.results;
                    }).error(function (data) {
                        $scope.errors = data;
                    });
                    /*regulating bodies*/
                    wrappers.regulating_bodies.filter({ fields: "id,name" })
                    .success(function (data) {
                            $scope.regbodies = data.results
                        })
                        .error(function (error) {
                            $scope.errors = error;
                        });

                    /*regulation_statuses*/
                    wrappers.regulation_status.filter({ fields: "id,name" })
                        .success(function (data) {
                            $scope.regulation_statuses = data.results;
                        })
                        .error(function (error) {
                            $scope.errors = error;
                        });

                    $scope.select_values = {
                        regulatory_body: {
                        },
                        regulation_status: {
                        }
                    };

                    /*facility units*/
                    wrappers.facility_units.filter({
                        facility: $scope.facility_id,
                        fields: "id,name,regulating_body,regulating_body_name"
                    })
                        .success(function (data) {
                            $scope.facility_departments = data.results;
                        })
                        .error(function (error) {
                            $log.error(error);
                            $scope.errors = error;
                            $scope.units_error = errorMessages.errors +
                                errorMessages.fetch_units;
                        });
                    $scope.autoFillRegBody = function (fac_dept) {
                        var result = _.findWhere($scope.facility_depts, { "id": fac_dept.unit });
                        fac_dept.regulating_body_name = result.regulatory_body_name;
                    };
                    $scope.dept_spinner = true;
                    $scope.facilityUnits = function (f) {
                        if (f.facility_units.length === 0) {
                            $scope.dept_spinner = false;
                            $scope.fac_depts.push({
                                unit: "",
                                regulating_body_name: ""
                            });
                        }
                        else {
                            $scope.dept_spinner = false;
                            $scope.fac_depts = f.facility_units;
                        }
                    };
                    $scope.addUnit = function () {
                        $scope.fac_depts.push({
                            unit: "",
                            regulating_body_name: ""
                        });
                    };
                    $scope.removeUnit = function (obj) {
                        if (_.isUndefined(obj.id)) {
                            $scope.fac_depts = _.without($scope.fac_depts, obj);
                        }
                    };
                    $scope.createUnit = function (arg) {
                        $scope.nxtState = arg;
                        $scope.finish = ($scope.nxtState ? "facilities" :
                            "facilities.facility_edit.services");
                        if (!_.isEmpty($scope.fac_unitobj.units)) {
                            wrappers.facilities.update($scope.facility_id, $scope.fac_unitobj)
                                .success(function () {
                                    toasty.success({
                                        title: "Facility",
                                        msg: "Facility regulation successfully updated"
                                    });
                                    if (!$scope.create) {
                                        if ($scope.facility.approved) {
                                            $state.go("facilities.facility_view_changes",
                                                { facility_id: $stateParams.facility_id });
                                        }
                                        else {
                                            $scope.goToNext(5, "services");
                                        }
                                    }
                                    else {
                                        $scope.goToNext(5, "services");
                                    }

                                })
                                .error(function (err) {
                                    $scope.alert = err.error;
                                    $scope.errors = err;
                                });
                        } else {
                            if (!$scope.create) {
                                if ($scope.facility.approved) {
                                    $state.go("facilities.facility_view_changes",
                                        { facility_id: $stateParams.facility_id });
                                }
                                else {
                                    $state.go("facilities");
                                }
                            } else {
                                $scope.goToNext(5, "services");
                            }
                        }
                    };

                    var upload_success_function = function () {
                        console.log("FIle Uploaded");
                    };

                    var upload_error_function = function () {
                        console.log("Error uploading file");
                    };

                    $scope.upload_licence_pdf_file = function (checklist_file, is_update) {
                        var url = adminApi.documents.makeUrl(adminApi.documents.apiBaseUrl);
                        var payload = {
                            "name": $scope.facility.name + " Facility license File",
                            "description": "Facilities license file",
                            "document_type": "FACILITY_LICENSE",
                            "facility_name": $scope.facility.name
                        };

                        adminApi.uploadFile(url, checklist_file, "fyl", payload, is_update)
                            .then(upload_success_function, upload_error_function);
                    };

                    $scope.update_facility_regulatory_details = function () {
                        var updates = {};
                        if (_.isUndefined($scope.select_values.regulatory_body.name)) {
                            updates.regulatory_body = $scope.select_values.regulatory_body;
                        }

                        if (_.isUndefined($scope.select_values.regulation_status.name)) {
                            updates.regulation_status = $scope.select_values.regulation_status;
                        }

                        if (!_.isUndefined($scope.facility.license_number)) {
                            updates.license_number = $scope.facility.license_number;
                        }

                        if (!_.isUndefined($scope.facility.registration_number)) {
                            updates.registration_number = $scope.facility.registration_number;
                        }

                        wrappers.facilities.update($scope.facility_id, updates)
                            .success(function () {

                                var license_file = $window.$("input[type='file'][name='license_file']")[0].files[0];
                                function sleep(time) {
                                    return new Promise((resolve) => setTimeout(resolve, time));
                                }

                                sleep(5000).then(() => {
                                    $scope.upload_licence_pdf_file(license_file, false);
                                    $state.go("facilities.facility_view_changes",
                                        { facility_id: $scope.facility_id }, { reload: true });
                                });

                            }).error(function (error) {
                                $scope.errors = error;
                            });
                    };

                    $scope.saveUnits = function (arg) {
                        $scope.update_facility_regulatory_details();
                        $scope.fac_unitobj = { units: [] };

                        _.each($scope.fac_depts, function (a_unit) {
                            if (_.isUndefined(a_unit.id)) {
                                $scope.fac_unitobj.units.push(a_unit);
                            }
                        });
                        $scope.createUnit(arg);
                    };
                    $scope.$watch("facility", function (f) {
                        if (_.isUndefined(f)) {
                            return;
                        }
                        if (f.hasOwnProperty("facility_units")) {
                            $scope.facilityUnits(f);
                            $scope.select_values = {
                                regulatory_body: {
                                    "id": $scope.facility.regulatory_body,
                                    "name": $scope.facility.regulatory_body_name
                                },
                                regulation_status: {
                                    "name": $scope.facility.regulatory_status_name,
                                    "id": $scope.facility.regulatory_status
                                }
                            };
                        }
                    });
                    /*add existing regulatory to facility*/
                    $scope.add = function () {
                        $scope.spinner = true;
                        wrappers.facility_units.create({
                            "facility": $scope.facility_id,
                            "regulating_body": $scope.facility_unit.regulating_body,
                            "name": $scope.facility_unit.name,
                            "description": $scope.facility_unit.name
                        })
                            .success(function (data) {
                                $scope.fac_units.push(data);
                                $scope.spinner = false;
                            })
                            .error(function (data) {
                                $log.error(data);
                                $scope.spinner = false;
                                $scope.errors = data;
                                $scope.units_error = errorMessages.errors +
                                    errorMessages.units;
                            });
                    };

                    /*remove facility unit*/
                    $scope.removeChild = function (obj) {
                        if (_.isUndefined(obj.id)) {
                            $scope.fac_depts = _.without($scope.fac_depts, obj);
                        } else {
                            obj.delete_spinner = true;
                            wrappers.facility_units.remove(obj.id)
                                .success(function () {
                                    $scope.fac_depts = _.without($scope.fac_depts, obj);
                                    toasty.success({
                                        title: "Facility Regulation",
                                        msg: "Regulation successfully deleted"
                                    });
                                    obj.delete_spinner = false;
                                })
                                .error(function (data) {
                                    $log.error(data);
                                    obj.delete_spinner = false;
                                    $scope.units_error = errorMessages.errors +
                                        errorMessages.delete_units;
                                });
                        }
                    };
                }
            ])

        /**
             * @ngdoc controller
             *
             * @name mfl.facility_mgmt.controllers.facility_edit.setup
             *
             * @description
             * Controller used to add/edit setup of a facility
        */
        .controller("mfl.facility_mgmt.controllers.facility_edit.setup",
            ["$scope", "mfl.facility_mgmt.services.wrappers", "$log",
                "mfl.common.forms.changes", "$state", "mfl.common.services.multistep",
                function ($scope, wrappers, $log, formChanges, $state,
                    multistepService) {
                    /*Update operation setup details*/
                    if (!$scope.create) {
                        multistepService.filterActive(
                            $scope, $scope.steps, $scope.steps[3]);
                    }
                    else {
                        $scope.nextState();
                    }
                    $scope.updateOp = function (opFrm) {
                        var changed = formChanges.whatChanged(opFrm);
                        opFrm.facility = $scope.facility_id;
                        $scope.spinner1 = true; //show spinner
                        if (!_.isEmpty(changed)) {
                            wrappers.facilities.update($scope.facility_id, changed)
                                .success(function (data) {
                                    $scope.spinner1 = false;
                                    $scope.geo = data;

                                    if (!$scope.create) {
                                        $state.go("facilities.facility_edit.officers",
                                            { "facility_id": $scope.facility_id }, { reload: true });
                                    } else {
                                        $scope.goToNext(5, "officers");
                                    }
                                })
                                .error(function (error) {
                                    $scope.spinner1 = false;
                                    $log.error(error);
                                });
                        }
                        else {
                            if (!$scope.create) {
                                $state.go("facilities.facility_edit.officers",
                                    { "facility_id": $scope.facility_id }, { reload: true });
                            } else {
                                $scope.goToNext(5, "officers");
                            }
                        }
                    };
                }])

        /**
         * @ngdoc controller
         *
         * @name mfl.facility_mgmt.controllers.facility_edit.geolocation
         *
         * @description
         * Controller used to add/edit geolation details of a facility
    */
        .controller("mfl.facility_mgmt.controllers.facility_edit.geolocation",
            ["$scope", "mfl.facility_mgmt.services.wrappers", "$log", "leafletData",
                "mfl.common.services.multistep", "mfl.common.forms.changes", "$state",
                "mfl.error.messages", "toasty", "$filter", "$stateParams",
                function ($scope, wrappers, $log, leafletData, multistepService,
                    formChanges, $state, errorMessages, toasty, $filter, $stateParams) {
                    var value = new Date();
                    $scope.maxDate = value.getFullYear() + "/" + (value.getMonth() + 1) +
                        "/" + value.getDate();
                    if (!$scope.create) {
                        multistepService.filterActive(
                            $scope, $scope.steps, $scope.steps[1]);
                    } else {
                        $scope.nextState();
                        $scope.$parent.print = false;
                    }
                    $scope.geo = {
                        coordinates: {
                            coordinates: []
                        }
                    };
                    angular.extend($scope, {
                        defaults: {
                            scrollWheelZoom: false
                        },
                        layers: {},
                        tiles: {
                            openstreetmap: {
                                url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                options: {
                                    opacity: 0.2
                                }
                            }
                        }
                    });
                    //gets facility coordinates
                    $scope.getFacilityCoordinates = function (f) {
                        //facility's coordinates
                        wrappers.facility_coordinates.get(f.coordinates)
                            .success(function (data) {
                                $scope.spinner = false;

                                $scope.geo = data;
                                $scope.collection_date = $filter("date")($scope.geo.collection_date);

                                $scope.select_values = {
                                    town: {
                                        "id": f.town,
                                        "name": f.town_name
                                    }
                                };
                                angular.extend($scope, {
                                    markers: {
                                        mainMarker: {
                                            layer: "facility",
                                            lat: data.coordinates.coordinates[1],
                                            lng: data.coordinates.coordinates[0],
                                            message: f.name,
                                            draggable: false
                                        }
                                    }
                                });
                            })
                            .error(function (error) {
                                $scope.spinner = false;
                                $scope.errors = error;
                                $log.error(error);
                                $scope.geocodes_error = errorMessages.errors +
                                    errorMessages.geocodes;
                            });
                    };
                    //get facility ward and draw its map
                    $scope.facilityWard = function (f) {
                        //ward coordinates
                        // There is need to check if the ward is provided as an objct
                        var ward_id = null;
                        if (typeof (f.ward) === "object") {
                            ward_id = f.ward.id;
                        }
                        else if (typeof (f.ward === "string")) {
                            ward_id = f.ward;
                        }
                        else {
                            throw new Error("Unknow typeof ward");
                        }

                        wrappers.wards.get(ward_id)
                            .success(function (data) {
                                $scope.spinner = false;
                                $scope.ward_gis = data.ward_boundary;
                                leafletData.getMap("wardmap")
                                    .then(function (map) {
                                        var coords = data.ward_boundary.properties.bound.coordinates[0];
                                        $scope.center = [];
                                        var bounds = _.map(coords, function (c) {
                                            return [c[1], c[0]];
                                        });
                                        map.fitBounds(bounds);
                                        //has to be there for marker to appear
                                        if (!_.isNull(f.coordinates)) {
                                            $scope.getFacilityCoordinates(f);
                                        }
                                        else {
                                            $scope.geo.coordinates =
                                                $scope.center;
                                            angular.extend($scope, {
                                                markers: {
                                                    // mainMarker: {
                                                    //     layer:"facility",
                                                    //     lat: $scope.geo.coordinates.coordinates[1],
                                                    //     lng: $scope.geo.coordinates.coordinates[0],
                                                    //     message: f.name,
                                                    //     draggable: false
                                                    // }
                                                }
                                            });
                                        }
                                    });
                                var gis = data.ward_boundary;
                                // setup data for the map
                                angular.extend($scope, {
                                    geojson: {
                                        data: gis,
                                        style: {
                                            fillColor: "rgba(255, 135, 32, 0.76)",
                                            weight: 2,
                                            opacity: 1,
                                            color: "rgba(0, 0, 0, 0.52)",
                                            dashArray: "5",
                                            fillOpacity: 0.5
                                        }
                                    },
                                    layers: {
                                        baselayers: {
                                            googleRoadmap: {
                                                name: "Google Streets",
                                                layerType: "ROADMAP",
                                                type: "google"
                                            }
                                        },
                                        overlays: {
                                            facility: {
                                                name: "Facility Location",
                                                type: "group",
                                                visible: true
                                            }
                                        }
                                    }
                                });
                            })
                            .error(function (error) {
                                $scope.spinner = false;
                                $log.error(error);
                                $scope.errors = error;
                                $scope.wards_error = errorMessages.errors +
                                    errorMessages.ward;
                            });
                    };
                    //if create go to create or edit state
                    $scope.toState = function (arg) {
                        if ($scope.create) {
                            $scope.goToNext(3, "contacts");
                        } else {
                            $scope.nxtState = arg;
                            $scope.finish = ($scope.nxtState ? "facilities" :
                                "facilities.facility_edit.contacts");
                            if ($scope.nxtState) {
                                toasty.info({
                                    title: "Facility",
                                    msg: "Facility geolocation successfully updated"
                                });
                            }
                            $state.go($scope.finish,
                                { "facility_id": $scope.facility_id },
                                { reload: true });
                        }
                    };
                    //Save geolocation details
                    $scope.saveGeo = function (frm, arg) {
                        var spinner1 = true;
                        var changes = formChanges.whatChanged(frm);
                        /*if(!_.isEmpty(changes)){*/
                        var fac_id = $scope.facility_id || $state.params.facility_id;
                        /*changes.coordinates = [];*/
                        if (!_.isUndefined(changes.collection_date)) {
                            changes.collection_date = new Date(changes.collection_date);
                            changes.collection_date = changes.collection_date.toISOString();
                        }
                        changes.facility = fac_id;
                        changes.coordinates = {
                            type: "Point",
                            coordinates: [$scope.geo.coordinates.coordinates[0],
                            $scope.geo.coordinates.coordinates[1]]
                        };
                        if (!_.isNull($scope.facility.coordinates)) {
                            wrappers.facility_coordinates
                                .update($scope.facility.coordinates, changes)
                                .success(function (data) {
                                    spinner1 = false;
                                    $scope.geo = data;

                                    if ($scope.create) {
                                        $scope.toState(arg);
                                    }
                                    if ($scope.facility.approved) {
                                        $state.go("facilities.facility_view_changes",
                                            { facility_id: $stateParams.facility_id });
                                    }
                                    else {
                                        $scope.toState(arg);
                                    }

                                })
                                .error(function (error) {
                                    spinner1 = false;
                                    $log.error(error);
                                    $scope.errors = error;
                                    $scope.geoloc_error = error[0] ||
                                        errorMessages.errors +
                                        errorMessages.geolocation;
                                });
                        } else {
                            wrappers.facility_coordinates.create(changes)
                                .success(function (data) {
                                    wrappers.facilities.update(
                                        fac_id, { "coordinates": data.id })
                                        .success(function () {
                                            if ($scope.create) {
                                                $scope.toState(arg);
                                            }
                                            if ($scope.facility.approved) {
                                                $state.go("facilities.facility_view_changes",
                                                    { facility_id: $stateParams.facility_id });
                                            }
                                            else {
                                                $scope.toState(arg);
                                            }

                                        })
                                        .error(function (error) {
                                            $log.error(error);
                                            $scope.errors = error;
                                            $scope.geoloc_error = errorMessages.errors +
                                                errorMessages.geolocation;
                                        });
                                })
                                .error(function (error) {
                                    $log.error(error);
                                    $scope.errors = error;
                                    $scope.geoloc_error = errorMessages.errors +
                                        errorMessages.geolocation;
                                });
                        }
                    };
                    //update marker position
                    $scope.checkLocation = function () {
                        angular.extend($scope, {
                            markers: {
                                mainMarker: {
                                    layer: "facility",
                                    lat: $scope.geo.coordinates.coordinates[1],
                                    lng: $scope.geo.coordinates.coordinates[0],
                                    message: "facility location"
                                }
                            }
                        });

                    };
                    // update coordinates after dragging marker
                    $scope.$on("leafletDirectiveMarker.wardmap.dragend", function (e, args) {
                        $scope.geo.coordinates.coordinates = [args.model.lng, args.model.lat];
                    });
                    /*Wait for facility to be defined*/
                    $scope.$watch("facility", function (f) {
                        if (_.isUndefined(f)) {
                            return;
                        }
                        //draw facility on the map
                        if (f.hasOwnProperty("ward")) {
                            $scope.facilityWard(f);
                        }
                    });
                }])
        .controller("mfl.facilities.preview_changes", ["$scope",
            "$stateParams", "mfl.facility_mgmt.services.wrappers",
            function ($scope, $stateParams, wrappers) {
                var facility_id = $stateParams.facility_id;

                wrappers.facilities.get(facility_id)
                    .success(function (data) {
                        $scope.facility = data;
                        if ($scope.facility.facility_checklist_document.id) {
                            wrappers.documents
                                .get($scope.facility.facility_checklist_document.id)
                                .success(function (file) {
                                    $scope.checklist_document = file;
                                });
                        }
                        $scope.getFacilityStatus = function getStatus() {
                            if (!$scope.facility.is_complete) {
                                return "INCOMPLETE";
                            } else {
                                if ($scope.facility.is_approved === null) {
                                    return "PENDING VALIDATION";
                                } else if ($scope.facility.is_approved === false) {
                                    return "FAILED VALIDATION";
                                } else {
                                    if ($scope.facility.approved_national_level === null) {
                                        return "PENDING APPROVAL";
                                    } else if ($scope.facility.approved_national_level === false) {
                                        return "NOT APPROVED";
                                    } else {
                                        return "";
                                    }
                                }
                            }
                        };
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
                                    $scope.errors = data;
                                });
                        }
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                $scope.$watch("facility", function (fac) {
                    if (!_.isUndefined(fac)) {
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
                                    $scope.errors = data;
                                });
                        }
                    }
                });
            }]);

})(window.angular, window._);
