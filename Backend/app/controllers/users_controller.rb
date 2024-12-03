class UsersController < ApplicationController
    get "/users" do
        users = User.all
        users.to_json
    end

    post "/users/adduser" do
        _username=params[:username]
        _telephone=params[:telephone]
        _password=params[:password]
        _email=params[:email]
        _image=params[:image]

        

        if (_username.present? && _email.present? && _password.present? && _telephone.present?)

           check_username = User.exists?(username:_username)
           check_email = User.exists?(email:_email)
           
           if check_username=== true
            status 406
            message = {:error => "Username already exists"}
            message.to_json
           elsif check_email === true
                status 406
                message = {:error => "Email already exists"}
                message.to_json
               else
                
                    user = User.create(username: _username, email: _email, password: _password,telephone: _telephone,image: _image) 
                    if user
                        message = {:success => "User has been created successfuly"}
                        message.to_json
                    else
                        message = {:error => "Error saving the user"}
                        message.to_json
                    end
            end

        else
            status 406
            message = {:error => "All values are required"}
            message.to_json
        end 

     
    end

    #get current user
    get "/currentuser" do
        user = User.find_by(id: session[:user_id])

        if user
            {:user => user}.to_json
        else
            status 401
            message = {:error => "Not Logged in"}
            message.to_json
        end

    end

end