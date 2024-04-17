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
import Equipment from './Equipment';

const Inventory = () => {
  const [data, setData] = useState([])
  document.title = "Inventory"
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
    axios.get('https://backendcaps-7zrx.onrender.com/menuDetails')
      .then((res) => {
        setData(res.data);
      }).catch((err) => {
        console.log(err);
      });
  }, [data]);
  const [ingCount, setIng] = useState([])
  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/getIng')
      .then((res) => {
        setIng(res.data);
      }).catch((err) => {
        console.log(err);
      });
  }, [ingCount]);
  const [quer, setQuer] = useState('')
  const [navi, setNavi] = useState('All')
  const [navToTab, setNav] = useState(true)

  const CrofflesData = data.filter((item) => item.Category === "Croffles");
  const snacksData = data.filter((item) => item.Category === "Snacks");
  const NachosData = data.filter((item) => item.Category === "Nachos");
  const BurgerData = data.filter((item) => item.Category === "Burger");
  const CoffeeData = data.filter((item) => item.Category === "Coffee");
  const NonCoffeeData = data.filter((item) => item.Category === "Non-Coffee");
  const FruitTea = data.filter((item) => item.Category === "Fruit Tea");

  const datas = [
    { name: 'Group A', value: CrofflesData.length },
    { name: 'Group B', value: snacksData.length },
    { name: 'Group C', value: NachosData.length },
    { name: 'Group D', value: BurgerData.length },
    { name: 'Group E', value: CoffeeData.length },
    { name: 'Group F', value: NonCoffeeData.length },
    { name: 'Group G', value: FruitTea.length },
  ];

  const solidData = ingCount.filter((item) => item.Category === "Fresh");
  const liqData = ingCount.filter((item) => item.Category === "Frozen");
  const DriedData = ingCount.filter((item) => item.Category === "Dried");
  const PowderedData = ingCount.filter((item) => item.Category === "Powdered");
  const SlicedData = ingCount.filter((item) => item.Category === "Sliced");
  const SyrupData = ingCount.filter((item) => item.Category === "Syrup");

  const dataTwo = [
    { name: 'Group A', value: solidData.length },
    { name: 'Group B', value: liqData.length },
    { name: 'Group C', value: DriedData.length },
    { name: 'Group D', value: PowderedData.length },
    { name: 'Group E', value: SlicedData.length },
    { name: 'Group F', value: SyrupData.length },

  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#cc9999',  '#FF8042', '#8A2BE2', '  #960018'];
  const COLORTWO = ['#0088FE', '#00C49F', '#FFBB28', '#cc9999', '#FF8042', '#8A2BE2'];

  const COLORTHREE = ['#0088FE', '#00C49F', '#FFBB28', '#cc9999', '#FF8042', '#8A2BE2', '  #960018'];
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

  const [equipData, setEquipData] = useState([])

  useEffect(() => {
    axios.get('https://backendcaps-7zrx.onrender.com/EquipGet')
      .then((response) => {
        setEquipData(response.data)
      })
      .catch((error) => {
        //
      });
  }, [equipData]);

  const CookData = equipData.filter((item) => item.Type === "Cooking Equipment");
  const RefData = equipData.filter((item) => item.Type === "Refrigeration Equipment");
  const FoodData = equipData.filter((item) => item.Type === "Food Preparation Equipment");
  const StorageData = equipData.filter((item) => item.Type === "Storage Equipment");
  const CleaningData = equipData.filter((item) => item.Type === "Cleaning Equipment");
  const ServingData = equipData.filter((item) => item.Type === "Serving Equipment");
  const SafetyData = equipData.filter((item) => item.Type === "Safety  Equipment");


  const dataThree = [
    { name: 'Group A', value: CookData.length },
    { name: 'Group B', value: RefData.length },
    { name: 'Group C', value: FoodData.length },
    { name: 'Group D', value: StorageData.length },
    { name: 'Group E', value: CleaningData.length },
    { name: 'Group F', value: ServingData.length },
    { name: 'Group F', value: SafetyData.length },

  ];

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
              <div className={`Equipment ${navi === 'Equipment' ? 'activated' : ''}`}
                onClick={() => { setNavi('Equipment'); setNav(false) }}>
                Equipment
              </div>
            </div>
          </div>
          {navToTab ? (
            <Table query={quer} searchedItem={searchedItem} />
          ) : (
            navi === 'Ingredients' ? (
              <Ingredients searchedItem={itemName} />
            ) : (
              navi === 'Equipment' ? (
                <Equipment />
              ) : (
                <Caters />
              )
            )
          )}
        </div>
        <div className="secondInvCon">
          <div className="firstPie">
            <div className="pieTextForInv">
              Products
            </div>
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
                <div className="snackColor">
                  <div className="color"></div>
                  <div className="snackTitle">Snack <span className='countItem'>{snacksData.length}</span></div>
                </div>
                <div className="teaColor croffles">
                  <div className="color"></div>
                  <div className="teaTitle">Croffles <span className='countItem'>{CrofflesData.length}</span></div>
                </div>
                <div className="teaColor burger">
                  <div className="color"></div>
                  <div className="teaTitle">Burger <span className='countItem'>{BurgerData.length}</span></div>
                </div>
                <div className="teaColor Nachos">
                  <div className="color"></div>
                  <div className="teaTitle">Nachos <span className='countItem'>{NachosData.length}</span></div>
                </div>
                <div className="teaColor Coffee">
                  <div className="color"></div>
                  <div className="teaTitle">Coffee <span className='countItem'>{CoffeeData.length}</span></div>
                </div>
                <div className="teaColor NonCoffee">
                  <div className="color"></div>
                  <div className="teaTitle">Non-Coffee <span className='countItem'>{NonCoffeeData.length}</span></div>
                </div>
                <div className="teaColor Fruit">
                  <div className="color"></div>
                  <div className="teaTitle">Fruit Tea <span className='countItem'>{FruitTea.length}</span></div>
                </div>
              </div>
            </ResponsiveContainer>
          </div>

          <div className="secPie">
            <div className="pieTextForInv">
              Ingredients
            </div>
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
                  {dataTwo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORTWO[index % COLORTWO.length]} />
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
                  <div className="snackTitle">Liquid <span className='countItem'>{liqData.length}</span></div>
                </div>


                <div className="DriedColor colorIndicator">
                  <div className="color"></div>
                  <div className="snackTitle">Dried <span className='countItem'>{DriedData.length}</span></div>
                </div>


                <div className="PowderedColor colorIndicator">
                  <div className="color"></div>
                  <div className="snackTitle">Powdered <span className='countItem'>{PowderedData.length}</span></div>
                </div>

                <div className="SyrupColor colorIndicator">
                  <div className="color"></div>
                  <div className="snackTitle">Syrup <span className='countItem'>{SyrupData.length}</span></div>
                </div>

                <div className="SlicedColor colorIndicator">
                  <div className="color"></div>
                  <div className="snackTitle">Sliced <span className='countItem'>{SlicedData.length}</span></div>
                </div>

              </div>

            </ResponsiveContainer>
          </div>
          <div className="secPie">
            <div className="pieTextForInv">
              Equipment
            </div>
            <ResponsiveContainer
              className="pies"
              width="100%" height="50%">
              <PieChart width={400} height={400}>
                <Pie
                  className='piee'
                  data={dataThree}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataThree.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORTHREE[index % COLORTHREE.length]} />
                  ))}
                </Pie>
              </PieChart>

              <div className="colorCon">
                <div className="drinkColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[0], width: '20px', height: '20px' }}></div>
                  <div className="drinkTitle">Cooking Equipment <span className='countItem'>{CookData.length}</span></div>
                </div>

                <div className="snackColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[1], width: '20px', height: '20px' }}></div>
                  <div className="snackTitle">Refrigeration Equipment <span className='countItem'>{RefData.length}</span></div>
                </div>

                <div className="snackColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[2], width: '20px', height: '20px' }}></div>
                  <div className="snackTitle">Food Preparation <span className='countItem'>{FoodData.length}</span></div>
                </div>

                <div className="snackColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[3], width: '20px', height: '20px' }}></div>
                  <div className="snackTitle">Storage Equipment <span className='countItem'>{StorageData.length}</span></div>
                </div>

                <div className="snackColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[4], width: '20px', height: '20px' }}></div>
                  <div className="snackTitle">Cleaning Equipment <span className='countItem'>{CleaningData.length}</span></div>
                </div>

                <div className="snackColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[5], width: '20px', height: '20px' }}></div>
                  <div className="snackTitle">Serving Equipment <span className='countItem'>{ServingData.length}</span></div>
                </div>

                <div className="snackColor">
                  <div className="color" style={{ backgroundColor: COLORTHREE[6], width: '20px', height: '20px' }}></div>
                  <div className="snackTitle">Safety Equipment <span className='countItem'>{SafetyData.length}</span></div>
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
