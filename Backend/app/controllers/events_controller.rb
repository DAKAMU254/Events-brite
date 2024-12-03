class EventsController < ApplicationController
# Get Event
    get "/events" do
        events = Event.all
        events.to_json(include: :user)
    end
# Add Event

    post "/events/addevent" do 
        authorize 

        title=params[:title]
        description=params[:description]
        user_id=params[:user_id]
        image=params[:image]

        if (title.present? && description.present? && user_id.present? && image.present?)

            check_user = check_user = User.exists?(id:user_id)
            if check_user === false
                status 406
                message = {:error => "User trying to add event does not exist"}
                message.to_json
            else
                event = Event.create(title: title, user_id: user_id, description: description,image: image) 
                if event
                    message = {:success => "Event has been created successfully"}
                    message.to_json
                else
                    message = {:error => "Error saving the Event"}
                    message.to_json
                end
            end
        else
            status 406
            message = {:error => "All fields are required"}
            message.to_json
        end

    end

    # Edit Post

    patch "/events/editevent/:id" do
        authorize 
        title=params[:title]
        description=params[:description]
        image=params[:image]

        if (title.present? && description.present? &&  image.present?)
            event_find = Event.find_by(id: params[:id])
            event = event_find.update(title: title, description: description,image: image) 
            if event
                message = {:success => "Event has been updated successfully"}
                message.to_json
            else
                message = {:error => "Error updating the Event"}
                message.to_json
            end
            
        else
            status 406
            message = {:error => "All fields are required"}
            message.to_json
        end

    end



    #  Delete Event
    delete "/event/delete/:id" do
        authorize 
        
        check_event = Event.exists?(id: params[:id])
        if check_event
            event = Event.find(params[:id])
            event.destroy
            message = {:success => "Event deleted successfully"}
            message.to_json

        else
            status 406
            message = {:error => "The event does not exist"}
            message.to_json
        end
    end
end