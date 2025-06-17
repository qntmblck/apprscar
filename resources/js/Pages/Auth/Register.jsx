import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Registrarse" />

      {/** Campos de formulario */}
      <form onSubmit={submit} className="space-y-6">
        {/* Nombre */}
        <div>
          <InputLabel htmlFor="name" value="Nombre" />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            autoComplete="name"
            isFocused
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Email */}
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            autoComplete="username"
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        {/* Contraseña */}
        <div>
          <InputLabel htmlFor="password" value="Contraseña" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            autoComplete="new-password"
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirmar Contraseña"
          />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) =>
              setData('password_confirmation', e.target.value)
            }
            autoComplete="new-password"
            required
            className="mt-1 block w-full"
          />
          <InputError
            message={errors.password_confirmation}
            className="mt-2"
          />
        </div>

        {/* Botón Registrarse – full width, texto centrado como Google */}
        <div className="px-0">
          <PrimaryButton
            type="submit"
            disabled={processing}
            className="w-full flex justify-center bg-[#0c1e3a] hover:bg-[#132b54] text-white font-semibold py-2 rounded-md"
          >
            Registrarse
          </PrimaryButton>
        </div>
      </form>

      {/* Separador */}
      <div className="my-6 relative text-center">
        <div className="absolute inset-x-0 top-1/2 border-t border-gray-200" />
        <span className="relative px-3 bg-white text-sm text-gray-500">
          o continúa con
        </span>
      </div>

      {/* Botón Google */}
      <div className="px-0">
        <a
          href={route('google.redirect')}
          className="w-full flex items-center justify-center gap-3 bg-[#0c1e3a] hover:bg-[#132b54] text-white font-semibold py-2 rounded-md transition-all duration-200"
        >
          <img src="/img/gmail.png?v=2" alt="SCAR" className="h-5 w-5" />
          Registrarse con Google
        </a>
      </div>

      {/* Enlace a login */}
      <p className="mt-6 text-center text-sm text-gray-700">
        ¿Ya tienes cuenta?{' '}
        <Link
          href={route('login')}
          className="font-semibold text-[#0c1e3a] hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </GuestLayout>
  );
}
