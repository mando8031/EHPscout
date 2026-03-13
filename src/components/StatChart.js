import { BarChart,Bar,XAxis,YAxis,Tooltip } from "recharts"

function StatChart({data}){

  return(

    <BarChart width={700} height={400} data={data}>

      <XAxis dataKey="team"/>

      <YAxis/>

      <Tooltip/>

      <Bar dataKey="overall"/>

    </BarChart>

  )

}

export default StatChart
