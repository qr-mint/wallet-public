import { FC } from 'react';

import Tippy, { TippyProps } from '@tippyjs/react';

export interface UiTooltipProps extends TippyProps {
	whenVisibleChange?: (visible: boolean) => void
}

const initialOptions: TippyProps = {
	arrow: false,
	placement: 'bottom-start',
};

export const UiTooltip: FC<UiTooltipProps> = (props: UiTooltipProps) => {
	return (
		<Tippy
			arrow={props.arrow ?? initialOptions.arrow}
			placement={props.placement ?? initialOptions.placement}
			render={props.render}
			onClickOutside={() => props.whenVisibleChange && props.whenVisibleChange(false)}
			{...props}
		>
			<div onClick={() => props.whenVisibleChange && props.whenVisibleChange(!props.visible)}>
				{props.children}
			</div>
		</Tippy>
	);
};