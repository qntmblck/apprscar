export default function FixedHeroBackground({ src, className = '', position = 'center center', style = {} }) {
    return (
        <div
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
            style={{ clipPath: 'inset(0)', WebkitClipPath: 'inset(0)' }}
            aria-hidden="true"
        >
            <div
                className="fixed inset-0 bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: position,
                    ...style,
                }}
            />
        </div>
    );
}
