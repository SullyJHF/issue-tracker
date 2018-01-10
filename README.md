#Requirements#
Node LTS (I'm using v8.4.0)
Node Package Manager (comes with node, my version is 5.6.0)

It will work with anything node 8 and above

#Installation#

run `npm install`

database can be created by redirecting `db-create.sql` into the mysql console:
`mysql -u <user> -p < db-create.sql`

And then populating the data in the database using `db_data.sql`

`mysql -u <user> -p issue_tracker < db_data.sql`

Any user can be used for the system, just update `config.json` to have the correct details

#Run in development mode#

`npm run dev`

#Run in production mode#

`npm run build`

`npm start`
