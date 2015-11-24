var app = angular.module('webApp');

app.controller('MainController', ['$scope', '$http', '$$Scenes', '$$Genres', '$ModalService', function($scope, $http, $$Scenes, $$Genres, $ModalService) {

    $scope.mainPage = true;
    $scope.pages = [];

    $scope.scenelists = $$Scenes;
    $scope.genrelists = $$Genres;

    $scope.getItem = function() {

        var data = {};
        if ($scope.word) data.itemName = $scope.word;
        if ($scope.scene) data.scene = $scope.scene;
        if ($scope.genre) data.genre = $scope.genre;
        if ($scope.scene) data.scene = $scope.scene;

        $http.post('/api/items/find', JSON.stringify(data))
        .success(function(data) {
            $scope.items = data;
            $scope.getComments();

            $scope.currentPage = 1;
            $scope.pages = [];
            for(var i = Math.ceil(data.length/10) + 1;--i;) {
                $scope.pages.unshift(i);
            }

        });
    };

    $scope.getComments = function() {
        $http.get('/api/itemComments')
        .success(function(data) {
            $scope.item_comments = data;
        });
    };

    $scope.$watch('item_comments', function(newValue, oldValue) {
        if (!newValue) return;
        $scope.show_loading = false;
    });

    // ページャー処理
    $scope.$watch('currentPage', function(newValue, oldValue) {
        if (!newValue) {
            $scope.currentPage = 1;
        } else if (newValue != 1 && newValue > $scope.pages.length) {
            $scope.currentPage = $scope.pages.length;
        } else {
            $scope.getComments();
        }
    });

    // 検索
    $scope.$watch('area', function(newValue, oldValue) {
        if (!newValue) return;
        $scope.getItem();
    });

    $scope.$watch('scene', function(newValue, oldValue) {
        if (!newValue) return;
        $scope.getItem();
    });

    $scope.$watch('genre', function(newValue, oldValue) {
        if (!newValue) return;
        $scope.getItem();
    });

    $scope.$watch('word', function(newValue, oldValue) {

        if (!newValue && !oldValue) return;
        $scope.getItem();
    });

    $scope.getItem();


// ------------------------------- Modal ------------------------------ //
    $scope.showModal = function() {

        var modalOption = {
            title: 'やまっち',
            titleEng: 'yamacchi',
            modalUrl: './components/modal/modal.wantGo.html',
            scope: $scope
        };

        $ModalService.open(modalOption);
    };

}]);