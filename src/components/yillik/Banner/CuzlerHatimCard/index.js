




import React from 'react';
import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, Button } from '@mantine/core';
import { Book, Logout, Pencil } from 'tabler-icons-react';
import { useDispatch } from 'react-redux';
import { yesNoDialogAlertActions, yesNoDialogAlertFunctions } from "features/yesNoDialogAlert";
import { useHistory } from "react-router-dom";
import localDb from "@yusuf-yeniceri/easy-storage";
import Language from "strings";
import { extractKey } from 'common';
import { editModalCuzlerActions } from 'features/editCuzlerModal';
import { localDatabase } from 'backend';

// Hızlı hatim kartıyla aynı görünüm (koyu başlık + açık gövde)
const useStyles = createStyles(() => ({
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 688,
    overflow: 'hidden',
    borderRadius: 24,
    border: '1px solid var(--line)',
    background: 'var(--surface)',
    boxShadow: 'var(--shadow)',
  },
  head: {
    padding: '22px 20px 20px',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'var(--emerald-800)',
    backgroundImage: 'var(--pattern), linear-gradient(135deg, var(--emerald-600), var(--emerald-900))',
  },
  icon: {
    margin: '0 auto 10px',
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: 'var(--gold-200)',
  },
  title: {fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, overflowWrap: 'anywhere'},
  description: {marginTop: 8, color: 'rgba(255,255,255,0.85)', overflowWrap: 'anywhere'},
  adminRow: {display: 'flex', justifyContent: 'space-between', marginBottom: 12},
  body: {padding: '18px 20px 20px'},
  percent: {fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald-700)', lineHeight: 1},
}));

const badgeStyles = {inner: {textTransform: 'none', fontWeight: 800}};

const BadgeSpecifier = ({otherCaseDuaLeftDays, _duaLeftDays}) => {
  switch (otherCaseDuaLeftDays) {
    case 0:
      return <Badge size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}> {Language["/cuz"].CuzlerHatimCard.dua[0]} {_duaLeftDays} {Language["/cuz"].CuzlerHatimCard.dua[1]}</Badge>
    case 1:
      return <Badge size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}>{Language["/cuz"].CuzlerHatimCard.dua[2]}</Badge> 
    case 2:
      return <Badge size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}>{Language["/cuz"].CuzlerHatimCard.dua[3]}</Badge>
    default:
      return <Badge size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}>{Language["/cuz"].CuzlerHatimCard.dua[4]} {_duaLeftDays} {Language["/cuz"].CuzlerHatimCard.dua[5]}</Badge>
      break;
  }
}

export default function StatsCard({header, description, progress, leftCuzs, duaLeftDays,
                                  yesHandler, toggleYesHandler, noHandler, toggleNoHandler,
                                  hatimsData}) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  let otherCaseDuaLeftDays = 0; // 3 state, 0,1,2, 0 means be made
  let keeperDuaLeftDays = duaLeftDays;

  let arrLeftDays = duaLeftDays.replaceAll("/","-").split("-").reverse();
  duaLeftDays = new Date(arrLeftDays[0], parseInt(arrLeftDays[1])-1, arrLeftDays[2])
  let _currentDate = new Date();

  let _duaLeftDays;
  if(duaLeftDays > _currentDate){
    _duaLeftDays = Math.round((duaLeftDays-(_currentDate))/(1000*60*60*24)) + 1;
  }
  else if((Math.round((duaLeftDays-(_currentDate))/(1000*60*60*24)) + 1) <= -1){
       otherCaseDuaLeftDays = 1; // already made
  }else{
  otherCaseDuaLeftDays = 2; // today
  }


  const yesHandlerPayload = () => {

    dispatch(yesNoDialogAlertFunctions.deleteHatimV3())


    localDb.ref(`Hatim/`).modify((data) => {
      let hatimKey = extractKey();
      delete data[hatimKey];
      return data;
    });

    history.push("/")

  }

  const noHandlerPayload = () => dispatch(yesNoDialogAlertActions.toggleVisibility())



  let adminToken = localDb.ref(`Hatim/${extractKey()}/adminToken`).get()
  let tokenExists;
  if(Object.keys(adminToken).length == 0){
    tokenExists = 0;
  }
  else{
    tokenExists = adminToken;
  }

  const allParts = localDatabase.getParts(hatimsData);

  return (
    <Paper className={classes.card}>
      <div className={classes.head}>
        {tokenExists != 0 &&
          <div className={classes.adminRow}>
            <Button color="red" variant="white" leftIcon={<Logout size={16} />} radius="xl" size="xs" id="deleteHatim"
              onClick={()=>{
                dispatch(yesNoDialogAlertActions.changeText(Language["/cuz"].DeleteKhatmAlert.Question))
                toggleYesHandler(yesHandlerPayload)
                toggleNoHandler(noHandlerPayload)
                dispatch(yesNoDialogAlertActions.toggleVisibility())
              }}>
              {Language["/cuz"].CuzlerHatimCard.deleteHatim}
            </Button>
            <Button variant="white" leftIcon={<Pencil size={16} />} radius="xl" size="xs"
              onClick={()=>{
                dispatch(editModalCuzlerActions.changeHeader(header))
                dispatch(editModalCuzlerActions.changeDescription(description))
                dispatch(editModalCuzlerActions.changeDate(keeperDuaLeftDays))
                dispatch(editModalCuzlerActions.toggleVisibility())
              }}>
              {Language["/cuz"].CuzlerHatimCard.changeHatim}
            </Button>
          </div>}

        <ThemeIcon className={classes.icon} size={52} radius={52}>
          <Book size={28} />
        </ThemeIcon>
        <div className={classes.title}>
          {header.split('\n').map((str, i) => <p key={i}>{str}</p>)}
        </div>
        {description != null && description !== '' && <div className={classes.description}>
          {description.split('\n').map((str, i) => <p key={i}>{str}</p>)}
        </div>}
      </div>

      <div className={classes.body}>
        <Group position="apart" align="flex-end">
          <Text size="sm" weight={700} color="dimmed">{Language["/cuz"].CuzlerHatimCard.takenParts}</Text>
          <span className={classes.percent}>%{(Math.round(progress * 100) / 100).toFixed(0)}</span>
        </Group>

        <Progress value={progress} mt={10} size={12} radius="xl" color="emerald" />

        <Group position="apart" mt="md" spacing="xs">
          <Badge size="lg" radius="xl" color="emerald" variant="light" styles={badgeStyles}>{leftCuzs}  {Language["/cuz"].CuzlerHatimCard.leftParts}</Badge>
          <BadgeSpecifier otherCaseDuaLeftDays={otherCaseDuaLeftDays} _duaLeftDays={_duaLeftDays} />
        </Group>

        {allParts.data != undefined && allParts.data.length > 0 && <Text mt="lg" size="sm" weight={700} color="dimmed">
          {Language["/cuz"].CuzlerHatimCard.yourParts}
        </Text>}
        {allParts.data != undefined && allParts.data.sort((a,b) => Object.keys(a)[0] - Object.keys(b)[0]).map((part, index) => (
          <Group key={index} mt="xs" spacing={6}>
            <Badge size="lg" radius="xl" color="emerald" variant="filled" styles={badgeStyles}>{Number(Object.keys(part))+1}. Hatim</Badge>
            {part[Object.keys(part)[0]].map(no => <Badge key={no} size="lg" radius="xl" color="gold" variant="light" styles={badgeStyles}>{no}. cüz</Badge>)}
          </Group>
        ))}
      </div>
    </Paper>
  );
}
