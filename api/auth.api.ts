const API = 'https://gov-taxlator-api.onrender.com';

export async function loginApi(payload: {
  emailOrPhone: string;
  password: string;
}) {
  const res = await fetch(`${API}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function signupApi(payload: any) {
  const body = {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
  };

  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Signup error:', data);
    throw new Error(data.message || 'Signup failed');
  }

  return data;
}


export async function verifyOtpApi(payload: {
  otp: string;
  emailOrPhone: string;
}) {
  const res = await fetch(`${API}/auth/sendVerificationCode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Invalid OTP');
  return res.json();
}
