//                                     BİSMİLLAHİRRAHMANİRRAHİM

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
    font-size: 1.6rem;
    font-weight: 800;
`;

export const HeaderText = styled.p`
    max-width: 440px;
    margin: 6px auto 0;
    color: rgba(255,255,255,0.8);
`;

export const Content = styled.main`
    max-width: 640px;
    margin: -40px auto 0;
    padding: 0 16px;
`;

export const SectionLabel = styled.h2`
    margin: 20px 4px 10px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);

    &:first-child{
        margin-top: 0;
        padding: 10px 14px;
        border-radius: 12px;
        background: var(--surface);
        box-shadow: var(--shadow-sm);
        display: inline-block;
    }
`;

export const Tabs = styled.div`
    display: flex;
    gap: 6px;
    padding: 6px;
    margin: 16px 0 14px;
    border-radius: 16px;
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
`;

export const Tab = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    border: 0;
    border-radius: 12px;
    background: ${({active}) => (active ? 'var(--emerald-700)' : 'transparent')};
    color: ${({active}) => (active ? '#fff' : 'var(--ink-soft)')};
    font-size: 0.98rem;
    font-weight: 800;
    cursor: pointer;

    span{
        min-width: 24px;
        padding: 1px 7px;
        border-radius: 999px;
        font-size: 0.8rem;
        background: ${({active}) => (active ? 'rgba(255,255,255,0.2)' : 'var(--sand)')};
    }
`;

export const Card = styled.article`
    margin-bottom: 12px;
    padding: 16px;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow-sm);
`;

export const CardTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`;

export const TypeChip = styled.span`
    padding: 3px 10px;
    border-radius: 999px;
    background: var(--gold-100);
    color: var(--gold-600);
    font-size: 0.78rem;
    font-weight: 800;
`;

export const CardTitle = styled.h3`
    margin-top: 8px;
    font-size: 1.12rem;
    font-weight: 800;
    line-height: 1.35;
    overflow-wrap: anywhere;
`;

export const Chips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
`;

export const Chip = styled.span`
    padding: 5px 10px;
    border-radius: 10px;
    background: ${({muted}) => (muted ? 'var(--sand)' : 'var(--emerald-50)')};
    border: 1px solid ${({muted}) => (muted ? 'var(--line)' : 'var(--emerald-200)')};
    color: ${({muted}) => (muted ? 'var(--muted)' : 'var(--emerald-800)')};
    font-size: 0.88rem;
    font-weight: 800;
`;

export const CardActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
`;

export const CardButton = styled.button`
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 46px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1.5px solid ${({primary}) => (primary ? 'var(--emerald-700)' : 'var(--emerald-200)')};
    background: ${({primary}) => (primary ? 'var(--emerald-700)' : 'var(--surface)')};
    color: ${({primary}) => (primary ? '#fff' : 'var(--emerald-700)')};
    font-size: 0.95rem;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
`;

export const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 50%;
    background: var(--cream);
    color: var(--muted);
    cursor: pointer;
`;

export const Empty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 28px 20px;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1.5px dashed var(--line);
    color: var(--emerald-600);
    text-align: center;
`;

export const EmptyText = styled.p`
    color: var(--muted);
    max-width: 340px;
`;

export const Note = styled.p`
    margin-top: 18px;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
`;
