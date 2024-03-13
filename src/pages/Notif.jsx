import React, { useState, useEffect } from 'react';
import Sidebar from '../comp/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notif = () => {
    const [loading, setLoading] = useState(false);
    const [bannedUsers, setBannedUsers] = useState([]);
    const [menuUpdates, setMenuUpdates] = useState([]);
    const [ingredientUpdates, setIngredientUpdates] = useState([]);

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

    return (
        <div className='NotifPage'>
            <Sidebar />
            <div className="notifCon">
                {/* Render banned users */}
                {bannedUsers.map((item) => (
                    <div className="bannedUsers notifItem" key={item._id}>
                        <div className="firstBan">
                            Owner banned <span>{item.Email}</span>
                        </div>
                    </div>
                ))}

                {/* Render menu updates */}
                {menuUpdates.map((item) => (
                    <div className="menuUpdates notifItem" key={item._id}>
                        <div className="firstUpdate">
                            <span>{item.Email}</span> added <span>{item.ProductName}</span> in menu
                        </div>
                    </div>
                ))}

                {/* Render ingredient updates */}
                {ingredientUpdates.map((item) => (
                    <div className="ingredientUpdates notifItem" key={item._id}>
                        <div className="firstUpdate">
                            <span>{item.Email}</span> added <span>{item.IngName}</span> in Ingredients
                        </div>
                    </div>
                ))}
                     {/* Render ingredient updates */}
                     {repData.map((item) => (
                    <div className="ingredientUpdates notifItem" key={item._id}>
                        <div className="firstUpdate">
                            <span>{item.Email}</span> added <span>{item.Incident}</span> in Reports
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notif;
