import React, { useEffect, useMemo, useState } from "react";
import classes from "./GridCell.module.css";

export const GridCell = React.memo(function GridCell({
	value,
	displayValue,
	row,
	column,
	options,
	onChange,
}: {
	row: number;
	column: number;
	value: string | undefined;
	displayValue?: string;
	options: string[];
	onChange?: (row: number, column: number, value: string) => void;
}): React.ReactNode {
	const [active, setActive] = useState(false);
	const [selectRef, setSelectRef] = useState<HTMLSelectElement | null>(null);

	const allOptions = useMemo(() => ["", ...options], [options]);

	function onActivate() {
		setActive(true);
	}

	function onDeactivate() {
		setActive(false);
	}

	function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
		setActive(false);
		onChange?.(row, column, e.target.value);
	}

	function onClick() {
		onActivate();
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
		if (e.key === "Enter") return onActivate();
		if (e.key === "Escape") return onDeactivate();
	}

	useEffect(() => {
		if (!selectRef) return;

		selectRef.focus();
		selectRef.click();
	}, [selectRef]);

	return (
		<div
			className={`GridInput__GridCell ${classes.GridCell}`}
			tabIndex={0}
			role="gridcell"
			aria-rowindex={row + 1}
			aria-colindex={column + 1}
			onClick={onClick}
			onKeyDown={onKeyDown}
		>
			{displayValue ?? value}
			{active ? (
				<select
					onChange={onSelectChange}
					onBlur={onDeactivate}
					value={value}
					ref={setSelectRef}
				>
					{allOptions.map((option) => (
						<option value={option}>{option}</option>
					))}
				</select>
			) : null}
		</div>
	);
});
