import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authentication } from '../authentication';
import { onAuthStateChanged } from 'firebase/auth';
import logo from '../images/logo.jpg';
import third from '../images/third.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import vid from '../images/hoverOne.mp4'
import loader from '../images/loader.png'
import bookmark from '../images/bookMark.png'
import Bg from '../comp/Bg';
import emailjs from '@emailjs/browser';
import ms from '../images/ms.jpg'
import milkTea from '../images/milkTea.png'
import Spline from '@splinetool/react-spline';
import pictureOne from '../images/jm.jpg'
import pictureTwo from '../images/dm.jpg'
import pictureThree from '../images/gb.JPG'
import ReactLogo from '../images/React.png'
import javaScriptLogo from '../images/JavaScript.png'
import gsapLogo from '../images/greensock_2x-removebg-preview.png'
import lenisLogo from '../images/lenis-new-smooth-scroll-library-removebg-preview.png'
import axiosLogo from '../images/91-913031_axios-axios-logo-hd-png-download-removebg-preview.png'
import postManLogo from '../images/postman-icon-497x512-beb7sy75-removebg-preview.png'
import cssLogo from '../images/kisspng-cascading-style-sheets-logo-css3-html-javascript-5cac98c601a161.7443571115548151740067-removebg-preview.png'
import reactRouterLogo from '../images/image-82-removebg-preview.png'
import momentLogo from '../images/moment.png'
import nodeLog from '../images/nodejs-icon-512x512-vl7ew1eg-removebg-preview.png'
import nodemonLogo from '../images/nodemon-logo-png-transparent-removebg-preview.png'
import expressLogo from '../images/express-removebg-preview.png'
import firebaseLogo from '../images/firebase-removebg-preview.png'
import mongoLogo from '../images/mongoDb-removebg-preview.png'
import Marquee from 'react-fast-marquee'
import mapAbsoImg from '../images/Map_symbol_location_02 (1).png'
import shopEmploee from '../images/shop.jpg'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet';

