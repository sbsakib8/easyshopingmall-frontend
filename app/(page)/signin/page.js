'use client'
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { googleSignIn, UserSignin } from "@/src/hook/useAuth";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import AuthRedirect from "@/src/utlis/authRedirect";
import { useDispatch } from "react-redux";


const Signin = () => {


  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [showpassword, setShowPassword] = useState(false);
  const router = useRouter()
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { email, password };

    try {
      const res = await UserSignin(user, router, dispatch);

      if (res.success) {
        toast.success("Signin successfully!");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.error("Login failed:", err.response?.data || err.message);
    }
  };


  // google sign in
  const handleGoogleSignIn = async () => {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    try {
      await googleSignIn({
        name: user.reloadUserInfo.displayName,
        email: user.reloadUserInfo.email,
        image: user.reloadUserInfo.photoUrl
      }, router, dispatch);
    } catch (error) {
      console.error("Google sign-in failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Google sign-in failed");
    }

  }


  return (
    <AuthRedirect>
      <div className='flex justify-center items-center lg:mt-20 h-auto py-20 bg-gray-100'>
        <div className='bg-white p-8 rounded-lg shadow-md w-[95%] md:w-[500px] lg:w-[600px] '>
          <h1 className='text-[27px] font-semibold mb-4'>Sign In</h1>
          <form onSubmit={handleSubmit} className='space-y-4 mt-16'>
            <div className=" w-full">
              <Box
                component="form"
                className=' w-full! space-y-4!'
                noValidate
                autoComplete="off"
              >
                <div className=' h-[60px] '>
                  <TextField type='email' className=' w-full!' value={email} onChange={(e) => setEmail(e.target.value)} id="email" label="Email" variant="outlined" required />
                </div>

                <div className=' h-[60px] relative'>
                  <TextField type={showpassword ? 'text' : 'password'} className=' w-full!' value={password} onChange={(e) => setpassword(e.target.value)} id="password" label="Password" variant="outlined" required />
                  <div onClick={() => setShowPassword(!showpassword)} className='absolute right-3 top-[50%] transform -translate-y-1/2 cursor-pointer text-gray-500'>
                    {showpassword ? <FaRegEye className='text-xl' /> : <FaEyeSlash className='text-xl' />}
                  </div>
                </div>

              </Box>
              <Link href='/forgotpassword' className='text-primary-color flex justify-end hover:underline hover:text-black transition-all delay-100 text-sm'>Forgot Password?</Link>


            </div>
            <button type='submit' className='w-full bg-primary-color text-accent-content py-2 rounded-md hover:bg-[#609283] cursor-pointer transition duration-200'>Sign In</button>

            <span className='flex justify-center items-center'>Or</span>


            <div onClick={handleGoogleSignIn} type='button' className='w-full flex justify-center items-center  text-black border border-primary-color py-3 rounded-md hover:bg-gray-200 cursor-pointer transition-all duration-300 delay-200'>
              <FcGoogle className='text-2xl mr-2' />
              <button>Sign In with Google</button>

            </div>
            <p className='text-center text-sm text-gray-600'>Not have an account <a href='/signup' className='text-blue-600 hover:underline'>SignUp</a></p>
          </form>
        </div>
      </div>
    </AuthRedirect>
  )
}

export default Signin