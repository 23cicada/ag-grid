
import './App.css'
import { AgGrid } from 'lib/index.ts'
import {useState} from "react";
import {Button} from "antd";

interface Result {
  status: number,
  code: number,
  result: any
}

interface DataTest {
  name: string
  age: number
  sex: number
  school?: string
  id: string
}
function App() {
  const [count, setCount] = useState({ d: 0 })

  const request: () => Promise<Result> = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          status: 200, code: 0, result: { list: [{
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }, {
              name: 'xxx',
              age: 22,
              sex: 1,
              school: '11111'
            }], total: 18 }
        })
      }, 500)
    })
  }
  return (
    <div>
      <Button onClick={() => setCount({ d: count.d + 1})}>{count.d}</Button>
      <AgGrid<DataTest>
        style={{ height: 400 }}
        serverApi={request}
        serverParams={count}
        columnDefs={[{ headerName: 'name', field: 'name' }, { headerName: 'age', field: 'age' }]}
        sizeColumnsToFit
        pagination
        paginationPageSize={6}
        serverHeaderCheckboxSelectionCurrentPageOnly
      />
    </div>
  )
}

export default App
