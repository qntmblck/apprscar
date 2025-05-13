export default function ApplicationLogo({ className = '' }) {
    return (
        <img
            src="/img/logoscar.png"
            alt="Transportes SCAR"
            className={`mx-auto mb-6 ${className}`}
        />
    );
}
