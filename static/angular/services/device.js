(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.factory("DeviceService", function ($http, socket) {

            return {
                all:all,
                get:get,
                subscribe:subscribe
            };

            function all()
            {
                return $http.get('/api/devices');
            }

            function get(deviceId)
            {
                if (!deviceId)
                {
                    throw new Error('device id cannot be null')
                }

                return $http.get('/api/devices/'+deviceId);
            }

            function subscribe(scope, callback)
            {
                socket.on('devices:update', callback).bindTo(scope);
            }
        }
    );

})();