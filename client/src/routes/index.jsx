import { Link } from "react-router-dom";
import { useEvents } from "../context/event-context";

function Home() {
  const { events } = useEvents();

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2">
              <img
                src="/home.jpg"
                className="rounded-lg shadow-lg"
                alt="How do you see your events?"
                width="700"
                height="500"
                loading="lazy"
              />
            </div>
            <div className="w-full md:w-1/2 px-4">
              <h1 className="text-4xl font-extrabold mb-4">
                See the <span className="text-blue-500">Events</span> Available <span className="text-red-500">Now!!</span>
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to <span className="text-blue-500">Eventsbrite</span> Application where you get to view all the available events
                around your area and get to add an Event and invite your guests at a very <span className="text-red-500">low pricing</span>. <br />
                <span>You will Never Go <span className="text-blue-500">Wrong</span> with Eventsbrite</span>
              </p>
              <div className="flex justify-start">
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                  <Link href="#events">View Events Now</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-light">
              See The Events lined up for <span className="text-blue-500">you!</span>
            </h1>
            <p className="text-gray-600">
              Below are some of the most popular events you have seen in a while. You can view more and see if you will buy a ticket.
            </p>
          </div>
        </div>
      </section>

      {events && events.length < 1 ? (
        <div className="text-blue-500 text-center py-10">There are no events at the moment</div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events &&
              events.map((event) => (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden" key={event.id}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image}
                      className="w-full h-full object-cover"
                      alt="img loading..."
                    />
                  </div>
                  <div className="p-4 flex flex-col h-full">
                    <h5 className="text-xl font-semibold mb-2">{event.title}</h5>
                    <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
                    <div className="text-center mt-auto">
                      <Link
                        to={`/events/${event.id}`}
                        href="#"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Read More
                      </Link>
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
