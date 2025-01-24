'use client'
import React, { useState } from 'react'
import { baseRating, gradients } from '@/utils'
import { Fugaz_One } from 'next/font/google'

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] }); 

const months = { 'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr', 'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug', 'September': 'Sept', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec' }
const now = new Date()
const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const moods_paragraphs = [
    `A bad day can be overwhelming. Try to take deep breaths and find a healthy outlet for your emotions, like talking to someone you trust or engaging in physical activity.`,
    `It's okay to feel sad sometimes. Take some time for yourself, and remember that it's perfectly normal to have down days. Reach out to a friend or do something you love to lift your spirits.`,
    `You're feeling neutral today. It's a good time to reflect on your day and find small moments of joy or gratitude. Sometimes, just being present is enough.`,
    `You're feeling good today! Enjoy this positive energy and make the most of your day. Share your good mood with others and spread positivity.`,
    `You're feeling elated and on top of the world! Embrace this high energy and let it fuel your passions and creativity. Your enthusiasm is inspiring.`
  ]


export default function Calendar(props) {
  const { demo, completeData, handleSetMood } = props

  const now = new Date()
  const currMonth = now.getMonth()
  const currYear = now.getFullYear()
  const monthsArr = Object.keys(months)
  const [selectedMonth, setSelectedMonth] = useState(monthsArr[currMonth])
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  
  const numericMonth = monthsArr.indexOf(selectedMonth)
  const data = completeData?.[selectedYear]?.[numericMonth] || {}
  function handleIncrementMonth(val) {
    if (numericMonth + val < 0) {
      setSelectedYear(curr => curr - 1)
      setSelectedMonth(monthsArr[monthsArr.length - 1])
    } else if (numericMonth + val > 11) {
      setSelectedYear(curr => curr + 1)
      setSelectedMonth(monthsArr[0])
    } else {
      setSelectedMonth(monthsArr[numericMonth + val])
    }
  }

  const monthNow = new Date(selectedYear, monthsArr.indexOf(selectedMonth), 1)
  const firstDayOfMonth = monthNow.getDay()
  const daysInMonth = new Date(selectedYear, monthsArr.indexOf(selectedMonth) + 1, 0).getDate()

  const daysToDisplay = firstDayOfMonth + daysInMonth
  const numOfRows = (Math.floor(daysToDisplay / 7)) + (daysToDisplay % 7 ? 1 : 0)

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-center text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-10'>{moods_paragraphs[data[now.getDate()] - 1]}</p>
      <div className='grid grid-cols-5 gap-4'>
        <button onClick={() => {
          handleIncrementMonth(-1)
        }} className='mr-auto text-teal-500 text-lg sm:text-xl duration-200 hover:opacity-60'><i className='fa-solid fa-chevron-circle-left'></i></button>
        <p className={'text-center capitalize col-span-3 textGradient ' + fugaz.className}>{selectedMonth}, {selectedYear}</p>
        <button onClick={() => {
          handleIncrementMonth(1)
        }} className='ml-auto text-teal-500 text-lg sm:text-xl duration-200 hover:opacity-60'><i className='fa-solid fa-chevron-circle-right'></i></button>
      </div>
      <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
        {[...Array(numOfRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className='grid grid-cols-7 gap-1'>
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                let dayIndex = (rowIndex * 7) + dayOfWeekIndex - (firstDayOfMonth - 1)

                let dayDisplay = dayIndex > daysInMonth ? false : (row === 0 && dayOfWeekIndex < firstDayOfMonth) ? false : true

                let isToday = (dayIndex === now.getDate()) && (monthsArr.indexOf(selectedMonth) === currMonth) && (selectedYear === currYear)

                if (!dayDisplay) {
                  return (
                    <div key={dayOfWeekIndex} className='bg-white'></div>
                  )
                } 

                let color = demo ? gradients.teal[baseRating[dayIndex]] : dayIndex in data ? gradients.teal[data[dayIndex]] : 'white'

                return (
                  <div style={{background: color}} key={dayOfWeekIndex} className={'text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ' + (isToday ? 'border-teal-500 ' : 'border-teal-200 ') + (color === 'white' ? 'text-teal-500 ' : 'text-white ')}>
                    <p>{dayIndex}</p>
                  </div>
                )
              })}
            </div>
          )
        })
        }
      </div>
    </div>
  )
}
