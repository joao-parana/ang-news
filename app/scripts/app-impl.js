
/* Arquivo: app/scripts/controllers/auth.js  */

'use strict';

app.controller('AuthCtrl', function($scope, $location, Auth, User) {
  if (Auth.signedIn()) {
    // console.log(Auth);
    $location.path('/');
  }

  $scope.$on('$firebaseSimpleLogin:login', function() {
    console.log(Auth.signedIn ? 'someone is logged' : '');
    $location.path('/');
  });

  $scope.login = function() {
    Auth.login($scope.user).then(function() {
      // console.log($scope.user);
      $location.path('/');
    }, function(error) {
      $scope.error = error.toString();
    });
  };

  $scope.register = function() {
    Auth.register($scope.user).then(function(authUser) {
      console.log(authUser);
      User.create(authUser, $scope.user.username);
      $location.path('/');
    }, function(error) {
      $scope.error = error.toString();
    });
  };
});


/* Arquivo: app/scripts/controllers/nav.js  */

'use strict';

app.controller('NavCtrl', function($scope, $location, Post, Auth) {
  $scope.post = {
    url: 'http://',
    title: ''
  };

  $scope.submitPost = function() {
    // Post.create($scope.post).then(function (ref) {
    // The promise finished then you can change the location
    Post.create($scope.post).then(function(postId) {
      // // $location.path('/posts/' + ref.name());
      // console.log(ref.name());
      $scope.post = {
        url: 'http://',
        title: ''
      };
      $location.path('/posts/' + postId);
      // $location.path('/');
    });
  };

  $scope.logout = function() {
    console.log('logout invocado');
    Auth.logout();
  };

  $scope.getLoggedUser = function() {
    // console.log('getLoggedUser invocado for ' +
    //             Auth.getLoggedUserEMail());
    return Auth.getLoggedUserEMail();
  };
});

/* Arquivo: app/scripts/controllers/posts.js  */

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
app.controller('PostsCtrl', function($scope, $location, Post) {
  $scope.posts = Post.all;

  // $scope.post = {url: 'http://', 'title': ''};
  $scope.post = {
    url: 'http://'
  };

  // $scope.submitPost = function () {
  //  // Post.create($scope.post).then(function () {
  //  Post.create($scope.post).then(function (ref) {
  //    // $scope.post = {url: 'http://', 'title': ''};
  //    $location.path('/posts/' + ref.name());
  //  });
  // };

  $scope.deletePost = function(postId) {
    Post.delete(postId);
  };

});


/* Arquivo: app/scripts/controllers/postview.js  */

'use strict';

app.controller('PostViewCtrl', function($scope, $routeParams, Post) {

  $scope.post = Post.find($routeParams.postId);

  $scope.addComment = function() {
    Post.addComment($routeParams.postId, $scope.comment);
    $scope.comment = '';
  };

  $scope.removeComment = function(comment, commentId) {
    Post.deleteComment($scope.post, comment, commentId);
  };

});

/* Arquivo: app/scripts/filters/url.js  */


'use strict';

app.filter('hostnameFromUrl', function() {
  return function(str) {
    var url = document.createElement('a');

    url.href = str;

    return url.hostname;
  };
});


/* Arquivo: app/scripts/services/auth.js  */

'use strict';

app.factory('Auth', function($firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
  var ref = new Firebase(FIREBASE_URL);

  var auth = $firebaseSimpleLogin(ref);

  var Auth = {
    register: function(user) {
      return auth.$createUser(user.email, user.password);
    },
    signedIn: function() {
      // console.log(auth.user.email + ' logged in');
      return auth.user !== null;
    },
    login: function(user) {
      console.log('' + user.email + ' is trying to login ' + 'using FirebaseSimpleLogin');
      return auth.$login('password', user);
    },
    logout: function() {
      var msg = 'logout do usuário ' + auth.user.email + ' realizado com sucesso !';
      auth.$getCurrentUser().then(function() {
        console.log(msg);
      });
      auth.$logout();
    },
    getLoggedUserEMail: function() {
      return '' + ((auth) ? ((auth.user) ? ((auth.user.email) ? auth.user.email : '') : '') : '');
    }
  };

  $rootScope.signedIn = function() {
    return Auth.signedIn();
  };

  return Auth;
});


/* Arquivo: app/scripts/services/post.js  */

'use strict';

// app.factory('Post', function ($resource) {
//   return $resource('https://luminous-fire-6652.firebaseIO.com/posts/:id.json');
// });

app.factory('Post', function($firebase, FIREBASE_URL, User) {
  var ref = new Firebase(FIREBASE_URL + 'posts');

  var posts = $firebase(ref);

  var Post = {
    all: posts,
    create: function(post) {
      if (User.signedIn()) {
        var user = User.getCurrent();

        post.owner = user.username;

        return posts.$add(post).then(function(ref) {
          var postId = ref.name();

          user.$child('posts').$child(postId).$set(postId);

          return postId;
        });
      }
    },
    find: function(postId) {
      return posts.$child(postId);
    },
    delete: function(postId) {
      // return posts.$remove(postId);
      if (User.signedIn()) {
        var post = Post.find(postId);

        post.$on('loaded', function() {
          var user = User.findByUsername(post.owner);

          posts.$remove(postId).then(function() {
            user.$child('posts').$remove(postId);
          });
        });
      }
    },
    addComment: function(postId, comment) {
      comment.username = 'anonymous';
      comment.postId = postId;

      posts.$child(postId).$child('comments').$add(comment).then(function(ref) {
        // user.$child('comments').$child(ref.name()).$set({id: ref.name(), postId: postId});
        console.log(ref.path.toString());
      });
    },
    deleteComment: function(post, comment, commentId) {
      var user = 'anonymous';

      post.$child('comments').$remove(commentId).then(function() {
        user.$child('comments').$remove(commentId);
      });
    }
  };

  return Post;
});

/* Arquivo: app/scripts/services/user.js  */

'use strict';

// app.factory('User', function ($firebase, FIREBASE_URL, Auth) {
app.factory('User', function($firebase, FIREBASE_URL, $rootScope) {
  var ref = new Firebase(FIREBASE_URL + 'users');

  var users = $firebase(ref);

  $rootScope.$on('$firebaseSimpleLogin:login', function(e, authUser) {
    var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));

    query.$on('loaded', function() {
      setCurrentUser(query.$getIndex()[0]);
    });
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    delete $rootScope.currentUser;
  });

  function setCurrentUser(username) {
    $rootScope.currentUser = User.findByUsername(username);
  }

  var User = {
    create: function(authUser, username) {
      /*jshint camelcase: false */
      users[username] = {
        md5_hash: authUser.md5_hash,
        username: username,
        $priority: authUser.uid
      };

      // Using a promise to setup the current user on
      // $rootScope when the user is sucessfully created
      users.$save(username).then(function() {
        setCurrentUser(username);
      });
    },
    findByUsername: function(username) {
      if (username) {
        return users.$child(username);
      }
    },
    getCurrent: function() {
      return $rootScope.currentUser;
    },
    signedIn: function() {
      return $rootScope.currentUser !== undefined;
    }
  };

  return User;
});



