// resources/js/Components/SEO.jsx
import { Head, usePage } from '@inertiajs/react'

const DEFAULT_SITE_URL = 'https://scartransportes.cl'
const DEFAULT_SITE_NAME = 'Transportes SCAR'
const DEFAULT_IMAGE = '/img/dashboard/truck.jpg'

const isLocalUrl = (url) => /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url)

export default function SEO({
  title,
  description,
  canonical,
  image,
  noindex = false,
  type = 'website',
  siteName = DEFAULT_SITE_NAME,
  locale = 'es_CL',
  jsonLd,
}) {
  const { props } = usePage()

  const configuredUrl = (props?.app?.url || '').replace(/\/$/, '')
  const baseUrl = configuredUrl && !isLocalUrl(configuredUrl)
    ? configuredUrl
    : DEFAULT_SITE_URL

  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '/'

  const canonicalPath = (canonical || pathname || '/').split('#')[0]
  const resolvedCanonical = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${baseUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`

  const imagePath = image || DEFAULT_IMAGE
  const resolvedImage = imagePath
    ? imagePath.startsWith('http')
      ? imagePath
      : `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
    : null

  const robotsContent = noindex
    ? 'noindex,nofollow'
    : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'

  const structuredData = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Head>
      {title && <title>{title}</title>}

      {description && (
        <meta name="description" content={description} />
      )}

      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {resolvedCanonical && (
        <link rel="canonical" href={resolvedCanonical} />
      )}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && (
        <meta property="og:description" content={description} />
      )}
      {resolvedCanonical && (
        <meta property="og:url" content={resolvedCanonical} />
      )}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {resolvedImage && (
        <meta property="og:image" content={resolvedImage} />
      )}
      {resolvedImage && (
        <meta property="og:image:alt" content={siteName} />
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

      {structuredData.map((schema, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  )
}
