//                                     BİSMİLLAHİRRAHMANİRRAHİM

import styled from 'styled-components';
import {sheet, field, primaryButton} from 'theme';

export const Page = styled.div`
    background: var(--cream);
    min-height: 70vh;
    padding-bottom: calc(96px + var(--safe-bottom));
`;

export const Wrap = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 16px;
`;

/* ---------- Başlık kartı ---------- */

export const HeroCard = styled.section`
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
`;

export const HeroHead = styled.div`
    padding: 22px 20px 20px;
    text-align: center;
    color: #fff;
    background-color: var(--emerald-800);
    background-image: var(--pattern), linear-gradient(135deg, var(--emerald-600), var(--emerald-900));
`;

export const PlanChip = styled.span`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.14);
    color: var(--gold-200);
    font-size: 0.82rem;
    font-weight: 800;
    margin-bottom: 10px;
`;

export const HeroTitle = styled.h1`
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.3;
    overflow-wrap: anywhere;
`;

export const HeroText = styled.p`
    margin-top: 8px;
    color: rgba(255,255,255,0.85);
    overflow-wrap: anywhere;
`;

export const HeroBody = styled.div`
    padding: 16px 20px 20px;
`;

export const StatRow = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
`;

export const StatLabel = styled.span`
    color: var(--muted);
    font-weight: 700;
    font-size: 0.92rem;
`;

export const StatValue = styled.span`
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--emerald-700);
    line-height: 1;
`;

export const Bar = styled.div`
    height: 12px;
    margin-top: 10px;
    border-radius: 999px;
    background: var(--sand);
    overflow: hidden;

    span{
        display: block;
        height: 100%;
        border-radius: 999px;
        background: var(--emerald-600);
        transition: width 0.4s ease;
    }
`;

export const Badges = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
`;

export const Badge = styled.span`
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 800;
    background: ${({gold}) => (gold ? 'var(--gold-100)' : 'var(--emerald-50)')};
    color: ${({gold}) => (gold ? 'var(--gold-600)' : 'var(--emerald-700)')};
`;

/* ---------- Bugün okuyacaklarım ---------- */

export const SectionTitle = styled.h2`
    margin: 24px 4px 10px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
`;

export const TodayCard = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    margin-bottom: 10px;
    border-radius: var(--radius);
    background: var(--surface);
    border: 2px solid ${({done}) => (done ? 'var(--emerald-500)' : 'var(--gold-500)')};
    box-shadow: var(--shadow-sm);
`;

export const TodayBody = styled.div`
    flex: 1;
    min-width: 0;
`;

export const TodayKicker = styled.div`
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--gold-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const TodayTitle = styled.div`
    font-size: 1.08rem;
    font-weight: 800;
`;

export const TodaySub = styled.div`
    color: var(--muted);
    font-size: 0.92rem;
`;

export const SmallButton = styled.button`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1.5px solid ${({filled}) => (filled ? 'var(--emerald-700)' : 'var(--emerald-200)')};
    background: ${({filled}) => (filled ? 'var(--emerald-700)' : 'var(--surface)')};
    color: ${({filled}) => (filled ? '#fff' : 'var(--emerald-700)')};
    font-size: 0.92rem;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
`;

/* ---------- Araç çubuğu ---------- */

export const Toolbar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
`;

export const SearchInput = styled.input`
    ${field};
`;

export const FilterRow = styled.div`
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
`;

export const FilterChip = styled.button`
    flex-shrink: 0;
    min-height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid ${({active}) => (active ? 'var(--emerald-700)' : 'var(--line)')};
    background: ${({active}) => (active ? 'var(--emerald-700)' : 'var(--surface)')};
    color: ${({active}) => (active ? '#fff' : 'var(--ink-soft)')};
    font-weight: 800;
    font-size: 0.92rem;
    cursor: pointer;
`;

export const LuckyButton = styled.button`
    ${primaryButton};
    background: var(--gold-500);
    color: var(--emerald-900);
    box-shadow: 0 6px 16px rgba(200, 160, 71, 0.35);

    &:hover{
        background: var(--gold-200);
        color: var(--emerald-900);
    }
`;

/* ---------- Cüze göre gruplu satırlar ---------- */

export const GroupList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 14px;
`;

export const Group = styled.div`
    border-radius: var(--radius);
    background: var(--surface);
    border: 1px solid ${({mine}) => (mine ? 'var(--gold-500)' : 'var(--line)')};
    box-shadow: var(--shadow-sm);
    overflow: hidden;
`;

export const GroupHead = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 64px;
    padding: 10px 14px;
    border: 0;
    background: transparent;
    color: var(--ink);
    text-align: start;
    cursor: ${({static: isStatic}) => (isStatic ? 'default' : 'pointer')};
`;

export const GroupNo = styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--emerald-50);
    color: var(--emerald-700);
    font-weight: 800;
`;

export const GroupInfo = styled.span`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const GroupTitle = styled.span`
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-weight: 800;

    small{
        font-weight: 700;
        color: var(--muted);
        font-size: 0.85rem;
        white-space: nowrap;
    }
`;

