import React from 'react'
import { NavLink } from 'react-router-dom'

const navigations = [
  {
    to: '/',
    label: 'Crypto',
  },
  {
    to: '/trending',
    label: 'Trending',
  },
  {
    to: '/saved',
    label: 'Saved',
  },
]

const Navigation = () => {
  return (
    <nav className="mt-16 flex w-[40%] justify-around rounded-lg border border-solid border-cyan align-middle">
      {navigations.map((navigation) => (
        <NavLink
          to={navigation.to}
          end
          className={({ isActive }) =>
            `m-2.5 w-full cursor-pointer rounded text-center font-nunito text-base font-semibold capitalize ${
              isActive ? 'bg-cyan text-gray-300' : 'bg-gray-200 text-gray-100 hover:text-cyan'
            }`
          }>
          {navigation.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navigation
