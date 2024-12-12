import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../context/event-context";

function Home() {
	const { events, fetchEvents } = useEvents();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadEvents = async () => {
			try {
				setIsLoading(true);
				const result = await fetchEvents();

				if (!result.ok) {
					setError(result.error);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		loadEvents();
	}, []);

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-pulse text-2xl text-gray-600'>
					Loading events...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-screen text-red-500'>
				Error loading events: {error}
			</div>
		);
	}

	return (
		<div className='bg-gray-50 min-h-screen'>
			<section className='bg-white shadow-sm py-10'>
				<div className='container mx-auto px-4'>
					<div className='flex flex-wrap items-center'>
						<div className='w-full md:w-1/2 mb-6 md:mb-0'>
							<img
								src='/home.jpg'
								className='rounded-xl shadow-2xl w-full h-auto object-cover'
								alt='How do you see your events?'
								loading='lazy'
							/>
						</div>
						<div className='w-full md:w-1/2 px-4'>
							<h1 className='text-4xl font-bold mb-4'>
								Discover{" "}
								<span className='text-blue-600'>Events</span>{" "}
								Near You
							</h1>
							<p className='text-lg text-gray-700 mb-6'>
								Welcome to{" "}
								<span className='text-blue-600 font-semibold'>
									Eventsbrite
								</span>
								, your gateway to exciting local events. Browse,
								book, and create memorable experiences with
								ease.
							</p>
							<div className='flex justify-start'>
								<a
									href='#events'
									className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md'
								>
									View Events Now
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='py-10'>
				<div className='container mx-auto text-center mb-8'>
					<h2 className='text-3xl font-bold mb-4'>
						Events <span className='text-blue-600'>Lined Up</span>{" "}
						for You
					</h2>
					<p className='text-gray-600 max-w-xl mx-auto'>
						Explore our curated selection of trending events. Find
						something that sparks your interest!
					</p>
				</div>

				{events && events.length < 1 ? (
					<div className='text-center py-10'>
						<p className='text-gray-600 text-xl'>
							No events are currently available. Check back soon!
						</p>
					</div>
				) : (
					<div className='container mx-auto px-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							{events &&
								events.map((event) => (
									<div
										key={event.id}
										className='bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
									>
										<div className='h-56 overflow-hidden relative'>
											<img
												src={event.image}
												className='w-full h-full object-cover absolute inset-0'
												alt={event.title}
											/>
										</div>
										<div className='p-6 flex flex-col'>
											<h3 className='text-xl font-bold text-gray-800 mb-3'>
												{event.title}
											</h3>
											<p className='text-gray-600 mb-4 flex-grow line-clamp-3'>
												{event.description}
											</p>
											<div className='mt-auto text-center'>
												<Link
													to={`/events/${event.id}`}
													className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-block'
												>
													View Details
												</Link>
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				)}
			</section>
		</div>
	);
}

export default Home;
