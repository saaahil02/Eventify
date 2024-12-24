import React from 'react'
import {Link} from 'react-router-dom'
const OrganizerDashboard = () => {
  
  return (
    <>
    <div>
      <htmlForm>
        <fieldset>
          <h3>SignUp/Login</h3>
          <label>Name</label><input type='name' required></input><br></br>
          <label>Email</label><input type='email' required></input><br></br>
          <label>Password</label><input type='password' required></input><br/>
          <input type='submit' ></input>
        </fieldset>
      </htmlForm>
      <Link to='/'> Back to Home Page</Link><br></br>
    </div>
    </>
  )
}

export default OrganizerDashboard
