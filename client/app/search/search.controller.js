var app = angular.module('webApp');

app.controller('SearchController', ['$scope', '$http', '$$Scenes', '$uibModal', '$timeout', '$Users', '$Recommend',
    function($scope, $http, $$Scenes, $uibModal, $timeout, $Users, $Recommend) {

    $scope.global_menu = 'search';
    $scope.scenes = $$Scenes;
    $scope.pages      = [];

    $scope.recommendAdd = function(item) {
        $Recommend.add(item._id)
        .success(function (data) {
            if (data.ok === 1) {
                item.itemRecommendCounter.count += 1;
                $scope.pop = {
                    show : true,
                    message : '推薦店舗を追加しました。'
                }
            }
        });
    };

    $scope.modPop = function() {
        $timeout(function() {
            if ($scope.pop.show) {
              $scope.pop.show =false;
            } else {
                scope.modPop();
            }
        },3000);
    }

    $scope.getItem = function() {

        var data = {};
        if ($scope.word) data.name = $scope.word;
        if ($scope.sceneName) data.sceneNames   = $scope.sceneName;
        if ($scope.genreName) data.genreName   = $scope.genreName;
        if ($scope.area) data.area   = $scope.area;

        $http.post('/api/items/find', JSON.stringify(data))
        .success((data) => {
            $scope.items = data;
            $scope.getComments();

            $scope.currentPage = 1;
            $scope.pages       = [];
            for(var i = Math.ceil(data.length/10) + 1;--i;) {
                $scope.pages.unshift(i);
            }
        });
    };

    $scope.getComments = function() {

        var data = {};
        data.item = _.pluck($scope.items, '_id');

        $http.post('/api/comments/find', JSON.stringify(data))
        .success((data) => {

            // 店舗IDリスト作成
            var item_ids = _.pluck($scope.items, '_id');

            var item_comments = [];

            // 店舗毎にコメントを操作
            for (var i in item_ids) {

                var comments = _.filter(data, (num) => {
                    return num.item._id === item_ids[i];
                });

                // 最新コメント情報作成
                var comment = comments[0];

                // 行きたいコメントに絞り込み①
                comments = _.filter(comments, (num) => {
                    return num.type === true;
                });

                // ジャンルポイント平均作成
                var genreAvelist = _.pluck(comments, 'genreAve');
                var genreAveSum = _.reduce(genreAvelist, (memo, num) => {
                     return memo + num;
                }, 0);
                var genreAve = genreAveSum < 1 ? 0 : genreAveSum / genreAvelist.length;

                // シーンポイント平均作成
                var sceneAvelist = _.pluck(comments, 'sceneAve');
                var sceneAveSum = _.reduce(sceneAvelist, (memo, num) => {
                     return memo + num;
                }, 0);
                var sceneAve = sceneAveSum < 1 ? 0 : sceneAveSum / sceneAvelist.length;

                item_comments[item_ids[i]] = {comment, genreAve, sceneAve };

            }

            $scope.item_comments = item_comments;

            $scope.show_loading = false;
        });
    };

    $scope.findAddScene = function(value) {
        $scope.scene = ($scope.scene == value) ? null : value;
        $scope.getItem();
    };

    // ページャー処理
    $scope.$watch('currentPage', function(newValue, oldValue) {
        if (!newValue) {
            $scope.currentPage = 1;
        } else if (newValue != 1 && newValue > $scope.pages.length) {
            $scope.currentPage = $scope.pages.length;
        } else if(oldValue){
            scope.getComments();
        }
    });

    $scope.$watch('word', function(newValue, oldValue) {
        if (!newValue && !oldValue) return;
        $scope.getItem();
    });

    $scope.$watch('pop', function(newValue, oldValue) {
        if (newValue) {
            $scope.modPop();
        }
    });

    $scope.getItem();

}]);
