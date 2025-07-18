import React, { useState, useEffect } from "react";
import ProjectStatic from "../components/ProjectStatic";
import RecentOrder from '../components/RecentOrder'
import KeyMetrics from '../components/KeyMetrics'
import NewUser from '../components/NewUser'
import { BackendUrl } from "../BackendUrl"; // adjust path if needed


const Home = (props) => {
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);

  useEffect(() => {
    const fetchApprovedTotal = async () => {
      try {
        const response = await fetch(`${BackendUrl}/api/bookings/`);
        if (!response.ok) return;
        const data = await response.json();
        const total = data
          .filter(booking => booking.status === "approved")
          .reduce((sum, booking) => sum + Number(booking.price), 0);
        setTotalApprovedAmount(total);
      } catch (e) {
        setTotalApprovedAmount(0);
      }
    };
    fetchApprovedTotal();
  }, []);

  return (
    <div className="p-5 mt-5"> {/* 👈 Added margin-top here */}
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
        <div className="h-full"><ProjectStatic totalAmount={totalApprovedAmount} /></div>
        <div className="h-full"><KeyMetrics /></div>
      </div>
      <div className="h-full mt-4"> {/* 👈 Optional: add spacing before RecentOrder */}
        <RecentOrder />
        <NewUser />
      </div>
    </div>
  )
}

export default Home
