import { Empty } from 'antd'

const CustomNoRowsOverlay = (props: any) => {
    return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.noRowsMessageFunc()} />
    )
}

export default CustomNoRowsOverlay
