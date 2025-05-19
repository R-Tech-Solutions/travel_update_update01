import React from 'react'
import ProjectStatic from '../components/ProjectStatic'
import RecentOrder from '../components/RecentOrder'
import KeyMetrics from '../components/KeyMetrics'
import NewUser from '../components/NewUser'


const Home = () => {
  return (
    <div className="p-5 mt-5"> {/* 👈 Added margin-top here */}
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
        <div className="h-full"><ProjectStatic /></div>
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
