import { UserProfile, useUser } from "@clerk/clerk-react"
// import { motion } from "framer-motion";
// import { format } from "date-fns";

function Profile() {
  const {user} = useUser();
  console.log(user)

  if (!user) {
    return (
      <div className='text-center mt-5'>
        <h3>Loading user information...</h3>
      </div>
    );
  }

  return (
    <UserProfile/>
    // <motion.div
    //   className='bg-light'
    //   style={{ minHeight: "80vh", padding: "2rem 0" }}
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   transition={{ duration: 0.5 }}
    // >
    //   <div className='container'>
    //     <div className='row justify-content-center'>
    //       <motion.div
    //         className='col-lg-8 col-md-10'
    //         initial={{ y: 50 }}
    //         animate={{ y: 0 }}
    //         transition={{ duration: 0.5 }}
    //       >
    //         <div className='card shadow-lg border-0'>
    //           <div className='row no-gutters'>
    //             {/* Profile Picture and Greeting */}
    //             <div
    //               className='col-md-4 bg-info text-white d-flex flex-column justify-content-center align-items-center'
    //               style={{
    //                 borderTopLeftRadius: "0.5rem",
    //                 borderBottomLeftRadius: "0.5rem",
    //               }}
    //             >
    //               <motion.div
    //                 className='text-center'
    //                 initial={{ scale: 0.8 }}
    //                 animate={{ scale: 1 }}
    //                 transition={{ duration: 0.5 }}
    //               >
    //                 <i className='fas fa-user-circle fa-7x mb-3'></i>
    //                 <h3 className='fw-bold'>Hello, {user.fullName.split(" ")[0] || "User"}!</h3>
    //                 <p className='text-white-50'>
    //                   {user.bio || "Event enthusiast?"}
    //                 </p>
    //               </motion.div>
    //             </div>

    //             {/* Profile Details */}
    //             <div className='col-md-8 bg-white'>
    //               <div className='card-body'>
    //                 <h4 className='card-title text-center mb-4'>
    //                   <i className='fas fa-info-circle text-info me-2'></i>
    //                   Your Profile Information
    //                 </h4>
    //                 <hr />
    //                 <div className='row mb-3'>
    //                   <div className='col-sm-6'>
    //                     <p className='fw-bold'>Email:</p>
    //                     <h6 className='text-muted'>{user.emailAddresses[0].emailAddress}</h6>
    //                   </div>
    //                   <div className='col-sm-6'>
    //                     <p className='fw-bold'>Username:</p>
    //                     <h6 className='text-muted'>{user.username || "N/A"}</h6>
    //                   </div>
    //                   <div className='col-sm-6'>
    //                     <p className='fw-bold'>Joined on:</p>
    //                     <h6 className='text-muted'>
    //                       {format(user.createdAt, "EEE MMM do yyy") || "N/A"}
    //                     </h6>
    //                   </div>
    //                   <div className='col-sm-6'>
    //                     <p className='fw-bold'>Phone Number:</p>
    //                     <h6 className='text-muted'>
    //                       {user.telephone ? `0${user.telephone}` : "N/A"}
    //                     </h6>
    //                   </div>
    //                 </div>
    //                 <motion.div
    //                   className='text-center mt-4'
    //                   whileHover={{ scale: 1.05 }}
    //                   whileTap={{ scale: 0.95 }}
    //                 >
    //                   <button className='btn btn-info px-4 py-2'>
    //                     Edit Profile
    //                   </button>
    //                 </motion.div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </motion.div>
    //     </div>
    //   </div>
    // </motion.div>
  );
}

export default Profile;
