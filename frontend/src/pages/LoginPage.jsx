// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; // Link component'ini de import et
import { login, reset } from '../features/auth/authSlice'; // login thunk'ını import et

function LoginPage() {
  // Form girdileri için local state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

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
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    // Login thunk'ını dispatch et
    dispatch(login(userData));
  };

  // Başarı veya hata durumlarını izlemek için useEffect
  useEffect(() => {
    if (isError) {
      // TODO: Hata mesajını daha kullanıcı dostu göster
      alert(`Giriş Hatası: ${message}`);
    }

    // Giriş başarılıysa veya kullanıcı zaten giriş yapmışsa anasayfaya yönlendir
    if (isSuccess || user) {
      navigate('/'); // Anasayfaya yönlendir
    }

    // Bu effect'in bağımlılıkları değiştiğinde (örn: isError, isSuccess) çalışır.
    // Eğer bir işlem tamamlandıysa (başarılı veya hatalı), state'i sıfırlayabiliriz.
    // Ancak, yönlendirme hemen oluyorsa, reset'i unmount'ta yapmak daha iyi olabilir.
    // dispatch(reset()); // Şimdilik yoruma alalım, unmount'ta reset var.

  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Component unmount olduğunda (sayfadan ayrılırken) hata/başarı durumunu temizle
  useEffect(() => {
    return () => {
      dispatch(reset());
    }
  }, [dispatch]);


  return (
    <div className="flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Giriş Yap</h1>
      <form onSubmit={onSubmit} className="w-full max-w-xs">
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

        <div className="form-control w-full mb-6">
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
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-full" // btn-primary yerine btn-success
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            'Giriş Yap'
          )}
        </button>

        {/* Hata mesajını göstermek için */}
        {isError && message && (
            <div role="alert" className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Hata! {message}</span>
             </div>
         )}

        <div className="text-center mt-4">
          <p className="text-sm">
            Hesabın yok mu?{' '}
            <Link to="/register" className="link link-secondary">
              Hemen Kayıt Ol
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;