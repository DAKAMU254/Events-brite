import React from "react";
import {  useEvents } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";

export default function Events() {
  const { events, deleteEvent } = useEvents()
  const { user } = useAuth();

  const { id } = useParams();
  const singleEvent = events && events.find((event) => event.id === id);

  return (
    <div className='container mx-auto'>
      {singleEvent ? (
        <>
          <section class='py-5 text-center container'>
            <div class='row py-lg-5'>
              <div class='col-lg-6 col-md-8 mx-auto'>
                <h1 class='fw-light'>{singleEvent.title}</h1>
                <p class='lead text-muted'> Have you loved this event?</p>
              </div>
            </div>
          </section>
          <h4>Event</h4>
          <div className='row gx-5'>
            <div className='col-lg-12 '>
              <img
                src={singleEvent.image}
                className='img-fluid'
                alt='app-image'
              />

              <p className='mt-3'>{singleEvent.content}</p>
            </div>
          </div>
          <div className='row gx-5'>
            <div className='col-lg-12'>
              <div className='shadow p-4'>
                <h5 className='fw-bold mb-3'>{singleEvent.title}</h5>
                <p className='text-muted mb-4'>{singleEvent.description}</p>
                <hr className='my-2' />
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='mb-0'>
                    {singleEvent.user && `Owner: ${singleEvent.user.username}`}
                  </p>
                  <p className='mb-0'>Date posted: {singleEvent.created_at}</p>
                </div>
                {user && user.username === singleEvent.user.username && (
                  <div className='mt-3'>
                    <Link
                      to={`/edit/${singleEvent.id}`}
                      className='btn btn-success me-2'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteEvent(singleEvent.id)}
                      className='btn btn-danger'
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading event...</p>
      )}
    </div>
  );
}
