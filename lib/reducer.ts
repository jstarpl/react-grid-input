/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import { MatrixValue } from "./TypeDefinitions";
import { assertNever } from "./lib";

export type ComponentState = {
	currentValue: MatrixValue;
	fieldSeparator: string;
	recordSeparator: string;
	indexSeparator: string;
	stringifiedValue: string;
};

export type InitializerProps = {
	value?: string;
	fieldSeparator: string;
	recordSeparator: string;
	indexSeparator: string;
};

export type Action =
	| {
			type: "CHANGE_CELL";
			row: number;
			column: number;
			value: string | undefined;
	  }
	| {
			type: "SET_VALUE";
			value: string;
	  };

export function stateReducer(
	state: ComponentState,
	action: Action,
): ComponentState {
	function updateStringifiedValue(state: ComponentState) {
		return stringifyData(
			state.currentValue,
			state.recordSeparator,
			state.fieldSeparator,
			state.indexSeparator,
		);
	}

	switch (action.type) {
		case "CHANGE_CELL": {
			const newState = objectCopy(state);
			newState.currentValue = objectCopy(newState.currentValue);
			newState.currentValue[`${action.row}_${action.column}`] = action.value;
			newState.stringifiedValue = updateStringifiedValue(newState);
			return newState;
		}
		case "SET_VALUE": {
			if (state.stringifiedValue === action.value) return state;

			const newState = objectCopy(state);
			newState.currentValue = parseData(
				action.value,
				newState.recordSeparator,
				newState.fieldSeparator,
				newState.indexSeparator,
			);
			newState.stringifiedValue = updateStringifiedValue(newState);
			return newState;
		}
		default:
			assertNever(action);
			return state;
	}
}

export function stateInitializer({
	value,
	recordSeparator,
	fieldSeparator,
	indexSeparator,
}: InitializerProps): ComponentState {
	value ??= "";
	const data = parseData(
		value,
		recordSeparator,
		fieldSeparator,
		indexSeparator,
	);
	return {
		currentValue: data,
		stringifiedValue: value,
		recordSeparator,
		fieldSeparator,
		indexSeparator,
	};
}

function objectCopy<T>(obj: T): T {
	return Object.assign({}, obj);
}

function parseData(
	data: string,
	recordSeparator: string | RegExp,
	fieldSeparator: string | RegExp,
	indexSeparator: string | RegExp,
): MatrixValue {
	if (data.length === 0) return {};

	const newData: MatrixValue = {};

	data
		.split(recordSeparator)
		.map((recordLine) => {
			const record = recordLine.split(fieldSeparator);
			const indices = record[0]
				?.split(indexSeparator)
				.map((index) => Number(index)) as [number, number];
			if (!indices) return null;

			return { indices, value: record[1] };
		})
		.forEach((processed) => {
			if (!processed) return;
			newData[`${processed.indices[0]}_${processed.indices[1]}`] =
				processed.value;
		});

	return newData;
}

const DEFAULT_COLLATOR = new Intl.Collator(undefined, {
	usage: "sort",
	caseFirst: "upper",
});

function stringifyData(
	data: MatrixValue,
	recordSeparator: string,
	fieldSeparator: string,
	indexSeparator: string,
): string {
	return (
		Object.entries(data)
			.map(([key, value]) => {
				if (value === undefined) return null;
				const indices = key.split("_");
				return `${indices[0]}${indexSeparator}${indices[1]}${fieldSeparator}${value}`;
			})
			.filter(Boolean) as string[]
	)
		.sort((a, b) => DEFAULT_COLLATOR.compare(a, b))
		.join(recordSeparator);
}

export type Dispatch = (action: Action) => void;

export const DispatchContext = React.createContext<Dispatch | undefined>(
	undefined,
);
