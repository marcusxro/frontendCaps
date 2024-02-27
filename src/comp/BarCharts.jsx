import React from 'react'
import { BarChart, 
  Bar,
   Rectangle,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
     ResponsiveContainer, PieChart } from 'recharts';

const BarCharts = () => {
    const data = [
        {
          name: 'Cream Charger',
          LBS: 4000,
          Quantity: 2400,
          amt: 2400,
        },
        {
          name: 'Waffle mix',
          LBS: 3000,
          Quantity: 1398,
          amt: 2210,
        },
        {
          name: 'Cheese sauce',
          LBS: 2000,
          Quantity: 9800,
          amt: 2290,
        },
        {
          name: 'Slice cheese',
          LBS: 2780,
          Quantity: 3908,
          amt: 2000,
        },
        {
          name: 'Tuna',
          LBS: 1890,
          Quantity: 4800,
          amt: 2181,
        },
        {
          name: 'Almond',
          LBS: 2390,
          Quantity: 3800,
          amt: 2500,
        },
        {
          name: 'Tomatoes',
          LBS: 3490,
          Quantity: 4300,
          amt: 2100,
        },
      ];
    
    
  return (
    <div className='bar'>
       <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: 'black', fontWeight: 'bold' }} /> 
                  <YAxis tick={{fill: 'black', fontWeight: 'bold'}} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="LBS" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="black"  />} />
                  <Bar dataKey="Quantity" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
              </ResponsiveContainer>
    </div>
  )
}

export default BarCharts
