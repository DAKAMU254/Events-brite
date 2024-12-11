import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useEventStore = create(
  persist(
    (set) => ({
      events: [],
      selectedEvent: null,

      fetchEvents: async () => {
        try {
          const response = await axios.get("http://localhost:8000/events");

          if (response.status === 200) {
            set({ events: response.data.events });
          } else {
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      },

      fetchEventById: async (id) => {
        try {
          const response = await axios.get(`http://localhost:8000/events/${id}`);

          if (response.status === 200) {
            set({ selectedEvent: response.data.event });
          } else {
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("Error fetching event by ID:", error);
        }
      },

      addEvent: async (title, description, image) => {
        try {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("image", image);

          const response = await axios.post(
            "http://localhost:8000/events",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            set((state) => ({
              events: [...state.events, response.data.event],
            }));
            return { ok: true };
          } else {
            console.error(response.data.error);
            return { ok: false, error: response.data.error };
          }
        } catch (error) {
          console.error("Error adding event:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },

      uploadImage: async (image) => {
        try {
          const formData = new FormData();
          formData.append("image", image);

          const response = await axios.post(
            "http://localhost:8000/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            return { ok: true, imageUrl: response.data.imageUrl };
          } else {
            console.error(response.data.error);
            return { ok: false, error: response.data.error };
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },

      updateEvent: async (id, updatedData) => {
        try {
          const response = await axios.put(
            `http://localhost:8000/events/${id}`,
            updatedData
          );

          if (response.status === 200) {
            set((state) => ({
              events: state.events.map((event) =>
                event.id === id ? { ...event, ...response.data.event } : event
              ),
            }));
            return { ok: true };
          } else {
            console.error(response.data.error);
            return { ok: false, error: response.data.error };
          }
        } catch (error) {
          console.error("Error updating event:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },

      deleteEvent: async (id) => {
        try {
          const response = await axios.delete(`http://localhost:8000/events/${id}`);

          if (response.status === 200) {
            set((state) => ({
              events: state.events.filter((event) => event.id !== id),
            }));
            return { ok: true };
          } else {
            console.error(response.data.error);
            return { ok: false, error: response.data.error };
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },
    }),
    {
      name: "events", // Persist the store
    }
  )
);

export const useEvents = () => useEventStore((state) => state);