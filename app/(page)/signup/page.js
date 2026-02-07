'use client'
import { FcGoogle } from "react-icons/fc";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { googleSignIn, UseAuth } from "@/src/hook/useAuth";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import AuthRedirect from "@/src/utlis/authRedirect";
import { useDispatch } from "react-redux";



function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setpassword] = useState('');
  const [showpassword, setShowPassword] = useState(false);
  const router = useRouter()
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      number,
      password,
    };

    try {
      const res = await UseAuth(user, router);
      if (res.success) {
        toast.success("Registration successful! Please sign in.");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  // google sign in
  const handleGoogleSignIn = async () => {
    if (!number) {
      return toast.error("Please enter your number")
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // console.log("user", user.reloadUserInfo);
    try {
      await googleSignIn({
        name: user.reloadUserInfo.displayName,
        email: user.reloadUserInfo.email,
        mobile: number,
        image: user.reloadUserInfo.photoUrl
      }, router, dispatch);
    } catch (error) {
      console.error("Google sign-in failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Google sign-in failed");
    }

  }

  return (
    <AuthRedirect>
      <div className='flex justify-center lg:mt-20 items-center h-auto py-20 bg-gray-100'>
        <div className='bg-white p-8 rounded-lg shadow-md w-[95%] md:w-[500px] lg:w-[600px] '>
          <h1 className='text-2xl font-medium mb-4'>Sign Up</h1>
          <form onSubmit={handleSubmit} className='space-y-4 mt-16'>
            <div className=' '>
              <Box
                component="form"
                className=' w-full! space-y-4!'
                noValidate
                autoComplete="off"
              >
                <div className=' h-[60px] '>
                  <TextField type='text' className=' w-full!' value={name} onChange={(e) => setName(e.target.value)} id="FullName" label="FullName" variant="outlined" required />
                </div>
                <div className=' h-[60px] '>
                  <TextField type='email' className=' w-full!' value={email} onChange={(e) => setEmail(e.target.value)} id="email" label="Email" variant="outlined" required />
                </div>
                <div className=' h-[60px] '>
                  <TextField type='text' className=' w-full!' value={number} onChange={(e) => setNumber(e.target.value)} id="number" label="Number" variant="outlined" required />
                </div>
                <div className=' h-[60px] relative'>
                  <TextField type={showpassword ? 'text' : 'password'} className=' w-full!' value={password} onChange={(e) => setpassword(e.target.value)} id="password" label="Password" variant="outlined" required />
                  <div onClick={() => setShowPassword(!showpassword)} className='absolute right-3 top-[50%] transform -translate-y-1/2 cursor-pointer text-gray-500'>
                    {showpassword ? <FaRegEye className='text-xl' /> : <FaEyeSlash className='text-xl' />}
                  </div>
                </div>


              </Box>


            </div>
            <button type='submit' className='w-full bg-primary-color text-white py-2 rounded-md hover:bg-[#609283] cursor-pointer transition duration-200'>Sign Up</button>

            <span className='flex justify-center items-center'>Or</span>


            <div onClick={handleGoogleSignIn} type='button' className='w-full flex justify-center items-center  text-black border border-primary-color py-3 rounded-md hover:bg-gray-200 cursor-pointer transition-all duration-300 delay-200'>
              <FcGoogle className='text-2xl mr-2' />
              <button>Sign Up with Google</button>

            </div>
            <p className='text-center text-sm text-gray-600'>Already have an account? <Link href='/signin' className='text-blue-600 hover:underline'>SignIn</Link></p>
          </form>
        </div>
      </div>
    </AuthRedirect>
  )
}

export default Signup