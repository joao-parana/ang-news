'use strict';

/* global app:true */

angular
  .module('angNewsApp', [ 'ngCookies', 'ngResource', 'ngSanitize',
    'ngRoute', 'firebase' ]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
      .when('/posts/:postId', {
        templateUrl: 'views/showpost.html',
        controller: 'PostViewCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl'
      })
      .when('/users/:username', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/projects/list', {
        controller:'ProjectListCtrl',
        templateUrl:'views/project-list.html'
      })
      .when('/projects/:projectId', {
        controller:'ProjectEditCtrl',
        templateUrl:'views/project-detail.html'
      })
      .when('/project/new', {
        controller:'ProjectCreateCtrl',
        templateUrl:'views/project-detail.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

var app = angular.module('angNewsApp');
app.constant('FIREBASE_URL',
    'https://luminous-fire-6652.firebaseio.com/');

app.factory('Projects', function($firebase, FIREBASE_URL) {
  return $firebase(new Firebase(FIREBASE_URL));
});

app.controller('ProjectListCtrl', function($scope, Projects) {
  $scope.projects = Projects;
});

app.controller('ProjectCreateCtrl', function($scope, $location, $timeout, Projects) {
  $scope.save = function() {
    Projects.$add($scope.project, function() {
      $timeout( function() { $location.path('/'); } );
    });
  };
});

app.controller('ProjectEditCtrl',
  function($scope, $location, $routeParams, $firebase, FIREBASE_URL) {
    var projectUrl = FIREBASE_URL + $routeParams.projectId;
    $scope.project = $firebase(new Firebase(projectUrl));

    $scope.destroy = function() {
      $scope.project.$remove();
      $location.path('/');
    };

    $scope.save = function() {
      $scope.project.$save();
      $location.path('/');
    };
  });
