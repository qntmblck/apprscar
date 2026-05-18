export default function ApplicationLogo({ className = '' }) {
    return (
        <img
            src="/img/logoscar.webp"
            alt="Transportes SCAR"
            className={`mx-auto mb-6 ${className}`}
        />
    );
}
