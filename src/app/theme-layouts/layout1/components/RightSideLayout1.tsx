import QuickPanel from 'app/theme-layouts/shared-components/quickPanel/QuickPanel';
import { memo, lazy, Suspense } from 'react';

// const QuickPanel = lazy(() => import('app/theme-layouts/shared-components/quickPanel/QuickPanel'));

/**
 * The right side layout 1.
 */
function RightSideLayout1() {
	return (
		<Suspense>
			<QuickPanel />
		</Suspense>
	);
}

export default memo(RightSideLayout1);
