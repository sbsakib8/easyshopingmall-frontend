"use client"
import { useState } from "react"
import ReactPlayer from 'react-player'
const VideoPage = () => {
    const [showVideo, setShowVideo] = useState(false)
    return (
        <div className='bg-bg'>
            <div className="container mx-auto px-4 py-8 min-h-screen bg-bg">
                {/* Header */}
                <div className="text-center mb-5">
                    <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                       All Videos
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Seclect Section
                    </p>
                </div>
                <div className='container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 '>

                    {Array(8).fill().map((_, i) => <div key={i} className=''>
                        <div className='relative  h-80 shadow-2xl rounded-xl md:rounded-2xl'>
                            <img src={"https://i.ytimg.com/vi/_qETiv0aTdA/hqdefault.jpg?sqp=-oaymwFBCPYBEIoBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGBEgcihFMA8=&rs=AOn4CLA03DMupVKsylFc6VGl5wp6b0b4pg"}
                                alt={`thumbnel `}
                                className='w-full h-full rounded-2xl' />

                            {/* playIcon  */}
                            <img onClick={() => setShowVideo(!showVideo)} className='w-12 h-12 absolute top-1/2 right-1/2 rounded-full' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7dAm2xeRPWO5PJWhJnhfUeG3Syl3ws8wnw&s"} />
                            {/* video player  */}
                            {showVideo && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn ">
                                <ReactPlayer
                                    controls                                   
                                    light={<img
                                        src={"https://i.ytimg.com/vi/_qETiv0aTdA/hqdefault.jpg?sqp=-oaymwFBCPYBEIoBSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGBEgcihFMA8=&rs=AOn4CLA03DMupVKsylFc6VGl5wp6b0b4pg"}
                                        alt={`thumbnel `}
                                        className=" w-96 h-96  rounded-xl md:rounded-2xl"
                                    />}
                                    playIcon={<img className='w-12 h-12 absolute rounded-full' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7dAm2xeRPWO5PJWhJnhfUeG3Syl3ws8wnw&s"} />}
                                    width={760}
                                    height={415}
                                    volume={0.5}
                                    playing={true}
                                    autoPlay={true}
                                    src="https://youtu.be/_qETiv0aTdA?feature=shared"
                                />
                                <button onClick={() => setShowVideo(!showVideo)} className="text-xl bg-secondary py-1 px-3 rounded-full absolute top-10 right-10 cursor-pointer">X</button>
                            </div>}
                            <div className='absolute top-3 left-3'>
                                <button className=' text-accent text-xl font-semibold'>{i + 1}.Manual Payment System</button>
                            </div>
                        </div>
                    </div>)}
                </div>

            </div>
        </div>
    )
}

export default VideoPage