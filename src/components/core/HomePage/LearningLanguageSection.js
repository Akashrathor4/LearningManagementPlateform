import React from 'react'
import HighlightText from './HighlightText';
import Know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "./Button"



const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px]'>

             <div className='flex flex-col gap-5 items-center'>

                    <div className='text-4xl font-semibold text-center '>
                                Your Swiss Knife for
                                <HighlightText text={"learning any language"}/>
                    </div>

                    <div className='text-center text-richblack-600 mx-auto text-base mt-3 w-[75%] capitalize'>
                          Using Spin makes learning multiple languages easy — with realistic voice-over in 20+ languages, progress tracking, custom schedules, and more.
                    </div>

                    <div className='flex flex-row items-center justify-center mt-5'>
                              <img 
                                 src={Know_your_progress}
                                 alt="KnowYourProgressImage" 
                                 className='object-contain -mr-32'  
                              />
                              <img 
                                 src={compare_with_others}
                                 alt="compare_with_others_Image" 
                                 className='object-contain'  
                              />
                              <img 
                                 src={plan_your_lesson}
                                 alt="plan_your_lesson_Image" 
                                 className='object-contain -ml-36'  
                              />
                    </div>

                    <div className='w-fit mb-7'>
                        <CTAButton active={true} linkto={"/signup"}>
                                <div>
                                    Learn More
                                </div>
                        </CTAButton>
                    </div>

             </div>

    </div>
  )
}

export default  LearningLanguageSection;

