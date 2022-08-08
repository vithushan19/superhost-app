import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAeTLjzI9-O7H6Zb8Xttgn5JOs8mFf6YRA',
  authDomain: 'social-calendar-352120.firebaseapp.com',
  projectId: 'social-calendar-352120',
  storageBucket: 'social-calendar-352120.appspot.com',
  messagingSenderId: '766351459961',
  appId: '1:766351459961:web:08611a0b54ab68d8f8b6a8',
  measurementId: 'G-Z1V0SSGV6L',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)