
exports.up = function(knex) {
  console.log('creating topics table');
  return knex.schema.createTable('topics', (topicsTable) => {
      topicsTable.string('slug').unique().primary();
      topicsTable.string('description');
  })
};

exports.down = function(knex) {
  console.log('removing topics tables');
  return knex.schema.dropTable('topics');
};