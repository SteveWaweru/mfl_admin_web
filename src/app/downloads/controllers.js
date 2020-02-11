(function(angular, _){
    "use strict";

    angular.module("mfl.downloads.controllers", ["mfl.download.services"])

    .controller("mfl.downloads.controllers.downloads", ["$scope",
        "mfl.download.services.wrappers", "$state", function ($scope, wrappers, $state) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.spinner = true;
            $scope.refreshData = function () {
                var defaultParms = {document_type: "ALL"};
                var definedParms = {};
                _.extend(defaultParms, $state.params);
                definedParms = _.omit(defaultParms,
                    function(val){
                        return _.isUndefined(val) || val === "ALL";
                    });
                wrappers.documents.filter(definedParms)
                .success(function (data) {
                    $scope.documents = data.results;
                    $scope.spinner = false;
                    //pagination data that can hopefully be reused as a service
                    $scope.pagination = {
                        count: data.count,
                        current_page: data.current_page,
                        end_index: data.end_index,
                        next: data.next,
                        previous: data.previous
                    };
                })
                .error(function (data) {
                    $scope.errors = data;
                    $scope.spinner = false;
                });
            };

            // default state
            if(_.isUndefined($state.params.document_type)) {
                $state.go($state.current, {document_type: "ALL"},
                    {reload: false, inherit: true, notify: false });
            }
            //initialize table
            $scope.refreshData();

            // functions that can help navigate to the next/previous page

            $scope.hasNextPage = function () {
                return $scope.pagination.next !== null;
            };

            $scope.hasPreviousPage = function () {
                return $scope.pagination.previous !== null;
            };

            $scope.nextPage = function () {
                if ($scope.hasNextPage()) {
                    $state.params.page = $scope.pagination.current_page + 1;
                    $state.go($state.current, $state.params,
                        {reload: false, inherit: true, notify: false });
                    return $scope.refreshData();
                }
            };
            $scope.prevPage = function () {
                if ($scope.hasPreviousPage()) {
                    $state.params.page = $scope.pagination.current_page - 1;
                    $state.go($state.current,$state.params,
                        {reload: false, inherit: true, notify: false });
                    return $scope.refreshData();
                }
            };
        }
    ]);

})(window.angular, window._);
