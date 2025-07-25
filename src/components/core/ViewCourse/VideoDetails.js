import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
// import 'video-react/styles/scss/video-react';
import 'video-react/dist/video-react.css';
import { FaPlayCircle } from "react-icons/fa";
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {

  const {courseId , sectionId , subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData , courseEntireData , completedLectures} = useSelector((state)=>state.viewCourse);
//    video ko content krne ke liye flag 
  const [videoData , setVideoData] = useState([]);
//    flag ki video kan end ho rhi 
  const [videoEnded , setVideoEnded] = useState(false);
  const [loading,setLoading] = useState(false)
  const location = useLocation();
 
  //use useEffect ki pehle render par konsa video show karna hai obiviouly first secction ka first video
  useEffect(()=>{
      const setVideoSpecificDetails = async() => {
            //validation agar data hi nhi hai
            if(!courseSectionData?.length){
                return ;
            }
            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                //let assume all 3 fields are present 
                // set first video of subsection from first section 

                const filteredData = courseSectionData?.filter((course)=>
                   course._id === sectionId
                )
               const subSections = filteredData[0]?.subSection || [];
               const filteredVideoData = subSections?.filter(
                (data) => data._id === subSectionId
                );
            //    const filteredVideoData = filteredData[0]?.subSection?.filter(
            //       (data) => data._id === subSectionId
            //     );


                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
      }
      setVideoSpecificDetails();
  },[courseSectionData,courseEntireData,location.pathname])

  const isFirstVideo = () =>{
     //first section ka first subsection ki first video
     const currentSectionIndex = courseSectionData.findIndex(
        (data)=>data._id === sectionId
     )

     const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
        (data) => data._id === subSectionId
     )
     if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
        return true;
     }
     else{
        return false;
     }
  }

  const isLastVideo = () =>{
        const currentSectionIndex = courseSectionData.findIndex(
            (data)=>data._id === sectionId
        )
        
        const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection?.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
            (data) => data._id === subSectionId
        ) 

        if(currentSectionIndex === courseSectionData?.length - 1  &&
               currentSubSectionIndex === noOfSubSections-1 ){
                return true;
        }
        else{
            return false;
        }
         
  }

  const goToNextVideo = () =>{
       const currentSectionIndex = courseSectionData.findIndex(
            (data)=>data._id === sectionId
        )
        
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection?.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
            (data) => data._id === subSectionId
        ) 

        if(currentSubSectionIndex !== noOfSubSections-1 ){
            //same subsection me hi hai
            const nextSubSectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex + 1 ]?._id;
            //next video par jao 
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)

        }
        else{
            //different section ki first video
            const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1]?.subSection[0]?._id;
            //next video par jao 
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)

        }
  }

  const goToPrevVideo = () =>{
                const currentSectionIndex = courseSectionData.findIndex(
                    (data)=>data._id === sectionId
                )
                
                const noOfSubSections = courseSectionData[currentSectionIndex].subSection?.length;

                const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
                    (data) => data._id === subSectionId
                ) 

                 if(currentSubSectionIndex !== 0 ){
                    //same subsection me hi prev wala
                    const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1 ]?._id;
                    //prev video par jao 
                    navigate( `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)

                }

                else{
                    //different section ki first video
                    const prevSectionId = courseSectionData[currentSectionIndex - 1]._id
                    const prevSubSectionLength = courseSectionData[currentSectionIndex-1].subSection?.length;
                    const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]?._id;
                    //next video par jao 
                    navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)

                }
  }

  const handleLectureCompletion = async() =>{
          /// dummy code baad me replace with the actual call
          setLoading(true);

          const res = await markLectureAsComplete({courseId : courseId , subSection : subSectionId},token);
          //state update 
          if(res){
            dispatch(updateCompletedLectures(subSectionId));
          }

          setLoading(false);  
  }

  return (
    <div>
        {
            !videoData ? (<div>
                No data found
            </div>) :(
                <Player
                    ref = {playerRef}
                    aspectRation = "16:9"
                    playsInline
                    onEnded={()=>setVideoEnded(true)}
                    src={videoData?.videoUrl}
                >

                 <FaPlayCircle />

                 {
                    videoEnded && (
                        <div>
                              !completedLectures.includes(subSectionId) && (
                                <IconBtn
                                    disabled={loading}
                                    onclick={()=> handleLectureCompletion()}
                                    text={!loading ? "Mark As Completes" : "loading..."}
                                />
                              )

                              <IconBtn
                                 disabled={loading}
                                 onclick={()=>{
                                    if(playerRef?.current){
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                 }}
                                 text="Rewatch"
                                 customClasses="text-xl"
                              />

                              <div>
                                {
                                    !isFirstVideo() && (
                                        <button
                                        disabled={loading}
                                        onClick={goToPrevVideo}
                                        className='blackButton'
                                        >
                                            Prev
                                        </button>
                                    )
                                }
                              </div>

                              <div>
                                {
                                    !isLastVideo() && (
                                        <button
                                        disabled={loading}
                                        onClick={goToNextVideo}
                                        className='blackButton'
                                        >
                                            Next
                                        </button>
                                    )
                                }
                              </div>

                        </div>
                    )
                 }
                   
                </Player>
            )
        }
        <h1>
            {videoData?.title}
        </h1>
        <p>
            {videoData?.description}
        </p>
    </div>
  )
}
export default VideoDetails;
