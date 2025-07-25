import React from 'react'
import {toast} from 'react-hot-toast'
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';
const {
    CATALOGPAGEDATA_API
} = catalogData;


export const getCatalogPageData = async(categoryId) => {
 const toastId = toast.loading("Loading...")
 let result = [];
 try{
    console.log('call to backend for catalog data')
     const response = await apiConnector("POST",CATALOGPAGEDATA_API,
        {categoryId:categoryId});

     console.log('call comes from backend for catalog data')

    //  console.log("response Data ",response?.data)

     if(!response?.data?.success){
        throw new Error(response?.data?.error || "Could not fetch category page data");
     }

    

     result = response?.data;
    //  toast.success("Data of Choose Category")


 }catch(error){
        console.log("CATALOG PAGE DATA API ERROR...", error);
        toast.error(error.message);
        result = error.response?.data;
 }
 toast.dismiss(toastId);
 return result;
}


