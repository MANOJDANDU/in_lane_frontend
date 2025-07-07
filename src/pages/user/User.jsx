import React, { useState } from 'react';
import axios from 'axios';
import './User.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserRegister() {
  const [form, setForm] = useState({
    email: '',
    phoneNumber: '',
    fullname: '',
    dob: '',
    address: '',
  });

  const [files, setFiles] = useState({
    aadhaar: null,
    photograph: null,
    signature: null,
  });

  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (file && file.size > maxSize) {
      alert(`${e.target.name} file size should not exceed 2MB.`);
      return;
    }

    setFiles({ ...files, [e.target.name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dob = new Date(form.dob);
    const today = new Date();
    const ageDate = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());

    if (today < ageDate) {
      return alert('You must be at least 18 years old');
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    Object.entries(files).forEach(([k, v]) => formData.append(k, v));

    try {
      const res = await axios.post('http://localhost:8001/api/user/form', formData);
      console.log("-------res.data-----",res.data)
      if (res.data?.message === "User Already Exist") {
        toast.error("User already exists");
      } else if(res.data?.message === 'User Created') {
        toast.success("User registered successfully!");
      } else {
        toast.error("Oops something went wrong, Please try again");
      }
    } catch (err) {
      setResponseMsg('Sorry for Inconvince, Failed to submit. Please try again.');
    }
  };

  return (
    <div className="user-register-background">
      <div className="user-register-form">
        <h2 className="form-heading">User Registration</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="tel" name="phoneNumber" placeholder="Mobile" value={form.phone} onChange={handleChange} required />
          <input type="text" name="fullname" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
          <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required />

          <label>Aadhaar:</label>
          <input type="file" name="aadhaar" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} required />
          <label>Photograph:</label>
          <input type="file" name="photograph" accept=".png,.jpg,.jpeg" onChange={handleFileChange} required />
          <label>Signature:</label>
          <input type="file" name="signature" accept=".png,.jpg,.jpeg" onChange={handleFileChange} required />

          <button type="submit">Submit</button>
        </form>
        <ToastContainer position="top-center" />

        {responseMsg && <p style={{ marginTop: '20px' }}>{responseMsg}</p>}
      </div>
    </div>
  );
}

export default UserRegister;
