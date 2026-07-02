import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Used to redirect to your product dashboard on success

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. INPUT VALIDATION GATE
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // 2. MOCK LOGIN VERIFICATION (Using placeholder credentials for development)
    if (email === 'user@example.com' && password === 'password123') {
      console.log('Login Successful!');
      // Redirect the user straight back to your master product dashboard screen
      navigate('/'); 
    } else {
      setErrorMessage('Invalid email or password. Hint: user@example.com / password123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-5 py-12 select-none">
      
      {/* THE LOGIN PLACARD CONTAINER */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 p-8 flex flex-col gap-6 relative">
        
        {/* UPPER VISUAL HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to your account to explore our latest picks.</p>
        </div>

        {/* AUTOMATED SYSTEM ERROR BADGE */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl shadow-xs transition-all animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* INPUT LOGIN FORM */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          
          {/* EMAIL SUB-ELEMENT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-600 transition-colors bg-gray-50/50"
            />
          </div>

          {/* PASSWORD SUB-ELEMENT WITH EYE TOGGLE */}
          <div className="flex flex-col gap-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Password</label>
              <a href="#forgot" className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors">Forgot?</a>
            </div>
            
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-600 transition-colors bg-gray-50/50 pr-10"
              />
              {/* EYE ICON ICON BUTTON */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L17.772 17.772m0 0a10.45 10.45 0 01-5.772 1.728c-4.757 0-8.774-3.162-10.065-7.498a10.516 10.516 0 014.293-5.774M17.772 17.772L6.228 6.228" /></svg>
                ) : (
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* THE HYPER-ACTION SUBMIT BUTTON */}
          <button 
            type="submit"
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all active:scale-98 cursor-pointer mt-2 flex items-center justify-center"
          >
            Sign In
          </button>
        </form>

        {/* LOWER DATA FOOTER LAYER */}
        <div className="text-center border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
              Create one here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
