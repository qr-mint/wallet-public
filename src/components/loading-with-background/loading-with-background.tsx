import classNames from 'classnames';

import { Portal } from '../portal';
import { Loading } from '../loading';
import styles from './loading-with-background.module.scss';

export const LoadingWithBackground = () => {
	return (
		<Portal>
			<div
				className={classNames(styles['modal'], { [styles.fade]: true })}
				aria-modal={true}
				style={{ display: 'block' }}
			>
				<Loading />
			</div>
			<div className={classNames(styles['modal__backdrop'])} />
		</Portal>
	);
};
