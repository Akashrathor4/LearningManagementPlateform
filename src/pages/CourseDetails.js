import React, { useEffect, useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import {useNavigate , useParams} from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import Error from './Error';
import GetAvgRating from '../utils/avgRating'
import ConfirmationModal from '../components/common/ConfirmationModal'
import RatingStars from '../components/common/RatingStars';
import {formatDate}  from '../services/formatDate'
import CourseDetailsCard from '../components/core/course/CourseDetailsCard';

const CourseDetails = () => {
     
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const {courseId} = useParams();
    const {loading} = useSelector((state)=>state.profile);
    const {paymentLoading} = useSelector((state)=>state.course);
    const [confirmationModal,setConfirmationModal] = useState(null);


    // i need complete data of a course fetch with help of courseid 
    const [courseData,setCourseData] = useState(null);

    useEffect(()=>{
        const getCourseFullDetails = async() =>{
            try{
                 const result = await fetchCourseDetails(courseId);
                 console.log("Printing CourseData-> " , result);
                 setCourseData(result);
            }catch(error){
               console.log("Could not fetch courses details");
            }
        }
        getCourseFullDetails();
    },[courseId]);


    //i need avareage review count 

     const [avgReviewCount , setAverageReviewCount] = useState(0);

     useEffect(()=>{
           const count = GetAvgRating(courseData?.data?.ratingAndReviews);
           
           setAverageReviewCount(count);  
        },[courseData]);

    // i need total number of lecture 
    
    const [totalNoOfLecture,setTotalNoOfLecture] = useState(0);
    useEffect(()=>{
        let lectures = 0;
        courseData?.data?.courseContent?.forEach((sec)=>{
            lectures += sec?.subSection?.length || 0
        })
    })


    const [isActive , setIsActive] = useState(Array(0));
    const handleActive = (id) =>{
        setIsActive(
            !isActive.includes(id)
            ? isActive.concat(id)
            :isActive.filter((e)=> e != id)
        )
    }


    const handleBuyCourse = () =>{
        if(token){
            buyCourse(token,[courseId],user,navigate,dispatch);
            return;
        }
        //agar token nhi ahi to modal dikhayege
        setConfirmationModal({
            text1:"you are not logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:()=> navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })

    }

    if(loading || !courseData){
        return (
            <div>
                Loading...
            </div>
        )
    }

    if(!courseData.success){
        return (
            <div>
                <Error/>
            </div>
        )
    }

    // fetch data 
    const {
            _id: course_id,
            courseName,
            courseDescription,
            price,
            whatYouWillLearn,
            courseContent,
            ratingAndReviews,
            instructor,
            studentsEnrolled,
            createdAt,
         } = courseData.data;  // ✅ Fix: direct access




  return (
    <div className='text-white flex flex-col items-center'>
       
         <div className='relative'>
                <p>{courseName}</p>
                <p>{courseDescription}</p>
                <div className='flex'>
                    <span>{avgReviewCount}</span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={24 }/>
                    <span>{`(${ratingAndReviews?.length} reviews)`}</span>
                    <span>{`(${studentsEnrolled?.length} students enrolled)`}</span>
                </div> 

                <div>
                    <p>Created By {instructor?.firstName || "Unknown"}</p>

                </div> 

                <div>
                    <p>
                        Created At {formatDate(createdAt)}
                    </p>

                    <p>
                        {" " } English
                    </p>
                </div> 

                <div>
                    <CourseDetailsCard
                        course = {courseData?.data}
                        setConfirmationModal = {setConfirmationModal}
                        handleBuyCourse = {handleBuyCourse}
                    /> 
                </div>

         </div> 

         <div>
            <p>What You will learn</p>
            <div>
                {whatYouWillLearn}
            </div>
         </div>  

         <div>
            <div>
                <p>Course Content</p>
            </div>

            <div className='flex gap-x-3'>
                  <div>
                    <span>{courseContent.length} section(s)</span>
                    <span>{totalNoOfLecture} lectures</span>
                    <span>
                        {courseData.data?.totalDuration} total length
                    </span>
                  </div>
                  <div>
                     <button 
                        onClick={()=> setIsActive([])}
                     >
                        Collapse all sections
                     </button>
                  </div>
            </div>
         </div> 

        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default CourseDetails;
