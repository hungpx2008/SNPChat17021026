import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export const AsyncMessage = (props) => {
    const [msg, setMsg] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        fetch(props.apiUrl)
            .then((res) => res.text())
            .then((data) => {
            setMsg(data);
            setLoading(false);
        })
            .catch((err) => {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
        });
    }, [props.apiUrl]);
    if (error) {
        return _jsxs("span", { children: ["Error: ", error] });
    }
    if (isLoading) {
        return _jsx("span", { children: "Loading" });
    }
    return _jsx("span", { children: msg });
};
