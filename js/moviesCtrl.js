// GET ALL TRENDING MOVIES 
app.controller("moviesCtrl", function ($scope, $http, $rootScope, $filter, $sce) {
    $scope.currentPage = 1;
    var page = 1;
    $scope.movies = [];
    $scope.shortLang = [];
    $scope.langArray = [];
    // var url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${$rootScope.API_KEY}&page=`;
    var url = `https://api.themoviedb.org/3/discover/movie?api_key=${$rootScope.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&page=`;
    async function getMovies() {
        await $http({
            method: 'GET',
            url: url+page
        }).then(function successCallback(response) {
            $scope.movies = response.data.results;
            //Lọc ra 1 mảng chứa tất cả ngôn ngữ từ data mà server trả về
            let test = [...$scope.movies];
            let result = test.map(a => a.original_language);
            $scope.shortLang = [...new Set(result)];
            // end

        }, function errorCallback(response) {
            $.sweetModal({
                content: 'Cannot fetch data',
                width: '100%',
                icon: $.sweetModal.ICON_WARNING,
                theme: $.sweetModal.THEME_DARK
            });
        });
    }
    getMovies();
    
    async function getLangArr(mergedArray) {
        await $http({
            method: 'GET',
            url: `https://api.themoviedb.org/3/configuration/languages?api_key=${$rootScope.API_KEY}`
        }).then(function successCallback(response) {
            //Lấy về 1 mảng chứa tất cả ngôn ngừ từ database
            $scope.langArray = response.data;
            //So sánh với mảng shortLang để lấy ra các object chứa thông tin của ngôn ngữ
            $scope.currentLanguages = $scope.shortLang.map(item => $scope.langArray.find(lang => lang.iso_639_1 == item))
            //Merge mảng chính với mảng chứa thông tin ngôn ngữ
            if(mergedArray) {
                $scope.finalArr = $rootScope.merged(mergedArray,$scope.currentLanguages);
                $scope.moviesArr = $scope.finalArr;
            } else {
                $scope.finalArr = $rootScope.merged($scope.movies,$scope.currentLanguages);
                $scope.moviesArr = $scope.finalArr;
            }
        }, function errorCallback(response) {
            $.sweetModal({
                content: 'Cannot fetch data',
                width: '100%',
                icon: $.sweetModal.ICON_WARNING,
                theme: $.sweetModal.THEME_DARK
            });
        });
    }
    getLangArr();

    $scope.userInputValue = [];
    $scope.search = false;
    function searchMovies(queryInput, page) {
        console.log(page)
        var url = `https://api.themoviedb.org/3/search/movie?api_key=${$rootScope.API_KEY}&query=${queryInput}&page=${page}`
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            $scope.userInputValue = response.data.results;

            //Lọc ra 1 mảng chứa tất cả ngôn ngữ từ data mà server trả về
            let test = [...$scope.userInputValue];
            let result = test.map(a => a.original_language);
            $scope.shortLang = [...new Set(result)];
            console.log($scope.shortLang);
            // end

        }, function errorCallback(response) {
            $.sweetModal({
                content: 'Cannot fetch data',
                width: '100%',
                icon: $.sweetModal.ICON_WARNING,
                theme: $.sweetModal.THEME_DARK
            });
        });
    }
    
    $scope.medias = ['movie', 'tv'];

    // FILTER BY MEDIA TYPE
    $scope.filterValueLanguage = '';
    $scope.filterValueMonth = '';

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
                console.log($scope.moviesArr);
                $scope.result = $filter('FilterByMonth')($scope.moviesArr, $scope.filterValueMonth);
                console.log($scope.result);
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
            $scope.search = false;
            page = 1;
            $scope.currentPage = 1;
            getMovies();
            getLangArr();
        } else {
            $scope.search = true;
            searchMovies($scope.searchInput, page);
            getLangArr($scope.userInputValue);
            // $scope.moviesArr = $scope.userInputValue;
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
            $scope.search = false;
            page = 1;
            $scope.currentPage = 1;
            getMovies();
            getLangArr()
        }
        if(angular.isDefined($scope.searchInput)){
            delete $scope.searchInput;
        }
        //reset order 
        $scope.sortValue = 'name';

        //back to page 1 and update 
        page = 1;
        $scope.currentPage = 1;
        getMovies();
        getLangArr();
        $scope.moviesArr = $scope.finalArr;
    }

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for(var i = min; i<=max; i+=step) {
            input.push(i);
        }
        return input;
    }

    //PAGINATION (WITH API)
    $scope.fetchNextPage = function() {
        if($scope.search && $scope.searchInput.length != 0) {
            page++;
            $scope.currentPage++;
            searchMovies($scope.searchInput,page);
            getLangArr($scope.userInputValue);
            //Sau khi fetch page mới sẽ nhảy lên trên đầu trang
            $scope.topFunc();
        } else {
            page++;
            $scope.currentPage++;
            getMovies();
            getLangArr();
            //Sau khi fetch page mới sẽ nhảy lên trên đầu trang
            $scope.topFunc();
        }
    }

    $scope.fetchPreviousPage = function() {
        if(page > 1) {
            if($scope.search && $scope.searchInput.length != 0) {
                page--;
                $scope.currentPage--;
                searchMovies($scope.searchInput,page);
                getLangArr($scope.userInputValue);
                //Sau khi fetch page mới sẽ nhảy lên trên đầu trang
                $scope.topFunc();
            } else {
                page--;
                $scope.currentPage--;
                getMovies();
                getLangArr();
                //Sau khi fetch page mới sẽ nhảy lên trên đầu trang
                $scope.topFunc();
            }
        }
    }

})

app.filter('FilterByMonth', function () {
    return function (items, month) {
        console.log(items)
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