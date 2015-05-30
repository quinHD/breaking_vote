class TownsController < ApplicationController
	def index
		towns = Town.all

		respond_to do |format|
      format.json{ render json: towns, include: :parties}
		end
	end

	def show
		town = Town.find_by town_code: params[:id]

		respond_to do |format|
      format.json{ render json: town, include: :parties}
		end
	end

end
