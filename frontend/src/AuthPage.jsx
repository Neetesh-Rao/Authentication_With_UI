import { useState,useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function AuthPage() {
            const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [showOtpModal,setShowOtpModal]=useState(false);
  const [verifyType,setVerifyType]=useState("");
  const [otp,setOtp]=useState("");

  // Dummy verification state (later backend se control karna)
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

useEffect(() => {
    const fetchVerificationStatus = async () => {
      if(!form.email) return;
      try{
        const res = await fetch(`http://localhost:5000/api/auth/get-verification-status?email=${form.email}`);
        const data = await res.json();
        if(res.ok){
          setEmailVerified(data.emailVerified);
          setPhoneVerified(data.phoneVerified);
        }
      }catch(err){
        console.log(err);
      }
    }

    fetchVerificationStatus();
  }, [form.email]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (isLogin) {
      const res=await fetch("http://localhost:5000/api/auth/login",{
            method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            identifier:form.emailOrPhone,
            password:form.password
         }),
      })
      const data = await res.json(); 
      if(res.ok){
        toast.success("Logged In Successfully");
        navigate("/dashboard",{state:{user:data.user}});
      }else {
      alert(data.message);
    }
    } else{
        if (!emailVerified || !phoneVerified) {
  toast.error("Please verify email and phone first");
  return;
}

const res = await fetch("http://localhost:5000/api/auth/complete-registration", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: form.name,
    email: form.email,
    phone: form.phone,
    password: form.password
  }),
});
const data =await res.json();
if (res.ok) 
  {
            toast.success("Registered Successfully");
    navigate("/dashboard", { state: { user: data.user } });
  }
else alert(data.message);
    }
  }

const handleOpenOtp = (type) => {
  setVerifyType(type);
  setShowOtpModal(true);
};

const handleVerifyOtp=async()=>{
try{
        const url=verifyType==="email"
    ?"http://localhost:5000/api/auth/verify-email-otp"
    :"http://localhost:5000/api/auth/verify-phone-otp"

const payload=verifyType==="email"
?{email:form.email,otp}
:{phone:form.phone,otp}


const res=await fetch(url,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
})
const data=res.json();
if(res.ok){
    if(verifyType==="email"){
      setEmailVerified(true);
      setOtp("");
    localStorage.setItem("phoneVerified", "true");
  }
    else {
      setPhoneVerified(true);
            setOtp("");
      localStorage.setItem("phoneVerified", "true");
    }

    setShowOtpModal(false);
     toast.success(`${verifyType} verified successfully`);
} else {
      toast.error(data.message);
                  setOtp("");
    }
}catch(err){
    console.log(err);
}

}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">

        {/* Switch Buttons */}
        <div className="flex mb-6 bg-gray-200 rounded-xl overflow-hidden">
          <button
            className={`w-1/2 py-2 font-semibold ${
              isLogin ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 font-semibold ${
              !isLogin ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* REGISTER FORM */}
          {!isLogin && (
            <>
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Email with verification */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <div className="absolute right-3 top-3"
                 onClick={async()=>{
                    if(!emailVerified){
                        const res=await fetch("http://localhost:5000/api/auth/send-email-otp",{
                            method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
                        });
                        // const data=res.json();
                        if(res.ok){
        toast.success("Email OTP sent");
        handleOpenOtp("email");
                        }else {
        // alert(data.message);
      }
                    }
                 }}
                >
                  {emailVerified ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>

              {/* Phone with verification */}
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <div className="absolute right-3 top-3"
                onClick={async() =>{ if(!phoneVerified){
const res=await fetch("http://localhost:5000/api/auth/send-phone-otp",{
method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email:form.email, phone: form.phone}),
})
const data=res.json();
if(res.ok){
     handleOpenOtp("phone");
     toast.success("Phone OTP sent");
}else{
    alert(data.message);
}
                }}}>
                  {phoneVerified ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>
            </>
          )}

          {/* LOGIN FORM */}
          {isLogin && (
            <>
              <input
                type="text"
                name="emailOrPhone"
                value={form.emailOrPhone}
                placeholder="Email or Phone"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </>
          )}

          {/* Password (common for both) */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>

{showOtpModal&& (
    <div className="fixed inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setShowOtpModal(false)}></div>
        <div className="relative bg-white w-80 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-center">Verify {verifyType}</h2>
     <input
              type="text"
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full p-3 border rounded-lg mb-4 text-center tracking-widest"
            />
             <button
            onClick={handleVerifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            >
              Verify OTP
            </button>
             <button
        onClick={() => setShowOtpModal(false)}
        className="w-full mt-2 text-gray-500 text-sm"
      >
        Cancel
      </button>
    </div>
    </div>
)}

    </div>
  );
}
