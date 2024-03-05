import React, {useEffect, useState} from 'react'
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
import axios from 'axios';

const PieCharts = () => {
  const [nonFil, setNonFil] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8080/getIng')
      .then((response) => {
        setNonFil(response.data);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='pie'>
     <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={nonFil}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="IngName" padding={{ left: 30, right: 30 }} tick={{fill: 'black', fontWeight: 'bold'}}/>
          <YAxis tick={{fill: 'black', fontWeight: 'bold'}} />
          <Tooltip tick={{fill: 'black', fontWeight: 'bold'}} />
          <Legend tick={{fill: 'black', fontWeight: 'bold'}} />
          <Line type="monotone" dataKey="Weight" stroke="#8884d8" activeDot={{ r: 10 }} />
          <Line type="monotone" dataKey="Quantity" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieCharts
