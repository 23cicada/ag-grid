import React, { useCallback, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { LicenseManager } from 'ag-grid-enterprise';
import {
    AgGridColId, AgGridProps,
    PaginationState, AgGridRef,
    GridReadyEvent, GridApi,
    ColumnApi, AgGridReact,
    PaginationChangedEvent,
    FirstDataRenderedEvent,
    CellDoubleClickedEvent,
    CellKeyDownEvent,
    NavigateToNextCellParams,
    CellPosition,
    IServerSideGetRowsParams,
    RowStyle
} from './interface';

LicenseManager.setLicenseKey("peakandyuri_MTc0NjU5ODM3NjkwMg==ed1b127f739302da69c456a8ea594dfd");

const AgGrid = React.forwardRef<AgGridRef, AgGridProps>(({
    /* AgGrid 容器 class */
    wrapClass,
    /* AgGrid 容器 style */
    wrapStyle,

    /* 表格数据请求 */
    requestApi,
    /* 表格数据请求参数 */
    requestParams = null,

    /* 是否设置列适应水平方向的网格 */
    sizeColumnsToFit = true,
    children,
    onCellChoose,
    hidePagination = false,
    nativePagination = false,
    paginationSize = 'default',
    focusFirstRow = false,
    leftRightArrowPaging = false,
    agThemeClass = 'ag-theme-common',
    onTransformServerData,
    onRequestSuccess,
    modules,
    footer,
    pinnedBottomRowOptions,
    wrapProps,
    ...props
}, ref) => {
    /* Ag-Grid API */
    const agGridRef = useRef<AgGridReact>(null)
    const requestController = useRef<AbortController | null>(null)
    /**
     * current：当前页
     * total：总条数
     * size: 每页条数
     */
    const [pagination, setPagination] = useState<PaginationState>({
        current: 0, total: 0, size: 0
    })

    /**
     * 保存当前页数据
     */
    const [currentPageRows, setCurrentPageRows] = useState<Record<string, any>[]>([])

    let defaultModules = [
        ClipboardModule,
        MasterDetailModule,
        ServerSideRowModelModule,
        ClientSideRowModelModule,
        RangeSelectionModule
    ];
    if (modules && modules.length > 0) {
        defaultModules.push(...modules);
    }
    let serverSideProps: AgGridReactProps | null = null

    useImperativeHandle(ref, () => ({
        refresh: () => {
            // agGridRef.current?.api.setServerSideDatasource({ getRows })
            agGridRef.current?.api.refreshServerSideStore({})
        },
        focusFirstRow: () => {
            if (agGridRef.current) {
                const { api, columnApi } = agGridRef.current
                const pageSize = api.paginationGetPageSize()
                const current = api.paginationGetCurrentPage()
                onFocusFirstRow(pageSize * current, api, columnApi)
            }
        },
        ...agGridRef.current as Omit<AgGridRef, 'refresh' | 'focusFirstRow'>
    }), [])

    const pinnedBottomRowData = useMemo(() => {
        if (Array.isArray(pinnedBottomRowOptions)) {
            return [
                pinnedBottomRowOptions.reduce<Record<string, string>>((obj, { label, value }) => {
                    const count = currentPageRows.reduce((acc, cur) => {
                        if (typeof cur[value] === 'number') {
                            return Calculator.add(acc, cur[value])
                        }
                        return acc
                    }, 0)
                    obj[value] = `${label} ${count}`
                    return obj
                }, {})
            ]
        }
    }, [currentPageRows])

    /**
     * antd Pagination onChange事件
     * @param page 需要跳转的 页码
     */
    const onCustomPagination: (page: number, pageSize: number) => void = (page) => {
        agGridRef.current?.api?.paginationGoToPage(page - 1);
    }
    /**
     * antd Pagination onShowSizeChange事件
     * @param size 需要更改的 每页条数
     */
    const onCustomPageSize: (current: number, size: number) => void = (_, size) => {
        agGridRef.current?.api?.paginationSetPageSize(size)
    }

    /**
     * 第一次将数据呈现到网格中时触发
     * 用于设置列的大小调整，以适应水平方向的网格。
     * @param params
     */
    const onFirstDataRendered = (params: FirstDataRenderedEvent) => {
        const { api, columnApi, firstRow } = params
        if (serverSideProps?.rowModelType !== 'serverSide') {
            focusFirstRow && onFocusFirstRow(firstRow, api, columnApi)
            sizeColumnsToFit && api.sizeColumnsToFit()
        }
        if (props.onFirstDataRendered !== undefined) {
            props.onFirstDataRendered(params)
        }
    }

    /**
     * ag grid 分页状态改变时触发
     * 用于设置分页参数，以供antd Pagination 使用
     * @param params
     */
    const onPaginationChanged = (params: PaginationChangedEvent) => {
        const { api, columnApi, newPage } = params
        setPagination({
            current: api.paginationGetCurrentPage() + 1,
            total: api.paginationGetRowCount(),
            size: api.paginationGetPageSize()
        })
        setCurrentPageRows(getPageDisplayedRows(api))
        if (props.onPaginationChanged !== undefined) {
            props.onPaginationChanged(params)
        }
        // 选中第一行
        if (focusFirstRow && newPage) {
            const pageSize = api.paginationGetPageSize()
            const current = api.paginationGetCurrentPage()
            onFocusFirstRow(pageSize * current, api, columnApi)
        }
    }

    /**
     * 选中第一行
     */
    const onFocusFirstRow = (index: number, api: GridApi, columnApi: ColumnApi) => {
        const firstDisplayedNode = api.getDisplayedRowAtIndex(index)
        if (firstDisplayedNode) {
            firstDisplayedNode.setSelected(true)
            api.setFocusedCell(firstDisplayedNode.rowIndex as number, columnApi.getAllDisplayedColumns()[0])
        }
        // api.setFocusedCell(index, columnApi.getAllDisplayedColumns()[0])
        // api.getRowNode(index.toString())?.setSelected(true)
    }

    /**
     * 表格初始化事件，报错ag-grid api
     * @param params
     */
    const onGridReady = (params: GridReadyEvent) => {
        if (props.onGridReady !== undefined) {
            props.onGridReady(params)
        }
    }

    /**
     * 允许覆盖用户在单元格被聚焦时点击导航（箭头）键的默认行为。返回下一个要导航的单元格位置，或返回空值以保持在当前单元格。
     * @param params
     */

    const navigateToNextCell: (params: NavigateToNextCellParams) => CellPosition = params => {
        if (props.navigateToNextCell !== undefined) {
            return props.navigateToNextCell(params)
        }else {
            const { key, api, nextCellPosition, previousCellPosition } = params
            const KEY_UP = 38;
            const KEY_DOWN = 40;
            const KEY_LEFT = 37;
            const KEY_RIGHT = 39;

            if (key === KEY_DOWN || key === KEY_UP) {
                api.forEachNode(node => {
                    if (node.rowIndex === nextCellPosition?.rowIndex) {
                        if ((api as any).gridOptionsWrapper.rowSelection == "single") {
                            //当为单行选择时，取消其它行的选择
                            api.deselectAll();
                        }
                        node.setSelected(true);
                    }
                });
            }
            if (leftRightArrowPaging && (key === KEY_LEFT || key === KEY_RIGHT)) {
                const currentPage = api.paginationGetCurrentPage()
                switch (key) {
                    case KEY_LEFT: currentPage !== 0 && api.paginationGoToPreviousPage(); break
                    case KEY_RIGHT: currentPage !== api.paginationGetTotalPages() - 1 && api.paginationGoToNextPage(); break
                }
                return previousCellPosition
            }
            return nextCellPosition as CellPosition;
        }
    }

    /**
     * 单元格双击事件
     * @param event
     */
    const onCellDoubleClicked = (event: CellDoubleClickedEvent) => {
        onCellChoose && onCellChoose(event.data)
        if (props.onCellDoubleClicked !== undefined) {
            props.onCellDoubleClicked(event)
        }
    }

    /**
     * 单元格键盘事件
     * @param event
     */
    const onCellKeyDown = (event: CellKeyDownEvent) => {
        // @ts-ignore
        if (event.event.key === 'Enter') {
            onCellChoose && onCellChoose(event.data)
        }
        if (props.onCellKeyDown !== undefined) {
            props.onCellKeyDown(event)
        }
    }

    const getRows = useCallback(async (params: IServerSideGetRowsParams) => {
        if (!requestApi) return;
        const { request: { startRow, endRow }, success, api, columnApi } = params
        if (requestController.current !== null) {
            requestController.current.abort()
        }
        const controller = new AbortController();
        requestController.current = controller
        try {
            const params = {
                start: startRow, limit: (endRow as number) - (startRow as number),
                ...requestParams
            }
            const { success: issuc, result } = responseHandle(await requestApi(params, { signal: controller.signal }));
            if (issuc) {
                const rowData = getProperty(result, "list", [])
                success({
                    rowData: onTransformServerData ? onTransformServerData(rowData) : rowData,
                    rowCount: getProperty(result, "total", 0)
                });
                if (focusFirstRow) {
                    const pageSize = api.paginationGetPageSize()
                    const current = api.paginationGetCurrentPage()
                    onFocusFirstRow(pageSize * current, api, columnApi)
                }
                sizeColumnsToFit && api.sizeColumnsToFit()
                onRequestSuccess && onRequestSuccess({ result, params, api, columnApi })
                return;
            }
        } catch (ex: any) {
            if (ex?.statusCode !== ResponseCode.canceled) {
                message.error("查询失败！");
                console.error(ex);
            }
        }
        success({ rowCount: 0, rowData: [] });
    }, [requestParams])

    /**
     * 传入requestApi时，表格modules新增服务端模型
     * serverSideDatasource -> getRows：使用useCallback包裹，当requestParams更改时重新执行。
     */
    if (requestApi !== undefined) {
        serverSideProps = {
            rowModelType: 'serverSide',
            pagination: true,
            paginationPageSize: 10,
            cacheBlockSize: 50,
            suppressPaginationPanel: !nativePagination, // 隐藏表格分页控件
            serverSideStoreType: 'partial',
            serverSideDatasource: { getRows }
        }
    }

    const frameworkComponents = {
        ...props.frameworkComponents
    }

    return (
        <div
            className={classnames(
                wrapClass, styles.agGridWrap,
                // domLayout='autoHeight' 自动调整grid高度, 删除网格行容器的最小高度
                // https://ag-grid.com/react-data-grid/grid-size/
                // {[styles.removeMinimumHeight]: props.domLayout === 'autoHeight'}
            )}
            style={wrapStyle}
            {...wrapProps}
        >
            <div className={classnames(agThemeClass, "flex-column", styles.agGrid)}>
                <AgGridReact
                    ref={agGridRef}
                    rowSelection="single"
                    modules={defaultModules}
                    overlayNoRowsTemplate="无数据"
                    overlayLoadingTemplate="加载中"
                    suppressDragLeaveHidesColumns   //禁止拖动离开隐藏列
                    suppressCopyRowsToClipboard // 禁用复制行到剪贴板，只复制选择的单元格内容
                    columnDefs={columnDefsMemo}
                    stopEditingWhenCellsLoseFocus // 失去焦点后完成编辑
                    enableRangeSelection
                    processCellForClipboard={processCellForClipboard}
                    pinnedBottomRowData={pinnedBottomRowData}
                    {...serverSideProps} // 服务端模型需要新增的表格参数
                    {...props}
                    getRowStyle={params => {
                        let style: RowStyle = {}
                        if (props.getRowStyle) {
                            style = props.getRowStyle(params)
                        }
                        if (params.node.rowPinned) {
                            style.fontWeight = 'bold'
                        }
                        return style
                    }}
                    navigateToNextCell={navigateToNextCell}
                    onGridReady={onGridReady}
                    onPaginationChanged={onPaginationChanged}
                    onFirstDataRendered={onFirstDataRendered}
                    onCellDoubleClicked={onCellDoubleClicked}
                    onCellKeyDown={onCellKeyDown}
                    frameworkComponents={frameworkComponents}
                    defaultColDef={{
                        resizable: true,
                        ...props.defaultColDef
                    }}
                >
                    {children}
                </AgGridReact>
            </div>
        </div>
    )
})

export default AgGrid
