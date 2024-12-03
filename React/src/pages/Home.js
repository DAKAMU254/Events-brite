import React from "react";
import image1 from "./images/home.jpg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";

function Home() {
  const { events } = useContext(EventContext);

  return (
    <div>
      <section>
        <div class='container col-xxl-8 px-4 py-5 '>
          <div class='row flex-lg-row-reverse align-items-center g-5 py-5'>
            <div class='col-10 col-sm-8 col-lg-6'>
              <img
                src={image1}
                class='d-block mx-lg-auto img-fluid'
                alt='How do you see your events??'
                width='700'
                height='500'
                loading='lazy'
              />
            </div>
            <div class='col-lg-6'>
              <h1 class='display-5 fw-bold lh-1 mb-3'>
                See the <span className='text-info text-opacity-'>Events</span>{" "}
                Available <span className='text-danger'>Now!!</span>
              </h1>
              <p class='lead'>
                Welcome to{" "}
                <span className='text-info text-opacity-75'>Eventsbrite</span>{" "}
                Application where you get to view all the available events
                around your area and get to add an Event and invite your guests
                at a very <span className='text-danger'>low pricing</span>.{" "}
                <br />
                <span>
                  You will Never Go <span className='text-primary'>Wrong</span>{" "}
                  with Eventsbrite
                </span>{" "}
              </p>
              <div class='d-grid gap-2 d-md-flex justify-content-md-start'>
                <button type='button' class='btn btn-outline-info btn-lg px-4'>
                  View Events Now
                </button>
              </div>
            </div>
          </div>
          <hr className=''></hr>
        </div>
      </section>

      <section class='py-5 text-center container'>
        <div class='row py-lg-5'>
          <div class='col-lg-6 col-md-8 mx-auto'>
            <h1 class='fw-light'>
              See The Events lined up for{" "}
              <span className='text-info'>you!</span>
            </h1>
            <p class='lead text-muted'>
              {" "}
              Below are some of the most popular events you have seen in a
              while. You can view more and see if you will buy a ticket
            </p>
          </div>
        </div>
      </section>

      {events && events.length < 1 ? (
        <div className='text-info'>There are no events at the moment</div>
      ) : (
        ""
      )}

      {events && events.length < 1 ? (
        <div className='text-info'>There are no events at the moment</div>
      ) : (
        <div className='container-fluid'>
          <div className='row'>
            {events &&
              events.map((event) => (
                <div className='col-6 col-sm-6 col-md-4 mb-5' key={event.id}>
                  <div className='card h-100 d-flex flex-column'>
                    <div className='overflow-hidden' style={{ height: "30vh" }}>
                      <img
                        src={event.image}
                        className='card-img-top'
                        alt='img loading...'
                      />
                    </div>
                    <div className='card-body flex-grow-1'>
                      <h5 className='card-title'>{event.title}</h5>
                      <p className='card-text'>{event.description}</p>
                      <div className='mt-auto text-center'>
                        <Link
                          to={`/events/${event.id}`}
                          href='#'
                          className='btn btn-info btn-sm w-100'
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
