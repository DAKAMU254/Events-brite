import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

export default function RootLayout() {
  const { user } = useUser();
  console.log(`User ID: ${user?.id}
    Full Name: ${user?.fullName}
    Email: ${user?.emailAddresses[0].emailAddress}
    Image URL: ${user?.imageUrl}
    `);
    
    useEffect(() => {
      // Only attempt to register if user exists and has all required information
      if (
        user?.id &&
        user?.fullName &&
        user?.emailAddresses?.[0]?.emailAddress
		) {
			const registerUser = async () => {
				try {
          const response = await axios.post(
            "http://localhost:8000/register",
						{
              clerkId: user.id,
							name: user.fullName,
							email: user.emailAddresses[0].emailAddress,
							image: user.imageUrl,
						},
						{
              headers: {
                "Content-Type": "application/json",
							},
						}
          );

					if (response.status === 200) {
						console.log("User registered successfully");
					}
				} catch (error) {
					if (error.response?.status !== 400) {
						console.error("Registration error:", error);
					}
				}
			};

			registerUser();
		}
	}, [user]); 

	return (
		<div>
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
}
