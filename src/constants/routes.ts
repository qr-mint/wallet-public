export const SwapRoutes = {
	SWAP: (queryString?: string): string => `/swap/${queryString ? queryString : ''}`,
	CONFIRM: '/swap/confirm',
	SUCCESS: '/swap/success'
} as const;