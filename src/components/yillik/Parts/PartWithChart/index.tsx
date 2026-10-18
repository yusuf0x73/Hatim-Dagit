







import React from 'react'
import styled from '@emotion/styled'
import Part from './Part'
import { ResponseItem } from './styles'
import { cuzModalActions } from 'features/cuzModal'
import { useDispatch } from 'react-redux'
import { localDatabase } from 'backend'
import { yillikTableActions } from 'features/yillikTable'

const PWCContainer = styled.div``

const PWCTemplate = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`

// Kutunun altındaki "Çizelgeyi görüntüle" şeridi
const ChartTemplate = styled.div<{bgColor: boolean}>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 4px;
    border-radius: 0 0 var(--radius) var(--radius);
    border: 1.5px ${({bgColor}) => (bgColor ? 'solid var(--emerald-700)' : 'dashed #c9bfa9')};
    border-top: 0;
    background: ${({bgColor}) => (bgColor ? 'var(--emerald-700)' : 'var(--gold-100)')};
    color: ${({bgColor}) => (bgColor ? '#fff' : 'var(--gold-600)')};
    font-size: 0.78rem;
    font-weight: 800;
    text-align: center;
    cursor: pointer;
`

const PartWithChart = ({data, no, subKey}:{data:{isTaken: boolean, name: string, charts?: any}, no:number, subKey: string}) => {
  
  const dispatch = useDispatch()
  
  return (
    <PWCTemplate>
      <ResponseItem  bgColor={data.isTaken} onClick={()=>{

        if(data.isTaken == true && localDatabase.partExists(no, subKey).data == false){
          return;
        }

        if(data.isTaken == false){
          dispatch(cuzModalActions.changeTakingPart(true));
          dispatch(cuzModalActions.changeSubKey(subKey))
          dispatch(cuzModalActions.changeName(data.name))
          dispatch(cuzModalActions.changeCuzNo(no))
          dispatch(cuzModalActions.toggleVisibility())
        }else{
          dispatch(cuzModalActions.changeTakingPart(false));
          dispatch(cuzModalActions.changeSubKey(subKey))
          dispatch(cuzModalActions.changeName(data.name))
          dispatch(cuzModalActions.changeCuzNo(no))
          dispatch(cuzModalActions.toggleVisibility())
        }
      }}>
            <Part data={data} no={no}/>
      </ResponseItem >

      <ChartTemplate bgColor={data.isTaken} onClick={()=>{
        dispatch(yillikTableActions.changePartNo(no))
        dispatch(yillikTableActions.changeSubKey(subKey))
        dispatch(yillikTableActions.changeVisibility(true));
      }}>Çizelgeyi Görüntüle</ChartTemplate>

    </PWCTemplate>
  )
}

export default PartWithChart