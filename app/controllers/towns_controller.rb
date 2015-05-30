class TownsController < ApplicationController
	
	def index
		towns = Town.all

		respond_to do |format|
		    headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
  headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  headers['Access-Control-Max-Age'] = "1728000"
      format.json{ render json: towns, include: :parties}
		end
	end

	def show
		town = Town.find_by town_code: params[:id]

		respond_to do |format|
			  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
  headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  headers['Access-Control-Max-Age'] = "1728000"
      format.json{ render json: town, include: :parties}
		end
	end

end