// Cüzdeki her sayfa için ince bir hücre: dolu/boş tek bakışta görünür
export const MiniBar = styled.span`
    display: flex;
    gap: 2px;

    i{
        flex: 1;
        height: 8px;
        border-radius: 2px;
        background: var(--sand);
    }

    i.taken{ background: var(--emerald-500); }
    i.mine{ background: var(--gold-500); }
`;

export const TileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${({cols}) => cols || 4}, minmax(0, 1fr));
    gap: 8px;
    padding: 0 12px 12px;

    @media screen and (min-width: 600px){
        grid-template-columns: repeat(${({wideCols, cols}) => wideCols || cols || 5}, minmax(0, 1fr));
    }
`;

export const Tile = styled.button`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 66px;
    padding: 8px 4px;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    border: 1.5px ${({taken}) => (taken ? 'solid var(--emerald-200)' : 'dashed #c9bfa9')};
    background: ${({taken}) => (taken ? 'var(--emerald-50)' : 'var(--surface)')};
    color: var(--ink);
    box-shadow: ${({mine}) => (mine ? '0 0 0 2.5px var(--gold-500)' : 'none')};
    outline: ${({highlight}) => (highlight ? '3px solid var(--emerald-500)' : 'none')};
    outline-offset: 2px;

    ${({read}) => read && `
        background: var(--emerald-700);
        border: 1.5px solid var(--emerald-700);
        color: #fff;
        span{ color: rgba(255,255,255,0.85) !important; }
    `}

    strong{
        font-size: 1.05rem;
        font-weight: 800;
        line-height: 1.15;
    }

    span{
        max-width: 100%;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

/* ---------- Sûre listesi ---------- */

export const Row = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 64px;
    padding: 10px 14px;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: ${({mine}) => (mine ? 'var(--gold-100)' : 'transparent')};
    color: var(--ink);
    text-align: start;
    cursor: pointer;

    &:last-child{ border-bottom: 0; }
`;

export const RowStatus = styled.span`
    flex-shrink: 0;
    max-width: 40%;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 800;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: ${({taken}) => (taken ? 'var(--emerald-50)' : 'var(--cream)')};
    color: ${({taken}) => (taken ? 'var(--emerald-700)' : 'var(--muted)')};
    border: 1px ${({taken}) => (taken ? 'solid var(--emerald-200)' : 'dashed #c9bfa9')};
`;

export const ListCard = styled.div`
    margin-top: 14px;
    border-radius: var(--radius);
    background: var(--surface);
    border: 1px solid var(--line);
    overflow: hidden;
`;

export const Empty = styled.p`
    padding: 24px;
    text-align: center;
    color: var(--muted);
`;

/* ---------- Alttan açılan pencereler ---------- */

export const Sheet = styled.div`
    ${sheet};
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const SheetClose = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 2;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: var(--sand);
    color: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

export const SheetTitle = styled.h3`
    padding: 4px 48px 0;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 800;
`;

export const SheetSub = styled.p`
    margin-top: -8px;
    text-align: center;
    color: var(--muted);
    font-weight: 700;
`;

export const InfoBox = styled.p`
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--emerald-50);
    color: var(--emerald-900);
    font-size: 0.95rem;
    line-height: 1.5;
`;

export const NameInput = styled.input`
    ${field};
    font-size: 1.1rem;
`;

export const ActionButton = styled.button`
    ${primaryButton};
`;

export const GhostButton = styled.button`
    ${primaryButton};
    background: var(--surface);
    color: ${({danger}) => (danger ? 'var(--danger)' : 'var(--emerald-700)')};
    border: 1.5px solid ${({danger}) => (danger ? 'var(--danger)' : 'var(--emerald-600)')};
    box-shadow: none;

    &:hover{
        background: ${({danger}) => (danger ? 'var(--danger-soft)' : 'var(--emerald-50)')};
        color: ${({danger}) => (danger ? 'var(--danger)' : 'var(--emerald-700)')};
    }
`;

export const ErrorText = styled.p`
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--danger-soft);
    color: var(--danger);
    font-weight: 700;
`;

/* ---------- Çizelge ---------- */

export const ChartProgress = styled.p`
    text-align: center;
    font-weight: 800;
    color: var(--emerald-700);
`;

export const MonthTitle = styled.h4`
    position: sticky;
    top: -28px;
    z-index: 1;
    margin: 6px -4px 0;
    padding: 8px 4px;
    background: var(--surface);
    font-size: 1rem;
    font-weight: 800;
    color: var(--gold-600);
`;

export const DayRow = styled.label`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    cursor: pointer;
    background: ${({today}) => (today ? 'var(--gold-100)' : 'transparent')};
    border: 1.5px solid ${({today}) => (today ? 'var(--gold-500)' : 'transparent')};
    opacity: ${({done}) => (done ? 0.6 : 1)};

    input{
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        accent-color: var(--emerald-600);
    }
`;

export const DayInfo = styled.span`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    small{
        color: var(--muted);
        font-weight: 700;
    }

    strong{
        font-weight: 800;
        text-decoration: ${({done}) => (done ? 'line-through' : 'none')};
    }
`;
