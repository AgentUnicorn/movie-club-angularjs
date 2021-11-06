var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/movies", {
            templateUrl: "views/movies.html",
            controller: "moviesCtrl"
        })
        .when("/product", {
            templateUrl: "views/product.html",
            // controller: "productCtrl"
        })
        .otherwise({
            templateUrl: "./views/main.html",
            controller: "mainCtrl"
        });  
})

//SET API KEY INTO ROOT SCOPE
app.controller("rootCtrl", function($scope, $rootScope) {
    $rootScope.API_KEY = 'f752f095c87a67b8ca8b17c5e3810382';
})


