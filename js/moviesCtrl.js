//SET API KEY INTO ROOT SCOPE
// app.controller("rootCtrl", ($scope, $rootScope) => {
//     $rootScope.API_KEY = 'f752f095c87a67b8ca8b17c5e3810382';
// })

// GET ALL TRENDING MOVIES 
app.controller("moviesCtrl", function ($scope, $http, $rootScope, $filter) {
    var page = 1;
    $scope.movies = [];
    var url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${$rootScope.API_KEY}&page=${page}`;
    $http({
        method: 'GET',
        url: url
    }).then(function successCallback(response) {
        $scope.movies = response.data.results;
        $scope.pageCount = Math.ceil($scope.movies.length/$scope.pageSize);
        console.log($scope.movies)
        $scope.moviesArr = $scope.movies;
    }).then(function errorCallback(response) {
        console.log("error")
    })

    $scope.medias = ['movie', 'tv'];
    $scope.languages = ['en','ko'];
    $scope.years = ['2021', '2018'];

    // FILTER BY MEDIA TYPE
    $scope.filterValueLanguage = '';
    $scope.filterValueMonth = '';

    // $scope.status = true;
    // $scope.removeDisabled = function() {
    //     $scope.status = false;
    //     console.log($scope.status);
    // }

    // GET VALUE FROM SELECT THEN START FILTER
    $scope.filterLanguage = function() {
        if($scope.valueLanguage) {
            $scope.filterValueLanguage = $scope.valueLanguage;
        }
    }

    $scope.filterMonth = function () {
        if($scope.valueMonth || $scope.valueMonth != '') {
            $scope.filterValueMonth = $scope.valueMonth;
            if($scope.valueMonth < 10) {
                $scope.filterValueMonth = '0'+$scope.valueMonth;
            }
            $scope.testFunc = function() {
                $scope.result = $filter('FilterByMonth')($scope.movies, $scope.filterValueMonth);
                return $scope.result;
            }
            $scope.moviesArr = $scope.testFunc();
        }
    }

    // GET VALUE FROM BUTTON THEN START SORT
    $scope.sortValue = 'name';
    $scope.desc = false;
    $scope.order = function(str) {
        if($scope.desc) {
            $scope.sortValue = '-'+str;
            $scope.desc = false;
        } else {
            $scope.sortValue = str;
            $scope.desc = true;
        }
    }

    // GET VALUE FROM SEARCH BAR THEN FILTER
    $scope.filterInput = function() {
        //Check if search bar is empty and userInputValue is defined 
        // incase user delete all input
        if(angular.isDefined($scope.userInputValue) && $scope.searchInput.length == 0){
            delete $scope.userInputValue;
        } else {
            $scope.userInputValue = $scope.searchInput;
            console.log($scope.searchInput);
        }
    }

    // RESET THE moviesArr back to default, delete all value got from above
    $scope.reset = function() {
        //delete language 
        if(angular.isDefined($scope.valueLanguage)){
            delete $scope.valueLanguage;
        }
        if(angular.isDefined($scope.filterValueLanguage)){
            delete $scope.filterValueLanguage;
        }

        //delete month
        if(angular.isDefined($scope.valueMonth)){
            delete $scope.valueMonth;
        }
        if(angular.isDefined($scope.filterValueMonth)){
            delete $scope.filterValueMonth;
        }

        //delete searchbar
        if(angular.isDefined($scope.userInputValue)){
            delete $scope.userInputValue;
        }
        if(angular.isDefined($scope.searchInput)){
            delete $scope.searchInput;
        }

        $scope.moviesArr = $scope.movies;
    }

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for(var i = min; i<=max; i+=step) {
            input.push(i);
        }
        return input;
    }


})

app.filter('FilterByMonth', function () {
    return function (items, month) {
        var filtered = [];
        for(var i = 0; i < items.length; i++) {
            var item = items[i];

            if(item.release_date) {
                var monthArr = item.release_date.split("-");
                var monthValue = monthArr[monthArr.length-2];
            } else {
                var monthArr = item.first_air_date.split("-");
                var monthValue = monthArr[monthArr.length-2];
            }

            if(monthValue == month) {
                filtered.push(item);
            }
        }
        return filtered;
    }
})