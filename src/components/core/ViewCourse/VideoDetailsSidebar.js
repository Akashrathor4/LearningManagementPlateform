import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSidebar = ({setReviewModal}) => {
  
   const [activeStatus , setActiveStatus] = useState('');
   const [videoBarActive,setVideoBarActive] = useState('');
   const navigate = useNavigate();
   const {sectionId,subSectionId} = useParams();
   const location = useLocation();
   
   const {
      courseSectionData,
      courseEntireData,
      totalNoOfLectures,
      completedLectures, 
   } = useSelector((state)=>state.viewCourse);
 
   //use new syntax in use effecte
   useEffect(()=>{
     ;(()=>{
        if(!courseSectionData?.length)
            return;
        //currentSectionIndex ye data highlighting ke kaam aayega 
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
            (data) => data._id === subSectionId
        );


        // aab id chahiye li konse subsection ke video ko highlight karna hai 
        const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.
        [currentSubSectionIndex]?._id;
        // set current section here 
        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
        // set current subsection video here 
        setVideoBarActive(activeSubSectionId);
     })()
   },[courseSectionData,courseEntireData,location.pathname])


  return (
    <>
        <div>
            {/* for buttons and headings  */}
            <div className='text-white'>
                {/* for buttons  */}
                <div>
                      <div 
                      onClick={()=>{
                        navigate('/dashboard/enrolled-courses')
                      }}
                      >
                        Back
                      </div>

                      <div>
                        <IconBtn
                            text='Add Review'
                            onclick={()=>setReviewModal(true)}
                        />
                      </div>
                </div>
                {/* for heading or title  */}
                <div>
                    <p>{courseEntireData?.courseName}</p>
                    <p>{completedLectures?.length}/{totalNoOfLectures}</p>
                </div>
            </div>

            {/* for section and subsection  */}
            <div>
                {
                    courseSectionData?.map((section,index)=>{
                        return(
                            <div
                            onClick={()=>setActiveStatus(section?._id)}
                            key={index}
                            className='text-white'
                            >
                            {/* section 01     */}
                            
                            <div>
                                <div className='text-white'>
                                    {section?.sectionName}
                                </div>
                                {/* HW add narrorw icon here and handle rotate logic */}
                            </div>

                            {/* subSection */}
                            {/* subsection only tab dikhana jab current subsection par ho  */}
                            <div>
                               {
                                 activeStatus === section?._id && (
                                    <div>
                                       {
                                        section?.subSection?.map((topic,index)=>{
                                            return(
                                                <div
                                            className={`flex gap-5 p-5 ${
                                                videoBarActive === topic._id
                                                ? "bg-yellow-200 text-richblack-900":
                                                "bg-richblack-900 text-white"
                                            } text-white`}
                                            key={index}
                                            onClick={()=>{
                                                navigate(
                                                    `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                                                )
                                                setVideoBarActive(topic?._id);
                                            }}
                                            >
                                                <input
                                                    type='checkbox'
                                                    checked={completedLectures?.includes(topic?._id)}
                                                    onChange={()=>{}}
                                                />
                                                <span>
                                                    {topic.title}
                                                </span>
                                            </div>
                                            )
                                        })
                                       }
                                    </div>
                                 )
                               }
                            </div>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    </>
  )
}
export default VideoDetailsSidebar;
