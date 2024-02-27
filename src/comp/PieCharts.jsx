import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

const PieCharts = () => {
  const data = [
    {
      name: 'Coffee Jelly',
      LBS: 100,
      Quantity: 8,
      amt: 2400,
    },
    {
      name: 'Caramel',
      LBS: 3000,
      Quantity: 100,
      amt: 2210,
    },
    {
      name: 'Mocha',
      LBS: 2000,
      Quantity: 25,
      amt: 2290,
    },
    {
      name: 'Java Chip',
      LBS: 2780,
      Quantity: 100,
      amt: 2000,
    },
    {
      name: 'Double Chocolate',
      LBS: 1890,
      Quantity: 16,
      amt: 2181,
    },
    {
      name: 'Oreo',
      LBS: 2390,
      Quantity: 30,
      amt: 2500,
    },
    {
      name: 'Matcha',
      LBS: 3490,
      Quantity: 26,
      amt: 2100,
    },
  ];

  return (
    <div className='pie'>
     <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{ left: 30, right: 30 }} tick={{fill: 'black', fontWeight: 'bold'}}/>
          <YAxis tick={{fill: 'black', fontWeight: 'bold'}} />
          <Tooltip tick={{fill: 'black', fontWeight: 'bold'}} />
          <Legend tick={{fill: 'black', fontWeight: 'bold'}} />
          <Line type="monotone" dataKey="LBS" stroke="#8884d8" activeDot={{ r: 10 }} />
          <Line type="monotone" dataKey="Quantity" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieCharts
