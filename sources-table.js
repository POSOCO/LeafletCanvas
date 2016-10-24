angular.module('voltageSortApp', ['angularUtils.directives.dirPagination'])

    .controller('voltageSortController', function ($scope) {
        $scope.sortType = 'puVoltage'; // set the default sort type
        $scope.sortReverse = true;  // set the default sort order
        $scope.searchLine = '';     // set the default search/filter term
        $scope.sources = [];

        $scope.updateSources = function (sourcesArray) {
            $scope.sources = [];
            for (var i = 0; i < sourcesArray.length; i++) {
                var source = sourcesArray[i];
                if (source[6] != "OK") {
                    continue;
                }
                $scope.sources.push({
                    sNo: i + 1,
                    name: source[5],
                    puVoltage: Math.round(source[2] * 100) / 100,
                    voltage: Math.round(source[2] * source[4] * 100) / 100
                });
            }
            $scope.$apply();
        };

        //set page size
        $scope.pageSize = 12;
    });