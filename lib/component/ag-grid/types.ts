import { AgGridReactProps } from '@ag-grid-community/react';
import { 
    RowModelType, ServerSideStoreType, IServerSideDatasource
 } from '@ag-grid-community/core';
import { CSSProperties } from 'react';
interface AgGridProps extends AgGridReactProps {
    /* 表格数据请求 */
    serverApi?: ServerApi;

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
}

interface ServerApiParams extends Record<string, any> {
    limit: number
    start: number
}
interface ServerApiResult {
    status: number
    code: number
    result: { list: any[], total: number }
    error?: string
    msg?: string
}
interface ServerApi {
    (params: ServerApiParams): Promise<ServerApiResult>
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
 * 服务端 ag-grid 额外Props
 */
interface ServerSideProps {
    pagination: boolean,
    rowModelType: RowModelType
    paginationPageSize: number
    cacheBlockSize: number
    serverSideStoreType: ServerSideStoreType
    serverSideDatasource: { getRows: IServerSideDatasource['getRows'] }
}

export type {
    ServerApi,
    ServerApiParams,
    ServerApiResult,
    PaginationState,
    ServerSideProps,
    AgGridProps
}
