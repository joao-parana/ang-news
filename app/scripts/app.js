'use strict';

/* global app:true */
 
angular
  .module('angNewsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'firebase'
  ]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
      .when('/posts/:postId', {
        templateUrl: 'views/showpost.html',
        controller: 'PostViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

var app = angular.module('angNewsApp');
app.constant('FIREBASE_URL',
    'https://luminous-fire-6652.firebaseio.com/');

