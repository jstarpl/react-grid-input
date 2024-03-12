# Grid Input for React

This is a React input component that allows inserting text from a predefined list of options into a grid. The output value is a list of key-value pairs.

## Install

```
npm i -S @jstarpl/react-grid-input
```

## Use

```JSX
<GridInput
    value={value}
    columns={9}
    rows={9}
    onChange={setValue}
    options={availableOptions}
/>
```

## Requirements

Requires React >= 16 and a build tool that can resolve CSS imports (like webpack's `css-loader` or `vite`).
