'use strict';
 
app.controller('NavCtrl', function ($scope, $location, Post, Auth) {
    $scope.post = { url: 'http://', title: '' };
 
    $scope.submitPost = function () {
      Post.create($scope.post).then(function (ref) {
        // $location.path('/posts/' + ref.name());
        console.log(ref.name());
        $location.path('/');
	      $scope.post = { url: 'http://', title: '' };
      });
    };
  
    $scope.logout = function () {
      console.log('logout invocado');
      Auth.logout();
    };
 
    $scope.getLoggedUser = function () {
      // console.log('getLoggedUser invocado for ' +
      //             Auth.getLoggedUserEMail());
      return Auth.getLoggedUserEMail();
    };
  });
