towns = SmarterCSV.process('public/src_files/min_town_data.csv')

towns.each do |town|
	town.delete :fecha
	town.delete :id_municipio
	town.delete :id_provincia

	Town.create town

end

parties = SmarterCSV.process('public/src_files/min_party_data.csv')

parties.each do |party|
	town= Town.find_by town_code: party[:town_code]
	town.parties.create party
end

puts "Rake complete!"