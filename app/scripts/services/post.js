'use strict';
 
app.factory('Post', function ($resource) {
  return $resource('https://luminous-fire-6652.firebaseIO.com/posts/:id.json');
});

