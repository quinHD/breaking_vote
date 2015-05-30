class CreateParties < ActiveRecord::Migration
  def change
    create_table :parties do |t|
    	t.integer	:town_id
    	t.string	:color, default: ""
    	t.string	:town_code
    	t.string	:party_code
    	t.string	:acronym
    	t.string	:name
    	t.integer	:votes
    	t.integer	:seats
 
      t.timestamps null: false
    end
  end
end