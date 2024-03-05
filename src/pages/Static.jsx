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
import Cursor from '../comp/Cursor';
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

  document.querySelector('html').style.cursor = "none";

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
                                gsap.to('.abso',  {
                                  opacity: 1,
                                  duration: 1,
                                  onComplete: () => {
                                    gsap.to('.first', {
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

  return (
    <div>
      <Bg />
      <div className="loader">
        <div className="loads">
          <img src={loader} alt="" />
        </div>
        <div className="loaderText">
          Loading {perc}%
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
              verified ?  nav('/system') : nav('/login');
            }}
          >
            {verified ? user ? <>Go to system</> : <>Sign in</> : <>Sign in</>}
          </button>
          <button 
          onClick={() => {
            nav('/register')
          }}
          className="login">Register</button>
          <button className="about">About</button>
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
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem porro doloribus ratione veniam inventore nobis est aliquid odio officia explicabo incidunt, commodi quia reiciendis ea sint? Nostrum accusantium modi illum!
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
                    <p>Lorem ipsum, dolor sit amet consectetur<br />
                      adipisicing elit. Facilis, commodi.</p>
                  </div>
                  <div className="gridsSec firstBtn">
                    <button onClick={() => {nav('/system/Inventory')}}>visit</button>
                  </div>
                </div>
                <div className="gridz">
                  <div className="gridzFirst">
                    <div className="gridsText">
                      Improved<br />
                      Customer<br />
                      Service
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur,
                      adipisicing elit. Exercitationem, error.</p>
                  </div>
                  <div className="gridzSec firstBtn">
                    <button onClick={() => {nav('/system/menu')}}>visit</button>
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
                    <p>Lorem ipsum dolor sit amet  consectetur adipisicing elit.   Quod libero obcaecati necessitatibus
                      facilis nam reiciendis!</p>
                  </div>
                  <div className="secGridTwo twos">
                    <button className='secBtn' onClick={() => {nav('/system/Security')}} >visit</button>
                  </div>
                </div>
                <div className="secGridSec">
                  <div className="secGridzFirst">
                    <div className="gridsText">
                      REPORTS
                    </div>
                    <p>Lorem ipsum dolor sit amet<br />
                      consectetur adipisicing elit. Ab, tempore!</p>
                  </div>
                  <div className="twos">
                    <button className='secBtn' onClick={() => {nav('/system/Report')}}>visit</button>
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
                  <button onClick={() => {nav('/system/menu')}} >visit</button>
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
                  <button onClick={() => {nav('/system/Reports')}}>visit</button>
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
          <Swiper className="peopleCon">
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
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse mollitia amet porro sit suscipit, minima placeat culpa voluptatum repudiandae nihil repellendus, iure rem, eligendi labore perspiciatis asperiores in dolorum quos?</p>
                  <button>View profile</button>
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
                  <button>View profile</button>
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
                  <button>View profile</button>
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
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse mollitia amet porro sit suscipit, minima placeat culpa voluptatum repudiandae nihil repellendus, iure rem, eligendi labore perspiciatis asperiores in dolorum quos?</p>
                  <button>View profile</button>
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
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse mollitia amet porro sit suscipit, minima placeat culpa voluptatum repudiandae nihil repellendus, iure rem, eligendi labore perspiciatis asperiores in dolorum quos?</p>
                  <button>View profile</button>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>



        <div className="third">
          <div className="reachOut">

            <div className="reachTexts">
              <div className="reachText">
                CONTACT THE <span>DEVS! </span>
              </div>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus vero repudiandae itaque, laborum dolorum iure id temporibus eum pariatur, ab fugit quo quos, accusamus iste at tempora ex facilis earum.</p>
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
        <div className="fourth">

        </div>
      </div>
    </div>
  );
};

export default Static;
