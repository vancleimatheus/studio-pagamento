app.factory('stateService', ['$http', 
    function ($http) {
        var currentKey = '';
        var service = {};

        var _setKey = function(key) {
            currentKey = key;
        }

        var _getKey = function() {
            return currentKey;
        }

        service.setKey = _setKey;
        service.getKey = _getKey;

        return service;
    }]);