import React, {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from "react";

import classes from "./GridInput.module.css";
import { ChangeEventHandler } from "./TypeDefinitions.ts";
import { DispatchContext, stateInitializer, stateReducer } from "./reducer.ts";
import { arrayRange } from "./lib.ts";
import { GridRow } from "./GridRow.tsx";
import { GridCell } from "./GridCell.tsx";

export function GridInput({
	rows,
	columns,
	options,
	value,
	onChange,
	allowFreeText,
}: {
	columns: number;
	rows: number;
	/** The controlled value of the input */
	value?: string;
	options: string[];
	/** Should the user be able to enter any text, after Alt + Click on a Cell */
	allowFreeText?: boolean;
	/** Callback for when the value of the input changes */
	onChange?: ChangeEventHandler;
}): React.ReactElement | null {
	const onChangeRef = useRef(onChange);

	const [state, dispatch] = useReducer(
		stateReducer,
		{
			value,
			recordSeparator: "\n",
			fieldSeparator: "\t",
			indexSeparator: "_",
		},
		stateInitializer,
	);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	const rowArray = useMemo(() => arrayRange(0, rows), [rows]);
	const colArray = useMemo(() => arrayRange(0, columns), [columns]);

	const gridStyle = useMemo<React.CSSProperties>(
		() => ({
			gridTemplateRows: arrayRange(0, rows)
				.map(() => "1fr")
				.join(" "),
			gridTemplateColumns: arrayRange(0, columns)
				.map(() => "1fr")
				.join(" "),
		}),
		[rows, columns],
	);

	const onGridCellChange = useCallback(
		(row: number, column: number, value: string) => {
			dispatch({
				type: "CHANGE_CELL",
				row,
				column,
				value: value || undefined,
			});
		},
		[],
	);

	useEffect(() => {
		if (value === undefined) return;

		dispatch({
			type: "SET_VALUE",
			value,
		});
	}, [value]);

	useEffect(() => {
		onChangeRef.current?.(state.stringifiedValue);
	}, [state.stringifiedValue]);

	return (
		<div
			className={`GridInput ${classes.GridInput}`}
			role="grid"
			style={gridStyle}
			aria-rowcount={rows}
			aria-colcount={columns}
		>
			<DispatchContext.Provider value={dispatch}>
				{rowArray.map((rowIndex) => (
					<GridRow key={rowIndex} index={rowIndex}>
						{colArray.map((colIndex) => (
							<GridCell
								key={colIndex}
								row={rowIndex}
								column={colIndex}
								options={options}
								displayValue={undefined}
								allowFreeText={allowFreeText ?? false}
								value={state.currentValue[`${rowIndex}_${colIndex}`]}
								onChange={onGridCellChange}
							/>
						))}
					</GridRow>
				))}
			</DispatchContext.Provider>
		</div>
	);
}
