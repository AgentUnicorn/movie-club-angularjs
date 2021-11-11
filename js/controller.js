//SET API KEY INTO ROOT SCOPE
app.controller("rootCtrl", function($scope, $rootScope, $http, $sce) {
    $rootScope.API_KEY = 'f752f095c87a67b8ca8b17c5e3810382';

    //Hàm merge 2 array object dựa theo 2 key khác nhau có cùng value 
    $rootScope.merged = function(array, mergedArray) {
        let result = [];
        for(let i=0; i<array.length; i++) {
            result.push({
                ...array[i], 
                ...(mergedArray.find((itm) => itm.iso_639_1 === array[i].original_language))
            });
        }
        return result;
    }

    $rootScope.openModal = async function(videoId, videoName) {
        let url = `https://api.themoviedb.org/3/movie/${videoId}/videos?api_key=${$rootScope.API_KEY}&language=en-US`
        $scope.video = [];
        $scope.videoYTid = '';
        await $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            $scope.video = response.data.results;
            if($scope.video[0] === undefined) {
                $.sweetModal({
                    content: 'Video cannot be found',
                    width: '50%',
                    icon: $.sweetModal.ICON_WARNING,
                    theme: $.sweetModal.THEME_DARK
                });
            } else {
                let videoYTid = $scope.video[0].key;
                var embedUrl = `https://www.youtube.com/embed/${videoYTid}?autoplay=1`;
                var trustUrl = $sce.trustAsResourceUrl(embedUrl);
                $.sweetModal({
                    title: videoName,
                    width: '50%',
                    content: `<iframe width="100%" height="500" src="${trustUrl}" title="${videoName}" frameborder="0" allowfullscreen></iframe>
                    `,
                    theme: $.sweetModal.THEME_DARK
                });
            }
        }, function errorCallback(error) {
            if(error.status == 404) {
                $.sweetModal({
                    content: 'Video cannot be found',
                    width: '50%',
                    icon: $.sweetModal.ICON_WARNING,
                    theme: $.sweetModal.THEME_DARK
                });
            }
        })
    }

    $rootScope.topFunc = function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
})


