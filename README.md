# knexMigrateAndSeedExamples

##How do you use Knex to migrate a PostgreSQL database?
┌───────────────────────────────────────────────────────────────┐
│                            artists                            │
├─────────────┬─────────────────────────┬───────────────────────┤
│id           │serial                   │primary key            │
│name         │varchar(255)             │not null default ''    │
│created_at   │timestamp with time zone │not null default now() │
│updated_at   │timestamp with time zone │not null default now() │
└─────────────┴─────────────────────────┴───────────────────────┘
                                ┼
                                │
                                ○
                               ╱│╲
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                          tracks                                          │
├─────────────┬─────────────────────────┬──────────────────────────────────────────────────┤
│id           │serial                   │primary key                                       │
│artist_id    │integer                  │not null references authors(id) on delete cascade │
│title        │varchar(255)             │not null default ''                               │
│likes        │integer                  │not null default 0                                │
│created_at   │timestamp with time zone │not null default now()                            │
│updated_at   │timestamp with time zone │not null default now()                            │
└─────────────┴─────────────────────────┴──────────────────────────────────────────────────┘
mkdir trackify
cd trackify
npm init
Initialize a new git repo.

git init
Tell git to ignore the usual files/folders.

echo '.DS_Store' >> .gitignore
echo 'node_modules' >> .gitignore
echo 'npm-debug.log' >> .gitignore
Before we can start creating migration files we need to create the database, trackify_dev. You should see it listed in the psql -l output.

createdb trackify_dev
psql -l
Next we install both pg and knex. When we install knex it comes the migration cli tool installed to ./node_modules/.bin/knex. We can use this instead of doing an npm install -g knex for the CLI tool.

npm install --save pg knex
touch knexfile.js
knexfile.js

'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/trackify_dev'
  }
};
Run a test command to see the migration CLI at work. You shouldn't have a current version, yet.

in your shell

./node_modules/.bin/knex migrate:currentVersion
package.json

"scripts": {
  "knex": "knex"
},
in your shell

npm run knex migrate:currentVersion
You still should see a version of none, but at least npm is saving you from having to type, ./node_modules/.bin/knex.

Create a new migration with the name artists.

npm run knex migrate:make artists
This created a couple things for us.

in your shell

ls -hal
ls -hal migrations
in your shell

npm run knex migrate:currentVersion
Migrations are how we define and update our database schema.

migrations/[SOME_TIMESTAMP]_artists.js

'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('artists', (table) => {
    table.increments();
    table.string('name').notNullable().defaultTo('');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('artists');
};
in your shell

npm run knex migrate:latest
Hmm... what did that do? Having problems remembering?

npm run knex -- --help
Check your current version now.

npm run knex migrate:currentVersion
It should be updated to timestamp on the migration file for your artists.

Run through the following series of shell commands to get a better idea of knex and how it tracks migrations internally.

psql trackify_dev -c '\dt'
psql trackify_dev -c '\d knex_migrations'
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
npm run knex migrate:rollback
npm run knex migrate:currentVersion
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
npm run knex migrate:latest
npm run knex migrate:currentVersion
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
Add migration locking so multiple services cannot try to run migrations at same time. This added a new lock table. If migrations are locked and migrations are run by another service it results in an error.

psql trackify_dev -c '\d knex_migrations_lock'
psql trackify_dev -c 'SELECT * FROM knex_migrations_lock;'
npm run knex migrate:make tracks
ls -hal migrations
migrations/[SOME_TIMESTAMP]_tracks.js

'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('tracks', (table) => {
    table.increments();
    table.integer('artist_id')
      .notNullable()
      .references('id')
      .inTable('artists')
      .onDelete('CASCADE')
      .index();
    table.string('title').notNullable().defaultTo('');
    table.integer('likes').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tracks');
};
npm run knex migrate:latest
npm run knex migrate:currentVersion
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
npm run knex migrate:rollback
npm run knex migrate:currentVersion
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
npm run knex migrate:rollback
npm run knex migrate:currentVersion
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
npm run knex migrate:latest
npm run knex migrate:currentVersion
psql trackify_dev -c 'SELECT * FROM knex_migrations;'
What's the Knex seed system?
The Knex seed system allows developers to automate the initialization of table rows in JavaScript.

Why is the Knex seed system useful?
Most web application start with an initial set of table rows. It's useful to be able to seed a database with that set.

How do you use Knex to seed a PostgreSQL database?
npm run knex seed:make 1_artists
ls -hal
ls -hal seeds
'use strict';

exports.seed = function(knex) {
  return knex('artists').del()
    .then(() => {
      return knex('artists').insert([{
        id: 1,
        name: 'The Beatles'
      }, {
        id: 2,
        name: 'Adele'
      }]);
    });
};
npm run knex seed:run
psql trackify_dev -c 'SELECT * FROM artists;'
npm run knex seed:run
psql trackify_dev -c 'SELECT * FROM artists;'
npm run knex seed:make 2_tracks
ls -hal seeds
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
npm run knex seed:run
psql trackify_dev -c 'SELECT * FROM tracks;'
npm run knex seed:run
psql trackify_dev -c 'SELECT * FROM tracks;'
git status
git add .
git commit -m 'Initial commit'
