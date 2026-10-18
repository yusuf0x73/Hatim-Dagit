






import React, { useRef, useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, Title, ActionIcon } from '@mantine/core';
import close from "../../../icons/close.svg";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  table:{
    backgroundColor: 'var(--surface)',
    position: 'relative',
  },

  scrollArea:{
    marginTop: '80px',
    height: '250px',
  },

  base:{
    position: 'fixed',
    zIndex: -10,
    height: '100%',
    width: '100%',
    backgroundColor: 'var(--cream)',
  },
}));


export default function TableSelection({ data, cizelgeRef, toggleCizelge, cizelgeId }) {
  const { classes, cx } = useStyles();
  
  const [selection, setSelection] = useState(['1']);
  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const baseRef = cizelgeRef;

  let counter = cizelgeId;
  let i = 0;
  for (; counter <= 30; i++) {
    const item = data[i];
    item.id = counter;
    item.email = `${counter}. cüz`
    counter++;
  }

  counter = 1;
  for(; counter < cizelgeId; i++){
    const item = data[i];
    item.id = counter;
    item.email = `${counter}. cüz`
    counter++;
  }
  
  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} style={{backgroundColor: 'white'}} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        <td >
            <Text size="xs" weight={500}>
              {item.name}
            </Text>
        </td>
        <td >{item.email}</td>
        <td >{item.job}</td>
      </tr>
    );
  });

  return (
    <div ref={baseRef} className={classes.base}>



    <div style={{display: 'flex', justifyContent: 'end', margin: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <ActionIcon onClick={()=>{
                toggleCizelge();
            }} >
                <img src={close}></img>
            </ActionIcon>
            <Text style={{fontFamily: 'inherit'}} size="xs">Kapat</Text>
        </div>
    </div>
    <Title align="center" m="xl" style={{fontFamily: 'inherit'}}>Ramazan Çizelgesi</Title>

    <ScrollArea  type="always" scrollbarSize={20} className={classes.scrollArea} mx="20px">
      <Table  className={classes.table}  verticalSpacing="xs">
        <thead style={{position: 'sticky'}}>
          <tr>
            <th style={{ width: 40 }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === data.length}
                indeterminate={selection.length > 0 && selection.length !== data.length}
                transitionDuration={0}
              />
            </th>
            <th>Gün</th>
            <th>Cüz</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
    </div>
  );
}
