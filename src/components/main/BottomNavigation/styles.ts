import styled from 'styled-components'


export const Container = styled.nav`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    background: #fff;
    border-top: 1px solid var(--line);
    padding-bottom: var(--safe-bottom);
`;

export const Template = styled.div`
    display: flex;
    max-width: 520px;
    height: var(--tabbar-h);
    margin: 0 auto;
    padding: 0 12px;
`;

const tab = `
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
`

export const HatimsContainer = styled.div`
    ${tab}
`

export const HatimsTemplate = styled.div`
    display: flex;
    justify-content: center;
`;

// "active" prop'u eski yapıdan geliyor: true olduğunda sekme pasiftir
const wrapper = ({active}: {active: boolean}) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 120px;
    padding: 6px 16px;
    border-radius: 16px;
    color: ${active ? 'var(--muted)' : 'var(--emerald-700)'};
    background: ${active ? 'transparent' : 'var(--emerald-50)'};
    font-weight: ${active ? 600 : 800};
    transition: background 0.2s ease, color 0.2s ease;

    svg{
        stroke: currentColor;
    }
`

export const HatimsWrapper = styled.div<{active: boolean}>`
    ${wrapper}
`;

export const HatimsIcon = styled.div`
    display: flex;
    justify-content: center;
`

export const HatimsText = styled.span`
    font-size: 0.85rem;
`

export const Seperator = styled.div`
    width: 0;
`

export const MyInfosContainer = styled.div`
    ${tab}
`

export const MyInfosTemplate = styled.div`
    display: flex;
    justify-content: center;
`;

export const MyInfosWrapper = styled.div<{active: boolean}>`
    ${wrapper}
`;

export const MyInfosIcon = styled.div`
    display: flex;
    justify-content: center;
`

export const MyInfosText = styled.span`
    font-size: 0.85rem;
`
