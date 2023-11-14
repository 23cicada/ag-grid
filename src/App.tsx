
import './App.css'
import AgGrid from './component'

function App() {
  const data = [
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
    { test2: 'xxx', test3: 'hhh' }, 
    { test2: 'XXXX', test3: 'HHHH' },
  ]
  return (
    <div>
      <AgGrid 
        rowData={data}
        columnDefs={[{ headerName: 'test2' }, { headerName: 'test3 '}]}
        style={{ height: 300 }}
        sizeColumnsToFit
        pagination
        paginationPageSize={6}
      />
    </div>
  )
}

export default App
