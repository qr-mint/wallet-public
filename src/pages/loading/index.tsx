import { Loading as Loader, colors } from '@/components/loading';
import styles from './styles.module.scss';
import classNames from 'classnames';

export const Loading = () => {
	return (
		<div className={classNames(styles['loading-page'])}>
			<Loader color={colors.blue} className={styles['loading-page__icon']} />
		</div>
	);
};
