class CreateTowns < ActiveRecord::Migration
  def change
    create_table :towns do |t|
    	t.string	:town_code
    	t.string	:region_code
    	t.string	:name
    	t.integer	:population
    	t.integer	:census
    	t.integer	:votes
    	t.integer	:null_votes
    	t.integer	:blank_votes
    	t.integer	:scrutinized

      t.timestamps null: false
    end
  end
end
