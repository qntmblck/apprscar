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
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    {/* CAMBIO AQUÍ */}
                    <InputLabel htmlFor="email" value="Correo electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    {/* CAMBIO AQUÍ */}
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

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Link href={route('register')}>
                            <PrimaryButton type="button" className="bg-gray-600 hover:bg-gray-700">
                                Registrarse
                            </PrimaryButton>
                        </Link>

                        <PrimaryButton className="" disabled={processing}>
                            Ingresar
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            {/* Separador */}
            <div className="my-6 text-center border-t border-gray-200 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm text-gray-500">
                    o inicia sesión con
                </span>
            </div>

            {/* Botón Google SCAR */}
            <div className="flex justify-center">
                <a
                    href={route('google.redirect')}
                    className="w-full flex items-center justify-center gap-3 bg-[#0c1e3a] hover:bg-[#132b54] text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                >
                    <img
                        src="/img/gmail.png?v=2"
                        alt="SCAR"
                        className="h-5 w-5"
                    />
                    Iniciar sesión con Google
                </a>
            </div>
        </GuestLayout>
    );
}
