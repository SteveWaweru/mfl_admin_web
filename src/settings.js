(function (window) {
    "use strict";

    var setts = {
        "SERVER_URL": "http://localhost:8061/",
        "CREDZ": {
            "client_id": "5O1KlpwBb96ANWe27ZQOpbWSF4DZDm4sOytwdzGv",
            "client_secret": "PqV0dHbkjXAtJYhY9UOCgRVi5BzLhiDxGU91" +
                             "kbt5EoayQ5SYOoJBYRYAYlJl2RetUeDMpSvh" +
                             "e9DaQr0HKHan0B9ptVyoLvOqpekiOmEqUJ6H" +
                             "ZKuIoma0pvqkkKDU9GPv",
            "token_url": "o/token/",
            "revoke_url": "o/revoke_token/"
        },
        "TIMEOUT": {"kickout": 900, "warning": 60}
    };

    setts.CREDZ.token_url = setts.SERVER_URL + setts.CREDZ.token_url;
    setts.CREDZ.revoke_url = setts.SERVER_URL + setts.CREDZ.revoke_url;

    window.MFL_SETTINGS = setts;

})(window);
