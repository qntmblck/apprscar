import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
  onSuccess: () => {
    window.location.href = '/login-success'
  },
  onFinish: () => reset('password'),
});

    };

    return (
        <GuestLayout>
  <Head title="Iniciar sesión" />

  {status && (
    <div className="mb-4 text-sm font-medium text-green-600 text-center">
      {status}
    </div>
  )}

  <form onSubmit={submit} className="space-y-6">
    {/* Email */}
    <div>
      <InputLabel htmlFor="email" value="Correo electrónico" />
      <TextInput
        id="email"
        type="email"
        name="email"
        value={data.email}
        className="mt-1 block w-full"
        autoComplete="username"
        isFocused
        onChange={(e) => setData('email', e.target.value)}
      />
      <InputError message={errors.email} className="mt-2" />
    </div>

    {/* Password */}
    <div>
      <InputLabel htmlFor="password" value="Clave de acceso" />
      <TextInput
        id="password"
        type="password"
        name="password"
        value={data.password}
        className="mt-1 block w-full"
        autoComplete="current-password"
        onChange={(e) => setData('password', e.target.value)}
      />
      <InputError message={errors.password} className="mt-2" />
    </div>

    {/* Remember */}
    <div className="flex items-center">
      <Checkbox
        name="remember"
        checked={data.remember}
        onChange={(e) => setData('remember', e.target.checked)}
      />
      <span className="ml-2 text-sm text-gray-600">Recordarme</span>
    </div>

    {/* Ingresar (botón y contenedor igual ancho que Google) */}
    <div className="px-0">
      <PrimaryButton
        type="submit"
        className="w-full flex justify-center bg-[#0c1e3a] hover:bg-[#132b54] text-white font-semibold py-2 rounded-md"
        disabled={processing}
      >
        INGRESAR
      </PrimaryButton>
    </div>
  </form>

  {/* Separador */}
  <div className="my-6 relative text-center">
    <div className="absolute inset-x-0 top-1/2 border-t border-gray-200" />
    <span className="relative px-3 bg-white text-sm text-gray-500">
      o inicia sesión con
    </span>
  </div>

  {/* Botón Google */}
  <div className="px-0">
    <a
      href={route('google.redirect')}
      className="w-full flex items-center justify-center gap-3 bg-[#0c1e3a] hover:bg-[#132b54] text-white font-semibold py-2 rounded-md transition-all duration-200"
    >
      <img src="/img/gmail.png?v=2" alt="SCAR" className="h-5 w-5" />
      Google
    </a>
  </div>

  {/* Registrarse link */}
  <p className="mt-6 text-center text-sm text-gray-700">
    ¿No tienes cuenta?{' '}
    <Link href={route('register')} className="font-semibold text-[#0c1e3a] hover:underline">
      Regístrate
    </Link>
  </p>
</GuestLayout>


    );
}
