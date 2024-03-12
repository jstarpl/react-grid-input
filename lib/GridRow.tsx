import { ReactElement, PropsWithChildren } from "react";
import classes from "./GridRow.module.css";

export function GridRow({
	children,
	index,
}: PropsWithChildren<{
	index: number;
}>): ReactElement {
	return (
		<div
			className={`GridInput__GridRow ${classes.GridRow}`}
			role="row"
			aria-rowindex={index + 1}
		>
			{children}
		</div>
	);
}