const Static = () => {
  const hoverz = useRef(null)
  const lenis = new Lenis()

  lenis.on('scroll', (e) => {

  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
  const nav = useNavigate();
  const [user, setUser] = useState('');

  useEffect(() => {
    document.title = 'Cafe Eunoia | Homepage';
    const unsub = onAuthStateChanged(authentication, (acc) => {
      if (acc) {
        setUser(acc);
      }
    });
    return () => unsub();
  }, [user]);

  const cursors = useRef(null)


  useEffect(() => {

    hoverz.current.onmouseover = () => {
      gsap.to('.cozy', {
        background: "black",
        color: "white",
      })
      document.onmousemove = (e) => {
        gsap.to(cursors.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
        });
      }
      gsap.to('.vids', {
        opacity: "1",
        duration: 0.5
      })
    }

    hoverz.current.onmouseleave = () => {
      gsap.to('.cozy', {
        background: "transparent",
        color: "white"
      })
      gsap.to('.vids', {
        opacity: "0",
        duration: 0.5
      })
      document.onmousemove = (e) => {
        gsap.to(cursor.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
        });
      }

    }
  }, [])


  const cursor = useRef(null)

  document.onmousemove = (e) => {
    gsap.to(cursor.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
    });
  }
  const [perc, setPerc] = useState(0)
  const tl = gsap.timeline()

  useEffect(() => {
    const interval = setInterval(() => {
      setPerc(prevPerc => {
        if (prevPerc < 100) {
          gsap.to('.loads img', {
            opacity: prevPerc / 100,
          });
          if (prevPerc === 99) {
            tl.to('.loads img', 0.5, {
              y: '-20px'
            }).to('.loads img', 0.5, {
              y: '0px',
              onComplete: () => {
                gsap.to('.loader', 1, {
                  y: "-100vh",
                  delay: 0.5
                })
                gsap.to('.loaderTwo', 1, {
                  y: "-200vh",
                  delay: 0.6,
                  onComplete: () => {
                    gsap.to('.loaderTwo', {
                      display: "none"
                    })
                    gsap.to('h1', {
                      opacity: 1,
                      duration: .8,
                      onComplete: () => {
                        gsap.to('.btnBot', {
                          opacity: 1,
                          onComplete: () => {
                            gsap.to('.abso', {
                              opacity: 1,
                              duration: 1,
                              onComplete: () => {
                                gsap.to('.Con', {
                                  opacity: 1,
                                  duration: 1
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            });
          }
          return prevPerc + 1;
        } else {
          clearInterval(interval);
          return prevPerc;
        }
      });
    }, 10);
    return () => clearInterval(interval);
  }, [perc]);

  const form = useRef()
  const nameInput = useRef()

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_14tu68a',
      'template_0nduef6',
      form.current,
      'ndVT_EB_jV7bGsfD9')
      .then((result) => {
        console.log(result.text);
        gsap.to('.complete', {
          display: 'block'
        })
        setTimeout(() => {
          gsap.to('.complete', {
            display: 'none'
          })
        }, 2000);
      }, (error) => {
        console.log(error.text);
      });
    e.target.reset()
    gsap.to('.Complete', {
      display: "flex"
    })
    setTimeout(() => {
      gsap.to('.Complete', {
        display: "none"
      })
    }, 3000)
  };


  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const unSub = onAuthStateChanged(authentication, (user) => {
      if (user) {
        if (!user.emailVerified) {
          setVerified(false)
        } else {
          setVerified(true)
        }
      }
    });

    return () => unSub();

  }, [nav]);


  const [SlideHori, setSlide] = useState(false)
  const goHori = useRef(null)

  const slideLeft = () => {
    gsap.to('.absoHover', {
      x: 0,
      duration: 0.8,
      backgroundColor: "#cc9999"
    });
    gsap.to('.firstMap', {
      opacity: 0,
      x: 100,
      duration: 0.5
    })
    gsap.to('.secMap', {
      opacity: 1,
      x: 0
    })
    setSlide(!SlideHori)
  };

  const slideRight = () => {
    gsap.to('.absoHover', {
      x: "100%",
      backgroundColor: "#3A5311",
      duration: 0.8
    });

    gsap.to('.firstMap', {
      opacity: 1,
      x: 0
    })
    gsap.to('.secMap', {
      opacity: 0,
      x: -100
    })
    setSlide(!SlideHori)

  };

  const milkTeas = L.icon({
    iconUrl: milkTea,
    iconSize: [40, 40], // Adjust the size of the icon as needed
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
  });

  return (
    <div className='staticHome'>
      <Bg />
      <div className="loader">
        <div className="loads">
          <img src={loader} alt="" />
        </div>
        <div className="bars">
            <div className="progressBar" style={{width: perc+"%"}}>
            <div className="loaderText">
          {perc}%
        </div>
            </div>
        </div>
      </div>
      <div className="loaderTwo"></div>
      <div className='cursor' ref={cursor}></div>
      <div
        ref={cursors}
        className="vids">
        <video
          className='hovers'
          autoPlay
          muted
          loop
          src={vid} />
      </div>
      <header>
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="right">
          <button
            className="login"
            onClick={() => {
              verified ? nav('/system') : nav('/login');
            }}
          >
            {verified ? user ? <>Go to system</> : <>Sign in</> : <>Sign in</>}
          </button>
          {user ? (<></>) : (<button
            onClick={() => {
              nav('/register')
            }}
            className="login">Register</button>)}
          <button className="about" onClick={() => { window.location = "#contact" }}>Contact us</button>
        </div>
      </header>
      <div className="big">
        <div className="abso">
          <Spline
            className='.abso'
            scene="https://prod.spline.design/FHLnU6mxr1YiKLxs/scene.splinecode" />
        </div>
        <h1>
          your <span
            ref={hoverz}
            className='cozy'>cozy</span> and <span className="spanTwo">comfy</span> <br />
          neighborhood cafe
        </h1>
        <div className="btnBot">

          Welcome to Cafe Eunoia, your cozy neighborhood cafe with a high-tech twist. Enjoy delicious coffee and snacks while our innovative system keeps things running smoothly. It's the perfect blend of comfort and convenience.
        </div>
      </div>
      <div className="Con">
        <div className="first">
          <div className="bookMarkFirst">
            <img src={bookmark} alt="" />
          </div>
          <Swiper
            autoplay={{
              delay: 2000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false
            }}
            className="swiper"
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
          >
            <SwiperSlide className="swipes infor">
              <div className="firstGrid">
                <div className="grids">
                  <div className="gridsFirst once">
                    <div className="gridsText">
                      REALTIME  <br />
                      INVENTORY <br />
                      UPDATE
                    </div>
                    <p>Indulge in the cozy ambiance while staying connected to our latest inventory updates.</p>
                  </div>
                  <div className="gridsSec firstBtn">
                    <button onClick={() => { nav('/system/Inventory') }}>visit</button>
                  </div>
                </div>
                <div className="gridz">
                  <div className="gridzFirst">
                    <div className="gridsText">
                      Improved<br />
                      Customer<br />
                      Service
                    </div>
                    <p>Discover our commitment to providing exceptional service, ensuring your satisfaction with every visit.</p>
                  </div>
                  <div className="gridzSec firstBtn">
                    <button onClick={() => { nav('/system/menu') }}>visit</button>
                  </div>
                </div>
              </div>
              <div className="secondGrid">
                <div className="secGridFirst">
                  <div className="secGridUna ones">
                    <div className="gridsText">
                      Robust<br />
                      Security
                    </div>
                    <p>Relax and enjoy your time knowing that your safety and privacy are our top priorities.</p>
                  </div>
                  <div className="secGridTwo twos">
                    <button className='secBtn' onClick={() => { nav('/system/Security') }} >visit</button>
                  </div>
                </div>
                <div className="secGridSec">
                  <div className="secGridzFirst">
                    <div className="gridsText">
                      REPORTS
                    </div>
                    <p>Stay informed with detailed reports on inventory issues, providing transparency and efficiency in problem-solving</p>
                  </div>
                  <div className="twos">
                    <button className='secBtn' onClick={() => { nav('/system/Report') }}>visit</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="swipes newSlide" id='newSlide'>
              <div className="firstSlide">
                <div className="gridzFirst">
                  <div className="gridsText">
                    Improve<br />
                    Customer<br />
                    Service
                  </div>
                  <p>Lorem ipsum dolor sit amet consectetur,
                    adipisicing elit. Exercitationem, error.</p>
                </div>
                <div className="gridzSec">
                  <button onClick={() => { nav('/system/menu') }} >visit</button>
                </div>
              </div>
              <div className="secSlide">
                <div className="secGridzFirst">
                  <div className="gridsText">
                    REPORTS
                  </div>
                  <p>Lorem ipsum dolor sit amet<br />
                    consectetur adipisicing elit. Ab, tempore!</p>
                </div>
                <div className="twos">
                  <button onClick={() => { nav('/system/Reports') }}>visit</button>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="swipes">
              <img src={third} alt="" />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="second">
          <div className="secondAbso">
            <img src={milkTea} alt="" />
          </div>
          <div className="title">
            <span>THE TEAM BEHIND THIS</span> <span className='spans'>PROJECT</span>
          </div>
          <Swiper className="peopleCon" id='about'>
            <SwiperSlide className='peopleSlide'>
              <div className="people">
                <div className="peopleFirst">
                  <div className="pfp">
                    <img src={ms} alt="" />
                  </div>
                </div>
                <div className="peopleInf">
                  <div className="name">Marcus Salopaso</div>
                  <div className="pos">Programmer/Leader</div>
                  <p>Hello, I'm Marcus! I'm a full-stack developer, passionate about creating interactive websites. With a keen eye for design and a knack for problem-solving, I turn ideas into reality, bringing them to life across the entire stack, from front-end to back-end.</p>
                  <button onClick={() => { window.open('https://marcusxro.github.io/', '_blank') }}>View Portfolio</button>


                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className='peopleSlide'>
              <div className="people">
                <div className="peopleFirst">
                  <div className="pfp">
                    <img src={pictureOne} alt="" />
                  </div>
                </div>
                <div className="peopleInf">
                  <div className="name">JM Geda</div>
                  <div className="pos">Database</div>
                  <p>Hi, Everyone! This is Data Analyst of this project, who will be monitor & analyze for the organizing data and security</p>
                  <button onClick={() => { window.open('https://jeemdevvv.github.io/portfolio/', '_blank') }}>View Portfolio</button>

                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className='peopleSlide'>
              <div className="people">
                <div className="peopleFirst">
                  <div className="pfp">
                    <img src={pictureThree} alt="" />
                  </div>
                </div>
                <div className="peopleInf">
                  <div className="name">Gabrielle allen Tugay Espejo</div>
                  <div className="pos">Documentation</div>
                  <p>Hello, I'm the documenter for this group. As part of our research study, I'm assigned to be in charge of all the writings and interview studies about the improvements at this cafe. One thing about me is that I love matcha. I also recommend trying their biscoff croffles. I'm so obsessed with that.</p>
                  <button onClick={() => { window.open('https://www.facebook.com/profile.php?id=100082564345261', '_blank') }}>View Profile</button>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className='peopleSlide'>
              <div className="people">
                <div className="peopleFirst">
                  <div className="pfp">
                    <img src={pictureTwo} alt="" />
                  </div>
                </div>
                <div className="peopleInf">
                  <div className="name">Denmark Salvador</div>
                  <div className="pos">System analyst</div>
                  <p>Denmark Salvador
                    Hi, im Denmark and im the system analyst for this group. My job is to maintain software systems and im also checking if there's improvement needed in our system.</p>
                  <button onClick={() => { window.open('https://www.facebook.com/denmark.salvador.5070', '_blank') }}>View Profile</button>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className='peopleSlide'>
              <div className="people">
                <div className="peopleFirst">
                  <div className="pfp"></div>
                </div>
                <div className="peopleInf">
                  <div className="name">Marc Kevin Del Mundo</div>
                  <div className="pos">System Design</div>
                  <p>Hello, I am the system designer of this system, and I focus on designing the panel interface and user experience. My role is to ensure that the system is intuitive, efficient, and visually appealing for all users.</p>
                  <button onClick={() => { window.open('https://www.facebook.com/marckevin.delmundo.5', '_blank') }}>View Profile</button>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="techs">
          <div className="techTitle">
            <Marquee pauseOnHover>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
              <div className="textMarq">
                <span></span> TECHNOLOGIES WE USED
              </div>
            </Marquee>
          </div>
          <div className="techContent">
            <div className="techCon">
              <div className="techItems">
                <div className="techItemsTitle">
                  Front-End
                </div>

                <div className="techItemCon">
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={ReactLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      React
                    </div>
                  </div>

                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={javaScriptLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      JavaScript
                    </div>
                  </div>

                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={gsapLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Gsap
                    </div>
                  </div>

                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={lenisLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Lenis
                    </div>
                  </div>

                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={axiosLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Axios
                    </div>
                  </div>

                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={cssLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Css
                    </div>
                  </div>

                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={reactRouterLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Moment
                    </div>
                  </div>


                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={momentLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      React Router
                    </div>
                  </div>

                </div>
              </div>

              <div className="techItems">
                <div className="techItemsTitle">
                  API Testing
                </div>


                <div className="techItemCon centered">
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={postManLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Postman
                    </div>
                  </div>
                </div>


              </div>

              <div className="techItems">
                <div className="techItemsTitle">
                  Back-End
                </div>
                <div className="techItemCon">
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={nodeLog} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Node
                    </div>
                  </div>
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={firebaseLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Firebase
                    </div>
                  </div>
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={nodemonLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Nodemon
                    </div>
                  </div>
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={expressLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      Express
                    </div>
                  </div>
                  <div className="techItemFromCon">
                    <div className="techLogo">
                      <img src={mongoLogo} alt="" />
                    </div>
                    <div className="techItemDesc">
                      MongoDB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Swiper
            autoplay={{
              delay: 2000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false
            }}
            className="techSwiper"
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}>
            <SwiperSlide>
              <div className="techTitle">
                Front-End
              </div>
              <div className="techItemCon">
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={ReactLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    React
                  </div>
                </div>

                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={javaScriptLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    JavaScript
                  </div>
                </div>

                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={gsapLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Gsap
                  </div>
                </div>

                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={lenisLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Lenis
                  </div>
                </div>

                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={axiosLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Axios
                  </div>
                </div>

                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={cssLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Css
                  </div>
                </div>

                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={reactRouterLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Moment
                  </div>
                </div>


                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={momentLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    React Router
                  </div>
                </div>

              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="techTitle">
                API tester
              </div>
              <div className="techItemCon">
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={postManLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Postman
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="techTitle">
                Back-end
              </div>
              <div className="techItemCon">
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={nodeLog} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Node
                  </div>
                </div>
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={firebaseLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Firebase
                  </div>
                </div>
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={nodemonLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Nodemon
                  </div>
                </div>
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={expressLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    Express
                  </div>
                </div>
                <div className="techItemFromCon">
                  <div className="techLogo">
                    <img src={mongoLogo} alt="" />
                  </div>
                  <div className="techItemDesc">
                    MongoDB
                  </div>
                </div>
              </div>

            </SwiperSlide>
          </Swiper>
        </div>
        <div className="map">
          <div className="mapAbso">
            <img src={mapAbsoImg} alt="" />
          </div>
          <div className="mapContent">
            <div ref={goHori} className="absoHover">
              <div className="hoverText">

                {
                  SlideHori === false ? (
                    <> Our shop is located exactly at 4103 Cafe Eunoia, Greengate homes, Imus Cavite <br />
                      You can start interacting with the map!
                    </>
                  ) : (
                    <>
                    This is the hardworking employees of Cafe Eunoia!
                    </>
                  )
                }
              </div>
              {SlideHori === false ? (
                <div className="hoverButton" onClick={slideRight}>
                  <div className="hoverButtonText btnClass">
                    Kindly click the "navigate" to see the next slide!
                  </div>
                  <div className="hoverBtn btnClass">
                    NAVIGATE
                  </div>
                </div>
              ) : (
                <div className="hoverButton" onClick={slideLeft}>
                  <div className="hoverButtonText btnClass">
                    Kindly click the "navigate" to see the next slide!
                  </div>
                  <div className="hoverBtn btnClass">
                    NAVIGATE
                  </div>
                </div>
              )}
            </div>

            <div className="firstMap">
              <img src={shopEmploee} alt="" />
            </div>
            <div className="secMap">
              <MapContainer className='mapEl' center={[14.3747447, 120.9254805]} zoom={20} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[14.3747447, 120.9254805]} icon={milkTeas}>
                  <Popup>
                    Greengate Homes, Imus, 4103 Cafe Eunoia
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
        <div className="third">
          <div className="reachOut">

            <div className="reachTexts">
              <div className="reachText">
                CONTACT THE <span>DEVS! </span>
              </div>
              <p>Have something to share or a question to ask? Our friendly and knowledgeable development team is here to help! Whether you're curious about our latest features or need assistance with any aspect of our service, we're just a message away.</p>
            </div>

            <form
              ref={form} onSubmit={sendEmail}>
              <div className="complete">
                your message has been sent!
              </div>
              <div className='firstForm'>
                <input ref={nameInput} type='text' placeholder='FULL NAME' name='user_name' required></input>
                <input type='email' placeholder='EMAIL' name='user_email' required></input>
                <input type='text' placeholder='SUBJECT' name='subject'></input>
              </div>
              <textarea
                className='message'
                placeholder='MESSAGE' name='message'></textarea>
              <button className='sendBtn' type='submit'>send</button>
            </form>
          </div>
        </div>
        z
        <div className="fourth" id='contact'>

        </div>
      </div>
    </div>
  );
};

export default Static;
