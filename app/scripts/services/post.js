'use strict';
 
// app.factory('Post', function ($resource) {
//   return $resource('https://luminous-fire-6652.firebaseIO.com/posts/:id.json');
// });

app.factory('Post',
  function ($firebase, FIREBASE_URL, User) {
    var ref = new Firebase(FIREBASE_URL + 'posts');
 
    var posts = $firebase(ref);

    var Post = {
      all: posts,
      create: function (post) {
        if (User.signedIn()) {
          var user = User.getCurrent();
       
          post.owner = user.username;
       
          return posts.$add(post).then(function (ref) {
            var postId = ref.name();
       
            user.$child('posts').$child(postId).$set(postId);
       
            return postId;
          });
        }
      },
      find: function (postId) {
        return posts.$child(postId);
      },
      delete: function (postId) {
        // return posts.$remove(postId);
        if (User.signedIn()) {
          var post = Post.find(postId);
       
          post.$on('loaded', function () {
            var user = User.findByUsername(post.owner);
       
            posts.$remove(postId).then(function () {
              user.$child('posts').$remove(postId);
            });
          });
        }
      },
      addComment: function (postId, comment) {
        comment.username = 'anonymous';
        comment.postId = postId;
 
        posts.$child(postId).$child('comments').$add(comment).then(function (ref) {
          // user.$child('comments').$child(ref.name()).$set({id: ref.name(), postId: postId});
          console.log(ref.path.toString());
        });
      },
      deleteComment: function (post, comment, commentId) {
        var user = 'anonymous';
 
        post.$child('comments').$remove(commentId).then(function () {
          user.$child('comments').$remove(commentId);
        });
      }
    };

    return Post;
  });
