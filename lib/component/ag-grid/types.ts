import { AgGridReactProps } from '@ag-grid-community/react';
import { 
    RowModelType, IServerSideDatasource
 } from '@ag-grid-community/core';
import { CSSProperties } from 'react';
import {PaginationProps} from "antd/es/pagination/Pagination";
interface AgGridProps<TData = any> extends AgGridReactProps<TData> {
    /* 表格数据请求 */
    serverApi?: ServerApi<TData>;

    /* 表格数据请求参数 */
    serverParams?: Record<string, any>,

    sizeColumnsToFit?: boolean;

    onCellSelected?: (params: any) => void;
    /**
     * 自动选择第一行
     */
    autoFocusFirstRow?: boolean;

    style?: CSSProperties
    className?: string

    antdPaginationProps?: PaginationProps

    /**
     * 服务器模型，页眉复选框选择将只选择当前页面上的节点
     */
    serverHeaderCheckboxSelectionCurrentPageOnly?: boolean
}

interface ServerApiResult<TData> {
    status?: number
    code?: number
    result?: { list: TData[], total: number }
    error?: string
    msg?: string
}
interface ServerApi<TData> {
    (params: any): Promise<ServerApiResult<TData>>
}

/**
 * 自定义 pagination Props
 */
interface PaginationState {
    current: number
    total: number
    size: number
}

/**
 * 额外Props
 */
interface ExtraProps {
    /**
     * 服务端表格props
     */
    pagination?: boolean,
    rowModelType?: RowModelType
    paginationPageSize?: number
    cacheBlockSize?: number
    serverSideDatasource?: { getRows: IServerSideDatasource['getRows'] }

    rowSelection?: 'single' | 'multiple'
}

export type {
    ServerApi,
    ServerApiResult,
    PaginationState,
    ExtraProps,
    AgGridProps
}
