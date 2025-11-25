import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid';
import { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import * as XLSX from 'xlsx';
import { Button, cn, Skeleton } from '../../../../shadcn';
import { Spin } from '../../../spin/Spin';
import { FilePreviewContext } from '../FilePreviewContext';
import { getFileIcon } from '../getFileIcon';
import { numberCoordinate2Letter, getBlobFromUrl, getEndColumn, letterCoordinate2Number, } from './utils';
const DEFAULT_EMPTY_SHEET = [{ title: 'A', id: 'A' }];
export const ExcelPreview = (props) => {
    const { src, mimetype } = props;
    const [error, setError] = useState(null);
    const [currentSheetName, setCurrentSheetName] = useState(null);
    const [sheetList, setSheetList] = useState([]);
    const [loading, setLoading] = useState(true);
    const FileIcon = useMemo(() => (mimetype ? getFileIcon(mimetype) : ''), [mimetype]);
    const { i18nMap } = useContext(FilePreviewContext);
    const currentSheetData = useMemo(() => {
        return sheetList.find((sheet) => sheet.name === currentSheetName)?.data;
    }, [sheetList, currentSheetName]);
    const cols = useMemo(() => {
        if (!currentSheetData) {
            return DEFAULT_EMPTY_SHEET;
        }
        const ref = currentSheetData['!ref'];
        if (!ref) {
            return DEFAULT_EMPTY_SHEET;
        }
        const letter = getEndColumn(ref);
        const colNum = letterCoordinate2Number(letter);
        return (Array.from({ length: colNum }).map((_, index) => ({
            title: numberCoordinate2Letter(index + 1),
            id: numberCoordinate2Letter(index + 1),
        })) || []);
    }, [currentSheetData]);
    useEffect(() => {
        const fetchAndParseExcel = async () => {
            try {
                setError(null);
                setLoading(true);
                const blob = await getBlobFromUrl(src);
                const buffer = await blob.arrayBuffer();
                if (blob.size > 1024 * 1024 * 10) {
                    const errorText = i18nMap?.['previewFileLimit'] ||
                        'File is too large to preview, please download it instead.';
                    setError(errorText);
                    return;
                }
                const workbook = XLSX.read(buffer, { dense: true });
                const newSheetList = [];
                Object.keys(workbook.Sheets).forEach((name, index) => {
                    if (index === 0) {
                        setCurrentSheetName(name);
                    }
                    const sheet = workbook.Sheets[name];
                    const item = {
                        name: name,
                        data: sheet,
                    };
                    newSheetList.push(item);
                });
                setSheetList(newSheetList);
            }
            catch (e) {
                console.error('Failed to load Excel file:', e);
                setError(i18nMap?.['loadFileError'] || 'Failed to load file');
            }
        };
        fetchAndParseExcel();
    }, [i18nMap, src]);
    const getData = useCallback(([col, row]) => {
        if (setLoading) {
            setLoading(false);
        }
        const rowData = currentSheetData?.[row] || {};
        const cellData = (rowData?.[col] || {});
        const value = (cellData?.w ?? cellData?.v ?? '');
        return {
            kind: GridCellKind.Text,
            data: value,
            allowOverlay: true,
            displayData: value,
        };
    }, [currentSheetData]);
    if (error) {
        return (_jsxs("div", { className: "size-full text-red-500 items-center justify-center flex flex-col", children: [FileIcon && _jsx(FileIcon, { className: "max-w-max max-h-max w-40 h-40" }), error] }));
    }
    return (_jsxs("div", { className: "size-full bg-secondary rounded-sm relative pb-7", children: [loading && (_jsxs("div", { className: "size-full absolute z-50", children: [_jsx(Skeleton, { className: "size-full" }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", children: _jsx(Spin, {}) })] })), currentSheetData && (_jsx(DataEditor, { className: cn('size-full rounded-sm', {
                    'opacity-0': loading,
                }), rowMarkers: 'number', smoothScrollX: true, smoothScrollY: true, overscrollX: 0, overscrollY: 0, fixedShadowY: false, fixedShadowX: true, experimental: {
                    paddingRight: 10,
                    paddingBottom: 10,
                }, verticalBorder: true, getCellContent: (cell) => getData(cell), columns: cols, rows: currentSheetData.length || 1 })), _jsx("div", { className: "bottom-0 absolute w-full overflow-x-auto rounded-sm", children: sheetList.map((sheet) => (_jsx(Button, { variant: 'outline', size: 'xs', className: cn('text-muted-foreground rounded-none bg-secondary', {
                        'bg-card': currentSheetName === sheet.name,
                    }), onClick: () => {
                        if (currentSheetName === sheet.name) {
                            return;
                        }
                        setCurrentSheetName(sheet.name);
                    }, children: sheet.name }, sheet.name))) })] }));
};
