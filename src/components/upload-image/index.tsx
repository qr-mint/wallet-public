import { useEffect, useState } from 'react';

const MB = 1024 * 1024;


export const ImageUpload = ({ onChange, error, render, validMb, ...props }: any) => {
	const [ image, setImage ] = useState(null);
	const [ err, setError ] = useState(error);

	useEffect(() => {
		setError(error);
	}, [error]);

	const onUpload = (e: any) => {
		const file = e.currentTarget.files[0];
		if (!file) return;
		if (validMb && file.size > MB * validMb) {
			setError('Banner is very big size.');
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = (e: any) => {
			const objectUrl = e.target.result;
			setImage(objectUrl);
			onChange(file);
		};
	};
	return render({ onChange: onUpload, error: err, image, ...props });
};
