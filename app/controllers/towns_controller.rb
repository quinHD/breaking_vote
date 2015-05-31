class TownsController < ApplicationController

	def index
		towns = Town.all

		respond_to do |format|
		    headers['Access-Control-Allow-Origin'] = '*'

      format.json{ render json: towns, include: :parties}
		end
	end

	def show
		@town = Town.where("lower(name) = ?", params[:id].downcase).first

		respond_to do |format|
			headers['Access-Control-Allow-Origin'] = '*'

      format.json{ render json: @town, include: :parties}
      format.html{ render 'show'}
		end
	end

end
