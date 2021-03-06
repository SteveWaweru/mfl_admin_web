(function(angular){
    "use strict";

    var pagination_tpl = "sil.grid.pagination.tpl.html";
    var search_tpl = "sil.grid.search.tpl.html";

    angular.module(pagination_tpl, []).run(["$templateCache",
    function($templateCache){
        $templateCache.put("sil.grid.pagination.tpl.html",
            "<ul class=\"pager\" ng-if=\"pagination.active\">\n" +
            "<li ng-if=\"pagination.prev_page\" class=\"previous\">\n"+
            "<a class='border-radius-4 btn btn-default' ng-click=paginate("+
            "pagination.prev_page)>\n" +
            "<span aria-hidden=\"true\">&laquo;</span> Prev</a>\n" +
            "</li>\n" +
            "<li ng-repeat=\"page in pagination.near_pages\" class=\"previous\">\n"+
            "<a class='border-radius-4 btn btn-default' ng-click=paginate("+
            "page)>\n" +
            "<span aria-hidden=\"true\">&laquo;</span> {{page}}</a>\n" +
            "</li>\n" +
            "<li>Page {{pagination.current_page}} / {{pagination.page_count}}</li>"+
            " <li class=\"next\" ng-if=\"pagination.next_page\">\n"+
            "<a class='border-radius-4 btn btn-default' ng-click=paginate(" +
            "pagination.next_page)>Next\n" +
            " <span aria-hidden=\"true\">&raquo;</span></a>\n" +
            "</li>\n" +
            "</ul>\n"
        );
        }
    ]);
    angular.module(search_tpl, []).run(["$templateCache", function($templateCache){
    $templateCache.put("sil.grid.search.tpl.html",
        "<div class=\"input-group input-group-in\">\n" +
        "<input type=\"text\" sil-grid-key-press class=\"form-control helper-inline\" \n"+
        "ng-model=\"silGrid.searchQuery\" placeholder=\"Search anything...\">\n" +
        "<span class=\"input-group-btn\">\n" +
        "<button class=\"btn btn-primary text-muted\" \n" +
        "ng-show=\"silGrid.searchQuery.length < 3\" \n" +
        "ng-click=\"silGridSearch(false)\" disabled><i class=\"fa fa-search\"></i>\n" +
        "</button>\n" +
        "<button class=\"btn btn-primary text-muted\" \n" +
        "ng-show=\"silGrid.searchQuery.length > 2\" \n" +
        "ng-click=\"silGridSearch(false)\"><i class=\"fa fa-search\"></i>\n" +
        "</button>\n" +
        "<button ng-show=\"silGrid.searchQuery\" class=\"btn btn-primary text-muted\"\n" +
        "ng-click=\"silGridSearch(true)\"><i  class=\"fa fa-times\"></i>\n" +
        "</button>\n" +
        "</span>\n" +
        "</div>\n"
        );
    }]);

    angular.module("sil.grid.tpls", [pagination_tpl, search_tpl]);
})(angular);
