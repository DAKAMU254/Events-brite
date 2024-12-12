import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const events = [
		{
			title: "Tech Conference 2024",
			description:
				"Annual technology conference featuring the latest in web development, AI, and cloud computing",
			image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
			userId: "4480e5ec-38c6-4117-b438-1c7b55b842ea", // Make sure this matches an existing user ID in your database
		},
		{
			title: "Music Festival",
			description:
				"Three-day outdoor music festival featuring local and international artists",
			image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
			userId: "457ed25c-fca7-48d8-8d26-7a41a41e57f7",
		},
		{
			title: "Art Exhibition",
			description:
				"Contemporary art showcase featuring works from emerging artists",
			image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800&q=80",
			userId: "77cb788c-a5b9-4c78-bf89-63e69718ec75",
		},
		{
			title: "Food & Wine Festival",
			description:
				"Culinary experience featuring local restaurants and wineries",
			image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
			userId: "4480e5ec-38c6-4117-b438-1c7b55b842ea",
		},
		{
			title: "Startup Pitch Night",
			description:
				"Evening of innovative startup presentations and networking",
			image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
			userId: "f8905982-560f-4172-823d-c1a8d68ee54e",
		},
		{
			title: "Wellness Retreat",
			description: "Weekend of yoga, meditation, and wellness workshops",
			image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
			userId: "f8905982-560f-4172-823d-c1a8d68ee54e",
		},
		{
			title: "Gaming Convention",
			description:
				"Celebration of video games, esports, and gaming culture",
			image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
			userId: "4480e5ec-38c6-4117-b438-1c7b55b842ea",
		},
		{
			title: "Cultural Festival",
			description:
				"Celebration of diverse cultures through food, music, and performances",
			image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
			userId: "457ed25c-fca7-48d8-8d26-7a41a41e57f7",
		},
	];

	for (const event of events) {
		await prisma.event.create({
			data: event,
		});
	}

	console.log("Seed completed successfully");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
