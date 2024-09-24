import { FC, useMemo } from 'react';

import LetExchange from '@/assets/images/letsexachange.png';
import { BASE_URL } from '@/config/config.ts';

export interface UiImageProps {
	className?: string
	src?: string
	alt?: string
	isRemoteImage?: boolean
}

const initialOptions: UiImageProps = {
	className: '',
	// TODO: поставить нормальную заглушку
	src: LetExchange,
	alt: 'image',
	isRemoteImage: false
};

export const UiImage: FC<UiImageProps> = (props: UiImageProps) => {
	const computedSrc = useMemo(() => {
		if (props.isRemoteImage && props.src) {
			return `${BASE_URL}/${props.src}`;
		}
		
		return props.src ?? initialOptions.src;
	}, [ props.src, props.isRemoteImage ]);

	return (
		<img
			className={props.className ?? initialOptions.className}
			src={computedSrc}
			alt={props.alt ?? initialOptions.alt}
			loading="lazy"
		/>
	);
};