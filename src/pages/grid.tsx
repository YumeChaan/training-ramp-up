import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn, GridCellProps, GridItemChangeEvent, GridToolbar} from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { MyCommandCell } from '../myCommandCell';
import { DropDownCell } from '../myDropDownCell';
import { insertItem, getItems, updateItem, deleteItem } from '../services';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import data from './data.json';
import { Product } from '../interfaces';
const editField = 'inEdit';



export default function Grids () {
  const [data, setData] = React.useState<any>([]);

  React.useEffect(()=>{
    const newItems = getItems();
    setData(newItems);
},[])

      // modify the data in the store, db etc
const remove = (dataItem: Product) => {
    const newData = [...deleteItem(dataItem)];
    setData(newData);
};

const add = (dataItem: Product) => {
  
    dataItem.inEdit = true;
    console.log('adding');
    const newData = insertItem(dataItem);
    
    setData(newData);
};

const update = (dataItem: Product) => {
    console.log('error');
    dataItem.inEdit = false;
    const newData = updateItem(dataItem);
    setData(newData);
};

// Local state operations
const discard = () => {
    const newData = [...data];
    newData.splice(0, 1)
    setData(newData);
};

const cancel = (dataItem: any) => {
    const originalItem = getItems().find(
        p => p.ID === dataItem.ID
    );
    const newData = data.map((item: { ID: number; }) =>
        item.ID === originalItem!.ID ? originalItem : item
    );

    setData(newData);
};

const enterEdit = (dataItem: Product) => {
  console.log('enter edit');
    setData(
        data.map((item: { ID: number; }) =>
            item.ID === dataItem.ID ? { ...item, inEdit: true } : item
        )
    );
};

const itemChange = (event: GridItemChangeEvent) => {
    const newData = data.map((item: { ID: any; }) =>
        item.ID === event.dataItem.ID
            ? { ...item, [event.field || '']: event.value }
            : item
    );

    setData(newData);
};

const addNew = () => {
    const newDataItem = { inEdit: true, Discontinued: false };
    setData([newDataItem, ...data]);
};

const CommandCell = (props: GridCellProps) => (
  <MyCommandCell
    {...props}
    edit={enterEdit}
    remove={remove}
    add={add}
    discard={discard}
    update={update}
    cancel={cancel}
    editField={editField}
      />
  );

    return (
      <div>
      <Grid
        style={{ height: '400px', marginTop: '20px' }}
        data={data}
        onItemChange={itemChange}
        editField={editField}
        dataItemKey={'ID'}
        >
        <GridToolbar>
          <button
            title="Add new"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={addNew}
                >
            Add new
          </button>
        </GridToolbar>
        <GridColumn field="ID" title="ID" width="40px" editable={false} />
        <GridColumn field="Name" title="Name" width="250px" />
        <GridColumn field="Gender" title="Gender" cell={DropDownCell}/>
        <GridColumn field="Address" title="Address" />
        <GridColumn field="MobileNo" title="Mobile No"/>
        <GridColumn field="DateofBirth" title="Date of Birth" editor="date" format="{0:D}"/>
        <GridColumn field="Age" title="Age" editable = {false}/>
        <GridColumn title= "command " cell = {CommandCell}  width="200px" />
      </Grid>
      <ToastContainer/>
      </div>
      
    );
}

