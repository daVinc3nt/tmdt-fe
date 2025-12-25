import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
}

export const SEO = ({
    title,
    description,
    name = 'FitConnect',
    type = 'website'
}: SEOProps) => {
    const defaultTitle = "FitConnect - Connect with Personal Trainers & Gyms";
    const defaultDescription = "Find and book sessions with top personal trainers. Shop genuine fitness equipment and supplements.";

    const finalTitle = title ? `${title} | ${name}` : defaultTitle;
    const finalDescription = description || defaultDescription;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{finalTitle}</title>
            <meta name='description' content={finalDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            {/* <meta property="og:image" content={image} /> */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
        </Helmet>
    );
};
