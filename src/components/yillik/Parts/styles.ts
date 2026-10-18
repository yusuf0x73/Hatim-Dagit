import styled from "@emotion/styled";
import { ChevronDown, ChevronUp } from "tabler-icons-react";

// "1. hatim" başlık şeridi: hızlı hatim sayfasındakiyle aynı koyu zemin
export const QuestionItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: calc(720px - 32px);
    width: calc(100% - 32px);
    min-height: 60px;
    margin: 20px auto 0;
    padding: 10px 12px 10px 16px;
    border-radius: var(--radius);
    background-color: var(--emerald-800);
    background-image: var(--pattern);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: capitalize;
    box-shadow: var(--shadow);
`

export const HatimIconContainer = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gold-500);
    color: var(--emerald-900);
    cursor: pointer;
`;

export const HatimIconText = styled.div`
    font-size: 0.8rem;
`;

export const HideHatimIcon = styled(ChevronUp)`
    width: 24px;
`;

export const ShowHatimIcon = styled(ChevronDown)`
    width: 24px;
`;

export const HatimContainer = styled.div<{visibility:boolean}>`
    transform-origin: top;
    transform: ${({visibility}) => !visibility ? "scaleY(0)" : "scaleY(1)"};
    height: ${({visibility}) => !visibility ? "0" : "100%"};
    transition: height 0ms 0.4s ease, transform 0.4s 0ms ease;
    overflow: hidden;
`;

export const RespondContainer = styled.div<{visibility:boolean}>`
    visibility: ${({visibility}) => (visibility ? "visible" : "hidden")};
`

export const RespondOuterContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 12px 16px 8px;
`

export const RespondInnerContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    @media screen and (min-width: 480px){
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    @media screen and (min-width: 768px){
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 12px;
    }
`
