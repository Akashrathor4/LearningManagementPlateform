import React, { useEffect,useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
// import { apiConnector } from '../services/apiconnector';
// import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import { fetchCourseCategories } from '../services/operations/courseDetailsAPI';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';


const Catalog = () => {

  const {catalogName} = useParams();
  const [catalogPageData,setCatalogPageData] = useState(null);
  const [categoryId,setCategoryId] = useState('');

//   most popular ko manage ke lye variable 
   const [active, setActive] = useState(1)


  //fetch all categories jab bhi url chnage by clicking any option in dropdown extract new catalog name
  //this useeffect use for ki kiss category par click kiya hai uski category id ko nikalane ke liye
  useEffect(()=>{
        const getCategories = async()=>{
            const res = await fetchCourseCategories();
             
            const category_id = 
            res.filter((ct)=>ct.name.split(" ").join("-").toLowerCase() === catalogName)[0].
            _id;
            console.log("Category_id",category_id);
            setCategoryId(category_id);
        }
        getCategories();
  },[catalogName]);
 //this useEffect use for jis bhi catagory par click kiya uska  data fetch krenge  
  useEffect(()=>{
      const getCategoryDetails = async()=>{
        try{
            
            //  When the first useEffect sets categoryId, it might be an empty string '' 
            //  briefly, triggering the second useEffect with an invalid ID, leading to a 500 error.

             if (!categoryId) return;  // dont fetch if no valid id  fase the yha parallel toast eror and success ke show ho rhe the   
            
             const res = await getCatalogPageData(categoryId);
             console.log("res Catalog ",res);
             setCatalogPageData(res);
        }catch(error){
             console.log(error)
        }
      }
      getCategoryDetails();
  },[categoryId]);

  return (
    <div className='text-white'>

        <div>
            <p>
                 {` Home/ Catalog / `}
                <span>
                    {catalogPageData?.data?.selectedCategory?.name}
                </span>
            </p>
            <p>{catalogPageData?.data?.selectedCategory?.name}</p>
            <p>{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>

        <div>
            {/* section 1  */}
            <div>
                <div>Courses to get you started</div> 
                <div className='flex gap-x-3'>
                    <p
                                className={`px-4 py-2 ${
                        active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                        } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >Most Popular</p>
                    <p
                              className={`px-4 py-2 ${
                            active === 2
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                            } cursor-pointer`}
                            onClick={() => setActive(2)}
                    >New</p>
                </div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} /> 
                </div>
            </div>

            {/* section 2  */}
            <div>
                <div>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
            </div>

            {/* section 3  */}
            <div>
                <div>Frequently Bought</div>
                <div>
                      <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                            .map((course,index)=>(
                                 <Course_Card course={course} key={index} height={'h-[400px]'}/>
                            )) 
                        }
                      </div>
                </div>
            </div>
        </div>
      <Footer/>
    </div>
  )
}


export default Catalog;
