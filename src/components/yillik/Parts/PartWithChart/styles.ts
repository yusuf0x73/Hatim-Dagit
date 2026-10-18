import styled from "@emotion/styled"

// Cüz kutusu: boşsa kesik çizgili beyaz, alınmışsa açık yeşil
export const ResponseItem = styled.div<{bgColor:boolean}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 84px;
    text-align: center;
    cursor: pointer;
    border-radius: var(--radius) var(--radius) 0 0;
    border: 1.5px ${({bgColor}) => (bgColor ? 'solid var(--emerald-200)' : 'dashed #c9bfa9')};
    border-bottom: 0;
    background: ${({bgColor}) => (bgColor ? 'var(--emerald-50)' : 'var(--surface)')};
    transition: transform 0.1s ease;

    &:active{
        transform: scale(0.97);
    }
`

export const ResponseLogo = styled.img<{exist:boolean, isSrc:boolean}>`
    display: none;
`

export const ResponseText = styled.div`
    overflow-wrap: anywhere;
`
