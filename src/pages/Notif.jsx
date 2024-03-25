import React, { useState, useEffect } from 'react';
import Sidebar from '../comp/Sidebar';
import axios from 'axios';
import moment from 'moment'

const Notif = () => {
    const [loading, setLoading] = useState(false);
    const [bannedUsers, setBannedUsers] = useState([]);
    const [menuUpdates, setMenuUpdates] = useState([]);
    const [ingredientUpdates, setIngredientUpdates] = useState([]);
    const [equipUpdates, setEquipment] = useState([])
    const [deletedInfo, setDelInfo] = useState([])
    const [deletedEquip, setDeletedEquip] = useState([])
    const [DeletedIng, setDeletedIng] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
            .then((response) => {
                setLoading(true);
                const bannedUsersData = response.data.filter((item) => item.isBanned === true);
                setBannedUsers(bannedUsersData);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get('http://localhost:8080/GetDel')
            .then((response) => {
                setLoading(true);
                setDelInfo(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
        axios.get('http://localhost:8080/GetDelIng')
            .then((response) => {
                setLoading(true);
                setDeletedIng(response.data)
            })
            .catch((error) => {
                console.log(error);
            });


        axios.get('http://localhost:8080/GetDelEq')
            .then((response) => {
                setLoading(true);
                setDeletedEquip(response.data)
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get('http://localhost:8080/menuDetails')
            .then((res) => {
                setMenuUpdates(res.data);
            }).catch((err) => {
                console.log(err);
            });


        axios.get('http://localhost:8080/getIng')
            .then((res) => {
                setIngredientUpdates(res.data);
            }).catch((err) => {
                console.log(err);
            });


        axios.get('http://localhost:8080/EquipGet')
            .then((res) => {
                setEquipment(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }, []);



    const [repData, setRep] = useState([])




    useEffect(() => {
        axios.get('http://localhost:8080/getReports')
            .then((resp) => {
                setRep(resp.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [repData])


    const [navTab, setTab] = useState('Products')
    const [seeDel, setSeeDel] = useState(false)
    const [renderDel, setRender] = useState('')
    return (
        <div className='NotifPage'>
            <Sidebar />

            <div className="notifCon">
                <div className="notifHeader">
                    <div className={`notifItems ${navTab === 'Products' && 'navi'}`} onClick={() => { setTab('Products') }}>
                        Products
                    </div>
                    <div className={`notifItems ${navTab === 'Ingredients' && 'navi'}`} onClick={() => { setTab('Ingredients') }}>
                        Ingredients
                    </div>
                    <div className={`notifItems ${navTab === 'Equipments' && 'navi'}`} onClick={() => { setTab('Equipments') }}>
                        Equipments
                    </div>
                    <div className={`notifItems ${navTab === 'Reports' && 'navi'}`} onClick={() => { setTab('Reports') }}>
                        Reports
                    </div>
                    <div className={`notifItems ${navTab === 'Security' && 'navi'}`} onClick={() => { setTab('Security') }}>
                        Security
                    </div>
                </div>

                <div className="notifContent">
                    {
                        navTab === 'Products' &&
                        <>
                            {menuUpdates.slice().reverse().map((item) => (

                                <div className="menuUpdates notifItem" key={item._id}>
                                    <div className="firstUpdate">
                                        <span>{item.Email}</span> added <span>{item.ProductName}</span> in products
                                    </div>
                                    <div className="secUp">
                                        on {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                                    </div>
                                </div>
                            ))}
                            {deletedInfo.slice().reverse().map((item) => (

                                <div className="menuUpdates notifItem dels" key={item._id}>
                                    <div className="firstUpdate">
                                        <span>{item.DeletedFullname}</span> deleted <span>{item.DeletedProductName} </span>
                                        from menu
                                    </div>
                                    <div className="secUp">
                                        on {moment(new Date(parseInt(item.DeletedDate, 10))).format('MMMM Do YYYY, h:mm a')}
                                    </div>
                                    {seeDel && renderDel === item._id && (
                                        <div className="moreDetails">
                                            <div className="itemz">
                                                ProductName: {item.DeletedProductName}
                                            </div>
                                            <div className="itemz">
                                                Category: {item.DeletedCategory}
                                            </div>
                                            <div className="itemz">
                                                Weight: {item.DeletedWeight}
                                            </div>
                                            <div className="itemz">
                                                Quantity: {item.DeletedQuantity}
                                            </div>
                                            <div className="itemz">
                                                Expiration date: {item.DeletedExpiryDate}
                                            </div>
                                            <div className="itemz">
                                                Condition: {item.DeletedCondition}
                                            </div>
                                            <div className="itemz">
                                                Max Quantity: {item.DeletedOverQuan}
                                            </div>
                                            <div className="itemz">
                                                Email: {item.DeletedEmail}
                                            </div>
                                        </div>
                                    )}

                                    {renderDel === item._id ? (
                                        <button className='moreInf' onClick={() => { setSeeDel({ ...seeDel, [item._id]: false }); setRender(null) }}>
                                            close
                                        </button>
                                    ) : (
                                        <button className='moreInf' onClick={() => { setSeeDel({ ...seeDel, [item._id]: !seeDel[item._id] }); setRender(item._id) }}>
                                            More info
                                        </button>
                                    )}

                                </div>
                            ))}
                        </>

                    }
                    {
                        navTab === 'Security' &&
                        bannedUsers.slice().reverse().map((item) => (
                            <div className="bannedUsers notifItem" key={item._id}>
                                <div className="firstBan">
                                    Owner archived <span>{item.Email}</span>
                                </div>
                            </div>
                        ))
                    }

                    {
                        navTab === 'Ingredients' &&
                        <>
                            {
                                ingredientUpdates.slice().reverse().map((item) => (
                                    <div className="ingredientUpdates notifItem" key={item._id}>
                                        <div className="firstUpdate">
                                            <span>{item.Email}</span> added <span>{item.IngName}</span> in Ingredients
                                            <div className="secUp">
                                                on {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                                            </div>
                                        </div>
                                        
                                    </div>
                                ))
                            }
                              {
                                DeletedIng.slice().reverse().map((item) => (
                                    <div className="ingredientUpdates notifItem dels" key={item._id}>
                                        <div className="firstUpdate">
                                        <div className="firstUpdate">
                                        <span>{item.DeletedFullname}</span> deleted <span>{item.DeletedIngName} </span>
                                        from menu
                                    </div>
                                    <div className="secUp">
                                        on {moment(new Date(parseInt(item.DeletedDate, 10))).format('MMMM Do YYYY, h:mm a')}
                                    </div>
                                        </div>
                                        
                                        {seeDel && renderDel === item._id && (
                                        <div className="moreDetails">
                                            <div className="itemz">
                                                Ingredient Name: {item.DeletedIngName}
                                            </div>
                                            <div className="itemz">
                                                Weight: {item.DeletedWeight}
                                            </div>
                                            <div className="itemz">
                                                Type: {item.DeletedCategory}
                                            </div>
                                            <div className="itemz">
                                                Measure: {item.DeletedMeasure}
                                            </div>
                                            <div className="itemz">
                                                Quantity: {item.DeletedQuantity}
                                            </div>
                                            <div className="itemz">
                                                Email: {item.DeletedEmail}
                                            </div>
                                        </div>
                                    )}

                                    {renderDel === item._id ? (
                                        <button className='moreInf' onClick={() => { setSeeDel({ ...seeDel, [item._id]: false }); setRender(null) }}>
                                            close
                                        </button>
                                    ) : (
                                        <button className='moreInf' onClick={() => { setSeeDel({ ...seeDel, [item._id]: !seeDel[item._id] }); setRender(item._id) }}>
                                            More info
                                        </button>
                                    )}
                                    </div>
                                ))
                            }
                        </>
                    }
                    {
                        navTab === 'Reports' &&
                        repData.slice().reverse().map((item) => (
                            <div className="ingredientUpdates notifItem" key={item._id}>
                                <div className="firstUpdate">
                                    <span>{item.Email}</span> added <span>{item.Incident}</span> in Reports
                                    <div className="secUp">
                                        on {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        navTab === 'Equipments' &&
                        <>
                            {equipUpdates.slice().reverse().map((item) => (
                                <div className="ingredientUpdates notifItem" key={item._id}>
                                    <div className="firstUpdate">
                                        <span>{item.Name}</span> added <span>{item.Incident}</span> in Reports
                                        <div className="secUp">
                                            on {moment(new Date(parseInt(item.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {deletedEquip.slice().reverse().map((item) => (
                                <div className="ingredientUpdates notifItem dels" key={item._id}>
                                    <div className="firstUpdate">
                                        <span>{item.DeletedFullname}</span> deleted <span>{item.DeletedEquipmentName} </span>
                                        from menu
                                    </div>
                                    <div className="secUp">
                                        on {moment(new Date(parseInt(item.DeletedDate, 10))).format('MMMM Do YYYY, h:mm a')}
                                    </div>
                                    {seeDel && renderDel === item._id && (
                                        <div className="moreDetails">
                                            <div className="itemz">
                                                Equipment Name: {item.DeletedEquipmentName
                                                }
                                            </div>
                                            <div className="itemz">
                                                Type: {item.DeletedType}
                                            </div>
                                            <div className="itemz">
                                                Usage: {item.DeletedUsage}
                                            </div>
                                            <div className="itemz">
                                                Condition: {item.DeletedCondition}
                                            </div>
                                            <div className="itemz">
                                                Location: {item.DeletedLocation}
                                            </div>
                                            <div className="itemz">
                                                Brand: {item.DeletedBrand}
                                            </div>
                                        </div>
                                    )}

                                    {renderDel === item._id ? (
                                        <button className='moreInf' onClick={() => { setSeeDel({ ...seeDel, [item._id]: false }); setRender(null) }}>
                                            close
                                        </button>
                                    ) : (
                                        <button className='moreInf' onClick={() => { setSeeDel({ ...seeDel, [item._id]: !seeDel[item._id] }); setRender(item._id) }}>
                                            More info
                                        </button>
                                    )}
                                </div>
                            ))}
                        </>
                    }
                </div>

            </div>
        </div>
    );
};

export default Notif;
