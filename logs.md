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

to undo all migration : sequelize db:migrate:undo:all
to undo last migration: sequelize db:migrate:undo
to undo specific migration : sequelize db:migrate:undo --name 20230908193420-create-rooms.js

tags to be used for status of rooms
{
    1: available
    2: unavailable/occupied
    3: custom
    4: faulty
    5: PG
}
programType is used for the progamme student is in for
{
    1: BSc
    2: Masters or MPhil
    3: PHD
}

there's a chance the block model wouldn't be used anymore.
