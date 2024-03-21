import React, { useEffect, useMemo, useState } from "react";
import classes from "./GridCell.module.css";

export const GridCell = React.memo(function GridCell({
	value,
	displayValue,
	row,
	column,
	options,
	allowFreeText,
	onChange,
}: {
	row: number;
	column: number;
	value: string | undefined;
	displayValue: string | undefined;
	options: string[];
	allowFreeText: boolean;
	onChange?: (row: number, column: number, value: string) => void;
}): React.ReactNode {
	const [active, setActive] = useState(false);
	const [isFreeText, setFreeText] = useState(false);
	const [selectRef, setInputRef] = useState<
		HTMLSelectElement | HTMLInputElement | null
	>(null);

	const allOptions = useMemo(() => {
		const base = ["", ...options];
		if (value !== undefined && base.indexOf(value) < 0) base.unshift(value);
		return base;
	}, [options, value]);

	function onActivate() {
		setActive(true);
	}

	function onDeactivate() {
		setActive(false);
		setFreeText(false);
	}

	function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
		setActive(false);
		setFreeText(false);
		onChange?.(row, column, e.target.value);
	}

	function onTextInputBlur(e: React.FocusEvent<HTMLInputElement>) {
		setActive(false);
		setFreeText(false);
		onChange?.(row, column, e.target.value);
	}

	function onClick(e: React.MouseEvent<HTMLDivElement>) {
		onActivate();
		if (e.altKey) setFreeText(allowFreeText ? !isFreeText : false);
	}

	function onClear() {
		setActive(false);
		onChange?.(row, column, "");
	}

	function onCut(e: React.KeyboardEvent<HTMLElement>) {
		if (isFreeText) return;
		e.preventDefault();
		if (value === undefined) return;
		navigator.clipboard.writeText(value);
		onClear();
	}

	function onCopy(e: React.KeyboardEvent<HTMLElement>) {
		if (isFreeText) return;
		e.preventDefault();
		if (value === undefined) return;
		navigator.clipboard.writeText(value);
	}

	function onPaste(e: React.KeyboardEvent<HTMLElement>) {
		if (isFreeText) return;
		e.preventDefault();
		navigator.clipboard.readText().then((text) => {
			onChange?.(row, column, text);
		});
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
		if (e.key === "Enter") return onActivate();
		if (e.key === "Escape") return onDeactivate();
		if (e.key === "x" && (e.ctrlKey || e.metaKey)) return onCut(e);
		if (e.key === "c" && (e.ctrlKey || e.metaKey)) return onCopy(e);
		if (e.key === "v" && (e.ctrlKey || e.metaKey)) return onPaste(e);
		if (!isFreeText && (e.key === "Delete" || e.key === "Backspace"))
			return onClear();
	}

	useEffect(() => {
		if (!selectRef) return;

		selectRef.focus();
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
				isFreeText ? (
					<input
						type="text"
						onBlur={onTextInputBlur}
						defaultValue={value}
						ref={setInputRef}
					/>
				) : (
					<select
						onChange={onSelectChange}
						onBlur={onDeactivate}
						value={value}
						ref={setInputRef}
					>
						{allOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				)
			) : null}
		</div>
	);
});
