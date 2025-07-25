import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from "../components/core/HomePage/InstructorSection"
import Footer from "../components/common/Footer"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import ReviewSlider from '../components/common/ReviewSlider';

 const Home = () => {
  return (
    <div>
            {/* section1 */}

            <div className=' relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white '>
             {/* Link tag similar to anchor tag in html  */}
                <Link to={"/signup"}>
                     
                     <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                                transition-all duration-200 hover:scale-95 w-fit'>
                        <div className='flex items-center gap-4 rounded-full px-10 py-[5px]
                        transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                     </div>

                </Link>

                <div className='mt-7 text-center text-4xl font-semibold'>
                    Empower Your Future with
                    {/* coding skill ke color ko change krege with mutiple component insted of span   */}
                    <HighlightText text={"Coding Skills"}/>
                </div>


                <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                {/* making button */}
                <div className='flex gap-7 mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            Learn More
                        </CTAButton>

                        <CTAButton active={false} linkto={"/login"}>
                            Book a Demo
                        </CTAButton>
                </div>

                 {/* importing video  */}
                <div className=' mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200' >
                    <video 
                    className="shadow-[20px_20px_rgba(255,255,255)]"
                    muted
                    loop
                    autoPlay
                    // controls
                    //  width="600"
                    >

                    <source src={Banner} type="video/mp4"/>
                      
                    </video>
                </div>


                {/* code section 1 */}
                <div>
                    <CodeBlocks
                        position = {"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock Your
                                <HighlightText text={"coding potential"}/>
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }

                        ctabtn1={
                            {
                                btnText:"try it yourself",
                                linkto:"/signup",
                                active:true,
                            }
                        }

                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:"/login",
                                active:false,
                            }
                        }

                        codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><link rel="stylesheet" href="styles.css">\n</head>\n <body>\nh1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</a>\n<a href="three/">Three</a>\n</nav>\n`}

                        codeColor={"text-yellow-50"}

                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                 {/* code section 2 */}
                <div>
                    <CodeBlocks
                        position = {"lg:flex-row-reverse"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Start 
                                <HighlightText text={`coding`}/>
                                <br />
                                <HighlightText text={`in seconds`}/>
                            </div>
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }

                        ctabtn1={
                            {
                                btnText:"Continue Lesson",
                                linkto:"/signup",
                                active:true,
                            }
                        }

                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:"/login",
                                active:false,
                            }
                        }

                        codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><link rel="stylesheet" href="styles.css">\n</head>\n <body>\nh1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</a>\n<a href="three/">Three</a>\n</nav>\n`}

                        codeColor={"text-yellow-25"}

                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                <ExploreMore/>


            </div>

            {/* section2 */}
            
            <div className='bg-pure-greys-5 text-richblack-700'>

                 <div className='homepage_bg h-[310px]'>
                       
                        <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto'>
                               
                              <div className='h-[160px]'></div>

                              <div className='flex flex-row gap-7 text-white justify-center items-center'>
                                     <CTAButton active={true} linkto={"/signup"}>
                                           <div className='flex items-center gap-3'>
                                                Explore Full Catalog
                                                <FaArrowRight/> 
                                           </div>
                                           
                                     </CTAButton>

                                      <CTAButton active={false} linkto={"/signup"}>
                                           Learn More
                                     </CTAButton>
                              </div>

                        </div>

 

                 </div>

                 <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
                           
                          <div className='flex flex-row gap-20 mb-10 mt-[95px]  '>
                                 <div className='text-4xl font-semibold w-[45%]'>
                                         Get the Skills you need for about
                                         <HighlightText text={"Job that is in demand "}/>
                                </div>

                                <div className='flex flex-col gap-10 w-[40%] items-start '>
                                            <div className='text-[16px]'>
                                                     "The modern StudyNotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills."
                                            </div>

                                            <div>
                                                      <CTAButton active={true} linkto={"/signup"}>
                                                            Learn More
                                                      </CTAButton>
                                            </div>
                                </div>


                                
                          </div>



                          <TimelineSection/>


                          <LearningLanguageSection/>

                 </div>

                 



            </div>




            {/* section3 */}

             <div className='w-11/12 mx-auto max-w-maxcontent flex-col items-center gap-8 
                   first-letter bg-richblack-900 text-white'>

                   <InstructorSection/>

                   <h2 className='text-center text-4xl font-semibold mt-10'>Review from other Learners</h2>

                   {/* review slider here */}

                  <ReviewSlider/>

             </div>


            {/* footer */}

            <Footer/>




    </div>
  )
}

export default Home;
