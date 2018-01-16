# Requirements #
Node LTS (I'm using v8.4.0)
Node Package Manager (comes with node, my version is 5.6.0)

It will work with anything node 8 and above

# Installation #

run `npm install`

database can be created by redirecting `db-create.sql` into the mysql console:
`mysql -u <user> -p < db-create.sql`

And then populating the data in the database using `db_data.sql`

`mysql -u <user> -p issue_tracker < db_data.sql`

Any user can be used for the system, just update `config.json.example` to have the correct details
and then move `config.json.example` to `config.json`

# Run in development mode #

`npm run dev`

# Run in production mode #

`npm run build`

`npm start`

# Running Tests #

`npm test` will run all tests and output them to the console

note that this requires the node modules to be installed first, so if `npm install` hasn't been run, then run it
