import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Children, cloneElement } from 'react';
import { useTranslation } from './useTranslation';
function cloneWithChildren(element, children) {
    return cloneElement(element, undefined, ...children);
}
function tokenize(input) {
    const tokens = [];
    const regex = /<\/?([a-z0-9]+)\s*>|<([a-z0-9]+)\s*\/>/gi;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(input)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ type: 'text', value: input.slice(lastIndex, match.index) });
        }
        lastIndex = regex.lastIndex;
        const [full, tag, selfTag] = match;
        if (selfTag) {
            tokens.push({ type: 'self', tag: selfTag });
        }
        else if (full.startsWith('</')) {
            tokens.push({ type: 'close', tag });
        }
        else {
            tokens.push({ type: 'open', tag });
        }
    }
    if (lastIndex < input.length)
        tokens.push({ type: 'text', value: input.slice(lastIndex) });
    return tokens;
}
function pushText(stack, value) {
    if (value)
        stack[stack.length - 1].children.push(value);
}
function pushSelf(stack, tag, components) {
    if (!tag)
        return;
    const comp = components[tag];
    stack[stack.length - 1].children.push(comp ? cloneElement(comp) : `<${tag}/>`);
}
function openTag(stack, tag) {
    if (!tag)
        return;
    stack.push({ tag, children: [] });
}
function closeTag(stack, tag, components) {
    if (!tag)
        return;
    const frame = stack.pop();
    if (!frame || frame.tag !== tag) {
        stack[stack.length - 1].children.push(`</${tag}>`);
        if (frame)
            stack.push(frame);
        return;
    }
    const comp = components[tag];
    const node = comp
        ? cloneWithChildren(comp, frame.children)
        : frame.children;
    stack[stack.length - 1].children.push(node);
}
function buildNodes(tokens, components) {
    const root = { tag: '#root', children: [] };
    const stack = [root];
    for (const token of tokens) {
        if (token.type === 'text') {
            pushText(stack, token.value);
        }
        else if (token.type === 'self') {
            pushSelf(stack, token.tag, components);
        }
        else if (token.type === 'open') {
            openTag(stack, token.tag);
        }
        else if (token.type === 'close') {
            closeTag(stack, token.tag, components);
        }
    }
    return root.children;
}
export const Trans = ({ i18nKey, components = {}, values }) => {
    const { t } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source = String(t(i18nKey, values) ?? '');
    const nodes = buildNodes(tokenize(source), components);
    return _jsx(_Fragment, { children: Children.toArray(nodes) });
};
