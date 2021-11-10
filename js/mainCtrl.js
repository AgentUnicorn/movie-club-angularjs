//SET API KEY INTO ROOT SCOPE
// app.controller("rootCtrl", ($scope, $rootScope) => {
//     $rootScope.API_KEY = 'f752f095c87a67b8ca8b17c5e3810382';
// })

// GET ALL TRENDING MOVIES 
app.controller("mainCtrl", function ($scope, $http, $rootScope, $filter, $sce) {
    var page = 1;
    $scope.movies = [];
    $scope.shortLang = [];
    $scope.langArray = [];
    var isMerged = false;
    var url = `https://api.themoviedb.org/3/trending/all/day?api_key=${$rootScope.API_KEY}&page=${page}`;
    // var url = `https://api.themoviedb.org/3/discover/movie?api_key=${$rootScope.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
    // var urlDiscover = `https://api.themoviedb.org/3/discover/movie?api_key=${$rootScope.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
    $http({
        method: 'GET',
        url: url
    }).then(function successCallback(response) {
        $scope.movies = response.data.results;
        $scope.pageCount = Math.ceil($scope.movies.length/$scope.pageSize);

        //Lọc ra 1 mảng chứa tất cả ngôn ngữ từ data mà server trả về
        let test = [...$scope.movies];
        let result = test.map(a => a.original_language);
        $scope.shortLang = [...new Set(result)];
        // end

    }, function errorCallback(response) {
        console.log("error")
    })

    //Hàm merge 2 array object dựa theo 2 key khác nhau có cùng value 
    function merged(array, mergedArray) {
        let result = [];
        for(let i=0; i<array.length; i++) {
            result.push({
                ...array[i], 
                ...(mergedArray.find((itm) => itm.original_language === array[i].iso_639_1))
            });
        }
        return result;
    }

    $http({
        method: 'GET',
        url: `https://api.themoviedb.org/3/configuration/languages?api_key=${$rootScope.API_KEY}`
    }).then(function successCallback(response) {
        //Lấy về 1 mảng chứa tất cả ngôn ngừ từ database
        $scope.langArray = response.data;
        //So sánh với mảng shortLang để lấy ra các object chứa thông tin của ngôn ngữ
        $scope.currentLanguages = $scope.shortLang.map(item => $scope.langArray.find(lang => lang.iso_639_1 == item))
        //Merge mảng chính với mảng chứa thông tin ngôn ngữ
        $scope.finalArr = merged($scope.movies,$scope.currentLanguages);
        $scope.moviesArr = $scope.finalArr;
    }, function errorCallback(response) {
        console.log("error")
    });

    $scope.medias = ['movie', 'tv'];

    // FILTER BY MEDIA TYPE
    $scope.filterValueMedia = '';
    $scope.filterValueLanguage = '';
    $scope.filterValueMonth = '';

    // $scope.status = true;
    // $scope.removeDisabled = function() {
    //     $scope.status = false;
    //     console.log($scope.status);
    // }

    // GET VALUE FROM SELECT THEN START FILTER
    $scope.filterMedia = function() {
        if($scope.valueMedia) {
            $scope.filterValueMedia = $scope.valueMedia;
        }
        // go back to page 1
        $scope.first();
    }

    $scope.filterLanguage = function() {
        if($scope.valueLanguage) {
            $scope.filterValueLanguage = $scope.valueLanguage;
        }
        // go back to page 1
        $scope.first();
    }

    $scope.filterMonth = function () {
        if($scope.valueMonth || $scope.valueMonth != '') {
            $scope.filterValueMonth = $scope.valueMonth;
            if($scope.valueMonth < 10) {
                $scope.filterValueMonth = '0'+$scope.valueMonth;
            }
            $scope.testFunc = function() {
                $scope.result = $filter('FilterByMonth')($scope.finalArr, $scope.filterValueMonth);
                return $scope.result;
            }
            $scope.moviesArr = $scope.testFunc();
        }
        // go back to page 1
        $scope.first();
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
        }
    }

    // RESET THE moviesArr back to default, delete all value got from above
    $scope.reset = function() {
        //delete media 
        if(angular.isDefined($scope.valueMedia)){
            delete $scope.valueMedia;
        }
        if(angular.isDefined($scope.filterValueMedia)){
            delete $scope.filterValueMedia;
        }

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
        isMerged = false;
        $scope.moviesArr = $scope.finalArr;
        $scope.first();
    }

    // PAGINATION 
    $scope.startIndex = 0;
    $scope.pageSize = 4;
    $scope.currentPage = 1;

    $scope.first = function () {
        $scope.startIndex = 0;
        $scope.currentPage = 1;
    }

    $scope.previous = function() {
        if($scope.startIndex > 0) {
            $scope.startIndex -= $scope.pageSize;
            $scope.currentPage--;
        }
    }

    $scope.next = function() {
        if($scope.startIndex < ($scope.pageCount-1)*$scope.pageSize) {
            $scope.startIndex += $scope.pageSize;
            $scope.currentPage++;
        }   
    }

    $scope.last = function() {
        $scope.startIndex = ($scope.pageCount-1)*$scope.pageSize;
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
        $scope.startIndex = ($scope.pageSize*pageNum) - $scope.pageSize;
        $scope.currentPage = pageNum;
    }

    // $scope.topScroll = true;
    // var checkTop = function() {
    //     if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 0) {
    //         $scope.topScroll = false;
    //         console.log($scope.topScroll);
    //     } else {
    //         $scope.topScroll = true;
    //     }
    // }
    // window.onscroll = function() {checkTop()};

    $scope.topFunc = function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    $scope.openModal = function(videoId, videoName) {
        let url = `https://api.themoviedb.org/3/movie/${videoId}/videos?api_key=${$rootScope.API_KEY}&language=en-US`
        $scope.video = [];
        $scope.videoYTid = '';
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            $scope.video = response.data.results;
            if($scope.video[0] === undefined) {
                $.sweetModal({
                    content: 'Video cannot be found',
                    width: '100%',
                    icon: $.sweetModal.ICON_WARNING,
                    theme: $.sweetModal.THEME_DARK
                });
            } else {
                let videoYTid = $scope.video[0].key;
                var embedUrl = `https://www.youtube.com/embed/${videoYTid}?autoplay=1`;
                var trustUrl = $sce.trustAsResourceUrl(embedUrl);
                $.sweetModal({
                    title: videoName,
                    width: '100%',
                    content: `<iframe width="100%" height="500" src="${trustUrl}" title="${videoName}" frameborder="0" allowfullscreen></iframe>
                    `,
                    theme: $.sweetModal.THEME_DARK
                });
            }
        }, function errorCallback(error) {
            if(error.status == 404) {
                $.sweetModal({
                    content: 'Video cannot be found',
                    width: '100%',
                    icon: $.sweetModal.ICON_WARNING,
                    theme: $.sweetModal.THEME_DARK
                });
            }
        })
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