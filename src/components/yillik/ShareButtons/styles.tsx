import styled from "@emotion/styled"

// Paylaş / kopyala: ekranın altında sabit iki buton (diğer hatim sayfalarıyla aynı)
const actionButton = `
    position: fixed;
    z-index: 30;
    bottom: calc(12px + var(--safe-bottom));
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 52px;
    border-radius: 14px;
    font-weight: 800;
    cursor: pointer;
    user-select: none;
    box-shadow: var(--shadow);
`

export const CopyContainer = styled.div`
    ${actionButton}
    left: calc(50% + 5px);
    right: 16px;
    background: var(--surface);
    color: var(--emerald-700);
    border: 1.5px solid var(--emerald-600);

    @media screen and (min-width: 960px){
        left: 50%;
        right: auto;
        width: 300px;
        transform: translateX(-50%);
        border-radius: 999px;
    }
`

export const CopyItem = styled.p`
    font-size: 1rem;
`

export const CopyIcon = styled.img<{iconSize:string}>`
    width: 22px;
    height: 22px;
`

export const ShareContainer = styled.div`
    ${actionButton}
    left: 16px;
    right: calc(50% + 5px);
    background: var(--emerald-700);
    color: #fff;

    img{
        filter: brightness(0) invert(1);
    }

    @media screen and (min-width: 960px){
        display: none;
    }
`

export const ShareItem = styled.p`
    font-size: 1rem;
`

export const ShareIcon = styled.img<{iconSize: string}>`
    width: 22px;
    height: 22px;
`
