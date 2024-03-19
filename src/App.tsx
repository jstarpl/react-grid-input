import { GridInput } from "@components/GridInput";
import "./App.css";
import { useMemo, useState } from "react";

function App() {
	const [value, setValue] = useState("0_0\t1,One\n3_1\t2,Two");

	const availableOptions = useMemo(() => ["1,One", "2,Two", "3,Three"], []);

	return (
		<>
			<GridInput
				value={value}
				columns={9}
				rows={9}
				onChange={setValue}
				allowFreeText
				options={availableOptions}
			/>
			<textarea
				value={value}
				cols={80}
				rows={10}
				onChange={(e) => setValue(e.target.value)}
			/>
		</>
	);
}

export default App;
