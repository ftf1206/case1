var app = angular.module('webApp');

app.directive('cocoHeader', function() {
    return {
        templateUrl: './components/header/header.html',
        restrict: 'E'
    };
});
app.directive('cocoMainHeader', function() {
    return {
        templateUrl: './components/header/mainHeader.html',
        restrict: 'E'
    };
});
