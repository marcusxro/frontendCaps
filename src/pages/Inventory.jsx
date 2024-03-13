import React, { useState, useEffect } from 'react';
import Sidebar from '../comp/Sidebar';
import Table from '../comp/Table';
import NewItem from '../comp/NewItem';
import axios from 'axios'
import Caters from '../comp/Categories';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import Ingredients from './Ingredients';
import { useLocation, useNavigate } from 'react-router-dom';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';

const Inventory = () => {
  const [data, setData] = useState([])
  const location = useLocation();
  const [searchedItem, setSearched] = useState(null);
  const { state } = location;

  // Check if state exists and handle accordingly
  const itemName = state ? (state.firstValue || state) : null;
  const itemBool = state ? (state.secondValue || state) : null;

  useEffect(() => {
    if (location.state) {
      console.log(location)
      setSearched(itemName);
      if (itemBool === true) {
        setNavi("Ingredients")
        setNav(false)
      } else {
        setNavi('All')
        setNav(true)
      }
    }
  }, [state, itemName]);

  const nav = useNavigate()
  useEffect(() => {
    const unbsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        if (!acc.emailVerified) {
          nav('/login')
        }
      }
    })
    return () => { unbsub() }
  }, [])

  useEffect(() => {
    axios.get('http://localhost:8080/menuDetails')
      .then((res) => {
        setData(res.data);
      }).catch((err) => {
        console.log(err);
      });

  }, [data]);
  const [ingCount, setIng] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8080/getIng')
      .then((res) => {
        setIng(res.data);
      }).catch((err) => {
        console.log(err);
      });

  }, [ingCount]);

  const [quer, setQuer] = useState('')


  const [navi, setNavi] = useState('All')
  const [navToTab, setNav] = useState(true)


  const drinksData = data.filter((item) => item.Category === "Drinks");
  const snacksData = data.filter((item) => item.Category === "Snacks");
  const teaData = data.filter((item) => item.Category === "Tea");
  const datas = [
    { name: 'Group A', value: drinksData.length },
    { name: 'Group B', value: snacksData.length },
    { name: 'Group C', value: teaData.length },
  ];

  const solidData = ingCount.filter((item) => item.Category === "Solid");
  const liqData = ingCount.filter((item) => item.Category === "Liquid");

  const dataTwo = [
    { name: 'Group A', value: solidData.length },
    { name: 'Group B', value: liqData.length },
  ];



  const COLORS = ['#0088FE', '#00C49F', '#FFBB28',];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className='inventoryPage'>
      <Sidebar />
      <div className="inventoryContent">
        <div className="firstInvCon">
          <div className="firstInv">
            Inventory <span>{data.length + ingCount.length}</span>
          </div>
          <div className="navigation">
            <div className="cater">
              <div className={`All ${navi === 'All' ? 'activated' : ''}`}
                onClick={() => { setNavi('All'); setNav(true) }}>
                Products
              </div>
              <div className={`Categories ${navi === 'Cater' ? 'activated' : ''}`}
                onClick={() => { setNavi('Cater'); setNav(false) }}>
                Categories
              </div>
              <div className={`Ingredients ${navi === 'Ingredients' ? 'activated' : ''}`}
                onClick={() => { setNavi('Ingredients'); setNav(false) }}>
                Ingredients
              </div>
            </div>
          </div>
          {navToTab ? (
            <Table query={quer} searchedItem={searchedItem} />
          ) : (
            navi === 'Ingredients' ? (
              <Ingredients searchedItem={itemName} />
            ) : (
              <Caters />
            )
          )}

        </div>
        <div className="secondInvCon">
          <div className="firstPie">
            <ResponsiveContainer
              className="pies"
              width="100%" height="50%">
              <PieChart width={400} height={400}>
                <Pie
                  className='piee'
                  data={datas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="colorCon">
                <div className="drinkColor">
                  <div className="color"></div>
                  <div className="drinkTitle">Drinks <span className='countItem'>{drinksData.length}</span></div>
                </div>
                <div className="snackColor">
                  <div className="color"></div>
                  <div className="snackTitle">Snack <span className='countItem'>{snacksData.length}</span></div>
                </div>
                <div className="teaColor">
                  <div className="color"></div>
                  <div className="teaTitle">Tea <span className='countItem'>{teaData.length}</span></div>
                </div>
              </div>
            </ResponsiveContainer>
          </div>

          <div className="secPie">
            <ResponsiveContainer
              className="pies"
              width="100%" height="50%">
              <PieChart width={400} height={400}>
                <Pie
                  className='piee'
                  data={dataTwo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="colorCon">
                <div className="drinkColor">
                  <div className="color"></div>
                  <div className="drinkTitle">Solid <span className='countItem'>{solidData.length}</span></div>
                </div>
                <div className="snackColor">
                  <div className="color"></div>
                  <div className="snackTitle">Liquid <span className='countItem'>{liqData .length}</span></div>
                </div>
              </div>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Inventory;
