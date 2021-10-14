(function (window) {
    "use strict";

    var timeout = {"kickout": 900, "warning": 60};
    if(window && (window.location.href.includes('localhost') || window.location.href.includes('kmhfltest') || window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost'))){
        timeout = {"kickout": 9000000, "warning": 6000000};
        document.addEventListener('DOMContentLoaded', function(){
        // setTimeout(() => {
            // let hdCol = '#d7740b';
            let hdCol = '#222';
            document.querySelector('#nav_bar').style.backgroundColor = hdCol;
            document.head.appendChild(document.createElement('style')).innerHTML = `.header-color{ background-color: ${hdCol} !important; } nav.header{ background-color: ${hdCol} !important; }`;
        // }, 3000);
        });
    }

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
        "TIMEOUT": timeout
    };

    setts.CREDZ.token_url = setts.SERVER_URL + setts.CREDZ.token_url;
    setts.CREDZ.revoke_url = setts.SERVER_URL + setts.CREDZ.revoke_url;

    window.MFL_SETTINGS = setts;

})(window);
