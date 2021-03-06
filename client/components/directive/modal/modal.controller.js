angular.module('webApp')
    .controller('ModalController', ['$scope', 'Upload', '$uibModalInstance', '$http',
     function($scope, Upload, $uibModalInstance, $http) {

//--------------------- Kick -------------------- //
        //saveAPIをキック
        $scope.save = (newData) => {
            $scope.saveAPI(newData, $scope);
        };

        //updateAPIをキック
        $scope.update = (editData) => {
            $scope.updateAPI(editData, $scope);
        };

        //deleteAPIをキック
        $scope.delete = (data) => {
            $scope.deleteAPI(data, $scope);
        };


        $scope.checkPassword = (editData) => {
            $http({
                method: 'POST',
                data: editData,
                url : '/api/users/checkPassword'
            })
            .success((data) => {
                if(data.message === 'success') {
                    editData.passwordFlg = true;
                    editData.password = editData.newPassword;
                    $scope.updateAPI(editData, $scope);
                } else {
                    $scope.errors = {
                        message: '現在のパスワードに誤りがあります。'
                    };
                }
            });
        };

// ------------------- OtherFunction -------------------- //

         //キャンセルボタン
         $scope.cancel = function() {
             $uibModalInstance.dismiss();
         };

        $scope.$watch('files', (newValue, oldValue) => {

            if (oldValue) {
                for (var i in oldValue) {
                  $scope.files.push(oldValue[i]);
                }
            }

            if ($scope.files && $scope.files.length > 5) {
                $scope.files.splice(0, $scope.files.length - 5);
            }
        });

        $scope.$watch('onefile', (newValue, oldValue) => {

            if (oldValue) {
                for (var i in oldValue) {
                  $scope.onefile.push(oldValue[i]);
                }
            }

            if ($scope.onefile && $scope.onefile.length > 1) {
                $scope.onefile.splice(0, $scope.onefile.length - 1);
            }
        });
}]);
