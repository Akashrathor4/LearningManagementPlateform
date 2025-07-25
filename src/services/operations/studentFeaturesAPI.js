import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";



const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Load Razorpay script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script); // ✅ Fixed typo: body
  });
}

// Main function to initiate course buying process
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...");

  try {
      console.log("Payment request 1 ")
    // Load Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }
     console.log("Payment request 2 ")
     console.log("COURSE_PAYMENT_API",COURSE_PAYMENT_API)
     console.log("courses",courses)
     console.log("token:",token)
    // Initiate the order
   const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses},
                                {
                                    Authorization: `Bearer ${token}`,
                                })

    console.log("Payment request 3 ")

    console.log("order response ", orderResponse);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    // Log the Razorpay key (optional)
    console.log("Printing Razorpay key", process.env.REACT_APP_RAZORPAY_KEY);
     console.log("Payment request 4 ")
    // Razorpay options
    const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        currency: orderResponse.data.data.currency,
        amount: orderResponse.data.data.amount,
        order_id: orderResponse.data.data.id,
        name: "Akash Learning Platform",
        description: "Thank you for purchasing the course",
        image: rzpLogo,
        prefill: {
            name: userDetails.firstName,
            email: userDetails.email,
        },
        handler: function (response) {
            //send email
            // console.log("Response",response); response contains razor pay order id and two more id 
            sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
            //verify payment
            verifyPayment({ ...response, courses }, token, navigate, dispatch);
        },
        theme: {
            color: "#3399cc",
        },
    };


    console.log("Payment Request 5 ")
    console.log("Options : ", options );

    // Open Razorpay payment modal
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops, payment failed");
      console.log(response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR...", error);
    toast.error("Could not make payment");
  }

  toast.dismiss(toastId);
}

// Send confirmation email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR...", error);
  }
}

// Verify payment and finalize enrollment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
   
  try {
    console.log("Verify Payment call from fronend")
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

     console.log("Verify Payment call comes from backend")

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment successful, you are added to the course");
    navigate("/dashboard/enrolled-courses"); // ✅ Fixed route
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR...", error);
    toast.error("Could not verify the payment");
  }

  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}





