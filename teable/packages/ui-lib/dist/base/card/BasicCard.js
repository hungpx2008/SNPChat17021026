import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const BasicCard = (props) => {
    const { image, title, description } = props;
    const imgSrc = image?.length ? image : undefined;
    return (_jsxs(_Fragment, { children: [imgSrc !== undefined ? _jsx("img", { loading: "lazy", src: imgSrc, alt: "something" }) : null, _jsxs("div", { className: "container", children: [_jsx("h4", { children: _jsx("strong", { children: title }) }), _jsx("p", { children: description })] })] }));
};
