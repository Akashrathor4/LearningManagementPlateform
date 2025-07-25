import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import RatingStars from '../../common/RatingStars';
import GetAvgRating from '../../../utils/avgRating'

 const Course_Card = ({course,height}) => {

  const [avgReviewCount , setAvgReviewCount] = useState(0);

  useEffect(()=>{
    const count =  GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  })

  return (
    <div className='text-white'>
        <Link to={`/courses/${course._id}`}>
            <div>
                <div>
                    <img
                        src={course?.thumbnail}
                        alt='course thumbnail'
                        className={`${height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div>
                   <p>{course.courseName}</p>
                   <p>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                   <div>
                    <span>{avgReviewCount || 0}</span>
                    <RatingStars Review_Count={avgReviewCount}/>
                    <span>{course?.ratingAndReviews?.length} Ratings</span>
                   </div> 
                   <p>Rs {course?.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card;
