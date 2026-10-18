//                                  BİSMİLLAHİRRAHMANİRRAHİM
//                                      ALLAHU  EKBER
//                                      ELHAMDÜLİLLAH



import styled from 'styled-components';


export const Container = styled.div`
    background: var(--cream);
    min-height: 60vh;
    padding-bottom: calc(var(--tabbar-h) + var(--safe-bottom) + 24px);
`;

export const Header = styled.header`
    background-color: var(--emerald-900);
    background-image: var(--pattern);
    color: #fff;
    text-align: center;
    padding: 28px 20px 64px;
`;

export const HeaderTitle = styled.h1`
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1.3;
    max-width: 520px;
    margin: 0 auto;
`;

export const Content = styled.main`
    max-width: 640px;
    margin: -40px auto 0;
    padding: 0 16px;
`;

export const SectionLabel = styled.h2`
    margin: 28px 4px 12px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 72px;
    padding: 12px 16px;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    text-align: start;
    cursor: pointer;

    &:last-child{
        border-bottom: 0;
    }
`;

export const RowLink = styled.a`
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    color: inherit;
    text-decoration: none;
`;

export const RowIcon = styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--emerald-50);
    color: var(--emerald-700);
`;

export const RowTitle = styled.span`
    flex: 1;
    min-width: 0;
    font-size: 1.05rem;
    font-weight: 700;
    overflow-wrap: anywhere;
`;

export const RowArrow = styled.span`
    display: flex;
    color: var(--gold-500);
`;

export const RemoveButton = styled.button`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: var(--danger-soft);
    color: var(--danger);
    cursor: pointer;
`;
