always change from sequelize in the migrations to DataTypes
run in terminal sequelize db:migrate to run the previously created tables
and instead of using sequelize.sync in our index.js file, it would then be sequelize.authenticate() so as not to remove preexisting tables.
always ensure to use await while using async for functions  else, it would return a promise pending response

to use nodemon, install it as a global deppendency.
" npm install -g nodemon "

* always add a return for all of the res.send lines

to create a new table using sequelize-cli
sequelize model:generate --name NameOfTable --attributes name_of_column:dtype, name_of_column:dtype, name_of_column:dtype

Learn how to do the associations very well.

NB: Using Datatypes.NUMBERS returns an error