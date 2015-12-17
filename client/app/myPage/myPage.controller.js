var app = angular.module('webApp');

app.controller('MyPageController', ['$scope', '$http', '$uibModal', '$timeout', '$Users', '$Comments', 'Upload', '$Recommend', '$state', '$$Scenes',
    function($scope, $http, $uibModal, $timeout, $Users, $Comments, Upload, $Recommend, $state, $$Scenes) {
// ----------------------------------------------- $scope ----------------------------------------------------//

    $scope.global_menu = 'myPage';
    $scope.apiName     = 'users';
    $scope.pages       = [];
    $scope.type        = [
                            {label: '行きたい', type: false},
                            {label: '行った', type: true}
                        ];
    $scope.scenes = $$Scenes;

// ----------------------------------------------- RestfulAPI ------------------------------------------------//

    $scope.comments = $Comments.query();


    //データ更新
    $scope.updateAPI = (editData, scope) => {
        if(editData.updateFlg) {
            $Comments.update(
                editData,
                (data) => {
                    if(editData.type === true) {
                        $scope.pop = {
                            show : true,
                            message : '「行った」コメントを更新しました。'
                        };
                    } else {
                        $scope.pop = {
                            show : true,
                            message : '「行きたい」コメントを更新しました。'
                        };
                    }
                    $timeout(() => {

                        scope.comment.body = data.body;
                        modPop();
                        scope.$dismiss();
                    });
                }
            );

        } else if(editData.passwordFlg) {
            $http({
                method: 'POST',
                url: '/api/users/check',
                data: editData
            })
            .success(() => {
                $scope.pop = {
                    show : true,
                    message : 'パスワードを更新しました。'
                };
                modPop();
                scope.$dismiss();
            });
        } else {
            editData.updateFlg = true;
            $Users.update(
                editData,
                (data) => {
                    $scope.pop = {
                        show : true,
                        message : 'プロフィールを更新しました。'
                    };
                    $scope.$root.loginUser = data;
                    modPop();
                    scope.$dismiss();
                });
        }
    };

// ----------------------------------------------- $scope(function) --------------------------------------------//

    $scope.recommendAdd = function(item) {
        $Recommend.add(item)
        .success((data) => {
            if (data.ok === 1) {
                $scope.pop = {
                    show : true,
                    message : '推薦店舗を追加しました。'
                };
            }
        });
    };

    $scope.recommendDelete = function(item) {

        $Recommend.delete(item)
        .success((data) => {
            if (data.ok === 1) {
                $scope.pop = {
                    show : true,
                    message : '推薦店舗を削除しました。'
                };
                $scope.getRecommendItem();
            }
        });
    };

    $scope.saveUser = function () {
        if ($scope.files[0]) {
            Upload.upload({
                url: 'api/upload/user',
                file: $scope.files[0]
            })
            .success(() => {
                console.log('OK');
            });
        }
    };

    $scope.getRecommendItem = function() {

        var data = {};
        if ($scope.scene) data.scene   = $scope.scene;

        $http.post('/api/items/recommend_item', JSON.stringify(data))
        .success((data) => {

            $scope.items = data;
            getSumAve();

            $scope.currentPage = 1;
            $scope.pages       = [];
            for(var i = Math.ceil(data.length/10) + 1;--i;) {
                $scope.pages.unshift(i);
            }
        });
    };

    $scope.getWentComments = () => {
        $http.post('/api/comments/went')
        .success((data) => {
            $scope.went_comments = data;
            $scope.currentPage = 1;
            $scope.pages       = [];
            for(var i = Math.ceil(data.length/10) + 1;--i;) {
                $scope.pages.unshift(i);
            }
        });
    };

    $scope.getWantGoComments = () => {
        $http.post('/api/comments/wantGo')
        .success((data) => {
            $scope.wantgo_comments = data;
            $scope.currentPage = 1;
            $scope.pages       = [];
            for(var i = Math.ceil(data.length/10) + 1;--i;) {
                $scope.pages.unshift(i);
            }
        });
    };

    $scope.findAddArea = function(value) {
        $scope.area = ($scope.area == value) ? undefined : value;
    };

    $scope.findAddScene = function(value) {
        $scope.sceneName = ($scope.sceneName == value) ? undefined : value;
    };

    $scope.findAddGenre = function(value) {
        $scope.genreName = ($scope.genreName == value) ? undefined : value;
    };
// ----------------------------------------------- $watch ----------------------------------------------------//

    $scope.$watch('item_comments', (newValue) => {
        if (!newValue) return;
        $scope.show_loading = false;
    });

    // ページャー処理
    $scope.$watch('currentPage', (newValue) => {
        if (!newValue) {
            $scope.currentPage = 1;
        } else if (newValue != 1 && newValue > $scope.pages.length) {
            $scope.currentPage = $scope.pages.length;
        }
    });

    // 通知
    $scope.$watch('pop', (newValue) => {
        if (newValue) {
            modPop();
        }
    });

// ----------------------------------------------- LocalFunction -----------------------------------------------//

    const getSumAve = () =>  {

        var items = _.pluck($scope.items, '_id');
        $Comments.went_items(items)
        .success((data) => {

            // 店舗IDリスト作成
            var item_ids = _.pluck($scope.items, '_id');
            var sum_ave = [];

            // 店舗毎にコメントを操作
            for (var i in item_ids) {

                var comments = _.filter(data, (num) => {
                    return num.item._id === item_ids[i];
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

                sum_ave[item_ids[i]] = {genreAve, sceneAve };

            }

            $scope.sum_ave = sum_ave;
        });
    };

    const modPop = () =>  {
        $timeout(() => {
            if ($scope.pop.show) {
              $scope.pop.show =false;
            } else {
                modPop();
            }
        },3000);
    };

}]);
