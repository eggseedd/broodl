'use client'
import React, { useState } from 'react'
import { Fugaz_One } from 'next/font/google'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] }); 

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const { login, signup } = useAuth()

  async function handleSubmit() {
    if (!email || !password || password.length < 6) return

    setIsAuthenticating(true)
    try {
      if (isRegister) {
        console.log('Signing up a new user...')
        await signup(email, password)
      } else {
        console.log('Logging in a user...')
        await login(email, password)
      }
    } catch (err) {
      console.log(err.message)
      setErrMsg(err.message)
    } finally {
      setIsAuthenticating(false)
    }
  }

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4 '>
      <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>{!isRegister ? 'Log In' : 'Register'}</h3>
      <p className=''>You&apos;re one step away!</p>
      {errMsg && <p style={{color: 'red'}}>{'ERROR AUTHENTICATING: ' +  errMsg}</p>}
      <input 
        value={email} 
        onChange={(e) => {setEmail(e.target.value)}} 
        className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-teal-700 focus:border-teal-700 py-2 sm:py-3 border border-solid border-teal-500 rounded-full outline-none' 
        placeholder='Email' />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => {setPassword(e.target.value)}} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-teal-700 focus:border-teal-700 py-2 sm:py-3 border border-solid border-teal-500 rounded-full outline-none' placeholder='Password' />
      <div className='max-w-[400px] w-full mx-auto'>
        <Button clickHandler={handleSubmit} text={isAuthenticating ? "Submitting..." : "Submit"} full />
      </div>
      <p className='text-center'>{isRegister ? 'Already have an account? ' : 'Don\'t have an account? '} 
        <button onClick={() => {
          setIsRegister(!isRegister)
          setErrMsg('')
        }} className='text-teal-700'>{isRegister ? 'Sign in' : 'Sign up'}</button></p>
    </div>
  )
}
