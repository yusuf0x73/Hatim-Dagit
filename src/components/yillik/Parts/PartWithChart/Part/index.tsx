






import React from 'react'
import styled from '@emotion/styled'

const PartContainer = styled.div`
  padding: 12px 6px;
`;

const PartTemplate = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

const PartNo = styled.span`
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--ink);
`;

const PartName = styled.span`
  max-width: 100%;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ink-soft);
  overflow-wrap: anywhere;
`;

const Part = ({data, no}:{data:{isTaken: boolean, name: string, charts?: any}, no:number}) => {
  return (
    <PartContainer>
      <PartTemplate>
          <PartNo>{no}</PartNo>
          {data.isTaken && <PartName>{data.name}</PartName>}
      </PartTemplate>
    </PartContainer>
  )
}

export default Part