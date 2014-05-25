
'use strict';
 
app.controller('AuthCtrl',
  function ($scope, $location, Auth) {
    if (Auth.signedIn()) {
      // console.log(Auth);
      $location.path('/');
    }
 
    $scope.$on('$firebaseSimpleLogin:login', function () {
      console.log(Auth.signedIn?'someone is logged':'');
      $location.path('/');
    });
 
    $scope.login = function () {
      Auth.login($scope.user).then(function () {
        // console.log($scope.user);
        $location.path('/');
      });
    };
    
    $scope.register = function () {
      Auth.register($scope.user).then(function (authUser) {
        console.log(authUser);
        $location.path('/');
      });
    };
  });

