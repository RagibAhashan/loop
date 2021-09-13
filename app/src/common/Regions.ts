export type CountryIsoCode = { [key: string]: { countryIso: string; isocode: string; isocodeShort: string } };

export const PROVINCES_CANADA: CountryIsoCode = {
    Alberta: { countryIso: 'CA', isocode: 'CA-AB', isocodeShort: 'AB' },
    'British Columbia': { countryIso: 'CA', isocode: 'CA-BC', isocodeShort: 'BC' },
    Manitoba: { countryIso: 'CA', isocode: 'CA-MB', isocodeShort: 'MB' },
    'New Brunswick': { countryIso: 'CA', isocode: 'CA-NB', isocodeShort: 'NB' },
    'Newfoundland and Labrador': { countryIso: 'CA', isocode: 'CA-NL', isocodeShort: 'NL' },
    'Nova Scotia': { countryIso: 'CA', isocode: 'CA-NS', isocodeShort: 'NS' },
    Ontario: { countryIso: 'CA', isocode: 'CA-ON', isocodeShort: 'ON' },
    'Prince Edward Island': { countryIso: 'CA', isocode: 'CA-PE', isocodeShort: 'PE' },
    Quebec: { countryIso: 'CA', isocode: 'CA-QC', isocodeShort: 'QC' },
    Saskatchewan: { countryIso: 'CA', isocode: 'CA-SK', isocodeShort: 'SK' },
    'Northwest Territories': { countryIso: 'CA', isocode: 'CA-NT', isocodeShort: 'NT' },
    Nunavut: { countryIso: 'CA', isocode: 'CA-NU', isocodeShort: 'NU' },
    Yukon: { countryIso: 'CA', isocode: 'CA-YT', isocodeShort: 'YT' },
};

