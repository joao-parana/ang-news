'use strict';
 
app.factory('Auth',
  function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
    var ref = new Firebase(FIREBASE_URL);
 
    var auth = $firebaseSimpleLogin(ref);
 
    var Auth = {
      register: function (user) {
        return auth.$createUser(user.email, user.password);
      },
      signedIn: function () {
        // console.log(auth.user.email + ' logged in');
        return auth.user !== null;
      },
      login: function (user) {
        console.log('' + user.email + ' is trying to login ' +
                   'using FirebaseSimpleLogin');
        return auth.$login('password', user);
      },
      logout: function () {
        var msg = 'logout do usuário ' + auth.user.email +
            ' realizado com sucesso !';
        auth.$getCurrentUser().then(function() {
          console.log(msg);
        });
        auth.$logout();
      },
      getLoggedUserEMail: function () {
        return '' + ((auth)?((auth.user)?((auth.user.email)?auth.user.email:''):''):'');
      }
    };
 
    $rootScope.signedIn = function () {
      return Auth.signedIn();
    };
    
    return Auth;
  });

