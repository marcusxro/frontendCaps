import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BarCharts = () => {
  const [nonFil, setNonFil] = useState([]);

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/menuDetails')
      .then((response) => {
        setNonFil(response.data);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='bar'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={nonFil}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ProductName" tick={{ fill: 'black', fontWeight: 'bold' }} />
          <YAxis tick={{ fill: 'black', fontWeight: 'bold' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Weight" fill="#8884d8" stackId="a" />
          <Bar dataKey="Quantity" fill="#82ca9d" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
