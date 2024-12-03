class SessionController < ApplicationController


    post "/auth/login" do
        email=params[:email]
        password=params[:password]


        if (email.present? && password.present? )
            user = User.find_by(email: email)

            if (user && user.authenticate(password))
                session[:user_id] = user.id

                message = {:success => "login success"}
                message.to_json
            else
                status 401
                message = {:error => "Wrong credentials"}
                message.to_json
            end
           
        else
            status 406
            message = {:error => "All inputs are required"}
            message.to_json
        end 
    end

    #logout
    post "/auth/logout" do
        session.delete :user_id
        message = {:success => "logged out successfully"}
        message.to_json
    end

end 