import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';


const ViewCourse = () => {
   // add review wale button se review dene ke liye open hoga ye modal
  const [reviewModal , setReviewModal] = useState(false);

  const {courseId} = useParams();
  //course Id undefined aa rhi hai solve schema ke name ki glti se sab start hua tha ref notes of dairy
  // console.log("courseId from Params",courseId);
  const {token} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
       const setCourseSpecificDetails = async()=>{
         console.log("courseId from Params",courseId);
          console.log("token",token);
        const courseData = await getFullDetailsOfCourse(courseId , token);
        console.log("courseData->",courseData)
        // console.log("courseData.courseDetails?.courseContent->",courseData.courseDetails?.courseContent);
        dispatch(setCourseSectionData(courseData.courseDetails?.courseContent));
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos));
        let lectures = 0;
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec?.subSection?.length || 0;
        });

        dispatch(setTotalNoOfLectures(lectures));
       }
       setCourseSpecificDetails();
  },[]);


  return (
    <>
        <div>
            
            <VideoDetailsSidebar setReviewModal={setReviewModal}/>
        
             <div>
                <Outlet/>
             </div>   
             {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal}  />)}       
        </div>

       
    </>
  )
}

export default ViewCourse;
