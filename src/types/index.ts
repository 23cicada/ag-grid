// import { ReactNode, CSSProperties, HTMLAttributes } from 'react';
// import { AgGridReactProps } from '@ag-grid-community/react';
// import { ColumnApi, GridApi, ICellRendererParams } from '@ag-grid-community/core';
// import { HttpResult } from '@/utils/base/request';
// import { AxiosRequestConfig } from 'axios';
// import { ModalProps } from 'antd/lib/modal'
// import { Module } from './ag-grid-modal';
// export * from '@ag-grid-community/core'
// export * from '@ag-grid-community/react/lib/agGridReact';
//
// export interface AgGridProps extends AgGridReactProps {
//     /**
//      * 操作列渲染
//      * @param ag-grid列数据对象
//      * @returns 返回操作列
//      */
//     actionUnit?: (params: AgGridICellRendererParams) => ReactNode,
//     /**
//      * 操作列最大显示数量
//      */
//     // actionUnitCount?: number;
//     /**
//      * 操作列宽度
//      */
//     actionWidth?: number;
//     wrapClass?: string;
//     wrapStyle?: CSSProperties;
//     /**
//      * 请求request方法
//      */
//     requestApi?: GridRequest;
//     /**
//      * 请求参数
//      */
//     requestParams?: Record<string, any> | null | undefined,
//     // deleteApi?: (params: any) => Promise<HttpResult>;
//     sizeColumnsToFit?: boolean;
//     onCellChoose?: (params: any) => void;
//     /**
//      * 原生分页
//      */
//     nativePagination?: boolean
//     /**
//      * 隐藏antd分页组件
//      */
//     hidePagination?: boolean;
//     /**
//      * antd分页组件大小
//      */
//     paginationSize?: "small" | "default";
//     /**
//      * 默认选择第一行
//      */
//     focusFirstRow?: boolean;
//     /**
//      * 左右键翻页
//      */
//     leftRightArrowPaging?: boolean;
//     /**
//      * ag-grid 主题样式
//      */
//     agThemeClass?: string;
//     /**
//      * 转换服务端数据
//      */
//     onTransformServerData?: (data: Record<string, any>[]) => Record<string, any>[];
//     /**
//      * 完成服务端请求
//      */
//     onRequestSuccess?: (params: RequestSuccessEvent) => void;
//     /**
//      * 额外的module
//      */
//     modules?: Module[];
//     /**
//      * 页脚
//      */
//     footer?: JSX.Element;
//     /**
//      * 顶部固定行配置
//      */
//     pinnedBottomRowOptions?: { label: string, value: string }[]
//     /**
//      * 包裹容器Props
//      */
//     wrapProps?: HTMLAttributes<HTMLDivElement> & {
//         'data-name'?: string
//     }
// }
//
// export interface RequestSuccessEvent {
//     result: { list: any[], total: number }
//     params: {
//         start?: number,
//         limit?: number,
//         [propName: string]: any
//     },
//     api: GridApi,
//     columnApi: ColumnApi
// }
//
// export interface GridRequest {
//     (params: RequestParams, config: AxiosRequestConfig): Promise<HttpResult>
// }
//
// export interface RequestParams extends Record<string, any>{
//     start?: number
//     limit?: number
// }
//
// export interface AgGridICellRendererParams extends ICellRendererParams {
//     [propName: string]: any
// }
//
// export enum ActionEnum {
//     delete = 'delete'
// }
//
// export enum AgGridColId {
//     'actionCol' = 'actionCol'
// }
//
// export interface PaginationState {
//     current: number
//     total: number
//     size: number
// }
//
// export interface AgGridRef {
//     focusFirstRow: () => void
//     refresh: () => void
//     api: GridApi
//     columnApi: ColumnApi
// }
//
// export interface AgGridModalProps{
//     modalProps: ModalProps
//     agGridProps: AgGridProps
// }
//
