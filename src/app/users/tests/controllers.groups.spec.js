(function () {
    "use strict";

    describe("Test groups controllers :", function () {
        var controller, data, root, scope, SERVER_URL, httpBackend, state;

        beforeEach(function () {
            module("mflAdminAppConfig");
            module("mfl.users.services");
            module("sil.api.wrapper");
            module("mfl.users.controllers.groups");
            module("ui.router");

            inject(["$rootScope", "$controller", "$httpBackend", "$state", "SERVER_URL",
                function ($rootScope, $controller, $httpBackend, $state, url) {
                    root = $rootScope;
                    scope = root.$new();
                    state = $state;
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    scope.fakeStateParams = {
                        user_id : 5
                    };
                    data = {
                        $scope : scope,
                        $state : $state,
                        SERVER_URL : url,
                        $stateParams : scope.fakeStateParams
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }
            ]);
        });
        it("should test Roles controller", function () {
            controller("mfl.users.controllers.group_list");
            expect(scope.test).toEqual("Roles");
        });
        it("should test the new_role controller", function () {
            controller("mfl.users.controllers.group_create");
            expect(scope.test).toEqual("New role");
        });
        //test not getting list of permissions
        it("should test listing all permissions: success", inject(["$httpBackend",
            function ($httpBackend) {
                controller("mfl.users.controllers.group_create");
                var data = "";
                $httpBackend.expectGET(
                    SERVER_URL + "api/users/permissions/?page_size=1500").respond(200, data);
                $httpBackend.flush();
            }
        ]));
        it("should test listing all permissions: fail", inject(["$httpBackend",
            function ($httpBackend) {
                controller("mfl.users.controllers.group_create");
                var data = "";
                $httpBackend.expectGET(
                    SERVER_URL + "api/users/permissions/?page_size=1500").respond(400, data);
            }
        ]));
        it("should test clicked Role", function () {
            controller("mfl.users.controllers.group_create");
            var item = {selected : false};
            scope.clickedPermission(item);
            expect(item.selected).toBeTruthy();
        });
        it("should test clicked Role", function () {
            controller("mfl.users.controllers.group_create");
            var item = {set_selected : false};
            scope.setPermission(item);
            expect(item.set_selected).toBeTruthy();
        });
        it("should test add roles : setting roles", function () {
            controller("mfl.users.controllers.group_create");
            var permission = {
                name : "",
                code_name: "",
                selected : true,
                set_selected : false
            };
            scope.permissions = [
                {
                    name : "",
                    code_name: "",
                    selected : true
                }
            ];
            scope.set_permissions = [];
            scope.addPermissions();
            expect(scope.set_permissions).toContain(permission);
        });
        it("should test add roles : reverting roles", function () {
            controller("mfl.users.controllers.group_create");
            var permissions = {
                name : "",
                code_name: "",
                selected : false,
                set_selected : true
            };
            scope.set_permissions = [
                {
                    name : "",
                    code_name: "",
                    set_selected : true
                }
            ];
            scope.permissions = [];
            scope.revertPermissions();
            expect(scope.permissions).toContain(permissions);
        });
        it("should test add user role function ", inject(["$httpBackend", "$state",
            function ($httpBackend, $state) {
                controller("mfl.users.controllers.group_create");
                spyOn($state, "go");
                scope.set_permissions = [
                    {
                        name : "",
                        permissions: "",
                        selected : false,
                        set_selected : true
                    }
                ];
                var new_role = {
                    name: "Group admin",
                    permissions: [
                        {id: "", name : "", code_name : ""}
                    ]
                };
                scope.addRole(new_role);
                $httpBackend.expectPOST(
                    SERVER_URL + "api/users/groups/").respond(
                    200,{});
                $httpBackend.flush();
            }
        ]));
        it("should test add role call : fail", inject(["$httpBackend", "$state",
            function($httpBackend, $state) {
                controller("mfl.users.controllers.group_create");
                spyOn($state, "go");
                scope.addRole({name: ""});
                $httpBackend.expectPOST(
                    SERVER_URL + "api/users/groups/").respond(
                    400,{});
                $httpBackend.flush();
            }
        ]));
    });
})();