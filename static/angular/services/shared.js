(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.factory("SharedService", function ($location, $http, $rootScope, growl, localStorageService, ApiService) {

        var exam = localStorageService.get('exam') || {};

        $rootScope.$watch(function () {
                return exam;
            },
            function (newValue) {
                localStorageService.set('exam', newValue);
                console.log(newValue);
            }, true);

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
        var validStages = ['start', 'time', 'place', 'noun', 'visnoun', 'noun-inputs', 'clock', 'calc1', 'calc2', 'calc3', 'calc4', 'calc5'];
        var nouns = ['time', 'year', 'thing', 'way', 'side', 'end', 'car', 'team', 'idea', 'work'];
        var visNouns = ['door', 'hand', 'water', 'eye', 'money', 'screw', 'house', 'car', 'party', 'book'];
        var countries = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua & Deps','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Rep','Chad','Chile','China','Colombia','Comoros','Congo','Congo (Democratic Rep)','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','East Timor','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland (Republic)','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Korea North','Korea South','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar, (Burma)','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russian Federation','Rwanda','St Kitts & Nevis','St Lucia','Saint Vincent & the Grenadines','Samoa','San Marino','Sao Tome & Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'];

        return {
            days: days,
            nouns: nouns,
            visNouns: visNouns,
            countries: countries,
            months: months,
            seasons: seasons,
            getExam: getExam,
            clearExam: clearExam,
            showNotification: showNotification,
            contains: contains,
            shuffle: shuffle,
            getRandomInt: getRandomInt,
            isValidStage: isValidStage,
            submitExam: submitExam,
            setStage: setStage,
            go: go
        };

        function showNotification(message) {
            growl.success(message);
        }

        function getExam() {
            return exam;
        }

        function clearExam() {
            for (var member in exam) {
                delete exam[member];
            }
        }

        function submitExam() {
            return ApiService.submitExam(exam);
        }

        function go(path) {
            $location.path(path);
        }

        function setStage(stage) {
            go('/exam/' + stage);
        }

        function isValidStage(stage) {
            return contains(stage, validStages);
        }

        function contains(item, array) {
            var currentItem;
            var i;

            for (i in array) {
                currentItem = array[i];
                if (angular.equals(item, currentItem)) {
                    return true;
                }
            }

            return false;
        }

        function shuffle(array) {
            var clone = array.slice();
            for (var j, x, i = clone.length; i; j = Math.floor(Math.random() * i), x = clone[--i], clone[i] = clone[j], clone[j] = x);
            return clone;
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    });

})();