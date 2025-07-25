const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

// create category handler function

exports.createCategory = async(req,res)=>{
    try{
        //fetch data
          const {name,description} = req.body;

          console.log("name",name)
        
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:'fill the field Carefully',
            })
        }
        
        //create entry in db
        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log("CategoryDetails",CategoryDetails);

        // return response

        return res.status(200).json({
            success:true,
            message:"Category Created Successfully",
        })

    }catch(error){
             return res.status(500).json({
                success:false,
                message:"something went wrong while creating Category",
             })
    }
};


//getAlltags handler function

exports.showAllCategories = async(req,res) => {
        try{
                const allCategories = await Category.find({},{name:true,description:true});
                return res.status(200).json({
                    success:true,
                    message:"All the categories returned successfully",
                    allCategories,
                })
        }catch(error){
              return res.status(500).json({
                success:false,
                message:error.message,
              })
        }
};

//category page details


exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // console.log("CATALOG DEBUGGER IN BACKEND 1 ");
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
        // //   populate: "ratingAndReviews",
        })
        .exec()
       
      // console.log("Selected Category",selectedCategory);
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      // console.log("CATALOG DEBUGGER IN BACKEND 2 ");
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
      // console.log("CATALOG DEBUGGER IN BACKEND 3 ");
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      //console.log("categoriesExceptSelected",categoriesExceptSelected);
    //   You're passing an _id directly into findOne, but findOne() expects an object as filter
    // Category.findOne({ _id: someId }) // object nhh banane se error aaya tha
      let differentCategory = await Category.findOne({
         _id: categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id,
        })
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()

        // console.log("differentCategory",differentCategory)

        // console.log("CATALOG DEBUGGER IN BACKEND 4 ");
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
        // console.log("CATALOG DEBUGGER IN BACKEND 5 ");
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)

       console.log("CATALOG DEBUGGER IN BACKEND 6 ");
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }



// exports.categoryPageDetails = async (req,res)=>{
//            try{
//                 //get Category id
//                 const {categoryId} = req.body;

//                 //get courses for specified categoryId
//                  const selectedCategory = await Category.findById(categoryId)
//                                                     .populate("courses")
//                                                     .exec();       
//                 // validation
//                 if(!selectedCategory){
//                     return res.status(404).json({
//                         success:false,
//                         message:"Data not Found",
//                     });
//                 }
//                 //get courses for different categories
//                 const differentCategories = await Category.find({
//                     _id:{$ne:categoryId},
//                 })
//                 .populate("courses")
//                 .exec();
//                 //get top 10 selling courses , konsa course kitna sell hua uske basis par kar skte hai
//                 // HW write the code
//                 //return response
//                 return res.status(200).json({
//                     success:true,
//                     data:{
//                         selectedCategory,
//                         differentCategories,
//                     }
//                 })
                

//            }catch(error){
//              console.log(error);
//              return res.status(500).json({
//                      success:false,
//                      message:error.message,
//              });

//            }   
// }



