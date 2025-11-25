import * as React from 'react';
const DivideCircle = (props) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", fill: "none", viewBox: "0 0 24 24", ...props },
    React.createElement("g", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, clipPath: "url(#prefix_divide-circle)" },
        React.createElement("path", { d: "M8 12h8M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10" })),
    React.createElement("defs", null,
        React.createElement("clipPath", { id: "prefix_divide-circle" },
            React.createElement("path", { fill: "#fff", d: "M0 0h24v24H0z" })))));
export default DivideCircle;
