import React from 'react'
import HighlightText from '../HomePage/HighlightText';

const Quote = () => {
  return (
    <div>
        We are passionate about revolutionizing the way we learn. Our 
        <br/>
        innvoative plateform <HighlightText text={"combines technology"}/>
        <span className='text-orange'>
            {" "}
            expertise
        </span>
        and community to
        <br/>
         create an
         <span className='text-yellow'>
            {" "}
             unparalleled educational experience.
         </span>
    </div>
  )
}

export default Quote;
