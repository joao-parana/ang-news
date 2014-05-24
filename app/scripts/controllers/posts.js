'use strict';
 
//app.controller('PostsCtrl', function($scope, Post) {
//  $scope.posts = Post.get();
//  // $scope.post = { url: 'http://...', title: '' };
//
//  $scope.submitPost = function () {
//      // antes era apenas um array -> $scope.posts.push($scope.post);
//      Post.save($scope.post);
//      // save é assincrono então comento a linha abaixo e levo pro método save
//      // $scope.post = { url: 'http://...', title: '' };
//    };
//
//  $scope.deletePost = function (postId) {
//    Post.delete({id: postId}, function () {
//      delete $scope.posts[postId];
//    });
//  };
//
//  Post.save($scope.post, function (ref) {
//    $scope.posts[ref.name] = $scope.post;
//    // $scope.post = { url: 'http://', title: '' };
//  });
//});



// app.controller('PostsCtrl', function ($scope, Post) {
app.controller('PostsCtrl', function ($scope, $location, Post) {
  $scope.posts = Post.all;
 
  // $scope.post = {url: 'http://', 'title': ''};
  $scope.post = { url: 'http://' };
 
  $scope.submitPost = function () {
    // Post.create($scope.post).then(function () {
    Post.create($scope.post).then(function (ref) {
      // $scope.post = {url: 'http://', 'title': ''};
      $location.path('/posts/' + ref.name());
    });
  };
 
  $scope.deletePost = function (postId) {
    Post.delete(postId);
  };
 
});

