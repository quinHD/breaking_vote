Rails.application.routes.draw do
  
  resources :towns do
    resources :parties
  end

end
