import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function Dashboard(){

  const [stats,setStats]=useState([]);

  useEffect(()=>{

    async function load(){

      const snapshot=await getDocs(collection(db,"scouting"));

      const data=snapshot.docs.map(d=>d.data());

      const grouped={};

      data.forEach(entry=>{

        if(!grouped[entry.team]){
          grouped[entry.team]=[];
        }

        grouped[entry.team].push(entry);
      });

      const averages=Object.keys(grouped).map(team=>{

        const entries=grouped[team];

        const avgOverall =
          entries.reduce((a,b)=>a+Number(b.overall),0)/entries.length;

        return {
          team,
          overall:avgOverall
        };

      });

      setStats(averages);
    }

    load();

  },[]);

  return(

    <div>

      <h1>Team Performance</h1>

      <BarChart width={700} height={400} data={stats}>
        <XAxis dataKey="team" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="overall" />
      </BarChart>

    </div>

  );
}

export default Dashboard;
