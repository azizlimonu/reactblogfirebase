import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Auth = ({ setActive, setUser }) => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const [state, setState] = useState(initialState);
  const [signUp, setSignUp] = useState(false);

  const { email, password, firstName, lastName, confirmPassword } = state;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    console.log('auth on going');
    if (!signUp) {
      if (email && password) {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(user);
        setActive('home');
      } else {
        return toast.error('field must not be empty');
      }
      // sing in...
    } else {
      // then we signup and check the form
      // first we check if the passwordd match with the confrimpassword
      if (password !== confirmPassword) {
        return toast.error("Password don't match");
      }
      // then we check the user and get user info for create a user
      if (firstName && lastName && email && password) {
        // get the user if the user fill up the form, sign up the user
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // we update the profile user
        await updateProfile(user, { displayName: `${firstName} ${lastName}` });
        // after succesfull signup we navigate to the home
        setActive("home");
      } else {
        // if theres any input the user didnt fill 
        return toast.error("All fields are mandatory to fill");
      }
    }
    // after signup or signin we navigate to the home
    navigate("/");

  }


  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">

          <div className="text-center heading py-2">
            {!signUp ? 'Sign-In' : 'Sign-Up'}
          </div>

        </div>

        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form
              className="row"
              onSubmit={handleAuth}
            >
              {signUp && (
                <>
                  <div className='col-6 py-3'>
                    <input
                      type='text'
                      placeholder='FirstName'
                      className='form-control input-text-box'
                      name='firstName'
                      value={firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='col-6 py-3'>
                    <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="Last Name"
                      name="lastName"
                      value={lastName}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              <div className="col-12 py-3">
                <input
                  type="email"
                  className="form-control input-text-box"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="password"
                  className="form-control input-text-box"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </div>

              {signUp && (
                <div className='col-12 py-3'>
                  <input
                    type='password'
                    name='confirmPassword'
                    className='form-control input-text-box'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className='col-12 py-3 text-center'>
                <button
                  type='submit'
                  className={`btn ${!signUp ? 'btn-sign-in' : 'btn-sign-up'}`}
                >
                  {!signUp ? "Sign-in" : "Sign-up"}
                </button>
              </div>

            </form>

            <div>
              {!signUp ? (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account ?&nbsp;
                      <span
                        className="link-danger"
                        style={{ textDecoration: "none", cursor: "pointer" }}
                        onClick={() => setSignUp(true)}
                      >
                        Sign Up
                      </span>
                    </p>
                  </div>
                </>

              ) : (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Already have an account ?&nbsp;
                      <span
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "#298af2",
                        }}
                        onClick={() => setSignUp(false)}
                      >
                        Sign In
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth