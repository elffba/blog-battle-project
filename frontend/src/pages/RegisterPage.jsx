import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice'; 

function RegisterPage() {
  // Form girdileri için local state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', 
  });

  const { username, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store'dan ilgili state'leri seç
  const { user, token, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth 
  );

  // Form input değişikliklerini yöneten fonksiyon
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Form gönderildiğinde çalışacak fonksiyon
  const onSubmit = (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    if (password !== password2) {
      alert('Şifreler eşleşmiyor!');
    } else {
      const userData = {
        username,
        email,
        password,
      };
      // Register thunk'ını dispatch et
      dispatch(register(userData));
    }
  };

   useEffect(() => {
    if (isError) {
       alert(`Kayıt Hatası: ${message}`);
    }

    if (isSuccess || user) {
      navigate('/'); // Anasayfaya yönlendir
    }

  }, [user, isError, isSuccess, message, navigate, dispatch]);


  // Component unmount olduğunda (sayfadan ayrılırken) hata/başarı durumunu temizle
  useEffect(() => {
    return () => {
      dispatch(reset());
    }
  }, [dispatch]);


  return (
    <div className="flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Hesap Oluştur</h1>
      <form onSubmit={onSubmit} className="w-full max-w-xs">
        {/* DaisyUI Form Control Kullanımı */}
        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="username">
            <span className="label-text">Kullanıcı Adı</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            placeholder="Kullanıcı adınızı girin"
            className="input input-bordered w-full"
            onChange={onChange}
            required 
          />
        </div>

        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="email">
            <span className="label-text">E-posta</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="E-posta adresinizi girin"
            className="input input-bordered w-full"
            onChange={onChange}
            required
          />
        </div>

        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="password">
            <span className="label-text">Şifre</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Şifrenizi girin"
            className="input input-bordered w-full"
            onChange={onChange}
            required
            minLength={6} // Minimum uzunluk kontrolü
          />
        </div>

        <div className="form-control w-full mb-6">
          <label className="label" htmlFor="password2">
            <span className="label-text">Şifre Tekrar</span>
          </label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            placeholder="Şifrenizi tekrar girin"
            className="input input-bordered w-full"
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-full" 
          disabled={isLoading} 
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span> 
          ) : (
            'Kayıt Ol'
          )}
        </button>

         {isError && message && (
            <div role="alert" className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Hata! {message}</span>
             </div>
         )}

      </form>
    </div>
  );
}

export default RegisterPage;