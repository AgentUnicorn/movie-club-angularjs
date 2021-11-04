var app = angular.module("myApp", []);

//SET API KEY INTO ROOT SCOPE
app.controller("rootCtrl", ($scope, $rootScope) => {
    $rootScope.API_KEY = 'f752f095c87a67b8ca8b17c5e3810382';
})

// GET ALL TRENDING MOVIES 
app.controller("moviesCtrl", ($scope, $http, $rootScope) => {
    var page = 1;
    $scope.movies = [];
    var url = `https://api.themoviedb.org/3/trending/all/day?api_key=${$rootScope.API_KEY}&page=${page}`;
    $http({
        method: 'GET',
        url: url
    }).then(function successCallback(response) {
        $scope.movies = response.data.results;
        $scope.pageCount = Math.ceil($scope.movies.length/$scope.pageSize);
        console.log($scope.movies)
    }).then(function errorCallback(response) {
        console.log("error")
    })

    // FILTER BY MEDIA TYPE
    $scope.filterValueMedia = '';
    $scope.filterMedia = function(str) {
        $scope.filterValueMedia = str;
    }
    
    $scope.filterValueLanguage = '';
    $scope.filterLanguage = function(str) {
        $scope.filterValueLanguage = str;
    }
    
    // PAGINATION 
    $scope.startIndex = 0;
    $scope.pageSize = 4;
    $scope.currentPage = 1;

    $scope.first = function () {
        console.log($scope.startIndex);
        $scope.startIndex = 0;
        $scope.currentPage = 1;
    }

    $scope.previous = function() {
        console.log($scope.startIndex);
        if($scope.startIndex > 0) {
            $scope.startIndex -= $scope.pageSize;
            $scope.currentPage--;
        }
    }

    $scope.next = function() {
        console.log($scope.startIndex);
        if($scope.startIndex < ($scope.pageCount-1)*$scope.pageSize) {
            $scope.startIndex += $scope.pageSize;
            $scope.currentPage++;
        }   
    }

    $scope.last = function() {
        console.log($scope.startIndex);
        $scope.startIndex = ($scope.pageCount-1)*$scope.$pageSize;
        $scope.currentPage = $scope.pageCount ;
    }

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for(var i = min; i<=max; i+=step) {
            input.push(i);
        }
        return input;
    }

    $scope.goToPage = function(pageNum) {
        console.log(pageNum);
        $scope.startIndex = ($scope.pageSize*pageNum) - $scope.pageSize;
    }

    $scope.setMaster = function(section) {
        $scope.selected = section;
    }

    $scope.isSelected = function(section) {
        return $scope.selected === section;
    }
})