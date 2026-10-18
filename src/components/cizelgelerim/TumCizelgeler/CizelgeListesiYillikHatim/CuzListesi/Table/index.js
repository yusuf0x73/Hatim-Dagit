






import React, { useRef, useState, useEffect } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, Title, ActionIcon, Button, Container } from '@mantine/core';
import close from "../../../../../../icons/close.svg";
import { extractKey, getMonths3Date } from 'common';
import { chartsProcessor } from 'localStorage/charts';
import cizelgeData from '../../../../../../strings/dataCizelge';
import { partsProcessor } from 'localStorage/parts';
import { showNotification } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  table:{
    backgroundColor: '#FFBF17',
  },

  scrollArea:{
    height: '250px',
  },

  base:{
    position: 'fixed',
    overflowY: 'scroll',
    zIndex: -10,
    height: '90%',
    width: '100%',
    backgroundColor: '#91ffbb',
  },
}));


export default function UcAylarHerGun1CuzTable({ cizelgeRef, toggleCizelge, cizelgeId, keyHolder}) {
  const { classes, cx } = useStyles();
  
  const [selection, setSelection] = useState([]);
  const [selectionSaban, setSelectionSaban] = useState([]);
  const [selectionRamazan, setSelectionRamazan] = useState([]);

  const [data, setData] = useState(JSON.parse(JSON.stringify(cizelgeData)))
  const [sabanData, setSabanData] = useState(JSON.parse(JSON.stringify(cizelgeData)))
  const [ramazanData, setRamazanData] = useState(JSON.parse(JSON.stringify(cizelgeData)))

  const [initialRunCompleted, setInitialRunCompleted] = useState(false);

  const [sabanDays, setSabanDays] = useState(30);
  const [ramazanDays, setRamazanDays] = useState(30);

  const toggleRow = (id, data, setData, selection, setSelection, type) => {


    if(!partsProcessor.partExists({key: keyHolder.key, subKey: keyHolder.subKey, partId: cizelgeId})){
      showNotification({
        title: 'Uyarı',
        message: 'Lütfen bu Cüzü alın, aldıktan sonra işaretlemeye başlayabilirsiniz!',
        color: 'red',
        id: 'scroll-down'
      })
      return;
    }

    let tempData = [...data];
    let index = tempData.findIndex(item => item.id == id)
    tempData[index].completed = selection.includes(id) ? false : true;
    setData(tempData);
    switch (type) {
      case 'recep':
        chartsProcessor.setRecep(tempData);
        break;
      case 'saban':
        chartsProcessor.setSaban(tempData);
        break;
      case 'ramazan':
        chartsProcessor.setRamazan(tempData);
        break;
    }
    chartsProcessor.processDatas({key: keyHolder.key, subKey: keyHolder.subKey, partId: cizelgeId})

    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    
  }
  const toggleAll = (data, setData, selection, setSelection, type) => {
    
    if(!partsProcessor.partExists({key: keyHolder.key, subKey: keyHolder.subKey, partId: cizelgeId})){
      showNotification({
        title: 'Uyarı',
        message: 'Lütfen bu Cüzü alın, aldıktan sonra işaretlemeye başlayabilirsiniz!',
        color: 'red',
        id: 'scroll-down'
      })
      return;
    }

    let tempData = [...data];
    if(selection.length == data.length){
      tempData.forEach(item => {
        item.completed = false;
      });
    }else{
      tempData.forEach(item => {
        item.completed = true;
      });
    }
    switch (type) {
      case 'recep':
        chartsProcessor.setRecep(tempData);
        break;
      case 'saban':
        chartsProcessor.setSaban(tempData);
        break;
      case 'ramazan':
        chartsProcessor.setRamazan(tempData);
        break;
    }
    chartsProcessor.processDatas({key: keyHolder.key, subKey: keyHolder.subKey, partId: cizelgeId})

    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));
    setData(tempData);

    return tempData;
  }
  
  const baseRef = cizelgeRef;


  const initialRun = () => {


    let dateData = getMonths3Date();
    
    let fillString = ''
    if( dateData.chosen != undefined){
        fillString = dateData.chosen;
    }
    let recepDate = undefined;
    let sabanDate = undefined;
    let ramazanDate = undefined;
  
    let startingDate = new Date(dateData[`startingDate${fillString}`]);
    
    let recepDays = dateData[`monthDays${fillString}`][0];
    let sabanDays = dateData[`monthDays${fillString}`][1];
    let ramazanDays = dateData[`monthDays${fillString}`][2];

    setSabanDays(sabanDays);
    setRamazanDays(ramazanDays);

    if( recepDays < 30 ){
      startingDate.setDate(startingDate.getDate()-(30-recepDays));
      recepDate = new Date(startingDate.getTime());
    }else{
      recepDate = new Date(startingDate.getTime())
    }
  
    startingDate = new Date(dateData[`startingDate${fillString}`]);
    startingDate.setDate(startingDate.getDate() + recepDays);
    sabanDate = new Date(startingDate.getTime());
  
    startingDate = new Date(dateData[`startingDate${fillString}`]);
    startingDate.setDate(startingDate.getDate() + recepDays + sabanDays);
    ramazanDate = new Date(startingDate.getTime());
  
    
  
    let counter = cizelgeId;
    let i = 0;
    let tempData = JSON.parse(JSON.stringify(cizelgeData));
    let tempSabanData = JSON.parse(JSON.stringify(cizelgeData));
    let tempRamazanData = JSON.parse(JSON.stringify(cizelgeData));
  
    for (; counter <= 30; i++) {
      const item = tempData[i];
      item.part = `${counter}`
      item.date = `${recepDate.toLocaleDateString()}`
      recepDate.setDate(recepDate.getDate()+1)
  
      const itemSaban = tempSabanData[i];
      itemSaban.part = `${counter}`
      itemSaban.date = `${sabanDate.toLocaleDateString()}`
      sabanDate.setDate(sabanDate.getDate()+1)
  
      const itemRamazan = tempRamazanData[i];
      itemRamazan.part = `${counter}`
      itemRamazan.date = `${ramazanDate.toLocaleDateString()}`
      ramazanDate.setDate(ramazanDate.getDate()+1)

      counter++;
    }
  
  
    counter = 1;
    for(; counter < cizelgeId; i++){
      const item = tempData[i];
      item.part = `${counter}`
      item.date = `${recepDate.toLocaleDateString()}`
      recepDate.setDate(recepDate.getDate()+1)
  
      const itemSaban = tempSabanData[i];
      itemSaban.part = `${counter}`
        itemSaban.date = `${sabanDate.toLocaleDateString()}`
        sabanDate.setDate(sabanDate.getDate()+1)
  
      const itemRamazan = tempRamazanData[i];
        itemRamazan.part = `${counter}`
        itemRamazan.date = `${ramazanDate.toLocaleDateString()}`
        ramazanDate.setDate(ramazanDate.getDate()+1)
  
      counter++;
    }

  
    setData(tempData);
    setSabanData(tempSabanData);
    setRamazanData(tempRamazanData);

    return {tempData, tempSabanData, tempRamazanData}
  }

  useEffect(() => {

    if(cizelgeId == 0 && cizelgeId == ''){
      return;
    }

    const {tempData, tempSabanData, tempRamazanData} = initialRun();

    const allDatas = chartsProcessor.getDatas({key: keyHolder.key, subKey: keyHolder.subKey, partId: cizelgeId})
    
    if(allDatas != undefined){
      setData(allDatas[0] ?? data);
      setSabanData(allDatas[1] ?? sabanData);
      setRamazanData(allDatas[2] ?? ramazanData);

      setSelection((allDatas[0] ?? data).filter(item => item.completed).map(item => item.id))
      setSelectionSaban((allDatas[1] ?? sabanData).filter(item => item.completed).map(item=>item.id))
      setSelectionRamazan((allDatas[2] ?? ramazanData).filter(item => item.completed).map(item=>item.id))

      //this is initial setting of datas
      chartsProcessor.setDatas([allDatas[0] ?? data, allDatas[1] ?? sabanData, allDatas[2] ?? ramazanData])
    }else{

      setSelection([])
      setSelectionSaban([])
      setSelectionRamazan([])

      //this is initial setting of datas
      chartsProcessor.setDatas([tempData, tempSabanData, tempRamazanData])
    }

  }, [cizelgeId])
  
  
  const recepRows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} style={{backgroundColor: 'white'}} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id, data, setData, selection, setSelection, 'recep')}
            transitionDuration={0}
          />
        </td>
        <td >
            <Text size="xs" weight={500}>
              {item.name}
            </Text>
        </td>
        <td >{item.part + ". cüz"}</td>
        <td >{item.date}</td>
      </tr>
    );
  });

  const sabanRows = sabanData.map((item, index) => {
    const selected = selectionSaban.includes(item.id);

    if(( sabanDays < 30) && (index == 29))
      return;

    return (
      <tr key={item.id} style={{backgroundColor: 'white'}} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selectionSaban.includes(item.id)}
            onChange={() => toggleRow(item.id, sabanData, setSabanData, selectionSaban, setSelectionSaban, 'saban')}
            transitionDuration={0}
          />
        </td>
        <td >
            <Text size="xs" weight={500}>
              {item.name}
            </Text>
        </td>
        <td >{((sabanDays < 30) && (index == 28)) ? `${item.part}-${Number(item.part)+1}. cüz` : item.part + ". cüz"}</td>
        <td >{item.date}</td>
      </tr>
    );
  });
  // if(sabanDays < 30){
  //   tempSabanData = tempSabanData.slice(0, sabanDays);
  //   let lastDay = tempSabanData[tempSabanData.length-1];
  //   lastDay.part = `${lastDay.part}-${lastDay.part+1}. cüz`;
  // }

  // if(ramazanDays < 30){
  //   tempRamazanData = tempRamazanData.slice(0, ramazanDays);
  //   let lastDay = tempRamazanData[tempRamazanData.length-1];
  //   lastDay.part = `${lastDay.part}-${lastDay.id+1}. cüz`;
  // }

  const ramazanRows = ramazanData.map((item, index) => {
    const selected = selectionRamazan.includes(item.id);
    
    if((ramazanDays < 30) && (index == 29))
      return;
    
    return (
      <tr key={item.id} style={{backgroundColor: 'white'}} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selectionRamazan.includes(item.id)}
            onChange={() => toggleRow(item.id, ramazanData, setRamazanData, selectionRamazan, setSelectionRamazan, 'ramazan')}
            transitionDuration={0}
          />
        </td>
        <td >
            <Text size="xs" weight={500}>
              {item.name}
            </Text>
        </td>
        <td >{((ramazanDays < 30) && (index == 28)) ? `${item.part}-${Number(item.part)+1}. cüz` : item.part + ". cüz"}</td>
        <td >{item.date}</td>
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
    <Title align="center" m="xl" style={{fontFamily: 'inherit'}}>Recep Ayı Çizelgesi</Title>

    <ScrollArea  type="always" scrollbarSize={20} className={classes.scrollArea} mx="20px">
      <Table  className={classes.table}  verticalSpacing="xs">
        <thead >
          <tr>
            <th style={{ width: 40 }}>
              <Checkbox
                onChange={() => toggleAll(data, setData, selection, setSelection, 'recep')}
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
        <tbody>{recepRows}</tbody>
      </Table>
    </ScrollArea>

    <Title align="center" m="xl" style={{fontFamily: 'inherit'}}>Şaban Ayı Çizelgesi</Title>

    <ScrollArea  type="always" scrollbarSize={20} className={classes.scrollArea} mx="20px">
      <Table  className={classes.table}  verticalSpacing="xs">
        <thead >
          <tr>
            <th style={{ width: 40 }}>
              <Checkbox
                onChange={() => toggleAll(sabanData, setSabanData, selectionSaban, setSelectionSaban, 'saban')}
                checked={selectionSaban.length === sabanData.length}
                indeterminate={selectionSaban.length > 0 && selectionSaban.length !== sabanData.length}
                transitionDuration={0}
              />
            </th>
            <th>Gün</th>
            <th>Cüz</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>{sabanRows}</tbody>
      </Table>
    </ScrollArea>

    <Title align="center" m="xl" style={{fontFamily: 'inherit'}}>Ramazan Ayı Çizelgesi</Title>

    <ScrollArea  type="always" scrollbarSize={20} className={classes.scrollArea} mx="20px">
      <Table  className={classes.table}  verticalSpacing="xs">
        <thead >
          <tr>
            <th style={{ width: 40 }}>
              <Checkbox
                onChange={() => toggleAll(ramazanData, setRamazanData, selectionRamazan, setSelectionRamazan, 'ramazan')}
                checked={selectionRamazan.length === ramazanData.length}
                indeterminate={selectionRamazan.length > 0 && selectionRamazan.length !== ramazanData.length}
                transitionDuration={0}
              />
            </th>
            <th>Gün</th>
            <th>Cüz</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>{ramazanRows}</tbody>
      </Table>
    </ScrollArea>

    </div>
  );
}
