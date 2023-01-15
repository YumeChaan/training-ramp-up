import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn, GridItemChangeEvent, GridRowClickEvent, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';

import {addedData} from './data';
import { Person } from './person';

const CommandCell = () => {
  return(
    <td className="k-command-cell">
    <Button themeColor={'error'}>Edit</Button>
    <Button>Remove</Button>
    </td>
  )
}

export default function Grids () {

  const [data, setData] = React.useState<Array<Person>>(addedData);
  const [editID, setEditID] = React.useState<number | null>(null);


  const rowClick = (event: GridRowClickEvent) => {
      setEditID(event.dataItem.ID);
  };

  const itemChange = (event: GridItemChangeEvent) => {
      const inEditID = event.dataItem.ID;
      console.log('event.Field', event.field);
      const field = event.field || ''
      const newData = data.map(item =>
          item.ID === inEditID ? { ...item, [field]: event.value } : item
      );
      setData(newData);
  };

  const closeEdit = (event: { target: any; currentTarget: any; }) => {
      if (event.target === event.currentTarget) {
          setEditID(null);
      }
  };

  const addRecord = () => {
      const newRecord = { ID: data.length}
      setData([newRecord,...data]);
      setEditID(newRecord.ID);
  };

    return (
      <div>
      <Grid
        style={{ height: '400px', marginTop: '20px' }}
        data={data.map((prsn: Person) =>
          ({ ...prsn, inEdit: prsn.ID === editID })
        )}
        editField="inEdit"

        onRowClick={rowClick}
        onItemChange={itemChange}
        >
        <GridToolbar>
        <div onClick={closeEdit}>
          <button title="Add new" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onClick={addRecord} >
            Add new
          </button>
        </div>
      </GridToolbar>
        <GridColumn field="ID" title="ID" width="40px" />
        <GridColumn field="Name" title="Name" width="250px" />
        <GridColumn field="Gender" title="Gender" />
        <GridColumn field="Address" title="Address" />
        <GridColumn field="MobileNo" title="Mobile No"/>
        <GridColumn field="DateofBirth" title="Date of Birth"  editor="date" format="{0:D}"/>
        <GridColumn field="Age" title="Age" />
        {/* <GridColumn title= "command " cell = {CommandCell}  width="200px" /> */}
      </Grid>
      </div>
    );
}

