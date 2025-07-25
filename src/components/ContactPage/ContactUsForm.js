import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import CountryCode from "../../data/countrycode.json"
 const ContactUsForm = () => {

  const [loading , setLoading] = useState(false)
  const {
     register,
     handleSubmit,
     reset,
     formState : {errors , isSubmitSuccessful}

  } = useForm();

const submitContactForm = async(data) => {
         console.log("logging Data ",data)
         try{
              setLoading(true);
            //   const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
                const response = {status:"OK"}
              console.log("logging response",response)
              setLoading(false)
         }catch(error){
               console.log("Error",error.message);
               setLoading(false);
         }
}


  useEffect(()=>{
    if(isSubmitSuccessful){
        reset({
            email:"",
            firstname:"",
            lastname:"",
            message:"",
            phoneNo:"",
        })
    }
  },[reset , isSubmitSuccessful])

//   reset ka use isliye kar rhe dependency list me kyoki jab structure change ho form ka tab bhi ye field rhe structure change mt reset function change hoga 


  return (
    <form onSubmit = {handleSubmit(submitContactForm)}>
        
            <div className='flex flex-col gap-y-5'>
                       <div className='flex gap-x-5'>
                        {/* first Name  */}
                        <div className='flex flex-col'>
                            <label htmlFor='firstname'>First Name</label>
                            <input
                                type='text'
                                name='firstname'
                                id='firstname'
                                placeholder='Enter first name'
                                className='text-black'
                                //import game state ko register kar rhe 
                                {...register("firstname",{required:true})}
                            />
                            {
                                errors.firstname && (
                                    <span>
                                        Please enter Your first name
                                    </span>
                                )
                            }
                        </div>

                        {/* last Name  */}
                        <div className='flex flex-col'>
                            <label htmlFor='lastname'>last name</label>
                            <input
                                type='text'
                                name='lastname'
                                id='lastname'
                                placeholder='Enter last name'
                                className='text-black'
                                //import game state ko register kar rhe 
                                {...register("lastname")}
                            />
                            
                        </div>
                        </div>

                    
                        {/* Email   */}
                        <div className='flex flex-col'>
                            <label htmlFor='email'>Email Address</label>
                            <input
                                type='text'
                                name='email'
                                id='email'
                                placeholder='Enter email Address '
                                className='text-black'
                                //import game state ko register kar rhe 
                                {...register("email",{required:true})}
                            />
                            {
                                errors.email && (
                                    <span>
                                        Please enter Your email Address
                                    </span>
                                )
                            }
                        </div>

                         {/* phone no  */}
                         <div className='flex flex-col gap-2'>
                            
                            <label htmlFor='phonenumber'>Phone Number</label>
                             
                             <div className='flex flex-row gap-5'>
                                   {/* flex row me yha two div nhi hogi balki select and inout tag honge hmane div se kiya tha select and inpput par lagkar  */}
                                   {/* dropdown  */}
                                   
                                      <select
                                        name="dropdown"
                                        id="dropdown"
                                        className='text-black w-[60px]'
                                        {...register("countrycode",{required:true})}
                                      >
                                        {
                                             CountryCode.map((element , index ) => {
                                                return (
                                                    <option key={index} value={element.code}>
                                                        {element.code}-{element.country}
                                                    </option>
                                                )
                                             })
                                        }
                                      </select>
                                   

                                   {/* phone number field  */}
                                   
                                      <input
                                        type="number"
                                        name='phonenumber'
                                        id="phonenumber"
                                        placeholder='12345 67890'
                                        className='text-black w-[calc(100%-70px)]'
                                        {...register("phoneNo",{
                                            required:{value:true,message:"Please enter Phone Number"},
                                            maxLength:{value:10 , message:"Invalid Phone Number"},
                                            minLength:{value:8, message:"Invalid Phone number"}
                                        })}
                                      />
                                   


                             </div>

                         </div>

                        {/* message box  */}
                        <div className='flex flex-col'>
                            <label htmlFor='message' >Message</label>
                            <textarea
                                name='message'
                                id="message"
                                cols="30"
                                rows='7'
                                placeholder='Enter Your message here '
                                className='text-black'
                                {...register("message",{required:true})}
                            />
                            {
                                errors.message &&(
                                    <span>
                                        Please enter your message.
                                    </span>
                                )
                            }
                        </div>


                    <button type="submit"
                    className='rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black'>
                            Send Message
                    </button>
            </div>

    </form>
  )
}

export default ContactUsForm;
