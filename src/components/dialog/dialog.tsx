import classNames from 'classnames';

import { Portal } from '../portal';
import styles from './dialog.module.scss';
import { Button } from '../button';
import { Loading } from '../loading';

interface DialogProps {
	isLoading: boolean;
	show: any;
	title: string;
	description: string;
	onClose(): void;
	buttonText: string;
}

export const Dialog = ({ isLoading, show, title, description, onClose, buttonText }: DialogProps) => {
	const _render = ({ isLoading, title, onClose, buttonText }: Partial<DialogProps>) => {
		if (isLoading) {
			return <Loading />;
		} else {
			return (
				<div className={styles['modal__dialog']}>
					<div className={styles['modal__content']}>
						<div className={styles['modal__wrapper']}>
							<h3>{title}</h3>
							{description && <p>{description}</p>}
						</div>
						<div className={styles['modal__footer']}>
							<Button className={styles['modal__button']} onClick={onClose}>
								{buttonText}
							</Button>
						</div>
					</div>
				</div>
			);
		}
	};

	return <Portal>
		<>
			<div
				className={classNames(styles['modal'], { [styles.fade]: show })}
				aria-modal={show}
				style={{ 'display': 'block' }}
			>
				{_render({ isLoading, title, onClose, buttonText })}
			</div>
			<div className={classNames(styles['modal__backdrop'])} />
		</>
	</Portal>;
};