export const STATES_USA: CountryIsoCode = {
    Alabama: { countryIso: 'US', isocode: 'US-AL', isocodeShort: 'AL' },
    Alaska: { countryIso: 'US', isocode: 'US-AK', isocodeShort: 'AK' },
    Arizona: { countryIso: 'US', isocode: 'US-AZ', isocodeShort: 'AZ' },
    Arkansas: { countryIso: 'US', isocode: 'US-AR', isocodeShort: 'AR' },
    California: { countryIso: 'US', isocode: 'US-CA', isocodeShort: 'CA' },
    Colorado: { countryIso: 'US', isocode: 'US-CO', isocodeShort: 'CO' },
    Connecticut: { countryIso: 'US', isocode: 'US-CT', isocodeShort: 'CT' },
    Delaware: { countryIso: 'US', isocode: 'US-DE', isocodeShort: 'DE' },
    Florida: { countryIso: 'US', isocode: 'US-FL', isocodeShort: 'FL' },
    Georgia: { countryIso: 'US', isocode: 'US-GA', isocodeShort: 'GA' },
    Hawaii: { countryIso: 'US', isocode: 'US-HI', isocodeShort: 'HI' },
    Idaho: { countryIso: 'US', isocode: 'US-ID', isocodeShort: 'ID' },
    Illinois: { countryIso: 'US', isocode: 'US-IL', isocodeShort: 'IL' },
    Indiana: { countryIso: 'US', isocode: 'US-IN', isocodeShort: 'IN' },
    Iowa: { countryIso: 'US', isocode: 'US-IA', isocodeShort: 'IA' },
    Kansas: { countryIso: 'US', isocode: 'US-KS', isocodeShort: 'KS' },
    Kentucky: { countryIso: 'US', isocode: 'US-KY', isocodeShort: 'KY' },
    Louisiana: { countryIso: 'US', isocode: 'US-LA', isocodeShort: 'LA' },
    Maine: { countryIso: 'US', isocode: 'US-ME', isocodeShort: 'ME' },
    Maryland: { countryIso: 'US', isocode: 'US-MD', isocodeShort: 'MD' },
    Massachusetts: { countryIso: 'US', isocode: 'US-MA', isocodeShort: 'MA' },
    Michigan: { countryIso: 'US', isocode: 'US-MI', isocodeShort: 'MI' },
    Minnesota: { countryIso: 'US', isocode: 'US-MN', isocodeShort: 'MN' },
    Mississippi: { countryIso: 'US', isocode: 'US-MS', isocodeShort: 'MS' },
    Missouri: { countryIso: 'US', isocode: 'US-MO', isocodeShort: 'MO' },
    Montana: { countryIso: 'US', isocode: 'US-MT', isocodeShort: 'MT' },
    Nebraska: { countryIso: 'US', isocode: 'US-NE', isocodeShort: 'NE' },
    Nevada: { countryIso: 'US', isocode: 'US-NV', isocodeShort: 'NV' },
    'New Hampshire': { countryIso: 'US', isocode: 'US-NH', isocodeShort: 'NH' },
    'New Jersey': { countryIso: 'US', isocode: 'US-NJ', isocodeShort: 'NJ' },
    'New Mexico': { countryIso: 'US', isocode: 'US-NM', isocodeShort: 'NM' },
    'New York': { countryIso: 'US', isocode: 'US-NY', isocodeShort: 'NY' },
    'North Carolina': { countryIso: 'US', isocode: 'US-NC', isocodeShort: 'NC' },
    'North Dakota': { countryIso: 'US', isocode: 'US-ND', isocodeShort: 'ND' },
    Ohio: { countryIso: 'US', isocode: 'US-OH', isocodeShort: 'OH' },
    Oklahoma: { countryIso: 'US', isocode: 'US-OK', isocodeShort: 'OK' },
    Oregon: { countryIso: 'US', isocode: 'US-OR', isocodeShort: 'OR' },
    Pennsylvania: { countryIso: 'US', isocode: 'US-PA', isocodeShort: 'PA' },
    'South Carolina': { countryIso: 'US', isocode: 'US-SC', isocodeShort: 'SC' },
    'South Dakota': { countryIso: 'US', isocode: 'US-SD', isocodeShort: 'SD' },
    Tennessee: { countryIso: 'US', isocode: 'US-TN', isocodeShort: 'TN' },
    Texas: { countryIso: 'US', isocode: 'US-TX', isocodeShort: 'TX' },
    Utah: { countryIso: 'US', isocode: 'US-UT', isocodeShort: 'UT' },
    Vermont: { countryIso: 'US', isocode: 'US-VT', isocodeShort: 'VT' },
    Virginia: { countryIso: 'US', isocode: 'US-VA', isocodeShort: 'VA' },
    Washington: { countryIso: 'US', isocode: 'US-WA', isocodeShort: 'WA' },
    'West Virginia': { countryIso: 'US', isocode: 'US-WV', isocodeShort: 'WV' },
    Wisconsin: { countryIso: 'US', isocode: 'US-WI', isocodeShort: 'WI' },
    Wyoming: { countryIso: 'US', isocode: 'US-WY', isocodeShort: 'WY' },
    'District of Columbia': { countryIso: 'US', isocode: 'US-DC', isocodeShort: 'DC' },
    'American Samoa': { countryIso: 'US', isocode: 'US-AS', isocodeShort: 'AS' },
    Guam: { countryIso: 'US', isocode: 'US-GU', isocodeShort: 'GU' },
    'Northern Mariana Islands': { countryIso: 'US', isocode: 'US-MP', isocodeShort: 'MP' },
    'Puerto Rico': { countryIso: 'US', isocode: 'US-PR', isocodeShort: 'PR' },
    'United States Minor Outlying Islands': { countryIso: 'US', isocode: 'US-UM', isocodeShort: 'UM' },
    'U.S. Virgin Islands': { countryIso: 'US', isocode: 'US-VI', isocodeShort: 'VI' },
};

export const REGIONS: { [key: string]: CountryIsoCode } = {
    Canada: PROVINCES_CANADA,
    'United States': STATES_USA,
    default: {},
};

export const COUNTRY: any = { Canada: 'CA', 'United States': 'US' };
