var Api = {

    call: function(method, url, data, callback) {

        var callback = callback || function() {};
        var method = method || 'GET';
        var data = data || '';

        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
            else {
                throw new Error('Неверный запрос, status=' + xhr.status);
            }
        };

        xhr.send(data);
    }
};