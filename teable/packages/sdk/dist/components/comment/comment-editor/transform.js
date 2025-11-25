import { CommentNodeType } from '@teable/openapi';
import { size, has } from 'lodash';
export const hasOnlyProperty = (obj, propertyName) => {
    return size(obj) === 1 && has(obj, propertyName);
};
export const isTextCommentNode = (element) => {
    return hasOnlyProperty(element, 'text') && !!element.text;
};
export class EditorTransform {
    static editorValue2CommentValue = (value) => {
        if (!value ||
            (value.length === 1 && value[0]?.children.length === 1 && !value[0].children[0].text)) {
            return [];
        }
        return value.map((element) => {
            if (element.type === CommentNodeType.Img) {
                console.log('element', element);
                return {
                    type: CommentNodeType.Img,
                    path: element.path,
                    width: element.width,
                };
            }
            else {
                return {
                    type: CommentNodeType.Paragraph,
                    children: element.children
                        .filter((chi) => {
                        return chi.text || chi.type;
                    })
                        .map((child) => {
                        if (isTextCommentNode(child)) {
                            return {
                                value: child.text,
                                type: CommentNodeType.Text,
                            };
                        }
                        if (child.type === CommentNodeType.Mention) {
                            console.log('childchildchildchildchild', child);
                            return {
                                type: CommentNodeType.Mention,
                                value: child.value.id,
                            };
                        }
                        if (child.type === CommentNodeType.Img) {
                            return {
                                type: CommentNodeType.Img,
                                path: child.path,
                                width: child.width,
                            };
                        }
                        if (child.type === CommentNodeType.Link) {
                            return {
                                type: CommentNodeType.Link,
                                url: child.url,
                                title: child?.children?.[0].text || '',
                            };
                        }
                    }),
                };
            }
        });
    };
    static commentValue2EditorValue = (value) => {
        return value.map((element) => {
            const { type: lineType } = element;
            if (lineType === CommentNodeType.Img) {
                return {
                    type: CommentNodeType.Img,
                    path: element.path,
                    url: element.url,
                    width: element.width,
                    children: [{ text: '' }],
                };
            }
            else {
                return {
                    type: 'p',
                    children: element.children.map((child) => {
                        switch (child.type) {
                            case CommentNodeType.Text: {
                                return {
                                    text: child.value,
                                };
                            }
                            case CommentNodeType.Mention: {
                                return {
                                    value: {
                                        id: child.value,
                                        name: child.name,
                                        avatar: child.avatar,
                                    },
                                    children: [{ text: '' }],
                                    type: CommentNodeType.Mention,
                                };
                            }
                            case CommentNodeType.Link: {
                                return {
                                    type: CommentNodeType.Link,
                                    url: child.url,
                                    children: [{ text: child.title }],
                                };
                            }
                        }
                    }),
                };
            }
        });
    };
}
