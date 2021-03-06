(function () {
    "use strict";

    describe("Test profile states", function () {
        var state;

        beforeEach(function () {
            module("ui.router");
            module("mfl.users.states.profile");

            inject(["$state", function ($state) {
                state = $state;
            }]);
        });

        it("should go to home profile state", function () {
            expect(state.href("profile")).toEqual("#/profile/");
        });

        it("should go to basic profile state", function () {
            expect(state.href("profile.basic")).toEqual("#/profile/basic/");
        });

        it("should go to password change state", function () {
            expect(state.href("profile.password")).toEqual("#/profile/password/");
        });

        it("should go to password change state (required)", function () {
            expect(state.href("profile.password", {"required": true}))
                .toEqual("#/profile/password/?required=true");
        });

        it("should go to contacts state", function () {
            expect(state.href("profile.contacts")).toEqual("#/profile/contacts/");
        });
    });
})();
