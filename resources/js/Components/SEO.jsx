// resources/js/Components/SEO.jsx
import { Head, usePage } from '@inertiajs/react'

export default function SEO({
  title,
  description,
  canonical,
  image,
  noindex = false,
}) {
  const { props } = usePage()

  // Base URL desde Laravel (APP_URL compartido vía HandleInertiaRequests)
  const baseUrl = (props?.app?.url || '').replace(/\/$/, '')

  // Si no se pasa canonical, usar pathname actual
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : ''

  const canonicalPath = canonical || pathname || '/'

  const resolvedCanonical = baseUrl
    ? `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : canonicalPath

  const resolvedImage = image
    ? image.startsWith('http')
      ? image
      : baseUrl
        ? `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`
        : image
    : null

  return (
    <Head>
      {title && <title>{title}</title>}

      {description && (
        <meta name="description" content={description} />
      )}

      {resolvedCanonical && (
        <link rel="canonical" href={resolvedCanonical} />
      )}

      {noindex && (
        <meta name="robots" content="noindex,nofollow" />
      )}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && (
        <meta property="og:description" content={description} />
      )}
      {resolvedCanonical && (
        <meta property="og:url" content={resolvedCanonical} />
      )}
      <meta property="og:type" content="website" />
      {resolvedImage && (
        <meta property="og:image" content={resolvedImage} />
      )}

      {/* Twitter */}
      <meta
        name="twitter:card"
        content={resolvedImage ? 'summary_large_image' : 'summary'}
      />
      {title && <meta name="twitter:title" content={title} />}
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      {resolvedImage && (
        <meta name="twitter:image" content={resolvedImage} />
      )}
    </Head>
  )
}
