import React from 'react'

const Notifications = () => {
  const notifications = [
    'Notification 1',
    'Notification 2',
    'Notification 3',
  ]

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  )
}

export default Notifications
