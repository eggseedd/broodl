'use client'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setUserDataObj] = useState(null)    
    const [isLoading, setisLoading] = useState(true)    

    // AUTH HANDLERS
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                // Set user to local context
                setisLoading(true)
                setCurrentUser(user)
                if(!user) {
                    console.log('No user found')
                    return
                }

                // Fetch user data from firestore (if user exists)
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData = {}
                if(docSnap.exists()) {
                    firebaseData = docSnap.data()
                    console.log('Found user data: ', firebaseData)
                }
                setUserDataObj(firebaseData)
            } catch (err) {
                console.error(err.message)
            } finally {
                setisLoading(false)
            }
        })
        
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        setCurrentUser,
        userDataObj,
        setUserDataObj,
        signup,
        login,
        logout,
        isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}