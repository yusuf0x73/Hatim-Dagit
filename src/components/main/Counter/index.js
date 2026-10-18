





import { useRef, useState } from 'react';
import { createStyles, NumberInput, NumberInputHandlers, ActionIcon } from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 52,
    padding: `6px ${theme.spacing.xs}px`,
    borderRadius: 12,
    border: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,

    '&:focus-within': {
      borderColor: theme.colors[theme.primaryColor][6],
    },
  },

  control: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    border: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]}`,

    '&:disabled': {
      borderColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3],
      opacity: 0.8,
      backgroundColor: 'transparent',
    },
  },

  input: {
    textAlign: 'center',
    paddingRight: `${theme.spacing.sm}px !important`,
    paddingLeft: `${theme.spacing.sm}px !important`,
    height: 36,
    fontSize: 18,
    fontWeight: 800,
    flex: 1,
  },
}));

export default function QuantityInput({ min = 1, max = 100, hatimCount, setHatimCount }) {
  const { classes } = useStyles();
  const handlers = useRef(null);

  return (
    <div className={classes.wrapper}>
      <ActionIcon
        size={38}
        variant="transparent"
        aria-label="-1"
        data-counter="minus"
        onClick={() => handlers.current?.decrement()}
        disabled={hatimCount === min}
        className={classes.control}
        onMouseDown={(event) => event.preventDefault()}
      >
        <IconMinus size={20} stroke={2} />
      </ActionIcon>

      <NumberInput
        variant="unstyled"
        min={min}
        max={max}
        handlersRef={handlers}
        value={hatimCount}
        onChange={setHatimCount}
        classNames={{ input: classes.input }}
      />

      <ActionIcon
        size={38}
        variant="transparent"
        aria-label="+1"
        data-counter="plus"
        onClick={() => handlers.current?.increment()}
        disabled={hatimCount === max}
        className={classes.control}
        onMouseDown={(event) => event.preventDefault()}
      >
        <IconPlus size={20} stroke={2} />
      </ActionIcon>
    </div>
  );
}