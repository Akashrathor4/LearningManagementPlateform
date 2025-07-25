import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';



const tabsName =[
     "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {

      const [currentTab,setCurrentTab] = useState(tabsName[0]);
      const [courses,setCourses] = useState(HomePageExplore[0].courses);
      const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

      const setMyCards = (value) => {
           setCurrentTab(value);
          //  result is an array of matched object 
           const result = HomePageExplore.filter((course)=> course.tag === value) ;
           //  result[0].courses is an array of course
         

           setCourses(result[0].courses);
           setCurrentCard(result[0].courses[0].heading);
        
      }

  return (
   <div>
   
     <div className='text-4xl font-semibold text-center'>
            Unlock the 
            <HighlightText text={"Power of Code"}/>
     </div>

     <p className='text-center text-richblack-300 text-sm  mt-3 '>
        Learn to build anything you can imagine
     </p>

     <div className=' px-1 py-1 mt-5 flex rounded-full bg-richblack-800 mb-5 border '>
       {
           tabsName.map((Element , index) => {
                   return (
                       <div className={`text-[12px] flex flex-row items-center gap-2
                        
                        ${currentTab === Element ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200" } 
                        rounded-full transition-all duration-200 hover:text-richblack-5 hover:bg-richblack-900 px-7 py-1 cursor-pointer`}
                        key={index}
                        onClick={()=>setMyCards(Element)}
                       >
                           {Element}
                       </div>
                   )
           })
       }
     </div>

     <div className='lg:h-[230px]'></div>

     {/* course card ka group  */}

     <div className='lg:absolute gap-10 justify-center  flex  flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-7 mb-7 lg:px-0 px-3'>
        {
          courses.map((element,index)=>{
                  return(
                    <CourseCard
                      key={index}
                      cardData = {element}
                      currentCard = {currentCard}
                      setCurrentCard={setCurrentCard}
                    />
                  )
          })
        }
     </div>



   </div>
  )
}

export default ExploreMore;
