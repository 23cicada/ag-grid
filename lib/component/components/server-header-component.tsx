import {IHeaderParams, SelectionChangedEvent} from "@ag-grid-community/core";
import { Checkbox, Space } from 'antd'
import { getPageDisplayedNodes } from "lib/utils.ts";
import {useEffect, useState} from "react";

const ServerHeaderComponent = ({ displayName, api }: IHeaderParams) => {
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)

    useEffect(() => {
        api.addEventListener('selectionChanged',onSelectionChanged)
        api.addEventListener('paginationChanged',onSelectionChanged)
        return () => {
            api.removeEventListener('selectionChanged',onSelectionChanged)
            api.removeEventListener('paginationChanged',onSelectionChanged)
        }
    }, [])

    const onSelectionChanged = ({ api }: SelectionChangedEvent) => {
        const nodes = getPageDisplayedNodes(api)
        if (nodes.length === 0) return;
        const every = nodes.every(item => item.selected)
        const some = nodes.some(item => item.selected)
        setChecked(every)
        setIndeterminate(every ? false : some)
    }
    const onChange = (checked: boolean) => {
        const nodes = getPageDisplayedNodes(api)
        nodes.forEach(node => node.setSelected(checked))
    }
    return (
        <Space align="baseline">
            <Checkbox
                indeterminate={indeterminate}
                checked={checked}
                onChange={e => onChange(e.target.checked)}
            />
            {displayName}
        </Space>
    )
}

export default ServerHeaderComponent