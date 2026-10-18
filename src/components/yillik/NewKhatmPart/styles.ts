import styled from "@emotion/styled";
import { Add } from "@styled-icons/ionicons-outline";

export const YeniHatimContainer = styled.div`
    width: 100%;
    max-width: 720px;
    padding: 16px;
`;

export const YeniHatimButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 56px;
    border: 2px dashed var(--emerald-500);
    border-radius: var(--radius);
    background: transparent;
    color: var(--emerald-700);
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
`;

export const YeniHatimText = styled.span``;

export const YeniHatimIcon = styled(Add)`
    width: 26px;
`;
