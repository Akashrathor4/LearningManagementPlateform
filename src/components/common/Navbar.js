import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom';
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CiShoppingCart } from "react-icons/ci";
import ProfileDropDown from '../core/Auth/ProfileDropDown'
// import { apiConnector } from '../../services/apiconnector';
// import { categories } from '../../services/apis';
import { IoIosArrowDown } from "react-icons/io";
import { fetchCourseCategories } from '../../services/operations/courseDetailsAPI';

// const subLinks = [
//   {
//     title:"python",
//     link:"/catelog/python"
//   },
//   {
//     title:"web dev",
//     link:"/catelog/web-development"
//   },
// ]

const Navbar = () => {

  // now fetch data fro reducer done by useselector hook

   const {token} =useSelector((state)=>state.auth);
   const {user} = useSelector((state)=>state.profile);
   const {totalItems}=useSelector((state)=>state.cart);
   const location = useLocation();


const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  console.log("Categories1",subLinks);

  useEffect(() => {

    const getCategories = async () => {
             setLoading(true)
             const categories = await fetchCourseCategories()
             console.log("CATEGORY",categories)
             if (categories.length > 0) {
               // console.log("categories", categories)
               setSubLinks(categories)
             }
             setLoading(false)
           }

    getCategories()
  }, [])

  // console.log("sub links", subLinks)




  //  const [subLinks,setSubLinks] = useState([])

  //  const fetchSublinks =  async() => {
  //             try{
  //                   // Api call with the help of apiconnector function 
  //                   const result = await apiConnector("GET",categories.CATEGORIES_API);
  //                   //save sari category list 
  //                   console.log("Printing result ", result);
  //                   setSubLinks(result.data.data);
  //             }
  //             catch(error){
  //               console.log("Could not fetch the category list ")
  //             }
  //     }

  //  useEffect(()=>{
  //         fetchSublinks();
  //  },[])

  //  function to check url 
   const matchRoute = ((route)=>{
    return matchPath({path:route},location.pathname)
   })


  return (
    <div className='flex h-14 items-center border-b-[1px]  border-b-richblack-700'>
       <div className='flex w-11/12 max-w-maxContent items-center justify-between mx-auto '>
             
           <Link to="/">
                <img src={logo}  loading ="lazy"/>
           </Link>

           {/* Navlink */}

           <nav>
               <ul className='flex gap-x-6 text-richblack-25'>
              {
                NavbarLinks.map((link,index)=>{
                             return  <li key={index}>
                               {
                                   link.title === "Catalog" ? (
                                    // parent tag of catalog (trigger) and  dropdown
                                    <div className='relative group'>
                                               {/* catalog and arrow  */}
                                           <div className=' flex items-center gap-2 cursor-pointer group'>
                                            <p>{link.title}</p>
                                            <IoIosArrowDown />
                                          </div>

                                           {/* Drop down  */}
                                         
                                          <div className='invisible absolute left-[50%] top-[-600%] z-10 translate-x-[-50%] translate-y-[50%]
                                            flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 
                                              opacity-0 transiiton-all duration-500 group-hover:visible
                                                group-hover:opacity-100 lg:w-[300px] '>

                                                <div className='absolute left-[50%] top-0
                                                    translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded
                                                  bg-richblack-5 '>

                                                </div>

                                                {loading ? (
                                                    <p className="text-center">Loading...</p>
                                                  ) : subLinks?.length ? (
                                                    <>
                                                     {console.log("subLinks:", subLinks)}
                                                      {subLinks?.map((subLink, i) => (
                                                        
                                                           
                                                          <Link
                                                            to={`/catalog/${subLink.name
                                                              .split(" ")
                                                              .join("-")
                                                              .toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                            key={i}
                                                          >
                                                            <p>{subLink.name}</p>
                                                          </Link>
                                                        ))}
                                                    </>
                                                  ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                  )}

                                                {/* {
                                                   subLinks && subLinks.length ? (
                                                            subLinks.map((subLink,index)=>(
                                                                <Link to={`${subLink.link}`} key={index} >
                                                                            <p> {subLink.title} </p>
                                                                </Link>
                                                            )
                                                                
                                                            )
                                                  ) : (<div></div>)
                                                } */}


                                          </div>
                                    </div>

                                       
                                    
                                   ) : (
                                    <Link to={link?.path}>
                                        {/* <p className='text-yellow-25'>
                                        {link.title}
                                        </p> */}

                                        <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : 
                                          "text-richblack-25"}`}>
                                        {link.title}
                                        </p>
                                    </Link>
                                   )
                               }
                               </li>
                    })
              }

               </ul>

           </nav>

           {/* login / signup / dashboard  */}
           
           <div className='flex items-center gap-5'>

               {
                   user && user?.accountType != "instructor" && (
                       <Link to="dashboard/card" className='relative'>
                                <CiShoppingCart />
                                {
                                    totalItems > 0 && (
                                      <span>
                                        {totalItems}
                                      </span>
                                    )
                                }
                       </Link>
                   )
               }
               {
                token === null && (
                  <Link to="/login">
                       <button className='border border-richblack-700  bg-richblack-800  px-[12px] py-[8px]
                                text-richblack-100 rounded-md'>
                         Log In 
                       </button>
                  </Link>
                )
               }
               {
                token === null && (
                  <Link to="/signup">
                       <button className='border border-richblack-700  bg-richblack-800  px-[12px] py-[8px]
                                text-richblack-100 rounded-md'>
                         Sign Up 
                       </button>
                  </Link>
                )
               }
               {
                   token !== null && <ProfileDropDown/>
               }

           </div>



       </div> 
    </div>
  )
}

export default Navbar;
