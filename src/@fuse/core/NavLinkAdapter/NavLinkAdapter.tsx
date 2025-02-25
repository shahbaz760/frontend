import { NavLink, NavLinkProps, useNavigate } from 'react-router-dom';
import { CSSProperties, forwardRef, ReactNode } from 'react';
import { useAppDispatch } from 'app/store/store';
import { setCondition, setFilter, setFilterData, setMainOp, setSortFilter } from 'app/store/Projects';

export type NavLinkAdapterPropsType = NavLinkProps & {
	activeClassName?: string;
	activeStyle?: CSSProperties;
	children?: ReactNode;
};

/**
 * The NavLinkAdapter component is a wrapper around the React Router NavLink component.
 * It adds the ability to navigate programmatically using the useNavigate hook.
 * The component is memoized to prevent unnecessary re-renders.
 */
const NavLinkAdapter = forwardRef<HTMLAnchorElement, NavLinkAdapterPropsType>((props, ref) => {
	const { activeClassName = 'active', activeStyle, role = 'button', ..._props } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const projectChange = () => {

		const payload = {
			key: null,
			order: 0,
		};
		// Trigger actions when route changes
		dispatch(setFilter(0));
		dispatch(setCondition([]));
		dispatch(setMainOp(""));
		dispatch(setSortFilter([]));
		dispatch(setFilterData(payload));
	}

	return (
		<NavLink
			ref={ref}
			role={role}
			{..._props}
			onClick={(e) => {
				e.preventDefault();
				navigate(_props.to);
				projectChange()
			}}
			className={({ isActive }) =>
				[_props.className, isActive ? activeClassName : null].filter(Boolean).join(' ')
			}
			style={({ isActive }) => ({
				..._props.style,
				...(isActive ? activeStyle : null)
			})}
		>
			{props.children}
		</NavLink>
	);
});

export default NavLinkAdapter;
