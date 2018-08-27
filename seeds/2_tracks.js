
'use strict';

exports.seed = function(knex) {
  return knex('tracks').del()
    .then(() => {
      return knex('tracks').insert([{
        id: 1,
        artist_id: 1,
        title: 'Here Comes the Sun',
        likes: 28808736
      }, {
        id: 2,
        artist_id: 1,
        title: 'Hey Jude',
        likes: 20355655
      }, {
        id: 3,
        artist_id: 1,
        title: 'Come Together',
        likes: 24438428
      }, {
        id: 4,
        artist_id: 1,
        title: 'Yesterday',
        likes: 21626039
      }, {
        id: 5,
        artist_id: 2,
        title: 'Send My Love',
        likes: 39658471
      }, {
        id: 6,
        artist_id: 2,
        title: 'Hello',
        likes: 538300301
      }, {
        id: 7,
        artist_id: 2,
        title: 'When We Were Young',
        likes: 112487182
      }, {
        id: 8,
        artist_id: 2,
        title: 'Someone Like You',
        likes: 112487182
      }]);
    });
};
