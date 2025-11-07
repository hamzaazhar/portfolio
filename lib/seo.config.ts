import { DefaultSeoProps } from 'next-seo'
import { getProfile } from './getProfile'

function getSEOConfig() {
  const { profile } = getProfile()

  return {
    titleTemplate: '%s | Rana Muhammad Hamza',
    defaultTitle: `${profile.name} | ${profile.title}`,
    description: profile.summary.join(' '),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://your-domain.com',
      siteName: profile.name,
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: profile.name,
        },
      ],
    },
    twitter: {
      cardType: 'summary_large_image',
    },
    additionalMetaTags: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
  } as DefaultSeoProps
}

export const defaultSEO = getSEOConfig()

