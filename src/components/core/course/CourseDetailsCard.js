import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard'
import {toast} from 'react-hot-toast'
import {ACCOUNT_TYPE} from '../../../utils/constants'
import { addToCart } from '../../../slices/cartSlice';

const CourseDetailsCard = ({course , setConfirmationModal , handleBuyCourse}) => {
    
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const {
        // thumbnail:ThumbnailImage,
        price : CurrentPrice,
    } = course;

  const handleAddToCart = ()=>{
             if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
                toast.error("You are an instructor , You cannot buy a course");
                return;
             }
             if(token){
                dispatch(addToCart(course));
                return;
             }

             setConfirmationModal({
                text1: "you are not logged in",
                text2: "Please login to add to cart",
                btn1Text: "login",
                btn2Text: "cancel",
                btn1Handler: () => navigate("/login"),
                btn2Handler: () => setConfirmationModal(null),
            });

    }

  const handleShare = ()=>{
    // window.location.href is a property that returns the entire URL of the current page as a string.
        copy(window.location.href);
        toast.success("Link Copied to Clipboard");
  } 

return (
    <div>
          {/* <img
            // src={ThumbnailImage}
            alt='Thumbnail image'
            className='max-h-[300px] min-h-[180] w-[400px] rounded-xl'
          /> */}
          <div>
            Rs.{CurrentPrice}
          </div>

          {/* do case hai ya to go to course wala button hoga ya phirrr buy now wala course hoga  */}
          {/* agar user course me present hai to go to wala button aayega otherwise buynow  */}

          <div>
            <button
             onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                ? () => navigate('/dashboard/enrolled-courses')
                : handleBuyCourse
             }
             className='bg-yellow-50 w-fit text-richblack-900'
            >
                {
                    user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course" : 
                    "Buy Now"
                }
            </button>

            {
                (!course?.studentsEnrolled.includes(user?._id)) && (
                    <button
                    onClick={handleAddToCart}
                    className='bg-yellow-50 w-fit text-richblack-900'
                    >
                        Add to Cart 
                    </button>
                )
            }
          </div>

          <div>
                <p>
                    30-Days Money-Back Guarantee
                </p>
                <p>
                    This Course Includes
                </p>
                <div className='flex flex-col gap-y-3'>
                  {
                    course?.instructions?.map((item,index)=>{
                        <p key={index} className='flex gap-2'>
                            <span>{item}</span>
                        </p>
                    })
                  }
                </div>
          </div>

          <div>
            <button
             className='mx-auto flex items-center'
             onClick={handleShare}
            >
                 Share
            </button>
          </div>
    </div>
  )
}

export default CourseDetailsCard;
