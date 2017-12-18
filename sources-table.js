angular.module('voltageSortApp', ['angularUtils.directives.dirPagination'])

    .controller('voltageSortController', function ($scope) {
        $scope.sortType = 'puVoltage'; // set the default sort type
        $scope.sortReverse = true;  // set the default sort order
        $scope.searchLine = '';     // set the default search/filter term
        $scope.sources = [];
        $scope.updateSources = function (sourcesArray) {
            $scope.sources = [];
            for (var i = 0; i < sourcesArray.length; i++) {
                if (typeof specificSourcesIndices !== 'undefined' && specificSourcesIndices.indexOf(i) == -1) {
                    continue;
                }
                var source = sourcesArray[i];
                if ((source[6] != "OK" && source[6] != "GOOD") || source[2] == Infinity) {
                    continue;
                }
                $scope.sources.push({
                    sNo: i + 1,
                    name: source[5].substring(0, source[5].indexOf(",")),
                    puVoltage: Math.round(source[2] * 100) / 100,
                    voltage: Math.round(source[2] * source[4] * 100) / 100,
                    brIn: source[7],
                    brOut: source[8]
                });
            }
            $scope.$apply();
        };

        $scope.openMarkerPopup = function (sourceIndex) {
            var temp = sourceIndex;
            if (typeof specificSourcesIndices != 'undefined' && specificSourcesIndices.indexOf(sourceIndex) != -1) {
                temp = specificSourcesIndices.indexOf(sourceIndex);
            }
            markers[temp].openPopup();
        };

        //set page size
        $scope.pageSize = 20;
    });