'use strict';
 
app.controller('NavCtrl', function ($scope, $location, Post, Auth) {
    $scope.post = { url: 'http://', title: '' };
 
    $scope.submitPost = function () {
      // Post.create($scope.post).then(function (ref) {
      // The promise finished then you can change the location
      Post.create($scope.post).then(function (postId) {
        // // $location.path('/posts/' + ref.name());
        // console.log(ref.name());
        $scope.post = { url: 'http://', title: '' };
        $location.path('/posts/' + postId);
        // $location.path('/');
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
