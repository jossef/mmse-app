(function () {
    "use strict";

    var levenshtein = require('levenshtein');
    var dateformat = require('dateformat');
    var config = require('./config');


    function checkAnswer(expected, input, strict) {
        expected = expected.toString().toLowerCase();
        input = input.toString().toLowerCase();

        if (strict) {
            if (expected == input) {
                return 1;
            }

            console.log(expected, input);
            return 0;
        }

        var levenshteinResult = new levenshtein(expected, input);
        var distance = levenshteinResult.distance + 1;

        var score = 1 / distance;
        if (score < config.scoreThreshold) {
            return 0
        }

        return score;
    }

    function getSeason(date) {

        // +1 because `getMonth()` Returns 0-11
        var month = date.getMonth() + 1;

        if (3 <= month <= 5) {
            return 'spring';
        }

        if (6 <= month <= 8) {
            return 'summer';
        }

        if (9 <= month <= 11) {
            return 'fall';
        }

        // Months 12, 01, 02
        return 'winter';
    }

    function checkNouns(nouns, inputs) {
        var i;
        var j;

        var score = 0;

        for (i in nouns) {
            var noun = nouns[i];
            var nounScore = 0;
            for (j in inputs) {
                var input = inputs[j];
                nounScore = Math.max(nounScore, checkAnswer(noun, input));
            }
            score += nounScore;
        }

        return score;
    }

    exports.calculateExamScore = function (exam) {

        var now = new Date();

        // ------------------
        // Time

        var yearExpected = dateformat(now, "yyyy");
        var yearInput = exam.time.year;
        var yearResult = checkAnswer(yearExpected, yearInput, true);

        var monthExpected = dateformat(now, "mmmm");
        var monthInput = exam.time.month;
        var monthResult = checkAnswer(monthExpected, monthInput, true);

        var dayExpected = dateformat(now, "dddd");
        var dayInput = exam.time.day;
        var dayResult = checkAnswer(dayExpected, dayInput, true);

        var seasonExpected = getSeason(now);
        var seasonInput = exam.time.season;
        var seasonResult = checkAnswer(seasonExpected, seasonInput, true);

        // ------------------
        // Place

        var countryExpected = config.country;
        var countryInput = exam.place.country;
        var countryResult = checkAnswer(countryExpected, countryInput);

        var cityExpected = config.city;
        var cityInput = exam.place.city;
        var cityResult = checkAnswer(cityExpected, cityInput);

        var floorExpected = config.floor;
        var floorInput = exam.place.floor;
        var floorResult = checkAnswer(floorExpected, floorInput);

        // ------------------
        // Nouns

        var nounsExpected = exam.noun.source;
        var nounsInput = exam.noun.inputs;
        var nounsResult = checkNouns(nounsExpected, nounsInput);

        // ------------------
        // Visual Nouns

        var visnounsExpected = exam.visnoun.map(function (item) {
            return item.noun;
        });
        var visnounsInput = exam.visnoun.map(function (item) {
            return item.input;
        });
        var visnounsResult = checkNouns(visnounsExpected, visnounsInput);

        // ------------------
        // Clock

        var clockExpected = config.clockSentence;
        var clockInput = exam.clock.sentence;
        var clockResult = checkAnswer(clockExpected, clockInput);

        var analogClockHours = exam.clock.analog.source.hours;
        var analogClockMinutes = exam.clock.analog.source.minutes;
        var analogExpected = analogClockHours + ':' + analogClockMinutes;
        var analogInput = exam.clock.analog.input;
        var analogResult = checkAnswer(analogExpected, analogInput);


        // ------------------
        // Subtractions

        var calc1Result = exam.calc1 == (100 - 7) ? 1 : 0;
        var calc2Result = exam.calc2 == (exam.calc1 - 7) ? 1 : 0;
        var calc3Result = exam.calc3 == (exam.calc2 - 7) ? 1 : 0;
        var calc4Result = exam.calc4 == (exam.calc3 - 7) ? 1 : 0;
        var calc5Result = exam.calc5 == (exam.calc4 - 7) ? 1 : 0;

        exam.expected = {
            year:  yearExpected,
            month:  monthExpected,
            day:  dayExpected,
            season:  seasonExpected,
            country:  countryExpected,
            city:  cityExpected,
            floor:  floorExpected,
            nouns:  nounsExpected,
            visnouns:  visnounsExpected,
            clock:  clockExpected,
            analog:  analogExpected,
            calc1:  (100 - 7),
            calc2:  (100 - 7*2),
            calc3:  (100 - 7*3),
            calc4:  (100 - 7*4),
            calc5:  (100 - 7*5)
        };

        var score = {
            year: yearResult,
            month: monthResult,
            day: dayResult,
            season: seasonResult,
            country: countryResult,
            city: cityResult,
            floor: floorResult,
            nouns: nounsResult,
            visnouns: visnounsResult,
            clock: clockResult,
            analog: analogResult,
            calc1: calc1Result,
            calc2: calc2Result,
            calc3: calc3Result,
            calc4: calc4Result,
            calc5: calc5Result
        };

        var total = 0;
        for (var key in score) {
            total += score[key];
        }

        var maxPoints = 20;
        score.total = (total / maxPoints) * 100;

        return score;
    };

})();

